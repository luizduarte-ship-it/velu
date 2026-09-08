// Build de producao da Velu.
// Ofusca (minifica + embaralha nomes locais) o unico <script> inline do index.html
// e publica em dist/ junto com _headers e robots.txt. Os nomes globais (toplevel)
// sao preservados porque alguns handlers no HTML os referenciam pelo nome.
const fs = require('fs');
const { minify } = require('terser');

(async () => {
  const src = fs.readFileSync('index.html', 'utf8');
  // o unico <script> inline (o app) abre exatamente com "<script>"; os externos tem src=
  const m = src.match(/<script>\n([\s\S]*?)<\/script>/);
  if (!m) { console.error('ERRO: <script> inline nao encontrado'); process.exit(1); }

  let out;
  try {
    out = await minify(m[1], {
      compress: { passes: 2 },
      mangle: true,               // embaralha nomes locais; globais preservados
      format: { comments: false },
    });
  } catch (e) { console.error('ERRO terser:', e.message); process.exit(1); }

  const html = src.replace(m[0], '<script>' + out.code + '</script>');
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/index.html', html);
  for (const f of ['_headers', 'robots.txt', 'sitemap.xml', 'favicon.png', 'og.png']) {
    if (fs.existsSync(f)) fs.copyFileSync(f, 'dist/' + f);
  }
  console.log('build ok: ' + src.length + ' -> ' + html.length + ' bytes (JS ' + m[1].length + ' -> ' + out.code.length + ')');
})();
