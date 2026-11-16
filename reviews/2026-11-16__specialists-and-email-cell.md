# Review: the five other specialists and the email cell

- **Request:** [2026-11-16, from Dinis's brief](requests/2026-11-16__specialists-and-email-cell.md).
- **Reviewer:** specialist.abp@AgentiCCells.dinis, 16 November 2026.
- **Read:** each repository at its seed commit (`README.md`, `REALITY.md`, `CLAUDE.md`, `hub.json`, `src/index.html`, `scripts/`), the article [Specialist agents for every team](https://newsroom.sgit.ai/articles/specialist-agents-for-every-team.html), and, for the email cell, [The email agentic cell](https://newsroom.sgit.ai/articles/the-email-agentic-cell.html).

## Verdict

**Not ready, as expected on day one:** none of the six has a behaviour policy. All six now have a proposed one, in [proposals/](../proposals/README.md), that passes `abp-check`. Each team's first job is to measure its own reach and ask its person to approve.

## Checker result

```
proposals/code/abp.md:       specialist.code@AgentiCCells.dinis 0.1.0 proposal, mixed; 23 rules: boundary 2, setting 6, expectation 15
proposals/design/abp.md:     specialist.design@AgentiCCells.dinis 0.1.0 proposal, mixed; 23 rules: boundary 2, setting 6, expectation 15
proposals/email-cell/abp.md: cell.email@AgentiCCells.dinis 0.1.0 proposal, observe; 14 rules: boundary 5, setting 7, expectation 2
proposals/security/abp.md:   specialist.security@AgentiCCells.dinis 0.1.0 proposal, mixed; 25 rules: boundary 2, setting 8, expectation 15
proposals/ux/abp.md:         specialist.ux@AgentiCCells.dinis 0.1.0 proposal, mixed; 23 rules: boundary 2, setting 5, expectation 16
proposals/writing/abp.md:    specialist.writing@AgentiCCells.dinis 0.1.0 proposal, mixed; 23 rules: boundary 2, setting 7, expectation 14
OK
```

About two thirds of each specialist's rules are expectations: rules only the agent keeps. That is honest for day one and is the number to bring down. The email cell is the other way round, because its design already puts the dangerous things out of reach.

The checker also caught a fault in the first draft of the writing specialist's policy: sending in a person's name was marked "draft" with only an expectation in the way, which is exactly the shape of the [9 October emails signed "Dinis"](../mistakes/README.md#3-two-emails-signed-dinis). Sending is now denied and drafting is its own row. The agent template had the same trap and was fixed the same way.

## Findings that apply to all five specialists

They were seeded from the same template, so they share a shape, and they share its gaps.

1. **Must fix before release: no policy.** `CLAUDE.md` holds the rules, but every rule in it is an expectation. Proposed: the drafts in [proposals/](../proposals/README.md). (Principle [1](../guidance/README.md#1-a-policy-says-four-things-reach-mandate-gap-barrier).)
2. **Must fix: `dev` is unprotected, and the gates live in the repository the agent writes.** The validator, leak scan and workflow can be edited by the agent they gate. Proposed: protect `dev` (no force-push, no deletion, the Pages workflow required), and CODEOWNERS on `scripts/` and `.github/workflows/` needing Dinis. (Principle [11](../guidance/README.md#11-keep-the-rules-out-of-the-reach-of-the-agents-they-bind); mistake [1](../mistakes/README.md#1-the-push-to-main-a-rule-that-failed-because-it-was-only-a-rule).)
3. **Must fix: the account can push to about 200 repositories.** Measured on this specialist's session; the others share the account, so it is inferred for them. A consultant needs write on one repository and comments on the rest. Proposed: a fine-grained token per specialist. (Principle [9](../guidance/README.md#9-make-the-dangerous-thing-unreachable).)
4. **Should fix: starting sessions and scheduled tasks is in reach,** with only a sentence in the brief against it. Proposed: remove those tools from specialists that do not need them. (Principle [17](../guidance/README.md#17-starting-sessions-and-scheduled-tasks-is-its-own-capability).)
5. **Should fix: nothing reads `board/HOLD.md`.** `CLAUDE.md` says never work while it exists, but `release.sh` does not check it. Proposed: two lines in the template's `release.sh`, through the site factory, so every seeded repository gets them. Not made here: it changes a shared gate, and the factory owns the template.
6. **Should fix: no agent has a key of its own.** Commits are signed by the session's signer and named by the `Agent:` trailer, which is the agent's own word. (Principle [23](../guidance/README.md#23-a-key-per-agent-session-a-name-is-not-an-identity).)
7. **Worth considering: every site says "the review lane is not wired yet".** That is true and honest. Until it is, the file-based request in [reviews/](README.md) works for any specialist; each could copy it.

## Findings for each team

- **Code.** The risk is helpfulness: a reviewer that can push will be tempted to fix a failing gate. N10 forbids changing another team's gate, test or workflow, and has a test. Running a team's tests in this session executes their code next to the session's credentials (G4); prefer reading their CI results. [Draft](../proposals/code/abp.md).
- **Design.** The risks are licences and people in pictures, not credentials. N10: no third-party asset without a licence and a source line; N11: no picture of a person without their agreement. [Draft](../proposals/design/abp.md).
- **UX.** The specialist most likely to touch the outside world by accident: a walkthrough that clicks Subscribe sends a real email. N10 and G4 (block form submissions on live sites) should be the first enforce steps. Synthetic readers are labelled as such (N11). [Draft](../proposals/ux/abp.md).
- **Security.** Separation of duty: it finds, the owner fixes (N11), Dinis decides holds (C12, N13). A secret it finds is reported by path, line and kind, never copied (N10). Before it publishes its first review: an open finding on a public site is a map for an attacker (G5). It reviews our own estate only (N12). [Draft](../proposals/security/abp.md).
- **Writing.** Born of the 9 October mistake: never a person's first person or signature in anything that leaves the team (N10), and a checker hook on drafts that use a person's voice (G4). [Draft](../proposals/writing/abp.md).
- **Email cell.** The best-shaped of the six: its design makes the token holder, the send path and the kill switch boundaries from the first line of code. Three things to settle before the first mailbox is synced: the build session must never see the OAuth client secret (G1); our own inboxes hold other people's mail (G2); whether an encrypted twin counts as storing restricted data is for Google's process to answer (G3). Altitude 4 is the cell's point, and it is a sentence until the gateway exists, so build the policy check before the send path (G4). Each agent inside the cell gets its own agent policy once it exists. [Draft](../proposals/email-cell/abp.md).

## What this review did not check

- None of the five specialists' sessions was inspected; their reach is inferred from this specialist's own, measured on the same account and seed. Each team should measure its own and change the evidence column.
- No branch protection, token scope or CODEOWNERS setting was changed anywhere: each is a proposal to Dinis.
- The email cell's Google requirements are taken from the article, which read Google's documentation on 16 November 2026; they were not re-checked.
- Nothing was pushed to, or commented on, any of the six repositories.
