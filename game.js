'use strict';
// ===== RNG =====
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R=Math.random;const pick=a=>a[Math.floor(R()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
// ===== DATI =====
const SETTINGS=[
{id:'villa',nome:'Villa Malaspina',desc:'una villa sulle colline toscane, durante una cena di famiglia',luogo:'la villa',
 stanze:['la biblioteca','la serra','la cantina','il salone','la cucina','lo studio','la terrazza'],
 ruoli:['il nipote ereditiero','la governante','il medico di famiglia','la seconda moglie','il notaio','il giardiniere','la sorella minore'],
 vittime:['il conte Arnaldo Malaspina','la contessa Ilaria Malaspina']},
{id:'yacht',nome:'Yacht "Stella Nera"',desc:'uno yacht ormeggiato al porto di Portofino, durante una festa privata',luogo:'lo yacht',
 stanze:['il ponte di prua','la cabina armatoriale','la sala macchine','il salone di poppa','la cambusa','il ponte superiore','la plancia'],
 ruoli:['il capitano','lo chef di bordo','il socio in affari','la modella','il broker','la hostess','il fotografo'],
 vittime:["l'armatore Vittorio Sanna","l'imprenditrice Greta Fontana"]},
{id:'hotel',nome:'Grand Hotel Excelsior',desc:'un grande albergo sul lago di Como, in una notte di tempesta',luogo:"l'hotel",
 stanze:['la hall','il bar americano','la suite 101','la lavanderia','il salone delle feste','la cucina','il giardino d\'inverno'],
 ruoli:['il concierge','la cantante','il direttore','l\'ospite americano','la cameriera ai piani','il barman','il critico gastronomico'],
 vittime:['il magnate Edoardo Ricci','la diva Lucia Bellandi']},
{id:'treno',nome:'Espresso Milano–Palermo',desc:'un treno notte in viaggio lungo la costa tirrenica',luogo:'il treno',
 stanze:['la carrozza ristorante','il vagone letto 3','il vagone bagagli','lo scompartimento 7','il corridoio di coda','la cabina del capotreno','il vagone letto 5'],
 ruoli:['il capotreno','la contessa in viaggio','il commesso viaggiatore','il professore','la giornalista','il cuoco del vagone','lo studente'],
 vittime:['il banchiere Ottavio Ferri','la scrittrice Adele Manin']},
{id:'teatro',nome:'Teatro La Fenice dei Sogni',desc:'un teatro dopo la prima di un\'opera',luogo:'il teatro',
 stanze:['il palcoscenico','il camerino principale','la buca dell\'orchestra','il foyer','il loggione','la sartoria','il magazzino scenografie'],
 ruoli:['il tenore','la soprano','il direttore d\'orchestra','l\'impresario','la costumista','il tecnico delle luci','il critico'],
 vittime:['l\'impresario Rodolfo Gatti','la prima donna Elena Corsi']}];
const NOMI=['Marco Bellini','Giulia Rinaldi','Carlo Mancini','Sofia Conti','Luca Ferraro','Anna Galli','Paolo Greco','Chiara Lombardi','Davide Moretti','Elena Ricci','Franco De Luca','Bianca Marchetti','Stefano Barbieri','Valeria Costa','Giorgio Serra','Livia Testa','Alberto Fabbri','Nora Vitale'];
const ARMI=[
{id:'veleno',nome:'Veleno (arsenico)',autopsia:'Le labbra bluastre e l\'odore di aglio indicano avvelenamento da arsenico.',traccia:'una boccetta di arsenico quasi vuota'},
{id:'pugnale',nome:'Tagliacarte d\'argento',autopsia:'Una ferita da taglio sottile e profonda: una lama corta e affilata.',traccia:'un tagliacarte d\'argento ripulito in fretta'},
{id:'candelabro',nome:'Candelabro di bronzo',autopsia:'Un colpo violento alla nuca con un oggetto pesante e smussato. Tracce di cera nella ferita.',traccia:'un candelabro di bronzo con cera e una macchia scura'},
{id:'corda',nome:'Cordone di seta',autopsia:'Segni di strangolamento: un solco sottile e regolare sul collo, con fibre di seta.',traccia:'un cordone di seta strappato da una tenda'},
{id:'pistola',nome:'Pistola Beretta',autopsia:'Un unico foro di proiettile calibro 7,65, sparato da vicino.',traccia:'una Beretta con il caricatore incompleto'},
{id:'sonnifero',nome:'Overdose di sonnifero',autopsia:'Nessuna ferita: dosi letali di barbiturici nel sangue, sciolti in un bicchiere.',traccia:'un flacone di sonnifero svuotato'}];
const MOVENTI=[
{id:'eredita',nome:'Eredità',txt:'temeva di essere escluso dal testamento',prova:'una bozza del nuovo testamento in cui {k} viene diseredato/a'},
{id:'debiti',nome:'Debiti',txt:'doveva alla vittima una somma enorme',prova:'una cambiale da 200.000 euro firmata da {k}, scaduta da mesi'},
{id:'ricatto',nome:'Ricatto',txt:'era ricattato/a dalla vittima',prova:'un dossier compromettente su {k}, con le richieste di denaro della vittima'},
{id:'gelosia',nome:'Gelosia',txt:'era stato/a tradito/a',prova:'lettere d\'amore tra la vittima e la persona amata da {k}'},
{id:'vendetta',nome:'Vendetta',txt:'incolpava la vittima della rovina della propria famiglia',prova:'un vecchio articolo di giornale sul fallimento della famiglia di {k}, causato dalla vittima'},
{id:'carriera',nome:'Carriera',txt:'stava per essere licenziato/a e rovinato/a',prova:'una lettera di licenziamento per {k}, mai consegnata'}];
const SEGRETI=[
{s:'ha una relazione segreta e quella sera aveva un appuntamento',ind:'un biglietto anonimo: "Ti aspetto stanotte. Nessuno deve saperlo."',spieg:'Il biglietto era per un appuntamento amoroso, non per un delitto.'},
{s:'ruba piccoli oggetti di valore per pagare i debiti di gioco',ind:'un portagioie della vittima, aperto e mezzo vuoto',spieg:'Ha rubato i gioielli giorni prima: un furto, non un omicidio.'},
{s:'aveva litigato violentemente con la vittima nel pomeriggio',ind:'un bicchiere rotto e una sedia rovesciata nel corridoio',spieg:'Il litigio è avvenuto ore prima del delitto ed è stato visto da altri.'},
{s:'lavora in segreto per un concorrente della vittima',ind:'fotografie di documenti riservati della vittima',spieg:'Spionaggio industriale: le foto risalgono alla settimana scorsa.'},
{s:'ha usato un nome falso per nascondere un vecchio processo',ind:'un passaporto con la sua foto ma un nome diverso',spieg:'Fu assolto anni fa e voleva solo rifarsi una vita.'},
{s:'aveva comprato veleno per topi la mattina stessa',ind:'uno scontrino di una ferramenta per veleno per topi',spieg:'Il veleno è intatto nel ripostiglio: c\'erano davvero i topi.'}];
const ORE=['22:15','22:40','23:10','23:30','23:50','00:20'];
// ===== GENERATORE =====
function genera(seed){
 R=mulberry(seed);
 const S=pick(SETTINGS),n=4+Math.floor(R()*2);
 const nomi=shuffle(NOMI).slice(0,n),ruoli=shuffle(S.ruoli).slice(0,n),mot=shuffle(MOVENTI).slice(0,n),seg=shuffle(SEGRETI);
 const stanze=shuffle(S.stanze),scena=stanze[0],arma=pick(ARMI),ora=pick(ORE),vittima=pick(S.vittime);
 const sus=nomi.map((nm,i)=>({id:i,nome:nm,ruolo:ruoli[i],movente:mot[i]}));
 const k=Math.floor(R()*n),K=sus[k];
 const inn=sus.filter(s=>s!==K);
 // alibi: coppie di innocenti insieme, eventuale singolo confermato da un indizio
 let si=1;const clues=[];
 for(let i=0;i<inn.length;i+=2){const a=inn[i],b=inn[i+1],st=stanze[si++];
  if(b){a.alibi={dove:st,con:b.id};b.alibi={dove:st,con:a.id}}
  else{a.alibi={dove:st,con:null};clues.push({id:'conf'+a.id,tipo:'alibi',per:a.id,luogo:st,titolo:'Registro telefonico',testo:`Il centralino registra una telefonata di ${a.nome} da ${st} dalle ${ora} per venti minuti. Il suo alibi regge.`})}}
 const finto=stanze[si++];K.alibi={dove:finto,con:null};
 // indizi chiave
 clues.push({id:'autopsia',tipo:'arma',titolo:'Esame del corpo',luogo:scena,testo:`Il corpo di ${vittima} giace in ${scena}. Ora del decesso: circa le ${ora}. ${arma.autopsia}`});
 clues.push({id:'arma',tipo:'arma',titolo:'Arma del delitto',luogo:pick(stanze.slice(1)),testo:`Nascosto/a dietro un mobile trovi ${arma.traccia}.`});
 clues.push({id:'contr',tipo:'contraddizione',per:k,luogo:finto,titolo:'Porta chiusa',testo:`${cap(finto)} era chiuso/a a chiave dalle 22:00 fino al mattino: la chiave era nella cassaforte. Nessuno poteva trovarsi lì alle ${ora}.`});
 const oggetti=['un gemello d\'oro con le iniziali','un fazzoletto ricamato con le iniziali','un accendino inciso con le iniziali','un bottone strappato dalla giacca'];
 clues.push({id:'scena',tipo:'contraddizione',per:k,luogo:scena,titolo:'Oggetto sulla scena',testo:`Vicino al corpo trovi ${pick(oggetti)} ${iniz(K.nome)}. Appartiene a ${K.nome}.`});
 clues.push({id:'movente',tipo:'movente',per:k,luogo:pick(stanze),titolo:'Documento compromettente',testo:`Trovi ${K.movente.prova.replace('{k}',K.nome)}.`});
 inn.forEach((s,i)=>{s.segreto=seg[i];clues.push({id:'rh'+s.id,tipo:'falsa',per:s.id,luogo:pick(stanze),titolo:'Indizio sospetto',testo:`Trovi ${seg[i].ind} Sembra collegato/a a ${s.nome}.`})});
 const C={seed,set:S.id,nomeSet:S.nome,desc:S.desc,vittima,scena,ora,arma:arma.id,killer:k,sospetti:sus,indizi:shuffle(clues)};
 C.indizi.forEach((c,i)=>{c.costo=c.tipo==='arma'&&c.id==='autopsia'?3:5});
 return C;}
const FIX=[[/\bin il /g,'nel '],[/\bin lo /g,'nello '],[/\bin la /g,'nella '],[/\bin l'/g,"nell'"],[/\bIn il /g,'Nel '],[/\bIn la /g,'Nella '],[/\bdi il /g,'del '],[/\bdi la /g,'della '],[/\.\./g,'.'],[/\bverso il /g,'verso il ']];
const fx=h=>FIX.reduce((t,[a,b])=>t.replace(a,b),h);
const cap=s=>s[0].toUpperCase()+s.slice(1);
const iniz=n=>n.split(' ').map(x=>x[0]+'.').join('');
function nomeDi(C,id){return C.sospetti[id].nome}
function risposte(C,s){const K=s.id===C.killer,a=s.alibi;
 const conA=a.con!=null?` insieme a ${nomeDi(C,a.con)}`:' da solo/a';
 return{
 alibi:`"Alle ${C.ora} ero in ${a.dove}${conA}. ${a.con!=null?'Può confermarlo.':'Non mi ha visto nessuno, ma è la verità.'}"`,
 vittima:K?`"Rapporti cordiali, tutto qui. Non avevo alcun motivo di fargli del male."`:`"Non andavamo d'accordo, lo ammetto: ${s.movente.txt.replace(/^/,'qualcuno direbbe che ')}. Ma non l'ho ucciso."`,
 altri:(()=>{const o=C.sospetti.filter(x=>x.id!==s.id&&x.alibi.con===s.id);return o.length?`"Ho passato la serata con ${o[0].nome}, non ci siamo mai separati."`:`"Ho visto passare qualcuno verso ${C.scena}, ma era buio. Non so dire chi."`})(),
 segreto:K?`"Segreti? Non ho niente da nascondere."`:`(Dopo una lunga pausa) "Va bene... ${s.segreto.s}. ${s.segreto.spieg}"`};}
// ===== VALIDAZIONE =====
function valida(C){const n=C.sospetti.length,K=C.sospetti[C.killer];
 // ogni innocente ha un alibi confermato (compagno reciproco o indizio)
 for(const s of C.sospetti){if(s===K)continue;const a=s.alibi;
  const ok=(a.con!=null&&C.sospetti[a.con].alibi.con===s.id&&C.sospetti[a.con].alibi.dove===a.dove&&a.con!==C.killer)||C.indizi.some(c=>c.id==='conf'+s.id);
  if(!ok)return 'alibi '+s.nome;if(a.dove===C.scena)return 'scena';}
 // il killer: alibi contraddetto solo per lui
 const cs=C.indizi.filter(c=>c.tipo==='contraddizione');if(!cs.length||cs.some(c=>c.per!==C.killer))return 'contr';
 if(!C.indizi.some(c=>c.tipo==='contraddizione'&&c.luogo===K.alibi.dove))return 'luogo';
 if(C.sospetti.some(s=>s!==K&&s.alibi.dove===K.alibi.dove))return 'stanza dup';
 // movente e arma unici
 if(new Set(C.sospetti.map(s=>s.movente.id)).size!==n)return 'moventi';
 if(!C.indizi.some(c=>c.tipo==='movente'&&c.per===C.killer))return 'movente';
 if(!C.indizi.some(c=>c.id==='autopsia'))return 'arma';
 // percorso minimo nel tempo
 const min=C.indizi.filter(c=>['autopsia','contr','movente'].includes(c.id)).reduce((t,c)=>t+c.costo,0)+4;
 if(min>60)return 'tempo';return null;}
function nuovoCaso(seed){for(let i=0;i<50;i++){const C=genera(seed+i*7919);if(!valida(C))return C}throw Error('nessun caso valido')}
// ===== STATO / UI =====
const TEMPI={domanda:4};const TOPICS=[['alibi','Dov\'era alle '],['vittima','Rapporto con la vittima'],['altri','Cosa sa degli altri'],['segreto','Ha qualcosa da nascondere?']];
let G=null;const $=s=>document.querySelector(s);
function salva(){localStorage.setItem('ultimaora',JSON.stringify(G))}
function carica(){try{const g=JSON.parse(localStorage.getItem('ultimaora'));if(g&&g.caso&&!g.finito)return g}catch(e){}return null}
function inizia(seed){const C=nuovoCaso(seed);G={caso:C,tempo:60,trovati:[],chiesti:[],note:[],finito:false,tab:'scena'};salva();render()}
function spendi(m){G.tempo=Math.max(0,G.tempo-m)}
function esamina(id){const c=G.caso.indizi.find(x=>x.id===id);if(G.trovati.includes(id)||G.tempo<=0)return;spendi(c.costo);G.trovati.push(id);G.note.push({t:'indizio',titolo:c.titolo,testo:c.testo});dopo(`<b>${c.titolo}</b><p>${c.testo}</p>`)}
function chiedi(sid,top){const key=sid+':'+top;if(G.chiesti.includes(key)||G.tempo<=0)return;const s=G.caso.sospetti[sid];spendi(TEMPI.domanda);G.chiesti.push(key);const r=risposte(G.caso,s)[top];G.note.push({t:'dich',titolo:s.nome+' — '+TOPICS.find(x=>x[0]===top)[1].replace("alle ","alle "+G.caso.ora).trim(),testo:r});dopo(`<b>${s.nome}</b><p>${r}</p>`)}
function dopo(html){salva();render();modal(html+(G.tempo<=0?'<p class="red">Il tempo è scaduto! Devi formulare l\'accusa.</p>':''),G.tempo<=0?()=>{G.tab='accusa';render()}:null)}
function modal(html,cb){const m=$('#modal');m.innerHTML=fx(`<div class="card">${html}<button class="btn" id="mok">Continua</button></div>`);m.hidden=false;$('#mok').onclick=()=>{m.hidden=true;cb&&cb()}}
function render(){const app=$('#app');
 if(!G){app.innerHTML=fx(home());bindHome();return}
 const C=G.caso;if(G.finito){app.innerHTML=fx(fine());$('#again').onclick=()=>{G=null;localStorage.removeItem('ultimaora');render()};return}
 if(G.tempo<=0&&G.tab!=='accusa')G.tab='accusa';
 const tabs=[['scena','Indagine'],['sospetti','Sospettati'],['taccuino','Taccuino'],['accusa','Accusa']];
 app.innerHTML=fx(`<header><div><div class="small">${C.nomeSet}</div><div class="title2">Caso n.${C.seed%10000}</div></div><div class="clock ${G.tempo<=15?'red':''}">⏱ ${G.tempo}′</div></header>
 <nav>${tabs.map(t=>`<button class="tab ${G.tab===t[0]?'on':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}</nav><main>${({scena,sospetti,taccuino,accusa})[G.tab]()}</main>`);
 app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{G.tab=b.dataset.tab;salva();render()});
 app.querySelectorAll('[data-clue]').forEach(b=>b.onclick=()=>esamina(b.dataset.clue));
 app.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const[a,t]=b.dataset.q.split(':');chiedi(+a,t)});
 const f=$('#accform');if(f)f.onsubmit=e=>{e.preventDefault();accusa(+f.chi.value,f.mov.value,f.arma.value)};}
function home(){const g=carica();return `<div class="home"><div class="logo">ULTIMA<br><span>ORA</span></div><p class="tag">Un delitto. Cinque sospetti.<br>Sessanta minuti per scoprire la verità.</p>
 ${g?`<button class="btn" id="cont">Riprendi il caso</button>`:''}<button class="btn gold" id="new">Nuovo caso</button>
 <details class="how"><summary>Come si gioca</summary><p>Hai <b>60 minuti</b>. Esaminare un indizio costa 3–5 minuti, ogni domanda a un sospettato costa 4 minuti. Tutto finisce nel <b>taccuino</b>.</p><p>Gli innocenti hanno segreti che li fanno sembrare colpevoli. L'assassino mente sul suo alibi: trova l'indizio che lo contraddice.</p><p>Quando sei pronto (o il tempo scade) accusa il colpevole indicando movente e arma.</p></details></div>`}
function bindHome(){$('#new').onclick=()=>inizia((Math.random()*1e9)|0);const c=$('#cont');if(c)c.onclick=()=>{G=carica();render()}}
function scena(){const C=G.caso;return `<div class="intro"><p>Le ${C.ora}. In ${C.desc}, ${C.vittima} viene trovato/a senza vita in <b>${C.scena}</b>. Le porte sono state chiuse: l'assassino è ancora qui.</p></div>
 <h3>Luoghi da esaminare</h3>${C.indizi.map((c,i)=>{const f=G.trovati.includes(c.id);return `<button class="item ${f?'done':''}" data-clue="${c.id}" ${f?'disabled':''}><span>${f?c.titolo:'Esamina '+c.luogo+(c.id==='autopsia'?' (il corpo)':'')}</span><span class="cost">${f?'✓':c.costo+'′'}</span></button>`}).join('')}`}
function sospetti(){const C=G.caso;return C.sospetti.map(s=>`<div class="sus"><div class="avatar">${iniz(s.nome)}</div><div class="sname">${s.nome}<div class="small">${cap(s.ruolo)}</div></div>
 <div class="qs">${TOPICS.map(([t,l])=>{const d=G.chiesti.includes(s.id+':'+t);return `<button class="q ${d?'done':''}" data-q="${s.id}:${t}" ${d?'disabled':''}>${t==='alibi'?l+C.ora+'?':l} ${d?'✓':'<i>4′</i>'}</button>`}).join('')}</div></div>`).join('')}
function taccuino(){return G.note.length?G.note.slice().reverse().map(n=>`<div class="note ${n.t}"><div class="ntit">${n.t==='indizio'?'🔍':'🗣'} ${n.titolo}</div><div>${n.testo}</div></div>`).join(''):'<p class="small center">Il taccuino è vuoto. Esamina la scena e interroga i sospettati.</p>'}
function accusa(){if(arguments.length)return faiAccusa(...arguments);const C=G.caso;return `<form id="accform" class="acc"><p>${G.tempo<=0?'<b class="red">Tempo scaduto.</b> ':''}Chi ha ucciso ${C.vittima}?</p>
 <label>Colpevole</label><select name="chi">${C.sospetti.map(s=>`<option value="${s.id}">${s.nome} (${s.ruolo})</option>`).join('')}</select>
 <label>Movente</label><select name="mov">${MOVENTI.map(m=>`<option value="${m.id}">${m.nome}</option>`).join('')}</select>
 <label>Arma</label><select name="arma">${ARMI.map(a=>`<option value="${a.id}">${a.nome}</option>`).join('')}</select>
 <button class="btn red" type="submit">Accuso!</button></form>`}
function faiAccusa(chi,mov,arma){const C=G.caso,K=C.sospetti[C.killer];
 const ok={chi:chi===C.killer,mov:mov===K.movente.id,arma:arma===C.arma};
 let p=(ok.chi?60:0)+(ok.mov?20:0)+(ok.arma?20:0);if(ok.chi)p+=G.tempo;
 G.finito=true;G.esito={ok,punti:p,chi,mov,arma};salva();
 const st=JSON.parse(localStorage.getItem('uo_stats')||'{"giocati":0,"risolti":0,"best":0}');st.giocati++;if(ok.chi)st.risolti++;st.best=Math.max(st.best,p);localStorage.setItem('uo_stats',JSON.stringify(st));render()}
function fine(){const C=G.caso,K=C.sospetti[C.killer],e=G.esito,A=ARMI.find(a=>a.id===C.arma),st=JSON.parse(localStorage.getItem('uo_stats')||'{}');
 const v=e.ok.chi&&e.ok.mov&&e.ok.arma?'CASO RISOLTO':e.ok.chi?'COLPEVOLE TROVATO':"L'ASSASSINO È LIBERO";
 return `<div class="end"><div class="logo small2 ${e.ok.chi?'':'red'}">${v}</div><div class="score">${e.punti}<span> punti</span></div>
 <ul class="res"><li>${e.ok.chi?'✅':'❌'} Colpevole</li><li>${e.ok.mov?'✅':'❌'} Movente</li><li>${e.ok.arma?'✅':'❌'} Arma</li>${e.ok.chi?`<li>⏱ Bonus tempo: +${G.tempo}</li>`:''}</ul>
 <h3>La soluzione</h3><p>Alle ${C.ora} <b>${K.nome}</b>, ${K.ruolo}, ha ucciso ${C.vittima} in ${C.scena} con: <b>${A.nome}</b>. Movente: <b>${K.movente.nome}</b> — ${K.movente.txt}.</p>
 <p>Il suo alibi ("ero in ${K.alibi.dove}") era falso: quel luogo era chiuso a chiave dalle 22:00, e sulla scena è rimasto un suo oggetto con le iniziali ${iniz(K.nome)}.</p>
 <h3>Gli innocenti</h3>${C.sospetti.filter(s=>s!==K).map(s=>`<p><b>${s.nome}</b>: era in ${s.alibi.dove}${s.alibi.con!=null?' con '+nomeDi(C,s.alibi.con):' al telefono'}. Segreto: ${s.segreto.s}. ${s.segreto.spieg}</p>`).join('')}
 <p class="small center">Partite: ${st.giocati} · Risolte: ${st.risolti} · Record: ${st.best}</p><button class="btn gold" id="again">Nuovo caso</button></div>`}
window.UO={genera,valida,nuovoCaso,risposte,inizia,get G(){return G}};
window.addEventListener('load',()=>{render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})});
