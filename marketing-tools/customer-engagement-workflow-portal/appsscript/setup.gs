/** Creates the complete synthetic database in a blank Google Sheet. Run once. */
function setupNexaFlowSyntheticDatabase() {
  var ss = SpreadsheetApp.getActive();
  var schema = {
    Configuration: ['Key', 'Value', 'Visibility', 'Updated At'],
    Users: ['User ID', 'Display Name', 'Email', 'Role', 'Team', 'Status', 'Demo Password', 'Password Salt', 'Password Hash'],
    Customers: ['Customer ID', 'Display Name', 'Phone', 'Locale', 'Status', 'Contact Consent', 'Created At', 'Country', 'Time Zone', 'Tags', 'Preferred Contact Window'],
    Campaigns: ['Campaign ID', 'Name', 'Status', 'Priority', 'Start Date', 'End Date'],
    WorkItems: ['Work Item ID', 'Campaign ID', 'Customer ID', 'Assigned User ID', 'Status', 'Priority', 'Next Action At', 'Locked By', 'Lock Expires At', 'Updated At', 'Queue Segment', 'Claim Count'],
    Interactions: ['Interaction ID', 'Request ID', 'Work Item ID', 'Customer ID', 'Agent ID', 'Occurred At', 'Outcome', 'Duration Seconds', 'Notes', 'Follow-up At', 'Opt-out Reason', 'Recorded Via'],
    FollowUps: ['Follow-up ID', 'Work Item ID', 'Customer ID', 'Owner ID', 'Due At', 'Reason', 'Status', 'Created At', 'Completed At', 'Cancelled By'],
    Reactivations: ['Reactivation ID', 'Customer ID', 'Attributed Agent ID', 'Status', 'Verified At', 'Verified By', 'Value', 'Currency'],
    Notifications: ['Notification ID', 'Recipient ID', 'Type', 'Message', 'Read At', 'Created At'],
    AuditLog: ['Audit ID', 'Timestamp', 'Actor ID', 'Action', 'Entity Type', 'Entity ID', 'Metadata', 'Correlation ID'],
    LeadershipChat: ['Message ID', 'Timestamp', 'Author ID', 'Author Name', 'Message', 'Channel'],
    Lookups: ['List', 'Value', 'Active']
  };
  Object.keys(schema).forEach(function (name) {
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    sheet.clear(); sheet.getRange(1, 1, 1, schema[name].length).setValues([schema[name]]).setFontWeight('bold').setBackground('#17324d').setFontColor('#ffffff');
    sheet.setFrozenRows(1); sheet.autoResizeColumns(1, schema[name].length);
  });
  var now = new Date(), demoPassword = 'ChangeMe!2027';
  function user(id, name, email, role, team) { var salt = Utilities.getUuid(); return [id, name, email, role, team, 'ACTIVE', demoPassword, salt, nfHash(demoPassword + salt)]; }
  nfSheet('Configuration').getRange(2, 1, 4, 4).setValues([
    ['callPoints', 1, 'ALL', now], ['answerPoints', 2, 'ALL', now], ['verificationPoints', 10, 'ALL', now], ['dailyCallTarget', 25, 'ALL', now]
  ]);
  nfSheet('Users').getRange(2, 1, 4, 9).setValues([
    user('USR-001', 'Avery Chen', 'agent@nexaflow.example', 'AGENT', 'North'), user('USR-002', 'Jordan Okafor', 'lead@nexaflow.example', 'TEAM_LEAD', 'North'), user('USR-003', 'Morgan Patel', 'executive@nexaflow.example', 'EXECUTIVE', 'Operations'), user('USR-004', 'Riley Smith', 'admin@nexaflow.example', 'ADMIN', 'Platform')
  ]);
  nfSheet('Customers').getRange(2, 1, 8, 11).setValues([
    ['CUS-1001', 'Taylor Reed', '+1 555 010 1001', 'en-US', 'INACTIVE', 'YES', now, 'United States', 'America/New_York', 're-engagement; prefers mornings', '09:00–12:00 local time'],
    ['CUS-1002', 'Samira Ali', '+44 20 7946 0102', 'en-GB', 'INACTIVE', 'YES', now, 'United Kingdom', 'Europe/London', 're-engagement; requested callback', '13:00–17:00 local time'],
    ['CUS-1003', 'Noah Brooks', '+1 555 010 1003', 'en-US', 'INACTIVE', 'YES', now, 'United States', 'America/Chicago', 're-engagement', '09:00–17:00 local time'],
    ['CUS-1004', 'Mina Park', '+82 2 555 1004', 'ko-KR', 'INACTIVE', 'YES', now, 'South Korea', 'Asia/Seoul', 're-engagement; multilingual', '10:00–17:00 local time'],
    ['CUS-1005', 'Alex Kim', '+1 555 010 1005', 'en-US', 'ACTIVE', 'YES', now, 'United States', 'America/Los_Angeles', 'active account', '09:00–17:00 local time'],
    ['CUS-1006', 'Inez Silva', '+55 11 5555 1006', 'pt-BR', 'INACTIVE', 'YES', now, 'Brazil', 'America/Sao_Paulo', 're-engagement; Portuguese', '09:00–17:00 local time'],
    ['CUS-1007', 'Robin Lane', '+1 555 010 1007', 'en-US', 'DO_NOT_CONTACT', 'NO', now, 'United States', 'America/New_York', 'do not contact', ''],
    ['CUS-1008', 'Casey Hart', '+61 2 5550 1008', 'en-AU', 'INACTIVE', 'YES', now, 'Australia', 'Australia/Sydney', 're-engagement', '10:00–17:00 local time']
  ]);
  nfSheet('Campaigns').getRange(2, 1, 2, 6).setValues([['CAM-001', 'Dormant account outreach', 'ACTIVE', 100, now, ''], ['CAM-002', 'Welcome-back follow-up', 'ACTIVE', 80, now, '']]);
  nfSheet('WorkItems').getRange(2, 1, 7, 12).setValues([
    ['WRK-001', 'CAM-001', 'CUS-1001', '', 'QUEUED', 100, '', '', '', now, 'GENERAL', 0],
    ['WRK-002', 'CAM-001', 'CUS-1002', '', 'QUEUED', 90, '', '', '', now, 'FOLLOW_UP', 0],
    ['WRK-003', 'CAM-001', 'CUS-1003', '', 'QUEUED', 80, '', '', '', now, 'GENERAL', 0],
    ['WRK-004', 'CAM-002', 'CUS-1004', '', 'QUEUED', 90, '', '', '', now, 'GENERAL', 0],
    ['WRK-005', 'CAM-002', 'CUS-1005', '', 'QUEUED', 50, '', '', '', now, 'ACTIVE_ACCOUNT', 0],
    ['WRK-006', 'CAM-001', 'CUS-1006', '', 'QUEUED', 70, '', '', '', now, 'GENERAL', 0],
    ['WRK-008', 'CAM-002', 'CUS-1008', '', 'QUEUED', 60, '', '', '', now, 'GENERAL', 0]
  ]);
  nfSheet('Lookups').getRange(2, 1, NexaFlowRules.OUTCOMES.length, 3).setValues(NexaFlowRules.OUTCOMES.map(function (o) { return ['Call outcomes', o, 'YES']; }));
  seedNexaFlowDemoActivity_();
  seedNexaFlowLeadershipChat_();
  [NF.SHEETS.WORK, NF.SHEETS.INTERACTIONS, NF.SHEETS.FOLLOW_UPS, NF.SHEETS.REACTIVATIONS].forEach(function (name) { nfSheet(name).getDataRange().createFilter(); });
  SpreadsheetApp.getUi().alert('NexaFlow workspace created successfully.');
}

/** Adds a small, linked fictional activity history for analytics demonstrations. */
function seedNexaFlowDemoActivity_() {
  if (nfSheet('Interactions').getLastRow() > 1) return;
  var now = new Date(), yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000), soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  nfAppend('Interactions', { 'Interaction ID': 'INT-SEED-001', 'Request ID': 'SEED-REQ-001', 'Work Item ID': 'WRK-001', 'Customer ID': 'CUS-1001', 'Agent ID': 'USR-001', 'Occurred At': yesterday, Outcome: 'ANSWERED', 'Duration Seconds': 248, Notes: 'Customer asked for a short account refresher.', 'Follow-up At': '', 'Opt-out Reason': '' });
  nfAppend('Interactions', { 'Interaction ID': 'INT-SEED-002', 'Request ID': 'SEED-REQ-002', 'Work Item ID': 'WRK-002', 'Customer ID': 'CUS-1002', 'Agent ID': 'USR-001', 'Occurred At': now, Outcome: 'CALL_BACK', 'Duration Seconds': 96, Notes: 'Customer requested a later call time.', 'Follow-up At': soon, 'Opt-out Reason': '' });
  nfAppend('Interactions', { 'Interaction ID': 'INT-SEED-003', 'Request ID': 'SEED-REQ-003', 'Work Item ID': 'WRK-003', 'Customer ID': 'CUS-1003', 'Agent ID': 'USR-002', 'Occurred At': yesterday, Outcome: 'NO_ANSWER', 'Duration Seconds': 0, Notes: 'No answer after attempted contact.', 'Follow-up At': '', 'Opt-out Reason': '' });
  nfPatch('WorkItems', nfFind('WorkItems', 'Work Item ID', 'WRK-001')._row, { Status: 'CLOSED', 'Assigned User ID': 'USR-001', 'Updated At': now });
  nfPatch('WorkItems', nfFind('WorkItems', 'Work Item ID', 'WRK-002')._row, { Status: 'FOLLOW_UP', 'Assigned User ID': 'USR-001', 'Next Action At': soon, 'Updated At': now });
  nfPatch('WorkItems', nfFind('WorkItems', 'Work Item ID', 'WRK-003')._row, { 'Assigned User ID': 'USR-002', 'Updated At': now });
  nfAppend('FollowUps', { 'Follow-up ID': 'FUP-SEED-001', 'Work Item ID': 'WRK-002', 'Customer ID': 'CUS-1002', 'Owner ID': 'USR-001', 'Due At': soon, Reason: 'CALL_BACK', Status: 'OPEN', 'Created At': now });
  nfAppend('Reactivations', { 'Reactivation ID': 'REA-SEED-001', 'Customer ID': 'CUS-1001', 'Attributed Agent ID': 'USR-001', Status: 'VERIFIED', 'Verified At': now, 'Verified By': 'USR-002', Value: 19.5, Currency: 'USD' });
  nfAppend('Notifications', { 'Notification ID': 'NOT-SEED-001', 'Recipient ID': 'USR-001', Type: 'REACTIVATION_VERIFIED', Message: 'A completed customer reactivation has been verified.', 'Read At': '', 'Created At': now });
  nfAudit('SYSTEM', 'SYNTHETIC_ACTIVITY_SEEDED', 'Workspace', '', {});
}

/** Adds a short, clearly fictional executive discussion for portfolio review. */
function seedNexaFlowLeadershipChat_() {
  if (nfSheet(NF.SHEETS.LEADERSHIP_CHAT).getLastRow() > 1) return;
  var now = new Date();
  nfAppend(NF.SHEETS.LEADERSHIP_CHAT, { 'Message ID': 'MSG-SEED-001', Timestamp: new Date(now.getTime() - 90 * 60000), 'Author ID': 'USR-003', 'Author Name': 'Morgan Patel', Message: 'Synthetic review: one verified reactivation is ready for the leadership register.', Channel: 'EXECUTIVE' });
  nfAppend(NF.SHEETS.LEADERSHIP_CHAT, { 'Message ID': 'MSG-SEED-002', Timestamp: new Date(now.getTime() - 35 * 60000), 'Author ID': 'USR-003', 'Author Name': 'Morgan Patel', Message: 'Please use the cohort and reactivation views as discussion aids, not automated decision tools.', Channel: 'EXECUTIVE' });
}

/** Adds reporting sample activity to an existing NexaFlow synthetic workbook. */
function seedNexaFlowSampleActivity() {
  seedNexaFlowDemoActivity_();
  SpreadsheetApp.getUi().alert('NexaFlow sample activity is ready.');
}

/**
 * Read-only preflight for the bound spreadsheet. Run from the Apps Script
 * editor before deploying the web app. It never clears, reseeds, or changes
 * any workbook data.
 */
function verifyNexaFlowWorkspace() {
  var expectedHeaders = {
    Configuration: ['Key', 'Value', 'Visibility', 'Updated At'],
    Users: ['User ID', 'Display Name', 'Email', 'Role', 'Team', 'Status', 'Demo Password', 'Password Salt', 'Password Hash'],
    Customers: ['Customer ID', 'Display Name', 'Phone', 'Locale', 'Status', 'Contact Consent', 'Created At', 'Country', 'Time Zone', 'Tags', 'Preferred Contact Window'],
    Campaigns: ['Campaign ID', 'Name', 'Status', 'Priority', 'Start Date', 'End Date'],
    WorkItems: ['Work Item ID', 'Campaign ID', 'Customer ID', 'Assigned User ID', 'Status', 'Priority', 'Next Action At', 'Locked By', 'Lock Expires At', 'Updated At', 'Queue Segment', 'Claim Count'],
    Interactions: ['Interaction ID', 'Request ID', 'Work Item ID', 'Customer ID', 'Agent ID', 'Occurred At', 'Outcome', 'Duration Seconds', 'Notes', 'Follow-up At', 'Opt-out Reason', 'Recorded Via'],
    FollowUps: ['Follow-up ID', 'Work Item ID', 'Customer ID', 'Owner ID', 'Due At', 'Reason', 'Status', 'Created At', 'Completed At', 'Cancelled By'],
    Reactivations: ['Reactivation ID', 'Customer ID', 'Attributed Agent ID', 'Status', 'Verified At', 'Verified By', 'Value', 'Currency'],
    Notifications: ['Notification ID', 'Recipient ID', 'Type', 'Message', 'Read At', 'Created At'],
    AuditLog: ['Audit ID', 'Timestamp', 'Actor ID', 'Action', 'Entity Type', 'Entity ID', 'Metadata', 'Correlation ID'],
    LeadershipChat: ['Message ID', 'Timestamp', 'Author ID', 'Author Name', 'Message', 'Channel'],
    Lookups: ['List', 'Value', 'Active']
  };
  var report = { ok: true, checks: [], recommendation: 'Keep this workbook; no reset is needed.' };
  try {
    var ss = SpreadsheetApp.getActive();
    Object.keys(expectedHeaders).forEach(function (name) {
      var sheet = ss.getSheetByName(name);
      var required = expectedHeaders[name];
      var actual = sheet ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getDisplayValues()[0].map(String) : [];
      var missing = required.filter(function (header) { return actual.indexOf(header) === -1; });
      var passed = !!sheet && !missing.length;
      report.checks.push({ name: name + ' schema', ok: passed, detail: passed ? 'Ready' : (sheet ? 'Missing: ' + missing.join(', ') : 'Sheet is missing') });
      if (!passed) report.ok = false;
    });
    var users = ss.getSheetByName('Users');
    if (users) {
      var headers = users.getRange(1, 1, 1, users.getLastColumn()).getDisplayValues()[0];
      var rows = users.getLastRow() > 1 ? users.getRange(2, 1, users.getLastRow() - 1, users.getLastColumn()).getValues() : [];
      var emailIndex = headers.indexOf('Email'), demoPasswordIndex = headers.indexOf('Demo Password'), saltIndex = headers.indexOf('Password Salt'), hashIndex = headers.indexOf('Password Hash'), statusIndex = headers.indexOf('Status');
      var agent = rows.filter(function (row) { return String(row[emailIndex] || '').toLowerCase() === 'agent@nexaflow.example'; })[0];
      var credentialOk = !!agent && String(agent[statusIndex] || '').toUpperCase() === 'ACTIVE' && nfHash('ChangeMe!2027' + String(agent[saltIndex] || '')) === String(agent[hashIndex] || '');
      report.checks.push({ name: 'Synthetic agent login', ok: credentialOk, detail: credentialOk ? 'agent@nexaflow.example / ChangeMe!2027 is valid' : 'Demo user or password hash does not match' });
      if (!credentialOk) report.ok = false;
      var expectedEmails = ['agent@nexaflow.example', 'lead@nexaflow.example', 'executive@nexaflow.example', 'admin@nexaflow.example'];
      var visibleCredentialsOk = demoPasswordIndex !== -1 && expectedEmails.every(function (email) {
        return rows.some(function (row) { return String(row[emailIndex] || '').toLowerCase() === email && String(row[demoPasswordIndex] || '') === 'ChangeMe!2027'; });
      });
      report.checks.push({ name: 'Visible synthetic demo credentials', ok: visibleCredentialsOk, detail: visibleCredentialsOk ? 'All four .example accounts display ChangeMe!2027' : 'Run the workspace upgrade to add or synchronize the Demo Password column' });
      if (!visibleCredentialsOk) report.ok = false;
    }
  } catch (error) {
    report.ok = false;
    report.checks.push({ name: 'Workbook connection', ok: false, detail: error.message || String(error) });
  }
  if (!report.ok) report.recommendation = 'Do not reset yet. Use the failed check above to repair only the affected workbook component.';
  var message = 'NexaFlow preflight: ' + (report.ok ? 'PASSED' : 'NEEDS ATTENTION') + '\n\n' + report.checks.map(function (check) { return (check.ok ? '✓ ' : '✗ ') + check.name + ': ' + check.detail; }).join('\n') + '\n\n' + report.recommendation;
  Logger.log(message);
  try { SpreadsheetApp.getUi().alert(message); } catch (ignored) {}
  return report;
}

/**
 * Exercises the real portal service chain from the Apps Script editor before
 * a web-app deployment. It uses only the synthetic demo account and records
 * its normal sign-in audit event.
 */
function smokeTestNexaFlowPortal() {
  var email = 'agent@nexaflow.example';
  var password = 'ChangeMe!2027';
  var result = { ok: false, checks: [] };
  try {
    var signedIn = portalDispatch('signIn', [email, password]);
    if (!signedIn || !signedIn.ok || !signedIn.data || !signedIn.data.token) {
      throw new Error((signedIn && signedIn.error && signedIn.error.message) || 'Synthetic sign-in did not return a session.');
    }
    result.checks.push('Sign-in: passed');
    var token = signedIn.data.token;
    var bootstrap = portalDispatch('getBootstrap', [token]);
    if (!bootstrap || !bootstrap.ok || !bootstrap.data || !bootstrap.data.user) throw new Error('Workspace bootstrap did not return the signed-in user.');
    result.checks.push('Session and workspace bootstrap: passed');
    var queue = portalDispatch('getQueueSummary', [token, {}]);
    if (!queue || !queue.ok) throw new Error('Queue read failed.');
    result.checks.push('Workbook queue read: passed');
    var signedOut = portalDispatch('signOut', [token]);
    if (!signedOut || !signedOut.ok) throw new Error('Session sign-out failed.');
    result.checks.push('Sign-out: passed');
    result.ok = true;
  } catch (error) {
    result.error = error.message || String(error);
  }
  var message = 'NexaFlow portal smoke test: ' + (result.ok ? 'PASSED' : 'FAILED') + '\n\n' + result.checks.map(function (check) { return '✓ ' + check; }).join('\n');
  if (!result.ok) message += '\n✗ ' + result.error;
  Logger.log(message);
  try { SpreadsheetApp.getUi().alert(message); } catch (ignored) {}
  return result;
}

/**
 * Verifies every synthetic role account through the same portal gateway used
 * by the browser. This is an authentication test only; it does not alter user
 * rows, password hashes, or workbook records beyond normal sign-in auditing.
 */
function verifyNexaFlowDemoAccounts() {
  var accounts = [
    { email: 'agent@nexaflow.example', role: 'AGENT' },
    { email: 'lead@nexaflow.example', role: 'TEAM_LEAD' },
    { email: 'executive@nexaflow.example', role: 'EXECUTIVE' },
    { email: 'admin@nexaflow.example', role: 'ADMIN' }
  ];
  var password = 'ChangeMe!2027';
  var report = { ok: true, checks: [] };
  accounts.forEach(function (account) {
    try {
      var signedIn = portalDispatch('signIn', [account.email, password]);
      var actualRole = signedIn && signedIn.data && signedIn.data.user && signedIn.data.user.role;
      if (!signedIn || !signedIn.ok || actualRole !== account.role) {
        throw new Error((signedIn && signedIn.error && signedIn.error.message) || 'Expected role ' + account.role + ', received ' + (actualRole || 'no session'));
      }
      var bootstrap = portalDispatch('getBootstrap', [signedIn.data.token]);
      if (!bootstrap || !bootstrap.ok || !bootstrap.data || !bootstrap.data.user) throw new Error('Workspace bootstrap failed.');
      portalDispatch('signOut', [signedIn.data.token]);
      report.checks.push({ email: account.email, role: account.role, ok: true, detail: 'Sign-in and workspace access passed' });
    } catch (error) {
      report.ok = false;
      report.checks.push({ email: account.email, role: account.role, ok: false, detail: error.message || String(error) });
    }
  });
  var message = 'NexaFlow demo-account verification: ' + (report.ok ? 'PASSED' : 'FAILED') + '\n\n' + report.checks.map(function (check) {
    return (check.ok ? '✓ ' : '✗ ') + check.email + ' (' + check.role + '): ' + check.detail;
  }).join('\n');
  Logger.log(message);
  try { SpreadsheetApp.getUi().alert(message); } catch (ignored) {}
  return report;
}

