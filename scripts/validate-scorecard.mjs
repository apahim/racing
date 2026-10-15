#!/usr/bin/env node
// ============================================================================
// validate-scorecard.mjs — schema and invariant checks for data/scorecard.yaml
//
// Run: npm run validate
//
// Fails (exit 1) with a readable message list when the canonical campaign
// data is malformed or internally inconsistent. This is what prevents
// regressions like unlabeled baselines, meaningless lap targets or
// event-count drift between the data and the copy that computes from it.
// ============================================================================

import { readFileSync } from 'node:fs';
import { load as yamlLoad } from 'js-yaml';

const errors = [];
const fail = (msg) => errors.push(msg);

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
let data;
try {
  data = yamlLoad(readFileSync(new URL('../data/scorecard.yaml', import.meta.url), 'utf8'));
} catch (e) {
  console.error(`scorecard.yaml is not valid YAML:\n  ${e.message}`);
  process.exit(1);
}
if (!data || typeof data !== 'object') {
  console.error('scorecard.yaml is empty or not a mapping.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Progress metrics: weight, rhr, kartsim
// ---------------------------------------------------------------------------
const METRICS = ['weight', 'rhr', 'kartsim'];
const TARGET_STATUSES = ['on-track', 'achieved'];

for (const key of METRICS) {
  const m = data[key];
  if (!m || typeof m !== 'object') {
    fail(`${key}: missing metric object`);
    continue;
  }
  if (!isNonEmptyString(m.label)) fail(`${key}: label must be a non-empty string`);
  if (!isNonEmptyString(m.unit)) fail(`${key}: unit must be a non-empty string (e.g. "kg")`);
  for (const field of ['baseline', 'current', 'target']) {
    if (!isNumber(m[field])) fail(`${key}.${field}: must be a number`);
  }
  if (!TARGET_STATUSES.includes(m.targetStatus)) {
    fail(`${key}.targetStatus: must be one of ${TARGET_STATUSES.join(' | ')} (got ${JSON.stringify(m.targetStatus)})`);
  }
  if (isNumber(m.baseline) && isNumber(m.current) && isNumber(m.target)) {
    if (m.baseline < 0 || m.current < 0 || m.target <= 0) {
      fail(`${key}: baseline/current must be >= 0 and target must be > 0`);
    }
    if (m.target === m.baseline) {
      fail(`${key}: target equals baseline — progress direction is undefined`);
    }
    // Progress direction is derived from the data: target below baseline
    // improves downward, target above baseline improves upward.
    const downward = m.target < m.baseline;
    const progress = downward
      ? (m.baseline - m.current) / (m.baseline - m.target)
      : (m.current - m.baseline) / (m.target - m.baseline);
    const reached = downward ? m.current <= m.target : m.current >= m.target;
    if (reached && m.targetStatus !== 'achieved') {
      fail(`${key}: current (${m.current}) has reached/passed the target (${m.target}) but targetStatus is "${m.targetStatus}" — set it to "achieved"`);
    }
    if (!reached && m.targetStatus === 'achieved') {
      fail(`${key}: targetStatus is "achieved" but current (${m.current}) has not reached the target (${m.target})`);
    }
    if (!reached && progress > 1) {
      fail(`${key}: computed progress is ${Math.round(progress * 100)}% while status is "${m.targetStatus}" — data is inconsistent`);
    }
  }
}

// ---------------------------------------------------------------------------
// Tracks: laps only — no targets, no ratios
// ---------------------------------------------------------------------------
if (!Array.isArray(data.tracks) || data.tracks.length === 0) {
  fail('tracks: must be a non-empty array');
} else {
  const names = new Set();
  for (const [i, t] of data.tracks.entries()) {
    if (!t || typeof t !== 'object') {
      fail(`tracks[${i}]: must be an object`);
      continue;
    }
    if (!isNonEmptyString(t.name)) fail(`tracks[${i}].name: must be a non-empty string`);
    if (!Number.isInteger(t.laps) || t.laps < 0) fail(`tracks[${i}] (${t.name ?? '?'}).laps: must be an integer >= 0`);
    if ('target' in t) fail(`tracks[${i}] (${t.name ?? '?'}): must not define a lap target — lap counts measure volume, not competitiveness`);
    if (names.has(t.name)) fail(`tracks[${i}]: duplicate track name "${t.name}"`);
    names.add(t.name);
  }
}

// ---------------------------------------------------------------------------
// Campaign phases and calendar
// ---------------------------------------------------------------------------
const campaign = data.campaign;
if (!campaign || typeof campaign !== 'object') {
  fail('campaign: missing object');
} else {
  if (!isNumber(campaign.classMinimum) || campaign.classMinimum <= 0) {
    fail('campaign.classMinimum: must be a positive number');
  }
  for (const phase of ['foundation', 'competition']) {
    const p = campaign.phases?.[phase];
    if (!p || !isNonEmptyString(p.label) || !isNonEmptyString(p.long)) {
      fail(`campaign.phases.${phase}: needs label and long (non-empty strings)`);
    }
  }
  if (!isNonEmptyString(campaign.phases?.competition?.window)) {
    fail('campaign.phases.competition.window: must be a non-empty string');
  }
  if ('progress' in (campaign.phases?.competition ?? {})) {
    fail('campaign.phases.competition.progress: decorative progress bars are not allowed — remove the field');
  }
}

const calendar = data.calendar;
if (!calendar || typeof calendar !== 'object' || typeof calendar.provisional !== 'boolean' || !isNonEmptyString(calendar.note)) {
  fail('calendar: needs provisional (boolean) and note (non-empty string)');
}

// ---------------------------------------------------------------------------
// Events — the source of every event/circuit count on the site
// ---------------------------------------------------------------------------
const KINDS = ['preseason', 'round', 'eurocup', 'international'];
const events = data.events;
if (!Array.isArray(events) || events.length === 0) {
  fail('events: must be a non-empty array');
} else {
  const seenRounds = new Set();
  for (const [i, e] of events.entries()) {
    if (!e || typeof e !== 'object') {
      fail(`events[${i}]: must be an object`);
      continue;
    }
    for (const field of ['round', 'title', 'venue', 'location', 'month']) {
      if (!isNonEmptyString(e[field])) fail(`events[${i}].${field}: must be a non-empty string`);
    }
    if (!KINDS.includes(e.kind)) fail(`events[${i}].kind: must be one of ${KINDS.join(' | ')} (got ${JSON.stringify(e.kind)})`);
    if (isNonEmptyString(e.round)) {
      if (seenRounds.has(e.round)) fail(`events[${i}]: duplicate round label "${e.round}"`);
      seenRounds.add(e.round);
    }
  }

  const season = events.filter((e) => e.kind !== 'international');
  const international = events.filter((e) => e.kind === 'international');
  const rounds = events.filter((e) => e.kind === 'round');

  if (season.length === 0) fail('events: no Irish championship season events (kind != international)');
  if (international.length === 0) fail('events: no international event (kind == international)');
  if (rounds.length === 0) fail('events: no championship rounds (kind == round)');
  if (season.length + international.length !== events.length) {
    fail(`events: season (${season.length}) + international (${international.length}) != total (${events.length})`);
  }
}

// ---------------------------------------------------------------------------
// Partnership availability
// ---------------------------------------------------------------------------
if (!Array.isArray(data.availability) || data.availability.length === 0) {
  fail('availability: must be a non-empty array');
} else {
  for (const [i, a] of data.availability.entries()) {
    if (!a || typeof a !== 'object') {
      fail(`availability[${i}]: must be an object`);
      continue;
    }
    if (!isNonEmptyString(a.name)) fail(`availability[${i}].name: must be a non-empty string`);
    if (!isNonEmptyString(a.status)) fail(`availability[${i}].status: must be a non-empty string`);
    if (!['ok', 'warning'].includes(a.tone)) fail(`availability[${i}].tone: must be "ok" | "warning"`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`scorecard.yaml: ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const season = data.events.filter((e) => e.kind !== 'international').length;
console.log(`scorecard.yaml: OK (${season} season events + ${data.events.length - season} international = ${data.events.length} total, ${data.tracks.length} tracks)`);
