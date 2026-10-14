/** NexaFlow web-app entry point. No production IDs or endpoints belong here. */
function doGet(e) {
  var page = String((e && e.parameter && e.parameter.page) || 'portal').toLowerCase();
  var file = page === 'leaderboard' ? 'leaderboard' : 'index';
  return HtmlService.createTemplateFromFile(file)
    .evaluate()
    .setTitle(page === 'leaderboard' ? 'NexaFlow rankings' : 'NexaFlow')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

