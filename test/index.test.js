import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { buildMeetingBrief } from '../src/index.js';

function load(name) { return JSON.parse(fs.readFileSync(path.join('fixtures', name), 'utf8')); }
function runCli(...args) {
  return spawnSync(process.execPath, ['bin/meetingbrief-skill.js', ...args], { encoding: 'utf8' });
}

test('meetingbrief-skill produces stable fixture output', () => {
  const brief = buildMeetingBrief(load('product-sync.json'));
  assert.equal(brief.title, 'Product launch sync');
  assert.ok(brief.agenda.length >= 3);
  assert.ok(brief.followUpDraft.join(' ').includes('Confirmed goals'));

  const sparse = buildMeetingBrief(load('sparse-meeting.json'));
  assert.ok(sparse.risks.includes('Meeting goals are missing or vague.'));

  const normalized = buildMeetingBrief(load('malformed-meeting.json'));
  assert.deepEqual(normalized.attendees, ['unknown']);
});

test('library normalizes documented optional and list values', () => {
  const brief = buildMeetingBrief({
    title: '  Planning  ',
    date: null,
    attendees: '  Avery  ',
    goals: [' Decide ', '', '  '],
    notes: null,
  });
  assert.equal(brief.title, 'Planning');
  assert.equal(brief.date, 'unscheduled');
  assert.deepEqual(brief.attendees, ['Avery']);
  assert.deepEqual(brief.goals, ['Decide']);
  assert.deepEqual(brief.context, []);
});

test('follow-up draft adds sentence punctuation only when needed', () => {
  const punctuated = buildMeetingBrief({
    goals: ['Decide now!'],
    questions: ['Who owns this?'],
  });
  assert.deepEqual(punctuated.followUpDraft.slice(1, 3), [
    'Confirmed goals: Decide now!',
    'Open questions: Who owns this?',
  ]);

  const unpunctuated = buildMeetingBrief({
    goals: ['Decide now'],
    questions: ['Confirm the owner'],
  });
  assert.deepEqual(unpunctuated.followUpDraft.slice(1, 3), [
    'Confirmed goals: Decide now.',
    'Open questions: Confirm the owner.',
  ]);
});

test('library rejects malformed scalar fields and list members', () => {
  const cases = [
    [{ title: { text: 'Sync' } }, /title must be a string/],
    [{ date: 20260810 }, /date must be a string/],
    [{ attendees: { name: 'Avery' } }, /attendees must be a string or an array of strings/],
    [{ goals: ['Decide', { text: 'Ship' }] }, /goals must contain only strings/],
    [{ notes: ['Context', false] }, /notes must contain only strings/],
  ];
  for (const [input, message] of cases) {
    assert.throws(() => buildMeetingBrief(input), message);
  }
});

test('CLI renders documented markdown and JSON formats', () => {
  const markdown = runCli('fixtures/product-sync.json', '--format', 'markdown');
  assert.equal(markdown.status, 0);
  assert.match(markdown.stdout, /# Product launch sync/);

  const json = runCli('fixtures/product-sync.json', '--format', 'json');
  assert.equal(json.status, 0);
  const parsed = JSON.parse(json.stdout);
  assert.equal(parsed.title, 'Product launch sync');
  assert.ok(parsed.followUpDraft.includes('Open questions: Who owns launch checklist?'));
  assert.doesNotMatch(json.stdout, /[!?]\./);
});

test('CLI rejects invalid argument combinations', () => {
  const cases = [
    { args: ['fixtures/product-sync.json', '--bogus'], message: 'unknown option --bogus' },
    { args: ['fixtures/product-sync.json', '--format'], message: '--format requires markdown or json' },
    { args: ['fixtures/product-sync.json', '--format', 'json', '--format', 'markdown'], message: '--format may only be specified once' },
    { args: ['fixtures/product-sync.json', 'fixtures/sparse-meeting.json'], message: 'expected exactly one input JSON file' },
    { args: ['fixtures/product-sync.json', '--version'], message: 'unknown option --version' },
    { args: [], message: 'missing input JSON file' },
  ];
  for (const { args, message } of cases) {
    const result = runCli(...args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(message));
    assert.equal(result.stdout, '');
  }
});

test('CLI rejects null and non-object JSON roots without a stack trace', () => {
  const temporaryFiles = ['null', '[]', '"meeting"'].map((value, index) => {
    const file = path.join(process.cwd(), `.cli-invalid-${process.pid}-${index}.json`);
    fs.writeFileSync(file, value);
    return file;
  });
  try {
    for (const file of temporaryFiles) {
      const result = runCli(file);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /input JSON root must be an object/);
      assert.doesNotMatch(result.stderr, /\n\s+at /);
    }
  } finally {
    for (const file of temporaryFiles) fs.rmSync(file);
  }
});

test('CLI rejects malformed meeting fields concisely without rendering object values', () => {
  const file = path.join(process.cwd(), `.cli-invalid-fields-${process.pid}.json`);
  fs.writeFileSync(file, JSON.stringify({
    title: { text: 'Sync' },
    goals: ['Decide', { text: 'Ship' }],
  }));
  try {
    const result = runCli(file);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid meeting bundle: title must be a string/);
    assert.doesNotMatch(result.stderr, /\n\s+at |\[object Object\]/);
    assert.equal(result.stdout, '');
  } finally {
    fs.rmSync(file);
  }
});
