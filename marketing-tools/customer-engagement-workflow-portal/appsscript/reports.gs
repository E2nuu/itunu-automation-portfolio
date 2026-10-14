/* Read-model services for role-specific operational reporting. */
function nfDate_(value) {
  if (!value) return null;
  var date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date;
}
function nfDateKey_(value) {
  var date = nfDate_(value);
  return date ? Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '';
}
function nfInRange_(value, filters) {
  var date = nfDate_(value); filters = filters || {};
  if (!date) return !filters.startDate && !filters.endDate;
  if (filters.startDate && date < new Date(filters.startDate + 'T00:00:00')) return false;
  if (filters.endDate && date > new Date(filters.endDate + 'T23:59:59')) return false;
  return true;
}
function nfMapBy_(rows, key) { return rows.reduce(function (out, row) { out[String(row[key])] = row; return out; }, {}); }
function nfCanSeeAll_(role) { return nfRoleAllows(role, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']); }

function getFollowUpWorkspace(token, filters) {
  try {
    var user = nfRequire(token), now = new Date(), work = nfMapBy_(nfRows(nfSheet(NF.SHEETS.WORK)), 'Work Item ID'), customers = nfMapBy_(nfRows(nfSheet(NF.SHEETS.CUSTOMERS)), 'Customer ID');
    var followUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (f) {
      return String(f.Status) === 'OPEN' && (nfCanSeeAll_(user.role) || String(f['Owner ID']) === user.id) && (!filters || !filters.campaignId || (work[String(f['Work Item ID'])] || {})['Campaign ID'] === filters.campaignId);
    }).map(function (f) {
      var customer = customers[String(f['Customer ID'])] || {}, due = nfDate_(f['Due At']);
      return { id: f['Follow-up ID'], workItemId: f['Work Item ID'], ownerId: f['Owner ID'], dueAt: f['Due At'], reason: f.Reason, status: due && due < now ? 'OVERDUE' : 'DUE', customer: { id: customer['Customer ID'], name: NexaFlowRules.displayName(customer['Display Name']), phone: customer.Phone, locale: customer.Locale } };
    }).sort(function (a, b) { return new Date(a.dueAt) - new Date(b.dueAt); });
    return nfSuccess({ overdue: followUps.filter(function (f) { return f.status === 'OVERDUE'; }).length, dueToday: followUps.filter(function (f) { return nfDateKey_(f.dueAt) === nfDateKey_(now); }).length, followUps: followUps });
  } catch (error) { return nfFailure(error.message, 'FOLLOW_UPS'); }
}

function getCampaignPerformance(token, filters) {
  try {
    var user = nfRequire(token), work = nfRows(nfSheet(NF.SHEETS.WORK)), campaigns = nfMapBy_(nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)), 'Campaign ID');
    var selected = (filters && filters.campaignId) || '', itemMap = nfMapBy_(work, 'Work Item ID');
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (i) {
      var item = itemMap[String(i['Work Item ID'])] || {};
      return (!selected || item['Campaign ID'] === selected) && (nfCanSeeAll_(user.role) || String(i['Agent ID']) === user.id) && nfInRange_(i['Occurred At'], filters);
    });
    var verified = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (r) { return String(r.Status) === 'VERIFIED' && nfInRange_(r['Verified At'], filters); });
    var rows = Object.keys(campaigns).filter(function (id) { return !selected || id === selected; }).map(function (id) {
      var assigned = work.filter(function (w) { return w['Campaign ID'] === id; });
      var calls = interactions.filter(function (i) { return (itemMap[String(i['Work Item ID'])] || {})['Campaign ID'] === id; });
      var customers = assigned.reduce(function (m, w) { m[String(w['Customer ID'])] = true; return m; }, {});
      var reactivated = verified.filter(function (r) { return customers[String(r['Customer ID'])]; });
      var answered = calls.filter(function (i) { return i.Outcome === 'ANSWERED'; }).length;
      return { campaignId: id, campaign: campaigns[id].Name, assigned: assigned.length, calls: calls.length, answered: answered, answerRate: calls.length ? answered / calls.length : 0, verified: reactivated.length, value: reactivated.reduce(function (sum, r) { return sum + (Number(r.Value) || 0); }, 0), completionRate: assigned.length ? assigned.filter(function (w) { return w.Status === 'CLOSED'; }).length / assigned.length : 0 };
    });
    return nfSuccess({ campaigns: rows, filter: { campaignId: selected || 'ALL', startDate: (filters || {}).startDate || '', endDate: (filters || {}).endDate || '' } });
  } catch (error) { return nfFailure(error.message, 'CAMPAIGN_REPORT'); }
}

function getTeamPerformance(token, filters) {
  try {
    var user = nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']), users = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (u) { return ['AGENT', 'TEAM_LEAD'].indexOf(String(u.Role)) !== -1 && String(u.Status) === 'ACTIVE'; });
    var work = nfRows(nfSheet(NF.SHEETS.WORK)), interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (i) { return nfInRange_(i['Occurred At'], filters); }), reactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (r) { return String(r.Status) === 'VERIFIED' && nfInRange_(r['Verified At'], filters); });
    var scores = nfRows(nfSheet(NF.SHEETS.CONFIG)).reduce(function (m, r) { m[r.Key] = r.Value; return m; }, {});
    return nfSuccess(users.map(function (u) {
      var mine = interactions.filter(function (i) { return String(i['Agent ID']) === String(u['User ID']); });
      var answered = mine.filter(function (i) { return i.Outcome === 'ANSWERED'; }).length, verified = reactivations.filter(function (r) { return String(r['Attributed Agent ID']) === String(u['User ID']); });
      var metrics = { calls: mine.length, answered: answered, verified: verified.length };
      return { userId: u['User ID'], name: NexaFlowRules.displayName(u['Display Name']), team: u.Team, openWork: work.filter(function (w) { return w['Assigned User ID'] === u['User ID'] && w.Status !== 'CLOSED'; }).length, calls: metrics.calls, answered: answered, answerRate: metrics.calls ? answered / metrics.calls : 0, verified: verified.length, verifiedValue: verified.reduce(function (sum, r) { return sum + (Number(r.Value) || 0); }, 0), score: NexaFlowRules.score(metrics, scores) };
    }).sort(function (a, b) { return b.score - a.score || b.verified - a.verified; }));
  } catch (error) { return nfFailure(error.message, 'TEAM_PERFORMANCE'); }
}

function getExecutiveReport(token, filters) {
  try {
    nfRequire(token, ['EXECUTIVE', 'ADMIN']); filters = filters || {};
    var work = nfRows(nfSheet(NF.SHEETS.WORK)), workById = nfMapBy_(work, 'Work Item ID'), customers = nfMapBy_(nfRows(nfSheet(NF.SHEETS.CUSTOMERS)), 'Customer ID');
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (i) { return (!filters.campaignId || (workById[String(i['Work Item ID'])] || {})['Campaign ID'] === filters.campaignId) && nfInRange_(i['Occurred At'], filters); });
    var verified = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (r) { return String(r.Status) === 'VERIFIED' && nfInRange_(r['Verified At'], filters); });
    var outcomeCounts = interactions.reduce(function (m, i) { var k = String(i.Outcome || 'UNSPECIFIED'); m[k] = (m[k] || 0) + 1; return m; }, {});
    var statusCounts = work.reduce(function (m, w) { var k = String(w.Status || 'UNSPECIFIED'); m[k] = (m[k] || 0) + 1; return m; }, {});
    var localeCounts = work.reduce(function (m, w) { var c = customers[String(w['Customer ID'])] || {}; var k = String(c.Locale || 'Unspecified'); m[k] = (m[k] || 0) + 1; return m; }, {});
    var cohortCounts = verified.reduce(function (m, r) { var c = customers[String(r['Customer ID'])] || {}, key = nfDateKey_(c['Created At']).slice(0, 7) || 'Unknown'; m[key] = (m[key] || 0) + 1; return m; }, {});
    var trend = interactions.reduce(function (m, i) { var key = nfDateKey_(i['Occurred At']); if (key) m[key] = (m[key] || 0) + 1; return m; }, {});
    function pairs(map, label) { return Object.keys(map).map(function (key) { var o = {}; o[label] = key; o.count = map[key]; return o; }).sort(function (a, b) { return b.count - a.count; }); }
    return nfSuccess({ lifecycle: pairs(statusCounts, 'status'), outcomes: pairs(outcomeCounts, 'outcome'), locales: pairs(localeCounts, 'locale'), cohorts: pairs(cohortCounts, 'cohort'), activityTrend: Object.keys(trend).sort().map(function (date) { return { date: date, calls: trend[date] }; }), verifiedValue: verified.reduce(function (sum, r) { return sum + (Number(r.Value) || 0); }, 0), verified: verified.length });
  } catch (error) { return nfFailure(error.message, 'EXECUTIVE_REPORT'); }
}

