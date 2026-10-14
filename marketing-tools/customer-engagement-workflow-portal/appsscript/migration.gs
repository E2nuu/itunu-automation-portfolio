/*
 * Safe, idempotent schema upgrades for a workbook created by an earlier
 * NexaFlow setup version. This routine never clears a sheet or replaces data.
 * Run it only after the completed rebuild has been copied to Apps Script.
 */

function nfEnsureColumns_(sheetName, columns) {
  var sheet = nfSheet(sheetName);
  var headers = nfHeaders(sheet);
  var missing = columns.filter(function (column) { return headers[column] === undefined; });
  if (!missing.length) return [];

  var start = sheet.getLastColumn() + 1;
  sheet.getRange(1, start, 1, missing.length)
    .setValues([missing])
    .setFontWeight('bold')
    .setBackground('#17324d')
    .setFontColor('#ffffff');
  return missing;
}

function nfEnsureSheet_(sheetName, columns) {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold').setBackground('#6d28d9').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, columns.length);
    return columns.slice();
  }
  return nfEnsureColumns_(sheetName, columns);
}

function nfSetBlankDefaults_(sheetName, valuesByColumn) {
  var sheet = nfSheet(sheetName);
  if (sheet.getLastRow() < 2) return 0;
  var headers = nfHeaders(sheet);
  var rows = sheet.getLastRow() - 1;
  var updated = 0;

  Object.keys(valuesByColumn).forEach(function (column) {
    if (headers[column] === undefined) return;
    var range = sheet.getRange(2, headers[column] + 1, rows, 1);
    var values = range.getValues();
    var changed = false;
    values.forEach(function (row) {
      if (row[0] === '' || row[0] === null) {
        row[0] = valuesByColumn[column];
        changed = true;
        updated++;
      }
    });
    if (changed) range.setValues(values);
  });
  return updated;
}

function nfDefaultCustomerContext_(locale) {
  var source = String(locale || '').toLowerCase();
  if (source.indexOf('en-gb') === 0) return { country: 'United Kingdom', timeZone: 'Europe/London' };
  if (source.indexOf('en-au') === 0) return { country: 'Australia', timeZone: 'Australia/Sydney' };
  if (source.indexOf('pt-br') === 0) return { country: 'Brazil', timeZone: 'America/Sao_Paulo' };
  if (source.indexOf('ko-kr') === 0) return { country: 'South Korea', timeZone: 'Asia/Seoul' };
  return { country: 'United States', timeZone: 'America/New_York' };
}

function nfPopulateCustomerContext_() {
  var sheet = nfSheet(NF.SHEETS.CUSTOMERS);
  if (sheet.getLastRow() < 2) return 0;
  var headers = nfHeaders(sheet);
  var required = ['Country', 'Time Zone', 'Tags', 'Preferred Contact Window'];
  if (required.some(function (column) { return headers[column] === undefined; })) return 0;

  var rows = nfRows(sheet);
  var changes = 0;
  rows.forEach(function (customer) {
    var context = nfDefaultCustomerContext_(customer.Locale);
    var patch = {};
    if (!customer.Country) patch.Country = context.country;
    if (!customer['Time Zone']) patch['Time Zone'] = context.timeZone;
    if (!customer.Tags) patch.Tags = String(customer.Status) === 'ACTIVE' ? 'active account' : 're-engagement';
    if (!customer['Preferred Contact Window']) patch['Preferred Contact Window'] = '09:00–17:00 local time';
    if (Object.keys(patch).length) {
      nfPatch(NF.SHEETS.CUSTOMERS, customer._row, patch);
      changes++;
    }
  });
  return changes;
}

/** Fills the visible credential only for the fictitious .example demo users. */
function nfPopulateVisibleDemoPasswords_() {
  var sheet = nfSheet(NF.SHEETS.USERS);
  var headers = nfHeaders(sheet);
  if (headers.Email === undefined || headers['Demo Password'] === undefined || headers['Password Salt'] === undefined || headers['Password Hash'] === undefined || sheet.getLastRow() < 2) return 0;
  var rows = nfRows(sheet), updated = 0;
  rows.forEach(function (user) {
    var isDemoUser = /^(agent|lead|executive|admin)@nexaflow\.example$/i.test(String(user.Email || ''));
    var passwordMatchesHash = nfHash('ChangeMe!2027' + String(user['Password Salt'] || '')) === String(user['Password Hash'] || '');
    if (isDemoUser && passwordMatchesHash && user['Demo Password'] !== 'ChangeMe!2027') {
      nfPatch(NF.SHEETS.USERS, user._row, { 'Demo Password': 'ChangeMe!2027' });
      updated++;
    }
  });
  return updated;
}

function upgradeNexaFlowWorkspace() {
  var actor = 'SYSTEM';
  try {
    return nfWithLock(function () {
      var changes = {};
      changes.leadershipChat = nfEnsureSheet_(NF.SHEETS.LEADERSHIP_CHAT, ['Message ID', 'Timestamp', 'Author ID', 'Author Name', 'Message', 'Channel']);
      changes.userColumns = nfEnsureColumns_(NF.SHEETS.USERS, ['Demo Password']);
      changes.customerColumns = nfEnsureColumns_(NF.SHEETS.CUSTOMERS, [
        'Country',
        'Time Zone',
        'Tags',
        'Preferred Contact Window'
      ]);
      changes.workColumns = nfEnsureColumns_(NF.SHEETS.WORK, [
        'Queue Segment',
        'Claim Count'
      ]);
      changes.followUpColumns = nfEnsureColumns_(NF.SHEETS.FOLLOW_UPS, [
        'Completed At',
        'Cancelled By'
      ]);
      changes.interactionColumns = nfEnsureColumns_(NF.SHEETS.INTERACTIONS, [
        'Recorded Via'
      ]);
      changes.auditColumns = nfEnsureColumns_(NF.SHEETS.AUDIT, [
        'Correlation ID'
      ]);

      changes.defaultValues = nfSetBlankDefaults_(NF.SHEETS.WORK, {
        'Queue Segment': 'GENERAL',
        'Claim Count': 0
      });
      changes.contextUpdated = nfPopulateCustomerContext_();
      changes.visibleDemoPasswords = nfPopulateVisibleDemoPasswords_();
      seedNexaFlowLeadershipChat_();
      nfPortalAudit_(actor, 'WORKSPACE_UPGRADED', 'Workspace', '', changes);
      return nfSuccess(changes);
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORKSPACE_UPGRADE', 'The workspace upgrade could not be completed.');
  }
}
