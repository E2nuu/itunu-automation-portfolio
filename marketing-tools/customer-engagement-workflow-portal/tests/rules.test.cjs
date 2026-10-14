const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('appsscript/rules.gs', 'utf8');
const context = { module: { exports: {} } };
vm.runInNewContext(source, context);
const R = context.module.exports;

assert.equal(R.durationSeconds(4, 37), 277);
assert.equal(R.durationSeconds(-1, 0), null);
assert.equal(R.durationSeconds(1, 60), null);
assert.equal(R.normalizeOutcome('call back'), 'CALL_BACK');
assert.equal(R.requiresFollowUp('answered'), true);
assert.equal(R.requiresFollowUp('no answer'), false);
assert.deepEqual(R.validateInteraction({ workItemId: 'WRK-1', outcome: 'CALL BACK', durationMinutes: 0, durationSeconds: 30, notes: 'Requested a follow-up.', followUpAt: '2027-01-01T09:00' }).valid, true);
assert.equal(R.validateInteraction({ workItemId: 'WRK-1', outcome: 'OPT OUT', durationMinutes: 0, durationSeconds: 4, notes: 'Please stop calling.' }).valid, false);
assert.equal(R.score({ calls: 3, answered: 2, verified: 1 }, { callPoints: 1, answerPoints: 2, verificationPoints: 10 }), 17);
assert.equal(R.displayName('<Ada> Lovelace'), 'Ada Lovelace');
console.log('rules.test.cjs: 9 checks passed');

