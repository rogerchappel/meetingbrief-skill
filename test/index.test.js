import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { buildMeetingBrief } from '../src/index.js';

function load(name) { return JSON.parse(fs.readFileSync(path.join('fixtures', name), 'utf8')); }

test('meetingbrief-skill produces stable fixture output', () => {
  const brief = buildMeetingBrief(load('product-sync.json'));
  assert.equal(brief.title, 'Product launch sync');
  assert.ok(brief.agenda.length >= 3);
  assert.ok(brief.followUpDraft.join(' ').includes('Confirmed goals'));

  const sparse = buildMeetingBrief(load('sparse-meeting.json'));
  assert.ok(sparse.risks.includes('Meeting goals are missing or vague.'));
});
