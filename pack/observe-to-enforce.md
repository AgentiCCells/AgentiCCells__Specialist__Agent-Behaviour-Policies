# From observe to enforce

How a policy moves from recording what an agent does to stopping what it must not do. **A proposal** by specialist.abp@AgentiCCells.dinis, 16 November 2026.

## Where we are

Every policy we run today is in observe mode, at Dinis's word, so teams could move fast while we learned where the real gaps were.

- **Web Summit:** from 6 November 2026 every ABP was in an "explorer phase": the policies "observe and recommend; they block nothing", and "the lock-down comes gently, one step at a time, and every step keeps an escape valve" ([Web Summit ABPs](https://web-summit.sgit.ai/abp/index.html)).
- **PrompTugal.news:** one global `"mode": "observe"` in `board/abp/policies.json` (v1.13.0), with a circuit breaker per rule, all off. Between 6 and 16 November its hooks saw 26,249 tool calls and logged 2,020 as would-have-denied, and blocked none of them (count by this specialist over the 2,344 run reports in `board/runs/`, at commit `a793f7d`). The only blocking happened under policy v1.0.0, for about 45 minutes on 6 November, before observe mode began.
- **Storm Charles:** a path check that runs from `release.sh` only, never in CI; its own header calls it "a setting, not a boundary" ([tools/policy-check.mjs](https://github.com/PrompTugal/PrompTugal__News__Storm-Charles/blob/90b13da7992ecab979be59ea70c0e3a6d22cd7e3/tools/policy-check.mjs)).

Observe mode worked as designed: it found the gaps. It also has a cost. At PrompTugal the request to switch on a breaker for push to `main`, force-push and printing a key has waited since 6 November, and observing has "no end date" (the team's own stocktake). The one rule that has failed so far, never push to `main`, failed in a team whose branch was unprotected (the Web Summit team, 2 November).

## The steps

1. **Measure the reach.** List what the agent's credentials can actually do. Most of a policy's work is done by taking things out of reach, not by writing rules about them.
2. **Write the policy in observe.** Every rule gets its barrier kind, honestly. Most will be `expectation` at first. Run `abp-check`: it prints the share that is hope.
3. **Observe for a set time, not for ever.** One week, or 500 runs, whichever comes first. Count, per rule: would-have-denied, real breaches, false alarms.
4. **Fix the false alarms first.** A rule that fires wrongly will be switched off the day it blocks. At PrompTugal 28 of the 30 push-to-main alarms were workers pushing to their own `work/<name>` branch, their mandated route; two thirds of all breaches were one agent working before its grant existed. Make the policy match the mandate before you enforce it.
5. **Move the first rules out of the agent's reach.** In this order, because each is cheap and none depends on the model:
   1. branch protection on `main` and `dev` (no force-push, no deletion, required checks);
   2. a narrow token per agent (one repository, the scopes the job needs);
   3. secrets kept out of the session (proxy-injected credentials; nothing printed);
   4. tools the agent does not need removed (sessions, scheduled tasks, connectors).
6. **Then switch on breakers, one rule at a time,** for the rules that a hook can hold and that showed no false alarms in step 3. Say which, with the evidence, and wait for the person's word.
7. **Keep an escape valve at every step:** a person can still do the thing by hand, or ask on the record for the grant to widen. An escape valve used is a record, not a failure.
8. **Let a breach decide.** If a rule in observe is broken for real, it becomes a boundary the same day. That is how the push to `main` became branch protection.

## The trigger, written down

Each policy says, in its "Observe to enforce" section: which rules go first, what triggers the change (the person's word, the end of the observe period, or the first breach), and the escape valve. A policy without that section stays in observe for ever, which is the failure we are fixing.
