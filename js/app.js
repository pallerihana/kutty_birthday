(()=>{'use strict';
const $=s=>document.querySelector(s),el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,S=C.scenes;let cur=0,secs=[];
$('#ttl').textContent=C.title;$('#hd').textContent=C.heading;document.title=C.title;
/* ---- hearts & bursts ---- */
if(!reduce){const L=$('#fx'),sy=['♥','♡','❤','💗','✨','❀'];for(let i=0;i<14;i++){const h=el('span','h',sy[i%6]);h.style.cssText=`left:${Math.random()*100}%;font-size:${12+Math.random()*22}px;animation-duration:${10+Math.random()*10}s;animation-delay:${-Math.random()*15}s;opacity:${.2+Math.random()*.4}`;L.append(h)}}
document.addEventListener('click',e=>{if(reduce||!e.target.closest('button'))return;for(let i=0;i<8;i++){const b=el('span','b','♥');b.style.left=e.clientX+'px';b.style.top=e.clientY+'px';b.style.setProperty('--dx',(Math.random()*120-60)+'px');b.style.setProperty('--dy',(-30-Math.random()*90)+'px');$('#fx2').append(b);setTimeout(()=>b.remove(),1000)}});
/* ---- audio (works even if the file is missing) ---- */
const au=new Audio(C.music);au.loop=true;au.volume=1;au.preload='auto';let musicOn=false;
function playMusic(){if(musicOn)return;musicOn=true;au.play().catch(()=>synth(true))}
/* ---- photos with graceful placeholder ---- */
function photo(src,cap,open,cls,it){const f=el('figure','pol '+(cls||''));f.tabIndex=0;const i=new Image();i.alt=cap||'Memory photo';i.loading='lazy';
const base=src.replace(/\.\w+$/,''),ex=['jpeg','png','webp','JPG','JPEG','PNG','WEBP','gif','avif'];let n=0;
i.onerror=()=>{if(n<ex.length)i.src=base+'.'+ex[n++];else{f.classList.add('ph');i.replaceWith(el('div','phi','📷 Your photo goes here'))}};
i.onload=()=>{if(it)it.src=i.src};i.src=src;f.append(i,el('figcaption','',cap||''));
const go=()=>{if(!f.classList.contains('ph')&&open)open(i.src)};f.onclick=go;f.onkeydown=e=>{if(e.key==='Enter')go()};return f}
/* ---- lightbox ---- */
let LB=[],li=0;const lb=$('#lb');
function showLB(i){li=(i+LB.length)%LB.length;const x=LB[li];$('#li').src=x.src;$('#li').alt=x.cap;$('#lc').textContent=x.cap}
function openLB(l,i){LB=l;lb.classList.remove('hide');showLB(i)}
$('#lx').onclick=()=>lb.classList.add('hide');$('#lp').onclick=()=>showLB(li-1);$('#ln').onclick=()=>showLB(li+1);
let tx=0;lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX);lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)showLB(li+(d<0?1:-1))});
/* ---- gallery (22+ editable slots) ---- */
const gal=$('#gal');

(function(){const g=$('#gg'),all=[];C.gallery.groups.forEach(([f,t])=>{g.append(el('h3','',t));const r=el('div','gr');for(let n=1;n<=C.gallery.n;n++){const k=f+'/photo-0'+n,it={src:`images/${k}.jpg`,cap:C.gallery.captions[k]||t};all.push(it);const idx=all.length-1;r.append(photo(it.src,it.cap,()=>openLB(all,idx),'',it))}g.append(r)})})();

$('#gb').onclick=()=>gal.classList.remove('hide');$('#gx').onclick=()=>gal.classList.add('hide');
/* ---- scene helpers ---- */
function lines(b,a,st=0,step=.8){a.forEach((t,i)=>{const p=el('p','l',t);p.style.animationDelay=(st+i*step)+'s';b.append(p)})}
function card(x){x.classList.add('letter');x.prepend(el('span','hc a','💗'),el('span','hc b','🌹'),el('span','hc c','♥'))}
function bunny(){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('class','bun');s.setAttribute('aria-hidden','true');const u=document.createElementNS('http://www.w3.org/2000/svg','use');u.setAttribute('href','#bun');s.append(u);return s}
function fx(k){const d=el('div','row');
if(k==='map'){d.className='map';d.append(el('b','','SRM, Chennai'),el('u'),el('b','','Anil · ~800 km'));const w=el('div','row');['Feb','Mar','Apr','May','Jun','Jul','Aug'].forEach(m=>w.append(el('small','',m)));const x=el('div');x.append(d,w);return x}
if(k==='auto'){d.className='road';d.append(el('i','','🛺'));return d}
if(k==='waves'){d.className='waves';return d}
if(k==='fill'){d.className='fh';d.textContent='♥';d.setAttribute('aria-hidden','true');return d}
if(k==='pom'){for(let i=0;i<24;i++){const s=el('span','seed','●');s.style.animationDelay=(i*.25)+'s';d.append(s)}return d}
d.textContent=k;d.setAttribute('aria-hidden','true');return d}
function btns(b,list){const w=el('div','btns');list.forEach(([t,f])=>{const x=el('button','',t);x.onclick=f;w.append(x)});b.append(w)}
/* ---- scene builder ---- */
function build(s,i){const sec=el('section','scene hide'+(s.dk?' dk':'')+(s.rain?' rainy':''));sec.id='s'+(i+1);sec.style.backgroundImage=C.bg[i];
const b=el('div','in');sec.append(b);b.append(el('h2','',s.t));if(s.d)b.append(el('p','date',s.d==='__BDAY__'?C.birthday:s.d));
if(s.fx)b.append(fx(s.fx));if(s.bun){const w=el('div','bunrow');for(let k=0;k<s.bun;k++)w.append(bunny());b.append(w);if(s.hold){const h=el('button','','🤝 Press & hold to hold my hand');h.style.touchAction='none';let t;const go1=()=>{if(w.classList.contains('near'))return;w.classList.add('near','beat');beat();t=setInterval(beat,900)},off=()=>{clearInterval(t);w.classList.remove('near','beat')};h.onpointerdown=go1;['pointerup','pointerleave','pointercancel'].forEach(v=>h['on'+v]=off);h.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go1()}};h.onkeyup=off;b.append(h)}}
const body=el('div');const ph=()=>s.img&&body.append(photo(s.img,s.cap,u=>openLB([{src:u,cap:s.cap}],0)));
if(s.k==='env'){const e=el('button','env','💌');e.setAttribute('aria-label','Open the letter');e.onclick=()=>{e.classList.add('open');card(body);lines(body,s.p,0,1);ph()};b.append(e,body)}
else if(s.k==='reveal'){const f=photo(s.img,s.cap,u=>openLB([{src:u,cap:s.cap}],0),'blur');b.append(f,body);btns(b,[[s.btn,function(){f.classList.remove('blur');this.remove();card(body);lines(body,s.p)}]]);}
else if(s.k==='game'){const g=s.game;const gc=el('div');card(gc);lines(gc,s.p,0,.5);b.append(gc);const q=el('div','glass');q.append(el('h3','',g.q));const o=el('div','opts'),fb=el('p','fb');g.o.forEach(([t,c],n)=>{const x=el('button','',t);x.onclick=()=>{fb.textContent=c;x.classList.toggle('ok',n===g.ans)};o.append(x)});q.append(o,fb);b.append(q);b.append(body);ph()}
else if(s.k==='cards'){const g=el('div','grid');s.reasons.forEach((r,n)=>{const x=el('button','rc','♥ '+(n+1));x.setAttribute('aria-label','Reason '+(n+1));let on=0;x.onclick=()=>{on=!on;x.textContent=on?r:'♥ '+(n+1)};g.append(x)});b.append(g)}
else if(s.k==='gift'){const g=el('button','gift','🎁');g.setAttribute('aria-label','Open your gift');g.onclick=()=>{g.remove();card(body);const c=el('div','cake');c.append('🎂 ');['🕯️','🕯️','🕯️'].forEach(x=>c.append(el('span','cdl',x)));c.append(' 🌸');body.prepend(c);const bl=el('button','','💨 Blow out the candles & make a wish');bl.onclick=()=>{c.querySelectorAll('.cdl').forEach(x=>{x.className='';x.textContent='💨'});confetti();bl.textContent='Make a wish, Kutty ✨';bl.disabled=true};c.after(bl);lines(body,s.p,.4,.9)};b.append(g,body)}
else if(s.k==='letter'){const p=[...s.p],box=el('div');card(box);body.append(box);let n=0,t;const add=()=>{if(n>=p.length){clearInterval(t);end();return}const e=el('p','l',p[n++]);e.style.animationDelay='0s';box.append(e);e.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'})};
const sk=el('button','ghost','Skip animation');sk.onclick=()=>{while(n<p.length)add();sk.remove()};
const end=()=>{sk.remove();btns(b,[['Replay Our Love Story ❤️',()=>{render();go(0)}],['Open Our Memory Gallery 📸',()=>gal.classList.remove('hide')]])};
b.append(body,sk);new IntersectionObserver((e,ob)=>{if(e[0].isIntersecting){ob.disconnect();if(reduce){sk.click()}else{add();t=setInterval(add,1700)}}}).observe(sec)}
else{card(body);lines(body,s.p,0,.6);b.append(body);ph();if(s.note)b.append(el('p','date',s.note))}
return sec}
function render(){C.tasks.forEach(t=>t.done=0);const st=$('#stage');st.replaceChildren();secs=S.map((s,i)=>{const e=build(s,i);st.append(e);return e})}
/* ---- navigation ---- */
function go(i){cur=Math.max(0,Math.min(S.length-1,i));secs.forEach((e,n)=>e.classList.toggle('hide',n!==cur));$('#lbl').textContent=`Scene ${cur+1} of ${S.length}`;$('#prev').disabled=cur===0;$('#next').disabled=cur===S.length-1;$('#bar').style.width=((cur+1)/S.length*100)+'%';scrollTo(0,0);petals(cur===S.length-1)}
function nxt(){const t=C.tasks.find(x=>x.after===cur+1&&!x.done);t?runTask(t,()=>go(cur+1)):go(cur+1)}
$('#prev').onclick=()=>go(cur-1);$('#next').onclick=nxt;
const open=()=>!$('#story').classList.contains('hide')&&gal.classList.contains('hide')&&$('#task').classList.contains('hide')&&lb.classList.contains('hide');
addEventListener('keydown',e=>{if(e.key==='Escape'){gal.classList.add('hide');lb.classList.add('hide')}else if(!lb.classList.contains('hide')){if(e.key==='ArrowRight')showLB(li+1);if(e.key==='ArrowLeft')showLB(li-1)}else if(open()){if(e.key==='ArrowRight')nxt();if(e.key==='ArrowLeft')go(cur-1)}});
let sx=0;document.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});document.addEventListener('touchend',e=>{if(!open())return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>90)d<0?nxt():go(cur-1)},{passive:true});
function start(){playMusic();$('#cover').classList.add('hide');$('#quiz').classList.add('hide');$('#story').classList.remove('hide');$('#nav').classList.remove('hide');render();go(0)}
/* ---- quiz ---- */
function quiz(){playMusic();$('#cover').classList.add('hide');$('#quiz').classList.remove('hide');let n=0;const box=$('#qbox');
function ask(){box.replaceChildren();const q=C.quiz[n];$('#qprog').textContent=`Question ${n+1} of ${C.quiz.length}`;box.append(el('h2','',q.q));const o=el('div','opts'),fb=el('p','fb');
const arr=q.w.slice();arr.splice(n%3,0,q.a);arr.forEach(t=>{const x=el('button','',t);x.onclick=()=>{if(t===q.a){x.classList.add('ok');o.querySelectorAll('button').forEach(y=>y.disabled=true);fb.textContent=C.quizOk[n%C.quizOk.length];setTimeout(()=>{++n<C.quiz.length?ask():fin()},1100)}else fb.textContent=`Almost, ${C.nick}! Try once more ❤️ Hint: ${q.h}`};o.append(x)});box.append(o,fb)}
function fin(){$('#qprog').textContent='';box.replaceChildren();const h=el('div','fh','♥');h.style.animationDuration='1.5s';box.append(h,el('p','','You remembered our little story.'),el('p','','Now let me show you how it feels from my side. ❤️'));const x=el('button','','Enter our little universe ❤️');x.onclick=start;box.append(x)}
ask()}
$('#go').onclick=quiz;$('#open').onclick=quiz;$('#skip').onclick=start;

/* ---- super features: synth music, heartbeat, confetti, petals, sparkles, stars ---- */
let ac,pad,pt;const AC=()=>ac=ac||new(window.AudioContext||window.webkitAudioContext)();
function synth(o){if(!o){if(pad){clearInterval(pad.t);pad.g.gain.value=0;pad=null}return}const a=AC();a.resume();const g=a.createGain();g.gain.value=.5;g.connect(a.destination);const ch=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]];let i=0;
const play=()=>ch[i++%4].forEach(f=>{const x=a.createOscillator(),e=a.createGain();x.frequency.value=f;e.gain.setValueAtTime(0,a.currentTime);e.gain.linearRampToValueAtTime(.3,a.currentTime+1.5);e.gain.linearRampToValueAtTime(0,a.currentTime+4);x.connect(e);e.connect(g);x.start();x.stop(a.currentTime+4.2)});play();pad={g,t:setInterval(play,3500)}}
function beat(){try{const a=AC();a.resume();[0,.22].forEach(d=>{const x=a.createOscillator(),e=a.createGain(),t=a.currentTime+d;x.frequency.value=55;e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.5,t+.03);e.gain.exponentialRampToValueAtTime(.0001,t+.25);x.connect(e);e.connect(a.destination);x.start(t);x.stop(t+.3)})}catch(e){}navigator.vibrate&&navigator.vibrate([60,80,60])}
function confetti(){if(reduce)return;const c=['#D94F83','#F6B8C8','#DCD6FF','#ffd166','#fff'];for(let i=0;i<60;i++){const p=el('span','cf');p.style.cssText=`left:${Math.random()*100}%;background:${c[i%5]};animation-delay:${Math.random()*.8}s;animation-duration:${2+Math.random()*2}s`;$('#fx2').append(p);setTimeout(()=>p.remove(),5000)}}
function petals(o){clearInterval(pt);if(!o||reduce)return;pt=setInterval(()=>{const p=el('span','pt',['🌸','❀','🌹'][Math.random()*3|0]);p.style.cssText=`left:${Math.random()*100}%;font-size:${14+Math.random()*16}px;animation-duration:${6+Math.random()*5}s`;$('#fx2').append(p);setTimeout(()=>p.remove(),11000)},450)}
if(!reduce){let lt=0;addEventListener('pointermove',e=>{const n=Date.now();if(n-lt<70)return;lt=n;const p=el('span','sp','✦');p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';$('#fx2').append(p);setTimeout(()=>p.remove(),700)},{passive:true});document.body.append(el('div','stars'))}

/* ---- crazy tasks ---- */
function runTask(t,done){const o=$('#task'),b=$('#tb');o.classList.remove('hide');b.replaceChildren(el('p','date','Little challenge 🎮'),el('h2','',t.title));
const end=()=>{o.classList.add('hide');t.done=1;done()};
const fin=()=>{confetti();b.replaceChildren(el('h2','','You did it! 🎉'),el('p','',t.reward));const c=el('button','','Continue ❤️');c.onclick=end;b.append(c)};
const T={
catch(){let n=0;const c=el('p','fb','Caught: 0 / '+t.goal),a=el('div','arena');b.append(c,a);const sp=()=>{if(o.classList.contains('hide')||n>=t.goal){clearInterval(iv);return}const h=el('button','ch','💗');h.setAttribute('aria-label','Catch heart');h.style.left=Math.random()*80+'%';h.style.animationDuration=(3+Math.random()*2)+'s';h.onclick=()=>{h.remove();n++;c.textContent=`Caught: ${n} / ${t.goal}`;if(n>=t.goal){clearInterval(iv);fin()}};a.append(h);setTimeout(()=>h.remove(),5200)};const iv=setInterval(sp,650);sp()},
memory(){const em=['🌸','🛺','🚇','⛪','🌊','🍎'];const d=[...em,...em].sort(()=>Math.random()-.5);let op=[],m=0;const g=el('div','mg');d.forEach(e=>{const k=el('button','mc','❔');k.onclick=()=>{if(op.length>1||k.dataset.f)return;k.textContent=e;k.dataset.f=1;op.push(k);if(op.length===2){const[p,q]=op;if(p.textContent===q.textContent){m++;op=[];if(m===em.length)setTimeout(fin,500)}else setTimeout(()=>{[p,q].forEach(z=>{z.textContent='❔';delete z.dataset.f});op=[]},700)}};g.append(k)});b.append(g)},
tap(){let n=0,on=0,tm;const c=el('p','fb',`0 / ${t.goal}`),h=el('button','big','💖');h.setAttribute('aria-label','Tap');h.onclick=()=>{if(!on){on=1;tm=setTimeout(()=>{if(n<t.goal){n=0;on=0;c.textContent=`Time's up! Try again 0 / ${t.goal}`}},t.time*1000)}n++;c.textContent=`${n} / ${t.goal}`;if(n>=t.goal){clearTimeout(tm);fin()}};b.append(c,h)},
type(){const i=document.createElement('input');i.setAttribute('aria-label','Your answer');i.placeholder='Type here...';const x=el('button','','Check ✨'),m=el('p','fb');x.onclick=()=>{i.value.trim().toLowerCase()===t.answer?fin():m.textContent='Almost, Kutty! Try once more ❤️ Hint: '+t.hint};b.append(i,x,m)}};
T[t.type]();const sk=el('button','ghost','Skip this task');sk.onclick=end;b.append(sk)}
{const cb=el('div','bunrow');cb.append(bunny(),bunny());$('#cover').prepend(cb)}
/* ---- opening pages: date lock + aunty challenge ---- */
const PAGES=['lock','aunty','cover','quiz'];
function showPage(id){PAGES.forEach(p=>$('#'+p).classList.toggle('hide',p!==id));scrollTo(0,0)}
function shower(){if(reduce)return;for(let i=0;i<40;i++){const p=el('span','pt','💗');p.style.cssText=`left:${Math.random()*100}%;font-size:${12+Math.random()*14}px;animation-duration:${2.5+Math.random()*2}s;animation-delay:${Math.random()*1.2}s`;$('#fx2').append(p);setTimeout(()=>p.remove(),6000)}}
{const bd=$('#bd'),ul=$('#ul'),lk=$('#lk'),lm=$('#lm');
ul.onclick=()=>{const m=/^\d{4,}-(\d{2})-(\d{2})$/.exec(bd.value);
if(!m){lm.textContent='Pick your date first, Kutty 💗';return}
if(+m[1]===C.lockDate.m&&+m[2]===C.lockDate.d){playMusic();bd.disabled=true;ul.disabled=true;lk.classList.add('open');shower();
lm.textContent="Correct, Kutty! ❤️\n\nHow could you forget your own special day?\n\nBut wait...\n\nYou haven't unlocked the whole surprise yet!";
setTimeout(()=>{showPage('aunty');confetti()},reduce?2500:4800)}
else{lk.classList.remove('shake');void lk.getBoundingClientRect();lk.classList.add('shake');lm.textContent="Oops, Kutty! That's not the date I'm looking for. 😜\n\nTry again, my birthday girl!"}};
bd.onkeydown=e=>{if(e.key==='Enter')ul.click()};
$('#hint').onclick=()=>$('#hm').textContent='Not your date, Kutty... YOUR date! ❤️'}
{const no=$('#no'),yes=$('#yes');let stopped=false,ph;
function flee(){if(stopped)return;const r=no.getBoundingClientRect();
if(!no.classList.contains('flee')){ph=el('span');ph.style.cssText=`display:inline-block;width:${r.width}px;height:${r.height}px`;no.before(ph);no.classList.add('flee');no.style.left=r.left+'px';no.style.top=r.top+'px'}
const W=innerWidth,H=innerHeight,m=10,av=['#yes','#aq','#bw'].map(s=>$(s).getBoundingClientRect());let b=null;
for(let i=0;i<60&&!b;i++){const x=m+Math.random()*Math.max(1,W-r.width-2*m),y=m+Math.random()*Math.max(1,H-r.height-2*m);
if(Math.hypot(x-r.left,y-r.top)>70&&av.every(a=>x+r.width+10<a.left||x>a.right+10||y+r.height+10<a.top||y>a.bottom+10))b=[x,y]}
if(!b)b=[m,H-r.height-m];no.style.left=b[0]+'px';no.style.top=b[1]+'px'}
no.addEventListener('pointerdown',e=>{e.preventDefault();flee()});
no.onclick=e=>{e.preventDefault();flee()};
addEventListener('pointermove',e=>{if(stopped||e.pointerType==='touch'||$('#aunty').classList.contains('hide'))return;const r=no.getBoundingClientRect();if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))<Math.max(90,r.width))flee()},{passive:true});
addEventListener('resize',()=>{if(!stopped&&no.classList.contains('flee'))flee()});
yes.onclick=()=>{stopped=true;confetti();$('#bw').classList.add('laugh');no.remove();if(ph)ph.remove();
['yn','ah','aqq','asub'].forEach(i=>$('#'+i).classList.add('hide'));
const m=$('#ymsg');m.textContent="Hahaha! 😂❤️\n\nI knew it, Kutty!\n\nAunty officially confirmed!\n\nOkay, okay... you're still my cutest birthday girl.\n\nNow let me show you something I made with all my heart.";
m.classList.remove('hide');$('#go2').classList.remove('hide')};
$('#go2').onclick=()=>showPage('cover')}
})();
