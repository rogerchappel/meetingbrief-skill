import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'meetingbrief-package-smoke-'));

try {
  const packOutput = execFileSync('npm', ['pack', '--json', '--pack-destination', temporaryDirectory], {
    encoding: 'utf8',
  });
  const [{ filename }] = JSON.parse(packOutput);
  const archive = path.join(temporaryDirectory, filename);
  const consumer = path.join(temporaryDirectory, 'consumer');
  const packageMetadata = JSON.parse(
    fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
  );

  fs.mkdirSync(consumer);
  fs.writeFileSync(path.join(consumer, 'package.json'), '{"private":true,"type":"module"}\n');
  execFileSync('npm', ['install', '--ignore-scripts', archive], { cwd: consumer, stdio: 'pipe' });

  const importOutput = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      "import { buildMeetingBrief } from 'meetingbrief-skill'; console.log(buildMeetingBrief({ title: 'Package smoke' }).title);",
    ],
    { cwd: consumer, encoding: 'utf8' },
  );
  assert.equal(importOutput.trim(), 'Package smoke');

  const executable = process.platform === 'win32'
    ? path.join(consumer, 'node_modules', '.bin', 'meetingbrief-skill.cmd')
    : path.join(consumer, 'node_modules', '.bin', 'meetingbrief-skill');
  const installedMetadata = JSON.parse(
    fs.readFileSync(path.join(consumer, 'node_modules', 'meetingbrief-skill', 'package.json'), 'utf8'),
  );
  assert.equal(installedMetadata.version, packageMetadata.version);
  assert.equal(
    execFileSync(executable, ['--version'], { encoding: 'utf8' }).trim(),
    installedMetadata.version,
  );

  console.log('meetingbrief-skill package smoke passed');
} finally {
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
}
