export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6"/></svg>';
const check='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const words=s=>s.split(' ').map(word=>`<span class="word-mask"><span data-word>${esc(word)}</span></span>`).join(' ');
const plus='<span class="disclosure-icon" aria-hidden="true"></span>';
export function ribbon(kind='hero'){
 const paths=kind==='hero'?['M30 90C230 5 60 250 270 210S380 120 500 250','M10 200C130 70 245 310 355 170S430 80 510 200','M30 280C170 170 180 370 310 275S400 320 510 300']:['M0 80C110 80 70 10 180 45S250 135 350 80S460 30 550 80','M0 140C160 140 140 60 255 110S370 160 550 110','M0 200C120 200 190 125 300 170S420 240 550 170'];
 return `<svg class="ribbon-art" viewBox="0 0 550 370" fill="none" aria-hidden="true"><g class="ribbon-lines">${paths.map((d,i)=>`<path d="${d}" stroke="currentColor" stroke-width="${i===1?2.5:1.2}" opacity="${i===1?.9:.45}"/>`).join('')}</g><g class="ribbon-points"><circle cx="270" cy="210" r="7"/><circle cx="355" cy="170" r="5"/><circle cx="310" cy="275" r="5"/></g></svg>`;
}
export function heroArt(){return `<div class="hero-art" data-surface data-ambient aria-hidden="true"><div class="art-mat"><div class="art-circle"></div><div class="paper paper-back"><svg viewBox="0 0 240 320" fill="none"><path d="M30 60C200 20 30 220 200 240" stroke="currentColor" stroke-width="1.2"/><path d="M30 100h150M30 114h85M30 270h100" stroke="currentColor" opacity=".2"/></svg></div><div class="paper paper-middle"><svg viewBox="0 0 240 320" fill="none"><path d="M25 110C120 10 75 280 210 170" stroke="currentColor" stroke-width="1.2"/><path d="M30 40h150M30 54h85M30 270h100" stroke="currentColor" opacity=".2"/></svg></div><div class="paper paper-front"><svg viewBox="0 0 240 320" fill="none"><path d="M30 90C170 20 10 260 210 200" stroke="currentColor" stroke-width="1.6"/><circle cx="112" cy="129" r="6" fill="currentColor"/><path d="M30 40h135M30 54h85M30 270h100M30 283h135" stroke="currentColor" opacity=".25"/></svg></div><div class="art-thread"><i></i><i></i><i></i></div><div class="art-shadow"></div></div></div>`}
export function renderPage(data,b,revision){
 const variant=data.variants[b],allBlocks={};
 for(let n=1;n<=10;n++){const s=data.shared[n]||variant.sections[n];for(const x of s.blocks)allBlocks[x.id]=x;}
 const ui=(id,tag='span',cls='')=>`<${tag} class="${cls}" data-copy-id="${id}">${esc(data.additions[id])}</${tag}>`;
 function block(id){
  const x=allBlocks[id];if(x.kind!=='public')return '';
  let tag=x.tag,cls=x.className||'',text=esc(x.text);
  if(tag==='h2'&&cls==='page-headline'){tag='h1';cls='hero-title';text=words(x.text);}
  else if(tag==='h3'){tag='h2';cls='section-title';text=words(x.text);}
  if(cls==='ready-cta')return `<a class="cta" href="#${id.includes('-s04-')?'inscricao':id.includes('-s09-')?'encontro':'inscricao'}" data-copy-id="${id}"><span class="cta-label">${text}</span>${arrow}</a>`;
  if(cls==='price')return `<div class="main-price" data-copy-id="${id}">${text}</div>`;
  if(tag==='li'&&id.includes('-s07-'))return `<li data-copy-id="${id}" data-surface>${text}</li>`;
  return `<${tag} class="${cls}" data-copy-id="${id}">${text}</${tag}>`;
 }
 function tree(node){
  if(node.type==='block')return block(node.id);
  let tag=node.tag,cls=node.className||'';
  if(tag==='section')return node.children.map(tree).join('');
  if(cls==='timeline'){
   return `<div class="program-flow" data-progress><div class="flow-track" aria-hidden="true"><span></span></div>${node.children.map((ch,i)=>`<details class="program-step" data-step${i===0?' open':''}><summary>${tree(ch.children[0])}${plus}</summary><div class="program-answer">${ch.children.slice(1).map(tree).join('')}</div></details>`).join('')}</div>`;
  }
  if(cls==='grid')cls='history-grid';
  if(cls==='card')cls='history-card';
  if(cls==='quote')cls='client-quote';
  if(cls==='mini-hero')cls='hero-source';
  if(tag==='li')return `<li class="list-item">${check}${node.children.map(tree).join('')}</li>`;
  return `<${tag}${cls?` class="${cls}"`:''}>${node.children.map(tree).join('')}</${tag}>`;
 }
 function section(n){
  const ss=data.shared[n]||variant.sections[n];
  const ids={1:'inicio',2:'olhar',3:'mapa',4:'encontro',5:'para-quem',6:'stella',7:'materiais-incluidos',8:'inscricao',9:'duvidas',10:'reflexao'};
  let body=tree(ss.tree),after='';
  if(n===1)body=`<div class="hero-layout"><div class="hero-copy">${body}</div>${heroArt()}</div>`;
  if(n===2)body+=`<div class="care-orbit" aria-hidden="true" data-surface><span></span><span></span><i></i></div>`;
  if(n===3)body=body.replaceAll('class="history-card"','class="history-card" data-surface');
  if(n===5)body+=`<div class="choice-art" aria-hidden="true" data-ambient>${ribbon('care')}</div>`;
  if(n===6){
   const proofHeading=ss.blocks.find(x=>x.id.endsWith('-s06-b005'));
   const introEnd=body.indexOf(block(proofHeading.id));
   if(introEnd<0)throw Error('Expert introduction boundary missing');
   body=`<div class="expert-intro"><div class="expert-copy">${body.slice(0,introEnd)}</div><figure class="expert-portrait"><img src="/images/stella-stuane.jpg" alt="Stella Stuane" width="480" height="640" loading="lazy" decoding="async"></figure></div>${body.slice(introEnd)}`;
   const marker=body.indexOf('<blockquote');if(marker>=0)body=body.slice(0,marker)+'<div class="quote-grid">'+body.slice(marker)+'</div>';
   body+='<div class="listening-arc" aria-hidden="true"></div>';
  }
  if(n===7)body=body.replace('<ul>','<ul class="materials-list">');
  if(n===8){
   const guarantee=ss.blocks.find(x=>x.id.endsWith('-s08-b008'));
   body=body.replace(block(guarantee.id),'');
   after=`<section class="section guarantee-section" id="garantia" aria-label="Garantia de 7 dias" data-motion-section><div class="wrap guarantee-content"><div class="guarantee-seal" aria-label="Garantia de 7 dias">${ui('ui-seal-label','span','guarantee-seal__label')}${ui('ui-seal-number','strong','guarantee-seal__number')}${ui('ui-seal-unit','span','guarantee-seal__unit')}</div><div class="guarantee-copy">${block(guarantee.id)}</div></div></section>`;
   const baseprice=ss.blocks.find(x=>x.className==='price');
   const price=(id,text,amount)=>`<div class="lot-price" data-counter="${amount}"><span class="semantic-price" data-copy-id="${id}">${esc(text)}</span><span class="visual-price" aria-hidden="true">${esc(text)}</span></div>`;
   body+=`<div class="lots" data-lots><div class="lot current">${ui('ui-lot1','h3')}${price('lot-price-1',baseprice.text,27)}</div><div class="lot">${ui('ui-lot2','h3')}${price('ui-price2',data.additions['ui-price2'],77)}</div><div class="lot">${ui('ui-lot3','h3')}${price('ui-price3',data.additions['ui-price3'],127)}</div></div><div class="offer-finish"><div class="countdown" role="timer" aria-label="Cronômetro"><div><span class="digits" data-copy-dynamic="count-days">00</span>${ui('ui-days')}</div><div><span class="digits" data-copy-dynamic="count-hours">00</span>${ui('ui-hours')}</div><div><span class="digits" data-copy-dynamic="count-minutes">00</span>${ui('ui-minutes')}</div><div><span class="digits" data-copy-dynamic="count-seconds">00</span>${ui('ui-seconds')}</div></div></div>`;
  }
  if(n===9){
   const children=ss.tree.children,parts=[];
   for(let i=0;i<children.length;i++){
    const ch=children[i],x=ch.type==='block'?allBlocks[ch.id]:null;
    if(x?.tag==='h4'){parts.push(`<details class="faq-item"><summary>${block(ch.id)}${plus}</summary><div class="faq-answer">${tree(children[++i])}</div></details>`);}
    else parts.push(tree(ch));
   }
   body=parts.join('');
  }
  if(n===10)body+=`<div class="closing-mark" aria-hidden="true"><span></span><i></i><span></span></div>`;
  return `<section class="section section-${n}${n===1?' hero':''}" id="${ids[n]}" data-section="${n}" data-motion-section><div class="wrap section-content">${body}</div></section>${after}`;
 }
 const sourceHeadline=variant.sections['1'].blocks.find(x=>x.className==='page-headline').text;
 const header=`<a class="skip" href="#inicio" data-copy-id="ui-skip">${esc(data.additions['ui-skip'])}</a><header class="site-header"><a class="brand" href="#inicio" data-copy-id="ui-brand">${esc(data.brand)}</a><nav aria-label="Navegação"><a href="#encontro" data-copy-id="ui-nav-program">${esc(data.additions['ui-nav-program'])}</a><a href="#para-quem" data-copy-id="ui-nav-who">${esc(data.additions['ui-nav-who'])}</a><a href="#stella" data-copy-id="ui-nav-about">${esc(data.additions['ui-nav-about'])}</a><a class="nav-cta" href="#inscricao" data-copy-id="ui-nav-offer">${esc(data.additions['ui-nav-offer'])}</a></nav></header>`;
 return shell(sourceHeadline,header+`<main>${Array.from({length:10},(_,i)=>section(i+1)).join('')}</main>`,revision,b);
}
export function shell(title,body,revision,b){return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#17394b"><title>${esc(title)} | Stella Stuane</title><meta name="description" content="Workshop ao vivo com Stella Stuane. Mapa do Padrão Afetivo, três histórias e critérios de reciprocidade."><meta name="site-revision" content="${esc(revision)}"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%2317394b'/%3E%3Ctext x='20' y='28' font-size='26' text-anchor='middle' fill='%23f5efe5' font-family='serif'%3ES%3C/text%3E%3C/svg%3E"><link rel="preload" href="/fonts/playfair.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/raleway.woff2" as="font" type="font/woff2" crossorigin><script>document.documentElement.classList.add('motion-prepared');window.__motionGuard=setTimeout(function(){document.documentElement.classList.remove('motion-prepared');window.__motionFailOpen=true},2200);</script><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head><body data-copy-root data-variant="${b}">${body}</body></html>`}
export function thanks(data,revision){return shell('Stella Stuane',`<main class="thank-you"><div class="thank-art" aria-hidden="true">${ribbon()}</div><h1 data-copy-id="thanks-title">${esc(data.additions['thanks-title'])}</h1><a class="cta" href="/a1" data-copy-id="thanks-back"><span>${esc(data.additions['thanks-back'])}</span>${arrow}</a></main>`,revision,'thanks')}
