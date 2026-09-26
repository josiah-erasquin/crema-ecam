/* Crema — content distilled from the delonghi-ecam knowledge base (27 YouTube videos,
   incl. official De'Longhi how-to clips). Official = machine instruction. Tip = barista opinion. */

const CATS = [
  {id:'all',   label:'All'},
  {id:'milk',  label:'Milk'},
  {id:'black', label:'Black'},
  {id:'iced',  label:'Iced'},
];

/* Machine facts — official ECAM 23.460.S manual (sections 10–12).
   Size dial (ml in cup): Short ≈40 · Standard ≈60 · Long ≈90 · Extra long ≈120 · My Coffee 20–180 (30 default).
   Aroma button: 5 tastes. 2-cup = two portions; with one cup under both spouts you get double.
   Cappuccino: 1 press = milk, then coffee. 2 presses = milk only (1 press stops it).
   Hold cappuccino (or a coffee button) within 3 s after delivery = add more. Hot water ≈250 ml, press again to stop. */
const ML    = {short:40, standard:60, long:90, xlong:120};
const DIAL  = {short:'Short', standard:'Standard', long:'Long', xlong:'Extra long'};
const TASTE = {xmild:'Extra-mild', mild:'Mild', std:'Standard', strong:'Strong', xstrong:'Extra-strong'};
const TSHORT= {xmild:'X-mild', mild:'Mild', std:'Std', strong:'Strong', xstrong:'X-strong'};
const FROTH = {hot:'<b>HOT MILK</b> (no froth)', min:'<b>Min</b> froth', lowmid:'between <b>Min</b> and the middle',
               mid:'the middle (about 12 o’clock)', max:'<b>Max</b> froth'};
const oz = ml => String(Math.round(ml/29.57*2)/2);   // nearest half ounce
function brew(s,t,n){
  n=n||1; const v=ML[s]*n;
  return `Turn the size dial to <b>${DIAL[s]}</b>. Press the aroma button until <b>${TASTE[t]}</b> shows. `
    + `Press <b>${n}-cup</b>${n===2?' (one cup under both spouts)':''}. You get ≈${v} ml (${oz(v)} oz) of coffee.`;
}
const spec  = (s,t,n) => `${DIAL[s]} · ${TSHORT[t]} · ${n||1}-cup`;
const FIT   = f => `Fill the milk carafe (not above <code>MAX</code>), push it onto the nozzle until it beeps, and set the froth dial to ${FROTH[f]}.`;
const MILK  = stop => `Press <b>cappuccino</b> twice for milk only. Press <b>cappuccino</b> once to stop ${stop}.`;
const AROMA = t => `Press the aroma button until <b>${TASTE[t]}</b> shows. (The size dial does not change the cappuccino button — it uses its saved amounts.)`;
/* Cappuccino button default, measured by Jo on this machine (the manual gives no number): ≈60 ml milk, then ≈60 ml coffee. */
const CAPML = {milk:60, coffee:60};
const CAP1  = 'Press <b>cappuccino</b> once. The machine delivers ≈60 ml of milk first, then ≈60 ml (2 oz) of coffee — ≈120 ml (4 oz) in the cup.';
const MORE  = {kind:'official', text:'To add more milk or coffee at the end, press and hold <b>cappuccino</b> within 3 seconds.'};
const PROG  = {kind:'official', text:'Save your own cappuccino amounts: hold <b>cappuccino</b> until “PROGRAM MILK” shows, release, and press it at the milk level you want. The coffee starts — press again at the coffee level you want.'};
const CLEAN_TIP = {kind:'official', text:'After the last milk drink, turn the froth dial to <code>CLEAN</code> and let the auto-clean run, then wipe the nozzle.'};

const RECIPES = [
  /* ---------------- BLACK ---------------- */
  {id:'espresso', name:'Espresso', cats:['black'],
   desc:'A single strong shot with a golden crema.',
   base:spec('short','xstrong'), froth:'—', milk:'—',
   steps:[
     'Put an espresso cup under the spouts. Lower the spouts close to the cup — this makes a creamier shot.',
     brew('short','xstrong',1),
     'Look for a golden crema.'],
   tips:[{kind:'tip', text:'For more crema, grind finer (dial <b>2–3</b>) and use beans roasted for espresso.'}],
   source:{title:'Coffee from beans — De’Longhi How-To', url:'https://www.youtube.com/watch?v=9sQiGxZAcIY'}},

  {id:'doppio', name:'Doppio (double)', cats:['black'],
   desc:'A double espresso — twice the coffee, same cup.',
   base:spec('short','xstrong',2), froth:'—', milk:'—',
   steps:['Put one espresso cup under both spouts.', brew('short','xstrong',2)]},

  {id:'lungo', name:'Lungo / Long black', cats:['black'],
   desc:'A longer, milder black coffee.',
   base:spec('long','strong'), froth:'—', milk:'—',
   steps:['Put a cup under the spouts.', brew('long','strong',1)],
   tips:[{kind:'tip', text:'Want it longer? <b>Extra long</b> gives ≈120 ml (4 oz). For a bigger cup that is not bitter, use <b>2-cup</b> instead of stretching one puck.'}]},

  {id:'americano', name:'Americano', cats:['black'],
   desc:'Espresso loosened with hot water.',
   base:spec('short','xstrong')+' + water', froth:'—', milk:'—',
   steps:[
     'Put a mug under the spouts.',
     brew('short','xstrong',1),
     'Fit the hot water spout. Press <b>hot water</b>. Press it again to stop at ≈160 ml (5.5 oz) in the mug — about three parts water to one part coffee.'],
   tips:[{kind:'official', text:'If you do not stop it, <b>hot water</b> gives ≈250 ml (8.5 oz).'},
         {kind:'tip', text:'For more crema on top, run the hot water first, then brew the coffee onto it.'}]},

  {id:'ristretto', name:'Ristretto', cats:['black'],
   desc:'A very short, concentrated shot.',
   base:'My Coffee · 20 ml · X-strong', froth:'—', milk:'—',
   steps:[
     'One time only: turn the size dial to <b>My Coffee</b>. Hold <b>1-cup</b> until “1 MY COFFEE Program quantity” shows, then release.',
     'Press <b>1-cup</b> again when the cup holds ≈20 ml (0.5 oz). The machine saves it.',
     'To make a ristretto: turn the size dial to <b>My Coffee</b>, press the aroma button until <b>Extra-strong</b> shows, then press <b>1-cup</b>.'],
   tips:[{kind:'official', text:'My Coffee goes from ≈20 to ≈180 ml. Saving a ristretto replaces your old My Coffee.'}]},

  {id:'con-panna', name:'Espresso con panna', cats:['black'],
   desc:'Espresso crowned with whipped cream.',
   base:spec('short','xstrong'), froth:'—', milk:'Whipped cream',
   steps:['Put an espresso cup under the spouts.', brew('short','xstrong',1), 'Top with a spoon of whipped cream.']},

  {id:'vienna', name:'Vienna coffee', cats:['black'],
   desc:'Long coffee under a cap of whipped cream.',
   base:spec('xlong','strong'), froth:'—', milk:'Whipped cream',
   steps:['Put a cup under the spouts.', brew('xlong','strong',1), 'Top with whipped cream. Do not stir.']},

  {id:'bombon', name:'Café bombón', cats:['black'],
   desc:'Espresso layered over condensed milk.',
   base:spec('short','xstrong'), froth:'—', milk:'Condensed',
   steps:[
     'Put ≈40 ml (about 2 tbsp) sweetened <b>condensed milk</b> in a small clear glass.',
     'Put the glass under the spouts. '+brew('short','xstrong',1),
     'The coffee sits on top of the condensed milk in two layers. Stir before you drink.']},

  {id:'redeye', name:'Red eye', cats:['black'],
   desc:'Long coffee spiked with an extra shot.',
   base:'X-long + Short shot', froth:'—', milk:'—',
   steps:[
     'Put a mug under the spouts.',
     brew('xlong','strong',1),
     'Leave the mug in place. '+brew('short','xstrong',1),
     'The mug holds ≈160 ml (5.5 oz).']},

  {id:'cubano', name:'Café Cubano', cats:['black'],
   desc:'Espresso whipped to a sweet foam (espuma).',
   base:spec('short','xstrong'), froth:'—', milk:'Sugar espuma',
   steps:[
     'Put 1–2 tsp <b>sugar</b> in a small jug. Keep an espresso cup next to it.',
     'Turn the size dial to <b>Short</b>. Press the aroma button until <b>Extra-strong</b> shows.',
     'Put the jug under the spouts and press <b>1-cup</b>. After the first few drops (about 2 seconds), swap the espresso cup in for the rest of the shot.',
     'Whip the sugar and drops into a pale foam. Spoon it onto the espresso.']},

  /* ---------------- MILK ---------------- */
  {id:'cappuccino', name:'Cappuccino', cats:['milk'],
   desc:'Equal parts espresso, milk, and a thick foam cap.',
   base:'Cappuccino button · Strong', froth:'Max', milk:'≈60 ml, then coffee',
   steps:[
     FIT('max'),
     AROMA('strong'),
     'Put a 5 oz cup under the coffee spouts and the milk spout. Pull the milk spout down close to the cup.',
     CAP1],
   tips:[MORE, PROG, CLEAN_TIP],
   source:{title:'Cappuccino & milk drinks — De’Longhi How-To', url:'https://www.youtube.com/watch?v=JukCkpAPrdQ'}},

  {id:'latte', name:'Caffè latte', cats:['milk'],
   desc:'Espresso with a lot of milk and a thin foam.',
   base:spec('short','xstrong'), froth:'Min', milk:'Fill the glass',
   steps:[
     'Put a large glass under the spouts.',
     brew('short','xstrong',1),
     FIT('min'),
     MILK('when the glass is about 1 cm below the rim')+' If the milk stops early, press twice again.'],
   tips:[CLEAN_TIP]},

  {id:'latte-macchiato', name:'Latte macchiato', cats:['milk'],
   desc:'Layered: milk first, espresso poured through.',
   base:'Cappuccino button · Strong', froth:'Max', milk:'≈60 ml, then coffee',
   steps:[
     FIT('max'),
     AROMA('strong'),
     'Put a tall glass under the coffee spouts and the milk spout.',
     CAP1+' The coffee runs down through the milk and makes the layers.'],
   tips:[MORE, CLEAN_TIP],
   source:{title:'Latte macchiato & cleaning', url:'https://www.youtube.com/watch?v=MQabwi857PQ'}},

  {id:'flat-white', name:'Flat white', cats:['milk'],
   desc:'A strong double espresso under a thin, smooth milk.',
   base:spec('short','xstrong',2), froth:'Min', milk:'≈80 ml, thin foam',
   steps:[
     'Put a 5–6 oz cup under both spouts.',
     brew('short','xstrong',2),
     FIT('min'),
     MILK('when the cup holds ≈160 ml (5.5 oz) — about 1 cm below the rim')],
   tips:[{kind:'tip', text:'Keep the milk low — a flat white has less milk and foam than a latte.'}, CLEAN_TIP]},

  {id:'espresso-macchiato', name:'Espresso macchiato', cats:['milk'],
   desc:'Espresso “stained” with a little foam.',
   base:spec('short','xstrong'), froth:'Max', milk:'A spoon of foam',
   steps:[
     'Put an espresso cup under the spouts.',
     brew('short','xstrong',1),
     FIT('max'),
     MILK('after about one spoon of foam lands on the coffee (1–2 seconds)')],
   tips:[CLEAN_TIP]},

  {id:'cortado', name:'Cortado', cats:['milk'],
   desc:'Espresso cut with an equal amount of flat milk.',
   base:spec('short','xstrong'), froth:'Min', milk:'Equal (~1:1)',
   steps:[
     'Put a small (4 oz) glass under the spouts.',
     brew('short','xstrong',1),
     FIT('min'),
     MILK('when the glass holds ≈80 ml (2.5 oz) — milk equal to the coffee')],
   tips:[{kind:'tip', text:'Smaller than a flat white, with almost no foam.'}, CLEAN_TIP]},

  {id:'cafe-au-lait', name:'Café au lait', cats:['milk'],
   desc:'Long, mild coffee with equal warm milk.',
   base:spec('xlong','std'), froth:'Hot milk', milk:'Equal (~1:1)',
   steps:[
     'Put a large cup or bowl under the spouts.',
     brew('xlong','std',1),
     FIT('hot'),
     MILK('when the cup holds ≈240 ml (8 oz) — milk equal to the coffee')],
   tips:[{kind:'tip', text:'The one milk drink built on long coffee, not espresso.'}, CLEAN_TIP]},

  {id:'breve', name:'Breve', cats:['milk'],
   desc:'A latte made with half-and-half for a richer body.',
   base:spec('short','strong',2), froth:'Min', milk:'Half-and-half',
   steps:[
     'Fill the carafe with <b>half-and-half</b> instead of milk (not above <code>MAX</code>). Push it on until it beeps. Set the froth dial to '+FROTH.min+'.',
     'Put a large glass under both spouts.',
     brew('short','strong',2),
     MILK('when the glass is about 1 cm below the rim')+' If it stops early, press twice again.'],
   tips:[CLEAN_TIP]},

  {id:'cafe-con-leche', name:'Café con leche', cats:['milk'],
   desc:'Strong coffee with a lot of hot milk.',
   base:spec('short','xstrong'), froth:'Hot milk', milk:'~2 parts',
   steps:[
     'Put a cup under the spouts.',
     brew('short','xstrong',1),
     FIT('hot'),
     MILK('when the cup holds ≈120 ml (4 oz) — about two parts milk to one part coffee'),
     'Add sugar to taste and stir.'],
   tips:[CLEAN_TIP]},

  {id:'galao', name:'Galão', orig:'Portuguese', cats:['milk'],
   desc:'A tall, very milky coffee — one shot to three milk.',
   base:spec('short','strong'), froth:'Min–mid', milk:'~3 parts',
   steps:[
     'Put a tall glass under the spouts.',
     brew('short','strong',1),
     FIT('lowmid'),
     MILK('when the glass holds ≈160 ml (5.5 oz) — three parts milk to one part coffee')],
   tips:[CLEAN_TIP]},

  {id:'cortadito', name:'Cortadito', orig:'Cuban', cats:['milk'],
   desc:'A cortado with sugar for a sweet foam.',
   base:spec('short','xstrong'), froth:'Min', milk:'Equal (~1:1)',
   steps:[
     'Put 1–2 tsp <b>sugar</b> in a small glass and put it under the spouts.',
     brew('short','xstrong',1)+' Stir.',
     FIT('min'),
     MILK('when the glass holds ≈80 ml (2.5 oz) — milk equal to the coffee')],
   tips:[CLEAN_TIP]},

  {id:'wiener-melange', name:'Wiener Melange', orig:'Viennese', cats:['milk'],
   desc:'A lighter cappuccino — mild coffee, steamed milk, foam.',
   base:spec('standard','mild'), froth:'Middle', milk:'Equal + foam',
   steps:[
     'Put a cup under the spouts.',
     brew('standard','mild',1),
     FIT('mid'),
     MILK('when the cup holds ≈140 ml (4.5 oz) — milk and a foam cap about equal to the coffee')],
   tips:[CLEAN_TIP]},

  {id:'mocha', name:'Mocha latte', cats:['milk'],
   desc:'A latte with chocolate stirred through.',
   base:'Cappuccino button · X-strong', froth:'Min', milk:'≈60 ml, then coffee',
   steps:[
     'In the cup, mix 1–2 tsp <b>cocoa</b> (or chocolate syrup) + sugar + a splash of hot water into a paste.',
     FIT('min'),
     AROMA('xstrong'),
     'Put the cup under the coffee spouts and the milk spout. '+CAP1,
     'Stir well.'],
   tips:[MORE, CLEAN_TIP]},

  {id:'marocchino', name:'Marocchino', cats:['milk'],
   desc:'A small mocha-macchiato: espresso, cocoa, foam.',
   base:spec('short','xstrong'), froth:'Max', milk:'A spoon of foam',
   steps:[
     'Dust <b>cocoa</b> into a small glass and put it under the spouts.',
     brew('short','xstrong',1),
     FIT('max'),
     MILK('after a spoon of foam lands on top (1–2 seconds)'),
     'Dust a little cocoa on top.'],
   tips:[CLEAN_TIP]},

  {id:'hot-chocolate', name:'Hot chocolate', cats:['milk'],
   desc:'Frothed milk over a cocoa paste — no coffee.',
   base:'Milk only', froth:'Middle', milk:'Fill the cup',
   steps:[
     'Mix <b>cocoa</b> + sugar + a little milk into a paste in the mug.',
     FIT('mid'),
     'Put the mug under the milk spout. '+MILK('when the mug is about 1 cm below the rim')+' If it stops early, press twice again.',
     'Stir well.'],
   tips:[CLEAN_TIP]},

  /* ---------------- ICED ---------------- */
  {id:'iced-americano', name:'Iced americano', cats:['iced'],
   desc:'Ice, cold water, and a double shot on top.',
   base:spec('short','xstrong',2), froth:'—', milk:'—',
   steps:[
     'Fill a glass with <b>ice</b> and put it under both spouts.',
     brew('short','xstrong',2),
     'Add cold water to about 1 cm below the rim.']},

  {id:'iced-latte', name:'Iced latte', cats:['iced'],
   desc:'Espresso over ice with cold milk.',
   base:spec('short','xstrong',2), froth:'—', milk:'Cold, poured',
   steps:[
     'Fill a glass with <b>ice</b> and put it under both spouts.',
     brew('short','xstrong',2),
     'Top with cold milk to about 1 cm below the rim.'],
   tips:[{kind:'tip', text:'Add syrup for an <b>iced mocha</b> or <b>iced caramel latte</b>.'}]},

  {id:'affogato', name:'Affogato', cats:['iced'],
   desc:'A hot shot poured over cold ice cream.',
   base:spec('short','xstrong'), froth:'—', milk:'Vanilla ice cream',
   steps:[
     'Put a scoop of vanilla ice cream in a glass and put it under the spouts.',
     brew('short','xstrong',1)]},

  {id:'iced-cappuccino', name:'Iced cappuccino', cats:['iced'],
   desc:'A cappuccino, poured over ice.',
   base:'Cappuccino button · X-strong', froth:'Max', milk:'Over ice',
   steps:[
     FIT('max'),
     AROMA('xstrong'),
     'Put a cup under the coffee spouts and the milk spout. '+CAP1,
     'Pour it over a glass full of ice.'],
   tips:[CLEAN_TIP]},

  {id:'freddo-espresso', name:'Freddo espresso', orig:'Greek', cats:['iced'],
   desc:'A cold, frothy shaken espresso.',
   base:spec('short','xstrong',2), froth:'—', milk:'—',
   steps:[
     'Put a cup under both spouts.',
     brew('short','xstrong',2),
     'Pour it into a shaker or jar with ice and 1–2 tsp sugar. Shake hard until frothy.',
     'Strain it over fresh ice.'],
   tips:[{kind:'tip', text:'No blender needed.'}]},

  {id:'freddo-cappuccino', name:'Freddo cappuccino', orig:'Greek', cats:['iced'],
   desc:'A freddo espresso under milk foam.',
   base:spec('short','xstrong',2), froth:'Max', milk:'Foam, over ice',
   steps:[
     'Make a <b>Freddo espresso</b> (Short · Extra-strong · 2-cup, shaken with ice) and strain it over fresh ice.',
     FIT('max'),
     'Put the glass under the milk spout. '+MILK('when the foam is about 1 cm below the rim')],
   tips:[CLEAN_TIP]},

  {id:'espresso-tonic', name:'Espresso tonic', cats:['iced'],
   desc:'Espresso over iced tonic water.',
   base:spec('short','xstrong'), froth:'—', milk:'—',
   steps:[
     'Fill a glass with <b>ice</b>. Add ≈120 ml (4 oz) tonic water.',
     'Put the glass under the spouts. '+brew('short','xstrong',1),
     'The coffee floats on the tonic. Do not stir.']},
];

/* ---------------- HOW-TO ---------------- */
const GUIDE = [
  {id:'setup', title:'First-time setup', icon:'power', desc:'Water, language, first rinse.',
   steps:[
     'Plug in and press the <b>main switch</b> on the side.',
     'When it shows <b>fill tank</b>, fill the tank to <code>MAX</code> and refit it.',
     'Choose the language: when <b>English</b> shows, hold <b>OK</b> a few seconds.',
     'Fit the hot water spout, put a 500 ml container under it, and press <b>hot water</b> to confirm.'],
   tips:[{kind:'official', text:'Set <b>water hardness</b> with the test strip and install the <b>filter</b> (menu). The on-screen prompts do not explain these.'}],
   source:{title:'First-time use — De’Longhi How-To', url:'https://www.youtube.com/watch?v=xGrJXXXpvqw'}},

  {id:'beans', title:'Coffee from beans', icon:'beans', desc:'Fill, size, strength, brew.',
   steps:[
     'Fill the hopper. <b>Do not use oily or caramelised beans</b> — they clog the grinder.',
     'Put one cup (or two) under the spout and lower it close.',
     'Set strength (press dial) and size (turn dial).',
     'Press <b>1-cup</b> or <b>2-cup</b>. Add more within <b>3 seconds</b> by pressing again.'],
   source:{title:'Coffee from beans — De’Longhi How-To', url:'https://www.youtube.com/watch?v=9sQiGxZAcIY'}},

  {id:'preground', title:'Pre-ground coffee', icon:'scoop', desc:'One scoop, one cup.',
   steps:[
     '<b>Never add pre-ground while the machine is off.</b>',
     'Put a cup under the spout.',
     'Press the aroma button until <b>pre-ground</b> shows.',
     'Add <b>one level scoop</b> into the chute, then press <b>1-cup</b>. One cup at a time.'],
   source:{title:'Pre-ground coffee — De’Longhi How-To', url:'https://www.youtube.com/watch?v=1x2mHetoI1A'}},

  {id:'volume', title:'Program cup volume', icon:'gauge', desc:'Change how much comes out.',
   steps:[
     'Hold the button you want to program. Brewing starts and the light flashes.',
     'Release the button.',
     'Press it again when the cup reaches the volume you want. It is saved.'],
   tips:[{kind:'official', text:'Size dial: Short ≈40 · Standard ≈60 · Long ≈90 · Extra long ≈120 ml. Hot water ≈250 ml. Restore them with menu → <b>Default values</b>.'}]},

  {id:'mycoffee', title:'My Coffee', icon:'star', desc:'Save your own drink.',
   steps:[
     'Put a cup under the spout.',
     'Turn the dial to <b>My Coffee</b>.',
     'Hold <b>1-cup</b> until “program quantity” shows and coffee starts.',
     'Release at the level you want, then press <b>1-cup</b> again to save.'],
   source:{title:'Program My Coffee — De’Longhi How-To', url:'https://www.youtube.com/watch?v=GiYcihYBOC8'}},

  {id:'milk', title:'Milk & cappuccino', icon:'milk', desc:'Carafe, froth dial, the two milk modes.',
   steps:[
     'Fill the carafe (not above <code>MAX</code>), seat the intake tube, refit the lid.',
     'Remove the hot water spout and push the carafe on until it beeps.',
     'Froth dial: <b>HOT MILK</b> = no foam, <b>Min</b> = thin foam, <b>Max</b> = thick foam.',
     'One press of <b>cappuccino</b> = milk then coffee. <b>Two presses</b> = milk only (one press stops it).'],
   tips:[MORE, PROG, CLEAN_TIP],
   source:{title:'Cappuccino & milk drinks — De’Longhi How-To', url:'https://www.youtube.com/watch?v=JukCkpAPrdQ'}},

  {id:'froth', title:'Milk froth tips', icon:'wave', desc:'Denser, cleaner foam.',
   steps:[
     'Use <b>skimmed or semi-skimmed</b> milk at fridge temperature (~5 °C) for denser froth.',
     'The milk doubles or triples in volume — pick a big enough container.',
     'Clean the spout after every use, or you get big bubbles.'],
   tips:[{kind:'tip', text:'For latte-art microfoam, set the froth dial near the “12 o’clock” position and pour from a pitcher.'}],
   source:{title:'Steam-froth milk tips — De’Longhi How-To', url:'https://www.youtube.com/watch?v=xuPtOzvI-LQ'}},

  {id:'dialin', title:'Dial in better coffee', icon:'target', desc:'Beans, water, grind, ratio.',
   steps:[
     '<b>Beans:</b> roasted for espresso, rested ~1–2 weeks. Refill the hopper daily, keep the bag sealed.',
     '<b>Water:</b> soft and low-mineral; fit the filter; change the tank daily.',
     '<b>Grind:</b> finer = more extraction. Aim <b>2–3</b>. Turn the dial <b>only while grinding</b>, one notch at a time, then pull ~3 shots.',
     '<b>Ratio:</b> aim about <b>1:3 to 1:4</b> (≈10 g in → 30–40 g out). Extraction ~15–25 s, a thin steady stream.'],
   tips:[{kind:'tip', text:'Expert consensus (European Coffee Trip, Cafelista), not a fixed rule — treat numbers as a start and taste.'}],
   source:{title:'5 tips for better coffee — European Coffee Trip', url:'https://www.youtube.com/watch?v=KDK7RE0WwqM'}},

  {id:'stronger', title:'Stronger coffee', icon:'bolt', desc:'The max-strength setup.',
   steps:[
     'Set the highest heat and <b>max dose</b>.',
     'Grind to <b>1</b> (finest), turning only while the grinder runs.',
     'Reprogram the shot volume <b>down</b> to about <b>30 ml</b>.'],
   tips:[{kind:'tip', text:'A solid 30 ml shot tasted better than a “double ristretto” of two very short shots.'}],
   source:{title:'Stronger coffee, full tutorial — Tyler Martin', url:'https://www.youtube.com/watch?v=ncQIFaSu0dQ'}},

  {id:'hotter', title:'Hotter coffee', icon:'heat', desc:'Get it hotter in the cup.',
   steps:[
     'Press <b>rinse</b> before brewing to heat the internal circuits.',
     'Warm the cups first (hot water or the cup warmer).',
     'Set <b>Set temperature</b> to the highest level in the menu.'],
   tips:[{kind:'tip', text:'Milk-heavy drinks come out cooler; a short microwave blast fixes it.'}],
   source:{title:'Tips for hotter coffee — De’Longhi How-To', url:'https://www.youtube.com/watch?v=jKRtv52Uvqc'}},

  {id:'settings', title:'Settings menu (P)', icon:'sliders', desc:'Every item behind the P button.',
   steps:[
     'Press <b>P</b> to open the menu, turn the dial to move, press <b>hot water</b> to confirm.',
     'Items: Descaling · Install filter · Replace filter · Adjust time · Auto start · Auto off · Energy saving · Set temperature · Water hardness · Set language · Beep · Cup lighting · Default values · Statistics.'],
   source:{title:'Change settings — De’Longhi How-To', url:'https://www.youtube.com/watch?v=Rd6VX51aJCE'}},

  {id:'stats', title:'Statistics', icon:'chart', desc:'What the machine has counted.',
   steps:[
     'Press <b>P</b>, turn to <b>Statistics</b>, press <b>hot water</b>.',
     'Turn the dial to see: coffees made, cappuccinos/milk drinks, litres delivered, descales, filter changes.',
     'Press <b>rinse</b> twice to exit.'],
   source:{title:'View statistics — De’Longhi How-To', url:'https://www.youtube.com/watch?v=HOkh476MvFI'}},
];

/* ---------------- CARE ---------------- */
const CARE = [
  {id:'daily', title:'Daily cleaning', icon:'wave', desc:'The quick everyday routine.',
   steps:[
     'Rinse the coffee spouts with an extra rinse after use.',
     'Empty the grounds container and the drip tray.',
     'Clean the milk carafe (froth dial to <code>CLEAN</code>) after the last milk drink.'],
   tips:[{kind:'official', text:'No solvents, abrasives, alcohol, or metal scrapers. Nothing goes in the dishwasher <b>except</b> the milk carafe.'}]},

  {id:'spouts', title:'Coffee spouts', icon:'drop', desc:'Keep the holes clear.',
   steps:['Wipe the spouts with a sponge or cloth.','Clear blocked holes with a toothpick.'],
   source:{title:'Clean the coffee spouts — De’Longhi How-To', url:'https://www.youtube.com/watch?v=zVhvUOczEKY'}},

  {id:'brewunit', title:'Brew unit — clean & grease', icon:'gear', desc:'Monthly, machine off.',
   steps:[
     'With the machine <b>off</b>, open the side flap. Pinch the two <b>red buttons</b> and pull the brew unit out.',
     'Rinse under running water — no detergent. Work the plunger to rinse inside.',
     'Soak about <b>5 minutes</b>, rinse again, dry.',
     'If the gears squeak, apply <b>food-safe grease</b> to the gears and shaft.',
     'Slide it back until it clicks, close the flap, refit the tank.'],
   source:{title:'Clean & grease the brew group — Tom’s Coffee Corner', url:'https://www.youtube.com/watch?v=JtbWg47q05k'}},

  {id:'descale', title:'Descaling', icon:'flask', desc:'When “descale” flashes (~every 3 months).',
   steps:[
     'Press <b>P</b>, select <b>Descale</b>, confirm with hot water, confirm again to start.',
     'Empty the tank and <b>remove the filter</b>. Empty the drip tray and grounds, then refit them.',
     'Pour descaler to level <code>A</code> (100 ml), add water to level <code>B</code> (1 L). Refit the tank.',
     'Put a <b>1.5 L</b> container under the hot water spout and confirm. It runs ~30 min — avoid the acidic splashes.',
     'When prompted: rinse the tank, fill clean water to <code>MAX</code>, refit the filter, refit the tank.',
     'Empty the container, refit it, press hot water to rinse. Confirm when “rinsing complete” shows.'],
   tips:[{kind:'official', text:'Takes roughly 30–60 minutes. Do not interrupt it once started.'}],
   source:{title:'Descale — De’Longhi How-To', url:'https://www.youtube.com/watch?v=L-QtYvqIsUc'}},

  {id:'descale-dial', title:'Descaling — dial method', icon:'flask', desc:'Older knob-style models.',
   steps:[
     'Add descaler + water to the tank per the pack.',
     'Put a <b>1.5 L</b> jug under the steam wand.',
     'Press and hold the <b>descale</b> button for 5 seconds.',
     'Turn the steam dial half a turn to <b>position 1</b> to release the solution. It cycles ~20–30 min.',
     'Refit clean water and run the rinse the same way.'],
   source:{title:'Descale, dial method — Ritchie Cosmic Prawn', url:'https://www.youtube.com/watch?v=mRxVKb7GGTU'}},

  {id:'reset', title:'Reset to defaults', icon:'reset', desc:'Undo all your settings.',
   steps:[
     'Press <b>P</b>, turn the dial to <b>Default values</b>.',
     'Press <b>hot water</b>, then confirm.',
     'This resets all settings and volumes <b>except the language</b>.'],
   source:{title:'Reset your machine — De’Longhi How-To', url:'https://www.youtube.com/watch?v=9CgeqZvKKsQ'}},
];

/* ---------------- MUG SIZES ----------------
   Each size names the exact coffee setting: [size dial, taste, cups]. A list of settings = brew them in order.
   The app works out the milk / water / fill level from the official volumes (ML) so every
   8 oz and 10 oz version is exact: 8 oz mug → fill to 220 ml (7.5 oz), 10 oz → 280 ml (9.5 oz), ~1 cm under the rim.
   fam: milk = coffee then milk · cap = milk first, coffee through it · chocolate = milk only ·
        water = coffee + hot water · iced-milk / iced-water = over ice. */
const SIZE = {
  /* cap = extra milk first, then ONE cappuccino press (≈60 ml milk + ≈60 ml coffee); plus = an extra shot on top. */
  cappuccino:        {fam:'cap',  froth:'max', milk:'milk and foam',      s8:{taste:'strong'},  s10:{taste:'xstrong', plus:['short','xstrong',1]}},
  'latte-macchiato': {fam:'cap',  froth:'max', milk:'milk and foam',      s8:{taste:'strong'},  s10:{taste:'xstrong'}},
  latte:             {fam:'milk', froth:'min', milk:'steamed milk',       s8:['short','strong',2],   s10:['short','xstrong',2]},
  'flat-white':      {fam:'milk', froth:'min', milk:'smooth milk',        s8:['short','xstrong',2],  s10:['standard','xstrong',2]},
  'cafe-au-lait':    {fam:'milk', froth:'hot', milk:'hot milk',           s8:['xlong','std',1],      s10:['xlong','strong',1]},
  breve:             {fam:'milk', froth:'min', milk:'steamed half-and-half', half:true, s8:['short','strong',2], s10:['short','xstrong',2]},
  'cafe-con-leche':  {fam:'milk', froth:'hot', milk:'hot milk',           s8:['short','xstrong',2],  s10:['standard','xstrong',2], tail:'Add sugar to taste and stir.'},
  galao:             {fam:'milk', froth:'lowmid', milk:'steamed milk',    s8:['standard','strong',1],s10:['short','strong',2]},
  'wiener-melange':  {fam:'milk', froth:'mid', milk:'milk and a foam cap',s8:['standard','mild',2],  s10:['standard','std',2]},
  mocha:             {fam:'cap',  froth:'min', milk:'steamed milk',       s8:{taste:'strong'},  s10:{taste:'xstrong', plus:['short','xstrong',1]},
                      pre:'Mix 1–2 tsp <b>cocoa</b> (or chocolate syrup) + sugar + a splash of hot water into a paste in the mug.',
                      tail:'Stir well.'},
  'hot-chocolate':   {fam:'chocolate', froth:'mid', milk:'frothed milk',  pre:'Mix <b>cocoa</b> + sugar + a little milk into a paste in the mug.'},
  'iced-latte':      {fam:'iced-milk', milk:'cold milk',                  s8:['short','xstrong',2],  s10:['standard','xstrong',2]},
  'iced-cappuccino': {fam:'iced-cap', froth:'max', s8:{taste:'strong'}, s10:{taste:'xstrong', plus:['short','xstrong',1]}},
  'freddo-cappuccino':{fam:'iced-milk', shake:true, carafe:true, froth:'max', milk:'milk foam', s8:['short','xstrong',2], s10:['standard','xstrong',2]},
  lungo:             {fam:'water', s8:['long','strong',2],   s10:['xlong','strong',2]},
  americano:         {fam:'water', s8:['short','xstrong',2], s10:['standard','xstrong',2]},
  redeye:            {fam:'water', s8:[['long','strong',2],['short','xstrong',1]], s10:[['xlong','strong',2],['short','xstrong',1]]},
  'iced-americano':  {fam:'iced-water', cold:'cold water',  s8:['short','xstrong',2], s10:['standard','xstrong',2]},
  'espresso-tonic':  {fam:'iced-water', cold:'tonic water', first:true, s8:['short','xstrong',1], s10:['short','xstrong',2]},
};
const SIZE_NOTE = {
  espresso:'An espresso is ≈40 ml (1.5 oz). For an 8–10 oz mug, make an <b>Americano</b>.',
  doppio:'A doppio is ≈80 ml (2.5 oz). For a big mug, make an <b>Americano</b> or a <b>latte</b>.',
  ristretto:'A ristretto is ≈20 ml (0.5 oz). For a big mug, make an <b>Americano</b>.',
  'con-panna':'Espresso + cream, small. For a big mug, make a <b>latte</b> or <b>mocha</b>.',
  vienna:'Small and cream-topped. For a big mug, make a <b>café au lait</b> with cream.',
  bombon:'Small and layered. For a big mug, make a <b>café con leche</b>.',
  cubano:'A small strong shot. For a big mug, make a <b>café con leche</b>.',
  'espresso-macchiato':'Made small. For an 8–10 oz mug, make a <b>latte</b>.',
  cortado:'A cortado is ~4 oz. For an 8–10 oz mug, make a <b>latte</b>.',
  cortadito:'Small and sweet. For a big mug, make a <b>latte</b> and add sugar.',
  marocchino:'Made small. For a big mug, make a <b>mocha</b>.',
  affogato:'A dessert — one scoop, one shot. Not sized by mug.',
  'freddo-espresso':'A short cold shot. For a big cup, make a <b>Freddo cappuccino</b>.',
};
/* Customer-facing one-liners for the order menu (what the drinker gets, not how it's made). */
const MENU = {
  espresso:'A small, intense shot. Bold and quick.',
  doppio:'A double shot. Twice the kick.',
  lungo:'A longer black coffee. Milder than espresso.',
  americano:'Espresso topped with hot water. Clean and easy.',
  ristretto:'A tiny, extra-concentrated shot. Sweet and punchy.',
  'con-panna':'Espresso topped with whipped cream. A little treat.',
  vienna:'Black coffee under a cap of whipped cream.',
  bombon:'Espresso over sweet condensed milk. Rich and sweet.',
  redeye:'Coffee with an extra shot. Maximum caffeine.',
  cubano:'A strong, sweet shot with a sugar-whipped top.',
  cappuccino:'Espresso, steamed milk, and a thick foam cap.',
  latte:'Smooth and milky, with a mild coffee taste.',
  'latte-macchiato':'Layered milk and espresso in a tall glass.',
  'flat-white':'Strong and silky — more coffee, less foam than a latte.',
  'espresso-macchiato':'An espresso with just a dab of foam.',
  cortado:'Equal espresso and milk. Small and balanced.',
  'cafe-au-lait':'Mellow coffee with plenty of warm milk.',
  breve:'A rich, creamy latte made with half-and-half.',
  'cafe-con-leche':'Strong coffee with lots of hot milk. Lightly sweet.',
  galao:'Very milky and light, in a tall glass.',
  cortadito:'A small, sweet, milky espresso.',
  'wiener-melange':'Like a cappuccino — espresso, milk, and foam.',
  mocha:'Chocolate and espresso with steamed milk.',
  marocchino:'A little espresso, cocoa, and milk foam.',
  'hot-chocolate':'Rich cocoa with frothed milk. No coffee.',
  'iced-americano':'Espresso over ice and cold water. Crisp.',
  'iced-latte':'Espresso and cold milk over ice.',
  affogato:"Vanilla ice cream 'drowned' in a hot shot. A dessert.",
  'iced-cappuccino':'A cappuccino served over ice.',
  'freddo-espresso':'A cold, frothy shaken espresso. No milk.',
  'freddo-cappuccino':'Iced espresso topped with cold milk foam.',
  'espresso-tonic':'Espresso over tonic and ice. Fizzy and bright.',
};
RECIPES.forEach(r=>{
  if(SIZE[r.id])           r.size=SIZE[r.id];
  else if(SIZE_NOTE[r.id]) r.sizeNote=SIZE_NOTE[r.id];
  r.menu = MENU[r.id] || r.desc;
});
