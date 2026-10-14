var NF = {
  SHEETS: { CONFIG: 'Configuration', USERS: 'Users', CUSTOMERS: 'Customers', CAMPAIGNS: 'Campaigns', WORK: 'WorkItems', INTERACTIONS: 'Interactions', FOLLOW_UPS: 'FollowUps', REACTIVATIONS: 'Reactivations', NOTIFICATIONS: 'Notifications', AUDIT: 'AuditLog', LOOKUPS: 'Lookups', LEADERSHIP_CHAT: 'LeadershipChat' },
  ROLES: ['AGENT', 'TEAM_LEAD', 'EXECUTIVE', 'ADMIN'],
  SESSION_TTL: 1800,
  MAX_NOTE_LENGTH: 2000
};

function nfSuccess(data) { return { ok: true, data: data == null ? {} : data }; }
function nfFailure(message, code) { return { ok: false, error: { code: code || 'REQUEST_FAILED', message: message } }; }
function nfId(prefix) { return prefix + '-' + Utilities.getUuid().split('-')[0].toUpperCase(); }
function nfSheet(name) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) throw new Error('Missing required sheet: ' + name);
  return sheet;
}
function nfHeaders(sheet) {
  var headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getDisplayValues()[0];
  return headers.reduce(function (map, header, index) { map[String(header).trim()] = index; return map; }, {});
}
function nfRows(sheet) {
  if (sheet.getLastRow() < 2) return [];
  var headers = nfHeaders(sheet), values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return values.map(function (row, offset) {
    var item = { _row: offset + 2 };
    Object.keys(headers).forEach(function (key) { item[key] = row[headers[key]]; });
    return item;
  });
}
function nfFind(sheetName, column, value) {
  var target = String(value == null ? '' : value).trim().toLowerCase();
  return nfRows(nfSheet(sheetName)).filter(function (r) { return String(r[column] == null ? '' : r[column]).trim().toLowerCase() === target; })[0] || null;
}
function nfAppend(sheetName, object) {
  var sheet = nfSheet(sheetName), headers = nfHeaders(sheet);
  sheet.appendRow(Object.keys(headers).map(function (header) { return Object.prototype.hasOwnProperty.call(object, header) ? object[header] : ''; }));
  return sheet.getLastRow();
}
function nfPatch(sheetName, rowNumber, object) {
  var sheet = nfSheet(sheetName), headers = nfHeaders(sheet);
  Object.keys(object).forEach(function (key) { if (headers[key] !== undefined) sheet.getRange(rowNumber, headers[key] + 1).setValue(object[key]); });
}
function nfCleanText(value, maxLength) {
  return String(value == null ? '' : value).replace(/[<>]/g, '').replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, maxLength || 255);
}
function nfHash(value) { return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)); }
function nfAudit(actorId, action, entityType, entityId, metadata) {
  nfAppend(NF.SHEETS.AUDIT, { 'Audit ID': nfId('AUD'), 'Timestamp': new Date(), 'Actor ID': actorId || 'SYSTEM', 'Action': action, 'Entity Type': entityType, 'Entity ID': entityId || '', 'Metadata': JSON.stringify(metadata || {}) });
}
function nfWithLock(work) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('The service is busy. Please retry.');
  try { return work(); } finally { lock.releaseLock(); }
}
function nfRoleAllows(role, allowed) { return allowed.indexOf(String(role || '').toUpperCase()) !== -1; }

