# Examples: the best policies we have, and why

Read 16 November 2026. None of these is in the AgentiCCells format yet (it is new); each shows one thing done well. Links point at the published page or at a pinned commit.

## Whole policies

| Policy | What it does well | Watch out for |
|---|---|---|
| [Web Summit conductor's ABP](https://web-summit.sgit.ai/abp/conductor-web-summit-dinis/index.html) | Measured reach (environment variables by name only), a mandate in three parts, gaps with dates and issue numbers, a barrier table with kind and evidence, its own failure recorded, a licence to operate, a phase line. The team's template. | Observe only; `dev` still unprotected. |
| [PrompTugal `place.faro`](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/place.faro.md) (and the other town agents) | Four exact paths for one place; its own site key signs its own data file, machine-checked ("36 of 36 places pass"); a never list with named hosts. 20 town folders: 233 runs, 34 attempts, 8 breaches. | `content/articles/*.md` is shared by 20 roles, so "never writes another place's file" does not hold for articles. |
| [PrompTugal `outreach`](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/outreach.md) | One folder; one testable never ("sends an email or posts: a person does") backed by an empty `send_hosts`. | |
| [PrompTugal `security`](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/security.md) | Two paths; owns `board/HOLD.md`, which nobody else may write; may not fix what it finds in others' paths: separation of duty. | |
| [Storm Charles librarian's ABP](https://github.com/PrompTugal/PrompTugal__News__Storm-Charles/blob/90b13da7992ecab979be59ea70c0e3a6d22cd7e3/agents/librarian/policy.md) | The clearest Reach, Mandate, Gap and Barriers page, with each barrier's kind, and an honest "DRAFT, NOT AGREED" header. | |
| [Newsroom behaviour policies](https://newsroom.sgit.ai/newsroom/policies.html) | Generated from the same role files the checker reads: "this table and the check cannot disagree". Three principles: create anywhere, edit your own; one owner for each shared surface; flag, do not fix. | |

## Parts worth copying

- **The data file and its checks:** PrompTugal's [`policies.json`](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/policies.json): deny by default, a `protected[]` list where every entry has an owner and a reason, a breaker per rule, fixture tests for the hook (183 at v1.9.0), a hash pin on the hook, re-anchoring on compaction.
- **The run report:** PrompTugal's [`run-report.schema.json`](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/run-report.schema.json): per run, the policy version and hash, tool calls by kind, would-have-denied attempts with rule and target, breaches, compactions and whether they were re-anchored. It stores a hash and a redacted head of each prompt, never the full text. (Missing: a mode field.)
- **The vocabulary:** RiskMandate's [23 capabilities](https://github.com/Risk-Mandate/riskmandate.ai/blob/9160c6af92b161821d68230131ca4f64155a51d3/vaults-instances/claude-gmail-connector--customer-draft/data/vocabulary/capabilities.json), each with verb, object, reach, undo class and gloss, and its derived [delta](https://github.com/Risk-Mandate/riskmandate.ai/blob/9160c6af92b161821d68230131ca4f64155a51d3/vaults-instances/claude-gmail-connector--customer-draft/data/delta.json).
- **One rule as a page:** RiskMandate's [push-anywhere](https://github.com/Risk-Mandate/riskmandate.ai/blob/9160c6af92b161821d68230131ca4f64155a51d3/site/rules/push-anywhere.md), with a line a person can paste: "Push only to the branch I named; never push to main or force-push, and ask before pushing anywhere else or opening a pull request."
- **Altitudes:** the email cell's five ([the email agentic cell](https://newsroom.sgit.ai/articles/the-email-agentic-cell.html)), the model for [the cell template](../pack/templates/cell.md).
- **Measured reach, before and after a harness:** the Swarm's [harness reach file](https://github.com/PrompTugal/PrompTugal__News__Swarm/blob/354379e954d478137e7ddc3b270e61c7d195e062/harness/2026-11-12-harness1-e6-reach.json): mandate, reach unharnessed and harnessed, and what the harness closed.
- **A scoreboard:** Web Summit's [ABP in action](https://web-summit.sgit.ai/abp/in-action/index.html) after five days and about 85 agents: 7 caught by review, 7 found by an ABP and fixed, 1 rule turned into a technical barrier, 6 still open.

## In this format

- [This specialist's own policy](../abp/specialist-abp.md).
- The [proposals for the five other specialists and the email cell](../proposals/README.md).
