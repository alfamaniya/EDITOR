const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist', 'project.txt');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function inlineDocument(relativePath, stack = []) {
  const normalized = path.posix.normalize(relativePath.replace(/\\/g, '/'));
  if (stack.includes(normalized)) throw new Error('Circular iframe reference: ' + normalized);
  let html = read(normalized);
  const directory = path.posix.dirname(normalized);

  html = html.replace(/<link\b([^>]*?)href=(["'])(?!https?:|\/\/|data:|#)([^"']+)\2([^>]*)>/gi, (tag, before, quote, href, after) => {
    if (!/stylesheet/i.test(tag)) return tag;
    const target = path.posix.normalize(path.posix.join(directory, href));
    const css = read(target).replace(/<\/style/gi, '<\\/style');
    return '<style>\n' + css + '\n</style>';
  });

  html = html.replace(/<script\b([^>]*?)src=(["'])(?!https?:|\/\/|data:|#)([^"']+)\2([^>]*)>\s*<\/script>/gi, (tag, before, quote, src, after) => {
    const target = path.posix.normalize(path.posix.join(directory, src));
    const js = read(target).replace(/<\/script/gi, '<\\/script');
    return '<script>\n' + js + '\n</script>';
  });

  html = html.replace(/<iframe\b([^>]*?)src=(["'])(?!https?:|\/\/|data:|#)([^"']+)\2([^>]*)>\s*<\/iframe>/gi, (tag, before, quote, src, after) => {
    const target = path.posix.normalize(path.posix.join(directory, src));
    const nested = inlineDocument(target, [...stack, normalized]);
    const attributes = (before + after).replace(/\s(?:src|srcdoc)=(["'])[\s\S]*?\1/gi, '');
    return '<iframe' + attributes + ' srcdoc="' + escapeAttribute(nested) + '"></iframe>';
  });

  return html;
}

const bundled = inlineDocument('index.html');
if (!/<!doctype\s+html/i.test(bundled)) throw new Error('Root HTML document is missing its doctype.');
fs.mkdirSync(path.dirname(output), { recursive: true });
const temporary = output + '.tmp';
fs.writeFileSync(temporary, bundled, 'utf8');
fs.renameSync(temporary, output);
console.log('Built ' + path.relative(root, output) + ' (' + fs.statSync(output).size + ' bytes).');
