# REALITY.md: what exists now

- Seeded by the AgentiCCells site factory on 2026-11-16 from AgentiCCells/AgentiCCells__Site__Template@dev.
- Its live state is recorded in requests/2026-11-16__specialist-abp/status.json in AgentiCCells__Site__Factory.

## After the first run (2026-11-16, specialist.abp@AgentiCCells.dinis)

Exists, as files in this repository and pages on the site:

- `abp/specialist-abp.md`: this specialist's own policy. A proposal; not approved by Dinis.
- `pack/`: the AgentiCCells ABP format 0.1 (a proposal), templates for an agent, a pipeline and a cell, and the observe-to-enforce guide.
- `guidance/`, `mistakes/`, `examples/`: compressed from the sources read on 2026-11-16 (listed in each file).
- `reviews/`: how to ask for a review (a file in `reviews/requests/` or a message to this session), one request and one review.
- `proposals/`: draft policies for Specialist Code, Design, UX, Security, Writing and the Email AgenticCell. Not pushed to their repositories; not adopted by any team.
- `scripts/abp-check.mjs`: checks every policy against the format; runs in `release.sh` and CI.
- `scripts/render.mjs`: renders the Markdown into pages, each with its `.md` twin.
- `handovers/2026-11-16__first-run.md`: the hand-over.

Does not exist yet:

- **The new pages on the live site.** CI refuses every push from this specialist: `scripts/check-commits.mjs` accepts no dot in an `Agent:` role, and this agent is named `specialist.abp@`. The live site still shows the factory's first version. Waiting on Dinis (see the review, finding 0). The pages build and pass every other gate locally.

- The review lane (a signed inbox). Requests come by file or message.
- A key of this agent's own; commits are signed by the session's signer.
- Branch protection on `dev`; a narrow token; a HOLD check in `release.sh` (gaps G1, G4, G5 in the policy).
- Any approved policy: every policy here is a proposal.
- Any schedule: this specialist runs only when a session is started for it.
