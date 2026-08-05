#!/usr/bin/env node
import fs from 'node:fs';
import pkg from '../package.json' with { type: 'json' };
import { buildMeetingBrief } from '../src/index.js';
import { renderMarkdown } from '../src/render.js';

const usage = 'Usage: meetingbrief-skill <input.json> [--format markdown|json]';
const args = process.argv.slice(2);

if (args.length === 1 && args[0] === '--version') {
  console.log(pkg.version);
  process.exit(0);
}
if (args.length === 1 && args[0] === '--help') {
  console.log(usage + '\n       meetingbrief-skill --help | --version');
  process.exit(0);
}

let file;
let format = 'markdown';
let formatSeen = false;
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--format') {
    if (formatSeen) {
      console.error('Error: --format may only be specified once.');
      process.exit(1);
    }
    formatSeen = true;
    const value = args[index + 1];
    if (!value || value.startsWith('--')) {
      console.error('Error: --format requires markdown or json.');
      process.exit(1);
    }
    format = value;
    index += 1;
  } else if (arg.startsWith('-')) {
    console.error('Error: unknown option ' + arg + '.');
    process.exit(1);
  } else if (file) {
    console.error('Error: expected exactly one input JSON file.');
    process.exit(1);
  } else {
    file = arg;
  }
}

if (!file) {
  console.error('Error: missing input JSON file.\n' + usage);
  process.exit(1);
}
if (!['markdown', 'json'].includes(format)) {
  console.error('Error: unsupported format ' + format + '.');
  process.exit(1);
}
let input;
try { input = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (error) { console.error('Failed to read JSON input: ' + error.message); process.exit(1); }
if (input === null || Array.isArray(input) || typeof input !== 'object') {
  console.error('Error: input JSON root must be an object.');
  process.exit(1);
}
const result = buildMeetingBrief(input);
console.log(format === 'json' ? JSON.stringify(result, null, 2) : renderMarkdown(result));
