const fs = require('fs');
const s = fs.readFileSync(process.argv[2], 'utf8');
let d = 0, line = 1;
let inStr = null, inLine = false, inBlock = false, esc = false;
for (let i = 0; i < s.length; i++) {
  const c = s[i], n = s[i + 1];
  if (c === '\n') { line++; inLine = false; continue; }
  if (inLine) continue;
  if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } continue; }
  if (inStr) {
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === inStr) { inStr = null; }
    continue;
  }
  if (c === '/' && n === '/') { inLine = true; continue; }
  if (c === '/' && n === '*') { inBlock = true; i++; continue; }
  if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
  if (c === '{') d++;
  if (c === '}') { d--; if (d < 0) { console.log('negative at line', line); process.exit(0); } }
}
console.log('final depth', d, 'lines', line);
