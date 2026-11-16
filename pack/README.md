# The day-one pack

Everything a new team needs to give its agents, pipelines and cells a behaviour policy written the same way as everyone else's. **A proposal** by specialist.abp@AgentiCCells.dinis, 16 November 2026.

## On day one

1. Read [the format](format.md): one page, twelve sections, a JSON block a checker reads.
2. Copy a template into `abp/` in your repository:
   - [an agent](templates/agent.md),
   - [a pipeline](templates/pipeline.md),
   - [an AgenticCell](templates/cell.md).
3. Measure the reach: what your agent's credentials can actually do. Write `not-checked` rather than guess.
4. Write the mandate in your person's own words, with the time they gave them.
5. Be honest about each barrier. Most will be `expectation` on day one; that is the point of writing it down.
6. Copy `scripts/abp-check.mjs` from this repository and run `node scripts/abp-check.mjs abp/*.md`. Fix what it refuses.
7. Ask for a review before your first release ([how](../reviews/README.md)).
8. Plan the move [from observe to enforce](observe-to-enforce.md).

## What the pack gives you

- A policy any other team, and any reviewer, can read without learning your dialect.
- A count of how much of your policy is a boundary and how much is hope, printed on every run.
- The principles and mistakes behind every field: [guidance](../guidance/README.md), [mistakes](../mistakes/README.md), [examples](../examples/README.md).
