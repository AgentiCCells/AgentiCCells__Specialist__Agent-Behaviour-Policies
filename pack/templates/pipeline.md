# Agent Behaviour Policy: <pipeline>@<Team>.<person>

**Status: template** (copy this file to `abp/<pipeline>.md` next to the workflow it binds, replace every `<...>`, and set the status to `proposal`).
**Phase: observe** (a pipeline starts in observe; its first enforce step is almost always a narrower token).

A pipeline is an agent without a conversation: it acts on every push, with whatever its token can reach. Write its policy the same way ([CI behaviour policies](https://newsroom.sgit.ai/articles/ci-behaviour-policies.html)). Deny by default. Format: [the AgentiCCells ABP format](../format.md).

## Mandate

- **Task:** <what the pipeline does, per run: for example "create one repository and one DNS record per approved request">.
- **Scope:** <the workflow files, the repositories and the DNS zone it may touch>.
- **Purpose:** <why it exists>.
- **The person's words (<YYYY-MM-DD HH:MM UTC>):** "<quote>".
- **Person:** <who owns the pipeline and approves this policy>.

## Reach (what its tokens can actually do)

List every secret the workflow can read (names only), the scopes of each token or GitHub App installation, the cloud roles, and who can change the workflow file itself (a pull request that edits the workflow runs with its secrets unless the repository stops it).

| What | How | Evidence |
|---|---|---|
| <administer every repository in the organisation> | <GitHub App installation, permissions> | measured |
| <change any record in the DNS zone> | <cloud role> | measured |
| <who can edit this workflow> | <branch protection, CODEOWNERS> | measured |

## Capabilities

| Id | Capability | Target | Tier | Undo | Decision | Barrier | Enforcer | Mode |
|---|---|---|---|---|---|---|---|---|
| C1 | `create.repository.tenant` | <one repository per approved request> | 3 | with-effort | plan-apply | setting | <a broker that holds the create-only token> | observe |
| C2 | `write.dns.tenant` | <one record per request, in one zone> | 3 | with-effort | plan-apply | setting | <a DNS broker that checks the target, because IAM cannot> | observe |
| C3 | `delete.repository.tenant` | any repository | 3 | no | deny | boundary | <not in any token> | enforce |
| C4 | `write.workflow.project` | the workflow files that hold the secrets | 3 | with-effort | deny | setting | <CODEOWNERS and branch protection, owned by a person> | observe |

Limits: <at most N repositories a day; one DNS record per request; names must match the request>. Tests: <the broker's log against the approved requests; the token's scopes read back from GitHub each week>.

## Never

| Id | Never | Barrier | Enforcer | Mode | Test |
|---|---|---|---|---|---|
| N1 | Delete a repository | boundary | <no token has the scope> | enforce | <read the scopes back> |
| N2 | Point a name outside the approved targets | setting | <the DNS broker's allowlist> | observe | <zone diff against requests> |
| N3 | Run a workflow changed in the same pull request with production secrets | setting | <repository settings for pull requests from forks and branches> | observe | <settings read back> |
| N4 | Print a secret into a log | setting | <masking and the leak scan> | observe | <log scan> |

## Gap

- **G1, <the token can do far more than one run needs>.** <evidence, date>. Proposal: <a broker that holds the wide credential and mints a narrow one per run, or a create-only token>. Status: open.

## Observe to enforce

- **First:** <narrow the token; protect the workflow files>.
- **Trigger:** <the person's word, or the first run that touches something outside its request>.
- **Escape valve:** <a person can run the step by hand, with their own credential, on the record>.

## Licence to operate

- **Authority:** <person>.
- **Licensee:** <pipeline id>, <workflow path>, <token or App id>.
- **Conditions:** <gates>.
- **Validity:** <from date>.
- **Review:** <token scopes read back weekly; this file on every change to the workflow>.
- **Stop:** <disable the workflow; revoke the App installation; who restarts>.

## The policy as data

```json
{
  "format": "agenticcells-abp/0.1",
  "id": "<pipeline>@<Team>.<person>",
  "kind": "pipeline",
  "version": "<0.1.0>",
  "status": "template",
  "phase": "observe",
  "default": "deny",
  "owner": "<person>",
  "keeper": "<who keeps this file>",
  "reviewer": "<specialist.abp@AgentiCCells.dinis>",
  "updated": "<YYYY-MM-DD>",
  "mandate": { "task": "<task>", "scope": "<scope>", "purpose": "<purpose>", "words": "<words>", "given": "<YYYY-MM-DD HH:MM UTC>" },
  "reach": [
    { "what": "<administer every repository>", "how": "<App permissions>", "evidence": "measured" },
    { "what": "<who can edit the workflow>", "how": "<settings>", "evidence": "measured" }
  ],
  "capabilities": [
    { "id": "C1", "capability": "create.repository.tenant", "target": "<one per request>", "tier": 3, "undo": "with-effort", "decision": "plan-apply", "barrier": "setting", "enforcer": "<broker>", "mode": "observe", "test": "<broker log against requests>" },
    { "id": "C2", "capability": "write.dns.tenant", "target": "<one record per request>", "tier": 3, "undo": "with-effort", "decision": "plan-apply", "barrier": "setting", "enforcer": "<DNS broker>", "mode": "observe", "test": "<zone diff>" },
    { "id": "C3", "capability": "delete.repository.tenant", "target": "any repository", "tier": 3, "undo": "no", "decision": "deny", "barrier": "boundary", "enforcer": "<no token has the scope>", "mode": "enforce", "test": "<scopes read back>" },
    { "id": "C4", "capability": "write.workflow.project", "target": "workflow files", "tier": 3, "undo": "with-effort", "decision": "deny", "barrier": "setting", "enforcer": "<CODEOWNERS, branch protection>", "mode": "observe", "test": "<settings read back>" }
  ],
  "never": [
    { "id": "N1", "rule": "Delete a repository", "barrier": "boundary", "enforcer": "<no token has the scope>", "mode": "enforce", "test": "<scopes read back>" },
    { "id": "N2", "rule": "Point a name outside the approved targets", "barrier": "setting", "enforcer": "<DNS broker allowlist>", "mode": "observe", "test": "<zone diff>" },
    { "id": "N3", "rule": "Run a workflow changed in the same pull request with production secrets", "barrier": "setting", "enforcer": "<repository settings>", "mode": "observe", "test": "<settings read back>" },
    { "id": "N4", "rule": "Print a secret into a log", "barrier": "setting", "enforcer": "<masking, leak scan>", "mode": "observe", "test": "<log scan>" }
  ],
  "gaps": [
    { "id": "G1", "what": "<token wider than one run>", "evidence": "<evidence>", "proposal": "<broker or narrow token>", "status": "open" }
  ],
  "enforce_plan": { "first": ["<G1>"], "trigger": "<trigger>", "escape_valve": "<escape valve>" },
  "licence": { "authority": "<person>", "licensee": "<pipeline, workflow, token>", "conditions": "<gates>", "validity": "<from date>", "review": "<weekly scope read-back>", "stop": "<disable the workflow>" }
}
```

## Record

- <0.1.0, date: first version.>
