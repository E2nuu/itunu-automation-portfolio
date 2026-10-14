const assert = require('node:assert/strict');
const fs = require('node:fs');
const files = ['code.gs', 'helpers.gs', 'rules.gs', 'portal.gs', 'reports.gs', 'operations.gs', 'analytics.gs', 'setup.gs', 'migration.gs', 'styles.html', 'index.html', 'leaderboard.html'];
files.forEach(file => assert.ok(fs.existsSync(`appsscript/${file}`), `${file} exists`));
const portal = fs.readFileSync('appsscript/portal.gs', 'utf8');
[
  'signIn', 'signOut', 'getBootstrap', 'getApplicationHealth',
  'getQueueSummary', 'listMyWork', 'claimNextWorkItem', 'claimWorkItem',
  'renewWorkLock', 'releaseWorkItem', 'getCustomerProfile', 'saveInteraction',
  'cancelFollowUp', 'recordReactivationVerification', 'assignWorkItem',
  'getNotifications', 'markNotificationRead', 'markAllNotificationsRead',
  'getMyDashboard', 'getExecutiveAnalytics', 'getTeamOperations',
  'saveConfiguration', 'getLeaderboard', 'getCustomerSearchResults',
  'getCustomerTimeline', 'getInteractionDetail', 'getCampaignDirectory',
  'getUserDirectory', 'rescheduleFollowUp', 'completeFollowUp',
  'reopenWorkItem', 'bulkAssignWorkItems', 'getQueueAging',
  'createCampaign', 'updateCampaignLifecycle', 'updateUserStatus',
  'getAuditSummary', 'runSyntheticDataIntegrityAudit', 'clearExpiredWorkLocks',
  'getAgentWorkspaceDetail', 'getTeamWorkspaceDetail',
  'getCampaignWorkspaceDetail', 'getSyntheticRetentionFunnel',
  'buildOperationalExport', 'createWorkItem', 'updateCustomerContext',
  'updateCustomerConsent', 'getWorkloadRecommendation',
  'getReactivationRegister', 'voidReactivationVerification',
  'getConsentRegister', 'getConfigurationCatalog',
  'updateConfigurationEntry', 'rotateSyntheticUserPassword',
  'getWorkbookSchemaStatus', 'getIntegrationStatus', 'getSessionContext',
  'getPortalNavigation', 'getNotificationDigest', 'getSyntheticDataCatalog',
  'runPortalReadinessSuite', 'getFollowUpDetail', 'getQueueSegmentSummary',
  'getCampaignRoster'
].forEach(fn => assert.match(portal, new RegExp(`function ${fn}\\(`)));
assert.match(portal, /nfWithLock/);
assert.match(portal, /Request ID/);
assert.match(portal, /MAX_LOGIN_ATTEMPTS/);
assert.match(fs.readFileSync('appsscript/index.html', 'utf8'), /textContent/);
assert.match(fs.readFileSync('appsscript/index.html', 'utf8'), /recordReactivationVerification/);
assert.match(fs.readFileSync('appsscript/styles.html', 'utf8'), /@media \(max-width: 700px\)/);
const reports = fs.readFileSync('appsscript/reports.gs', 'utf8');
['getFollowUpWorkspace', 'getCampaignPerformance', 'getTeamPerformance', 'getExecutiveReport'].forEach(fn => assert.match(reports, new RegExp(`function ${fn}\\(`)));
const operations = fs.readFileSync('appsscript/operations.gs', 'utf8');
['getAgentProgress', 'getCampaignExplorer', 'getExecutiveInsights', 'getAdministrationWorkspace', 'saveCampaign'].forEach(fn => assert.match(operations, new RegExp(`function ${fn}\\(`)));
const migration = fs.readFileSync('appsscript/migration.gs', 'utf8');
assert.match(migration, /function upgradeNexaFlowWorkspace\(/);
const analytics = fs.readFileSync('appsscript/analytics.gs', 'utf8');
['getCohortAnalysis', 'getAuditTimeline', 'getExecutiveExport'].forEach(fn => assert.match(analytics, new RegExp(`function ${fn}\\(`)));
console.log('contract.test.cjs: 28 checks passed');

