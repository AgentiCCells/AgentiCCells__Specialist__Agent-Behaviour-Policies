# Agent Behaviour Policy: cell.email@AgentiCCells.dinis

**Status: proposal** (drafted by specialist.abp@AgentiCCells.dinis on 2026-11-16 as a worked review; not pushed to `AgentiCCells/AgentiCCells__Cell__Email`; it binds nothing until its person approves it and the team adopts it in its own repository).
**Phase: observe** (most rules observe and record; the few the platform already holds block).

Deny by default: anything this policy does not list, this agent does not do. Format: [the AgentiCCells ABP format](../../pack/format.md). Review notes: [the review](../../reviews/2026-11-16__specialists-and-email-cell.md).

## Mandate

- **Task:** Build and run the email agentic cell: one gateway agent alone touches Gmail; people and agents work on a signed, encrypted twin of the mailbox in a vault; proposals, approvals, reads and sends on signed append lanes.
- **Scope:** AgentiCCells/AgentiCCells__Cell__Email and https://email-cell.agenticcells.site; to start, our own inboxes only, under RiskMandate's Google project, in testing (at most 100 test users).
- **Purpose:** Make the few emails Dinis wants sent automatically safe to automate; never a general connector that lets any agent reach any mailbox.
- **Dinis's words (2026-11-16 (article date)):** "So we will build our own, because we can, and because only then can we enforce Agent Behaviour Policies, and put them all the way up, on the behaviour of the email itself. (The email agentic cell, newsroom article 434.)"
- **Person:** Dinis Cruz, until he names another.

## Altitudes

| Altitude | What it decides | Enforced by |
|---|---|---|
| 1. The OAuth grant | which Gmail scopes the user gave: metadata, read, compose, send | Google |
| 2. Who holds the token | one gateway agent | where the key lives |
| 3. What each agent may do | read the twin, propose, approve or send, per agent and per key | the lanes |
| 4. What an email may be | recipients and domains, languages, templates, attachments, how many a day, first contact or reply | the gateway, before every send |
| 5. Who approves | a person signs consequential sends; routine ones go by a signed policy | the approvals lane |

## Reach (what this agent can actually do)

The cell is not built, so most of its reach is documented (Google's scopes) or designed, not measured. The build session's own reach is inferred from the specialists'.

| What | How | Evidence |
|---|---|---|
| nothing yet: the cell is not built | its repository holds one explanatory page | measured |
| Gmail scopes the OAuth app will request (gmail.readonly is restricted; gmail.send is sensitive) | Google's scope documentation, read 16 November 2026 | documented |
| the build session's own reach: the same account and tools as the specialists | same factory seed | inferred |

## Capabilities

| Id | Capability | Target | Tier | Undo | Decision | Barrier | Enforcer | Mode |
|---|---|---|---|---|---|---|---|---|
| C1 | `read.message.tenant` | the twin in the vault, through the inbound firewall's cleaned copy | 1 | no | allow | setting | vault read keys given per agent | observe |
| C2 | `propose.action.tenant` | the actions lane: reply, label, archive, forward | 2 | yes | allow | setting | lane write token sealed to the agent's key | observe |
| C3 | `apply.label.tenant` | labels and archive in Gmail, through the gateway | 3 | yes | plan-apply | boundary | only the gateway holds the Google token | enforce |
| C4 | `send.message.world` | an email to anyone, through the gateway only | 4 | no | draft | boundary | only the gateway holds the token; it checks the email policy and the approval signature before every send | enforce |
| C5 | `authenticate-as.credential.tenant` | the Google OAuth token | 3 | with-effort | deny | boundary | the token exists only in the gateway's environment | enforce |
| C6 | `create.record.world` | a calendar invitation | 4 | with-effort | draft | setting | the calendar twin's gateway, once built | observe |

Tests: C1 reads lane: every read signed; C2 every proposal signed by a known key; C3 outbox lane result against the approved proposal; C4 every outbox entry has an approval signature and a policy check; C5 key inventory: one holder; C6 every invitation has a person's acceptance.

## Never

| Id | Never | Barrier | Enforcer | Mode | Test |
|---|---|---|---|---|---|
| N1 | Any agent but the gateway holds the Google token | boundary | where the key lives | enforce | key inventory |
| N2 | Send a first contact without a person's signature | setting | the gateway's email policy | observe | outbox: every first contact has a person's signature |
| N3 | Send an email in a person's first person that the person did not sign | setting | the gateway's email policy and the approvals lane | observe | outbox signatures against the sender line |
| N4 | Let a secret, key or private note leave in an email | setting | the gateway's data-loss check | observe | the gateway refuses and says why; test with a planted fake key |
| N5 | Let an agent read raw email | setting | the inbound firewall writes the only copy agents can read | observe | agents' read keys open only the cleaned copy |
| N6 | Keep a customer's mail in our accounts | expectation | none: when offered to teams, the cell runs in the customer's environment | observe | our vaults hold only our own inboxes |
| N7 | Send while the kill switch is on | boundary | the gateway stops; only a person restarts it | enforce | a send attempted with the switch on is refused |
| N8 | Leave Google's testing mode or request verification without Dinis | expectation | none | observe | Google Cloud console state |

## Gap

- **G1, the build session will hold the OAuth client secret while it builds the gateway.** Evidence: build order step 1. Proposal: the person registers the OAuth app and puts the secret where only the gateway reads it; the build session never sees it. Status: open.
- **G2, our own inboxes hold other people's mail: correspondents have not agreed to a twin of it.** Evidence: build order step 1: our own inboxes first. Proposal: say on the cell's page what the twin holds and for how long; encrypt per mailbox; decide retention with Dinis. Status: open.
- **G3, whether an encrypted twin counts as storing restricted data on servers is unsettled.** Evidence: the article: a question to settle with Google's process. Proposal: settle it before any mailbox other than our own is synced. Status: open.
- **G4, altitude 4 (what an email may be) does not exist until the gateway is built; until then, nothing checks an email.** Evidence: the cell is not built. Proposal: build the policy check before the send path, and run the policy simulator on last month's mail first. Status: open.

## Observe to enforce

- **First:** N1, C4, N7.
- **Trigger:** these three are boundaries by design from the first line of code; the rest move after the policy simulator has run against a month of our own mail.
- **Escape valve:** a person can still send by hand from Gmail, outside the cell.

## Licence to operate

- **Authority:** Dinis Cruz.
- **Licensee:** the gateway agent and each agent working on the twin, each with its own key.
- **Conditions:** this policy, CLAUDE.md, Google's testing limits.
- **Validity:** from approval; the Google project stays in testing until Dinis decides.
- **Review:** specialist.abp on any change; specialist.security before the first real mailbox is synced.
- **Stop:** the kill switch: anyone may stop the gateway; only a person restarts it.

## Notes from the reviewer

- The design already makes the three most dangerous things boundaries: one token holder (N1), sends only through the gateway (C4), and a kill switch (N7). That is rare and worth keeping as the build goes on.
- Altitude 4 is new and is the point of the cell; until the gateway exists it is a sentence. G4 asks for the check to be built before the send path, not after.
- N6 meets our CLAUDE.md rule on customer data; G2 is the harder question: our own inboxes hold other people's mail.
- The build session is an agent too and needs its own policy; it is not this one. It should never see the OAuth client secret (G1).
- This draft is a cell policy (kind: cell). Each agent inside the cell (gateway, triage, drafter) gets its own agent policy from the agent template once it exists.

## The policy as data

```json
{
  "format": "agenticcells-abp/0.1",
  "id": "cell.email@AgentiCCells.dinis",
  "kind": "cell",
  "version": "0.1.0",
  "status": "proposal",
  "phase": "observe",
  "default": "deny",
  "owner": "Dinis Cruz",
  "keeper": "the email cell's person (proposed by specialist.abp@AgentiCCells.dinis)",
  "reviewer": "specialist.abp@AgentiCCells.dinis",
  "updated": "2026-11-16",
  "mandate": {
    "task": "Build and run the email agentic cell: one gateway agent alone touches Gmail; people and agents work on a signed, encrypted twin of the mailbox in a vault; proposals, approvals, reads and sends on signed append lanes.",
    "scope": "AgentiCCells/AgentiCCells__Cell__Email and https://email-cell.agenticcells.site; to start, our own inboxes only, under RiskMandate's Google project, in testing (at most 100 test users).",
    "purpose": "Make the few emails Dinis wants sent automatically safe to automate; never a general connector that lets any agent reach any mailbox.",
    "words": "So we will build our own, because we can, and because only then can we enforce Agent Behaviour Policies, and put them all the way up, on the behaviour of the email itself. (The email agentic cell, newsroom article 434.)",
    "given": "2026-11-16 (article date)"
  },
  "altitudes": [
    {
      "altitude": 1,
      "name": "The OAuth grant",
      "decides": "which Gmail scopes the user gave: metadata, read, compose, send",
      "enforced_by": "Google"
    },
    {
      "altitude": 2,
      "name": "Who holds the token",
      "decides": "one gateway agent",
      "enforced_by": "where the key lives"
    },
    {
      "altitude": 3,
      "name": "What each agent may do",
      "decides": "read the twin, propose, approve or send, per agent and per key",
      "enforced_by": "the lanes"
    },
    {
      "altitude": 4,
      "name": "What an email may be",
      "decides": "recipients and domains, languages, templates, attachments, how many a day, first contact or reply",
      "enforced_by": "the gateway, before every send"
    },
    {
      "altitude": 5,
      "name": "Who approves",
      "decides": "a person signs consequential sends; routine ones go by a signed policy",
      "enforced_by": "the approvals lane"
    }
  ],
  "reach": [
    {
      "what": "nothing yet: the cell is not built",
      "how": "its repository holds one explanatory page",
      "evidence": "measured"
    },
    {
      "what": "Gmail scopes the OAuth app will request (gmail.readonly is restricted; gmail.send is sensitive)",
      "how": "Google's scope documentation, read 16 November 2026",
      "evidence": "documented"
    },
    {
      "what": "the build session's own reach: the same account and tools as the specialists",
      "how": "same factory seed",
      "evidence": "inferred"
    }
  ],
  "capabilities": [
    {
      "id": "C1",
      "capability": "read.message.tenant",
      "target": "the twin in the vault, through the inbound firewall's cleaned copy",
      "tier": 1,
      "undo": "no",
      "decision": "allow",
      "barrier": "setting",
      "enforcer": "vault read keys given per agent",
      "mode": "observe",
      "test": "reads lane: every read signed"
    },
    {
      "id": "C2",
      "capability": "propose.action.tenant",
      "target": "the actions lane: reply, label, archive, forward",
      "tier": 2,
      "undo": "yes",
      "decision": "allow",
      "barrier": "setting",
      "enforcer": "lane write token sealed to the agent's key",
      "mode": "observe",
      "test": "every proposal signed by a known key"
    },
    {
      "id": "C3",
      "capability": "apply.label.tenant",
      "target": "labels and archive in Gmail, through the gateway",
      "tier": 3,
      "undo": "yes",
      "decision": "plan-apply",
      "barrier": "boundary",
      "enforcer": "only the gateway holds the Google token",
      "mode": "enforce",
      "test": "outbox lane result against the approved proposal"
    },
    {
      "id": "C4",
      "capability": "send.message.world",
      "target": "an email to anyone, through the gateway only",
      "tier": 4,
      "undo": "no",
      "decision": "draft",
      "barrier": "boundary",
      "enforcer": "only the gateway holds the token; it checks the email policy and the approval signature before every send",
      "mode": "enforce",
      "test": "every outbox entry has an approval signature and a policy check"
    },
    {
      "id": "C5",
      "capability": "authenticate-as.credential.tenant",
      "target": "the Google OAuth token",
      "tier": 3,
      "undo": "with-effort",
      "decision": "deny",
      "barrier": "boundary",
      "enforcer": "the token exists only in the gateway's environment",
      "mode": "enforce",
      "test": "key inventory: one holder"
    },
    {
      "id": "C6",
      "capability": "create.record.world",
      "target": "a calendar invitation",
      "tier": 4,
      "undo": "with-effort",
      "decision": "draft",
      "barrier": "setting",
      "enforcer": "the calendar twin's gateway, once built",
      "mode": "observe",
      "test": "every invitation has a person's acceptance"
    }
  ],
  "never": [
    {
      "id": "N1",
      "rule": "Any agent but the gateway holds the Google token",
      "barrier": "boundary",
      "enforcer": "where the key lives",
      "mode": "enforce",
      "test": "key inventory"
    },
    {
      "id": "N2",
      "rule": "Send a first contact without a person's signature",
      "barrier": "setting",
      "enforcer": "the gateway's email policy",
      "mode": "observe",
      "test": "outbox: every first contact has a person's signature"
    },
    {
      "id": "N3",
      "rule": "Send an email in a person's first person that the person did not sign",
      "barrier": "setting",
      "enforcer": "the gateway's email policy and the approvals lane",
      "mode": "observe",
      "test": "outbox signatures against the sender line"
    },
    {
      "id": "N4",
      "rule": "Let a secret, key or private note leave in an email",
      "barrier": "setting",
      "enforcer": "the gateway's data-loss check",
      "mode": "observe",
      "test": "the gateway refuses and says why; test with a planted fake key"
    },
    {
      "id": "N5",
      "rule": "Let an agent read raw email",
      "barrier": "setting",
      "enforcer": "the inbound firewall writes the only copy agents can read",
      "mode": "observe",
      "test": "agents' read keys open only the cleaned copy"
    },
    {
      "id": "N6",
      "rule": "Keep a customer's mail in our accounts",
      "barrier": "expectation",
      "enforcer": "none: when offered to teams, the cell runs in the customer's environment",
      "mode": "observe",
      "test": "our vaults hold only our own inboxes"
    },
    {
      "id": "N7",
      "rule": "Send while the kill switch is on",
      "barrier": "boundary",
      "enforcer": "the gateway stops; only a person restarts it",
      "mode": "enforce",
      "test": "a send attempted with the switch on is refused"
    },
    {
      "id": "N8",
      "rule": "Leave Google's testing mode or request verification without Dinis",
      "barrier": "expectation",
      "enforcer": "none",
      "mode": "observe",
      "test": "Google Cloud console state"
    }
  ],
  "gaps": [
    {
      "id": "G1",
      "what": "the build session will hold the OAuth client secret while it builds the gateway",
      "evidence": "build order step 1",
      "proposal": "the person registers the OAuth app and puts the secret where only the gateway reads it; the build session never sees it",
      "status": "open"
    },
    {
      "id": "G2",
      "what": "our own inboxes hold other people's mail: correspondents have not agreed to a twin of it",
      "evidence": "build order step 1: our own inboxes first",
      "proposal": "say on the cell's page what the twin holds and for how long; encrypt per mailbox; decide retention with Dinis",
      "status": "open"
    },
    {
      "id": "G3",
      "what": "whether an encrypted twin counts as storing restricted data on servers is unsettled",
      "evidence": "the article: a question to settle with Google's process",
      "proposal": "settle it before any mailbox other than our own is synced",
      "status": "open"
    },
    {
      "id": "G4",
      "what": "altitude 4 (what an email may be) does not exist until the gateway is built; until then, nothing checks an email",
      "evidence": "the cell is not built",
      "proposal": "build the policy check before the send path, and run the policy simulator on last month's mail first",
      "status": "open"
    }
  ],
  "enforce_plan": {
    "first": [
      "N1",
      "C4",
      "N7"
    ],
    "trigger": "these three are boundaries by design from the first line of code; the rest move after the policy simulator has run against a month of our own mail",
    "escape_valve": "a person can still send by hand from Gmail, outside the cell"
  },
  "licence": {
    "authority": "Dinis Cruz",
    "licensee": "the gateway agent and each agent working on the twin, each with its own key",
    "conditions": "this policy, CLAUDE.md, Google's testing limits",
    "validity": "from approval; the Google project stays in testing until Dinis decides",
    "review": "specialist.abp on any change; specialist.security before the first real mailbox is synced",
    "stop": "the kill switch: anyone may stop the gateway; only a person restarts it"
  }
}
```

## Record

- 0.1.0, 2026-11-16: first draft, by specialist.abp@AgentiCCells.dinis, as the worked example of its review service. A proposal.
