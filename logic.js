'use strict';
// ===== RNG =====
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R=Math.random;const pick=a=>a[Math.floor(R()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
// ===== DATI =====
const SETTINGS=[
{id:'villa',scene:['la biblioteca','la serra'],nome:'Villa Malaspina',desc:'una villa sulle colline toscane, durante una cena di famiglia',luogo:'la villa',
 stanze:['la biblioteca','la serra','la cantina','il salone','la cucina','lo studio','la terrazza'],
 ruoli:['il nipote ereditiero','la governante','il medico di famiglia','la seconda moglie','il notaio','il giardiniere','la sorella minore'],
 vittime:['il conte Arnaldo Malaspina','la contessa Ilaria Malaspina']},
{id:'yacht',scene:['il ponte superiore','la cabina armatoriale'],nome:'Yacht "Stella Nera"',desc:'uno yacht ormeggiato al porto di Portofino, durante una festa privata',luogo:'lo yacht',
 stanze:['il ponte di prua','la cabina armatoriale','la sala macchine','il salone di poppa','la cambusa','il ponte superiore','la plancia'],
 ruoli:['il capitano','lo chef di bordo','il socio in affari','la modella','il broker','la hostess','il fotografo'],
 vittime:["l'armatore Vittorio Sanna","l'imprenditrice Greta Fontana"]},
{id:'hotel',scene:['la hall','il bar americano'],nome:'Grand Hotel Excelsior',desc:'un grande albergo sul lago di Como, in una notte di tempesta',luogo:"l'hotel",
 stanze:['la hall','il bar americano','la suite 101','la lavanderia','il salone delle feste','la cucina','il giardino d\'inverno'],
 ruoli:['il concierge','la cantante','il direttore','l\'ospite americano','la cameriera ai piani','il barman','il critico gastronomico'],
 vittime:['il magnate Edoardo Ricci','la diva Lucia Bellandi']},
{id:'treno',scene:['la carrozza ristorante','lo scompartimento 7'],nome:'Espresso Milano–Palermo',desc:'un treno notte in viaggio lungo la costa tirrenica',luogo:'il treno',
 stanze:['la carrozza ristorante','il vagone letto 3','il vagone bagagli','lo scompartimento 7','il corridoio di coda','la cabina del capotreno','il vagone letto 5'],
 ruoli:['il capotreno','la contessa in viaggio','il commesso viaggiatore','il professore','la giornalista','il cuoco del vagone','lo studente'],
 vittime:['il banchiere Ottavio Ferri','la scrittrice Adele Manin']},
{id:'teatro',scene:['il palcoscenico','il camerino principale'],nome:'Teatro La Fenice dei Sogni',desc:'un teatro dopo la prima di un\'opera',luogo:'il teatro',
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
const FEM=n=>/^(Giulia|Sofia|Anna|Chiara|Elena|Bianca|Valeria|Livia|Nora) /.test(n);
const ORE=['22:15','22:40','23:10','23:30','23:50','00:20'];
// ===== GENERATORE =====
function genera(seed){
 R=mulberry(seed);
 const S=pick(SETTINGS),n=4+Math.floor(R()*2);
 const ruoli=shuffle(S.ruoli).slice(0,n),pm=shuffle(NOMI.filter(x=>!FEM(x))),pf=shuffle(NOMI.filter(FEM)),nomi=ruoli.map(r=>(r.startsWith('la ')?pf:pm).pop()),mot=shuffle(MOVENTI).slice(0,n),seg=shuffle(SEGRETI);
 const stanze=[S.scene[0],...shuffle(S.stanze.filter(x=>x!==S.scene[0]))],scena=stanze[0],arma=pick(ARMI),ora=pick(ORE),vittima=pick(S.vittime);
 const sus=nomi.map((nm,i)=>({id:i,nome:nm,ruolo:ruoli[i],movente:mot[i],f:FEM(nm),look:Math.floor(R()*1e6)}));
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
 const C={vf:/contessa|imprenditrice|diva|scrittrice|prima donna/.test(vittima),scene:S.scene,seed,set:S.id,nomeSet:S.nome,desc:S.desc,vittima,scena,ora,arma:arma.id,killer:k,sospetti:sus,indizi:shuffle(clues)};
 C.indizi.forEach((c,i)=>{c.costo=c.tipo==='arma'&&c.id==='autopsia'?3:5});
 return C;}
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
