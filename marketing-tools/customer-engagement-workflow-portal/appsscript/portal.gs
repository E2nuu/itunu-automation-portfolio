/*
 * NexaFlow application service layer.
 *
 * This clean-room module coordinates authenticated operational workflows.
 * It uses only the synthetic spreadsheet schema. It intentionally has no
 * production contacts, payment actions, external databases, or messaging APIs.
 */

var NF_PORTAL = {
  LOCK_MINUTES: 10,
  LOGIN_ATTEMPT_WINDOW_SECONDS: 300,
  MAX_LOGIN_ATTEMPTS: 6,
  MAX_PAGE_SIZE: 200
};

/* -------------------------------------------------------------------------- */
/* Explicit client gateway                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Routes browser requests through one stable Apps Script entry point.
 *
 * Google Apps Script's browser proxy does not consistently support computed
 * function names.  Keeping this allow-list makes the workbook-backed portal
 * reliable while preventing a browser from invoking arbitrary script helpers.
 */
function portalDispatch(action, args) {
  var handlers = {
    signIn: function () { return signIn.apply(null, arguments); },
    signOut: function () { return signOut.apply(null, arguments); },
    switchDemoPersona: function () { return switchDemoPersona.apply(null, arguments); },
    getExecutiveChat: function () { return getExecutiveChat.apply(null, arguments); },
    postExecutiveChat: function () { return postExecutiveChat.apply(null, arguments); },
    getBootstrap: function () { return getBootstrap.apply(null, arguments); },
    getApplicationHealth: function () { return getApplicationHealth.apply(null, arguments); },
    getQueueSummary: function () { return getQueueSummary.apply(null, arguments); },
    listMyWork: function () { return listMyWork.apply(null, arguments); },
    claimNextWorkItem: function () { return claimNextWorkItem.apply(null, arguments); },
    claimWorkItem: function () { return claimWorkItem.apply(null, arguments); },
    renewWorkLock: function () { return renewWorkLock.apply(null, arguments); },
    releaseWorkItem: function () { return releaseWorkItem.apply(null, arguments); },
    getCustomerProfile: function () { return getCustomerProfile.apply(null, arguments); },
    saveInteraction: function () { return saveInteraction.apply(null, arguments); },
    assignWorkItem: function () { return assignWorkItem.apply(null, arguments); },
    recordReactivationVerification: function () { return recordReactivationVerification.apply(null, arguments); },
    getNotifications: function () { return getNotifications.apply(null, arguments); },
    markNotificationRead: function () { return markNotificationRead.apply(null, arguments); },
    markAllNotificationsRead: function () { return markAllNotificationsRead.apply(null, arguments); },
    getMyDashboard: function () { return getMyDashboard.apply(null, arguments); },
    getTeamOperations: function () { return getTeamOperations.apply(null, arguments); },
    getFollowUpWorkspace: function () { return getFollowUpWorkspace.apply(null, arguments); },
    getCampaignPerformance: function () { return getCampaignPerformance.apply(null, arguments); },
    getCampaignExplorer: function () { return getCampaignExplorer.apply(null, arguments); },
    getExecutiveReport: function () { return getExecutiveReport.apply(null, arguments); },
    getExecutiveExport: function () { return getExecutiveExport.apply(null, arguments); },
    getCohortAnalysis: function () { return getCohortAnalysis.apply(null, arguments); },
    getExecutiveInsights: function () { return getExecutiveInsights.apply(null, arguments); },
    getAdministrationWorkspace: function () { return getAdministrationWorkspace.apply(null, arguments); },
    getAuditTimeline: function () { return getAuditTimeline.apply(null, arguments); },
    saveConfiguration: function () { return saveConfiguration.apply(null, arguments); },
    getCustomerSearchResults: function () { return getCustomerSearchResults.apply(null, arguments); },
    getCustomerTimeline: function () { return getCustomerTimeline.apply(null, arguments); },
    getInteractionDetail: function () { return getInteractionDetail.apply(null, arguments); },
    getCampaignDirectory: function () { return getCampaignDirectory.apply(null, arguments); },
    getUserDirectory: function () { return getUserDirectory.apply(null, arguments); },
    rescheduleFollowUp: function () { return rescheduleFollowUp.apply(null, arguments); },
    completeFollowUp: function () { return completeFollowUp.apply(null, arguments); },
    getQueueAging: function () { return getQueueAging.apply(null, arguments); },
    createCampaign: function () { return createCampaign.apply(null, arguments); },
    updateCampaignLifecycle: function () { return updateCampaignLifecycle.apply(null, arguments); },
    updateUserStatus: function () { return updateUserStatus.apply(null, arguments); },
    getAuditSummary: function () { return getAuditSummary.apply(null, arguments); },
    runSyntheticDataIntegrityAudit: function () { return runSyntheticDataIntegrityAudit.apply(null, arguments); },
    clearExpiredWorkLocks: function () { return clearExpiredWorkLocks.apply(null, arguments); },
    getAgentWorkspaceDetail: function () { return getAgentWorkspaceDetail.apply(null, arguments); },
    getTeamWorkspaceDetail: function () { return getTeamWorkspaceDetail.apply(null, arguments); },
    getCampaignWorkspaceDetail: function () { return getCampaignWorkspaceDetail.apply(null, arguments); },
    getSyntheticRetentionFunnel: function () { return getSyntheticRetentionFunnel.apply(null, arguments); },
    buildOperationalExport: function () { return buildOperationalExport.apply(null, arguments); },
    getWorkItemDetail: function () { return getWorkItemDetail.apply(null, arguments); },
    updateCustomerContext: function () { return updateCustomerContext.apply(null, arguments); },
    updateCustomerConsent: function () { return updateCustomerConsent.apply(null, arguments); },
    getWorkloadRecommendation: function () { return getWorkloadRecommendation.apply(null, arguments); },
    getReactivationRegister: function () { return getReactivationRegister.apply(null, arguments); },
    voidReactivationVerification: function () { return voidReactivationVerification.apply(null, arguments); },
    getConsentRegister: function () { return getConsentRegister.apply(null, arguments); },
    getConfigurationCatalog: function () { return getConfigurationCatalog.apply(null, arguments); },
    updateConfigurationEntry: function () { return updateConfigurationEntry.apply(null, arguments); },
    rotateSyntheticUserPassword: function () { return rotateSyntheticUserPassword.apply(null, arguments); },
    getWorkbookSchemaStatus: function () { return getWorkbookSchemaStatus.apply(null, arguments); },
    getIntegrationStatus: function () { return getIntegrationStatus.apply(null, arguments); },
    getSessionContext: function () { return getSessionContext.apply(null, arguments); },
    getNotificationDigest: function () { return getNotificationDigest.apply(null, arguments); },
    getSyntheticDataCatalog: function () { return getSyntheticDataCatalog.apply(null, arguments); },
    runPortalReadinessSuite: function () { return runPortalReadinessSuite.apply(null, arguments); },
    getFollowUpDetail: function () { return getFollowUpDetail.apply(null, arguments); },
    getQueueSegmentSummary: function () { return getQueueSegmentSummary.apply(null, arguments); },
    getCampaignRoster: function () { return getCampaignRoster.apply(null, arguments); }
  };
  var method = String(action || '');
  if (!Object.prototype.hasOwnProperty.call(handlers, method)) {
    return nfFailure('This portal request is not available.', 'UNKNOWN_ACTION');
  }
  if (!Array.isArray(args)) return nfFailure('Invalid portal request.', 'INVALID_REQUEST');
  try {
    return nfPortalWire_(handlers[method].apply(null, args));
  } catch (error) {
    return nfPortalFailure_(error, 'REQUEST_FAILED', 'The workbook request could not be completed.');
  }
}

/* -------------------------------------------------------------------------- */
/* Session, authorization, and shared read helpers                             */
/* -------------------------------------------------------------------------- */

function nfPublicUser(row) {
  return {
    id: String(row['User ID']),
    name: NexaFlowRules.displayName(row['Display Name']),
    role: String(row.Role || '').toUpperCase(),
    team: nfCleanText(row.Team, 80)
  };
}

/**
 * Converts Apps Script values into forms permitted by google.script.run.
 * Spreadsheet dates must cross the browser boundary as ISO text, never raw
 * Date objects; otherwise Apps Script can reject an otherwise valid response.
 */
function nfPortalWire_(value) {
  if (value === undefined) return null;
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return isNaN(value.getTime()) ? '' : value.toISOString();
  if (Array.isArray(value)) return value.map(nfPortalWire_);
  var output = {};
  Object.keys(value).forEach(function (key) { output[key] = nfPortalWire_(value[key]); });
  return output;
}

function nfPortalFindDate_(value, path) {
  if (value instanceof Date) return path || 'response';
  if (!value || typeof value !== 'object') return '';
  var keys = Array.isArray(value) ? value.map(function (_, index) { return index; }) : Object.keys(value);
  for (var index = 0; index < keys.length; index++) {
    var key = keys[index], found = nfPortalFindDate_(value[key], (path ? path + '.' : '') + key);
    if (found) return found;
  }
  return '';
}

/**
 * Editor-only test for the exact prefilled browser login path. It confirms the
 * agent can sign in and that the returned workspace has no raw Date values
 * that would make google.script.run reject the browser response.
 */
function verifyNexaFlowPrefilledBrowserLogin() {
  var result = { ok: false, checks: [] };
  try {
    var signedIn = portalDispatch('signIn', ['agent@nexaflow.example', 'ChangeMe!2027']);
    if (!signedIn || !signedIn.ok || !signedIn.data || !signedIn.data.token) throw new Error('Prefilled synthetic sign-in failed.');
    result.checks.push('Prefilled agent sign-in: passed');
    var bootstrap = portalDispatch('getBootstrap', [signedIn.data.token]);
    if (!bootstrap || !bootstrap.ok || !bootstrap.data || !bootstrap.data.user) throw new Error('Workspace bootstrap failed.');
    var datePath = nfPortalFindDate_(bootstrap, 'bootstrap');
    if (datePath) throw new Error('Browser-unsafe Date found at ' + datePath + '.');
    result.checks.push('Browser-safe workspace response: passed');
    portalDispatch('signOut', [signedIn.data.token]);
    result.checks.push('Sign-out: passed');
    result.ok = true;
  } catch (error) {
    result.error = error.message || String(error);
  }
  var message = 'NexaFlow prefilled browser-login test: ' + (result.ok ? 'PASSED' : 'FAILED') + '\n\n' + result.checks.map(function (check) { return '✓ ' + check; }).join('\n');
  if (!result.ok) message += '\n✗ ' + result.error;
  Logger.log(message);
  try { SpreadsheetApp.getUi().alert(message); } catch (ignored) {}
  return result;
}

/** Editor-only check for the synthetic persona switch and record boundaries. */
function verifyNexaFlowPersonaAndAccess() {
  var result = { ok: false, checks: [] }, token = '';
  try {
    var signedIn = portalDispatch('signIn', ['agent@nexaflow.example', 'ChangeMe!2027']);
    if (!signedIn || !signedIn.ok) throw new Error('Agent sign-in failed.');
    token = signedIn.data.token;
    var agentSearch = portalDispatch('getCustomerSearchResults', [token, 'CUS-1001', { limit: 1 }]);
    if (!agentSearch || agentSearch.ok !== false || !agentSearch.error || agentSearch.error.code !== 'FORBIDDEN') throw new Error('Agent customer-record restriction was not enforced.');
    result.checks.push('Agent customer-record restriction: passed');

    ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN'].forEach(function (role) {
      var switched = portalDispatch('switchDemoPersona', [token, role]);
      if (!switched || !switched.ok || !switched.data || !switched.data.user || switched.data.user.role !== role) throw new Error('Could not switch to ' + role + '.');
      token = switched.data.token;
      var workspace = portalDispatch('getBootstrap', [token]);
      if (!workspace || !workspace.ok || workspace.data.user.role !== role) throw new Error(role + ' workspace did not load.');
      result.checks.push(role.replace(/_/g, ' ') + ' persona workspace: passed');
      if (role === 'TEAM_LEAD') {
        var leadSearch = portalDispatch('getCustomerSearchResults', [token, 'CUS-1001', { limit: 1 }]);
        if (!leadSearch || !leadSearch.ok || !(leadSearch.data.results || []).length) throw new Error('Lead sample customer search failed.');
        result.checks.push('Lead sample record CUS-1001: passed');
      }
    });
    portalDispatch('signOut', [token]);
    result.checks.push('Final sign-out: passed');
    result.ok = true;
  } catch (error) {
    if (token) portalDispatch('signOut', [token]);
    result.error = error.message || String(error);
  }
  var message = 'NexaFlow persona and access test: ' + (result.ok ? 'PASSED' : 'FAILED') + '\n\n' + result.checks.map(function (check) { return '✓ ' + check; }).join('\n');
  if (!result.ok) message += '\n✗ ' + result.error;
  Logger.log(message);
  try { SpreadsheetApp.getUi().alert(message); } catch (ignored) {}
  return result;
}

/** Editor-only verification of the executive-only collaboration and register. */
function verifyExecutiveWorkspaceAccess() {
  var result = { ok: false, checks: [] }, executiveToken = '', adminToken = '';
  try {
    var executiveLogin = portalDispatch('signIn', ['executive@nexaflow.example', 'ChangeMe!2027']);
    if (!executiveLogin || !executiveLogin.ok) throw new Error('Executive sign-in failed.');
    executiveToken = executiveLogin.data.token;
    var chat = portalDispatch('getExecutiveChat', [executiveToken]);
    if (!chat || !chat.ok) throw new Error((chat && chat.error && chat.error.message) || 'Executive chat could not load.');
    result.checks.push('Executive leadership chat: passed');
    var register = portalDispatch('getReactivationRegister', [executiveToken, {}]);
    if (!register || !register.ok || !Array.isArray(register.data.rows)) throw new Error('Executive reactivation register could not load.');
    result.checks.push('Executive reactivation register: passed');
    var adminLogin = portalDispatch('signIn', ['admin@nexaflow.example', 'ChangeMe!2027']);
    if (!adminLogin || !adminLogin.ok) throw new Error('Admin sign-in failed.');
    adminToken = adminLogin.data.token;
    var adminChat = portalDispatch('getExecutiveChat', [adminToken]);
    if (!adminChat || adminChat.ok !== false || !adminChat.error || adminChat.error.code !== 'EXECUTIVE_CHAT_READ') throw new Error('Admin was not restricted from the executive chat.');
    result.checks.push('Admin executive-chat restriction: passed');
    portalDispatch('signOut', [executiveToken]); portalDispatch('signOut', [adminToken]);
    result.ok = true;
  } catch (error) {
    if (executiveToken) portalDispatch('signOut', [executiveToken]);
    if (adminToken) portalDispatch('signOut', [adminToken]);
    result.error = error.message || String(error);
  }
  var message = 'NexaFlow executive-workspace test: ' + (result.ok ? 'PASSED' : 'FAILED') + '\n\n' + result.checks.map(function (check) { return '✓ ' + check; }).join('\n');
  if (!result.ok) message += '\n✗ ' + result.error;
  Logger.log(message);
  try { SpreadsheetApp.getUi().alert(message); } catch (ignored) {}
  return result;
}

function nfPortalCanSeeAll_(role) {
  return nfRoleAllows(role, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
}

function nfPortalCanCall_(role) {
  return nfRoleAllows(role, ['AGENT', 'TEAM_LEAD', 'ADMIN']);
}

function nfPortalCanBrowseCustomerRecords_(role) {
  return nfRoleAllows(role, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
}

function nfPortalDate_(value) {
  if (!value) return null;
  var date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function nfPortalDateKey_(value) {
  var date = nfPortalDate_(value);
  return date ? Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '';
}

function nfPortalConfig_() {
  return nfRows(nfSheet(NF.SHEETS.CONFIG)).reduce(function (settings, row) {
    settings[row.Key] = row.Value;
    return settings;
  }, {});
}

function nfPortalMap_(rows, field) {
  return rows.reduce(function (output, row) {
    output[String(row[field])] = row;
    return output;
  }, {});
}

function nfPortalSessionKey_(token) {
  return 'nf:session:' + nfHash(token);
}

function nfPortalLoginAttemptKey_(email) {
  return 'nf:login-attempts:' + nfHash(String(email || '').toLowerCase());
}

function nfPortalFailure_(error, code, fallback, silent) {
  if (!silent) console.error(error && error.stack ? error.stack : error);
  return nfFailure(fallback || (error && error.message) || 'The request could not be completed.', code);
}

function nfPortalPublicCampaign_(campaign) {
  return {
    id: String(campaign['Campaign ID']),
    name: nfCleanText(campaign.Name, 100),
    status: String(campaign.Status || '').toUpperCase(),
    priority: Number(campaign.Priority) || 0,
    startDate: campaign['Start Date'] || '',
    endDate: campaign['End Date'] || ''
  };
}

function nfPortalPublicCustomer_(customer) {
  return {
    id: String(customer['Customer ID']),
    name: NexaFlowRules.displayName(customer['Display Name']),
    phone: nfCleanText(customer.Phone, 32),
    locale: nfCleanText(customer.Locale, 40),
    status: nfCleanText(customer.Status, 40),
    consent: String(customer['Contact Consent'] || '').toUpperCase(),
    createdAt: customer['Created At'] || '',
    country: nfCleanText(customer.Country, 80),
    timeZone: nfCleanText(customer['Time Zone'], 80),
    tags: nfCleanText(customer.Tags, 240),
    preferredContactWindow: nfCleanText(customer['Preferred Contact Window'], 120)
  };
}

function nfPortalAudit_(actorId, action, entityType, entityId, metadata) {
  nfAudit(actorId, action, entityType, entityId, metadata || {});
}

function nfIssueSession(user) {
  var token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  var session = {
    user: nfPublicUser(user),
    issuedAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString()
  };
  CacheService.getScriptCache().put(nfPortalSessionKey_(token), JSON.stringify(session), NF.SESSION_TTL);
  return { token: token, expiresIn: NF.SESSION_TTL, user: session.user };
}

function nfRequire(token, roles) {
  if (!token || typeof token !== 'string') throw new Error('Sign in is required.');
  var cache = CacheService.getScriptCache();
  var key = nfPortalSessionKey_(token);
  var raw = cache.get(key);
  if (!raw) throw new Error('Your session has expired. Please sign in again.');
  var session = JSON.parse(raw);
  if (roles && !nfRoleAllows(session.user.role, roles)) throw new Error('You do not have permission for this action.');
  session.lastSeenAt = new Date().toISOString();
  cache.put(key, JSON.stringify(session), NF.SESSION_TTL);
  return session.user;
}

/* -------------------------------------------------------------------------- */
/* Authentication and bootstrap                                                */
/* -------------------------------------------------------------------------- */

function nfPortalBlockedLogin_(email) {
  var attempts = Number(CacheService.getScriptCache().get(nfPortalLoginAttemptKey_(email)) || 0);
  return attempts >= NF_PORTAL.MAX_LOGIN_ATTEMPTS;
}

function nfPortalRecordFailedLogin_(email) {
  var cache = CacheService.getScriptCache();
  var key = nfPortalLoginAttemptKey_(email);
  cache.put(key, String(Number(cache.get(key) || 0) + 1), NF_PORTAL.LOGIN_ATTEMPT_WINDOW_SECONDS);
}

function signIn(email, password) {
  try {
    var cleanEmail = nfCleanText(email, 254).toLowerCase();
    var cleanPassword = typeof password === 'string' ? password : '';
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanPassword.length < 8) return nfFailure('Invalid email or password.', 'AUTH_FAILED');
    if (nfPortalBlockedLogin_(cleanEmail)) return nfFailure('Too many sign-in attempts. Wait a few minutes and try again.', 'AUTH_THROTTLED');

    var user = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (row) {
      return String(row.Email || '').toLowerCase() === cleanEmail;
    })[0];
    var expected = nfHash(cleanPassword + String(user && user['Password Salt'] || ''));
    var valid = user && String(user.Status || '').toUpperCase() === 'ACTIVE' && expected === String(user['Password Hash'] || '');
    if (!valid) {
      nfPortalRecordFailedLogin_(cleanEmail);
      return nfFailure('Invalid email or password.', 'AUTH_FAILED');
    }
    CacheService.getScriptCache().remove(nfPortalLoginAttemptKey_(cleanEmail));
    nfPortalAudit_(user['User ID'], 'SIGN_IN', 'User', user['User ID'], {});
    return nfSuccess(nfIssueSession(user));
  } catch (error) {
    return nfPortalFailure_(error, 'AUTH_UNAVAILABLE', 'Unable to sign in right now. Please try again.');
  }
}

function signOut(token) {
  try {
    if (token) CacheService.getScriptCache().remove(nfPortalSessionKey_(token));
  } catch (error) {}
  return nfSuccess({});
}

/**
 * Lets reviewers switch between the fictional role workspaces without typing
 * four passwords. This is intentionally limited to the seeded .example demo
 * accounts; every resulting session still uses ordinary role enforcement.
 */
function switchDemoPersona(token, requestedRole) {
  try {
    var actor = nfRequire(token);
    var actorRow = nfFind(NF.SHEETS.USERS, 'User ID', actor.id);
    if (!actorRow || !/@nexaflow\.example$/i.test(String(actorRow.Email || ''))) {
      return nfFailure('Demo persona switching is available only in the synthetic portfolio workspace.', 'FORBIDDEN');
    }
    var role = String(requestedRole || '').toUpperCase();
    if (NF.ROLES.indexOf(role) === -1) return nfFailure('Choose a valid demo role.', 'VALIDATION');
    var target = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (row) {
      return String(row.Role || '').toUpperCase() === role &&
        String(row.Status || '').toUpperCase() === 'ACTIVE' &&
        /@nexaflow\.example$/i.test(String(row.Email || ''));
    })[0];
    if (!target) return nfFailure('That synthetic demo role is unavailable.', 'NOT_FOUND');
    nfPortalAudit_(actor.id, 'DEMO_PERSONA_SWITCHED', 'User', target['User ID'], { fromRole: actor.role, toRole: role });
    return nfSuccess(nfIssueSession(target));
  } catch (error) {
    return nfPortalFailure_(error, 'DEMO_PERSONA_SWITCH');
  }
}

function getBootstrap(token) {
  try {
    var user = nfRequire(token);
    var campaigns = nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)).filter(function (campaign) {
      return String(campaign.Status || '').toUpperCase() === 'ACTIVE';
    }).sort(function (a, b) {
      return Number(b.Priority || 0) - Number(a.Priority || 0);
    }).map(nfPortalPublicCampaign_);
    var unread = nfRows(nfSheet(NF.SHEETS.NOTIFICATIONS)).filter(function (item) {
      return String(item['Recipient ID']) === user.id && !item['Read At'];
    }).length;
    return nfSuccess({
      user: user,
      campaigns: campaigns,
      outcomes: NexaFlowRules.OUTCOMES.slice(),
      settings: nfPublicSettings_(user),
      unreadNotifications: unread,
      permissions: {
        canCall: nfPortalCanCall_(user.role),
        canAllocateWork: nfRoleAllows(user.role, ['TEAM_LEAD', 'ADMIN']),
        canVerify: nfRoleAllows(user.role, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']),
        canSeeTeam: nfPortalCanSeeAll_(user.role),
        canAdminister: nfRoleAllows(user.role, ['ADMIN'])
      }
    });
  } catch (error) {
    return nfPortalFailure_(error, 'SESSION', 'Your session is no longer valid.');
  }
}

function getApplicationHealth(token) {
  try {
    nfRequire(token, ['ADMIN']);
    var sheets = Object.keys(NF.SHEETS).map(function (key) {
      var name = NF.SHEETS[key];
      var sheet = SpreadsheetApp.getActive().getSheetByName(name);
      return { name: name, present: Boolean(sheet), records: sheet ? Math.max(0, sheet.getLastRow() - 1) : 0 };
    });
    return nfSuccess({ healthy: sheets.every(function (sheet) { return sheet.present; }), sheets: sheets, checkedAt: new Date() });
  } catch (error) {
    return nfPortalFailure_(error, 'HEALTH_CHECK');
  }
}

/* -------------------------------------------------------------------------- */
/* Queue discovery, claiming, and lock lifecycle                               */
/* -------------------------------------------------------------------------- */

function nfWorkView_(work) {
  var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', work['Customer ID']) || {};
  return {
    id: String(work['Work Item ID']), campaignId: String(work['Campaign ID']), status: String(work.Status || ''),
    priority: Number(work.Priority) || 0, nextActionAt: work['Next Action At'] || '',
    assignedUserId: String(work['Assigned User ID'] || ''), lockExpiresAt: work['Lock Expires At'] || '',
    customer: nfPortalPublicCustomer_(customer)
  };
}

function nfPortalWorkIsDue_(work, now) {
  var nextAction = nfPortalDate_(work['Next Action At']);
  return !nextAction || nextAction.getTime() <= now.getTime();
}

function nfPortalWorkLockIsAvailable_(work, userId, now) {
  var owner = String(work['Locked By'] || '');
  var expiry = nfPortalDate_(work['Lock Expires At']);
  return !owner || owner === userId || !expiry || expiry.getTime() <= now.getTime();
}

function nfPortalWorkIsEligible_(work, user, now, options) {
  options = options || {};
  var status = String(work.Status || '').toUpperCase();
  var assignee = String(work['Assigned User ID'] || '');
  if (['QUEUED', 'FOLLOW_UP', 'IN_PROGRESS'].indexOf(status) === -1 || !nfPortalWorkIsDue_(work, now)) return false;
  if (assignee && assignee !== user.id && !nfPortalCanSeeAll_(user.role)) return false;
  if (options.campaignId && String(work['Campaign ID']) !== String(options.campaignId)) return false;
  if (options.queue === 'new' && status !== 'QUEUED') return false;
  if (options.queue === 'followup' && status !== 'FOLLOW_UP') return false;
  return true;
}

function getQueueSummary(token, options) {
  try {
    var user = nfRequire(token), now = new Date();
    var work = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (item) {
      return nfPortalWorkIsEligible_(item, user, now, options || {});
    });
    var overdue = work.filter(function (item) {
      var nextAction = nfPortalDate_(item['Next Action At']);
      return String(item.Status) === 'FOLLOW_UP' && nextAction && nextAction.getTime() < now.getTime();
    });
    return nfSuccess({
      eligible: work.length,
      newWork: work.filter(function (item) { return String(item.Status) === 'QUEUED'; }).length,
      followUps: work.filter(function (item) { return String(item.Status) === 'FOLLOW_UP'; }).length,
      overdue: overdue.length,
      inProgress: work.filter(function (item) { return String(item.Status) === 'IN_PROGRESS'; }).length
    });
  } catch (error) {
    return nfPortalFailure_(error, 'QUEUE_SUMMARY');
  }
}

function listMyWork(token, filter) {
  try {
    var user = nfRequire(token, ['AGENT', 'TEAM_LEAD', 'ADMIN']);
    var now = new Date();
    var items = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
      return nfPortalWorkIsEligible_(work, user, now, filter || {});
    }).sort(function (left, right) {
      var leftFollowUp = String(left.Status) === 'FOLLOW_UP' ? 1 : 0;
      var rightFollowUp = String(right.Status) === 'FOLLOW_UP' ? 1 : 0;
      var leftDate = nfPortalDate_(left['Next Action At']);
      var rightDate = nfPortalDate_(right['Next Action At']);
      if (leftFollowUp !== rightFollowUp) return rightFollowUp - leftFollowUp;
      if (leftDate && rightDate && leftDate.getTime() !== rightDate.getTime()) return leftDate - rightDate;
      return Number(right.Priority || 0) - Number(left.Priority || 0);
    }).slice(0, NF_PORTAL.MAX_PAGE_SIZE).map(nfWorkView_);
    return nfSuccess(items);
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_READ');
  }
}

function nfPortalClaim_(user, work, action) {
  var now = new Date();
  var expiresAt = new Date(now.getTime() + NF_PORTAL.LOCK_MINUTES * 60 * 1000);
  nfPatch(NF.SHEETS.WORK, work._row, {
    'Assigned User ID': user.id, Status: 'IN_PROGRESS', 'Locked By': user.id,
    'Lock Expires At': expiresAt, 'Updated At': now,
    'Claim Count': (Number(work['Claim Count']) || 0) + 1
  });
  work['Assigned User ID'] = user.id;
  work.Status = 'IN_PROGRESS';
  work['Locked By'] = user.id;
  work['Lock Expires At'] = expiresAt;
  nfPortalAudit_(user.id, action, 'WorkItem', work['Work Item ID'], { campaignId: work['Campaign ID'], lockExpiresAt: expiresAt.toISOString() });
  return { item: nfWorkView_(work), lockExpiresAt: expiresAt };
}

function claimNextWorkItem(token, campaignId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['AGENT', 'TEAM_LEAD', 'ADMIN']), now = new Date();
      var candidates = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
        return ['QUEUED', 'FOLLOW_UP'].indexOf(String(work.Status || '').toUpperCase()) !== -1 &&
          nfPortalWorkIsEligible_(work, user, now, { campaignId: campaignId }) &&
          nfPortalWorkLockIsAvailable_(work, user.id, now);
      }).sort(function (left, right) {
        var leftDate = nfPortalDate_(left['Next Action At']);
        var rightDate = nfPortalDate_(right['Next Action At']);
        if (leftDate && rightDate && leftDate.getTime() !== rightDate.getTime()) return leftDate - rightDate;
        return Number(right.Priority || 0) - Number(left.Priority || 0) || left._row - right._row;
      });
      if (!candidates.length) return nfSuccess({ item: null, message: 'No eligible work items are available.' });
      return nfSuccess(nfPortalClaim_(user, candidates[0], 'WORK_CLAIMED'));
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_CLAIM');
  }
}

function claimWorkItem(token, workItemId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['AGENT', 'TEAM_LEAD', 'ADMIN']);
      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(workItemId, 60));
      var now = new Date();
      if (!work || String(work.Status || '').toUpperCase() === 'CLOSED') return nfFailure('This work item is unavailable.', 'NOT_FOUND');
      if (!nfPortalWorkIsEligible_(work, user, now, {})) return nfFailure('This work item is not available in your queue.', 'FORBIDDEN');
      if (!nfPortalWorkLockIsAvailable_(work, user.id, now)) return nfFailure('This work item is in use. Refresh the queue and try again.', 'LOCKED');
      return nfSuccess(nfPortalClaim_(user, work, 'WORK_CLAIMED'));
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_CLAIM');
  }
}

function renewWorkLock(token, workItemId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['AGENT', 'TEAM_LEAD', 'ADMIN']);
      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(workItemId, 60));
      if (!work || String(work['Locked By']) !== user.id) return nfFailure('You no longer hold this work item.', 'LOCK_LOST');
      var expiresAt = new Date(Date.now() + NF_PORTAL.LOCK_MINUTES * 60 * 1000);
      nfPatch(NF.SHEETS.WORK, work._row, { 'Lock Expires At': expiresAt, 'Updated At': new Date() });
      nfPortalAudit_(user.id, 'WORK_LOCK_RENEWED', 'WorkItem', work['Work Item ID'], {});
      return nfSuccess({ lockExpiresAt: expiresAt });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'LOCK_RENEW');
  }
}

function releaseWorkItem(token, workItemId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['AGENT', 'TEAM_LEAD', 'ADMIN']);
      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(workItemId, 60));
      if (!work || String(work['Locked By']) !== user.id) return nfFailure('You do not hold this work item.', 'LOCK_LOST');
      nfPatch(NF.SHEETS.WORK, work._row, {
        Status: String(work.Status) === 'IN_PROGRESS' ? 'QUEUED' : work.Status,
        'Locked By': '', 'Lock Expires At': '', 'Updated At': new Date()
      });
      nfPortalAudit_(user.id, 'WORK_RELEASED', 'WorkItem', work['Work Item ID'], {});
      return nfSuccess({});
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_RELEASE');
  }
}

/* -------------------------------------------------------------------------- */
/* Customer profile, history, and call record                                  */
/* -------------------------------------------------------------------------- */

function getCustomerProfile(token, customerId) {
  try {
    var user = nfRequire(token);
    if (!nfPortalCanBrowseCustomerRecords_(user.role)) return nfFailure('Customer records are restricted to lead, executive, and admin views.', 'FORBIDDEN');
    var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', nfCleanText(customerId, 60));
    if (!customer) return nfFailure('Customer not found.', 'NOT_FOUND');
    var linkedWork = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
      return String(work['Customer ID']) === String(customer['Customer ID']);
    });
    var permitted = nfPortalCanSeeAll_(user.role) || linkedWork.some(function (work) { return String(work['Assigned User ID']) === user.id; });
    if (!permitted) return nfFailure('You do not have access to this customer.', 'FORBIDDEN');

    var campaigns = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)), 'Campaign ID');
    var history = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return String(interaction['Customer ID']) === String(customer['Customer ID']);
    }).sort(function (left, right) {
      return new Date(right['Occurred At']) - new Date(left['Occurred At']);
    }).slice(0, 30).map(function (interaction) {
      var work = linkedWork.filter(function (item) { return String(item['Work Item ID']) === String(interaction['Work Item ID']); })[0] || {};
      var campaign = campaigns[String(work['Campaign ID'])] || {};
      return {
        id: interaction['Interaction ID'], occurredAt: interaction['Occurred At'], outcome: interaction.Outcome,
        durationSeconds: Number(interaction['Duration Seconds']) || 0, notes: nfCleanText(interaction.Notes, NF.MAX_NOTE_LENGTH),
        followUpAt: interaction['Follow-up At'] || '', campaign: campaign.Name || ''
      };
    });
    var followUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (followUp) {
      return String(followUp['Customer ID']) === String(customer['Customer ID']) && String(followUp.Status) === 'OPEN';
    }).map(function (followUp) {
      return { id: followUp['Follow-up ID'], dueAt: followUp['Due At'], reason: followUp.Reason, workItemId: followUp['Work Item ID'] };
    });
    return nfSuccess({ customer: nfPortalPublicCustomer_(customer), work: linkedWork.map(nfWorkView_), history: history, openFollowUps: followUps });
  } catch (error) {
    return nfPortalFailure_(error, 'CUSTOMER_PROFILE');
  }
}

function nfPortalInput_(payload) {
  return {
    workItemId: nfCleanText(payload && payload.workItemId, 60), outcome: payload && payload.outcome,
    durationMinutes: payload && payload.durationMinutes, durationSeconds: payload && payload.durationSeconds,
    notes: nfCleanText(payload && payload.notes, NF.MAX_NOTE_LENGTH), followUpAt: payload && payload.followUpAt,
    optOutReason: nfCleanText(payload && payload.optOutReason, 240), requestId: nfCleanText(payload && payload.requestId, 80)
  };
}

function nfPortalFollowUpDate_(raw) {
  if (!raw) return null;
  var date = new Date(raw);
  return isNaN(date.getTime()) ? null : date;
}

function nfPortalResolveWorkStatus_(outcome) {
  if (['OPT_OUT', 'WRONG_NUMBER', 'NOT_ELIGIBLE'].indexOf(outcome) !== -1) return 'CLOSED';
  if (NexaFlowRules.requiresFollowUp(outcome)) return 'FOLLOW_UP';
  return 'QUEUED';
}

function nfPortalCloseOpenFollowUps_(workItemId, at) {
  nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).forEach(function (followUp) {
    if (String(followUp['Work Item ID']) === String(workItemId) && String(followUp.Status) === 'OPEN') {
      nfPatch(NF.SHEETS.FOLLOW_UPS, followUp._row, { Status: 'COMPLETED', 'Completed At': at });
    }
  });
}

function saveInteraction(token, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['AGENT', 'TEAM_LEAD', 'ADMIN']);
      var input = nfPortalInput_(payload);
      var validation = NexaFlowRules.validateInteraction(input);
      if (!validation.valid) return nfFailure(validation.errors.join(' '), 'VALIDATION');
      if (!input.requestId) return nfFailure('A request id is required to save an interaction.', 'VALIDATION');
      var existing = nfFind(NF.SHEETS.INTERACTIONS, 'Request ID', input.requestId);
      if (existing) return nfSuccess({ interactionId: existing['Interaction ID'], idempotent: true });

      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', input.workItemId);
      var now = new Date();
      if (!work) return nfFailure('Work item not found.', 'NOT_FOUND');
      var lockExpiry = nfPortalDate_(work['Lock Expires At']);
      if (String(work['Locked By']) !== user.id || !lockExpiry || lockExpiry.getTime() <= now.getTime()) return nfFailure('This work item is no longer locked by you. Reload the queue.', 'LOCK_LOST');

      var followUpAt = nfPortalFollowUpDate_(input.followUpAt);
      if (NexaFlowRules.requiresFollowUp(validation.outcome) && (!followUpAt || followUpAt.getTime() <= now.getTime())) return nfFailure('Choose a future date and time for the follow-up.', 'VALIDATION');

      var interactionId = nfId('INT');
      var duration = NexaFlowRules.durationSeconds(input.durationMinutes, input.durationSeconds);
      nfAppend(NF.SHEETS.INTERACTIONS, {
        'Interaction ID': interactionId, 'Request ID': input.requestId, 'Work Item ID': work['Work Item ID'],
        'Customer ID': work['Customer ID'], 'Agent ID': user.id, 'Occurred At': now, Outcome: validation.outcome,
        'Duration Seconds': duration, Notes: input.notes, 'Follow-up At': followUpAt || '', 'Opt-out Reason': input.optOutReason || ''
      });
      var newStatus = nfPortalResolveWorkStatus_(validation.outcome);
      nfPortalCloseOpenFollowUps_(work['Work Item ID'], now);
      nfPatch(NF.SHEETS.WORK, work._row, {
        Status: newStatus, 'Locked By': '', 'Lock Expires At': '', 'Next Action At': followUpAt || '', 'Updated At': now
      });
      if (followUpAt) {
        nfAppend(NF.SHEETS.FOLLOW_UPS, {
          'Follow-up ID': nfId('FUP'), 'Work Item ID': work['Work Item ID'], 'Customer ID': work['Customer ID'],
          'Owner ID': user.id, 'Due At': followUpAt, Reason: validation.outcome, Status: 'OPEN', 'Created At': now
        });
      }
      if (validation.outcome === 'OPT_OUT') {
        var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', work['Customer ID']);
        if (customer) nfPatch(NF.SHEETS.CUSTOMERS, customer._row, { 'Contact Consent': 'NO', Status: 'DO_NOT_CONTACT' });
      }
      nfPortalAudit_(user.id, 'INTERACTION_RECORDED', 'Interaction', interactionId, {
        workItemId: work['Work Item ID'], outcome: validation.outcome, durationSeconds: duration, createdFollowUp: Boolean(followUpAt)
      });
      return nfSuccess({ interactionId: interactionId, idempotent: false, status: newStatus, followUpAt: followUpAt || '' });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'INTERACTION_SAVE');
  }
}

function cancelFollowUp(token, followUpId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token);
      var followUp = nfFind(NF.SHEETS.FOLLOW_UPS, 'Follow-up ID', nfCleanText(followUpId, 60));
      if (!followUp || String(followUp.Status) !== 'OPEN') return nfFailure('Open follow-up not found.', 'NOT_FOUND');
      if (String(followUp['Owner ID']) !== user.id && !nfPortalCanSeeAll_(user.role)) return nfFailure('You do not have permission to cancel this follow-up.', 'FORBIDDEN');
      nfPatch(NF.SHEETS.FOLLOW_UPS, followUp._row, { Status: 'CANCELLED', 'Completed At': new Date() });
      nfPortalAudit_(user.id, 'FOLLOW_UP_CANCELLED', 'FollowUp', followUp['Follow-up ID'], {});
      return nfSuccess({});
    });
  } catch (error) {
    return nfPortalFailure_(error, 'FOLLOW_UP_CANCEL');
  }
}

/* -------------------------------------------------------------------------- */
/* Team allocation, verification, and notifications                            */
/* -------------------------------------------------------------------------- */

function assignWorkItem(token, workItemId, assigneeId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(workItemId, 60));
      var assignee = nfFind(NF.SHEETS.USERS, 'User ID', nfCleanText(assigneeId, 60));
      if (!work || !assignee || String(assignee.Status) !== 'ACTIVE' || !nfPortalCanCall_(assignee.Role)) return nfFailure('Choose a valid open work item and active assignee.', 'VALIDATION');
      if (String(work.Status) === 'CLOSED') return nfFailure('Closed work cannot be reassigned.', 'CONFLICT');
      nfPatch(NF.SHEETS.WORK, work._row, { 'Assigned User ID': assignee['User ID'], 'Locked By': '', 'Lock Expires At': '', 'Updated At': new Date() });
      nfPortalAudit_(user.id, 'WORK_ASSIGNED', 'WorkItem', work['Work Item ID'], { assigneeId: assignee['User ID'] });
      return nfSuccess({});
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_ASSIGN');
  }
}

function recordReactivationVerification(token, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
      var customerId = nfCleanText(payload && payload.customerId, 60);
      var attributedAgentId = nfCleanText(payload && payload.attributedAgentId, 60);
      var value = Number(payload && payload.value);
      var currency = nfCleanText(payload && payload.currency, 8) || 'USD';
      if (!customerId || !attributedAgentId || !isFinite(value) || value < 0) return nfFailure('Customer, attributed agent, and a non-negative value are required.', 'VALIDATION');
      if (!nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', customerId) || !nfFind(NF.SHEETS.USERS, 'User ID', attributedAgentId)) return nfFailure('Customer or attributed agent was not found.', 'NOT_FOUND');
      var prior = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (row) {
        return String(row['Customer ID']) === customerId && String(row.Status) === 'VERIFIED';
      })[0];
      if (prior) return nfSuccess({ reactivationId: prior['Reactivation ID'], idempotent: true });

      var now = new Date(), id = nfId('REA');
      nfAppend(NF.SHEETS.REACTIVATIONS, {
        'Reactivation ID': id, 'Customer ID': customerId, 'Attributed Agent ID': attributedAgentId,
        Status: 'VERIFIED', 'Verified At': now, 'Verified By': user.id, Value: value, Currency: currency
      });
      nfAppend(NF.SHEETS.NOTIFICATIONS, {
        'Notification ID': nfId('NOT'), 'Recipient ID': attributedAgentId, Type: 'REACTIVATION_VERIFIED',
        Message: 'An independently confirmed reactivation has been recorded for your work.', 'Read At': '', 'Created At': now
      });
      nfPortalAudit_(user.id, 'REACTIVATION_VERIFIED', 'Reactivation', id, { customerId: customerId, attributedAgentId: attributedAgentId, value: value, currency: currency });
      return nfSuccess({ reactivationId: id, idempotent: false });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'VERIFICATION');
  }
}

function getNotifications(token) {
  try {
    var user = nfRequire(token);
    var notifications = nfRows(nfSheet(NF.SHEETS.NOTIFICATIONS)).filter(function (item) {
      return String(item['Recipient ID']) === user.id;
    }).sort(function (left, right) {
      return new Date(right['Created At']) - new Date(left['Created At']);
    }).slice(0, 50);
    return nfSuccess(notifications);
  } catch (error) {
    return nfPortalFailure_(error, 'NOTIFICATIONS');
  }
}

function markNotificationRead(token, notificationId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token);
      var notification = nfFind(NF.SHEETS.NOTIFICATIONS, 'Notification ID', nfCleanText(notificationId, 60));
      if (!notification || String(notification['Recipient ID']) !== user.id) return nfFailure('Notification not found.', 'NOT_FOUND');
      if (!notification['Read At']) nfPatch(NF.SHEETS.NOTIFICATIONS, notification._row, { 'Read At': new Date() });
      return nfSuccess({});
    });
  } catch (error) {
    return nfPortalFailure_(error, 'NOTIFICATIONS');
  }
}

function markAllNotificationsRead(token) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token), now = new Date(), updated = 0;
      nfRows(nfSheet(NF.SHEETS.NOTIFICATIONS)).forEach(function (item) {
        if (String(item['Recipient ID']) === user.id && !item['Read At']) {
          nfPatch(NF.SHEETS.NOTIFICATIONS, item._row, { 'Read At': now });
          updated++;
        }
      });
      return nfSuccess({ updated: updated });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'NOTIFICATIONS');
  }
}

/* -------------------------------------------------------------------------- */
/* Dashboards, team operations, configuration, and rankings                    */
/* -------------------------------------------------------------------------- */

function getMyDashboard(token) {
  try {
    var user = nfRequire(token), config = nfPortalConfig_(), today = nfPortalDateKey_(new Date());
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (row) { return String(row['Agent ID']) === user.id; });
    var reactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (row) { return String(row['Attributed Agent ID']) === user.id && String(row.Status) === 'VERIFIED'; });
    var callsToday = interactions.filter(function (row) { return nfPortalDateKey_(row['Occurred At']) === today; });
    var answered = interactions.filter(function (row) { return String(row.Outcome) === 'ANSWERED'; });
    var dueFollowUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (row) {
      var due = nfPortalDate_(row['Due At']);
      return String(row['Owner ID']) === user.id && String(row.Status) === 'OPEN' && due && due.getTime() <= Date.now();
    });
    var metrics = { calls: interactions.length, callsToday: callsToday.length, dailyTarget: Number(config.dailyCallTarget) || 0, answered: answered.length, verified: reactivations.length, followUpsDue: dueFollowUps.length };
    return nfSuccess({
      metrics: metrics, score: NexaFlowRules.score(metrics, config),
      progress: metrics.dailyTarget ? Math.min(100, Math.round(metrics.callsToday / metrics.dailyTarget * 100)) : 0,
      recent: interactions.sort(function (left, right) { return new Date(right['Occurred At']) - new Date(left['Occurred At']); }).slice(0, 12),
      notifications: nfRows(nfSheet(NF.SHEETS.NOTIFICATIONS)).filter(function (row) { return String(row['Recipient ID']) === user.id && !row['Read At']; }).length
    });
  } catch (error) {
    return nfPortalFailure_(error, 'DASHBOARD');
  }
}

function getExecutiveAnalytics(token) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    var work = nfRows(nfSheet(NF.SHEETS.WORK)), interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS));
    var reactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (row) { return String(row.Status) === 'VERIFIED'; });
    var answered = interactions.filter(function (item) { return String(item.Outcome) === 'ANSWERED'; });
    return nfSuccess({
      totals: {
        queued: work.filter(function (item) { return ['QUEUED', 'FOLLOW_UP'].indexOf(String(item.Status)) !== -1; }).length,
        inProgress: work.filter(function (item) { return String(item.Status) === 'IN_PROGRESS'; }).length,
        interactions: interactions.length, answerRate: interactions.length ? answered.length / interactions.length : 0,
        verified: reactivations.length, verifiedValue: reactivations.reduce(function (sum, row) { return sum + (Number(row.Value) || 0); }, 0)
      },
      leaderboard: nfLeaderboard_()
    });
  } catch (error) {
    return nfPortalFailure_(error, 'ANALYTICS');
  }
}

function getTeamOperations(token) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var agents = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (row) {
      return String(row.Status) === 'ACTIVE' && nfPortalCanCall_(row.Role);
    }).map(function (row) {
      var id = String(row['User ID']);
      return { id: id, name: NexaFlowRules.displayName(row['Display Name']), team: row.Team, openWork: work.filter(function (item) { return String(item['Assigned User ID']) === id && String(item.Status) !== 'CLOSED'; }).length };
    });
    var unassigned = work.filter(function (item) { return !item['Assigned User ID'] && String(item.Status) !== 'CLOSED'; }).map(function (item) {
      return { id: item['Work Item ID'], customerId: item['Customer ID'], campaignId: item['Campaign ID'], priority: Number(item.Priority) || 0, status: item.Status, nextActionAt: item['Next Action At'] || '' };
    });
    return nfSuccess({ agents: agents, unassigned: unassigned });
  } catch (error) {
    return nfPortalFailure_(error, 'TEAM_OPERATIONS');
  }
}

function nfPublicSettings_(user) {
  return nfRows(nfSheet(NF.SHEETS.CONFIG)).filter(function (setting) {
    return String(setting.Visibility || 'ALL') === 'ALL' || nfRoleAllows(user.role, ['ADMIN', 'EXECUTIVE']);
  }).reduce(function (output, setting) {
    output[setting.Key] = setting.Value;
    return output;
  }, {});
}

function saveConfiguration(token, entries) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['ADMIN']);
      var allowed = ['callPoints', 'answerPoints', 'verificationPoints', 'dailyCallTarget'];
      if (!entries || typeof entries !== 'object') return nfFailure('Configuration input is invalid.', 'VALIDATION');
      var invalid = allowed.some(function (key) {
        return Object.prototype.hasOwnProperty.call(entries, key) && (!isFinite(Number(entries[key])) || Number(entries[key]) < 0 || Number(entries[key]) > 100000);
      });
      if (invalid) return nfFailure('Configuration values must be non-negative numbers.', 'VALIDATION');
      var now = new Date();
      nfRows(nfSheet(NF.SHEETS.CONFIG)).forEach(function (setting) {
        if (allowed.indexOf(setting.Key) !== -1 && Object.prototype.hasOwnProperty.call(entries, setting.Key)) nfPatch(NF.SHEETS.CONFIG, setting._row, { Value: Number(entries[setting.Key]), 'Updated At': now });
      });
      nfPortalAudit_(user.id, 'CONFIGURATION_UPDATED', 'Configuration', '', { keys: Object.keys(entries) });
      return nfSuccess({});
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CONFIGURATION');
  }
}

function nfLeaderboard_() {
  var users = nfRows(nfSheet(NF.SHEETS.USERS));
  var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS));
  var reactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS));
  var rules = nfPortalConfig_();
  return users.filter(function (user) {
    return ['AGENT', 'TEAM_LEAD'].indexOf(String(user.Role)) !== -1 && String(user.Status) === 'ACTIVE';
  }).map(function (user) {
    var userId = String(user['User ID']);
    var mine = interactions.filter(function (item) { return String(item['Agent ID']) === userId; });
    var verified = reactivations.filter(function (item) { return String(item['Attributed Agent ID']) === userId && String(item.Status) === 'VERIFIED'; });
    var metrics = { calls: mine.length, answered: mine.filter(function (item) { return String(item.Outcome) === 'ANSWERED'; }).length, verified: verified.length };
    return { userId: userId, name: NexaFlowRules.displayName(user['Display Name']), team: nfCleanText(user.Team, 80), calls: metrics.calls, verified: metrics.verified, score: NexaFlowRules.score(metrics, rules) };
  }).sort(function (left, right) {
    return right.score - left.score || right.verified - left.verified || left.name.localeCompare(right.name);
  });
}

function getLeaderboard() {
  try {
    return nfSuccess(nfLeaderboard_());
  } catch (error) {
    return nfPortalFailure_(error, 'LEADERBOARD', 'Leaderboard is temporarily unavailable.');
  }
}

/* -------------------------------------------------------------------------- */
/* Portal directories, search, and timeline views                              */
/* -------------------------------------------------------------------------- */

function nfPortalLimit_(value, fallback) {
  var limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1) return fallback || 50;
  return Math.min(limit, NF_PORTAL.MAX_PAGE_SIZE);
}

function nfPortalVisibleCustomer_(user, customerId, work) {
  if (nfPortalCanSeeAll_(user.role)) return true;
  return work.some(function (item) {
    return String(item['Customer ID']) === String(customerId) && String(item['Assigned User ID']) === user.id;
  });
}

function getCustomerSearchResults(token, query, options) {
  try {
    var user = nfRequire(token);
    if (!nfPortalCanBrowseCustomerRecords_(user.role)) return nfFailure('Customer records are restricted to lead, executive, and admin views.', 'FORBIDDEN');
    var cleanQuery = nfCleanText(query, 100).toLowerCase();
    var limit = nfPortalLimit_(options && options.limit, 30);
    if (cleanQuery.length < 2) return nfFailure('Enter at least two characters to search.', 'VALIDATION');

    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var matches = nfRows(nfSheet(NF.SHEETS.CUSTOMERS)).filter(function (customer) {
      var haystack = [customer['Customer ID'], customer['Display Name'], customer.Phone, customer.Locale, customer.Country, customer.Tags]
        .join(' ').toLowerCase();
      return haystack.indexOf(cleanQuery) !== -1 && nfPortalVisibleCustomer_(user, customer['Customer ID'], work);
    }).slice(0, limit).map(function (customer) {
      var customerWork = work.filter(function (item) { return String(item['Customer ID']) === String(customer['Customer ID']); });
      return {
        customer: nfPortalPublicCustomer_(customer),
        openWork: customerWork.filter(function (item) { return String(item.Status) !== 'CLOSED'; }).length,
        campaigns: customerWork.map(function (item) { return item['Campaign ID']; })
      };
    });
    return nfSuccess({ query: cleanQuery, results: matches });
  } catch (error) {
    return nfPortalFailure_(error, 'CUSTOMER_SEARCH');
  }
}

function getCustomerTimeline(token, customerId, options) {
  try {
    var user = nfRequire(token);
    if (!nfPortalCanBrowseCustomerRecords_(user.role)) return nfFailure('Customer records are restricted to lead, executive, and admin views.', 'FORBIDDEN');
    var id = nfCleanText(customerId, 60);
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    if (!nfPortalVisibleCustomer_(user, id, work)) return nfFailure('You do not have access to this customer.', 'FORBIDDEN');
    var limit = nfPortalLimit_(options && options.limit, 50);
    var events = [];

    nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return String(interaction['Customer ID']) === id;
    }).forEach(function (interaction) {
      events.push({
        at: interaction['Occurred At'],
        kind: 'INTERACTION',
        title: String(interaction.Outcome || '').replace(/_/g, ' '),
        detail: nfCleanText(interaction.Notes, 500),
        reference: interaction['Interaction ID']
      });
    });

    nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (followUp) {
      return String(followUp['Customer ID']) === id;
    }).forEach(function (followUp) {
      events.push({
        at: followUp['Due At'],
        kind: 'FOLLOW_UP',
        title: String(followUp.Status || 'OPEN').replace(/_/g, ' '),
        detail: String(followUp.Reason || '').replace(/_/g, ' '),
        reference: followUp['Follow-up ID']
      });
    });

    nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return String(reactivation['Customer ID']) === id;
    }).forEach(function (reactivation) {
      events.push({
        at: reactivation['Verified At'],
        kind: 'REACTIVATION',
        title: String(reactivation.Status || '').replace(/_/g, ' '),
        detail: 'Value: ' + String(reactivation.Value || 0) + ' ' + String(reactivation.Currency || ''),
        reference: reactivation['Reactivation ID']
      });
    });

    events.sort(function (left, right) {
      return new Date(right.at) - new Date(left.at);
    });
    return nfSuccess({ customerId: id, events: events.slice(0, limit), total: events.length });
  } catch (error) {
    return nfPortalFailure_(error, 'CUSTOMER_TIMELINE');
  }
}

function getInteractionDetail(token, interactionId) {
  try {
    var user = nfRequire(token);
    if (!nfPortalCanBrowseCustomerRecords_(user.role)) return nfFailure('Interaction record details are restricted to lead, executive, and admin views.', 'FORBIDDEN');
    var interaction = nfFind(NF.SHEETS.INTERACTIONS, 'Interaction ID', nfCleanText(interactionId, 60));
    if (!interaction) return nfFailure('Interaction not found.', 'NOT_FOUND');
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    if (!nfPortalVisibleCustomer_(user, interaction['Customer ID'], work)) return nfFailure('You do not have access to this interaction.', 'FORBIDDEN');
    var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', interaction['Customer ID']) || {};
    var item = nfFind(NF.SHEETS.WORK, 'Work Item ID', interaction['Work Item ID']) || {};
    var campaign = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', item['Campaign ID']) || {};
    return nfSuccess({
      interaction: {
        id: interaction['Interaction ID'],
        requestId: interaction['Request ID'],
        occurredAt: interaction['Occurred At'],
        outcome: interaction.Outcome,
        durationSeconds: Number(interaction['Duration Seconds']) || 0,
        notes: nfCleanText(interaction.Notes, NF.MAX_NOTE_LENGTH),
        followUpAt: interaction['Follow-up At'] || '',
        optOutReason: nfCleanText(interaction['Opt-out Reason'], 240)
      },
      customer: nfPortalPublicCustomer_(customer),
      campaign: nfPortalPublicCampaign_(campaign),
      work: nfWorkView_(item)
    });
  } catch (error) {
    return nfPortalFailure_(error, 'INTERACTION_DETAIL');
  }
}

function getCampaignDirectory(token, options) {
  try {
    nfRequire(token);
    options = options || {};
    var status = nfCleanText(options.status, 20).toUpperCase();
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var rows = nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)).filter(function (campaign) {
      return !status || String(campaign.Status).toUpperCase() === status;
    }).map(function (campaign) {
      var campaignWork = work.filter(function (item) { return String(item['Campaign ID']) === String(campaign['Campaign ID']); });
      return {
        campaign: nfPortalPublicCampaign_(campaign),
        work: {
          total: campaignWork.length,
          queued: campaignWork.filter(function (item) { return String(item.Status) === 'QUEUED'; }).length,
          followUp: campaignWork.filter(function (item) { return String(item.Status) === 'FOLLOW_UP'; }).length,
          inProgress: campaignWork.filter(function (item) { return String(item.Status) === 'IN_PROGRESS'; }).length,
          closed: campaignWork.filter(function (item) { return String(item.Status) === 'CLOSED'; }).length
        }
      };
    }).sort(function (left, right) {
      return right.campaign.priority - left.campaign.priority || left.campaign.name.localeCompare(right.campaign.name);
    });
    return nfSuccess(rows);
  } catch (error) {
    return nfPortalFailure_(error, 'CAMPAIGN_DIRECTORY');
  }
}

function getUserDirectory(token, options) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    options = options || {};
    var includeInactive = Boolean(options.includeInactive);
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS));
    var users = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (user) {
      return includeInactive || String(user.Status) === 'ACTIVE';
    }).map(function (user) {
      var id = String(user['User ID']);
      var mine = interactions.filter(function (interaction) { return String(interaction['Agent ID']) === id; });
      return {
        user: nfPublicUser(user),
        status: String(user.Status),
        openWork: work.filter(function (item) { return String(item['Assigned User ID']) === id && String(item.Status) !== 'CLOSED'; }).length,
        interactions: mine.length,
        lastInteractionAt: mine.sort(function (left, right) { return new Date(right['Occurred At']) - new Date(left['Occurred At']); })[0] && mine.sort(function (left, right) { return new Date(right['Occurred At']) - new Date(left['Occurred At']); })[0]['Occurred At'] || ''
      };
    });
    return nfSuccess(users);
  } catch (error) {
    return nfPortalFailure_(error, 'USER_DIRECTORY');
  }
}

/* -------------------------------------------------------------------------- */
/* Follow-up scheduling and queue-supervision operations                       */
/* -------------------------------------------------------------------------- */

function rescheduleFollowUp(token, followUpId, dueAt, reason) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token);
      var followUp = nfFind(NF.SHEETS.FOLLOW_UPS, 'Follow-up ID', nfCleanText(followUpId, 60));
      var due = nfPortalFollowUpDate_(dueAt);
      if (!followUp || String(followUp.Status) !== 'OPEN') return nfFailure('Open follow-up not found.', 'NOT_FOUND');
      if (String(followUp['Owner ID']) !== user.id && !nfPortalCanSeeAll_(user.role)) return nfFailure('You do not have permission to reschedule this follow-up.', 'FORBIDDEN');
      if (!due || due.getTime() <= Date.now()) return nfFailure('Choose a future follow-up date and time.', 'VALIDATION');
      var cleanReason = nfCleanText(reason, 160) || String(followUp.Reason || 'CALL_BACK');
      nfPatch(NF.SHEETS.FOLLOW_UPS, followUp._row, { 'Due At': due, Reason: cleanReason });
      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', followUp['Work Item ID']);
      if (work) nfPatch(NF.SHEETS.WORK, work._row, { Status: 'FOLLOW_UP', 'Next Action At': due, 'Updated At': new Date() });
      nfPortalAudit_(user.id, 'FOLLOW_UP_RESCHEDULED', 'FollowUp', followUp['Follow-up ID'], { dueAt: due.toISOString(), reason: cleanReason });
      return nfSuccess({ dueAt: due });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'FOLLOW_UP_RESCHEDULE');
  }
}

function completeFollowUp(token, followUpId) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token);
      var followUp = nfFind(NF.SHEETS.FOLLOW_UPS, 'Follow-up ID', nfCleanText(followUpId, 60));
      if (!followUp || String(followUp.Status) !== 'OPEN') return nfFailure('Open follow-up not found.', 'NOT_FOUND');
      if (String(followUp['Owner ID']) !== user.id && !nfPortalCanSeeAll_(user.role)) return nfFailure('You do not have permission to complete this follow-up.', 'FORBIDDEN');
      var now = new Date();
      nfPatch(NF.SHEETS.FOLLOW_UPS, followUp._row, { Status: 'COMPLETED', 'Completed At': now });
      nfPortalAudit_(user.id, 'FOLLOW_UP_COMPLETED', 'FollowUp', followUp['Follow-up ID'], {});
      return nfSuccess({});
    });
  } catch (error) {
    return nfPortalFailure_(error, 'FOLLOW_UP_COMPLETE');
  }
}

function reopenWorkItem(token, workItemId, priority) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
      var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(workItemId, 60));
      if (!work) return nfFailure('Work item not found.', 'NOT_FOUND');
      if (String(work.Status) !== 'CLOSED') return nfFailure('Only closed work can be reopened.', 'CONFLICT');
      var nextPriority = Number(priority);
      if (!Number.isInteger(nextPriority) || nextPriority < 0 || nextPriority > 1000) nextPriority = Number(work.Priority) || 0;
      var now = new Date();
      nfPatch(NF.SHEETS.WORK, work._row, {
        Status: 'QUEUED', Priority: nextPriority, 'Next Action At': '',
        'Locked By': '', 'Lock Expires At': '', 'Updated At': now
      });
      nfPortalAudit_(user.id, 'WORK_REOPENED', 'WorkItem', work['Work Item ID'], { priority: nextPriority });
      return nfSuccess({ workItemId: work['Work Item ID'], priority: nextPriority });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_REOPEN');
  }
}

function bulkAssignWorkItems(token, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
      var assigneeId = nfCleanText(payload && payload.assigneeId, 60);
      var workItemIds = Array.isArray(payload && payload.workItemIds) ? payload.workItemIds.slice(0, 100) : [];
      var assignee = nfFind(NF.SHEETS.USERS, 'User ID', assigneeId);
      if (!assignee || String(assignee.Status) !== 'ACTIVE' || !nfPortalCanCall_(assignee.Role)) return nfFailure('Choose an active calling user.', 'VALIDATION');
      if (!workItemIds.length) return nfFailure('Choose at least one work item.', 'VALIDATION');

      var updated = [], skipped = [];
      workItemIds.forEach(function (rawId) {
        var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(rawId, 60));
        if (!work || String(work.Status) === 'CLOSED') {
          skipped.push(String(rawId));
          return;
        }
        nfPatch(NF.SHEETS.WORK, work._row, {
          'Assigned User ID': assigneeId,
          'Locked By': '',
          'Lock Expires At': '',
          'Updated At': new Date()
        });
        updated.push(work['Work Item ID']);
      });
      nfPortalAudit_(user.id, 'WORK_BULK_ASSIGNED', 'WorkItemBatch', '', { assigneeId: assigneeId, updated: updated, skipped: skipped });
      return nfSuccess({ updated: updated, skipped: skipped });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_BULK_ASSIGN');
  }
}

function getQueueAging(token, filters) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    filters = filters || {};
    var now = Date.now();
    var rows = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
      return (!filters.campaignId || String(work['Campaign ID']) === String(filters.campaignId)) && String(work.Status) !== 'CLOSED';
    }).map(function (work) {
      var updated = nfPortalDate_(work['Updated At']) || new Date();
      var ageHours = Math.max(0, Math.round((now - updated.getTime()) / 3600000));
      return {
        workItemId: work['Work Item ID'], campaignId: work['Campaign ID'], customerId: work['Customer ID'],
        status: work.Status, priority: Number(work.Priority) || 0, assignedUserId: work['Assigned User ID'] || '',
        updatedAt: updated, ageHours: ageHours,
        band: ageHours >= 72 ? '72+ hours' : ageHours >= 24 ? '24–71 hours' : ageHours >= 8 ? '8–23 hours' : 'Under 8 hours'
      };
    }).sort(function (left, right) {
      return right.ageHours - left.ageHours || right.priority - left.priority;
    });
    var bands = ['Under 8 hours', '8–23 hours', '24–71 hours', '72+ hours'].map(function (label) {
      return { label: label, count: rows.filter(function (row) { return row.band === label; }).length };
    });
    return nfSuccess({ rows: rows.slice(0, nfPortalLimit_(filters.limit, 100)), bands: bands, total: rows.length });
  } catch (error) {
    return nfPortalFailure_(error, 'QUEUE_AGING');
  }
}

/* -------------------------------------------------------------------------- */
/* Administration: campaigns, users, integrity, and audit summaries            */
/* -------------------------------------------------------------------------- */

function nfPortalValidCampaignStatus_(status) {
  return ['ACTIVE', 'PAUSED', 'CLOSED'].indexOf(String(status || '').toUpperCase()) !== -1;
}

function createCampaign(token, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['ADMIN']);
      var name = nfCleanText(payload && payload.name, 100);
      var status = nfCleanText(payload && payload.status, 20).toUpperCase() || 'ACTIVE';
      var priority = Number(payload && payload.priority);
      var startDate = nfPortalDate_(payload && payload.startDate) || new Date();
      var endDate = nfPortalDate_(payload && payload.endDate);
      if (!name || !nfPortalValidCampaignStatus_(status) || !Number.isInteger(priority) || priority < 0 || priority > 1000) {
        return nfFailure('Enter a campaign name, valid status, and priority from 0 to 1000.', 'VALIDATION');
      }
      if (endDate && endDate.getTime() < startDate.getTime()) return nfFailure('The campaign end date cannot be before its start date.', 'VALIDATION');
      var id = nfId('CAM');
      nfAppend(NF.SHEETS.CAMPAIGNS, {
        'Campaign ID': id,
        Name: name,
        Status: status,
        Priority: priority,
        'Start Date': startDate,
        'End Date': endDate || ''
      });
      nfPortalAudit_(user.id, 'CAMPAIGN_CREATED', 'Campaign', id, { status: status, priority: priority });
      return nfSuccess({ id: id });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CAMPAIGN_CREATE');
  }
}

function updateCampaignLifecycle(token, campaignId, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['ADMIN']);
      var campaign = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', nfCleanText(campaignId, 60));
      if (!campaign) return nfFailure('Campaign not found.', 'NOT_FOUND');
      payload = payload || {};
      var name = nfCleanText(payload.name || campaign.Name, 100);
      var status = nfCleanText(payload.status || campaign.Status, 20).toUpperCase();
      var priority = payload.priority === undefined || payload.priority === '' ? Number(campaign.Priority) : Number(payload.priority);
      var startDate = nfPortalDate_(payload.startDate || campaign['Start Date']) || new Date();
      var endDate = payload.endDate === undefined ? nfPortalDate_(campaign['End Date']) : nfPortalDate_(payload.endDate);
      if (!name || !nfPortalValidCampaignStatus_(status) || !Number.isInteger(priority) || priority < 0 || priority > 1000) {
        return nfFailure('Campaign lifecycle input is invalid.', 'VALIDATION');
      }
      if (endDate && endDate.getTime() < startDate.getTime()) return nfFailure('The campaign end date cannot be before its start date.', 'VALIDATION');

      var activeWork = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
        return String(work['Campaign ID']) === String(campaign['Campaign ID']) && String(work.Status) !== 'CLOSED';
      });
      if (status === 'CLOSED' && activeWork.length) {
        return nfFailure('Resolve or close open work before closing this campaign.', 'CONFLICT');
      }
      nfPatch(NF.SHEETS.CAMPAIGNS, campaign._row, {
        Name: name, Status: status, Priority: priority, 'Start Date': startDate, 'End Date': endDate || ''
      });
      nfPortalAudit_(user.id, 'CAMPAIGN_LIFECYCLE_UPDATED', 'Campaign', campaign['Campaign ID'], { status: status, priority: priority });
      return nfSuccess({ id: campaign['Campaign ID'], status: status });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CAMPAIGN_UPDATE');
  }
}

function updateUserStatus(token, userId, status) {
  try {
    return nfWithLock(function () {
      var actor = nfRequire(token, ['ADMIN']);
      var target = nfFind(NF.SHEETS.USERS, 'User ID', nfCleanText(userId, 60));
      var nextStatus = nfCleanText(status, 20).toUpperCase();
      if (!target) return nfFailure('User not found.', 'NOT_FOUND');
      if (['ACTIVE', 'INACTIVE'].indexOf(nextStatus) === -1) return nfFailure('User status must be ACTIVE or INACTIVE.', 'VALIDATION');
      if (String(target['User ID']) === actor.id && nextStatus !== 'ACTIVE') return nfFailure('You cannot deactivate your own active session.', 'CONFLICT');
      if (String(target.Status) === nextStatus) return nfSuccess({ id: target['User ID'], status: nextStatus, idempotent: true });

      if (nextStatus === 'INACTIVE') {
        var inProgress = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
          return String(work['Assigned User ID']) === String(target['User ID']) && String(work.Status) === 'IN_PROGRESS';
        });
        if (inProgress.length) return nfFailure('Release or complete the user’s in-progress work before deactivating them.', 'CONFLICT');
      }
      nfPatch(NF.SHEETS.USERS, target._row, { Status: nextStatus });
      nfPortalAudit_(actor.id, 'USER_STATUS_UPDATED', 'User', target['User ID'], { status: nextStatus });
      return nfSuccess({ id: target['User ID'], status: nextStatus, idempotent: false });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'USER_STATUS_UPDATE');
  }
}

function getAuditSummary(token, filters) {
  try {
    nfRequire(token, ['ADMIN']);
    filters = filters || {};
    var entries = nfRows(nfSheet(NF.SHEETS.AUDIT)).filter(function (entry) {
      return (!filters.startDate || new Date(entry.Timestamp) >= new Date(filters.startDate + 'T00:00:00')) &&
        (!filters.endDate || new Date(entry.Timestamp) <= new Date(filters.endDate + 'T23:59:59'));
    }).sort(function (left, right) {
      return new Date(right.Timestamp) - new Date(left.Timestamp);
    });
    var byAction = entries.reduce(function (counts, entry) {
      var key = String(entry.Action || 'UNSPECIFIED');
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    var byActor = entries.reduce(function (counts, entry) {
      var key = String(entry['Actor ID'] || 'SYSTEM');
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    function pairs(source, label) {
      return Object.keys(source).map(function (key) {
        var output = { count: source[key] };
        output[label] = key;
        return output;
      }).sort(function (left, right) { return right.count - left.count; });
    }
    return nfSuccess({
      total: entries.length,
      actions: pairs(byAction, 'action'),
      actors: pairs(byActor, 'actorId'),
      recent: entries.slice(0, nfPortalLimit_(filters.limit, 50)).map(function (entry) {
        return {
          id: entry['Audit ID'], at: entry.Timestamp, actorId: entry['Actor ID'], action: entry.Action,
          entityType: entry['Entity Type'], entityId: entry['Entity ID'], metadata: nfCleanText(entry.Metadata, 1000)
        };
      })
    });
  } catch (error) {
    return nfPortalFailure_(error, 'AUDIT_SUMMARY');
  }
}

function runSyntheticDataIntegrityAudit(token) {
  try {
    nfRequire(token, ['ADMIN']);
    var users = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.USERS)), 'User ID');
    var customers = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.CUSTOMERS)), 'Customer ID');
    var campaigns = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.CAMPAIGNS)), 'Campaign ID');
    var issues = [];
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    work.forEach(function (item) {
      var id = String(item['Work Item ID']);
      if (!campaigns[String(item['Campaign ID'])]) issues.push({ severity: 'ERROR', entity: id, message: 'Work item references a missing campaign.' });
      if (!customers[String(item['Customer ID'])]) issues.push({ severity: 'ERROR', entity: id, message: 'Work item references a missing customer.' });
      if (item['Assigned User ID'] && !users[String(item['Assigned User ID'])]) issues.push({ severity: 'ERROR', entity: id, message: 'Work item references a missing assignee.' });
      if (item['Locked By'] && String(item['Locked By']) !== String(item['Assigned User ID'])) issues.push({ severity: 'WARNING', entity: id, message: 'Lock owner differs from assignee.' });
    });
    nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).forEach(function (interaction) {
      if (!users[String(interaction['Agent ID'])]) issues.push({ severity: 'ERROR', entity: interaction['Interaction ID'], message: 'Interaction references a missing agent.' });
      if (!customers[String(interaction['Customer ID'])]) issues.push({ severity: 'ERROR', entity: interaction['Interaction ID'], message: 'Interaction references a missing customer.' });
      if (!nfFind(NF.SHEETS.WORK, 'Work Item ID', interaction['Work Item ID'])) issues.push({ severity: 'ERROR', entity: interaction['Interaction ID'], message: 'Interaction references a missing work item.' });
    });
    return nfSuccess({
      checkedAt: new Date(),
      healthy: !issues.some(function (issue) { return issue.severity === 'ERROR'; }),
      errors: issues.filter(function (issue) { return issue.severity === 'ERROR'; }).length,
      warnings: issues.filter(function (issue) { return issue.severity === 'WARNING'; }).length,
      issues: issues.slice(0, 250)
    });
  } catch (error) {
    return nfPortalFailure_(error, 'INTEGRITY_AUDIT');
  }
}

function clearExpiredWorkLocks(token, dryRun) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['ADMIN']);
      var now = new Date();
      var expired = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
        var expiry = nfPortalDate_(work['Lock Expires At']);
        return work['Locked By'] && expiry && expiry.getTime() <= now.getTime();
      });
      if (!dryRun) {
        expired.forEach(function (work) {
          nfPatch(NF.SHEETS.WORK, work._row, {
            Status: String(work.Status) === 'IN_PROGRESS' ? 'QUEUED' : work.Status,
            'Locked By': '', 'Lock Expires At': '', 'Updated At': now
          });
        });
        nfPortalAudit_(user.id, 'EXPIRED_LOCKS_CLEARED', 'WorkItemBatch', '', { count: expired.length });
      }
      return nfSuccess({ dryRun: Boolean(dryRun), expired: expired.map(function (work) { return work['Work Item ID']; }) });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'LOCK_CLEANUP');
  }
}

/* -------------------------------------------------------------------------- */
/* Standalone operational reporting models                                     */
/* -------------------------------------------------------------------------- */

function nfPortalInRange_(value, filters) {
  filters = filters || {};
  var date = nfPortalDate_(value);
  if (!date) return !filters.startDate && !filters.endDate;
  if (filters.startDate && date.getTime() < new Date(filters.startDate + 'T00:00:00').getTime()) return false;
  if (filters.endDate && date.getTime() > new Date(filters.endDate + 'T23:59:59').getTime()) return false;
  return true;
}

function nfPortalCountPairs_(rows, valueFor, keyName) {
  var counts = rows.reduce(function (output, row) {
    var value = String(valueFor(row) || 'Unspecified');
    output[value] = (output[value] || 0) + 1;
    return output;
  }, {});
  return Object.keys(counts).map(function (value) {
    var output = { count: counts[value] };
    output[keyName] = value;
    return output;
  }).sort(function (left, right) {
    return right.count - left.count || String(left[keyName]).localeCompare(String(right[keyName]));
  });
}

function nfPortalDailySeries_(rows, field, days) {
  var byDate = {};
  var now = new Date();
  for (var offset = days - 1; offset >= 0; offset--) {
    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    byDate[nfPortalDateKey_(date)] = 0;
  }
  rows.forEach(function (row) {
    var key = nfPortalDateKey_(row[field]);
    if (Object.prototype.hasOwnProperty.call(byDate, key)) byDate[key]++;
  });
  return Object.keys(byDate).sort().map(function (date) { return { date: date, count: byDate[date] }; });
}

function getAgentWorkspaceDetail(token, filters) {
  try {
    var user = nfRequire(token);
    filters = filters || {};
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return String(interaction['Agent ID']) === user.id && nfPortalInRange_(interaction['Occurred At'], filters);
    });
    var reactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return String(reactivation['Attributed Agent ID']) === user.id &&
        String(reactivation.Status) === 'VERIFIED' &&
        nfPortalInRange_(reactivation['Verified At'], filters);
    });
    var followUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (followUp) {
      return String(followUp['Owner ID']) === user.id && String(followUp.Status) === 'OPEN';
    });
    var durationSeconds = interactions.reduce(function (total, interaction) {
      return total + (Number(interaction['Duration Seconds']) || 0);
    }, 0);
    var answered = interactions.filter(function (interaction) { return String(interaction.Outcome) === 'ANSWERED'; });
    var callbacks = interactions.filter(function (interaction) { return String(interaction.Outcome) === 'CALL_BACK'; });
    return nfSuccess({
      agent: user,
      totals: {
        interactions: interactions.length,
        answered: answered.length,
        answerRate: interactions.length ? answered.length / interactions.length : 0,
        callbacks: callbacks.length,
        verified: reactivations.length,
        verifiedValue: reactivations.reduce(function (sum, item) { return sum + (Number(item.Value) || 0); }, 0),
        durationSeconds: durationSeconds,
        averageDurationSeconds: interactions.length ? Math.round(durationSeconds / interactions.length) : 0,
        openFollowUps: followUps.length
      },
      outcomeMix: nfPortalCountPairs_(interactions, function (item) { return String(item.Outcome).replace(/_/g, ' '); }, 'outcome'),
      activity: nfPortalDailySeries_(interactions, 'Occurred At', 14),
      verificationActivity: nfPortalDailySeries_(reactivations, 'Verified At', 14),
      recentFollowUps: followUps.sort(function (left, right) { return new Date(left['Due At']) - new Date(right['Due At']); }).slice(0, 12)
    });
  } catch (error) {
    return nfPortalFailure_(error, 'AGENT_WORKSPACE_DETAIL');
  }
}

function getTeamWorkspaceDetail(token, filters) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    filters = filters || {};
    var users = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (user) {
      return nfPortalCanCall_(user.Role) && String(user.Status) === 'ACTIVE';
    });
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return nfPortalInRange_(interaction['Occurred At'], filters);
    });
    var reactivations = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return String(reactivation.Status) === 'VERIFIED' && nfPortalInRange_(reactivation['Verified At'], filters);
    });
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var settings = nfPortalConfig_();
    var team = users.map(function (member) {
      var id = String(member['User ID']);
      var mine = interactions.filter(function (interaction) { return String(interaction['Agent ID']) === id; });
      var verified = reactivations.filter(function (reactivation) { return String(reactivation['Attributed Agent ID']) === id; });
      var answered = mine.filter(function (interaction) { return String(interaction.Outcome) === 'ANSWERED'; });
      var metrics = { calls: mine.length, answered: answered.length, verified: verified.length };
      return {
        user: nfPublicUser(member),
        openWork: work.filter(function (item) { return String(item['Assigned User ID']) === id && String(item.Status) !== 'CLOSED'; }).length,
        interactions: mine.length,
        answered: answered.length,
        answerRate: mine.length ? answered.length / mine.length : 0,
        verified: verified.length,
        verifiedValue: verified.reduce(function (sum, item) { return sum + (Number(item.Value) || 0); }, 0),
        score: NexaFlowRules.score(metrics, settings)
      };
    }).sort(function (left, right) { return right.score - left.score || right.verified - left.verified; });
    return nfSuccess({
      team: team,
      totals: {
        members: team.length,
        interactions: interactions.length,
        verified: reactivations.length,
        openWork: work.filter(function (item) { return String(item.Status) !== 'CLOSED'; }).length
      }
    });
  } catch (error) {
    return nfPortalFailure_(error, 'TEAM_WORKSPACE_DETAIL');
  }
}

function getCampaignWorkspaceDetail(token, campaignId, filters) {
  try {
    var user = nfRequire(token);
    filters = filters || {};
    var campaign = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', nfCleanText(campaignId, 60));
    if (!campaign) return nfFailure('Campaign not found.', 'NOT_FOUND');
    var work = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (item) {
      return String(item['Campaign ID']) === String(campaign['Campaign ID']);
    });
    var workById = nfPortalMap_(work, 'Work Item ID');
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      var item = workById[String(interaction['Work Item ID'])];
      return item && (nfPortalCanSeeAll_(user.role) || String(interaction['Agent ID']) === user.id) && nfPortalInRange_(interaction['Occurred At'], filters);
    });
    var customers = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.CUSTOMERS)), 'Customer ID');
    var verified = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return String(reactivation.Status) === 'VERIFIED' && Boolean(work.filter(function (item) {
        return String(item['Customer ID']) === String(reactivation['Customer ID']);
      }).length) && nfPortalInRange_(reactivation['Verified At'], filters);
    });
    var answered = interactions.filter(function (interaction) { return String(interaction.Outcome) === 'ANSWERED'; });
    var localeRows = work.map(function (item) {
      return { locale: (customers[String(item['Customer ID'])] || {}).Locale || 'Unspecified' };
    });
    return nfSuccess({
      campaign: nfPortalPublicCampaign_(campaign),
      totals: {
        assigned: work.length,
        interactions: interactions.length,
        answered: answered.length,
        answerRate: interactions.length ? answered.length / interactions.length : 0,
        verified: verified.length,
        verifiedValue: verified.reduce(function (sum, item) { return sum + (Number(item.Value) || 0); }, 0),
        completionRate: work.length ? work.filter(function (item) { return String(item.Status) === 'CLOSED'; }).length / work.length : 0
      },
      lifecycle: nfPortalCountPairs_(work, function (item) { return item.Status; }, 'status'),
      outcomes: nfPortalCountPairs_(interactions, function (item) { return item.Outcome; }, 'outcome'),
      locales: nfPortalCountPairs_(localeRows, function (item) { return item.locale; }, 'locale'),
      activity: nfPortalDailySeries_(interactions, 'Occurred At', 30)
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CAMPAIGN_WORKSPACE_DETAIL');
  }
}

function getSyntheticRetentionFunnel(token, filters) {
  try {
    nfRequire(token, ['EXECUTIVE', 'ADMIN']);
    filters = filters || {};
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return nfPortalInRange_(interaction['Occurred At'], filters);
    });
    var contacted = {};
    var answered = {};
    interactions.forEach(function (interaction) {
      contacted[String(interaction['Customer ID'])] = true;
      if (String(interaction.Outcome) === 'ANSWERED') answered[String(interaction['Customer ID'])] = true;
    });
    var verified = {};
    nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return String(reactivation.Status) === 'VERIFIED' && nfPortalInRange_(reactivation['Verified At'], filters);
    }).forEach(function (reactivation) { verified[String(reactivation['Customer ID'])] = true; });
    var count = function (map) { return Object.keys(map).length; };
    var stages = [
      { stage: 'Eligible work', count: work.filter(function (item) { return String(item.Status) !== 'CLOSED'; }).length },
      { stage: 'Contacted', count: count(contacted) },
      { stage: 'Answered', count: count(answered) },
      { stage: 'Verified', count: count(verified) }
    ];
    var base = Math.max(1, stages[0].count);
    stages.forEach(function (stage) { stage.rateFromEligible = stage.count / base; });
    return nfSuccess({
      source: 'Synthetic NexaFlow workbook only',
      stages: stages,
      note: 'This is an operational funnel derived from fictional records. It is not connected to any external retention system.'
    });
  } catch (error) {
    return nfPortalFailure_(error, 'SYNTHETIC_RETENTION_FUNNEL');
  }
}

function buildOperationalExport(token, payload) {
  try {
    var user = nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    payload = payload || {};
    var reportType = nfCleanText(payload.reportType, 40).toUpperCase();
    var filters = payload.filters || {};
    var rows = [];
    if (reportType === 'TEAM') {
      var team = getTeamWorkspaceDetail(token, filters);
      if (!team.ok) return team;
      rows.push(['Name', 'Role', 'Team', 'Open work', 'Interactions', 'Answered', 'Answer rate', 'Verified', 'Verified value', 'Score']);
      team.data.team.forEach(function (member) {
        rows.push([member.user.name, member.user.role, member.user.team, member.openWork, member.interactions, member.answered, member.answerRate, member.verified, member.verifiedValue, member.score]);
      });
    } else if (reportType === 'CAMPAIGN') {
      var campaignId = nfCleanText(payload.campaignId, 60);
      var campaign = getCampaignWorkspaceDetail(token, campaignId, filters);
      if (!campaign.ok) return campaign;
      rows.push(['Metric', 'Value']);
      Object.keys(campaign.data.totals).forEach(function (key) { rows.push([key, campaign.data.totals[key]]); });
      rows.push([]); rows.push(['Outcome', 'Count']);
      campaign.data.outcomes.forEach(function (row) { rows.push([row.outcome, row.count]); });
    } else if (reportType === 'FUNNEL') {
      var funnel = getSyntheticRetentionFunnel(token, filters);
      if (!funnel.ok) return funnel;
      rows.push(['Stage', 'Count', 'Rate from eligible']);
      funnel.data.stages.forEach(function (stage) { rows.push([stage.stage, stage.count, stage.rateFromEligible]); });
    } else {
      return nfFailure('Choose TEAM, CAMPAIGN, or FUNNEL export.', 'VALIDATION');
    }
    nfPortalAudit_(user.id, 'OPERATIONAL_EXPORT_BUILT', 'Export', reportType, { rows: rows.length });
    return nfSuccess({ generatedAt: new Date(), reportType: reportType, rows: rows });
  } catch (error) {
    return nfPortalFailure_(error, 'OPERATIONAL_EXPORT');
  }
}

/* -------------------------------------------------------------------------- */
/* Controlled customer and work-item administration                             */
/* -------------------------------------------------------------------------- */

function getWorkItemDetail(token, workItemId) {
  try {
    var user = nfRequire(token);
    var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', nfCleanText(workItemId, 60));
    if (!work) return nfFailure('Work item not found.', 'NOT_FOUND');
    var permitted = nfPortalCanSeeAll_(user.role) || String(work['Assigned User ID']) === user.id || !work['Assigned User ID'];
    if (!permitted) return nfFailure('You do not have access to this work item.', 'FORBIDDEN');
    var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', work['Customer ID']) || {};
    var campaign = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', work['Campaign ID']) || {};
    var followUps = nfRows(nfSheet(NF.SHEETS.FOLLOW_UPS)).filter(function (followUp) {
      return String(followUp['Work Item ID']) === String(work['Work Item ID']);
    }).sort(function (left, right) {
      return new Date(right['Created At']) - new Date(left['Created At']);
    });
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return String(interaction['Work Item ID']) === String(work['Work Item ID']);
    }).sort(function (left, right) {
      return new Date(right['Occurred At']) - new Date(left['Occurred At']);
    });
    return nfSuccess({
      work: nfWorkView_(work),
      customer: nfPortalPublicCustomer_(customer),
      campaign: nfPortalPublicCampaign_(campaign),
      followUps: followUps.map(function (followUp) {
        return {
          id: followUp['Follow-up ID'], dueAt: followUp['Due At'], reason: followUp.Reason,
          status: followUp.Status, createdAt: followUp['Created At'], completedAt: followUp['Completed At'] || ''
        };
      }),
      interactions: interactions.map(function (interaction) {
        return {
          id: interaction['Interaction ID'], at: interaction['Occurred At'], outcome: interaction.Outcome,
          notes: nfCleanText(interaction.Notes, 500), durationSeconds: Number(interaction['Duration Seconds']) || 0
        };
      })
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_ITEM_DETAIL');
  }
}

function createWorkItem(token, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
      payload = payload || {};
      var campaignId = nfCleanText(payload.campaignId, 60);
      var customerId = nfCleanText(payload.customerId, 60);
      var assigneeId = nfCleanText(payload.assigneeId, 60);
      var priority = Number(payload.priority);
      var nextActionAt = nfPortalFollowUpDate_(payload.nextActionAt);
      var queueSegment = nfCleanText(payload.queueSegment, 60) || 'GENERAL';
      var campaign = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', campaignId);
      var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', customerId);
      var assignee = assigneeId ? nfFind(NF.SHEETS.USERS, 'User ID', assigneeId) : null;

      if (!campaign || String(campaign.Status) !== 'ACTIVE') return nfFailure('Choose an active campaign.', 'VALIDATION');
      if (!customer || String(customer['Contact Consent']).toUpperCase() !== 'YES') return nfFailure('Choose a customer with active contact consent.', 'VALIDATION');
      if (assigneeId && (!assignee || String(assignee.Status) !== 'ACTIVE' || !nfPortalCanCall_(assignee.Role))) return nfFailure('The assignee is not an active calling user.', 'VALIDATION');
      if (!Number.isInteger(priority) || priority < 0 || priority > 1000) return nfFailure('Priority must be a whole number from 0 to 1000.', 'VALIDATION');

      var duplicate = nfRows(nfSheet(NF.SHEETS.WORK)).some(function (work) {
        return String(work['Campaign ID']) === campaignId && String(work['Customer ID']) === customerId && String(work.Status) !== 'CLOSED';
      });
      if (duplicate) return nfFailure('This customer already has open work in the selected campaign.', 'CONFLICT');

      var now = new Date();
      var id = nfId('WRK');
      nfAppend(NF.SHEETS.WORK, {
        'Work Item ID': id,
        'Campaign ID': campaignId,
        'Customer ID': customerId,
        'Assigned User ID': assigneeId,
        Status: nextActionAt ? 'FOLLOW_UP' : 'QUEUED',
        Priority: priority,
        'Next Action At': nextActionAt || '',
        'Locked By': '',
        'Lock Expires At': '',
        'Updated At': now,
        'Queue Segment': queueSegment,
        'Claim Count': 0
      });
      nfPortalAudit_(user.id, 'WORK_CREATED', 'WorkItem', id, { campaignId: campaignId, customerId: customerId, assigneeId: assigneeId || null, queueSegment: queueSegment });
      return nfSuccess({ id: id });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'WORK_CREATE');
  }
}

function updateCustomerContext(token, customerId, payload) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
      var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', nfCleanText(customerId, 60));
      if (!customer) return nfFailure('Customer not found.', 'NOT_FOUND');
      payload = payload || {};
      var allowed = {
        'Country': nfCleanText(payload.country, 80),
        'Time Zone': nfCleanText(payload.timeZone, 80),
        'Tags': nfCleanText(payload.tags, 240),
        'Preferred Contact Window': nfCleanText(payload.preferredContactWindow, 120)
      };
      Object.keys(allowed).forEach(function (key) {
        if (!allowed[key]) delete allowed[key];
      });
      if (!Object.keys(allowed).length) return nfFailure('Provide at least one customer-context value.', 'VALIDATION');
      nfPatch(NF.SHEETS.CUSTOMERS, customer._row, allowed);
      nfPortalAudit_(user.id, 'CUSTOMER_CONTEXT_UPDATED', 'Customer', customer['Customer ID'], { fields: Object.keys(allowed) });
      return nfSuccess({ customer: nfPortalPublicCustomer_(Object.assign({}, customer, allowed)) });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CUSTOMER_CONTEXT_UPDATE');
  }
}

function updateCustomerConsent(token, customerId, consent, reason) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
      var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', nfCleanText(customerId, 60));
      var nextConsent = nfCleanText(consent, 8).toUpperCase();
      var note = nfCleanText(reason, 240);
      if (!customer) return nfFailure('Customer not found.', 'NOT_FOUND');
      if (['YES', 'NO'].indexOf(nextConsent) === -1) return nfFailure('Consent must be YES or NO.', 'VALIDATION');
      if (nextConsent === 'NO' && note.length < 3) return nfFailure('Document the reason for withdrawing consent.', 'VALIDATION');
      var status = nextConsent === 'NO' ? 'DO_NOT_CONTACT' : String(customer.Status || 'INACTIVE');
      if (nextConsent === 'YES' && status === 'DO_NOT_CONTACT') status = 'INACTIVE';
      nfPatch(NF.SHEETS.CUSTOMERS, customer._row, { 'Contact Consent': nextConsent, Status: status });
      if (nextConsent === 'NO') {
        nfRows(nfSheet(NF.SHEETS.WORK)).forEach(function (work) {
          if (String(work['Customer ID']) === String(customer['Customer ID']) && String(work.Status) !== 'CLOSED') {
            nfPatch(NF.SHEETS.WORK, work._row, { Status: 'CLOSED', 'Locked By': '', 'Lock Expires At': '', 'Updated At': new Date() });
          }
        });
      }
      nfPortalAudit_(user.id, 'CUSTOMER_CONSENT_UPDATED', 'Customer', customer['Customer ID'], { consent: nextConsent, reason: note || null });
      return nfSuccess({ consent: nextConsent, status: status });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CUSTOMER_CONSENT_UPDATE');
  }
}

function getWorkloadRecommendation(token, payload) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'ADMIN']);
    payload = payload || {};
    var campaignId = nfCleanText(payload.campaignId, 60);
    var agents = nfRows(nfSheet(NF.SHEETS.USERS)).filter(function (user) {
      return String(user.Status) === 'ACTIVE' && nfPortalCanCall_(user.Role);
    });
    var work = nfRows(nfSheet(NF.SHEETS.WORK));
    var interactions = nfRows(nfSheet(NF.SHEETS.INTERACTIONS));
    var suggestions = agents.map(function (agent) {
      var id = String(agent['User ID']);
      var open = work.filter(function (item) {
        return String(item['Assigned User ID']) === id && String(item.Status) !== 'CLOSED' && (!campaignId || String(item['Campaign ID']) === campaignId);
      }).length;
      var recent = interactions.filter(function (interaction) {
        var date = nfPortalDate_(interaction['Occurred At']);
        return String(interaction['Agent ID']) === id && date && date.getTime() >= Date.now() - 7 * 24 * 3600000;
      }).length;
      return {
        user: nfPublicUser(agent),
        openWork: open,
        interactionsLastSevenDays: recent,
        rationale: 'Ranks only current open workload and recorded activity; it does not assess a person’s suitability.'
      };
    }).sort(function (left, right) {
      return left.openWork - right.openWork || right.interactionsLastSevenDays - left.interactionsLastSevenDays || left.user.name.localeCompare(right.user.name);
    });
    return nfSuccess({ campaignId: campaignId || 'ALL', suggestions: suggestions });
  } catch (error) {
    return nfPortalFailure_(error, 'WORKLOAD_RECOMMENDATION');
  }
}

/* -------------------------------------------------------------------------- */
/* Reactivation register, consent register, and controlled reversal            */
/* -------------------------------------------------------------------------- */

function getReactivationRegister(token, filters) {
  try {
    var user = nfRequire(token, ['EXECUTIVE']);
    filters = filters || {};
    var limit = nfPortalLimit_(filters.limit, 100);
    var customers = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.CUSTOMERS)), 'Customer ID');
    var users = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.USERS)), 'User ID');
    var rows = nfRows(nfSheet(NF.SHEETS.REACTIVATIONS)).filter(function (reactivation) {
      return (!filters.status || String(reactivation.Status) === String(filters.status)) &&
        (!filters.agentId || String(reactivation['Attributed Agent ID']) === String(filters.agentId)) &&
        nfPortalInRange_(reactivation['Verified At'], filters);
    }).sort(function (left, right) {
      return new Date(right['Verified At']) - new Date(left['Verified At']);
    }).slice(0, limit).map(function (reactivation) {
      var customer = customers[String(reactivation['Customer ID'])] || {};
      var agent = users[String(reactivation['Attributed Agent ID'])] || {};
      var verifier = users[String(reactivation['Verified By'])] || {};
      return {
        id: reactivation['Reactivation ID'],
        customerId: reactivation['Customer ID'],
        customerName: NexaFlowRules.displayName(customer['Display Name']),
        agentId: reactivation['Attributed Agent ID'],
        agentName: NexaFlowRules.displayName(agent['Display Name']),
        status: reactivation.Status,
        verifiedAt: reactivation['Verified At'],
        verifiedBy: NexaFlowRules.displayName(verifier['Display Name']),
        value: Number(reactivation.Value) || 0,
        currency: reactivation.Currency || 'USD'
      };
    });
    return nfSuccess({ rows: rows, total: rows.length, scope: user.role, description: 'A reactivation is a fictional customer return that was independently verified and attributed to a recorded workflow.' });
  } catch (error) {
    return nfPortalFailure_(error, 'REACTIVATION_REGISTER');
  }
}

/* -------------------------------------------------------------------------- */
/* Executive collaboration                                                     */
/* -------------------------------------------------------------------------- */

function getExecutiveChat(token) {
  try {
    nfRequire(token, ['EXECUTIVE']);
    var rows = nfRows(nfSheet(NF.SHEETS.LEADERSHIP_CHAT)).filter(function (row) {
      return String(row.Channel || 'EXECUTIVE') === 'EXECUTIVE';
    }).sort(function (left, right) {
      return new Date(left.Timestamp) - new Date(right.Timestamp);
    }).slice(-80).map(function (row) {
      return { id: row['Message ID'], at: row.Timestamp, author: nfCleanText(row['Author Name'], 100), message: nfCleanText(row.Message, 1200) };
    });
    return nfSuccess({ messages: rows, channel: 'Executive leadership' });
  } catch (error) {
    // A denied read is an expected access-control response, not an editor error.
    return nfPortalFailure_(error, 'EXECUTIVE_CHAT_READ', null, true);
  }
}

function postExecutiveChat(token, message) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['EXECUTIVE']);
      var text = nfCleanText(message, 1200);
      if (text.length < 2) return nfFailure('Write at least two characters before sending.', 'VALIDATION');
      var now = new Date();
      var id = nfId('MSG');
      nfAppend(NF.SHEETS.LEADERSHIP_CHAT, { 'Message ID': id, Timestamp: now, 'Author ID': user.id, 'Author Name': user.name, Message: text, Channel: 'EXECUTIVE' });
      nfPortalAudit_(user.id, 'EXECUTIVE_CHAT_POSTED', 'LeadershipChat', id, {});
      return nfSuccess({ id: id, at: now, author: user.name, message: text });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'EXECUTIVE_CHAT_WRITE');
  }
}

function voidReactivationVerification(token, reactivationId, reason) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['ADMIN']);
      var reactivation = nfFind(NF.SHEETS.REACTIVATIONS, 'Reactivation ID', nfCleanText(reactivationId, 60));
      var note = nfCleanText(reason, 240);
      if (!reactivation) return nfFailure('Reactivation record not found.', 'NOT_FOUND');
      if (String(reactivation.Status) !== 'VERIFIED') return nfFailure('Only a verified reactivation can be voided.', 'CONFLICT');
      if (note.length < 3) return nfFailure('Document why this verification is being voided.', 'VALIDATION');
      var now = new Date();
      nfPatch(NF.SHEETS.REACTIVATIONS, reactivation._row, { Status: 'VOIDED', 'Verified By': user.id });
      nfAppend(NF.SHEETS.NOTIFICATIONS, {
        'Notification ID': nfId('NOT'),
        'Recipient ID': reactivation['Attributed Agent ID'],
        Type: 'REACTIVATION_VOIDED',
        Message: 'A previously verified reactivation was voided after review.',
        'Read At': '',
        'Created At': now
      });
      nfPortalAudit_(user.id, 'REACTIVATION_VOIDED', 'Reactivation', reactivation['Reactivation ID'], { reason: note });
      return nfSuccess({ id: reactivation['Reactivation ID'], status: 'VOIDED' });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'REACTIVATION_VOID');
  }
}

function getConsentRegister(token, filters) {
  try {
    nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    filters = filters || {};
    var consent = nfCleanText(filters.consent, 8).toUpperCase();
    var limit = nfPortalLimit_(filters.limit, 100);
    var rows = nfRows(nfSheet(NF.SHEETS.CUSTOMERS)).filter(function (customer) {
      return (!consent || String(customer['Contact Consent']).toUpperCase() === consent) &&
        (!filters.locale || String(customer.Locale) === String(filters.locale)) &&
        (!filters.country || String(customer.Country) === String(filters.country));
    }).map(function (customer) {
      return nfPortalPublicCustomer_(customer);
    }).sort(function (left, right) {
      return left.name.localeCompare(right.name);
    }).slice(0, limit);
    return nfSuccess({ rows: rows, total: rows.length });
  } catch (error) {
    return nfPortalFailure_(error, 'CONSENT_REGISTER');
  }
}

/* -------------------------------------------------------------------------- */
/* Configuration, password rotation, and workbook diagnostics                  */
/* -------------------------------------------------------------------------- */

function getConfigurationCatalog(token) {
  try {
    var user = nfRequire(token, ['ADMIN']);
    var rows = nfRows(nfSheet(NF.SHEETS.CONFIG)).map(function (setting) {
      return {
        key: setting.Key,
        value: setting.Value,
        visibility: setting.Visibility || 'ALL',
        updatedAt: setting['Updated At'] || ''
      };
    });
    return nfSuccess({ requestedBy: user.id, settings: rows });
  } catch (error) {
    return nfPortalFailure_(error, 'CONFIGURATION_CATALOG');
  }
}

function updateConfigurationEntry(token, key, value) {
  try {
    return nfWithLock(function () {
      var user = nfRequire(token, ['ADMIN']);
      var allowed = ['callPoints', 'answerPoints', 'verificationPoints', 'dailyCallTarget'];
      var settingKey = nfCleanText(key, 80);
      var number = Number(value);
      if (allowed.indexOf(settingKey) === -1) return nfFailure('This configuration key is not editable.', 'FORBIDDEN');
      if (!isFinite(number) || number < 0 || number > 100000) return nfFailure('Enter a number from 0 to 100000.', 'VALIDATION');
      var setting = nfFind(NF.SHEETS.CONFIG, 'Key', settingKey);
      if (!setting) return nfFailure('Configuration setting not found.', 'NOT_FOUND');
      nfPatch(NF.SHEETS.CONFIG, setting._row, { Value: number, 'Updated At': new Date() });
      nfPortalAudit_(user.id, 'CONFIGURATION_ENTRY_UPDATED', 'Configuration', settingKey, { value: number });
      return nfSuccess({ key: settingKey, value: number });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'CONFIGURATION_ENTRY_UPDATE');
  }
}

function rotateSyntheticUserPassword(token, userId, newPassword) {
  try {
    return nfWithLock(function () {
      var actor = nfRequire(token, ['ADMIN']);
      var target = nfFind(NF.SHEETS.USERS, 'User ID', nfCleanText(userId, 60));
      if (!target) return nfFailure('User not found.', 'NOT_FOUND');
      if (typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 128) {
        return nfFailure('The synthetic password must contain 12 to 128 characters.', 'VALIDATION');
      }
      var salt = Utilities.getUuid();
      nfPatch(NF.SHEETS.USERS, target._row, {
        'Demo Password': newPassword,
        'Password Salt': salt,
        'Password Hash': nfHash(newPassword + salt)
      });
      nfPortalAudit_(actor.id, 'SYNTHETIC_PASSWORD_ROTATED', 'User', target['User ID'], {});
      return nfSuccess({ userId: target['User ID'] });
    });
  } catch (error) {
    return nfPortalFailure_(error, 'SYNTHETIC_PASSWORD_ROTATION');
  }
}

function getWorkbookSchemaStatus(token) {
  try {
    nfRequire(token, ['ADMIN']);
    var expected = {
      Configuration: ['Key', 'Value', 'Visibility', 'Updated At'],
      Users: ['User ID', 'Display Name', 'Email', 'Role', 'Team', 'Status', 'Demo Password', 'Password Salt', 'Password Hash'],
      Customers: ['Customer ID', 'Display Name', 'Phone', 'Locale', 'Status', 'Contact Consent', 'Created At'],
      Campaigns: ['Campaign ID', 'Name', 'Status', 'Priority'],
      WorkItems: ['Work Item ID', 'Campaign ID', 'Customer ID', 'Status', 'Priority'],
      Interactions: ['Interaction ID', 'Request ID', 'Work Item ID', 'Customer ID', 'Agent ID', 'Occurred At', 'Outcome'],
      FollowUps: ['Follow-up ID', 'Work Item ID', 'Customer ID', 'Owner ID', 'Due At', 'Status'],
      Reactivations: ['Reactivation ID', 'Customer ID', 'Attributed Agent ID', 'Status', 'Verified At'],
      Notifications: ['Notification ID', 'Recipient ID', 'Type', 'Message', 'Read At'],
      AuditLog: ['Audit ID', 'Timestamp', 'Actor ID', 'Action', 'Entity Type']
    };
    var sheets = Object.keys(expected).map(function (name) {
      var sheet = SpreadsheetApp.getActive().getSheetByName(name);
      if (!sheet) return { name: name, present: false, missingColumns: expected[name], extraColumns: [] };
      var actual = nfHeaders(sheet);
      var missing = expected[name].filter(function (column) { return actual[column] === undefined; });
      var extra = Object.keys(actual).filter(function (column) { return expected[name].indexOf(column) === -1; });
      return { name: name, present: true, missingColumns: missing, extraColumns: extra, records: Math.max(0, sheet.getLastRow() - 1) };
    });
    return nfSuccess({
      compatible: sheets.every(function (sheet) { return sheet.present && !sheet.missingColumns.length; }),
      sheets: sheets
    });
  } catch (error) {
    return nfPortalFailure_(error, 'SCHEMA_STATUS');
  }
}

function getIntegrationStatus(token) {
  try {
    nfRequire(token, ['ADMIN']);
    return nfSuccess({
      integrations: [
        { name: 'Calling provider', status: 'NOT_CONNECTED', detail: 'NexaFlow uses a device tel: link and does not send calls through a provider.' },
        { name: 'External retention source', status: 'NOT_CONNECTED', detail: 'The portfolio project intentionally uses only the synthetic workbook.' },
        { name: 'Payment provider', status: 'NOT_CONNECTED', detail: 'The portfolio project does not collect or process payments.' }
      ]
    });
  } catch (error) {
    return nfPortalFailure_(error, 'INTEGRATION_STATUS');
  }
}

/* -------------------------------------------------------------------------- */
/* Session context, navigation metadata, and deployment-readiness diagnostics  */
/* -------------------------------------------------------------------------- */

function getSessionContext(token) {
  try {
    var user = nfRequire(token);
    return nfSuccess({
      user: user,
      expiresInSeconds: NF.SESSION_TTL,
      capabilities: {
        agentWorkspace: nfPortalCanCall_(user.role),
        followUpWorkspace: nfPortalCanCall_(user.role),
        customerSearch: true,
        teamWorkspace: nfPortalCanSeeAll_(user.role),
        executiveWorkspace: nfRoleAllows(user.role, ['EXECUTIVE', 'ADMIN']),
        administration: nfRoleAllows(user.role, ['ADMIN'])
      },
      source: 'Synthetic NexaFlow workbook'
    });
  } catch (error) {
    return nfPortalFailure_(error, 'SESSION_CONTEXT');
  }
}

function getPortalNavigation(token) {
  try {
    var user = nfRequire(token);
    var entries = [
      { id: 'overview', label: 'Overview', visible: true },
      { id: 'outbound', label: 'Outbound workspace', visible: nfPortalCanCall_(user.role) },
      { id: 'followups', label: 'Follow-up queue', visible: nfPortalCanCall_(user.role) },
      { id: 'customers', label: 'Customer history', visible: true },
      { id: 'progress', label: 'My performance', visible: nfPortalCanCall_(user.role) },
      { id: 'campaigns', label: 'Campaign performance', visible: true },
      { id: 'explorer', label: 'Interaction explorer', visible: true },
      { id: 'team', label: 'Team operations', visible: nfPortalCanSeeAll_(user.role) },
      { id: 'executive', label: 'Executive report', visible: nfRoleAllows(user.role, ['EXECUTIVE', 'ADMIN']) },
      { id: 'cohorts', label: 'Cohort analysis', visible: nfRoleAllows(user.role, ['EXECUTIVE', 'ADMIN']) },
      { id: 'insights', label: 'Operational insights', visible: nfRoleAllows(user.role, ['EXECUTIVE', 'ADMIN']) },
      { id: 'settings', label: 'Score settings', visible: nfRoleAllows(user.role, ['ADMIN']) },
      { id: 'admin', label: 'Administration', visible: nfRoleAllows(user.role, ['ADMIN']) },
      { id: 'health', label: 'Workspace health', visible: nfRoleAllows(user.role, ['ADMIN']) },
      { id: 'help', label: 'Help and workflow guide', visible: true }
    ];
    return nfSuccess(entries.filter(function (entry) { return entry.visible; }));
  } catch (error) {
    return nfPortalFailure_(error, 'PORTAL_NAVIGATION');
  }
}

function getNotificationDigest(token) {
  try {
    var user = nfRequire(token);
    var now = Date.now();
    var notifications = nfRows(nfSheet(NF.SHEETS.NOTIFICATIONS)).filter(function (notification) {
      return String(notification['Recipient ID']) === user.id;
    });
    var unread = notifications.filter(function (notification) { return !notification['Read At']; });
    var recent = notifications.filter(function (notification) {
      var created = nfPortalDate_(notification['Created At']);
      return created && created.getTime() >= now - 7 * 24 * 3600000;
    });
    return nfSuccess({
      total: notifications.length,
      unread: unread.length,
      lastSevenDays: recent.length,
      byType: nfPortalCountPairs_(notifications, function (notification) { return notification.Type; }, 'type'),
      latestUnread: unread.sort(function (left, right) { return new Date(right['Created At']) - new Date(left['Created At']); }).slice(0, 5)
    });
  } catch (error) {
    return nfPortalFailure_(error, 'NOTIFICATION_DIGEST');
  }
}

function getSyntheticDataCatalog(token) {
  try {
    nfRequire(token, ['ADMIN']);
    var catalog = [
      { entity: 'Users', purpose: 'Fictional role accounts for interface demonstration', records: Math.max(0, nfSheet(NF.SHEETS.USERS).getLastRow() - 1) },
      { entity: 'Customers', purpose: 'Fictional customer records for workflow demonstration', records: Math.max(0, nfSheet(NF.SHEETS.CUSTOMERS).getLastRow() - 1) },
      { entity: 'Campaigns', purpose: 'Fictional outreach campaigns', records: Math.max(0, nfSheet(NF.SHEETS.CAMPAIGNS).getLastRow() - 1) },
      { entity: 'Work items', purpose: 'Synthetic allocation and lock-lifecycle records', records: Math.max(0, nfSheet(NF.SHEETS.WORK).getLastRow() - 1) },
      { entity: 'Interactions', purpose: 'Synthetic operational history', records: Math.max(0, nfSheet(NF.SHEETS.INTERACTIONS).getLastRow() - 1) }
    ];
    return nfSuccess({
      catalog: catalog,
      constraints: [
        'No production data may be inserted into this portfolio workbook.',
        'No external customer, payment, or communications provider is connected.',
        'Exports contain only data already present in the synthetic workbook.'
      ]
    });
  } catch (error) {
    return nfPortalFailure_(error, 'SYNTHETIC_DATA_CATALOG');
  }
}

function runPortalReadinessSuite(token) {
  try {
    nfRequire(token, ['ADMIN']);
    var schema = getWorkbookSchemaStatus(token);
    var integrity = runSyntheticDataIntegrityAudit(token);
    var health = getApplicationHealth(token);
    var integrations = getIntegrationStatus(token);
    if (!schema.ok) return schema;
    if (!integrity.ok) return integrity;
    if (!health.ok) return health;
    if (!integrations.ok) return integrations;
    return nfSuccess({
      ready: Boolean(schema.data.compatible && integrity.data.healthy && health.data.healthy),
      checkedAt: new Date(),
      schema: schema.data,
      integrity: integrity.data,
      health: health.data,
      integrations: integrations.data
    });
  } catch (error) {
    return nfPortalFailure_(error, 'READINESS_SUITE');
  }
}

/* -------------------------------------------------------------------------- */
/* Detail read models used by the full portal interface                         */
/* -------------------------------------------------------------------------- */

function getFollowUpDetail(token, followUpId) {
  try {
    var user = nfRequire(token);
    var followUp = nfFind(NF.SHEETS.FOLLOW_UPS, 'Follow-up ID', nfCleanText(followUpId, 60));
    if (!followUp) return nfFailure('Follow-up not found.', 'NOT_FOUND');
    if (String(followUp['Owner ID']) !== user.id && !nfPortalCanSeeAll_(user.role)) return nfFailure('You do not have access to this follow-up.', 'FORBIDDEN');
    var work = nfFind(NF.SHEETS.WORK, 'Work Item ID', followUp['Work Item ID']) || {};
    var customer = nfFind(NF.SHEETS.CUSTOMERS, 'Customer ID', followUp['Customer ID']) || {};
    var previous = nfRows(nfSheet(NF.SHEETS.INTERACTIONS)).filter(function (interaction) {
      return String(interaction['Work Item ID']) === String(followUp['Work Item ID']);
    }).sort(function (left, right) {
      return new Date(right['Occurred At']) - new Date(left['Occurred At']);
    }).slice(0, 5).map(function (interaction) {
      return { at: interaction['Occurred At'], outcome: interaction.Outcome, notes: nfCleanText(interaction.Notes, 500) };
    });
    return nfSuccess({
      followUp: {
        id: followUp['Follow-up ID'], dueAt: followUp['Due At'], reason: followUp.Reason,
        status: followUp.Status, ownerId: followUp['Owner ID'], createdAt: followUp['Created At']
      },
      work: nfWorkView_(work),
      customer: nfPortalPublicCustomer_(customer),
      recentInteractions: previous
    });
  } catch (error) {
    return nfPortalFailure_(error, 'FOLLOW_UP_DETAIL');
  }
}

function getQueueSegmentSummary(token, filters) {
  try {
    var user = nfRequire(token);
    filters = filters || {};
    var now = new Date();
    var rows = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (work) {
      return nfPortalWorkIsEligible_(work, user, now, { campaignId: filters.campaignId }) &&
        (!filters.segment || String(work['Queue Segment'] || 'GENERAL') === String(filters.segment));
    });
    return nfSuccess({
      total: rows.length,
      segments: nfPortalCountPairs_(rows, function (work) { return work['Queue Segment'] || 'GENERAL'; }, 'segment'),
      statuses: nfPortalCountPairs_(rows, function (work) { return work.Status; }, 'status'),
      highestPriority: rows.sort(function (left, right) { return Number(right.Priority || 0) - Number(left.Priority || 0); }).slice(0, 10).map(nfWorkView_)
    });
  } catch (error) {
    return nfPortalFailure_(error, 'QUEUE_SEGMENT_SUMMARY');
  }
}

function getCampaignRoster(token, campaignId) {
  try {
    var user = nfRequire(token, ['TEAM_LEAD', 'EXECUTIVE', 'ADMIN']);
    var id = nfCleanText(campaignId, 60);
    var campaign = nfFind(NF.SHEETS.CAMPAIGNS, 'Campaign ID', id);
    if (!campaign) return nfFailure('Campaign not found.', 'NOT_FOUND');
    var users = nfPortalMap_(nfRows(nfSheet(NF.SHEETS.USERS)), 'User ID');
    var work = nfRows(nfSheet(NF.SHEETS.WORK)).filter(function (item) { return String(item['Campaign ID']) === id; });
    var byUser = work.reduce(function (groups, item) {
      var key = String(item['Assigned User ID'] || 'UNASSIGNED');
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
    var roster = Object.keys(byUser).map(function (userId) {
      var member = users[userId] || {};
      var items = byUser[userId];
      return {
        userId: userId,
        name: userId === 'UNASSIGNED' ? 'Unassigned' : NexaFlowRules.displayName(member['Display Name']),
        team: member.Team || '',
        total: items.length,
        queued: items.filter(function (item) { return String(item.Status) === 'QUEUED'; }).length,
        followUp: items.filter(function (item) { return String(item.Status) === 'FOLLOW_UP'; }).length,
        inProgress: items.filter(function (item) { return String(item.Status) === 'IN_PROGRESS'; }).length,
        closed: items.filter(function (item) { return String(item.Status) === 'CLOSED'; }).length
      };
    }).sort(function (left, right) { return right.total - left.total || left.name.localeCompare(right.name); });
    return nfSuccess({ campaign: nfPortalPublicCampaign_(campaign), roster: roster, requestedBy: user.id });
  } catch (error) {
    return nfPortalFailure_(error, 'CAMPAIGN_ROSTER');
  }
}
