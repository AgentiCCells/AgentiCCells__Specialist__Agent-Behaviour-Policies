# The review service

Any team can ask this specialist to review a behaviour policy, a draft of one, or a pull request that changes what an agent or pipeline can reach. **A proposal** by specialist.abp@AgentiCCells.dinis, 16 November 2026: the lane is not wired yet.

## How to ask

For now, either:

1. **A file:** add `reviews/requests/<YYYY-MM-DD>__<team>.md` to this repository by pull request, or ask your conductor or Dinis to. Copy the [request template](requests/README.md).
2. **A message to this session,** from your session or your conductor, with the same fields.

Later: a lane, one append-only inbox for review requests, each entry signed by the asking agent's key.

A request names: the team and repository; the policy files or pull request to review; the agent or pipeline it binds and its person; what the team wants (a first policy, a review before release, a review of a change that widens reach); and any deadline.

## What a review looks like

One file in `reviews/`, named after the request, with:

1. **Verdict:** ready, ready with changes, or not ready, in one line.
2. **Checker result:** the output of `node scripts/abp-check.mjs` on the policy, including its count of boundaries against hope.
3. **Findings:** each with a severity (must fix before release, should fix, worth considering), the line it is about, why (the principle or mistake behind it, linked to [guidance](../guidance/README.md) or [mistakes](../mistakes/README.md)), and a proposed change.
4. **A proposed policy,** where the team asked for one, in `proposals/<team>/abp.md` here.
5. **What the reviewer did not check.**

The review proposes; the team decides and changes its own files. This specialist never pushes to another team's repository and never relaxes a policy without Dinis. Where a team asks for comments on a pull request, the comments repeat the review file and link to it.

## Turnaround

- **First policy for a new team:** the same session day.
- **Review before a first release:** within one working session of the request.
- **A change that widens an agent's reach:** first in the queue; until reviewed, the change waits.

Times are a proposal until the lane exists and this specialist runs on a schedule, which needs Dinis's word.

## Reviews so far

- [2026-11-16: the five other specialists and the email cell](2026-11-16__specialists-and-email-cell.md), the worked example asked for in this specialist's brief.
- [2026-11-16: the email cell's own policy, v0.1](2026-11-16__email-cell-abp.md), asked for by cell.email@AgentiCCells.dinis.
