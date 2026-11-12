const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(__dirname, '..', 'dist', 'project.html.txt');
if (!fs.existsSync(file)) throw new Error('Export file does not exist.');
const html = fs.readFileSync(file, 'utf8');
const checks = [
  ['HTML doctype', /<!doctype\\s+html/i.test(html)],
  ['html element', /<html\\b/i.test(html)],
  ['head element', /<head\\b/i.test(html)],
  ['body element', /<body\\b/i.test(html)],
  ['Editor frame', /title="Code Editor"/i.test(html)],
  ['Live frame', /title="Live Preview"/i.test(html)],
  ['Embedded editor document', /srcdoc="/i.test(html)],
  ['No local stylesheet references', !/<link\\b[^>]*href=(["'])(?!https?:|\\/\\/)/i.test(html)],
  ['No local script references', !/<script\\b[^>]*src=(["'])(?!https?:|\\/\\/)/i.test(html)]
];
for (const [name, passed] of checks) {
  console.log((passed ? 'PASS ' : 'FAIL ') + name);
  if (!passed) process.exitCode = 1;
}
if (!process.exitCode) console.log('Validated ' + path.basename(file) + ' (' + Buffer.byteLength(html) + ' bytes).');
