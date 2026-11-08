const $=id=>document.getElementById(id),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
if(fine)document.documentElement.classList.add('fine');

/* sound (off by default) */
let snd=false,ac;
function beep(f=660,l=.18){if(!snd)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime;o.frequency.value=f;v.gain.setValueAtTime(.07,t);v.gain.exponentialRampToValueAtTime(.0001,t+l);o.connect(v);v.connect(ac.destination);o.start();o.stop(t+l)}catch(e){}}
$('snd').onclick=e=>{snd=!snd;e.currentTarget.textContent=snd?'🔊':'🔇';beep(880)};

const NAME='Mochi'; // mascot name used in game messages
/* floating hearts, ribbons and sparkles */
const fx=$('fx'),fc=fx.getContext('2d'),pal=['#ff9ccc','#ff6b9d','#ffc2dc','#ffd98a','#ffffff','#d9b8ff'];let FW,FH,ps=[];
fc.textAlign='center';fc.textBaseline='middle';
const rs=()=>{FW=fx.width=innerWidth;FH=fx.height=innerHeight};rs();addEventListener('resize',rs);
const sp=(x,y,a)=>ps.push({x,y,a,h:Math.random()<.55,b:Math.random()<.1,vx:rnd(-.3,.3),vy:a?rnd(-.6,-.2):rnd(-.4,.2),r:rnd(3,7),l:a?Math.random():1,c:pick(pal)});
for(let i=0;i<(RM?25:55);i++)sp(rnd(0,FW),rnd(0,FH),1);
function hrt(x,y,s){fc.beginPath();fc.moveTo(x,y+s*.9);fc.bezierCurveTo(x-s*1.6,y-s*.2,x-s*.7,y-s*1.4,x,y-s*.5);fc.bezierCurveTo(x+s*.7,y-s*1.4,x+s*1.6,y-s*.2,x,y+s*.9);fc.fill()}
function tick(t){fc.clearRect(0,0,FW,FH);ps=ps.filter(p=>{if(!RM){p.x+=p.vx+Math.sin(t/900+p.y/80)*.25;p.y+=p.vy;p.l-=p.a?.0022:.03}if(p.l<=0){if(!p.a)return false;p.x=rnd(0,FW);p.y=FH+10;p.l=1}
fc.globalAlpha=Math.min(1,p.l*2)*(.6+.4*Math.sin(t/400+p.x));fc.fillStyle=fc.shadowColor=p.c;fc.shadowBlur=10;
if(p.b){fc.font=`${p.r*4}px serif`;fc.fillText('🎀',p.x,p.y)}else if(p.h)hrt(p.x,p.y,p.r);else{fc.beginPath();fc.arc(p.x,p.y,p.r*.4,0,6.3);fc.fill()}return true});if(!RM)requestAnimationFrame(tick)}
requestAnimationFrame(tick);

/* cursor */
addEventListener('pointermove',e=>{if(!fine)return;$('cur').style.transform=`translate(${e.clientX}px,${e.clientY}px)`;if(!RM&&Math.random()<.3)sp(e.clientX,e.clientY,0)});
document.addEventListener('pointerover',e=>$('cur').classList.toggle('hv',!!(e.target.closest&&e.target.closest('button,.card,.ct,.hh,#env'))));

/* twinkling stars, falling petals */
function twinkle(el,n){for(let i=0;i<n;i++){const s=document.createElement('i'),z=rnd(2,4);s.className='tw';s.style.cssText=`left:${rnd(0,100)}%;top:${rnd(0,75)}%;width:${z}px;height:${z}px;animation-delay:${rnd(0,3)}s`;el.append(s)}}
twinkle($('intro'),30);twinkle($('s6'),50);twinkle($('s7'),70);
for(let i=0;i<14;i++){const p=document.createElement('i');p.className='pt';p.textContent=pick(['🌸','💗','🎀','💖']);p.style.cssText=`left:${rnd(0,98)}%;font-size:${rnd(16,28)}px;animation-duration:${rnd(11,20)}s;animation-delay:-${rnd(0,16)}s`;$('s7').append(p)}

/* intro */
const intro=$('intro');
intro.addEventListener('pointermove',e=>{$('hc').style.transform=`perspective(600px) rotateY(${(e.clientX/innerWidth-.5)*30}deg) rotateX(${(.5-e.clientY/innerHeight)*20}deg)`});
$('enter').onclick=()=>{beep(784);beep(988,.3);intro.classList.add('go');intro.inert=true;document.body.classList.remove('lock');scrollTo(0,0)};

/* envelope + letter */
const env=$('env'),letter=$('letter');
letter.querySelectorAll('p').forEach((p,i)=>p.style.transitionDelay=(.8+i*1.4)+'s');
const openEnv=()=>{if(env.classList.contains('open'))return;env.classList.add('open');beep(660);setTimeout(()=>{letter.classList.add('show');beep(880,.3);setTimeout(()=>letter.scrollIntoView({behavior:'smooth',block:'center'}),1200)},800)};
env.onclick=openEnv;env.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openEnv()}};

/* reveal on scroll + parallax */
document.querySelectorAll('.stag').forEach(c=>[...c.children].forEach((e,i)=>e.style.transitionDelay=i*1.1+'s'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});
document.querySelectorAll('.rv,.stag').forEach(e=>io.observe(e));
const px=[...document.querySelectorAll('[data-px]')];let tk=0;
addEventListener('scroll',()=>{if(RM||tk)return;tk=requestAnimationFrame(()=>{tk=0;px.forEach(e=>{const r=e.parentElement.getBoundingClientRect();e.style.translate=`0 ${(r.top+r.height/2-innerHeight/2)*e.dataset.px}px`})})},{passive:true});

/* 3D card tilt */
document.querySelectorAll('.card').forEach(c=>{
c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.transform=`rotateY(${(x-.5)*26}deg) rotateX(${(.5-y)*26}deg) translateZ(18px)`;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%')});
c.addEventListener('pointerleave',()=>c.style.transform='');
c.addEventListener('click',()=>{beep(pick([660,740,880]));c.animate([{rotate:'0deg'},{rotate:'8deg'},{rotate:'-8deg'},{rotate:'0deg'}],{duration:500})})});

/* kawaii kingdom */
const yard=$('yard'),m4=$('m4'),pc=['#ff6b9d','#ff8fb8','#ffa8c9','#ff5c8a','#e6a1ff'],
comps=['You’re one of the kindest people ever. 💗','Your smile is contagious. ✨','You make ordinary days brighter.','Sweet, kind and unforgettable. 🎀','Hehe! You’re officially too cute.','Cuteness detected. Level: dangerous.','Royal announcement: this girl deserves unlimited hugs.','I was supposed to guard the castle, but I got distracted by cupcakes. 🧁'];
let hn=0;
function say(el,t){const b=el.querySelector('.bub');b.textContent=t;b.classList.add('on');clearTimeout(el.tt);el.tt=setTimeout(()=>b.classList.remove('on'),3200)}
function hop(el){el.classList.remove('jump');void el.offsetWidth;el.classList.add('jump')}
m4.onclick=()=>{say(m4,pick(comps));hop(m4);beep(900,.12)};
m4.addEventListener('animationend',e=>{if(e.animationName==='hop')m4.classList.remove('jump')});
function bloom(h){const r=h.getBoundingClientRect(),y=yard.getBoundingClientRect();for(let i=0;i<6;i++){yard.insertAdjacentHTML('beforeend',`<i class="pop" style="left:${r.left-y.left+r.width/2}px;top:${r.top-y.top+r.height/2}px;--dx:${rnd(-55,55)}px;--dy:${rnd(-65,-10)}px">${pick(['✨','💗','🎀','⭐'])}</i>`);const p=yard.lastElementChild;setTimeout(()=>p.remove(),800)}}
function spawn(){if(document.hidden&&!RM)return;
yard.insertAdjacentHTML('beforeend',`<svg class="hh" style="left:${rnd(4,90)}%;--s:${rnd(38,64)}px;--d:${rnd(7,11)}s;--c:${pick(pc)};--x:${rnd(-60,60)}px"><use href="#${Math.random()<.22?'bw':'hrt'}"/></svg>`);
const h=yard.lastElementChild;if(RM)h.style.bottom=rnd(22,80)+'%';
h.onanimationend=()=>h.remove();
h.onclick=()=>{bloom(h);h.remove();$('hp').textContent=++hn;say(m4,pick(comps));hop(m4);beep(rnd(700,1000),.12);if(RM)spawn()}}
if(RM)for(let i=0;i<8;i++)spawn();else setInterval(spawn,900);

/* mini game */
const cv=$('g'),cx=cv.getContext('2d'),GW=640,GH=400,K={},ov=$('ov'),gw=$('gw'),ot=$('ot'),od=$('od'),READY='Arrow keys or WASD to move, or drag your finger across the garden. Grab 10 hearts in 30 seconds!';
const flw=[...Array(16)].map(()=>({x:rnd(10,GW-10),y:rnd(150,GH-10),e:pick(['🌸','🌷','🌼'])}));
const bg=cx.createLinearGradient(0,0,0,GH);[[0,'#ffd9ea'],[.35,'#fff1f8'],[.36,'#ffc9de'],[1,'#ffa6c8']].forEach(s=>bg.addColorStop(...s));
let face=1;flw.push(...[80,310,540].map((x,i)=>({x,y:46+i*22,e:'☁️'})));
const mi=new Image();mi.onload=()=>{if(!run)draw(0)};mi.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="110" viewBox="0 0 120 110">'+$('mc').innerHTML+'</svg>');
let P={x:GW/2,y:GH/2},S=0,T=30,run=0,st=[],pp=[],last=0,tg=null;
const mk=()=>st.push({x:rnd(30,GW-30),y:rnd(60,GH-30),t:rnd(0,6)});
function draw(t){cx.fillStyle=bg;cx.fillRect(0,0,GW,GH);cx.textAlign='center';cx.textBaseline='middle';cx.font='22px serif';flw.forEach(f=>{cx.font=(f.e==='☁️'?'54px':'22px')+' serif';cx.fillText(f.e,f.x,f.y)});cx.font='32px serif';st.forEach(s=>cx.fillText(s.t>3?'💖':'💗',s.x,s.y+Math.sin(t/260+s.t)*5));const q=Math.sin(t/110)*.04;if(mi.naturalWidth){cx.save();cx.translate(P.x,P.y);cx.scale(face*(1-q),1+q);cx.drawImage(mi,-36,-33,72,66);cx.restore()}cx.font='bold 24px Caveat,cursive';pp.forEach(p=>{cx.globalAlpha=1-p.t;cx.fillStyle='#b4469a';cx.fillText(p.m,p.x,p.y-p.t*46);cx.globalAlpha=1})}
function loop(n){if(!run)return;const d=Math.min(.05,(n-last)/1000);last=n;T-=d;
let dx=(K.arrowright||K.d?1:0)-(K.arrowleft||K.a?1:0),dy=(K.arrowdown||K.s?1:0)-(K.arrowup||K.w?1:0);
if(tg){const vx=tg.x-P.x,vy=tg.y-P.y,l=Math.hypot(vx,vy);if(l>8){dx=vx/l;dy=vy/l}}
const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}if(dx)face=dx<0?-1:1;P.x=cl(P.x+dx*270*d,22,GW-22);P.y=cl(P.y+dy*270*d,22,GH-22);
st=st.filter(s=>{if(Math.hypot(s.x-P.x,s.y-P.y)<36){S++;pp.push({x:s.x,y:s.y,t:0,m:pick(['+1 💗','Yay!','Kawaii!','Mine now 🎀','Hehe ✨'])});beep(700+S*60,.15);return false}return true});
while(st.length<3&&S+st.length<10)mk();
pp.forEach(p=>p.t+=d*1.2);pp=pp.filter(p=>p.t<1);
$('sc').textContent=S;$('tm').textContent=Math.max(0,Math.ceil(T));draw(n);
if(S>=10)return end(1);if(T<=0)return end(0);requestAnimationFrame(loop)}
function end(w){run=0;ov.style.display='grid';ot.textContent=w?'OMG! YOU DID IT! 🎀':'Oh no! The hearts floated away 💔';
od.innerHTML=w?NAME+' has officially declared you the <b>Queen of Cuteness</b>!<br>Your reward: Unlimited hugs, pink bows, and magical happiness!':`Only ${S} heart${S==1?'':'s'}… ${NAME} is dramatically fainting onto a cupcake. 🧁<br>Every queen deserves a second try!`;
$('play').textContent=w?'Play again':'Try again';beep(w?988:220,.4);
if(w)for(let i=0;i<30;i++){const s=document.createElement('i');s.className='cf';s.textContent=['🎀','🌸','💗','✨'][i%4];s.style.cssText=`left:${rnd(0,100)}%;animation-delay:${rnd(0,.8)}s;font-size:${rnd(16,30)}px`;gw.append(s);setTimeout(()=>s.remove(),3600)}}
function resetGame(){run=0;S=0;T=30;st=[];pp=[];P={x:GW/2,y:GH/2};ov.style.display='grid';ot.textContent='Ready?';od.textContent=READY;$('play').textContent='Start';$('sc').textContent=0;$('tm').textContent=30;draw(0)}
$('play').onclick=()=>{P={x:GW/2,y:GH/2};S=0;T=30;st=[];pp=[];mk();mk();mk();run=1;ov.style.display='none';last=performance.now();requestAnimationFrame(loop)};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();K[k]=1;if(run&&k.startsWith('arrow'))e.preventDefault()});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);addEventListener('blur',()=>{for(const k in K)K[k]=0});
const pt=e=>{const r=cv.getBoundingClientRect();tg={x:(e.clientX-r.left)*GW/r.width,y:(e.clientY-r.top)*GH/r.height}};
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pt(e)};cv.onpointermove=e=>{if(tg)pt(e)};cv.onpointerup=cv.onpointercancel=()=>{tg=null};
resetGame();

/* replay */
$('replay').onclick=()=>{intro.classList.remove('go');intro.inert=false;document.body.classList.add('lock');
setTimeout(()=>{document.querySelectorAll('.in').forEach(e=>e.classList.remove('in'));env.classList.remove('open');letter.classList.remove('show');resetGame();scrollTo({top:0,behavior:'instant'})},1400)};