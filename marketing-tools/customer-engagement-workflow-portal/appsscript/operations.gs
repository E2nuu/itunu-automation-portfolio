/* Deeper operational, reporting, and administration services. */
function nfPeriodSeries_(rows, field, days) {
  var now = new Date(), byDay = {}, output = [];
  for (var offset = days - 1; offset >= 0; offset--) {
    var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    var key = Utilities.formatDate(day, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    byDay[key] = 0;
    output.push({ date: key, value: 0 });
  }
  rows.forEach(function (row) {
    var raw = row[field], date = raw instanceof Date ? raw : new Date(raw);
    if (!isNaN(date.getTime())) {
      var key = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      if (Object.prototype.hasOwnProperty.call(byDay, key)) byDay[key]++;
    }
  });
  return output.map(function (point) { return { date: point.date, value: byDay[point.date] }; });
}

function getAgentProgress(token, filters) {
  try {
    var user = nfRequire(token), settings = nfRows(nfSheet(NF.SHEETS.CONFIG)).reduce(function (map, row) { map[row.Key] = row.Value; return map; }, {});
    var allInteractions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (row) { return String(row['Agent ID']) === user.id && nfInRange_(row['Occurred At'], filters || {}); });
    var allReactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (row) { return String(row['Attributed Agent ID']) === user.id && String(row.Status) === 'VERIFIED' && nfInRange_(row['Verified At'], filters || {}); });
    var outcomes = allInteractions.reduce(function (map, row) { var key = String(row.Outcome || 'UNSPECIFIED'); map[key] = (map[key] || 0) + 1; return map; }, {});
    var answered = outcomes.ANSWERED || 0, verifiedValue = allReactivations.reduce(function (sum, row) { return sum + (Number(row.Value) || 0); }, 0);
    var followUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (row) { return String(row['Owner ID']) === user.id && String(row.Status) === 'OPEN'; });
    return nfSuccess({
      target: Number(settings.dailyCallTarget) || 0,
      interactions: allInteractions.length,
      answered: answered,
      answerRate: allInteractions.length ? answered / allInteractions.length : 0,
      verified: allReactivations.length,
      verifiedValue: verifiedValue,
      openFollowUps: followUps.length,
      outcomes: Object.keys(outcomes).map(function (key) { return { label: key, count: outcomes[key] }; }).sort(function (a, b) { return b.count - a.count; }),
      interactionTrend: nfPeriodSeries_(allInteractions, 'Occurred At', 14),
      verificationTrend: nfPeriodSeries_(allReactivations, 'Verified At', 14),
      recentVerifications: allReactivations.sort(function (a, b) { return new Date(b['Verified At']) - new Date(a['Verified At']); }).slice(0, 8)
    });
  } catch (error) { return nfFailure(error.message, 'AGENT_PROGRESS'); }
}

function getCampaignExplorer(token, filters) {
  try {
    var user = nfRequire(token), scopeAll = nfCanSeeAll_(user.role), options = filters || {};
    var work = nfRows(nfSheet(NF.SHEETS.WORK)), byWork = nfMapBy_(work, 'Work Item ID'), campaigns = nfMapBy_(nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)), 'Campaign ID');
    var customers = nfMapBy_(nfRows(nfSheet(NF.SHEETS.CUSTOMERS)), 'Customer ID');
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (row) {
      var workItem = byWork[String(row['Work Item ID'])] || {};
      return (scopeAll || String(row['Agent ID']) === user.id) && (!options.campaignId || workItem['Campaign ID'] === options.campaignId) && (!options.outcome || row.Outcome === options.outcome) && nfInRange_(row['Occurred At'], options);
    });
    return nfSuccess(interactions.sort(function (a, b) { return new Date(b['Occurred At']) - new Date(a['Occurred At']); }).slice(0, 250).map(function (row) {
      var workItem = byWork[String(row['Work Item ID'])] || {}, customer = customers[String(row['Customer ID'])] || {}, campaign = campaigns[String(workItem['Campaign ID'])] || {};
      return { interactionId: row['Interaction ID'], occurredAt: row['Occurred At'], campaign: campaign.Name || 'Unmapped campaign', customerId: customer['Customer ID'], customer: NexaFlowRules.displayName(customer['Display Name']), locale: customer.Locale || '', agentId: row['Agent ID'], outcome: row.Outcome, durationSeconds: Number(row['Duration Seconds']) || 0, followUpAt: row['Follow-up At'] || '', notes: row.Notes || '' };
    }));
  } catch (error) { return nfFailure(error.message, 'CAMPAIGN_EXPLORER'); }
}

function getExecutiveInsights(token, filters) {
  try {
    nfRequire(token, ['EXECUTIVE', 'ADMIN']); var options = filters || {};
    var work = nfRows(nfSheet(NF.SHEETS.WORK)), byWork = nfMapBy_(work, 'Work Item ID');
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (row) {
      return (!options.campaignId || (byWork[String(row['Work Item ID'])] || {})['Campaign ID'] === options.campaignId) && nfInRange_(row['Occurred At'], options);
    });
    var notesByOutcome = {};
    interactions.forEach(function (row) {
      var bucket = String(row.Outcome || 'UNSPECIFIED');
      if (!notesByOutcome[bucket]) notesByOutcome[bucket] = [];
      var note = nfCleanText(row.Notes, 280);
      if (note && notesByOutcome[bucket].indexOf(note) === -1 && notesByOutcome[bucket].length < 5) notesByOutcome[bucket].push(note);
    });
    var followUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (row) { return String(row.Status) === 'OPEN'; });
    var now = new Date(), overdue = followUps.filter(function (row) { return new Date(row['Due At']) < now; });
    return nfSuccess({
      operationalAlerts: [
        { label: 'Overdue follow-ups', value: overdue.length, severity: overdue.length ? 'attention' : 'normal' },
        { label: 'Open follow-ups', value: followUps.length, severity: followUps.length ? 'normal' : 'attention' },
        { label: 'Interactions in selected period', value: interactions.length, severity: 'normal' }
      ],
      feedbackByOutcome: Object.keys(notesByOutcome).map(function (outcome) { return { outcome: outcome, notes: notesByOutcome[outcome] }; }),
      activityTrend: nfPeriodSeries_(interactions, 'Occurred At', 30)
    });
  } catch (error) { return nfFailure(error.message, 'EXECUTIVE_INSIGHTS'); }
}

function getAdministrationWorkspace(token) {
  try {
    nfRequire(token, ['ADMIN']);
    var users = nfRows(nfSheet(NF.SHEETS.USERS)).map(function (row) { return { id: row['User ID'], name: NexaFlowRules.displayName(row['Display Name']), email: row.Email, role: row.Role, team: row.Team, status: row.Status }; });
    var campaigns = nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)).map(function (row) { return { id: row['Campaign ID'], name: row.Name, status: row.Status, priority: row.Priority, startDate: row['Start Date'], endDate: row['End Date'] }; });
    var audit = nfRows(nfSheet(NF.SHEETS.AUDIT)).sort(function (a, b) { return new Date(b.Timestamp) - new Date(a.Timestamp); }).slice(0, 60).map(function (row) { return { at: row.Timestamp, actor: row['Actor ID'], action: row.Action, entity: row['Entity Type'], entityId: row['Entity ID'] }; });
    return nfSuccess({ users: users, campaigns: campaigns, audit: audit });
  } catch (error) { return nfFailure(error.message, 'ADMIN_WORKSPACE'); }
}

function saveCampaign(token, payload) {
  try { return nfWithLock(function () {
    var user = nfRequire(token, ['ADMIN']), data = payload || {};
    var id = nfCleanText(data.id, 60), name = nfCleanText(data.name, 100), status = nfCleanText(data.status, 20).toUpperCase(), priority = Number(data.priority);
    if (!name || ['ACTIVE', 'PAUSED', 'CLOSED'].indexOf(status) === -1 || !Number.isInteger(priority) || priority < 0 || priority > 1000) return nfFailure('Enter a campaign name, valid status, and priority from 0 to 1000.', 'VALIDATION');
    var now = new Date();
    if (id) {
      var existing = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', id);
      if (!existing) return nfFailure('Campaign not found.', 'NOT_FOUND');
      nfPatch(NF.SHEETS.CAMPAIGNS, existing._row, { Name: name, Status: status, Priority: priority, 'Start Date': data.startDate || '', 'End Date': data.endDate || '' });
    } else {
      id = nfId('CAM');
      nfAppend(NF.SHEETS.CAMPAIGNS, { 'Campaign ID': id, Name: name, Status: status, Priority: priority, 'Start Date': data.startDate || now, 'End Date': data.endDate || '' });
    }
    nfAudit(user.id, 'CAMPAIGN_SAVED', 'Campaign', id, { status: status, priority: priority });
    return nfSuccess({ id: id });
  }); } catch (error) { return nfFailure(error.message, 'CAMPAIGN_SAVE'); }
}

