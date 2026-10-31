const ease='cubic-bezier(.22,1,.36,1)';
const headingStates=new Map();
const counters=new Map();
const ambientTargets=[...document.querySelectorAll('[data-ambient]')];
let geometryFrame=0;
function updateGeometry(){
 geometryFrame=0;
 for(const flow of document.querySelectorAll('[data-progress]')){
  const rect=flow.getBoundingClientRect();
  if(rect.bottom<0||rect.top>innerHeight)continue;
  const steps=[...flow.querySelectorAll('[data-step]')];
  const reach=innerHeight*.68;
  const ratio=Math.min(1,Math.max(0,(reach-rect.top-25)/Math.max(1,rect.height-45)));
  flow.style.setProperty('--progress',ratio);
  const fill=flow.querySelector('.flow-track span');if(fill)fill.style.transform=`scaleY(${ratio})`;
  for(const step of steps)step.classList.toggle('reached',step.getBoundingClientRect().top+25<=reach);
 }
}
function geometrySoon(){if(!geometryFrame)geometryFrame=requestAnimationFrame(updateGeometry)}
function endCounter(el,state){
 if(state.frame)cancelAnimationFrame(state.frame);
 state.frame=0;state.done=true;el.dataset.counterState='settled';
 el.querySelector('.visual-price').textContent=state.final;
 el.classList.remove('is-counting');el.classList.add('has-counter');
}
function startCounter(el,state){
 if(state.started)return;state.started=true;state.start=performance.now();el.dataset.counterState='running';el.classList.add('is-counting');
 const tick=now=>{
  if(document.hidden){state.pausedAt=now;state.frame=0;return;}
  const t=Math.min(1,(now-state.start)/2900),v=Math.floor(state.amount*(1-Math.pow(1-t,3)));
  el.querySelector('.visual-price').textContent=t===1?state.final:'R$ '+v;
  if(t<1)state.frame=requestAnimationFrame(tick);else endCounter(el,state);
 };
 state.tick=tick;state.frame=requestAnimationFrame(tick);
}
function prepareMotion(){
 if(window.__motionFailOpen||!('IntersectionObserver'in window)||!Element.prototype.animate){document.documentElement.classList.remove('motion-prepared');return;}
 clearTimeout(window.__motionGuard);document.documentElement.classList.add('motion-ready');document.body.dataset.motionPolicy='automatic';
 const titleObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){const state=headingStates.get(entry.target);if(!state)continue;
   if(entry.isIntersecting&&!state.started){state.started=true;entry.target.dataset.entrance='running';state.animations.forEach(a=>a.play());Promise.all(state.animations.map(a=>a.finished.catch(()=>{}))).then(()=>{entry.target.dataset.entrance='settled'});}
   else if(!entry.isIntersecting&&state.started){state.animations.forEach(a=>{if(a.playState!=='finished')a.finish()});entry.target.dataset.entrance='settled';}
  }
 },{threshold:0,rootMargin:'0px 0px -45px 0px'});
 for(const title of document.querySelectorAll('h1:has([data-word]),h2:has([data-word])')){
  const animations=[...title.querySelectorAll('[data-word]')].map((word,i)=>{const a=word.animate([{transform:'translateY(115%)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:1200,delay:i*95,easing:ease,fill:'both'});a.pause();a.currentTime=0;return a});
  title.dataset.entrance='prepared';headingStates.set(title,{animations,started:false});titleObserver.observe(title);
 }
 const sectionObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-reached');e.target.dataset.motionState='entered';}e.target.classList.toggle('is-in-view',e.isIntersecting)}},{threshold:0,rootMargin:'0px 0px -50px 0px'});
 document.querySelectorAll('[data-motion-section]').forEach(s=>sectionObserver.observe(s));
 const surfaceObserver=new IntersectionObserver(entries=>{for(const e of entries){e.target.classList.toggle('is-visible',e.isIntersecting);if(e.isIntersecting)e.target.dataset.presented='true'}},{threshold:.05});
 document.querySelectorAll('[data-surface],[data-ambient]').forEach(s=>surfaceObserver.observe(s));
 const counterObserver=new IntersectionObserver(entries=>{for(const e of entries){const s=counters.get(e.target);if(e.isIntersecting)startCounter(e.target,s);else if(s.started&&!s.done)endCounter(e.target,s)}},{threshold:.4});
 for(const el of document.querySelectorAll('[data-counter]')){
  const state={amount:Number(el.dataset.counter),final:el.querySelector('.semantic-price').textContent,started:false,done:false,frame:0};counters.set(el,state);
  el.classList.add('has-counter');el.dataset.counterState='prepared';el.querySelector('.visual-price').textContent='R$ 0';counterObserver.observe(el);
 }
 document.addEventListener('visibilitychange',()=>{
  document.documentElement.classList.toggle('tab-hidden',document.hidden);
  for(const state of headingStates.values())for(const a of state.animations){if(document.hidden&&a.playState==='running'){a.pause();a.wasHidden=true}else if(!document.hidden&&a.wasHidden){a.wasHidden=false;a.play()}}
  for(const [el,s]of counters){if(document.hidden&&s.started&&!s.done){if(s.frame)cancelAnimationFrame(s.frame);s.pausedAt=performance.now();s.frame=0}else if(!document.hidden&&s.pausedAt&&!s.done){s.start+=performance.now()-s.pausedAt;s.pausedAt=0;s.frame=requestAnimationFrame(s.tick)}}
  if(!document.hidden)geometrySoon();
 });
}
function timer(){
 const nodes=[...document.querySelectorAll('[data-copy-dynamic]')];if(!nodes.length)return;
 const key='stella-stuane-328:offer-expiry';let expiry=0;
 try{const value=localStorage.getItem(key);expiry=value?Number(value):Date.now()+4*24*60*60*1000;if(!value)localStorage.setItem(key,String(expiry));if(!Number.isFinite(expiry)||expiry<=0)expiry=0;}catch{expiry=0;}
 const draw=()=>{
  let seconds=Math.max(0,Math.ceil((expiry-Date.now())/1000));
  const values=[Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60];
  nodes.forEach((node,i)=>{node.textContent=String(values[i]).padStart(2,'0')});
  document.querySelector('.countdown').dataset.state=seconds?'running':'finished';
 };
 draw();setInterval(()=>{if(!document.hidden)draw()},1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw()});
}
function pointer(){
 if(!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
 const art=document.querySelector('.hero-art');if(!art)return;
 const mat=art.querySelector('.art-mat');let frame=0,x=0,y=0;
 art.addEventListener('pointermove',event=>{const r=art.getBoundingClientRect();x=(event.clientX-r.left)/r.width-.5;y=(event.clientY-r.top)/r.height-.5;if(!frame)frame=requestAnimationFrame(()=>{mat.style.transform=`rotateX(${-y*3}deg) rotateY(${x*4}deg)`;frame=0})});
 art.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);frame=0;mat.style.transform=''});
}
prepareMotion();timer();pointer();geometrySoon();
addEventListener('scroll',geometrySoon,{passive:true});addEventListener('resize',geometrySoon,{passive:true});
document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',geometrySoon));
