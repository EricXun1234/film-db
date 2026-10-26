// Start with node preview.cjs, or double-click start-preview.cmd on Windows.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const url = new URL(req.url, 'http://127.0.0.1');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(root,relative);
    const ext = path.extname(file);
    if (!file.startsWith(root + path.sep) || !mime[ext]) { res.writeHead(403); res.end(); return; }
    const content = await fs.readFile(file);
    res.writeHead(200, {'Content-Type':mime[ext], 'Cache-Control':'no-store'});
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (_) { res.writeHead(404); res.end('Not found'); }
});
server.on('error',error => { console.error(error.code === 'EADDRINUSE' ? 'Port 8080 is busy. Close the earlier preview window and try again.' : error.message); process.exitCode = 1; });
server.listen(8080,'127.0.0.1',()=>console.log('Open http://127.0.0.1:8080/index.html\nKeep this window open. Press Ctrl+C to stop.'));
