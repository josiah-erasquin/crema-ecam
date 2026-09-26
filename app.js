/* Crema app logic — view routing, search, filtering, step check-off, install. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const byId=(arr,id)=>arr.find(x=>x.id===id);
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---- order tray (per-device, persisted) ---- */
let ORDER=[], ORDER_NAME='', orderOpen=null;
try{ORDER=JSON.parse(localStorage.getItem('crema-order')||'[]');}catch(e){ORDER=[];}
try{ORDER_NAME=localStorage.getItem('crema-order-name')||'';}catch(e){}
function saveOrder(){try{localStorage.setItem('crema-order',JSON.stringify(ORDER));localStorage.setItem('crema-order-name',ORDER_NAME);}catch(e){}}
function updateBadge(){const b=document.getElementById('order-badge');if(!b)return;if(ORDER.length){b.hidden=false;b.textContent=ORDER.length;}else{b.hidden=true;b.textContent='';}}
function toast(msg){const t=el('div','toast',msg);document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300);},2400);}
function orderText(){
  const who=ORDER_NAME.trim();
  const lines=ORDER.map(o=>`• ${o.name} (${o.size})${o.note?` — ${o.note}`:''}`);
  return `Coffee order${who?` for ${who}`:''}:\n`+lines.join('\n');
}
const PUSH=(window.CREMA_PUSH||{});
const NTFY_TOPIC=(PUSH.ntfy||'').trim();
const NTFY_URL=NTFY_TOPIC?('https://ntfy.sh/'+encodeURIComponent(NTFY_TOPIC)):'';

const asciiFold=s=>s.normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^\x20-\x7E]/g,'').trim();
const recipeBase=()=>location.origin+location.pathname.replace(/[^/]*$/,'');
async function sendOrder(){
  if(!ORDER.length)return;
  const text=orderText();
  if(NTFY_URL){
    // ONE readable line as the message (no newlines -> never a .txt attachment).
    // Header values must be ASCII: name goes in the body, action labels are ascii-folded.
    const who=ORDER_NAME.trim();
    const line=(who?who+': ':'')+ORDER.map(o=>`${o.name} (${o.size})${o.note?', '+o.note:''}`).join('; ');
    const base=recipeBase();
    const seen=new Set(), acts=[];
    for(const o of ORDER){
      if(seen.has(o.id))continue; seen.add(o.id);
      acts.push(`view, ${asciiFold('Make '+o.name)}, ${base}#r/${o.id}`);
      if(acts.length===3)break; // ntfy allows up to 3 action buttons
    }
    const headers={'Title':'New coffee order','Tags':'coffee','Priority':'high','Click':base+'#r/'+ORDER[0].id};
    if(acts.length) headers['Actions']=acts.join('; ');
    try{
      const r=await fetch(NTFY_URL,{method:'POST',headers,body:line});
      if(r.ok){toast('Order sent ✓');ORDER=[];saveOrder();updateBadge();renderOrder();return;}
    }catch(e){/* fall back to share/copy below */}
  }
  if(navigator.share){
    try{await navigator.share({title:'Coffee order',text});return;}
    catch(e){if(e&&e.name==='AbortError')return;}
  }
  try{await navigator.clipboard.writeText(text);toast('Order copied — paste it to send.');}
  catch(e){window.prompt('Copy your order:',text);}
}
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
/* Exact 8/10 oz steps from the official volumes: coffee ml comes from the dial setting,
   milk/water = fill target − coffee. Fill target sits ~1 cm under the rim. */
const TARGET={s8:220,s10:280}, MUGOZ={s8:8,s10:10};
const isCap=p=>p.fam==='cap'||p.fam==='iced-cap';   // one cappuccino press + optional extra shot
const brewsOf=(p,size)=>isCap(p)?(p[size].plus?[p[size].plus]:[]):Array.isArray(p[size][0])?p[size]:[p[size]];
const coffeeMl=bs=>bs.reduce((a,b)=>a+ML[b[0]]*(b[2]||1),0);
const sizeCoffee=(p,size)=>!p[size]?0:coffeeMl(brewsOf(p,size))+(isCap(p)?CAPML.coffee:0);
const sizeBase=(p,size)=>!p[size]?'Milk only':
  [...(isCap(p)?[`Cappuccino button · ${TSHORT[p[size].taste]}`]:[]),...brewsOf(p,size).map(b=>spec(...b))].join(' + ');
function mugFrac(ml,cap){const r=ml/(cap*29.57);
  return r<0.3?'a quarter':r<0.42?'a third':r<0.58?'half':r<0.71?'two-thirds':'three-quarters';}
function fillCarafe(p,ml){const n=Math.ceil(ml/100)+1;
  return `Fill the milk carafe with ${p.half?'half-and-half':'milk'} to at least mark <b>${n}</b> (${n*100} ml — each mark is 100 ml; not above <code>MAX</code>). Push it on until it beeps. Set the froth dial to ${FROTH[p.froth]}.`;}
function sizeSteps(p,size){
  const T=TARGET[size], cap=MUGOZ[size];
  const bs=p[size]?brewsOf(p,size):[], C=sizeCoffee(p,size), R=T-C;
  const coffee=bs.map((b,i)=>(i?'Leave the mug in place. ':'')+brew(...b));
  const press=p[size]&&isCap(p)?`Press the aroma button until <b>${TASTE[p[size].taste]}</b> shows. Press <b>cappuccino</b> once. It adds ≈${CAPML.milk} ml of milk, then ≈${CAPML.coffee} ml (${oz(CAPML.coffee)} oz) of coffee.`:'';
  const plus=bs.length?'Leave the mug in place. '+brew(...bs[0])+' This extra shot keeps the bigger mug strong.':null;
  const full=`≈${T} ml (${oz(T)} oz) — about 1 cm below the rim`;
  const EARLY='If the milk stops early, press <b>cappuccino</b> twice again.';
  const CLEAN='Turn the froth dial to <code>CLEAN</code> and let the auto-clean run.';
  const milkTo=stop=>`Press <b>cappuccino</b> twice for milk only. Press <b>cappuccino</b> once to stop ${stop}. ${EARLY}`;
  switch(p.fam){
    case 'milk': return [p.pre, `Put the ${cap} oz mug under the spouts.`, ...coffee, p.afterShot, fillCarafe(p,R),
      milkTo(`when the mug holds ${full}. That is ≈${R} ml (${oz(R)} oz) of ${p.milk}`), p.tail, CLEAN].filter(Boolean);
    case 'cap':{ const pre=R-CAPML.milk;   // extra milk before the one cappuccino press
      return [p.pre, fillCarafe(p,R),
      `Put the ${cap} oz mug under the coffee spouts and the milk spout. `+milkTo(`at ≈${pre} ml (${oz(pre)} oz) of ${p.milk} — the mug about ${mugFrac(pre,cap)} full`),
      'Leave the mug in place. '+press, plus,
      `The mug now holds ${full}: ≈${R} ml (${oz(R)} oz) of ${p.milk} and ≈${C} ml (${oz(C)} oz) of coffee.`, p.tail, CLEAN].filter(Boolean);}
    case 'iced-cap': return [fillCarafe(p,CAPML.milk), `Fill ${cap===8?"an":"a"} ${cap} oz glass with ice.`,
      'Put a cup under the coffee spouts and the milk spout. '+press, plus&&plus.replace(/mug/g,'drink'), 'Pour it over the ice.', CLEAN].filter(Boolean);
    case 'chocolate': return [p.pre, fillCarafe(p,T),
      `Put the ${cap} oz mug under the milk spout. `+milkTo(`when the mug holds ${full}`), 'Stir well. '+CLEAN];
    case 'water': return [`Put the ${cap} oz mug under the spouts.`, ...coffee,
      R>=20 ? `Fit the hot water spout. Press <b>hot water</b>. Press it again to stop when the mug holds ${full}. That is ≈${R} ml (${oz(R)} oz) of water.`
            : `The mug now holds ${full}. No water needed.`];
    case 'iced-milk': return [
      ...(p.shake ? [`Put a cup under both spouts.`, ...coffee, 'Pour it into a shaker or jar with ice and 1–2 tsp sugar. Shake hard until frothy.', `Strain it into ${cap===8?"an":"a"} ${cap} oz glass full of fresh ice.`]
                  : [`Fill ${cap===8?"an":"a"} ${cap} oz glass with ice. Put it under the spouts.`, ...coffee]),
      ...(p.carafe ? [fillCarafe(p,R), 'Put the glass under the milk spout. '+milkTo('when the foam is about 1 cm below the rim'), CLEAN]
                   : [`Top with ${p.milk} to about 1 cm below the rim.`])];
    case 'iced-water': return p.first
      ? [`Fill ${cap===8?"an":"a"} ${cap} oz glass with ice. Add ${p.cold} to about half the glass.`, 'Put the glass under the spouts. '+coffee[0], `The coffee floats on the ${p.cold}. Do not stir.`]
      : [`Fill ${cap===8?"an":"a"} ${cap} oz glass with ice. Put it under the spouts.`, ...coffee, `Add ${p.cold} to about 1 cm below the rim.`];
    default: return [];
  }
}
function renderDetail(item,kind){
  const host=$('#detail');host.innerHTML='';
  const wrap=el('div','detail');
  let selSize='Standard';
  const desc = (kind==='r'&&item.orig) ? `<b>${item.orig}.</b> ${item.desc}` : item.desc;
  const nc=el('div','namecard');
  nc.innerHTML=`<h1>${item.name||item.title}</h1><p>${desc}</p>`;
  if(kind==='r')nc.insertAdjacentHTML('beforeend',
    `<div class="dspec"><div class="cell"><div class="k">Base</div><div class="v" id="dbase">${item.base}</div></div>`
    +`<div class="cell"><div class="k">Froth</div><div class="v">${item.froth}</div></div>`
    +`<div class="cell"><div class="k">Milk</div><div class="v acc" id="dmilk">${item.milk}</div></div></div>`);
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
      item.size.fam==='water'
        ? 'Scaled with the hot water function.'
        : 'Scaled with the right coffee setting and more milk — never water.');
    [['std','Standard'],['s8','8 oz'],['s10','10 oz']].forEach(([k,label])=>{
      const b=el('button','seg-btn'+(k==='std'?' on':''),label);
      b.setAttribute('aria-pressed',k==='std'?'true':'false');
      b.onclick=()=>{
        seg.querySelectorAll('.seg-btn').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false');});
        b.classList.add('on');b.setAttribute('aria-pressed','true');
        selSize=label;
        paint(k==='std'?item.steps:sizeSteps(item.size,k));
        const db=$('#dbase'); if(db) db.innerHTML=k==='std'?item.base:sizeBase(item.size,k);
        const dm=$('#dmilk'), p=item.size;
        if(dm) dm.innerHTML=(k==='std'||!/^(milk|cap|chocolate)$/.test(p.fam))?item.milk
          :(r=>`≈${r} ml (${oz(r)} oz)`)(TARGET[k]-sizeCoffee(p,k));
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
  if(kind==='r'){
    const ob=el('div','block addorder','<h3>Order this</h3>');
    const note=el('textarea','note-in');note.rows=2;note.placeholder='Notes — milk type, sugar, decaf, extra hot…';
    const btn=el('button','btn btn-accent');
    btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Add to order';
    const ok=el('div','added');
    ok.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg> Added to your order';
    btn.onclick=()=>{
      ORDER.push({id:item.id,name:item.name,size:selSize,note:note.value.trim()});
      saveOrder();updateBadge();note.value='';
      ok.classList.add('show');setTimeout(()=>ok.classList.remove('show'),2400);
    };
    ob.appendChild(note);ob.appendChild(btn);ob.appendChild(ok);
    wrap.appendChild(ob);
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

/* ---- order tab ---- */
function orderSummary(host){
  host.appendChild(el('div','sec',`<h2>Your order</h2><span class="rule"></span><span class="count">${ORDER.length}</span>`));
  const nameIn=el('input','namefield');nameIn.type='text';nameIn.placeholder='Who’s ordering? (name)';nameIn.value=ORDER_NAME;nameIn.setAttribute('aria-label','Your name');
  nameIn.oninput=()=>{ORDER_NAME=nameIn.value;saveOrder();};
  host.appendChild(nameIn);
  const tray=el('div','tray');
  ORDER.forEach((o,i)=>{
    const line=el('div','line');
    line.innerHTML=`<div class="m"><div class="t">${o.name}</div><div class="s">${o.size}</div>${o.note?`<div class="n">${esc(o.note)}</div>`:''}</div>`;
    const rm=el('button','rm');rm.setAttribute('aria-label',`Remove ${o.name}`);
    rm.innerHTML='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    rm.onclick=()=>{ORDER.splice(i,1);saveOrder();updateBadge();renderOrder();};
    line.appendChild(rm);tray.appendChild(line);
  });
  host.appendChild(tray);
  const bar=el('div','orderbar');
  const send=el('button','btn btn-primary');
  send.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-7-7 16-2.5-6.5z"/></svg> Send order';
  send.onclick=sendOrder;
  const clear=el('button','btn btn-ghost','Clear order');
  clear.onclick=()=>{ORDER=[];orderOpen=null;saveOrder();updateBadge();renderOrder();};
  bar.appendChild(send);bar.appendChild(clear);
  host.appendChild(bar);
  host.appendChild(el('div','note', NTFY_URL
    ? 'Sending delivers your order to the barista and pings their phone.'
    : 'Sending opens your phone’s share sheet — pick a chat or email to send this order.'));
}
function menuRow(r){
  const open=orderOpen===r.id;
  const row=el('div','mrow'+(open?' open':''));
  const head=el('button','mrow-head');
  head.innerHTML=`<div class="m"><div class="t">${r.name}${r.orig?` <span class="og">${r.orig}</span>`:''}</div><div class="d">${r.menu}</div></div><span class="add">${open?'Close':'Add'}</span>`;
  head.onclick=()=>{orderOpen=open?null:r.id;renderOrder();};
  row.appendChild(head);
  if(open){
    const panel=el('div','mrow-panel');
    let chosen='Standard';
    if(r.size){
      panel.appendChild(el('div','lbl','Mug size'));
      const chips=el('div','szchips');
      ['Standard','8 oz','10 oz'].forEach(label=>{
        const c=el('button','szchip'+(label==='Standard'?' on':''),label);
        c.onclick=()=>{chips.querySelectorAll('.szchip').forEach(x=>x.classList.remove('on'));c.classList.add('on');chosen=label;};
        chips.appendChild(c);
      });
      panel.appendChild(chips);
    }
    const note=el('textarea','note-in');note.rows=2;note.placeholder='Notes — milk type, sugar, extra hot…';
    panel.appendChild(note);
    const add=el('button','btn btn-accent');add.style.marginTop='11px';
    add.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Add to order';
    add.onclick=()=>{ORDER.push({id:r.id,name:r.name,size:chosen,note:note.value.trim()});saveOrder();updateBadge();orderOpen=null;renderOrder();toast('Added to your order');};
    panel.appendChild(add);
    row.appendChild(panel);
  }
  return row;
}
function renderOrder(){
  const host=$('#order-body');host.innerHTML='';
  if(ORDER.length) orderSummary(host);
  host.appendChild(el('div','sec',`<h2>Menu</h2><span class="rule"></span><span class="count">${RECIPES.length}</span>`));
  host.appendChild(el('div','note','Tap a drink to choose the size, add a note, and put it in your order.'));
  ['milk','black','iced'].forEach(c=>{
    host.appendChild(el('div','subsec',CATLABEL[c]));
    RECIPES.filter(r=>r.cats.includes(c)).forEach(r=>host.appendChild(menuRow(r)));
  });
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
    else if(v==='order'){renderOrder();document.body.dataset.view='order';setTab('order');}
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
renderChips();renderRecipes();updateBadge();route();
})();
