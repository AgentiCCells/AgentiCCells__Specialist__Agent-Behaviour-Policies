# The AgentiCCells ABP format, version 0.1

One way to write an Agent Behaviour Policy, for an agent, a pipeline or an AgenticCell. **A proposal** by specialist.abp@AgentiCCells.dinis, 16 November 2026, until Dinis Cruz approves it.

It is not new. It joins three things that already worked, so that a policy written by any team reads, and checks, the same way:

- **The model** from RiskMandate and abp.sgit.ai: grant (reach), mandate, gap, barrier; capabilities as `verb.object.reach`; four barrier kinds, of which only a boundary is a control ([what is an ABP](https://riskmandate.ai/article-what-is-an-abp.html)).
- **The page** from the Web Summit team: Reach, Mandate, Gap, Barriers, Licence to Operate, Provenance, and a Phase line ([the conductor's ABP](https://web-summit.sgit.ai/abp/conductor-web-summit-dinis/index.html)).
- **The data** from PrompTugal.news: deny by default, a grant per agent, rules in observe mode with a breaker per rule, and a check that reads the same file people read ([board/abp/policies.json](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/policies.json)).

## The page, in this order

1. **Title:** `# Agent Behaviour Policy: <id>`.
2. **Status line:** `**Status: proposal**` (or `template`, `approved`, `retired`). A policy is a proposal until its person approves it.
3. **Phase line:** `**Phase: observe**` (or `enforce`, `mixed`). Say plainly whether anything blocks.
4. **Mandate:** task, scope, purpose, and the person's own words with the time they were given. The mandate is written by a person, never by the agent alone.
5. **Reach:** what the agent can actually do, each line with how and with its evidence: `measured` (probed), `observed` (seen in a run), `documented` (the vendor says so), `inferred`, or `not-checked`. Reach is measured, not assumed.
6. **Capabilities:** one row per capability, with tier, undo class, decision, barrier, enforcer, mode and test (below).
7. **Never:** one rule per row, each with its barrier, enforcer, mode and a test anyone can run.
8. **Gap:** what the agent can reach beyond its mandate. Derived from reach and mandate, never invented; each gap with evidence, a proposal and a status (`open`, `closed`, or `accepted` by a named person).
9. **Observe to enforce:** which rules become boundaries first, what triggers it, and the escape valve.
10. **Licence to operate:** authority, licensee (agent, session, key), conditions, validity, review, and who can stop it.
11. **The policy as data:** one JSON block that says what the tables say. `scripts/abp-check.mjs` reads it.
12. **Record:** the version history.

## The words, defined once

| Field | Values | Meaning |
|---|---|---|
| `kind` | agent, pipeline, cell | what the policy binds |
| `default` | deny | anything not listed is not allowed; there is no other value |
| capability | `verb.object.reach` | reach is one of self, project, host, tenant, world; use one of the [23 RiskMandate ids](https://github.com/Risk-Mandate/riskmandate.ai/blob/9160c6af92b161821d68230131ca4f64155a51d3/vaults-instances/claude-gmail-connector--customer-draft/data/vocabulary/capabilities.json) where one fits |
| `tier` | 1, 2, 3, 4 | 1 assist (read, summarise); 2 change its own work; 3 change a system of record (shared repository, CRM, DNS, a live release); 4 irreversible to the world (send, publish, spend) ([where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html)) |
| `undo` | yes, with-effort, no | can the same actor undo it without loss; at a cost; not at all. Reading is `no`: what was read can be repeated |
| `decision` | allow, draft, plan-apply, deny | tier 3 is never `allow` (plan, then something above the agent applies); tier 4 is never `allow` (a draft that a person acts on) |
| `barrier` | nothing, expectation, setting, boundary | what really stands in the way: nothing; a rule in prose that only the agent keeps; a switch the agent's own account can flip; something enforced above the grant |
| `enforcer` | text | who or what enforces it; for a boundary, something the agent's grant does not include |
| `mode` | observe, enforce | observe records and allows; enforce blocks. An `expectation` cannot be in enforce mode: nothing outside the agent can block it |
| `test` | text | how anyone checks the rule held, without asking the agent |

## What the checker refuses

`node scripts/abp-check.mjs` fails a policy that: has no data block or a block that does not parse; is not `default: deny`; leaves a required field empty; uses a word outside the lists above; allows a tier 3 or tier 4 capability; claims `enforce` for a rule with no enforcer; names the agent itself as the enforcer of a boundary; leaves an irreversible tier 3 or 4 capability open without a boundary; packs several rules into one row; accepts a gap without naming who accepted it; marks itself approved without saying who approved it, or is kept by the agent it binds; or whose page does not state the status and phase that its data states. It prints, for each policy, how many of its rules are boundaries, settings, expectations and nothing: the share of the policy that is hope.

## Why each rule of the format

Each comes from something that went wrong or right; see [the principles](../guidance/README.md) and [the mistakes](../mistakes/README.md).
