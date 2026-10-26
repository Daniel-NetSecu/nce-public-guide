import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url),pub=new URL('public/',root);
const allow=['app.js','catalog.json','content.json','index.html','link-evidence.json','style.css'];
const files=await fs.readdir(pub);assert.deepEqual(files.sort(),allow.sort(),'Exact public allowlist');
const texts={};for(const f of files){const st=await fs.lstat(new URL(f,pub));assert(st.isFile()&&!st.isSymbolicLink());texts[f]=await fs.readFile(new URL(f,pub),'utf8');assert(st.size<200000,'Unexpectedly large file');}
const lessons=JSON.parse(texts['catalog.json']),content=JSON.parse(texts['content.json']),evidence=JSON.parse(texts['link-evidence.json']);
assert.equal(lessons.length,204);assert.equal(new Set(lessons.map(l=>l.id)).size,204);
for(const [b,n] of [[2,96],[3,60],[4,48]]){const ls=lessons.filter(l=>l.book===b);assert.equal(ls.length,n);assert.deepEqual(ls.map(l=>l.number).sort((a,b)=>a-b),Array.from({length:n},(_,i)=>i+1));assert.equal(evidence.find(e=>e.book===b).lessonLinks,n);assert.equal(evidence.find(e=>e.book===b).status,200);}
for(const l of lessons){assert.deepEqual(Object.keys(l).sort(),['id','book','number','title','status','external'].sort());assert.equal(l.id,l.book+'-'+l.number);assert(l.title.length>0&&l.title.length<180);assert.equal(l.status,content[l.id]?'ready':'pending');const u=new URL(l.external);assert.equal(u.origin,'https://www.bubeijuzi.com');assert.equal(u.pathname,'/nce/'+l.book+'/'+l.number);}
let words=0,exercises=0;const examples=[],questions=[];
for(const [id,c] of Object.entries(content)){assert(lessons.some(l=>l.id===id));assert.deepEqual(Object.keys(c).sort(),['focus','vocabulary','exercises'].sort());assert(c.focus);assert.equal(c.vocabulary.length,3);assert.equal(c.exercises.length,2);for(const v of c.vocabulary){assert.deepEqual(Object.keys(v).sort(),['word','explanation','example'].sort());assert(v.word&&v.explanation.length>12&&v.example.length>15);examples.push(v.example);words++;}for(const e of c.exercises){assert.deepEqual(Object.keys(e).sort(),['answer','question']);assert(e.question.length>12&&e.answer.length>8);questions.push(e.question);exercises++;}}
assert.equal(Object.keys(content).length,12);assert.equal(new Set(examples).size,words);assert.equal(new Set(questions).size,exercises);
for(const [name,text]of Object.entries(texts)){for(const re of [/\b[A-Z]:[\\/]/i,/file:\/\//i,/Users[\\/]/i,/\.openclaw/i,/nce-private-study/i,/daily-english/i,/-----BEGIN .*PRIVATE KEY/,/gh[pousr]_[A-Za-z0-9]{20,}/,/\.(pdf|mp3|lrc|wav|mp4)\b/i,/"(allCues|bodyStart|blocks|transcript|source|notes)"\s*:/])assert(!re.test(text),'Privacy/source marker in '+name+': '+re);}
assert(!/innerHTML|eval\(/.test(texts['app.js']));assert(!/<(?:iframe|audio|video)\b/i.test(texts['index.html']));
for(const m of texts['index.html'].matchAll(/(?:href|src)="([^"]+)"/g)){if(!m[1].startsWith('#'))assert(allow.includes(m[1]),'Unknown HTML asset '+m[1]);}
for(const f of ['public/app.js','scripts/test.mjs','scripts/serve.mjs','scripts/prepare.mjs'])execFileSync(process.execPath,['--check',new URL(f,root).pathname.replace(/^\/([A-Za-z]:)/,'$1')]);
const workflow=await fs.readFile(new URL('.github/workflows/pages.yml',root),'utf8');assert(workflow.includes('path: public'));assert(workflow.includes('node scripts/test.mjs'));
console.log(JSON.stringify({result:'PASS',catalog:204,books:{2:96,3:60,4:48},ready:12,pending:192,originalVocabulary:words,originalExercises:exercises,directoryDiscoveredLinks:204,publicAllowlist:files,checks:['unique IDs','complete sequences','strict schemas','coverage','unique original items','directory link shapes/evidence','local assets','privacy markers/media exclusion','JS syntax','Pages safe directory']},null,2));
