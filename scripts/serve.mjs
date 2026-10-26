import http from 'node:http';
import fs from 'node:fs/promises';
const allowed=new Set(['index.html','app.js','style.css','catalog.json','content.json','link-evidence.json']);
const mime={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json; charset=utf-8'};
http.createServer(async(req,res)=>{const p=new URL(req.url,'http://localhost').pathname;const file=p==='/'?'index.html':p.slice(1);if(!allowed.has(file)){res.writeHead(404);res.end('Not found');return;}try{const data=await fs.readFile(new URL('../public/'+file,import.meta.url));res.writeHead(200,{'Content-Type':mime[file.split('.').pop()],'X-Content-Type-Options':'nosniff'});res.end(data);}catch{res.writeHead(500);res.end('Unavailable');}}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
