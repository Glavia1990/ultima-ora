'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RHI=['letter','box','glass','photo','passport','receipt'];
const TOP=[['alibi','Dov\'era all\'ora del delitto?'],['vittima','Che rapporto aveva con la vittima?'],['altri','Cosa sa degli altri?'],['segreto','Nasconde qualcosa?']];
let G=null;
// ===== AUDIO =====
const AU={ctx:null,on:true,nodes:[],
 init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.on?.8:0;this.master.connect(this.ctx.destination)}catch(e){}},
 noise(sec=2){const c=this.ctx,b=c.createBuffer(1,c.sampleRate*sec,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}return b},
 ambient(kind){if(!this.ctx)return;this.nodes.forEach(n=>{try{n.stop()}catch(e){}});this.nodes=[];const c=this.ctx;
  const src=c.createBufferSource();src.buffer=this.noise(4);src.loop=true;const f=c.createBiquadFilter();f.type=kind==='sea'?'lowpass':'bandpass';f.frequency.value=kind==='sea'?500:1400;const g=c.createGain();g.gain.value=kind==='dust'?.04:.18;
  if(kind==='sea'){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=.12;lg.gain.value=.12;l.connect(lg).connect(g.gain);l.start();this.nodes.push(l)}
  src.connect(f).connect(g).connect(this.master);src.start();this.nodes.push(src);
  [55,82.4,110.3].forEach((fr,i)=>{const o=c.createOscillator(),og=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=fr;o.detune.value=i*7;lp.type='lowpass';lp.frequency.value=260;og.gain.value=.025;o.connect(lp).connect(og).connect(this.master);o.start();this.nodes.push(o)})},
 tone(fr,t0,d,type='triangle',v=.15){const c=this.ctx;if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=fr;g.gain.setValueAtTime(0,c.currentTime+t0);g.gain.linearRampToValueAtTime(v,c.currentTime+t0+.02);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t0+d);o.connect(g).connect(this.master);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+.05)},
 sting(){[220,261.6,311.1,370].forEach((f,i)=>this.tone(f,i*.06,1.6,'sawtooth',.06));this.tone(110,0,2,'sine',.2)},
 found(){[523,659,784].forEach((f,i)=>this.tone(f,i*.08,.6,'triangle',.08))},
 bad(){this.tone(130,0,.5,'square',.06);this.tone(123,.12,.5,'square',.06)},
 steps(){const c=this.ctx;if(!c)return;for(let i=0;i<4;i++){const s=c.createBufferSource();s.buffer=this.noise(.12);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=380;const g=c.createGain();g.gain.value=.9;s.connect(f).connect(g).connect(this.master);s.start(c.currentTime+i*.32)}},
 tick(){this.tone(1800+Math.random()*300,0,.03,'square',.015)},
 drum(){const c=this.ctx;if(!c)return;for(let i=0;i<14;i++)this.tone(70+i*3,i*.11,.15,'sine',.25)},
 toggle(){this.on=!this.on;if(this.master)this.master.gain.value=this.on?.8:0}};
const buzz=(p=[20])=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function shake(){const a=$('#app');a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake')}
// ===== STATO =====
function salva(){try{localStorage.setItem('uo2',JSON.stringify(G))}catch(e){}}
function carica(){try{const g=JSON.parse(localStorage.getItem('uo2'));if(g&&g.caso&&!g.finito)return g}catch(e){}return null}
function iconOf(c){const C=G.caso;if(c.id==='autopsia')return'body';if(c.id==='arma')return C.arma;if(c.id==='contr')return'key';if(c.id==='scena')return'item';if(c.id==='movente')return'paper';if(c.id.startsWith('conf'))return'phone';
 const s=C.sospetti[c.per];return RHI[SEGRETI.findIndex(x=>x.s===s.segreto.s)]||'letter'}
function disponi(C){// assegna indizi a punti caldi e sospetti alle scene
 const R2=mulberry(C.seed+99),keys=SCENE_OF[C.set],map={},slots=[];
 keys.forEach((k,si)=>SCENES[k].hs.forEach((h,hi)=>slots.push([si,hi])));
 const sl=slots.sort(()=>R2()-.5);
 C.indizi.forEach(c=>{if(c.id==='autopsia')map[c.id]=[0,'body'];else{const i=sl.findIndex(x=>x);map[c.id]=sl.splice(i,1)[0]}});
 C.pos=map;C.dove=C.sospetti.map((s,i)=>[i%2,[300,800,1300][Math.floor(i/2)%3]+((i*53)%80)]);C.keys=keys}
function inizia(seed){const C=nuovoCaso(seed);disponi(C);G={caso:C,tempo:60,trovati:[],vuoti:[],chiesti:[],confr:[],note:[],links:[],finito:false,scena:0};salva();intro()}
function spendi(m){G.tempo=Math.max(0,G.tempo-m);drawClock(true);salva();if(G.tempo<=0)setTimeout(()=>{toast('⏰ Il tempo è scaduto!');setTimeout(apriAccusa,900)},400)}
// ===== RENDER SCENA =====
function mostra(){$('#title').hidden=true;$('#hud').hidden=false;$('#inv').hidden=false;renderScene();drawClock();renderInv();AU.ambient(SCENES[G.caso.keys[G.scena]].fx[0])}
function renderScene(){const C=G.caso,key=C.keys[G.scena],S=SCENES[key];
 const w=$('#world');w.innerHTML=sceneSVG(key);
 $('#roomname').textContent=cap(C.scene[G.scena]);
 // corpo
 if(G.scena===0){const [bx,by]=S.body;w.insertAdjacentHTML('beforeend',`<div class="bodyspr" style="left:${bx/16}%;top:${by/10}%"><svg viewBox="0 0 300 120"><ellipse cx="150" cy="80" rx="150" ry="36" fill="#000" opacity=".5"/><ellipse cx="190" cy="92" rx="70" ry="16" fill="#6a0a10" opacity=".85"/><path d="M30 70 q10 -20 40 -18 h120 q40 0 60 16 l40 4 v14 l-40 2 q-20 14 -60 12 h-120 q-30 0 -40 -30z" fill="#1a1a22"/><circle cx="34" cy="66" r="22" fill="#c9a888"/><path d="M14 58 q20 -24 44 -4" fill="#3a2414"/></svg></div>`)}
 // punti caldi
 C.indizi.forEach(c=>{const p=C.pos[c.id];if(p[0]!==G.scena)return;const h=p[1]==='body'?{x:S.body[0],y:S.body[1]-30,nome:'Il corpo'}:S.hs[p[1]];addHot(h,c.id,G.trovati.includes(c.id))});
 S.hs.forEach((h,hi)=>{if(Object.values(C.pos).some(p=>p[0]===G.scena&&p[1]===hi))return;addHot(h,'v'+G.scena+'_'+hi,G.vuoti.includes('v'+G.scena+'_'+hi))});
 // sospetti
 C.sospetti.forEach((s,i)=>{const [sc,x]=C.dove[i];if(sc!==G.scena)return;w.insertAdjacentHTML('beforeend',`<button class="fig" data-s="${i}" style="left:${x/16}%">${figure(s)}<span class="tag">${s.nome.split(' ')[0]}</span></button>`)});
 // porte
 const o=1-G.scena;$('#nav').innerHTML=`<button class="door" id="go">🚪 ${cap(C.scene[o])} ›</button>`;$('#go').onclick=()=>vai(o);
 $$('.hot').forEach(b=>b.onclick=e=>{e.stopPropagation();esamina(b.dataset.c,b)});
 $$('.fig').forEach(b=>b.onclick=()=>dialogo(+b.dataset.s));
 const sc=$('#scene');sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2;parallax();fx(S.fx)}
function addHot(h,id,done){$('#world').insertAdjacentHTML('beforeend',`<button class="hot ${done?'done':''}" data-c="${id}" style="left:${h.x/16}%;top:${h.y/10}%" aria-label="${h.nome}"><i></i><span>${h.nome}</span></button>`)}
function parallax(){const sc=$('#scene'),x=sc.scrollLeft;$$('#world .par').forEach(g=>g.style.transform=`translateX(${x*+g.dataset.d*1.6}px)`)}
function vai(i){AU.steps();const v=$('#veil');v.classList.add('on');setTimeout(()=>{G.scena=i;salva();renderScene();AU.ambient(SCENES[G.caso.keys[i]].fx[0]);v.classList.remove('on')},650)}
// ===== EFFETTI (canvas) =====
let FX=[],raf;
function fx(list){const cv=$('#fx'),ctx=cv.getContext('2d');cancelAnimationFrame(raf);const dpr=Math.min(2,devicePixelRatio||1);cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;
 const P=[];const n=list.includes('rain')?110:list.includes('dust')?60:list.includes('sea')?20:0;
 for(let i=0;i<n;i++)P.push({x:Math.random()*cv.width,y:Math.random()*cv.height,v:.5+Math.random()});
 $('#scene').classList.toggle('rocking',list.includes('shake'));$('#scene').classList.toggle('bobbing',list.includes('sea')&&!list.includes('shake'));
 let t=0;(function loop(){t++;ctx.clearRect(0,0,cv.width,cv.height);
  if(list.includes('rain')){ctx.strokeStyle='rgba(170,195,255,.35)';ctx.lineWidth=1.2*dpr;ctx.beginPath();P.forEach(p=>{p.y+=14*p.v*dpr;p.x-=2*dpr;if(p.y>cv.height){p.y=-20;p.x=Math.random()*cv.width*1.1}ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-3*dpr,p.y+14*dpr*p.v)});ctx.stroke()}
  if(list.includes('dust')||list.includes('sea')){P.forEach(p=>{p.y-=.25*p.v;p.x+=Math.sin((t+p.v*100)/60)*.3;if(p.y<0)p.y=cv.height;ctx.fillStyle=`rgba(255,230,170,${.25*p.v})`;ctx.beginPath();ctx.arc(p.x,p.y,1.4*dpr*p.v,0,7);ctx.fill()})}
  if(list.includes('lightning')&&Math.random()<.004){$('#flash').classList.remove('go');void $('#flash').offsetWidth;$('#flash').classList.add('go');setTimeout(()=>AU.tone(40,0,1.5,'sine',.3),300)}
  raf=requestAnimationFrame(loop)})()}
// ===== OROLOGIO =====
function drawClock(anim){const m=G.tempo,a=(60-m)*6,low=m<=15;$('#clock').innerHTML=`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#120f0a" stroke="${low?'#e0484e':'#c9a24b'}" stroke-width="5"/>
 <path d="M50 50 L50 8 A42 42 0 ${a>180?1:0} 1 ${50+42*Math.sin(a*Math.PI/180)} ${50-42*Math.cos(a*Math.PI/180)}Z" fill="${low?'#e0484e':'#c9a24b'}" opacity=".25"/>
 ${[...Array(12)].map((_,i)=>`<line x1="50" y1="9" x2="50" y2="15" stroke="#c9a24b" stroke-width="3" transform="rotate(${i*30} 50 50)"/>`).join('')}
 <line class="hand" x1="50" y1="50" x2="50" y2="14" stroke="#efe8d8" stroke-width="4" stroke-linecap="round" style="transform:rotate(${a}deg)"/><circle cx="50" cy="50" r="5" fill="#a8262b"/></svg><b class="${low?'red':''}">${m}′</b>`;
 if(anim){$('#clock').classList.remove('pulse');void $('#clock').offsetWidth;$('#clock').classList.add('pulse')}}
// ===== ESAMINA / PRIMO PIANO =====
function zoomTo(btn,cb){const w=$('#world'),sc=$('#scene');const r=btn.getBoundingClientRect(),sr=sc.getBoundingClientRect();
 w.style.transformOrigin=`${btn.offsetLeft}px ${btn.offsetTop}px`;w.classList.add('zoom');setTimeout(()=>{cb();setTimeout(()=>w.classList.remove('zoom'),300)},550)}
function esamina(id,btn){if(G.tempo<=0)return apriAccusa();AU.init();
 if(id.startsWith('v')){if(G.vuoti.includes(id))return closeup('Niente di nuovo','none','Hai già controllato qui.',0);G.vuoti.push(id);spendi(1);return zoomTo(btn,()=>closeup(btn.querySelector('span').textContent,'none','Frughi con attenzione… niente di interessante. (1 minuto)',0))}
 const c=G.caso.indizi.find(x=>x.id===id);const nuovo=!G.trovati.includes(id);
 if(nuovo){G.trovati.push(id);G.note.push({t:'indizio',titolo:c.titolo,testo:c.testo});spendi(c.costo);btn.classList.add('done')}
 zoomTo(btn,()=>{closeup(c.titolo,iconOf(c),c.testo,nuovo);renderInv()})}
function closeup(tit,ic,txt,nuovo){if(nuovo){AU.found();buzz([15,40,15])}
 const o=$('#closeup');o.innerHTML=`<div class="cu-card"><div class="cu-art">${icon(ic)}<div class="lens"></div></div><h2>${tit}</h2><p class="tw"></p>${nuovo?'<div class="newclue">+ Nuovo indizio nel taccuino</div>':''}<button class="btn" id="cuok">Continua</button></div>`;o.hidden=false;
 type(o.querySelector('.tw'),txt);$('#cuok').onclick=()=>{o.hidden=true}}
let typing;function type(el,txt,cb){clearInterval(typing);let i=0;el.textContent='';typing=setInterval(()=>{i+=2;el.textContent=txt.slice(0,i);if(i%6===0)AU.tick();if(i>=txt.length){clearInterval(typing);el.textContent=txt;cb&&cb()}},18);el.onclick=()=>{i=txt.length}}
function toast(t,cls=''){const d=document.createElement('div');d.className='toast '+cls;d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
// ===== INVENTARIO =====
function renderInv(){const C=G.caso;$('#invlist').innerHTML=G.trovati.map(id=>{const c=C.indizi.find(x=>x.id===id);return `<button class="inv-i" data-c="${id}">${icon(iconOf(c))}</button>`}).join('')||'<span class="small">Nessun indizio. Tocca gli oggetti che brillano.</span>';
 $$('.inv-i').forEach(b=>b.onclick=()=>{const c=C.indizi.find(x=>x.id===b.dataset.c);closeup(c.titolo,iconOf(c),c.testo,0)})}
// ===== DIALOGO =====
function dialogo(sid,expr='neutro',txt=null){AU.init();const C=G.caso,s=C.sospetti[sid],o=$('#dialog');
 const prime=!txt;if(prime)txt=`${cap(s.ruolo)}. "${['Mi dica pure, detective.','Faccia presto, sono sconvolto/a.','Ancora domande?','Sono a sua disposizione.'][sid%4]}"`.replace('sconvolto/a',s.f?'sconvolta':'sconvolto');
 const ch=TOP.map(([t,l])=>{const d=G.chiesti.includes(sid+':'+t);return `<button class="choice ${d?'done':''}" data-t="${t}">${l} <i>${d?'✓':'4′'}</i></button>`});
 C.indizi.filter(c=>G.trovati.includes(c.id)&&c.per===sid&&c.tipo!=='movente'&&!c.id.startsWith('conf')).forEach(c=>{const d=G.confr.includes(sid+':'+c.id);ch.push(`<button class="choice conf ${d?'done':''}" data-k="${c.id}">⚡ Mostra: ${c.titolo} <i>${d?'✓':'2′'}</i></button>`)});
 ch.push(`<button class="choice bye" data-x="1">Arrivederci</button>`);
 o.innerHTML=`<div class="dl-por ${expr}">${portrait(s,expr)}</div><div class="dl-box"><div class="dl-name">${s.nome}</div><p class="dl-txt"></p><div class="choices" hidden>${ch.join('')}</div></div>`;o.hidden=false;
 type(o.querySelector('.dl-txt'),txt,()=>o.querySelector('.choices').hidden=false);
 o.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{if(b.dataset.x){o.hidden=true;return}if(G.tempo<=0){o.hidden=true;return apriAccusa()}
  if(b.dataset.t)return chiedi(sid,b.dataset.t);if(b.dataset.k)return confronta(sid,b.dataset.k)})}
function chiedi(sid,top){const C=G.caso,s=C.sospetti[sid],K=sid===C.killer,key=sid+':'+top;let r=risposte(C,s)[top];
 if(!G.chiesti.includes(key)){G.chiesti.push(key);G.note.push({t:'dich',sid,titolo:`${s.nome} — ${TOP.find(x=>x[0]===top)[1]}`,testo:r});spendi(4)}
 const ex={alibi:K?'sorride':'neutro',vittima:K?'sorride':'triste',altri:'neutro',segreto:K?'arrabbiato':'nervoso'}[top];dialogo(sid,ex,fx2(r))}
function confronta(sid,cid){const C=G.caso,s=C.sospetti[sid],c=C.indizi.find(x=>x.id===cid),key=sid+':'+cid,K=sid===C.killer;let r,ex;
 if(K){r=cid==='contr'?`(Impallidisce) "Chiuso a chiave? Io… forse mi sono confuso sul posto. Ero… nei paraggi. Ma questo non prova niente!"`:`"Quello? Lo avrò perso giorni fa… sì, giorni fa." (Gli trema la voce.)`;ex='sorpreso'}
 else{r=`(Abbassa lo sguardo) "D'accordo, glielo dico: ${s.segreto.s}. ${s.segreto.spieg}"`;ex='nervoso'}
 if(!G.confr.includes(key)){G.confr.push(key);G.note.push({t:'dich',sid,titolo:`${s.nome} — messo/a di fronte a: ${c.titolo}`,testo:r});spendi(2)}
 if(K){AU.sting();shake();buzz([60,30,60])}dialogo(sid,ex,fx2(r))}
// ===== LAVAGNA =====
function apriBoard(){AU.init();const C=G.caso,o=$('#board');
 o.innerHTML=`<div class="bd-head"><h2>La lavagna</h2><button class="x" id="bdx">✕</button></div><p class="small">Trascina un indizio su un sospettato per collegarli con il filo rosso.</p>
 <div class="cork"><svg id="strings"></svg><div class="bd-sus">${C.sospetti.map(s=>`<div class="pol" data-s="${s.id}">${portrait(s,'neutro')}<b>${s.nome}</b><small>${s.ruolo}</small></div>`).join('')}</div>
 <div class="bd-clues">${G.trovati.map(id=>{const c=C.indizi.find(x=>x.id===id);return `<div class="card" data-c="${id}"><i class="pin"></i>${icon(iconOf(c))}<b>${c.titolo}</b></div>`}).join('')||'<p class="small">Nessun indizio ancora.</p>'}</div></div>
 <h3>Taccuino</h3><div class="notes">${G.note.slice().reverse().map(n=>`<div class="note ${n.t}"><b>${n.t==='indizio'?'🔍':'🗣'} ${n.titolo}</b><div>${fx2(n.testo)}</div></div>`).join('')||'<p class="small">Vuoto.</p>'}</div>`;o.hidden=false;
 $('#bdx').onclick=()=>o.hidden=true;drawStrings();
 $$('#board .card').forEach(cd=>{cd.addEventListener('pointerdown',e=>{e.preventDefault();const svg=$('#strings'),r=svg.getBoundingClientRect(),cr=cd.getBoundingClientRect(),x0=cr.left+cr.width/2-r.left,y0=cr.top+12-r.top;
  const ln=document.createElementNS('http://www.w3.org/2000/svg','line');ln.setAttribute('class','str live');ln.setAttribute('x1',x0);ln.setAttribute('y1',y0);ln.setAttribute('x2',x0);ln.setAttribute('y2',y0);svg.appendChild(ln);
  const mv=ev=>{ln.setAttribute('x2',ev.clientX-r.left);ln.setAttribute('y2',ev.clientY-r.top);$$('.pol').forEach(p=>{const b=p.getBoundingClientRect();p.classList.toggle('hover',ev.clientX>b.left&&ev.clientX<b.right&&ev.clientY>b.top&&ev.clientY<b.bottom)})};
  const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);ln.remove();const p=$$('.pol').find(p=>p.classList.contains('hover'));$$('.pol').forEach(p=>p.classList.remove('hover'));if(p)collega(cd.dataset.c,+p.dataset.s)};
  addEventListener('pointermove',mv);addEventListener('pointerup',up)})})}
function collega(cid,sid){const C=G.caso,c=C.indizi.find(x=>x.id===cid),s=C.sospetti[sid];
 if(!G.links.some(l=>l[0]===cid&&l[1]===sid))G.links.push([cid,sid]);salva();drawStrings();
 if(c.tipo==='contraddizione'&&c.per===sid){stamp('CONTRADDIZIONE!');AU.sting();shake();buzz([80,40,80]);G.note.push({t:'indizio',titolo:'⚡ Contraddizione',testo:`"${c.titolo}" smentisce ${s.nome}.`});salva()}
 else if(c.tipo==='movente'&&c.per===sid){stamp('MOVENTE!','gold');AU.found()}
 else if(c.tipo==='falsa'&&c.per===sid){const ok=G.chiesti.includes(sid+':segreto')||G.confr.includes(sid+':'+cid);toast(ok?`Spiegato: ${s.segreto.spieg}`:`Sospetto… chiedi a ${s.nome.split(' ')[0]} cosa nasconde.`);AU.found()}
 else if(c.id.startsWith('conf')&&c.per===sid){toast(`L'alibi di ${s.nome} regge.`);AU.found()}
 else{toast('Nessun legame evidente.');AU.bad()}}
function drawStrings(){const svg=$('#strings');if(!svg)return;const r=svg.getBoundingClientRect();svg.innerHTML='';
 G.links.forEach(([cid,sid])=>{const a=$(`#board .card[data-c="${cid}"]`),b=$(`#board .pol[data-s="${sid}"]`);if(!a||!b)return;const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
  const x1=A.left+A.width/2-r.left,y1=A.top+12-r.top,x2=B.left+B.width/2-r.left,y2=B.bottom-8-r.top;svg.insertAdjacentHTML('beforeend',`<path class="str" d="M${x1} ${y1} Q${(x1+x2)/2} ${Math.max(y1,y2)+30} ${x2} ${y2}"/>`)})}
function stamp(t,cls=''){const d=document.createElement('div');d.className='stamp '+cls;d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
// ===== ACCUSA =====
let ACC={};
function apriAccusa(){AU.init();if(G.finito)return;const C=G.caso,o=$('#accuse');ACC={};AU.drum();
 o.innerHTML=`<h2 class="acc-t">L'ACCUSA</h2><p class="small center">${G.tempo<=0?'Il tempo è scaduto. ':''}Tutti i sospettati sono riuniti. Chi ha ucciso ${C.vittima}?</p>
 <div class="lineup">${C.sospetti.map(s=>`<button class="lu" data-s="${s.id}">${figure(s)}<b>${s.nome.split(' ')[0]}</b></button>`).join('')}</div>
 <h3>Movente</h3><div class="opts" id="om">${MOVENTI.map(m=>`<button class="opt" data-m="${m.id}">${m.nome}</button>`).join('')}</div>
 <h3>Arma</h3><div class="opts" id="oa">${ARMI.map(a=>`<button class="opt arm" data-a="${a.id}">${icon(a.id)}<span>${a.nome}</span></button>`).join('')}</div>
 <button class="btn red" id="doacc" disabled>Accuso!</button>${G.tempo>0?'<button class="btn ghost" id="accx">Non ancora</button>':''}`;o.hidden=false;
 const chk=()=>$('#doacc').disabled=!(ACC.chi!=null&&ACC.mov&&ACC.arma);
 $$('.lu').forEach(b=>b.onclick=()=>{$$('.lu').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ACC.chi=+b.dataset.s;AU.tone(196,0,.4,'sine',.2);chk()});
 $$('#om .opt').forEach(b=>b.onclick=()=>{$$('#om .opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ACC.mov=b.dataset.m;chk()});
 $$('#oa .opt').forEach(b=>b.onclick=()=>{$$('#oa .opt').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ACC.arma=b.dataset.a;chk()});
 $('#doacc').onclick=()=>faiAccusa(ACC.chi,ACC.mov,ACC.arma);if($('#accx'))$('#accx').onclick=()=>o.hidden=true}
function faiAccusa(chi,mov,arma){const C=G.caso,K=C.sospetti[C.killer];const ok={chi:chi===C.killer,mov:mov===K.movente.id,arma:arma===C.arma};
 let p=(ok.chi?60:0)+(ok.mov?20:0)+(ok.arma?20:0);if(ok.chi)p+=G.tempo;G.finito=true;G.esito={ok,punti:p,chi};salva();
 const st=JSON.parse(localStorage.getItem('uo_stats')||'{"giocati":0,"risolti":0,"best":0}');st.giocati++;if(ok.chi&&ok.mov&&ok.arma)st.risolti++;st.best=Math.max(st.best,p);localStorage.setItem('uo_stats',JSON.stringify(st));
 $('#accuse').hidden=true;reveal(st)}
function reveal(st){const C=G.caso,K=C.sospetti[C.killer],e=G.esito,A=ARMI.find(a=>a.id===C.arma),o=$('#reveal'),acc=C.sospetti[e.chi];AU.drum();
 o.innerHTML=`<div class="rv-1">Lei accusa…</div><div class="rv-por">${portrait(acc,e.ok.chi?'sorpreso':'arrabbiato')}<div class="rv-stamp ${e.ok.chi?'':'no'}">${e.ok.chi?'COLPEVOLE':'INNOCENTE'}</div></div>
 <div class="rv-body"><h2 class="${e.ok.chi&&e.ok.mov&&e.ok.arma?'gold':e.ok.chi?'':'red'}">${e.ok.chi&&e.ok.mov&&e.ok.arma?'CASO RISOLTO':e.ok.chi?'COLPEVOLE TROVATO':"L'ASSASSINO È LIBERO"}</h2>
 <div class="score">${e.punti}<span> punti</span></div><div class="res"><span>${e.ok.chi?'✅':'❌'} Colpevole</span><span>${e.ok.mov?'✅':'❌'} Movente</span><span>${e.ok.arma?'✅':'❌'} Arma</span></div>
 <h3>La verità</h3><div class="sol">${e.ok.chi?'':`<div class="mini">${portrait(K,'arrabbiato')}</div>`}<p>Alle ${C.ora} <b>${K.nome}</b>, ${K.ruolo}, ha ucciso ${C.vittima} in ${C.scena} con: <b>${A.nome}</b>.</p><p>Movente: <b>${K.movente.nome}</b> — ${K.movente.txt}.</p><p>Il suo alibi ("ero in ${K.alibi.dove}") era falso: quel luogo era chiuso a chiave dalle 22:00, e accanto al corpo è rimasto un suo oggetto con le iniziali ${iniz(K.nome)}.</p></div>
 <h3>Gli innocenti</h3>${C.sospetti.filter(s=>s!==K).map(s=>`<p><b>${s.nome}</b>: era in ${s.alibi.dove}${s.alibi.con!=null?' con '+C.sospetti[s.alibi.con].nome:' al telefono'}. Segreto: ${s.segreto.s}. ${s.segreto.spieg}</p>`).join('')}
 <p class="small center">Partite: ${st.giocati} · Risolte: ${st.risolti} · Record: ${st.best}</p><button class="btn gold" id="again">Nuovo caso</button></div>`;
 o.innerHTML=fx2(o.innerHTML);o.hidden=false;o.classList.remove('play');void o.offsetWidth;o.classList.add('play');
 setTimeout(()=>{e.ok.chi?(AU.sting(),buzz([100,50,200])):(AU.bad(),shake())},1800);
 $('#again').onclick=()=>{o.hidden=true;localStorage.removeItem('uo2');G=null;titolo()}}
// ===== TITOLO / INTRO =====
function titolo(){$('#hud').hidden=true;$('#inv').hidden=true;['#closeup','#dialog','#board','#accuse','#reveal'].forEach(s=>$(s).hidden=true);const t=$('#title'),g=carica();t.hidden=false;
 t.innerHTML=`<div class="t-bg">${sceneSVG('hall')}</div><div class="t-in"><div class="logo">ULTIMA<br><span>ORA</span></div><p class="tag">Un delitto. Cinque sospetti.<br>Sessanta minuti per scoprire la verità.</p>
 ${g?'<button class="btn" id="cont">Riprendi il caso</button>':''}<button class="btn gold" id="new">Nuovo caso</button>
 <details class="how"><summary>Come si gioca</summary><p>Esplora gli ambienti trascinando lo schermo. Tocca gli oggetti che <b>brillano</b> per esaminarli (3–5′) e i personaggi per interrogarli (4′ a domanda).</p><p>Mostra gli indizi ai sospettati, collegali sulla <b>lavagna</b> col filo rosso e scova la <b>contraddizione</b> nell'alibi del colpevole.</p><p>Quando sei pronto, o allo scadere dell'ora, formula l'accusa.</p></details></div>`;
 fx(['rain','lightning']);$('#new').onclick=()=>{AU.init();AU.sting();inizia((Math.random()*1e9)|0)};if($('#cont'))$('#cont').onclick=()=>{AU.init();G=carica();mostra()}}
function intro(){const C=G.caso,o=$('#closeup');o.innerHTML=`<div class="cu-card paper"><div class="np">IL CORRIERE DELLA NOTTE</div><h2>Delitto ${C.set==='yacht'?'a bordo dello yacht':'al '+C.nomeSet}</h2><p class="tw"></p><button class="btn red" id="cuok">Inizia l'indagine</button></div>`;o.hidden=false;
 type(o.querySelector('.tw'),fx2(`Le ${C.ora}. In ${C.desc}, ${C.vittima} viene ${C.vf?'trovata':'trovato'} senza vita in ${C.scena}. Le uscite sono state bloccate: l'assassino è ancora qui, tra ${C.sospetti.length} sospettati. Hai un'ora prima che arrivi il magistrato.`));
 $('#cuok').onclick=()=>{o.hidden=true;mostra()}}
const FIX2=[[/\bin il /g,'nel '],[/\bin lo /g,'nello '],[/\bin la /g,'nella '],[/\bin l'/g,"nell'"],[/\bIn il /g,'Nel '],[/\bIn la /g,'Nella '],[/\bIn lo /g,'Nello '],[/\bIn l'/g,"Nell'"],[/\bdi il /g,'del '],[/\bdi la /g,'della '],[/\bdi lo /g,'dello '],[/\bal Il /g,'al '],[/\.\./g,'.'],[/\bal il /g,'al '],[/\bdel il /g,'del ']];
const fx2=h=>FIX2.reduce((t,[a,b])=>t.replace(a,b),h);
// ===== AVVIO =====
window.addEventListener('load',()=>{$('#scene').addEventListener('scroll',parallax,{passive:true});$('#bboard').onclick=apriBoard;$('#bacc').onclick=apriAccusa;
 $('#bsnd').onclick=()=>{AU.init();AU.toggle();$('#bsnd').textContent=AU.on?'🔊':'🔇'};$('#bhome').onclick=()=>titolo();
 addEventListener('resize',()=>G&&!$('#hud').hidden&&fx(SCENES[G.caso.keys[G.scena]].fx));titolo();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})});
window.UO={genera,valida,nuovoCaso,inizia,faiAccusa,chiedi,confronta,collega,get G(){return G}};
