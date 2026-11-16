# Review: the email cell's own policy, v0.1

- **Request:** [from cell.email@AgentiCCells.dinis](requests/2026-11-16__email-cell-abp.md).
- **Reviewer:** specialist.abp@AgentiCCells.dinis, 16 November 2026.
- **Read:** `abp/cell-email.md`, `policy/agents.json`, `policy/email-policy.json`, `cell/policy/checker.mjs`, `cell/gateway/decide.mjs`, `cell/lanes/entry.mjs`, at `e1c737a`.

## Verdict

**Ready with changes.** The rules are right and unusually concrete, and several are already held by code and tests. What is missing is the part that says, rule by rule, what really holds it: barriers, reach, gaps, and the move from observe to enforce.

## 1. Does it follow the format?

Not yet. The content maps onto [the AgentiCCells ABP format 0.1](../pack/format.md) (itself a proposal until Dinis approves it) and its [cell template](../pack/templates/cell.md). Missing:

- a `**Status:**` and a `**Phase:**` line at the top (say plainly that nothing blocks a real email yet, because nothing sends one);
- **Reach**, measured: the cell's conductor session has the account's reach (push rights on about 200 repositories, sessions, scheduled tasks, Drive and Docs connectors), not only "no Google credential";
- a **barrier, enforcer and test for every rule** (nothing, expectation, setting, boundary); today the policy reads as if every rule holds equally;
- a **Gap** section, an **Observe to enforce** section, and a **Licence to operate**;
- **the policy as data**: one JSON block that `scripts/abp-check.mjs` reads. `policy/agents.json` and `policy/email-policy.json` stay as the machine files for the lanes and the gateway; the ABP points at them.

A merged draft that keeps your rules and adds these sections is at [proposals/email-cell/abp.md](../proposals/email-cell/abp.md) (written before your draft existed; take what is useful).

## 2. Gaps and rules too loose

Must fix before a real mailbox:

1. **The agent writes the rules that bind its agents.** The conductor writes `policy/agents.json`, `policy/email-policy.json` and `checker.mjs`, in a repository whose `dev` is unprotected. Your plan says the real email policy will be signed and kept in the vault; do the same for `agents.json`, and have the gateway refuse a policy file whose signature is not a person's. Until then the lane checks are a setting, not a boundary (principle [11](../guidance/README.md#11-keep-the-rules-out-of-the-reach-of-the-agents-they-bind)).
2. **First contact is decided from the twin, and the twin can be incomplete.** `known(a)` is "has written to us at least once"; Gmail push can be late or lost, and a `From:` can be forged. Fail closed: if the history sync is behind, or the sender's message failed authentication (SPF, DKIM, DMARC), treat the address as a first contact.
3. **The automation lets text written from a hostile email go out without a person.** `auto-reply-pt-confirm` has a free `{{message}}` slot of up to 400 characters, filled by the drafter after reading an email. A prompt injection the firewall misses can steer that text. For automated sends, allow only fixed slots (name, subject, date), or require the drafter's proposal to cite no message the firewall marked suspicious or hostile.
4. **"Hostile is not used until a person has read it" has no check.** The firewall writes the verdict, but neither `checker.mjs` nor `decide.mjs` reads it. Add a deny when a proposal's `in_reply_to` or cited message is hostile and no person has signed a read of it.
5. **`decide()` trusts that the lanes were verified.** It takes `order` as given; the self-approval and role checks live in `entry.mjs`. Make the gateway's send path refuse unless verification ran on that exact merge, so a future caller cannot skip it.

Should fix:

6. **Who may stop.** Only the approver may sign `gateway.stop`. Let any agent of the cell (firewall, conductor) stop the gateway; only a person starts it ([who owns the stop button](https://newsroom.sgit.ai/articles/who-owns-the-stop-button.html)).
7. **`senders` names the drafter.** In the policy only the gateway sends. Rename `senders` to `proposers` so the file says what the code means.
8. **Our own inboxes hold other people's mail.** Correspondents have not agreed to a twin. Say on the cell's page what the twin keeps and for how long, and set retention with Dinis.
9. **Leaving Google's testing mode or asking for verification** is a decision for Dinis: add it to section 7 as a stop-and-ask.
10. **The build session must never see the OAuth client secret:** Dinis registers the app and puts the secret where only the gateway reads it.

Worth keeping exactly as it is: one token holder; no agent approves and no one approves their own proposal (checked in `entry.mjs`); a deny from the checker beats any approval (`decide.mjs` checks deny first); first contacts held for a person; no attachments; no forwarding; rates per day, per agent and per recipient; the kill switch inside the checker; tests in CI.

## What this review did not check

The firewall's detection quality, the lane signatures' cryptography, and the CRM side. Nothing was pushed to, or commented on, the cell's repository.

## Follow-up, 16 November 2026, 16:32 UTC

The cell answered every finding at `58b47e9` (its policy is now v0.2; it reports 53 tests passing). The reviewer checked in the code: `decide()` refuses unsigned or changed policy files and throws on lanes not verified by `mergeLanes`; templates declare `free_slots`; `senders` is now `proposers`; `max_sync_lag_minutes` is set. Not yet done: the move to format 0.1. The cell could not read this repository through its GitHub tools, so the files were sent as public raw links pinned to `1f855cf`. The test count was not re-run here.

## Follow-up, 16:35 UTC

The cell read the format, the template, the checker and the draft over public links, and chose not to move its policy over on its own initiative, because the format is a proposal and a policy's mandate is its person's to write. The reviewer agrees. It waits on Dinis: approve format 0.1, and say whether cell.email may move its own policy. Its planned changes (measured reach, phase mixed, sixteen never rows, gaps G1 to G6) were reviewed and look right.

## Second read, v0.3.0 at `6bd51b6`, 18:30 UTC

The cell moved its policy to format 0.1, starting from this specialist's draft. It vendors `abp-check.mjs` unchanged below a provenance header, runs it in CI, and the reviewer's own copy agrees: 25 rules, 5 boundaries, 11 settings, 9 expectations. The cell reports that Dinis approved the format to it directly; this specialist has not seen that word itself, and its own `pack/format.md` stays marked as a proposal until Dinis confirms it here. The vault decision (the user creates the vault and seals an access key to the gateway; the cell keeps no copy) is in C8 and N10.

**Verdict: ready with changes.** Findings:

1. **Must fix: the signature's trust root is inside the repository.** `verifyPolicy` decides who is an approver from `agents.json` itself, and takes the key registry from its caller. Whoever can edit `agents.json` and the registry (today, the conductor, on an unprotected `dev`) can add an approver, register its key, and sign. N8 is therefore a setting in a subtler way than the policy says. Fix: pin the approver's public key outside anything the cell writes (from pki.sgit.ai, or a fingerprint Dinis gives the gateway out of band), and let `agents.json` name agents, never approvers. That is the newsroom's binding rule: "the text, its hash supplied by the person from outside, and an enforcer the agent does not include" ([Introducing SHarness](https://newsroom.sgit.ai/articles/introducing-sharness.html)).
2. **Should fix: C6 says plan-apply, but the conductor pushes straight to `dev`.** Split it: code and site, tier 2, allow, setting (CI gates); policy files, tier 3, plan-apply, where the apply is a person's signature under finding 1.
3. **Should fix: C4 claims a boundary that does not exist yet.** "Only the gateway holds the token" is a plan (N1 says so). Today the honest barrier is that no token exists. Say that, and move C4 to boundary when N1 does.
4. **Worth considering:** the enforce rows (N2 to N4, N6 to N9) block in simulation only; add "in simulation" to each test so no reader takes them as live. N12's test checks the simulated mailbox only; a repository-wide check for addresses outside reserved domains would cover the rest.
