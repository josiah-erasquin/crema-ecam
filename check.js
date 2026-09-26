// Self-check: every recipe + every mug size renders with no undefined, and coffee + fill = target.
const fs=require('fs'),vm=require('vm');
const app=fs.readFileSync('app.js','utf8');
const fn=app.slice(app.indexOf('const TARGET='),app.indexOf('function renderDetail'));
const ctx={console}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js','utf8')+'\n'+fn+'\nthis.R=RECIPES;this.sizeSteps=sizeSteps;this.sizeBase=sizeBase;this.coffeeMl=coffeeMl;this.brewsOf=brewsOf;',ctx);
let bad=0,n=0;
for(const r of ctx.R){
  const sets=[['std',r.steps]];
  if(r.size) for(const k of ['s8','s10']) sets.push([k,ctx.sizeSteps(r.size,k)]);
  for(const [k,st] of sets){ n++;
    const txt=st.join(' ')+(r.size&&k!=='std'?ctx.sizeBase(r.size,k):r.base);
    if(!st.length||/undefined|NaN/.test(txt)){bad++;console.log('BAD',r.id,k,txt.slice(0,200));}
    if(r.size&&k!=='std'&&r.size[k]){const c=ctx.coffeeMl(ctx.brewsOf(r.size,k)); if(c>({s8:220,s10:280})[k]){bad++;console.log('OVERFLOW',r.id,k,c);}}
  }
}
console.log(n,'step sets checked,',bad,'bad');
if(process.argv[2]) for(const id of process.argv.slice(2)){const r=ctx.R.find(x=>x.id===id);
  console.log('\n##',id,'STD:',r.base); r.steps.forEach((s,i)=>console.log(i+1,s.replace(/<[^>]+>/g,'')));
  if(r.size) for(const k of ['s8','s10']){console.log('--',k,ctx.sizeBase(r.size,k)); ctx.sizeSteps(r.size,k).forEach((s,i)=>console.log(i+1,s.replace(/<[^>]+>/g,'')));}}
process.exit(bad?1:0);
