import{readFileSync,writeFileSync,mkdirSync,cpSync,readdirSync,existsSync}from'node:fs';
import{createHash}from'node:crypto';
import{join,resolve}from'node:path';
import{renderPage,thanks}from'../src/render.mjs';
const root=resolve(import.meta.dirname,'..'),out=join(root,'dist');mkdirSync(out,{recursive:true});
const read=p=>readFileSync(join(root,p),'utf8');
const data=JSON.parse(read('src/content.json'));
const siteRoutes=['/a1','/a2','/a3','/obrigado'];
if(JSON.stringify(siteRoutes.slice(0,3))!==JSON.stringify(Object.values(data.variants).map(v=>v.route)))throw Error('Route/content mismatch');
const revision=createHash('sha256').update(read('src/content.json')+read('src/render.mjs')+read('src/site.css')+read('src/site.js')).digest('hex').slice(0,16);
for(const [b,v]of Object.entries(data.variants))writeFileSync(join(out,v.route.slice(1)+'.html'),renderPage(data,b,revision));
writeFileSync(join(out,'obrigado.html'),thanks(data,revision));
writeFileSync(join(out,'site.css'),read('src/site.css'));writeFileSync(join(out,'site.js'),read('src/site.js'));
cpSync(join(root,'public'),out,{recursive:true});
for(const file of readdirSync(join(root,'materials'))){if(!file.endsWith('.html'))throw Error('Unsupported material');cpSync(join(root,'materials',file),join(out,file));}
writeFileSync(join(out,'robots.txt'),'User-agent: *\nAllow: /\n');
writeFileSync(join(out,'404.html'),'<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Stella Stuane</title><p><a href="/a1">Stella Stuane</a></p></html>');
console.log(JSON.stringify({revision,routes:['/',...siteRoutes],materialCount:readdirSync(join(root,'materials')).length,output:'dist'}));
