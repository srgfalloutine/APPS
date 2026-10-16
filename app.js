const $=s=>document.querySelector(s),F=n=>Math.round(n).toLocaleString('fr-FR')+' FCFA',D=864e5;
const PG={caisse:'Caisse',stock:'Stock',clients:'Clients',bilan:'Bilan',rapports:'Rapports',equipe:'Équipe',dash:'Tableau de bord'},SP=Object.keys(PG).slice(0,6);
const mk=(id,name,u,pw,pr,sl)=>{const t=Date.now();return{id,name,u,pw,on:1,seq:sl.length,pay:'Espèces',per:7,cash0:25000,cart:{},enc:[],mv:[],
p:pr.map(([n,p,s,th],i)=>({id:i+1,n,pr:p,s,th,bc:''+(id*1000+i+1)})),sales:sl.map((x,i)=>({id:i+1,t:t-(6-i)*D-36e5,total:x,pay:'Espèces',items:[],v:0})),
exp:[{t:t-3*D,l:'Transport marchandises',a:12000}],cli:[{n:'Mme Diop',a:8500,t:t-12*D}],team:[{n:'Awa',r:'Vendeuse',sal:60000}]}};
let DB,S,reg=0;try{DB=JSON.parse(localStorage.sf2)}catch(e){}
DB=DB||{me:null,v:null,log:[],shops:[mk(1,'Boutique Awa','awa','1234',[['Riz 1kg',600,48,10],['Huile 1L',1400,4,5],['Sucre 1kg',800,31,10],['Savon 250g',250,2,5]],[5200,7800,4300,9100,8200,12500,6400]),mk(2,'Épicerie Moussa','moussa','1234',[['Pain',150,60,20],['Lait en poudre',1200,22,8],['Thé',500,3,6]],[3100,4200,3900,5200,4800,7300,5100])]};
const save=()=>{try{localStorage.sf2=JSON.stringify(DB)}catch(e){}},hh=t=>new Date(t).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const log=m=>{DB.log.unshift({t:Date.now(),m:(S?S.name:'Administrateur')+' · '+m});DB.log=DB.log.slice(0,30)};
const sum=(a,f)=>a.reduce((x,y)=>x+f(y),0),since=d=>Date.now()-d*D,low=s=>(s||S).p.filter(p=>p.s<=p.th),P=id=>S.p.find(p=>p.id==id);
const sl=(s,d)=>s.sales.filter(x=>!x.v&&x.t>=since(d)),ex=(s,d)=>s.exp.filter(e=>e.t>=since(d));
const treso=()=>S.cash0+sum(S.sales.filter(s=>!s.v&&s.pay!='Crédit'),s=>s.total)+sum(S.enc,e=>e.a)-sum(S.exp,e=>e.a);
const seg=(l,on,fn)=>`<div class=seg>${l.map(x=>`<button class="${x[0]==on?'on':''}" onclick="${fn}('${x[0]}')">${x[1]||x[0]}</button>`).join('')}</div>`;
const V={};
V.login=()=>`<form class="card lg" onsubmit="A.login();return false"><h1>StockFlow</h1><p class=mu>${reg?'Créez votre compte vendeur':'Gérez ventes, stock et finances de votre commerce.'}</p>
${reg?'<label>Nom de la boutique<input id=ln></label>':''}<label>Identifiant<input id=lu autocomplete=username></label><label>Mot de passe<input id=lp type=password autocomplete=current-password></label>
<div class=err id=er role=alert></div><button class=btn>${reg?'Créer mon compte':'Se connecter'}</button><button type=button class=lk onclick="reg=!reg;render()">${reg?'J’ai déjà un compte':'Créer un compte vendeur'}</button>
<small>Démo : admin / admin123 · awa / 1234 · moussa / 1234</small><button type=button class=lk onclick="A.reset()">Réinitialiser la démo</button></form>`;
V.dash=()=>{const r=DB.shops.map(s=>{const v=sum(sl(s,30),x=>x.total),e=sum(ex(s,30),x=>x.a);return{s,v,e,al:low(s).length,pay:sum(s.team,m=>m.sal)}}),a=r.reduce((t,x)=>({v:t.v+x.v,e:t.e+x.e,al:t.al+x.al}),{v:0,e:0,al:0});
return `<h1>Tableau de bord</h1><div class=grid><div class="card kpi"><small>Vendeurs actifs</small><b>${DB.shops.filter(s=>s.on).length} / ${DB.shops.length}</b></div><div class="card kpi"><small>Ventes (30 j)</small><b class=pos>${F(a.v)}</b></div><div class="card kpi"><small>Dépenses (30 j)</small><b class=neg>${F(a.e)}</b></div><div class="card kpi"><small>Bénéfices (30 j)</small><b class=pos>${F(a.v-a.e)}</b></div><div class="card kpi"><small>Alertes de stock</small><b class=wn>${a.al}</b></div></div>
<div class=card><h2>Vendeurs</h2><table><tr><th>Boutique<th>Ventes<th>Dépenses<th>Bénéfice<th>Alertes<th>Équipe<th>Compte</tr>${r.map(x=>`<tr><td><b>${x.s.name}</b><br><small>${x.s.u}</small><td class=pos>${F(x.v)}<td class=neg>${F(x.e)}<td class=pos>${F(x.v-x.e)}<td class=wn>${x.al}<td>${x.s.team.length} · ${F(x.pay)}<td><button class="btn ${x.s.on?'r':'o'} s" onclick="A.sus(${x.s.id})">${x.s.on?'Suspendre':'Réactiver'}</button></tr>`).join('')}</table></div>
<div class=card><h2>Activité récente</h2>${DB.log.slice(0,10).map(l=>`<div class=row><span>${l.m}</span><small>${hh(l.t)}</small></div>`).join('')||'<p class=mu>Aucune activité.</p>'}</div>`};
V.caisse=()=>{const c=Object.entries(S.cart).map(([id,q])=>({p:P(id),q})),tot=sum(c,x=>x.p.pr*x.q);
return `<h1>Caisse</h1><div class=grid>${S.p.map(p=>`<button class="card pr" onclick="A.add(${p.id})"><b>${p.n}</b><span>${F(p.pr)}</span><small class="${p.s<=p.th?'wn':''}">${p.s} en stock</small></button>`).join('')||'<p class=mu>Ajoutez d’abord des produits dans Stock.</p>'}</div>
<div class=card><h2>Panier</h2>${c.map(x=>`<div class=row><span>${x.p.n}</span><span><button class=q onclick="A.q(${x.p.id},-1)" aria-label="Retirer">−</button> ${x.q} <button class=q onclick="A.q(${x.p.id},1)" aria-label="Ajouter">+</button> ${F(x.p.pr*x.q)}</span></div>`).join('')||'<p class=mu>Touchez un produit pour l’ajouter.</p>'}
<div class="row tot"><span>Total</span><span class=pos>${F(tot)}</span></div>${seg(['Espèces','Wave','Orange Money','Crédit'].map(m=>[m]),S.pay,'A.pay')}<button class=btn ${c.length?'':'disabled'} onclick="A.sell()">Valider la vente · ${F(tot)}</button></div>
<div class=card><h2>Dernières ventes</h2>${S.sales.filter(s=>!s.v).slice(-4).reverse().map(s=>`<div class=row><span>n° ${s.id} · ${s.pay} · <b class=pos>${F(s.total)}</b></span><span><button class="btn o s" onclick="A.rc(${s.id})">Reçu</button> <button class="btn r s" onclick="A.void(${s.id})">Annuler</button></span></div>`).join('')}</div>`};
V.stock=()=>{const o=low(),t=S.type||'Entrée';
return `<h1>Stock</h1>${o.length?`<div class=alert>${o.length} produit(s) bientôt en rupture : ${o.map(p=>p.n).join(', ')}</div>`:''}
${S.p.map(p=>`<div class=card><div class=row><b>${p.n} · ${F(p.pr)}</b><span class="${p.s<=p.th?'wn':''}">${p.s} en stock · seuil ${p.th}</span></div><div class=bar><i class="${p.s<=p.th?'w':''}" style="width:${Math.min(100,p.s/(p.th*5)*100)}%"></i></div><div class=row><small class="${p.s<=p.th?'wn':''}">${p.s<=p.th?'Bientôt en rupture':'Niveau correct'}</small><span><button class="btn o s" onclick="A.price(${p.id})">Modifier le prix</button> <button class="btn r s" onclick="A.delP(${p.id})">Supprimer</button></span></div></div>`).join('')}
<div class=card><h2>Ajouter un produit</h2><div class=row><input id=pn aria-label="Nom" placeholder="Nom"><input id=pp type=number min=0 aria-label="Prix" placeholder="Prix"><input id=ps type=number min=0 aria-label="Stock" placeholder="Stock"><input id=pt type=number min=0 aria-label="Seuil" placeholder="Seuil"></div><button class=btn onclick="A.addP()">Ajouter</button></div>
<div class=card><h2>Mouvement de stock</h2>${seg(['Entrée','Sortie','Inventaire'].map(x=>[x]),t,'A.type')}<button class="btn o" onclick="A.scan()">Scanner un code-barres</button>
<label>Produit<select id=mp>${S.p.map(p=>`<option value=${p.id} ${S.sel==p.id?'selected':''}>${p.n}</option>`).join('')}</select></label><label>${t=='Inventaire'?'Quantité comptée':'Quantité'}<input id=mq type=number min=0 value=1></label><label>Nouveau seuil d’alerte (facultatif)<input id=mt type=number min=0></label><button class=btn onclick="A.move()">Enregistrer</button></div>
<div class=card><h2>Mouvements de stock</h2>${S.mv.slice(0,8).map(m=>`<div class=row><span>${m.m}</span><b class="${m.q>0?'pos':'neg'}">${m.q>0?'+':''}${m.q}</b></div>`).join('')||'<p class=mu>Aucun mouvement.</p>'}</div>`};
V.clients=()=>{const ord=low().map(p=>({p,q:Math.max(p.th*2-p.s,1)}));
return `<h1>Clients et fournisseurs</h1><div class=card><h2>Dettes clients · <span class=neg>${F(sum(S.cli,c=>c.a))}</span></h2>${S.cli.map((c,i)=>`<div class=row><span><b>${c.n}</b> <small>${F(c.a)} · depuis ${Math.max(1,Math.round((Date.now()-c.t)/D))} j</small></span><span><button class="btn o s" onclick="A.rel(${i})">Relancer</button> <button class="btn s" onclick="A.paid(${i})">Encaisser</button></span></div>`).join('')||'<p class=mu>Aucune dette.</p>'}
<div class=row><input id=cn aria-label="Nom du client" placeholder="Nom du client"><input id=ca type=number aria-label="Montant" placeholder="Montant"><button class="btn s" onclick="A.addDebt()">Ajouter</button></div></div>
<div class=card><h2>Commande de réapprovisionnement</h2>${ord.map(o=>`<div class=row><span>${o.p.n}</span><b class=wn>×${o.q}</b></div>`).join('')||'<p class=mu>Aucun produit sous le seuil.</p>'}<button class=btn ${ord.length?'':'disabled'} onclick="A.order()">Envoyer au fournisseur (WhatsApp)</button></div>`};
V.bilan=()=>{const v=sum(sl(S,S.per),x=>x.total),d=sum(ex(S,S.per),e=>e.a),mx=[...Array(7)].map((_,i)=>{const a=Date.now()-(6-i)*D,k=new Date(a).toDateString();return{l:new Date(a).toLocaleDateString('fr-FR',{weekday:'narrow'}),t:sum(S.sales.filter(s=>!s.v&&new Date(s.t).toDateString()==k),s=>s.total)}}),m=Math.max(...mx.map(x=>x.t),1);
return `<h1>Bilan</h1>${seg([[1,'Jour'],[7,'Semaine'],[30,'Mois']],S.per,'A.per')}<div class=card><small>Bénéfice (ventes − dépenses)</small><b class="${v>=d?'pos':'neg'}" style="font-size:32px">${F(v-d)}</b><div class=row><span>Ventes <b class=pos>${F(v)}</b></span><span>Dépenses <b class=neg>${F(d)}</b></span></div></div>
<div class=card><div class=row><span>Trésorerie (départ ${F(S.cash0)})</span><b class=pos>${F(treso())}</b></div><button class="btn o s" onclick="A.cash()">Modifier le solde de départ</button></div>
<div class=card><h2>Ventes des 7 derniers jours</h2><div class=chart>${mx.map(x=>`<div><i style="height:${x.t/m*90}px"></i>${x.l}</div>`).join('')}</div></div>
<div class=card><h2>Dépenses</h2>${S.exp.slice(-5).reverse().map(e=>`<div class=row><span>${e.l}</span><b class=neg>${F(e.a)}</b></div>`).join('')}<div class=row><input id=el aria-label="Libellé" placeholder="Libellé"><input id=ea type=number aria-label="Montant" placeholder="Montant"><button class="btn s" onclick="A.addExp()">Ajouter</button></div></div>`};
V.rapports=()=>`<h1>Rapports</h1>${seg(['Banque','Fisc','Interne'].map(x=>[x]),S.dest||'Banque','A.dest')}${[0,1,2,3].map(i=>`<div class=card><b>${A.rep(i).t}</b><div class=row><button class="btn s" onclick="A.exp(${i},'pdf')">PDF</button><button class="btn o s" onclick="A.exp(${i},'csv')">Excel (CSV)</button></div></div>`).join('')}`;
V.equipe=()=>`<h1>Équipe et salaires</h1><div class=card>${S.team.map((m,i)=>`<div class=row><span><b>${m.n}</b> <small>${m.r}</small> · ${F(m.sal)}</span><span><button class="btn s" onclick="A.payM(${i})">Payer le salaire</button> <button class="btn r s" onclick="A.delM(${i})">Retirer</button></span></div>`).join('')||'<p class=mu>Aucun membre.</p>'}<div class="row tot"><span>Masse salariale mensuelle</span><span class=neg>${F(sum(S.team,m=>m.sal))}</span></div></div>
<div class=card><h2>Ajouter un membre</h2><div class=row><input id=mn aria-label="Nom" placeholder="Nom"><input id=mr aria-label="Poste" placeholder="Poste"><input id=ms type=number min=0 aria-label="Salaire" placeholder="Salaire"></div><button class=btn onclick="A.addM()">Ajouter à l’équipe</button></div>`;
const A={
login(){const u=$('#lu').value.trim().toLowerCase(),p=$('#lp').value,er=m=>$('#er').textContent=m;
if(reg){const n=$('#ln').value.trim();if(!n||!u||p.length<4)return er('Remplissez tous les champs (mot de passe : 4 caractères minimum).');if(u=='admin'||DB.shops.some(s=>s.u==u))return er('Identifiant déjà utilisé.');
const s=mk(Date.now(),n,u,p,[],[]);s.exp=[];s.cli=[];s.team=[];DB.shops.push(s);DB.me=s.id;DB.v='caisse';S=s;log('nouveau compte');reg=0;return render()}
if(u=='admin'&&p=='admin123'){DB.me='admin';DB.v='dash';return render()}
const s=DB.shops.find(x=>x.u==u&&x.pw==p);if(!s)return er('Identifiant ou mot de passe incorrect.');if(!s.on)return er('Compte suspendu. Contactez l’administrateur.');DB.me=s.id;DB.v='caisse';render()},
out(){DB.me=null;render()},sus(id){const s=DB.shops.find(x=>x.id==id);s.on=s.on?0:1;log((s.on?'réactivé : ':'suspendu : ')+s.name);render()},
add(id){if((S.cart[id]||0)>=P(id).s)return alert('Stock insuffisant.');S.cart[id]=(S.cart[id]||0)+1;render()},
q(id,d){S.cart[id]=Math.min((S.cart[id]||0)+d,P(id).s);if(S.cart[id]<=0)delete S.cart[id];render()},pay(m){S.pay=m;render()},
sell(){const items=Object.entries(S.cart).map(([id,q])=>({id:+id,n:P(id).n,q,pr:P(id).pr})),total=sum(items,i=>i.pr*i.q);
if(S.pay=='Crédit'){const n=prompt('Nom du client ?');if(!n)return;S.cli.push({n,a:total,t:Date.now()})}
items.forEach(i=>{P(i.id).s-=i.q;S.mv.unshift({t:Date.now(),m:'Sortie · '+i.n+' (vente)',q:-i.q})});
const s={id:++S.seq,t:Date.now(),total,pay:S.pay,items,v:0};S.sales.push(s);S.cart={};log('vente n° '+s.id+' · '+F(total));save();render();A.rc(s.id)},
rc(id){const s=S.sales.find(x=>x.id==id),tx=`${S.name}\nReçu n° ${s.id}\n`+s.items.map(i=>`${i.n} ×${i.q} : ${F(i.pr*i.q)}`).join('\n')+`\nTotal : ${F(s.total)} (${s.pay})\nMerci !`;
A.show(`<h2>Reçu n° ${s.id}</h2><b>${S.name}</b><small>${hh(s.t)}</small>${s.items.map(i=>`<div class=row><span>${i.n} ×${i.q}</span><span>${F(i.pr*i.q)}</span></div>`).join('')}<div class="row tot"><span>Total (${s.pay})</span><span class=pos>${F(s.total)}</span></div><button class=btn onclick="A.wa(${JSON.stringify(tx).replace(/"/g,'&quot;')})">Envoyer par WhatsApp</button><button class="btn o" onclick="print()">Imprimer</button>`)},
void(id){const s=S.sales.find(x=>x.id==id);if(!confirm('Annuler la vente n° '+id+' ?'))return;s.v=1;s.items.forEach(i=>P(i.id)&&(P(i.id).s+=i.q));log('vente n° '+id+' annulée');render()},
type(t){S.type=t;render()},
scan(){const c=prompt('Entrez ou collez le code-barres :');if(!c)return;const p=S.p.find(x=>x.bc==c.trim());if(!p)return alert('Produit inconnu. Le code-barres d’un produit est ex. '+(S.p[0]?S.p[0].bc:'—'));S.sel=p.id;render()},
move(){const p=P($('#mp').value);if(!p)return;const q=+$('#mq').value,t=S.type||'Entrée',th=$('#mt').value;if(t=='Sortie'&&q>p.s)return alert('Quantité supérieure au stock.');
const o=p.s;p.s=t=='Entrée'?o+q:t=='Sortie'?o-q:q;if(th!=='')p.th=+th;S.mv.unshift({t:Date.now(),m:`${t} · ${p.n}`+(t=='Inventaire'?` (écart ${q-o})`:''),q:p.s-o});log(t+' · '+p.n);S.sel=p.id;render()},
price(id){const p=P(id),v=prompt('Nouveau prix de '+p.n+' (FCFA) :',p.pr);if(v&&+v>0){p.pr=+v;log('prix modifié · '+p.n);render()}},
addP(){const n=$('#pn').value.trim(),pr=+$('#pp').value;if(!n||pr<=0)return alert('Nom et prix obligatoires.');const id=Math.max(0,...S.p.map(p=>p.id))+1;S.p.push({id,n,pr,s:+$('#ps').value||0,th:+$('#pt').value||5,bc:''+(S.id%1e6*1000+id)});log('produit ajouté · '+n);render()},
delP(id){const p=P(id);if(!confirm('Supprimer '+p.n+' ?'))return;S.p=S.p.filter(x=>x.id!=id);delete S.cart[id];log('produit supprimé · '+p.n);render()},
rel(i){const c=S.cli[i];A.wa(`Bonjour ${c.n}, petit rappel : il reste ${F(c.a)} à régler. Merci !`)},
paid(i){const c=S.cli.splice(i,1)[0];S.enc.push({t:Date.now(),a:c.a});log('dette encaissée · '+c.n);render()},
addDebt(){const n=$('#cn').value.trim(),a=+$('#ca').value;if(!n||a<=0)return;S.cli.push({n,a,t:Date.now()});render()},
order(){A.wa('Bonjour, commande de réapprovisionnement ('+S.name+') :\n'+low().map(p=>`- ${p.n} ×${Math.max(p.th*2-p.s,1)}`).join('\n'))},
per(d){S.per=+d;render()},cash(){const v=prompt('Solde de départ (FCFA) :',S.cash0);if(v!==null&&+v>=0){S.cash0=+v;render()}},
addExp(){const l=$('#el').value.trim(),a=+$('#ea').value;if(!l||a<=0)return;S.exp.push({t:Date.now(),l,a});log('dépense · '+l);render()},
addM(){const n=$('#mn').value.trim(),s=+$('#ms').value;if(!n||s<0)return alert('Nom et salaire obligatoires.');S.team.push({n,r:$('#mr').value.trim()||'Employé',sal:s});log('équipe · '+n);render()},
payM(i){const m=S.team[i];if(!confirm('Payer '+F(m.sal)+' à '+m.n+' ?'))return;S.exp.push({t:Date.now(),l:'Salaire · '+m.n,a:m.sal});log('salaire payé · '+m.n);render()},
delM(i){S.team.splice(i,1);render()},dest(d){S.dest=d;render()},
rep(i){const v=sl(S,30),d=sum(ex(S,30),e=>e.a),n=Date.now();return[
{t:'Bilan et trésorerie (30 jours)',h:['Rubrique','Montant'],r:[['Ventes',sum(v,x=>x.total)],['Dépenses',d],['Bénéfice',sum(v,x=>x.total)-d],['Trésorerie',treso()]]},
{t:'Journal des ventes',h:['N°','Date','Paiement','Total'],r:S.sales.filter(s=>!s.v).map(s=>[s.id,new Date(s.t).toLocaleDateString('fr-FR'),s.pay,s.total])},
{t:'État du stock',h:['Produit','Stock','Seuil','Prix'],r:S.p.map(p=>[p.n,p.s,p.th,p.pr])},
{t:'Dettes clients',h:['Client','Montant','Jours'],r:S.cli.map(c=>[c.n,c.a,Math.round((n-c.t)/D)])}][i]},
exp(i,f){const R=A.rep(i),ti=S.name+' – '+R.t+' – '+(S.dest||'Banque');
if(f=='csv'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+[R.h,...R.r].map(r=>r.join(';')).join('\n')],{type:'text/csv'}));a.download='stockflow-'+i+'.csv';a.click()}
else{const w=open('','_blank');if(!w)return alert('Autorisez les fenêtres pop-up.');w.document.write(`<h2>${ti}</h2><table border=1 cellpadding=6 style="border-collapse:collapse"><tr>${R.h.map(h=>`<th>${h}</th>`).join('')}</tr>${R.r.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`);w.document.close();w.print()}
log('export '+f+' · '+R.t);save()},
wa(t){open('https://wa.me/?text='+encodeURIComponent(t))},
show(h){$('#m').innerHTML=`<div class=box>${h}<button class="btn o" onclick="A.close()">Fermer</button></div>`;$('#m').hidden=false},close(){$('#m').hidden=true},
reset(){localStorage.removeItem('sf2');location.reload()}};
function render(){document.body.className=DB.me?'':'out';if(!DB.me){$('#v').innerHTML=V.login();return}
S=DB.me=='admin'?null:DB.shops.find(x=>x.id==DB.me);const ok=S?SP:['dash'];if(!ok.includes(DB.v))DB.v=ok[0];
$('#nav').innerHTML=ok.map(p=>`<button class="${DB.v==p?'on':''}" onclick="DB.v='${p}';render()">${PG[p]}</button>`).join('');$('#who').textContent=S?S.name:'Administrateur';$('#v').innerHTML=V[DB.v]();save()}
document.addEventListener('keydown',e=>e.key=='Escape'&&A.close());
render();
