/* Pure rules: tested locally with Node and reused by Apps Script. */
var NexaFlowRules = (function () {
  var OUTCOMES = ['ANSWERED', 'NO_ANSWER', 'VOICEMAIL', 'CALL_BACK', 'WRONG_NUMBER', 'OPT_OUT', 'NOT_ELIGIBLE'];
  var FOLLOW_UP_OUTCOMES = ['CALL_BACK', 'ANSWERED'];

  function text(value) { return String(value == null ? '' : value).trim(); }
  function normalizeOutcome(value) { return text(value).toUpperCase().replace(/[ -]+/g, '_'); }
  function durationSeconds(minutes, seconds) {
    var m = Number(minutes), s = Number(seconds);
    if (!Number.isInteger(m) || !Number.isInteger(s) || m < 0 || s < 0 || s > 59) return null;
    return m * 60 + s;
  }
  function requiresFollowUp(outcome) { return FOLLOW_UP_OUTCOMES.indexOf(normalizeOutcome(outcome)) !== -1; }
  function validateInteraction(input) {
    var errors = [], outcome = normalizeOutcome(input && input.outcome);
    if (!input || !text(input.workItemId)) errors.push('A work item is required.');
    if (OUTCOMES.indexOf(outcome) === -1) errors.push('Choose a valid disposition.');
    if (durationSeconds(input && input.durationMinutes, input && input.durationSeconds) === null) errors.push('Enter a valid duration.');
    if (text(input && input.notes).length < 3) errors.push('Enter notes of at least 3 characters.');
    if (requiresFollowUp(outcome) && !text(input && input.followUpAt)) errors.push('A follow-up date and time is required for this disposition.');
    if (outcome === 'OPT_OUT' && !text(input && input.optOutReason)) errors.push('Document the opt-out reason.');
    return { valid: errors.length === 0, errors: errors, outcome: outcome };
  }
  function score(metrics, rules) {
    metrics = metrics || {}; rules = rules || {};
    var calls = Number(metrics.calls) || 0, answered = Number(metrics.answered) || 0, verified = Number(metrics.verified) || 0;
    return Math.round(calls * (Number(rules.callPoints) || 1) + answered * (Number(rules.answerPoints) || 2) + verified * (Number(rules.verificationPoints) || 10));
  }
  function displayName(value) { return text(value).replace(/[<>]/g, '').slice(0, 80); }
  return { OUTCOMES: OUTCOMES, normalizeOutcome: normalizeOutcome, durationSeconds: durationSeconds, requiresFollowUp: requiresFollowUp, validateInteraction: validateInteraction, score: score, displayName: displayName };
})();
if (typeof module !== 'undefined') module.exports = NexaFlowRules;

