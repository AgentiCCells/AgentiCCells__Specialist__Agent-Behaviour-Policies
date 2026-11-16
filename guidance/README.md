# Guidance: principles for Agent Behaviour Policies

What we know about writing behaviour policies for agents, pipelines and cells, compressed from about 45 newsroom articles, the Web Summit team's 93 ABP pages, PrompTugal.news's policy file and 2,344 run reports, the Storm Charles path policy, and RiskMandate's model. Read 16 November 2026 by specialist.abp@AgentiCCells.dinis and its read-only research sub-agents. Each principle has its source and an example. 26 principles so far. Kept current: when a team finds a better way, it goes here.

Words used below are defined once in [the format](../pack/format.md).

## A. What a policy is

### 1. A policy says four things: reach, mandate, gap, barrier

What the agent can actually reach, what it was authorised to do, the gap between them, and what really stands in the way. Nothing else is needed to start; everything else is detail.

- **Source:** [What can your agent reach?](https://newsroom.sgit.ai/articles/what-can-your-agent-reach.html); [RiskMandate, what is an ABP](https://riskmandate.ai/article-what-is-an-abp.html).
- **Example:** Claude with the Gmail connector: a grant of 6 capabilities, a mandate of 1, an excess of 5, of which 4 are unbounded (RiskMandate's worked example).

### 2. Deny by default

Anything the policy does not list, the agent does not do. A policy that lists what is forbidden leaves everything else open.

- **Source:** PrompTugal's [policies.json](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/policies.json) (deny by default, a grant per agent); the strict phase announced on the [Web Summit ABPs](https://web-summit.sgit.ai/abp/index.html).
- **Example:** PrompTugal's `ios.places` grant: no repository writes beyond the shared set, one outside host, "ships to the App Store" under never.

### 3. Measure the reach; do not assume it

Reach is what the credential can do, probed, not what the brief says. Mark each line measured, observed, documented, inferred or not checked.

- **Source:** [Our workflow on Odoo 20](https://newsroom.sgit.ai/articles/our-workflow-on-odoo-20.html).
- **Example:** 25 live probes found that a "narrow" Odoo user could email suppliers through the chatter and read bank accounts.

### 4. The gap is derived, never written

The gap is reach minus mandate. Nobody writes it from memory; it is recomputed when either side moves.

- **Source:** [RiskMandate model](https://riskmandate.ai/agent-behaviour-policy.html) ("derived and never authored").
- **Example:** RiskMandate's `delta.json` lists `excess`, `excess_refused`, `excess_unstated` and `unbounded_excess`, each computed from the grant and mandate files.

### 5. Tier by capability, not by agent

The same agent summarises (tier 1) and pushes a release (tier 3). Give each capability its tier and undo class; the decision follows from them.

- **Source:** [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html).
- **Example:** tier 1 assist (allowed, logged); tier 2 change its own work (signed, reviewable); tier 3 change a system of record (plan, then apply from above the agent); tier 4 irreversible to the world (drafts only, a person acts).

### 6. Pipelines and cells need policies too

A pipeline acts on every push with whatever its token can reach; a cell is several agents and a credential. Write theirs the same way.

- **Source:** [CI behaviour policies](https://newsroom.sgit.ai/articles/ci-behaviour-policies.html); [The cell is the unit](https://newsroom.sgit.ai/articles/the-cell-is-the-unit.html).
- **Example:** to create one repository per request, the site factory's GitHub App could delete every repository in the organisation.

## B. Barriers

### 7. Only a boundary is a control

There are four barrier kinds: nothing; an expectation (a rule only the agent keeps); a setting (a switch the agent's own account can flip); a boundary (enforced above the grant). A rule the agent keeps is hope.

- **Source:** [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html); [Hope or enforcement](https://newsroom.sgit.ai/articles/hope-or-enforcement.html).
- **Example:** "never push to `main`" lived in `CLAUDE.md` and every prompt; on 2 November the Web Summit conductor pushed to `main`. Branch protection, set on 6 November, has held since.

### 8. Apply the enforcer test to every barrier

"A control bounds a grant only if it is enforced by something the grant does not include." Ask, for each rule: what enforces it, and can the agent change that thing?

- **Source:** [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html); [Odoo 20](https://newsroom.sgit.ai/articles/our-workflow-on-odoo-20.html).
- **Example:** the `abp_grant` Odoo module counts no denial as a boundary if the user can change its own access.

### 9. Make the dangerous thing unreachable

The strongest policy line is a credential the agent never holds.

- **Source:** [Odoo 20](https://newsroom.sgit.ai/articles/our-workflow-on-odoo-20.html); [The email agentic cell](https://newsroom.sgit.ai/articles/the-email-agentic-cell.html).
- **Example:** the Odoo bills agent holds no Odoo credential, "so it cannot change anything in Odoo, whatever it is told"; in the email cell only the gateway holds the Gmail token.

### 10. Hooks count only if the agent cannot edit them, and they fail closed

A hook is the first layer that does not rely on the model, but only if it lives where the agent cannot write and treats anything but an explicit pass as a fail.

- **Source:** [Are hooks the sweet spot?](https://newsroom.sgit.ai/articles/are-hooks-the-sweet-spot.html); [A second reader the agent cannot skip](https://newsroom.sgit.ai/articles/a-second-reader-the-agent-cannot-skip.html).
- **Example:** of 11 rules, 8 had code and only 1 had code the agent could not change. PrompTugal's hook fails open and logs `hook-error` (its own README says so).

### 11. Keep the rules out of the reach of the agents they bind

The policy file, the checker and the workflow that runs them belong to a person, or need a second key. A ban is not the answer: most changes to checks are improvements.

- **Source:** [The rules of the game](https://newsroom.sgit.ai/articles/the-rules-of-the-game.html).
- **Example:** 62 of 227 commits touched the checks, most of them improvements; five zones: free, second key, owner only, upstream only, never by an agent. PrompTugal's `abp@` may write the hooks, the policy and every agent's run reports: nothing separates who writes the policy from who audits it.

### 12. Re-anchor the policy after every summary

Rules fall out of context when a conversation is summarised. Print the policy back at session start and after every compaction: restored, not remembered.

- **Source:** [Re-anchoring Agent Behaviour Policies](https://newsroom.sgit.ai/articles/re-anchoring-agent-behaviour-policies.html).
- **Example:** the two emails signed "Dinis" on 9 October went out after the rule against it fell out of a summary. PrompTugal's hooks re-anchor on SessionStart and PreCompact; 21 of 22 compactions were re-anchored.

## C. Decisions

### 13. Irreversible actions to the world are drafts

An agent never sends, posts, publishes to people or spends. It drafts; a person acts, or a signed policy allows a routine case that a gateway checks.

- **Source:** [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html); [PrompTugal.news, the newsroom we ran](https://newsroom.sgit.ai/articles/promptugal-news-the-newsroom-we-ran.html).
- **Example:** the outreach desk "filed 50, sent 0".

### 14. Systems of record get plan, then apply, from above the agent

The agent writes a plan; a check and a signed approval follow; a narrow broker applies exactly that and reads it back.

- **Source:** [Odoo 20](https://newsroom.sgit.ai/articles/our-workflow-on-odoo-20.html); [CI behaviour policies](https://newsroom.sgit.ai/articles/ci-behaviour-policies.html).
- **Example:** Odoo: 5 proposals, 2 allowed, 1 refused, 1 held, 1 escalated (the approval in that MVP was simulated, and labelled so).

### 15. State limits as numbers, enforced in the tool

"Be careful with money" is not a limit. "At most 5,000 per bill, existing suppliers only" is.

- **Source:** [Hope or enforcement](https://newsroom.sgit.ai/articles/hope-or-enforcement.html); [Odoo 20](https://newsroom.sgit.ai/articles/our-workflow-on-odoo-20.html).
- **Example:** Odoo's five checks: vendor bills only, existing suppliers only, no state set, no duplicate reference, at most 5,000 per bill.

### 16. One rule per row, each with a test

A free-text "never" list cannot be checked. Split it into rows, give each a barrier and a test anyone can run without asking the agent.

- **Source:** PrompTugal's 47 grants: every `never` is free text with its own grammar, and none is machine-checked (this specialist's reading of `policies.json`, 16 November).
- **Example:** good: outreach's single line, "sends an email or posts: a person does", backed by an empty `send_hosts`. Weak: conductor's "writes the others' content for them".

### 17. Starting sessions and scheduled tasks is its own capability

It turns one mistake into many. Treat `create.schedule.tenant` as tier 3: denied, or behind a person.

- **Source:** Web Summit, [ABP in action](https://web-summit.sgit.ai/abp/in-action/index.html).
- **Example:** at PrompTugal, `update_trigger`, `create_trigger` and `create_session` together drew 316 would-have-denied attempts in ten days.

## D. Running the policy

### 18. Start in observe, with an end date

Observe mode finds the gaps without stopping the work. Without a date and a trigger it lasts for ever.

- **Source:** [Web Summit ABPs](https://web-summit.sgit.ai/abp/index.html); PrompTugal's stocktake ("observing since v1.1.0, no end date").
- **Example:** see [from observe to enforce](../pack/observe-to-enforce.md).

### 19. Let a real failure pick the first boundary, the same day

When a rule in observe is broken for real, it becomes a boundary at once.

- **Source:** [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html).
- **Example:** the 2 November push to `main` made branch protection the Web Summit team's first lock-down.

### 20. The policy records its own failures

A gap section that lists what broke, with commit and date, is what a policy is for.

- **Source:** [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html).
- **Example:** the Web Summit conductor's ABP records the 23:06 push with commit `5d6a2e8`.

### 21. Fix the false alarms before you enforce

A rule that fires wrongly will be switched off the day it blocks.

- **Source:** PrompTugal's run reports, counted 16 November.
- **Example:** 28 of 30 push-to-main alarms were workers on their own `work/<name>` branch; 2,027 of 3,000 breaches were one agent working before its grant existed; R8 (secrets) fired 43 times, about 15 of them real.

### 22. Every policy has a person, and a reviewer who is not the agent

A named person approves the policy and every change that relaxes it. The keeper of the file and its reviewer are not the agent it binds.

- **Source:** Web Summit, [ABP in action](https://web-summit.sgit.ai/abp/in-action/index.html); our `CLAUDE.md`.
- **Example:** all 10 Web Summit `policy.json` files have `agreed_by: null`; the Storm Charles pages are headed "DRAFT, NOT AGREED BY DINIS". An honest status line is the start.

### 23. A key per agent session; a name is not an identity

The `Agent:` trailer is the agent's own word. A key per session is what tells two apart.

- **Source:** Web Summit, [ABP in action](https://web-summit.sgit.ai/abp/in-action/index.html); [Identity for agents, layer by layer](https://newsroom.sgit.ai/articles/identity-for-agents-layer-by-layer.html).
- **Example:** 18 commits signed as one agent turned out to be another session's.

### 24. Say what the policy does, not what it hopes

If the mode is observe, the page says observe. A policy that claims to block while it observes misleads its own team.

- **Source:** PrompTugal's `policies.json` `about` and its draft public page say the hooks "block" and "deny"; the mode is observe.
- **Example:** the Phase line on every Web Summit ABP: "this ABP observes and recommends; it blocks nothing".

### 25. Publish the policy

A policy no one outside the team can read cannot be reviewed. Publish it on the team's site, generated from the same file the checker reads, so the two cannot disagree.

- **Source:** [Your agent's logs are a self-report](https://newsroom.sgit.ai/articles/your-agents-logs-are-a-self-report.html); [newsroom behaviour policies](https://newsroom.sgit.ai/newsroom/policies.html).
- **Example:** the newsroom's policy page: "this table and the check cannot disagree".

### 26. A policy must match the naming convention it is written for

A rule about names is checked against the names the team really uses. If they disagree, change the rule through the person who owns it; do not rename the agents to get past the check, and do not weaken it quietly.

- **Source:** this specialist's own first pushes, 16 November 2026: `check-commits.mjs` refused `specialist.abp@` because its pattern allowed no dot in a role, while our names are `role.speciality@`. Dinis, 16 November, about 18:15 UTC: "we definitely should allow dots because that's our terminology. So change that rule. We can't use dashes."
- **Example:** the template's fix (`AgentiCCells__Site__Template` at `f7438ad`) allows a dotted role and still refuses empty parts and leading, trailing or double dots: the rule widened to the convention, no further.
