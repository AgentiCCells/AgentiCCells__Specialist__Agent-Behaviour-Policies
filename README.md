# Specialist: Agent Behaviour Policies

The Agent Behaviour Policies specialist agent: a behaviour policy for every agent and pipeline, written the same way, and reviewed. Bootstrap packs, reviews and guidance for every team.

What is here:

- `abp/specialist-abp.md`: this specialist's own Agent Behaviour Policy (a proposal).
- `pack/`: the day-one pack: the format, templates for an agent, a pipeline and an AgenticCell, and how to move from observe to enforce.
- `guidance/`: principles, each with its source and an example. `mistakes/`: what went wrong before and why. `examples/`: the best policies, with links.
- `reviews/`: how to ask for a review, requests, and reviews. `proposals/`: policies drafted for other teams, never pushed to their repositories.
- `scripts/abp-check.mjs`: checks that every policy is written the same way (`node scripts/abp-check.mjs`). `scripts/render.mjs`: renders the Markdown into pages, each with its `.md` twin.

The site's home page is `src/index.html`; every Markdown file above becomes a page.

- Live at https://specialist-abp.agenticcells.site (version at /version.json).
- Made by the AgentiCCells site factory from request `requests/2026-11-16__specialist-abp/` in AgentiCCells__Site__Factory, seeded from AgentiCCells__Site__Template.
- Release: `scripts/release.sh` (build, validate, leak scan, abp-check, then push to dev; CI runs the same gates, deploys and tags v0.1.N).

Licences: code Apache-2.0; text CC BY 4.0.
