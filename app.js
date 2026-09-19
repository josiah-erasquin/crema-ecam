/* Crema app logic — view routing, search, filtering, step check-off, install. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const byId=(arr,id)=>arr.find(x=>x.id===id);
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATLABEL={milk:'Milk drinks',black:'Black',iced:'Iced'};

/* ---- line icons (one stroke weight) ---- */
const P='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const ICONS={
  power:P+'<path d="M12 3v9"/><path d="M6.5 7a8 8 0 1 0 11 0"/></svg>',
  beans:P+'<ellipse cx="9" cy="9" rx="5" ry="7" transform="rotate(-35 9 9)"/><ellipse cx="15" cy="15" rx="5" ry="7" transform="rotate(-35 15 15)"/></svg>',
  scoop:P+'<circle cx="8" cy="14" r="5"/><path d="M11.5 10.5 20 4"/><path d="M17 3l3 1 1 3"/></svg>',
  gauge:P+'<path d="M4 15a8 8 0 0 1 16 0"/><path d="M12 15l4-3"/><path d="M4 19h16"/></svg>',
  star:P+'<path d="M12 4l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 15.8 7.4 18.2l.9-5.1L4.5 9.5l5.2-.8z"/></svg>',
  milk:P+'<path d="M8 3h8l-1 4v13a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V7z"/><path d="M9 11h6"/></svg>',
  wave:P+'<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>',
  target:P+'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/></svg>',
  bolt:P+'<path d="M13 3 5 13h6l-1 8 8-11h-6z"/></svg>',
  heat:P+'<path d="M9 4c0 3-2 4-2 7a5 5 0 0 0 10 0c0-2-1-3-2-4"/><path d="M12 8c0 1.5-1 2-1 3.5a2 2 0 0 0 3 1.5"/></svg>',
  sliders:P+'<path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/></svg>',
  chart:P+'<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>',
  drop:P+'<path d="M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z"/></svg>',
  gear:P+'<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
  flask:P+'<path d="M10 3v6l-5 9a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 18l-5-9V3"/><path d="M9 3h6"/><path d="M8 15h8"/></svg>',
  reset:P+'<path d="M4 12a8 8 0 1 1 2.3 5.6"/><path d="M4 20v-4h4"/></svg>',
};
const icon=n=>ICONS[n]||ICONS.gear;
const ARR='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

/* ---- recipe card ---- */
function specStrip(r,cls){
  const cell=(k,v,acc)=>`<div class="cell"><div class="k">${k}</div><div class="v${acc?' acc':''}">${v}</div></div>`;
  return `<div class="${cls}">${cell('Base',r.base)}${cell('Froth',r.froth)}${cell('Milk',r.milk,true)}</div>`;
}
function card(r){
  const b=el('button','card');
  b.setAttribute('aria-label',r.name);
  b.innerHTML=`<div class="top"><div><h3 class="name">${r.name}</h3>${r.orig?`<div class="orig">${r.orig}</div>`:''}</div><span class="arr">${ARR}</span></div>`
    +`<p class="desc">${r.desc}</p>`+specStrip(r,'spec');
  b.onclick=()=>go('#r/'+r.id);
  return b;
}

/* ---- recipe list ---- */
let curCat='all', curQ='';
function renderRecipes(){
  const host=$('#recipe-list');host.innerHTML='';
  const q=curQ.trim().toLowerCase();
  let list=RECIPES.slice();
  if(curCat!=='all')list=list.filter(r=>r.cats.includes(curCat));
  if(q)list=list.filter(r=>(r.name+' '+(r.orig||'')+' '+r.desc+' '+r.cats.join(' ')).toLowerCase().includes(q));

  if(!list.length){
    host.appendChild(el('div','empty',
      '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'
      +'<b>No drinks found</b>Try another word, or clear the search.'));
    return;
  }
  const build=(items,label)=>{
    const sec=el('div');
    sec.appendChild(el('div','sec',`<h2>${label}</h2><span class="rule"></span><span class="count">${items.length}</span>`));
    const deck=el('div','deck stagger');
    items.forEach(r=>deck.appendChild(card(r)));
    sec.appendChild(deck);
    host.appendChild(sec);
  };
  if(curCat==='all'&&!q){
    ['milk','black','iced'].forEach(c=>{
      const items=list.filter(r=>r.cats.includes(c));
      if(items.length)build(items,CATLABEL[c]);
    });
  }else{
    build(list,q?`Results · “${esc(curQ.trim())}”`:CATLABEL[curCat]||'All');
  }
}
function renderChips(){
  const host=$('#chips');host.innerHTML='';
  CATS.forEach(c=>{
    const b=el('button','chip',c.label);
    b.setAttribute('role','tab');
    b.setAttribute('aria-pressed',c.id===curCat?'true':'false');
    b.onclick=()=>{curCat=c.id;renderChips();renderRecipes();};
    host.appendChild(b);
  });
}

/* ---- detail (recipe / guide / care) ---- */
function stepsList(steps){
  const ol=el('ol','steps');
  steps.forEach(s=>{
    const li=el('li');li.setAttribute('role','button');li.tabIndex=0;
    li.innerHTML=`<span class="num" aria-hidden="true"></span><span class="txt">${s}</span>`;
    const toggle=()=>li.dataset.done=li.dataset.done==='1'?'0':'1';
    li.onclick=toggle;
    li.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};
    ol.appendChild(li);
  });
  return ol;
}
function tipCallout(t){
  const c=el('div','callout');
  const label=t.kind==='official'?'Official':'Barista tip';
  c.innerHTML=`<div class="stamprow"><span class="stamp ${t.kind}">${label}</span></div><p>${t.text}</p>`;
  return c;
}
function sourceRow(src){
  const a=document.createElement('a');a.className='source';a.href=src.url;a.target='_blank';a.rel='noopener';
  const short=src.url.replace(/^https?:\/\/(www\.)?/,'').slice(0,26)+'…';
  a.innerHTML=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none"/></svg>`
    +`<div class="m"><div class="t">${src.title}</div><div class="u">${short}</div></div><span class="arr">${ARR}</span>`;
  return a;
}
function sizeSteps(p,size){
  const t=size==='s8'?'~8 oz':'~10 oz';
  const shot=size==='s8'?p.shot8:p.shot10;
  const CLEAN='Turn the froth dial to <code>CLEAN</code> and run the auto-clean.';
  const fitMilk=`Fit the milk carafe (not above <code>MAX</code>) and set the froth dial to <b>${p.froth}</b>.`;
  const pressFill=`Press the <b>cappuccino</b> button <b>twice</b> for milk only, and add ${p.milk} until the mug is nearly full (${t}).`;
  const topUp=`If the machine stops before the mug is full, press <b>cappuccino</b> twice again and keep adding ${p.milk} until it reaches ${t}.`;
  switch(p.fam){
    case 'milk':{
      const a=[];
      if(p.pre)a.push(p.pre);
      a.push(`Make ${shot} in a large mug.`);
      if(p.afterShot)a.push(p.afterShot);
      a.push(fitMilk,pressFill,topUp);
      if(p.tail)a.push(p.tail);
      a.push(CLEAN);
      return a;
    }
    case 'chocolate':
      return [p.pre,fitMilk,pressFill,topUp,`Stir well. ${CLEAN}`];
    case 'macchiato':
      return [
        `Fit the milk carafe and set the froth dial to <b>${p.froth}</b>.`,
        `Press the <b>cappuccino</b> button <b>twice</b> for milk only and fill a ${t} glass with milk and foam. If it stops short, press twice again and add more.`,
        `Make ${shot} and pour it slowly through the milk so it layers.`,
        CLEAN];
    case 'water':
      return [
        `Make ${shot} in the mug.`,
        `Press the <b>hot water</b> button and top the mug up to ${t}${p.topIf?', if needed':''}. Stop at the line.`];
    case 'iced-milk':
      return [
        `Fill a ${t} glass with ice.`,
        `Make ${shot} and pour it over the ice.`,
        `Fit the milk carafe, set the froth dial to <b>${p.froth}</b>, and press <b>cappuccino</b> twice for milk only. Top the glass with ${p.milk} to ${t}. If it stops short, press twice again and add more.`,
        CLEAN];
    case 'iced-water':
      return [
        `Fill a ${t} glass with ice.`,
        `Make ${shot} and pour it over the ice.`,
        `Add ${p.cold} to fill the glass to ${t}.`];
    default:return [];
  }
}
function renderDetail(item,kind){
  const host=$('#detail');host.innerHTML='';
  const wrap=el('div','detail');
  const desc = (kind==='r'&&item.orig) ? `<b>${item.orig}.</b> ${item.desc}` : item.desc;
  const nc=el('div','namecard');
  nc.innerHTML=`<h1>${item.name||item.title}</h1><p>${desc}</p>`;
  if(kind==='r')nc.insertAdjacentHTML('beforeend',
    `<div class="dspec"><div class="cell"><div class="k">Base</div><div class="v">${item.base}</div></div>`
    +`<div class="cell"><div class="k">Froth</div><div class="v">${item.froth}</div></div>`
    +`<div class="cell"><div class="k">Milk</div><div class="v acc">${item.milk}</div></div></div>`);
  wrap.appendChild(nc);

  // steps (re-rendered when the mug size changes)
  const stepsBlock=el('div','block','<h3>Steps</h3>');
  const stepsHost=el('div');
  stepsBlock.appendChild(stepsHost);
  const paint=arr=>{stepsHost.innerHTML='';stepsHost.appendChild(stepsList(arr));};
  paint(item.steps);

  if(kind==='r'&&item.size){
    const sb=el('div','block','<h3>Mug size</h3>');
    const seg=el('div','seg');
    const fillNote=el('div','sizefoot-note',
      item.size.fam.indexOf('water')>-1
        ? 'Scaled with the hot water function.'
        : 'Scaled with more milk — never water.');
    [['std','Standard'],['s8','8 oz'],['s10','10 oz']].forEach(([k,label])=>{
      const b=el('button','seg-btn'+(k==='std'?' on':''),label);
      b.setAttribute('aria-pressed',k==='std'?'true':'false');
      b.onclick=()=>{
        seg.querySelectorAll('.seg-btn').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false');});
        b.classList.add('on');b.setAttribute('aria-pressed','true');
        paint(k==='std'?item.steps:sizeSteps(item.size,k));
        fillNote.style.display=k==='std'?'none':'block';
      };
      seg.appendChild(b);
    });
    fillNote.style.display='none';
    sb.appendChild(seg);sb.appendChild(fillNote);
    wrap.appendChild(sb);
  }else if(kind==='r'&&item.sizeNote){
    const sb=el('div','block','<h3>Mug size</h3>');
    const n=el('div','callout');n.innerHTML=`<p>${item.sizeNote}</p>`;sb.appendChild(n);
    wrap.appendChild(sb);
  }

  wrap.appendChild(stepsBlock);

  if(item.tips&&item.tips.length){
    const tb=el('div','block','<h3>Good to know</h3>');
    item.tips.forEach(t=>tb.appendChild(tipCallout(t)));
    wrap.appendChild(tb);
  }
  if(item.source){
    const sb=el('div','block','<h3>Watch</h3>');
    sb.appendChild(sourceRow(item.source));
    wrap.appendChild(sb);
  }
  host.appendChild(wrap);
  $('#crumb').textContent=item.name||item.title;
}

/* ---- guide / care lists ---- */
function rowList(items,kind,host){
  host.innerHTML='';
  const deck=el('div','rows stagger');
  items.forEach(it=>{
    const b=el('button','row');
    b.setAttribute('aria-label',it.title);
    b.innerHTML=`<span class="ic">${icon(it.icon)}</span><div class="m"><div class="t">${it.title}</div><div class="d">${it.desc}</div></div><span class="arr">${ARR}</span>`;
    b.onclick=()=>go('#'+kind+'/'+it.id);
    deck.appendChild(b);
  });
  const sec=el('div');
  sec.appendChild(el('div','sec',`<h2>${kind==='g'?'Operate the machine':'Clean & maintain'}</h2><span class="rule"></span><span class="count">${items.length}</span>`));
  sec.appendChild(deck);
  host.appendChild(sec);
  if(kind==='g')host.appendChild(el('div','note','<b>Official</b> steps come from the De’Longhi how-to videos. <b>Tips</b> are barista opinion — a place to start, then taste.'));
}

/* ---- routing ---- */
function setTab(tab){
  document.querySelectorAll('nav button').forEach(b=>{
    b.setAttribute('aria-current',b.dataset.tab===tab?'page':'false');
  });
}
let lastList='recipes';
function route(){
  const h=location.hash||'#recipes';
  const m=h.match(/^#([rgc])\/(.+)$/);
  if(m){
    const kind=m[1],id=m[2];
    let item,tab;
    if(kind==='r'){item=byId(RECIPES,id);tab='recipes';}
    else if(kind==='g'){item=byId(GUIDE,id);tab='guide';}
    else{item=byId(CARE,id);tab='care';}
    if(!item){go('#recipes');return;}
    renderDetail(item,kind);
    document.body.dataset.view='detail';
    setTab(tab);
  }else{
    const v=h.replace('#','')||'recipes';
    if(v==='guide'){rowList(GUIDE,'g',$('#guide-body'));document.body.dataset.view='guide';setTab('guide');}
    else if(v==='care'){rowList(CARE,'c',$('#care-body'));document.body.dataset.view='care';setTab('care');}
    else{document.body.dataset.view='recipes';setTab('recipes');}
    lastList=document.body.dataset.view;
  }
  window.scrollTo(0,0);
}
window.go=h=>{location.hash=h;};
window.addEventListener('hashchange',route);

/* ---- search ---- */
const search=$('#search'),wrap=$('#searchwrap');
search.addEventListener('input',()=>{
  curQ=search.value;wrap.classList.toggle('has-val',!!curQ);renderRecipes();
});
$('#clr').onclick=()=>{search.value='';curQ='';wrap.classList.remove('has-val');renderRecipes();search.focus();};

/* ---- install prompt ---- */
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();deferred=e;
  if(!sessionStorage.getItem('crema-install-x'))$('#install').classList.add('show');
});
$('#install-go').onclick=async()=>{
  $('#install').classList.remove('show');
  if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;}
};
$('#install-x').onclick=()=>{$('#install').classList.remove('show');try{sessionStorage.setItem('crema-install-x','1');}catch(e){}};
window.addEventListener('appinstalled',()=>$('#install').classList.remove('show'));

/* ---- boot ---- */
renderChips();renderRecipes();route();
})();
