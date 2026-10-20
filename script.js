const T={P:['Protocol','#3EE0D0'],R:['Reagent','#7AA2FF'],E:['Experiment','#8B7CFF'],D:['Dataset','#F3F6FB'],A:['Analysis','#FFC857'],F:['Finding','#FF8FA3'],U:['Publication','#FFFFFF']};
const ST={verified:['Verified','#4ADE9A'],supported:['Supported','#5CC8FF'],inferred:['Inferred','#B39DFF'],review:['Needs review','#FFB020'],unverified:['Unverified','#FF6B6B']};
const N={};[
['P1','Lysis protocol','P','current','v1.0, updated 12 Oct 2026','Cell lysis and extraction steps.',210,210],
['R1','Lysis buffer lot 14','R','current','lot 14','Buffer used in the protocol.',60,210],
['E1','Experiment A','E','current','v1','Extraction run, cell line X.',210,90],
['E2','Experiment B','E','current','v1','Replicate run, cell line Y.',210,330],
['D1','Dataset A','D','current','v1','Raw measurements from Experiment A.',380,90],
['D2','Dataset B','D','draft','v0.9','Raw measurements from Experiment B.',380,330],
['D3','Reference set','D','current','v2','Shared reference values.',380,210],
['A1','Analysis A','A','current','v3','Normalisation and comparison.',550,90],
['A2','Analysis B','A','needs review','v1','Combines Dataset B and the reference set.',550,300],
['F1','Finding A','F','current','v1','Summary result from Analysis A.',690,150],
['F2','Finding B','F','draft','v1','Summary result from Analysis B.',690,300],
['U1','Manuscript draft','U','in preparation','draft 2','Cites Findings A and B.',780,225]
].forEach(a=>N[a[0]]={id:a[0],n:a[1],t:a[2],s:a[3],v:a[4],d:a[5],x:a[6],y:a[7]});
const E=[['R1','P1','verified','ELN-0398 buffer prep record'],['P1','E1','verified','ELN-0412 run record'],['P1','E2','supported','ELN-0425 run record'],['E1','D1','verified','Export note for Dataset A'],['E2','D2','inferred',null,'Inferred from shared run date and sample IDs.'],['D1','A1','supported','Pipeline log A1-run3'],['D2','A2','review',null,'Dataset version used is unclear.'],['D3','A2','supported','Reference sheet note'],['A1','F1','supported','Notebook entry for Finding A'],['A2','F2','unverified',null,'No record links this analysis to the finding.'],['F1','U1','verified','Manuscript draft section 3'],['F2','U1','inferred',null,'Inferred from draft text.']].map(e=>({s:e[0],t:e[1],st:e[2],ev:e[3],j:e[4]}));
const $=id=>document.getElementById(id);
function trace(root,dir){const seen={[root]:{depth:0,path:[root],edge:null}},pe=new Set(),q=[root];
 while(q.length){const c=q.shift();E.forEach((e,i)=>{const from=dir=='down'?e.s:e.t,to=dir=='down'?e.t:e.s;
  if(from===c&&!seen[to]){seen[to]={depth:seen[c].depth+1,path:[...seen[c].path,to],edge:i};q.push(to);}});}
 Object.values(seen).forEach(r=>{for(let k=1;k<r.path.length;k++){const a=r.path[k-1],b=r.path[k];const i=E.findIndex(e=>(e.s==a&&e.t==b)||(e.s==b&&e.t==a));if(i>=0)pe.add(i)}});
 return {root,dir,map:seen,pe,at:new Date().toLocaleString()}}
function mk(svg,o){const S={sel:null,res:null,types:new Set(Object.keys(T)),st:'all',q:'',vb:[0,0,820,420]};
 function rel(){if(!S.sel)return null;if(S.res)return new Set(Object.keys(S.res.map));const r=new Set([S.sel]);E.forEach(e=>{if(e.s==S.sel)r.add(e.t);if(e.t==S.sel)r.add(e.s)});return r}
 function render(){const R=rel(),ql=S.q.trim().toLowerCase();let h='';
  E.forEach((e,i)=>{const a=N[e.s],b=N[e.t];if(S.st!='all'&&e.st!=S.st)return;const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;
   const x1=a.x+ux*22,y1=a.y+uy*22,x2=b.x-ux*30,y2=b.y-uy*30,tx=b.x-ux*22,ty=b.y-uy*22;
   const on=S.res?S.res.pe.has(i):(S.sel&&(e.s==S.sel||e.t==S.sel));const hide=!S.types.has(a.t)||!S.types.has(b.t);
   const op=hide?.08:on?1:(S.sel?.2:.6),c=ST[e.st][1];
   h+=`<g opacity="${op}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${on?3:1.6}" ${on?'class="flow"':e.st=='inferred'||e.st=='unverified'?'stroke-dasharray="5 4"':''}/><polygon fill="${c}" points="${tx},${ty} ${tx-ux*10+uy*5},${ty-uy*10-ux*5} ${tx-ux*10-uy*5},${ty-uy*10+ux*5}"/></g>`});
  Object.values(N).forEach(n=>{const rd=S.res?(S.res.map[n.id]?S.res.map[n.id].depth:-1):(S.sel==n.id?0:-1);const hide=!S.types.has(n.t)||(R&&!R.has(n.id))||(ql&&!(n.n.toLowerCase().includes(ql)||n.id.toLowerCase().includes(ql)));
   h+=`<g class="nd ${S.sel==n.id?'sel':''}" data-id="${n.id}" tabindex="0" role="button" aria-label="${n.n}, ${T[n.t][0]}" opacity="${hide?.18:1}">${rd>=0?`<circle class="rip" cx="${n.x}" cy="${n.y}" r="22" style="animation-delay:${rd*.45}s"/>`:''}<circle class="rg" cx="${n.x}" cy="${n.y}" r="26"/><circle cx="${n.x}" cy="${n.y}" r="20" fill="${T[n.t][1]}"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" font-size="14" font-weight="800" fill="#0C1226" pointer-events="none">${T[n.t][0][0]}</text>${n.s!='current'?`<circle cx="${n.x+15}" cy="${n.y-15}" r="5" fill="#FFB020" stroke="#0C1226"/>`:''}<text class="lbl" x="${n.x}" y="${n.y+39}">${n.n}</text></g>`});
  svg.innerHTML=h;svg.setAttribute('viewBox',S.vb.join(' '))}
 let drag=null,moved=false;
 svg.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,vb:[...S.vb]};moved=false});
 addEventListener('pointermove',e=>{if(!drag||!o.pan)return;const k=S.vb[2]/svg.clientWidth,dx=(e.clientX-drag.x),dy=(e.clientY-drag.y);if(Math.abs(dx)+Math.abs(dy)>4)moved=true;if(moved){S.vb[0]=drag.vb[0]-dx*k;S.vb[1]=drag.vb[1]-dy*k;svg.setAttribute('viewBox',S.vb.join(' '))}});
 addEventListener('pointerup',()=>{drag=null});
 const pick=t=>{const g=t.closest('[data-id]');if(g&&!moved)api.select(g.dataset.id)};
 svg.addEventListener('click',e=>pick(e.target));
 svg.addEventListener('keydown',e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();pick(e.target)}});
 const api={S,render,select(id){S.sel=id;S.res=null;render();o.onSel&&o.onSel(S)},run(dir){if(!S.sel)return;S.res=trace(S.sel,dir);render();o.onRun&&o.onRun(S)},
  zoom(f){const [x,y,w,h]=S.vb,nw=w*f,nh=h*f;S.vb=[x+(w-nw)/2,y+(h-nh)/2,nw,nh];render()},fit(){S.vb=[0,0,820,420];render()}};
 render();return api}

// hero
const hero=mk($('hg'),{onSel(S){hero.S.res=trace(S.sel,'down');hero.render();const n=N[S.sel],d=trace(S.sel,'down'),u=trace(S.sel,'up');
 $('hcap').innerHTML=`<strong>${n.n}</strong> (${T[n.t][0]}): ${Object.keys(d.map).length-1} downstream, ${Object.keys(u.map).length-1} upstream. Illustrative data.`}});

hero.select('P1');
// workspace
const checks={};let W;
const pill=s=>`<span class="pill" style="background:${ST[s][1]}">${ST[s][0]}</span>`;
const evTxt=e=>e.ev?`Evidence: ${e.ev}`:`<span class="warn">Evidence unavailable</span>${e.j?'. '+e.j:''}`;
function panel(){const S=W.S,p=$('panel');
 if(!S.sel){p.innerHTML='<h3>Nothing selected</h3><p class="mut">Select a node in the graph, such as the Lysis protocol, to see its details and trace what it affects.</p>';return}
 const n=N[S.sel],inc=E.filter(e=>e.t==n.id),out=E.filter(e=>e.s==n.id);
 const li=(e,o)=>`<div class="rel"><strong>${o?'To':'From'} ${N[o?e.t:e.s].n}</strong> ${pill(e.st)}<small>${evTxt(e)}</small></div>`;
 p.innerHTML=`<h3>${n.n}</h3><span class="pill" style="background:${T[n.t][1]}">${T[n.t][0]}</span> <small class="mut">${n.id} · ${n.v} · status: ${n.s} · ${inc.length+out.length} relationships</small><p>${n.d}</p>
 <div class="row" style="margin:12px 0"><button class="btn sm" id="td">Trace impact</button><button class="btn sm ghost" id="tu" style="color:var(--fg)">Trace upstream</button></div>
 <strong>Upstream relationships</strong>${inc.map(e=>li(e,0)).join('')||'<p class="mut">None. This is a root artifact.</p>'}
 <strong>Downstream relationships</strong>${out.map(e=>li(e,1)).join('')||'<p class="mut">None. Nothing depends on this yet.</p>'}`;
 $('td').onclick=()=>W.run('down');$('tu').onclick=()=>W.run('up')}
function score(id,r){const e=E[r.edge],n=N[id];let s=r.depth==1?3:r.depth==2?2:1,why=['depth '+r.depth];
 if(['inferred','review','unverified'].includes(e.st)){s+=2;why.push('relationship '+ST[e.st][0].toLowerCase())}
 if(!e.ev){s+=2;why.push('no evidence on final link')}
 if(n.s!='current'){s+=1;why.push('artifact status: '+n.s)}
 return {s,pr:s>=6?'High':s>=4?'Medium':'Low',why:why.join('; ')}}
const ACT={E:'Check whether this experiment used the changed version.',D:'Verify whether this dataset was generated with the previous version.',A:'Review this analysis, which consumes an affected input.',F:'Confirm whether this finding depends on an affected analysis.',U:'Check whether the publication references an affected finding.',P:'Review how this protocol relates to the change.',R:'Review how this reagent relates to the change.',S:''};
const CS=['Open','In review','Completed','Not applicable'];
function out(){const o=$('out'),res=W.S.res;if(!res){o.innerHTML='';return}
 const root=N[res.root],items=Object.entries(res.map).filter(([id])=>id!=res.root).sort((a,b)=>a[1].depth-b[1].depth);
 if(!items.length){o.innerHTML=`<div class="note">No ${res.dir=='down'?'downstream':'upstream'} artifacts found for ${root.n}.</div>`;return}
 const dn=res.dir=='down';
 const rows=items.map(([id,r])=>{const e=E[r.edge],sc=score(id,r);return {id,r,e,sc,key:res.root+id}}).sort((a,b)=>b.sc.s-a.sc.s);
 const path=r=>r.path.map(x=>N[x].n).join(' → ');
 let h=`<h3 style="margin:24px 0 6px;font-size:24px">${dn?'Impact':'Upstream'} report: ${root.n}</h3><p class="mut">${items.length} ${dn?'potentially affected':'upstream'} artifacts (${items.filter(i=>i[1].depth==1).length} direct, ${items.filter(i=>i[1].depth>1).length} indirect). Assessed ${res.at}. Shortest dependency path shown for each. Illustrative data; review recommended, not proof that anything changed.</p>
 <div style="overflow-x:auto"><table><tr><th>Artifact</th><th>Depth</th><th>Path</th><th>Final link</th>${dn?'<th>Priority and reason</th><th>Review action</th>':''}</tr>`;
 rows.forEach(x=>{const c=checks[x.key]||0;h+=`<tr><td><strong>${N[x.id].n}</strong><br><small class="mut">${T[N[x.id].t][0]}</small></td><td>${x.r.depth}</td><td>${path(x.r)}</td><td>${pill(x.e.st)}<br><small>${evTxt(x.e)}</small></td>${dn?`<td><strong>${x.sc.pr}</strong><br><small class="mut">${x.sc.why}</small></td><td><small>${ACT[N[x.id].t]}</small><br><button class="st" data-k="${x.key}">${CS[c]}</button></td>`:''}</tr>`});
 h+='</table></div>';
 const csv=[['root','artifact','type','depth','path','final_relationship_status','evidence','priority','review_status']].concat(rows.map(x=>[root.n,N[x.id].n,T[N[x.id].t][0],x.r.depth,path(x.r),ST[x.e.st][0],x.e.ev||'Evidence unavailable',dn?x.sc.pr:'',CS[checks[x.key]||0]])).map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
 h+=`<h3 style="margin:22px 0 8px;font-size:18px">Export as CSV</h3><textarea id="csv" readonly aria-label="CSV report">${csv}</textarea><div class="row" style="margin-top:8px"><button class="btn sm" id="cp">Copy CSV</button><span id="cm" class="mut"></span></div>`;
 o.innerHTML=h;
 o.querySelectorAll('.st').forEach(b=>b.onclick=()=>{checks[b.dataset.k]=((checks[b.dataset.k]||0)+1)%4;out()});
 $('cp').onclick=async()=>{try{await navigator.clipboard.writeText($('csv').value);$('cm').textContent='Copied.'}catch(e){$('csv').select();$('cm').textContent='Press Ctrl/Cmd+C to copy.'}}}
W=mk($('wg'),{pan:true,onSel:()=>{panel();out()},onRun:()=>{panel();out()}});
panel();
$('chips').innerHTML=Object.entries(T).map(([k,v])=>`<button class="chip" data-t="${k}" aria-pressed="true"><i style="background:${v[1]};border:1px solid #858B85"></i>${v[0]}</button>`).join('');
$('chips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;const k=b.dataset.t,S=W.S;S.types.has(k)?S.types.delete(k):S.types.add(k);b.classList.toggle('off',!S.types.has(k));b.setAttribute('aria-pressed',S.types.has(k));W.render()};
Object.entries(ST).forEach(([k,v])=>$('sf').insertAdjacentHTML('beforeend',`<option value="${k}">${v[0]} only</option>`));
$('sf').onchange=e=>{W.S.st=e.target.value;W.render()};
$('q').oninput=e=>{W.S.q=e.target.value;W.render()};
$('zi').onclick=()=>W.zoom(.8);$('zo').onclick=()=>W.zoom(1.25);$('zf').onclick=()=>W.fit();
$('leg').innerHTML=Object.values(ST).map(v=>`<span><i style="background:${v[1]}"></i>${v[0]}</span>`).join('')+'<span>Dashed: inferred or unverified. Amber dot: artifact needs attention.</span>';
$('reset').onclick=()=>{Object.keys(checks).forEach(k=>delete checks[k]);const S=W.S;S.sel=null;S.res=null;S.q='';S.st='all';S.types=new Set(Object.keys(T));$('q').value='';$('sf').value='all';document.querySelectorAll('.chip').forEach(c=>{c.classList.remove('off');c.setAttribute('aria-pressed','true')});W.fit();panel();out()};
// nav + theme
$('burger').onclick=()=>{const o=$('links').classList.toggle('open');$('burger').setAttribute('aria-expanded',o);$('burger').textContent=o?'✕':'☰'};
$('links').addEventListener('click',e=>{if(e.target.closest('a')){$('links').classList.remove('open');$('burger').textContent='☰';$('burger').setAttribute('aria-expanded',false)}});
$('theme').onclick=()=>{const r=document.documentElement,d=r.dataset.theme?r.dataset.theme=='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=d?'light':'dark'};