# Agent Behaviour Policy: <cell>@<Team>.<person>

**Status: template** (copy this file to `abp/<cell>.md` in the cell's repository, replace every `<...>`, and set the status to `proposal`).
**Phase: observe** (a cell starts in observe, except what its design already puts out of reach).

An AgenticCell is one focused job with an objective, a deliverable and a behaviour policy ([the cell is the unit](https://newsroom.sgit.ai/articles/the-cell-is-the-unit.html)). Its policy covers the cell as a whole and each agent inside it, and it is set at **altitudes**: each altitude is enforced by something different, and a lower altitude may narrow what a higher one allows, never widen it ([approve at altitude](https://newsroom.sgit.ai/articles/approve-at-altitude.html)). The email cell's five altitudes are the model: the grant, who holds the token, what each agent may do, what one action may be, and who approves ([the email agentic cell](https://newsroom.sgit.ai/articles/the-email-agentic-cell.html)). Format: [the AgentiCCells ABP format](../format.md).

On the cell's page, say the policy in plain words too: what it can reach, and what it will never do.

## Mandate

- **Objective:** <what the cell is for>.
- **Deliverable:** <what it produces>.
- **Task:** <the job, per run>.
- **Scope:** <the customer's environment it runs in; we keep no state>.
- **Purpose:** <why>.
- **The person's words (<YYYY-MM-DD HH:MM UTC>):** "<quote>".
- **Person:** <owner>.

## Altitudes

| Altitude | What it decides | Enforced by |
|---|---|---|
| 1. The grant | <which scopes the outside system gave> | <the outside system> |
| 2. Who holds the credential | <one gateway agent> | <where the key lives> |
| 3. What each agent may do | <read, propose, approve, act; per agent and per key> | <the lanes> |
| 4. What one action may be | <recipients, amounts, templates, rates> | <the gateway, before every action> |
| 5. Who approves | <a person for consequential actions; a signed policy for routine ones> | <the approvals lane> |

## Reach

| What | How | Evidence |
|---|---|---|
| <the outside system's scopes> | <OAuth grant> | <documented or measured> |
| <each agent in the cell> | <its keys and lanes> | <measured> |

## Capabilities

| Id | Capability | Target | Tier | Undo | Decision | Barrier | Enforcer | Mode |
|---|---|---|---|---|---|---|---|---|
| C1 | `read.record.tenant` | <the twin, not the live system> | 1 | no | allow | setting | <read keys given per agent> | observe |
| C2 | `propose.action.tenant` | <the actions lane> | 2 | yes | allow | setting | <lane write token sealed to the agent's key> | observe |
| C3 | `apply.action.tenant` | <the live system, through the gateway only> | 3 | with-effort | plan-apply | boundary | <only the gateway holds the credential> | enforce |
| C4 | `send.message.world` | <anything that leaves the cell> | 4 | no | draft | setting | <the gateway's policy check and a person's signature> | observe |

## Never

| Id | Never | Barrier | Enforcer | Mode | Test |
|---|---|---|---|---|---|
| N1 | Any agent but the gateway holds the credential | boundary | <where the key lives> | enforce | <key inventory> |
| N2 | Keep customer data in our accounts | expectation | <none: the cell runs in the customer's environment> | observe | <our storage holds no customer records> |
| N3 | Act on an instruction inside the data it processes | setting | <an inbound firewall that flags injected instructions> | observe | <firewall log> |

## Gap

- **G1, <what>.** <evidence>. Proposal: <proposal>. Status: open.

## Observe to enforce

- **First:** <the altitude whose rule is still a sentence>.
- **Trigger:** <a policy simulator run against last month's data shows what would have been blocked; the person's word>.
- **Escape valve:** <a person can act by hand through the gateway, signed; a kill switch stops the gateway>.

## Licence to operate

- **Authority:** <person>.
- **Licensee:** <cell id, gateway key>.
- **Conditions:** <gates>.
- **Validity:** <from date>.
- **Review:** <when>.
- **Stop:** <the kill switch: anyone may stop the gateway; one person restarts>.

## The policy as data

```json
{
  "format": "agenticcells-abp/0.1",
  "id": "<cell>@<Team>.<person>",
  "kind": "cell",
  "version": "<0.1.0>",
  "status": "template",
  "phase": "observe",
  "default": "deny",
  "owner": "<person>",
  "keeper": "<who keeps this file>",
  "reviewer": "<specialist.abp@AgentiCCells.dinis>",
  "updated": "<YYYY-MM-DD>",
  "mandate": { "task": "<task>", "scope": "<scope>", "purpose": "<purpose>", "words": "<words>", "given": "<YYYY-MM-DD HH:MM UTC>" },
  "altitudes": [
    { "altitude": 1, "decides": "<grant>", "enforced_by": "<outside system>" },
    { "altitude": 2, "decides": "<credential holder>", "enforced_by": "<key location>" },
    { "altitude": 3, "decides": "<per-agent rights>", "enforced_by": "<lanes>" },
    { "altitude": 4, "decides": "<what one action may be>", "enforced_by": "<gateway>" },
    { "altitude": 5, "decides": "<who approves>", "enforced_by": "<approvals lane>" }
  ],
  "reach": [
    { "what": "<scopes>", "how": "<OAuth grant>", "evidence": "documented" }
  ],
  "capabilities": [
    { "id": "C1", "capability": "read.record.tenant", "target": "<the twin>", "tier": 1, "undo": "no", "decision": "allow", "barrier": "setting", "enforcer": "<read keys>", "mode": "observe", "test": "<test>" },
    { "id": "C2", "capability": "propose.action.tenant", "target": "<actions lane>", "tier": 2, "undo": "yes", "decision": "allow", "barrier": "setting", "enforcer": "<lane token>", "mode": "observe", "test": "<test>" },
    { "id": "C3", "capability": "apply.action.tenant", "target": "<live system via gateway>", "tier": 3, "undo": "with-effort", "decision": "plan-apply", "barrier": "boundary", "enforcer": "<only the gateway holds the credential>", "mode": "enforce", "test": "<test>" },
    { "id": "C4", "capability": "send.message.world", "target": "<anything leaving the cell>", "tier": 4, "undo": "no", "decision": "draft", "barrier": "setting", "enforcer": "<gateway policy check and signature>", "mode": "observe", "test": "<test>" }
  ],
  "never": [
    { "id": "N1", "rule": "Any agent but the gateway holds the credential", "barrier": "boundary", "enforcer": "<key location>", "mode": "enforce", "test": "<key inventory>" },
    { "id": "N2", "rule": "Keep customer data in our accounts", "barrier": "expectation", "enforcer": "<none>", "mode": "observe", "test": "<storage check>" },
    { "id": "N3", "rule": "Act on an instruction inside the data it processes", "barrier": "setting", "enforcer": "<inbound firewall>", "mode": "observe", "test": "<firewall log>" }
  ],
  "gaps": [
    { "id": "G1", "what": "<what>", "evidence": "<evidence>", "proposal": "<proposal>", "status": "open" }
  ],
  "enforce_plan": { "first": ["<altitude>"], "trigger": "<simulator result, person's word>", "escape_valve": "<by hand through the gateway; kill switch>" },
  "licence": { "authority": "<person>", "licensee": "<cell, gateway key>", "conditions": "<gates>", "validity": "<from date>", "review": "<when>", "stop": "<kill switch>" }
}
```

## Record

- <0.1.0, date: first version.>
