// abp-check: every Agent Behaviour Policy in this repository is written the same way.
// Reads the "policy as data" JSON block from each policy file (abp/, proposals/, examples/,
// pack/templates/) and checks it against the AgentiCCells ABP format (pack/format.md).
// Prints OK or each problem, and a count of barriers by kind for every policy (how much of
// it is a boundary and how much is hope). Node built-ins only.
// Written by specialist.abp@AgentiCCells.dinis, 2026-11-16. Code Apache-2.0.
//
// Usage: node scripts/abp-check.mjs [files...]   (default: every policy file in the repository)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FORMAT = 'agenticcells-abp/0.1';
const KINDS = ['agent', 'pipeline', 'cell'];
const STATUS = ['template', 'proposal', 'approved', 'retired'];
const PHASES = ['observe', 'enforce', 'mixed'];
const UNDO = ['yes', 'with-effort', 'no'];
const DECISIONS = ['allow', 'draft', 'plan-apply', 'deny'];
const BARRIERS = ['nothing', 'expectation', 'setting', 'boundary'];
const MODES = ['observe', 'enforce'];
const CAPABILITY = /^[a-z]+(?:-[a-z]+)*\.[a-z]+(?:-[a-z]+)*\.(self|project|host|tenant|world)$/;
const ID = /^[a-z0-9][a-z0-9.-]*@[A-Za-z0-9]+\.[a-z0-9][a-z0-9.-]*$/;

const walk = (d) => (existsSync(d) ? readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; }) : []);

export function extract(md) {
  // The first ```json block after a heading named "The policy as data".
  const at = md.search(/^##\s+The policy as data\s*$/m);
  if (at < 0) return { error: 'no "## The policy as data" section' };
  const m = md.slice(at).match(/```json\n([\s\S]*?)\n```/);
  if (!m) return { error: 'no ```json block under "The policy as data"' };
  try { return { data: JSON.parse(m[1]) }; } catch (e) { return { error: `the policy JSON does not parse (${e.message})` }; }
}

export function check(p, md) {
  const errs = [];
  const err = (m) => errs.push(m);
  const str = (v) => typeof v === 'string' && v.trim().length > 0;
  const template = p.status === 'template';
  const placeholder = (v) => typeof v === 'string' && /<[^>]+>/.test(v);
  const need = (obj, keys, where) => { for (const k of keys) if (obj?.[k] === undefined || obj[k] === '' || obj[k] === null) err(`${where}: ${k} is missing`); };

  need(p, ['format', 'id', 'kind', 'version', 'status', 'phase', 'default', 'owner', 'keeper', 'updated', 'mandate', 'reach', 'capabilities', 'never', 'gaps', 'enforce_plan', 'licence'], 'policy');
  if (p.format !== FORMAT) err(`format must be "${FORMAT}"`);
  if (!template && !ID.test(p.id || '')) err(`id "${p.id}" is not role@Team.person`);
  if (!KINDS.includes(p.kind)) err(`kind must be one of ${KINDS.join(', ')}`);
  if (!STATUS.includes(p.status)) err(`status must be one of ${STATUS.join(', ')}`);
  if (!PHASES.includes(p.phase)) err(`phase must be one of ${PHASES.join(', ')}`);
  if (p.default !== 'deny') err('default must be "deny": anything not listed is not allowed');
  if (!template && !/^\d+\.\d+\.\d+$/.test(p.version || '')) err('version must be semantic (x.y.z)');
  if (p.keeper && p.id && p.keeper === p.id && p.status === 'approved') err('an approved policy must not be kept by the agent it binds (keeper and id are the same)');
  if (p.reviewer && p.reviewer === p.id) err('the reviewer must not be the agent the policy binds');

  // Mandate: Dinis's (or the owner's) words, with the time they were given.
  need(p.mandate, ['task', 'scope', 'purpose', 'words', 'given'], 'mandate');
  if (!template && p.mandate?.given && !/^\d{4}-\d{2}-\d{2}/.test(p.mandate.given)) err('mandate.given must start with a date (YYYY-MM-DD)');

  // Reach: what the agent can actually do, each entry measured or claimed.
  if (!Array.isArray(p.reach) || !p.reach.length) err('reach must list at least one thing the agent can reach');
  for (const [i, r] of (p.reach || []).entries()) {
    need(r, ['what', 'how', 'evidence'], `reach[${i}]`);
    if (!['measured', 'observed', 'documented', 'inferred', 'not-checked'].includes(r.evidence)) err(`reach[${i}]: evidence must be measured, observed, documented, inferred or not-checked`);
  }

  const ids = new Set();
  const uniq = (id, where) => { if (ids.has(id)) err(`${where}: id ${id} is used twice`); ids.add(id); };
  const tally = { nothing: 0, expectation: 0, setting: 0, boundary: 0 };

  if (!Array.isArray(p.capabilities) || !p.capabilities.length) err('capabilities must list at least one row');
  for (const c of p.capabilities || []) {
    const w = `capability ${c.id || '?'}`;
    need(c, ['id', 'capability', 'target', 'tier', 'undo', 'decision', 'barrier', 'enforcer', 'mode', 'test'], w);
    uniq(c.id, w);
    if (!template && !CAPABILITY.test(c.capability || '')) err(`${w}: capability "${c.capability}" is not verb.object.reach (reach: self, project, host, tenant, world, as in the RiskMandate vocabulary)`);
    if (![1, 2, 3, 4].includes(c.tier)) err(`${w}: tier must be 1, 2, 3 or 4`);
    if (!UNDO.includes(c.undo)) err(`${w}: undo must be one of ${UNDO.join(', ')}`);
    if (!DECISIONS.includes(c.decision)) err(`${w}: decision must be one of ${DECISIONS.join(', ')}`);
    if (!BARRIERS.includes(c.barrier)) err(`${w}: barrier must be one of ${BARRIERS.join(', ')}`);
    if (!MODES.includes(c.mode)) err(`${w}: mode must be observe or enforce`);
    else if (BARRIERS.includes(c.barrier)) tally[c.barrier]++;
    // Tier 4 (irreversible, to the world) is never a plain allow: a draft for a person, or deny.
    if (c.tier === 4 && c.decision === 'allow') err(`${w}: tier 4 cannot be "allow": use draft (a person acts) or deny`);
    // Tier 3 (a system of record) is planned then applied by something above the agent, or denied.
    if (c.tier === 3 && c.decision === 'allow') err(`${w}: tier 3 cannot be "allow": use plan-apply or deny`);
    // Something with no enforcer cannot be in enforce mode.
    if (c.mode === 'enforce' && ['nothing', 'expectation'].includes(c.barrier)) err(`${w}: mode is enforce but the barrier is ${c.barrier}: nothing outside the agent enforces it`);
    // The enforcer test: the agent cannot be its own boundary.
    if (c.barrier === 'boundary' && str(c.enforcer) && (c.enforcer === p.id || /^(the agent|itself|self)$/i.test(c.enforcer.trim()))) err(`${w}: a boundary must be enforced by something the agent's grant does not include`);
    if (c.decision !== 'deny' && c.undo === 'no' && c.tier >= 3 && c.barrier !== 'boundary' && !template) err(`${w}: an irreversible tier ${c.tier} capability left open needs a boundary, not ${c.barrier}`);
  }

  if (!Array.isArray(p.never) || !p.never.length) err('never must list at least one rule');
  for (const n of p.never || []) {
    const w = `never ${n.id || '?'}`;
    need(n, ['id', 'rule', 'barrier', 'enforcer', 'mode', 'test'], w);
    uniq(n.id, w);
    if (!BARRIERS.includes(n.barrier)) err(`${w}: barrier must be one of ${BARRIERS.join(', ')}`);
    if (!MODES.includes(n.mode)) err(`${w}: mode must be observe or enforce`);
    else if (BARRIERS.includes(n.barrier)) tally[n.barrier]++;
    if (n.mode === 'enforce' && ['nothing', 'expectation'].includes(n.barrier)) err(`${w}: mode is enforce but the barrier is ${n.barrier}`);
    if (str(n.rule) && n.rule.split(/[;:]/).length > 3) err(`${w}: one rule per row (split it)`);
  }

  for (const g of p.gaps || []) {
    const w = `gap ${g.id || '?'}`;
    need(g, ['id', 'what', 'evidence', 'proposal', 'status'], w);
    uniq(g.id, w);
    if (g.status && !['open', 'closed', 'accepted'].includes(g.status)) err(`${w}: status must be open, closed or accepted`);
    if (g.status === 'accepted' && !str(g.accepted_by)) err(`${w}: an accepted gap names the person who accepted it (accepted_by)`);
  }

  need(p.enforce_plan, ['first', 'trigger', 'escape_valve'], 'enforce_plan');
  need(p.licence, ['authority', 'licensee', 'conditions', 'validity', 'review', 'stop'], 'licence');
  if (p.status === 'approved' && !str(p.licence?.approved_by)) err('an approved policy names who approved it (licence.approved_by)');
  if (p.status === 'proposal' && p.licence?.approved_by) err('a proposal cannot carry licence.approved_by');

  if (!template) {
    const walkStr = (v, path) => {
      if (typeof v === 'string') { if (placeholder(v)) err(`${path}: template placeholder left in`); }
      else if (Array.isArray(v)) v.forEach((x, i) => walkStr(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') for (const k in v) walkStr(v[k], `${path}.${k}`);
    };
    walkStr(p, 'policy');
  }

  // The prose must say the status and phase the data says, near the top.
  const head = md.split('\n').slice(0, 25).join('\n');
  if (!new RegExp(`\\*\\*Status:\\s*${p.status}\\b`, 'i').test(head)) err(`the page must say "**Status: ${p.status}**" near the top`);
  if (!new RegExp(`\\*\\*Phase:\\s*${p.phase}\\b`, 'i').test(head)) err(`the page must say "**Phase: ${p.phase}**" near the top`);
  return { errs, tally };
}

export function policyFiles() {
  return ['abp', 'proposals', 'examples', join('pack', 'templates')]
    .flatMap(walk)
    .filter((f) => f.endsWith('.md') && !/README\.md$/.test(f))
    .filter((f) => /^##\s+The policy as data\s*$/m.test(readFileSync(f, 'utf8')));
}

if (process.argv[1] && process.argv[1].endsWith('abp-check.mjs')) {
  const files = process.argv.slice(2).length ? process.argv.slice(2) : policyFiles();
  let problems = 0;
  for (const f of files) {
    const md = readFileSync(f, 'utf8');
    const { data, error } = extract(md);
    if (error) { console.error(`${f}: ${error}`); problems++; continue; }
    const { errs, tally } = check(data, md);
    for (const e of errs) console.error(`${f}: ${e}`);
    problems += errs.length;
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    console.log(`${f}: ${data.id} ${data.version} ${data.status}, ${data.phase}; ${total} rules: boundary ${tally.boundary}, setting ${tally.setting}, expectation ${tally.expectation}, nothing ${tally.nothing}`);
  }
  if (problems) { console.error(`FAILED: ${problems} problem(s) in ${files.length} policies`); process.exit(1); }
  console.log(`OK (${files.length} policies)`);
}
