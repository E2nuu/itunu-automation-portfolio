/*
 * Advanced clean-room analytics read models.
 *
 * These functions explain aggregate operational activity. They do not profile
 * people, infer intent, or make automated decisions about customers or staff.
 */

function nfAnalyticsDateInRange_(value, filters) {
  var date = nfPortalDate_(value);
  filters = filters || {};
  if (!date) return !filters.startDate && !filters.endDate;
  if (filters.startDate && date < new Date(filters.startDate + 'T00:00:00')) return false;
  if (filters.endDate && date > new Date(filters.endDate + 'T23:59:59')) return false;
  return true;
}

function nfAnalyticsCount_(rows, key) {
  return rows.reduce(function (counts, row) {
    var value = String(typeof key === 'function' ? key(row) : row[key] || 'Unspecified');
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function nfAnalyticsPairs_(counts, label) {
  return Object.keys(counts).map(function (key) {
    var output = { count: counts[key] };
    output[label] = key;
    return output;
  }).sort(function (left, right) {
    return right.count - left.count || String(left[label]).localeCompare(String(right[label]));
  });
}

function getCohortAnalysis(token, filters) {
  try {
    nfRequire(token, ['EXECUTIVE', 'ADMIN']);
    filters = filters || {};
    var customers = nfRows(nfSheet(NF.SHEETS.CUSTOMERS));
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var workByCustomer = work.reduce(function (map, item) {
      var id = String(item['Customer ID']);
      if (!map[id]) map[id] = [];
      map[id].push(item);
      return map;
    }, {});
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return nfAnalyticsDateInRange_(interaction['Occurred At'], filters);
    });
    var interactionsByCustomer = interactions.reduce(function (map, interaction) {
      var id = String(interaction['Customer ID']);
      if (!map[id]) map[id] = [];
      map[id].push(interaction);
      return map;
    }, {});
    var verifiedByCustomer = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return String(reactivation.Status) === 'VERIFIED' && nfAnalyticsDateInRange_(reactivation['Verified At'], filters);
    }).reduce(function (map, reactivation) {
      map[String(reactivation['Customer ID'])] = true;
      return map;
    }, {});

    var cohortMap = {};
    customers.forEach(function (customer) {
      var customerId = String(customer['Customer ID']);
      var tags = String(customer.Tags || 'untagged').split(/[;,|]/).map(function (tag) {
        return nfCleanText(tag, 80).toLowerCase();
      }).filter(Boolean);
      if (!tags.length) tags = ['untagged'];
      tags.forEach(function (tag) {
        if (!cohortMap[tag]) cohortMap[tag] = { tag: tag, customers: 0, assigned: 0, contacted: 0, answered: 0, verified: 0 };
        var bucket = cohortMap[tag];
        bucket.customers++;
        bucket.assigned += (workByCustomer[customerId] || []).length;
        var customerInteractions = interactionsByCustomer[customerId] || [];
        if (customerInteractions.length) bucket.contacted++;
        if (customerInteractions.some(function (interaction) { return String(interaction.Outcome) === 'ANSWERED'; })) bucket.answered++;
        if (verifiedByCustomer[customerId]) bucket.verified++;
      });
    });

    var cohorts = Object.keys(cohortMap).map(function (tag) {
      var cohort = cohortMap[tag];
      cohort.answerRate = cohort.contacted ? cohort.answered / cohort.contacted : 0;
      cohort.verificationRate = cohort.answered ? cohort.verified / cohort.answered : 0;
      return cohort;
    }).sort(function (left, right) {
      return right.customers - left.customers || left.tag.localeCompare(right.tag);
    });

    return nfSuccess({
      cohorts: cohorts,
      totals: {
        customers: customers.length,
        contacted: Object.keys(interactionsByCustomer).length,
        verified: Object.keys(verifiedByCustomer).length
      },
      filter: { startDate: filters.startDate || '', endDate: filters.endDate || '' }
    });
  } catch (error) {
    return nfPortalFailure_(error, 'COHORT_ANALYSIS');
  }
}

function getAuditTimeline(token, filters) {
  try {
    nfRequire(token, ['ADMIN']);
    filters = filters || {};
    var limit = Math.max(1, Math.min(250, Number(filters.limit) || 100));
    var action = nfCleanText(filters.action, 80);
    var actor = nfCleanText(filters.actorId, 80);
    var entries = nfRows(nfSheet(NF.SHEETS.AUDIT)).filter(function (entry) {
      return (!action || String(entry.Action) === action) &&
        (!actor || String(entry['Actor ID']) === actor) &&
        nfAnalyticsDateInRange_(entry.Timestamp, filters);
    }).sort(function (left, right) {
      return new Date(right.Timestamp) - new Date(left.Timestamp);
    }).slice(0, limit).map(function (entry) {
      return {
        id: entry['Audit ID'],
        timestamp: entry.Timestamp,
        actorId: entry['Actor ID'],
        action: entry.Action,
        entityType: entry['Entity Type'],
        entityId: entry['Entity ID'],
        metadata: nfCleanText(entry.Metadata, 1000)
      };
    });
    return nfSuccess({ entries: entries, actions: nfAnalyticsPairs_(nfAnalyticsCount_(nfRows(nfSheet(NF.SHEETS.AUDIT)), 'Action'), 'action') });
  } catch (error) {
    return nfPortalFailure_(error, 'AUDIT_TIMELINE');
  }
}

function getExecutiveExport(token, filters) {
  try {
    nfRequire(token, ['EXECUTIVE', 'ADMIN']);
    filters = filters || {};
    var report = getExecutiveReport(token, filters);
    if (!report.ok) return report;
    var rows = [
      ['Section', 'Label', 'Count'],
      ['Summary', 'Verified reactivations', report.data.verified],
      ['Summary', 'Verified value', report.data.verifiedValue]
    ];
    [['Lifecycle', report.data.lifecycle, 'status'], ['Outcome', report.data.outcomes, 'outcome'], ['Locale', report.data.locales, 'locale'], ['Cohort', report.data.cohorts, 'cohort']].forEach(function (section) {
      section[1].forEach(function (row) {
        rows.push([section[0], row[section[2]], row.count]);
      });
    });
    return nfSuccess({ generatedAt: new Date(), rows: rows });
  } catch (error) {
    return nfPortalFailure_(error, 'EXECUTIVE_EXPORT');
  }
}
