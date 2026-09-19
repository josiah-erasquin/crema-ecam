/* Crema — content distilled from the delonghi-ecam knowledge base (27 YouTube videos,
   incl. official De'Longhi how-to clips). Official = machine instruction. Tip = barista opinion. */

const CATS = [
  {id:'all',   label:'All'},
  {id:'milk',  label:'Milk'},
  {id:'black', label:'Black'},
  {id:'iced',  label:'Iced'},
];

const CLEAN_TIP = {kind:'official', text:'After the last milk drink, turn the froth dial to <code>CLEAN</code> and let the auto-clean run, then wipe the nozzle.'};
const MILKONLY  = 'Press the <b>cappuccino</b> button <b>twice</b> for milk only (no coffee). Press again to stop.';

const RECIPES = [
  /* ---------------- BLACK ---------------- */
  {id:'espresso', name:'Espresso', cats:['black'],
   desc:'A single strong shot with a golden crema.',
   base:'Short · X-strong', froth:'—', milk:'—',
   steps:[
     'Turn the dial to <b>Short coffee</b>.',
     'Press the centre dial to set <b>extra-strong</b>.',
     'Lower the spout close to the cup — this makes a creamier shot.',
     'Press <b>1-cup</b>. Look for a golden crema.'],
   tips:[{kind:'tip', text:'For more crema, grind finer (dial <b>2–3</b>) and use beans roasted for espresso.'}],
   source:{title:'Coffee from beans — De’Longhi How-To', url:'https://www.youtube.com/watch?v=9sQiGxZAcIY'}},

  {id:'doppio', name:'Doppio (double)', cats:['black'],
   desc:'A double espresso — twice the coffee, same cup.',
   base:'Short · X-strong', froth:'—', milk:'—',
   steps:['Turn the dial to <b>Short coffee</b>, strength <b>extra-strong</b>.','Press <b>2-cup</b> into one cup.']},

  {id:'lungo', name:'Lungo / Long black', cats:['black'],
   desc:'A longer, milder black coffee.',
   base:'Long / X-long', froth:'—', milk:'—',
   steps:['Turn the dial to <b>Long</b> or <b>Extra-long coffee</b>.','Press <b>1-cup</b>.'],
   tips:[{kind:'tip', text:'For a bigger cup at the <b>same</b> strength, press single espresso twice instead of Long — the extra water through one puck tastes bitter.'}]},

  {id:'americano', name:'Americano', cats:['black'],
   desc:'Espresso loosened with hot water.',
   base:'Short · Strong', froth:'—', milk:'—',
   steps:[
     'Make an espresso: <b>Short</b>, <b>strong</b>, <b>1-cup</b>.',
     'Press the <b>hot water</b> button to add hot water to taste.',
     'Or fill the cup with hot water first, then pour the espresso on top for more crema.'],
   tips:[{kind:'tip', text:'A common demo favourite. Use <b>2-cup</b> for a bigger, stronger americano.'}]},

  {id:'ristretto', name:'Ristretto', cats:['black'],
   desc:'A very short, concentrated shot.',
   base:'~15–20 ml', froth:'—', milk:'—',
   steps:[
     'Program a coffee button down to about <b>15–20 ml</b> (see How-to → Program cup volume).',
     'Set strength <b>extra-strong</b>.',
     'Press that button.'],
   tips:[{kind:'tip', text:'Great as the strong base for a small milk drink.'}]},

  {id:'con-panna', name:'Espresso con panna', cats:['black'],
   desc:'Espresso crowned with whipped cream.',
   base:'Short · Strong', froth:'—', milk:'Whipped cream',
   steps:['Make one espresso: <b>Short</b>, <b>strong</b>, <b>1-cup</b>.','Top with a spoon of whipped cream.']},

  {id:'vienna', name:'Vienna coffee', cats:['black'],
   desc:'Long coffee under a cap of whipped cream.',
   base:'Extra-long', froth:'—', milk:'Whipped cream',
   steps:['Make an <b>extra-long</b> coffee.','Top with whipped cream. Do not stir.']},

  {id:'bombon', name:'Café bombón', cats:['black'],
   desc:'Espresso layered over condensed milk.',
   base:'Short · Strong', froth:'—', milk:'Condensed',
   steps:['Put sweetened <b>condensed milk</b> in a clear glass.','Make one espresso and pour it slowly on top so it layers.']},

  {id:'redeye', name:'Red eye', cats:['black'],
   desc:'Long coffee spiked with an extra shot.',
   base:'X-long + shot', froth:'—', milk:'—',
   steps:['Make one <b>extra-long</b> coffee.','Add one <b>espresso</b> shot on top for more caffeine.']},

  {id:'cubano', name:'Café Cubano', cats:['black'],
   desc:'Espresso whipped to a sweet foam (espuma).',
   base:'Short · Strong', froth:'—', milk:'Sugar espuma',
   steps:[
     'Start a strong espresso.',
     'Whip 1–2 tsp <b>sugar</b> with the first few drops of the espresso into a pale foam.',
     'Stir in the rest of the espresso.']},

  /* ---------------- MILK ---------------- */
  {id:'cappuccino', name:'Cappuccino', cats:['milk'],
   desc:'Equal parts espresso, milk, and a thick foam cap.',
   base:'Short · Strong · 1-cup', froth:'High', milk:'Equal + foam',
   steps:[
     'Fill the milk carafe (not above <code>MAX</code>) and push it onto the nozzle until it beeps.',
     'Set the froth dial to <b>high</b>.',
     'Put a cup under the spouts and press the <b>cappuccino</b> button. Milk comes first, then coffee.'],
   tips:[CLEAN_TIP],
   source:{title:'Cappuccino & milk drinks — De’Longhi How-To', url:'https://www.youtube.com/watch?v=JukCkpAPrdQ'}},

  {id:'latte', name:'Caffè latte', cats:['milk'],
   desc:'Espresso with a lot of milk and a thin foam.',
   base:'Short · Strong · 1-cup', froth:'Low–med', milk:'Fill the cup',
   steps:[
     'Make an espresso into a large cup: <b>Short</b>, <b>strong</b>, <b>1-cup</b>.',
     'Fit the milk carafe, froth dial <b>low</b>.',
     MILKONLY+' Fill the cup like a latte.'],
   tips:[CLEAN_TIP]},

  {id:'latte-macchiato', name:'Latte macchiato', cats:['milk'],
   desc:'Layered: milk first, espresso poured through.',
   base:'Short · Strong (last)', froth:'Medium', milk:'Fill glass first',
   steps:[
     'Fit the milk carafe, froth dial <b>medium</b>.',
     MILKONLY+' Fill a tall glass with milk and foam.',
     'Make an espresso (<b>Short</b>, <b>strong</b>, <b>1-cup</b>) and pour it slowly through the milk to layer.'],
   tips:[CLEAN_TIP],
   source:{title:'Latte macchiato & cleaning', url:'https://www.youtube.com/watch?v=MQabwi857PQ'}},

  {id:'flat-white', name:'Flat white', cats:['milk'],
   desc:'A strong double espresso under a thin, smooth milk.',
   base:'Short · Strong · 2-cup', froth:'Low', milk:'Small, thin foam',
   steps:[
     'Make a double espresso: <b>Short</b>, <b>strong</b>, <b>2-cup</b>.',
     'Fit the milk carafe, froth dial <b>low</b>.',
     MILKONLY+' Add a small amount of smooth milk.'],
   tips:[{kind:'tip', text:'Keep the milk low — a flat white has less milk and foam than a latte.'}, CLEAN_TIP]},

  {id:'espresso-macchiato', name:'Espresso macchiato', cats:['milk'],
   desc:'Espresso “stained” with a little foam.',
   base:'Short · Strong · 1-cup', froth:'High', milk:'A spoon of foam',
   steps:[
     'Make one espresso in a small cup.',
     'Fit the milk carafe, froth dial <b>high</b>.',
     MILKONLY+' Add just a small spoon of foam on top.'],
   tips:[CLEAN_TIP]},

  {id:'cortado', name:'Cortado', cats:['milk'],
   desc:'Espresso cut with an equal amount of flat milk.',
   base:'Short · Strong · 1-cup', froth:'Lowest', milk:'Equal (~1:1)',
   steps:[
     'Make one espresso in a small glass.',
     'Fit the milk carafe, froth dial <b>lowest</b>.',
     MILKONLY+' Add milk equal to the espresso.'],
   tips:[{kind:'tip', text:'Smaller than a flat white, with almost no foam.'}, CLEAN_TIP]},

  {id:'cafe-au-lait', name:'Café au lait', cats:['milk'],
   desc:'Long, mild coffee with equal warm milk.',
   base:'Extra-long · 1-cup', froth:'Lowest', milk:'Equal (~1:1)',
   steps:[
     'Turn the dial to <b>Extra-long coffee</b> (mild, not espresso), strength <b>standard</b>. Press <b>1-cup</b>.',
     'Fit the milk carafe, froth dial <b>lowest</b>.',
     MILKONLY+' Add milk equal to the coffee.'],
   tips:[{kind:'tip', text:'The one milk drink built on long coffee, not espresso.'}, CLEAN_TIP]},

  {id:'breve', name:'Breve', cats:['milk'],
   desc:'A latte made with half-and-half for a richer body.',
   base:'Short · Strong · 2-cup', froth:'Low', milk:'Half-and-half',
   steps:[
     'Fill the carafe with <b>half-and-half</b> instead of milk.',
     'Make a double espresso: <b>Short</b>, <b>strong</b>, <b>2-cup</b>.',
     'Froth dial <b>low</b>. '+MILKONLY+' Fill the cup.'],
   tips:[CLEAN_TIP]},

  {id:'cafe-con-leche', name:'Café con leche', cats:['milk'],
   desc:'Strong coffee with a lot of hot milk.',
   base:'Short · Strong', froth:'Low', milk:'1:1 up to 1:3',
   steps:[
     'Make a strong espresso.',
     'Froth dial <b>low</b>. '+MILKONLY+' Add plenty of milk (equal, up to three times the coffee).',
     'Add sugar to taste.'],
   tips:[CLEAN_TIP]},

  {id:'galao', name:'Galão', orig:'Portuguese', cats:['milk'],
   desc:'A tall, very milky coffee — one shot to three milk.',
   base:'Short · Strong', froth:'Low–med', milk:'~3 parts',
   steps:[
     'Make one espresso in a tall glass.',
     'Froth dial <b>low–medium</b>. '+MILKONLY+' Add about <b>3 parts milk</b> to the one shot.'],
   tips:[CLEAN_TIP]},

  {id:'cortadito', name:'Cortadito', orig:'Cuban', cats:['milk'],
   desc:'A cortado with sugar for a sweet foam.',
   base:'Short · Strong · 1-cup', froth:'Low', milk:'Equal (~1:1)',
   steps:[
     'Make one espresso, stir in <b>sugar</b> to taste.',
     'Froth dial <b>low</b>. '+MILKONLY+' Add milk equal to the espresso.'],
   tips:[CLEAN_TIP]},

  {id:'wiener-melange', name:'Wiener Melange', orig:'Viennese', cats:['milk'],
   desc:'A lighter cappuccino — espresso, steamed milk, foam.',
   base:'Short · Strong · 1-cup', froth:'Med–high', milk:'Equal + foam',
   steps:[
     'Make one espresso.',
     'Froth dial <b>medium–high</b>. '+MILKONLY+' Add equal steamed milk, topped with foam.'],
   tips:[CLEAN_TIP]},

  {id:'mocha', name:'Mocha latte', cats:['milk'],
   desc:'A latte with chocolate stirred through.',
   base:'Short · Strong · 1-cup', froth:'Low–med', milk:'Fill the cup',
   steps:[
     'In the cup, mix 1–2 tsp <b>cocoa</b> (or chocolate syrup) + sugar + a splash of hot water into a paste.',
     'Make an espresso and pour it on the chocolate. Stir.',
     'Froth dial <b>low–medium</b>. '+MILKONLY+' Fill the cup like a latte.'],
   tips:[CLEAN_TIP]},

  {id:'marocchino', name:'Marocchino', cats:['milk'],
   desc:'A small mocha-macchiato: espresso, cocoa, foam.',
   base:'Short · Strong · 1-cup', froth:'High', milk:'A spoon of foam',
   steps:[
     'Dust <b>cocoa</b> in the cup, then pull one espresso.',
     'Dust a little cocoa on top.',
     'Froth dial <b>high</b>. '+MILKONLY+' Add a small spoon of foam.'],
   tips:[CLEAN_TIP]},

  {id:'hot-chocolate', name:'Hot chocolate', cats:['milk'],
   desc:'Frothed milk over a cocoa paste — no coffee.',
   base:'—', froth:'Med–high', milk:'Fill the cup',
   steps:[
     'Mix <b>cocoa</b> + sugar + a little milk into a paste in the cup.',
     'Froth dial <b>medium–high</b>. '+MILKONLY,
     'Pour the frothed milk over the paste and stir.'],
   tips:[CLEAN_TIP]},

  /* ---------------- ICED ---------------- */
  {id:'iced-americano', name:'Iced americano', cats:['iced'],
   desc:'Ice, cold water, and a shot on top.',
   base:'Short · Strong', froth:'—', milk:'—',
   steps:['Fill a glass with <b>ice</b>.','Add cold water.','Pour one <b>espresso</b> shot on top.']},

  {id:'iced-latte', name:'Iced latte', cats:['iced'],
   desc:'Espresso over ice with cold milk.',
   base:'Short · Strong', froth:'—', milk:'Cold, poured',
   steps:[
     'Fill a glass with <b>ice</b>.',
     'Make one or two espresso shots and pour over the ice.',
     'Top with cold milk.'],
   tips:[{kind:'tip', text:'Add syrup for an <b>iced mocha</b> or <b>iced caramel latte</b>.'}]},

  {id:'affogato', name:'Affogato', cats:['iced'],
   desc:'A hot shot poured over cold ice cream.',
   base:'Short · Strong', froth:'—', milk:'Vanilla ice cream',
   steps:['Put a scoop of vanilla ice cream in a glass.','Pour one hot <b>espresso</b> shot over it.']},

  {id:'iced-cappuccino', name:'Iced cappuccino', cats:['iced'],
   desc:'A cappuccino, poured over ice.',
   base:'Short · Strong · 1-cup', froth:'High', milk:'Over ice',
   steps:['Make a cappuccino (froth dial <b>high</b>, cappuccino button).','Pour it over a glass of ice.'],
   tips:[CLEAN_TIP]},

  {id:'freddo-espresso', name:'Freddo espresso', orig:'Greek', cats:['iced'],
   desc:'A cold, frothy shaken espresso.',
   base:'Short · Strong · 2-cup', froth:'—', milk:'—',
   steps:[
     'Pull a strong double espresso and add sugar.',
     'Whisk or shake it hard with <b>ice</b> until frothy.',
     'Strain over fresh ice.'],
   tips:[{kind:'tip', text:'No blender needed.'}]},

  {id:'freddo-cappuccino', name:'Freddo cappuccino', orig:'Greek', cats:['iced'],
   desc:'A freddo espresso under cold milk foam.',
   base:'Short · Strong · 2-cup', froth:'High', milk:'Cold foam, over ice',
   steps:[
     'Make a Freddo espresso over ice.',
     'Froth dial <b>high</b>. '+MILKONLY+' Top with the cold foam.'],
   tips:[CLEAN_TIP]},

  {id:'espresso-tonic', name:'Espresso tonic', cats:['iced'],
   desc:'Espresso over iced tonic water.',
   base:'Short · Strong', froth:'—', milk:'—',
   steps:['Fill a glass with <b>ice</b>.','Add tonic water.','Pour one <b>espresso</b> on top.']},
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
   tips:[{kind:'official', text:'Factory volumes are about 40 / 80 / 120 / 240 ml. Restore them with menu → <b>Default values</b>.'}]},

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
     'Froth dial: <b>low</b> = flat milk, <b>high</b> = foam.',
     'One press of <b>cappuccino</b> = milk then coffee. <b>Two presses</b> = milk only.'],
   tips:[CLEAN_TIP],
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
   Milk drinks scale with MORE MILK (never water). Black drinks scale with the
   hot water function. Small drinks stay small — a note points to the right big-mug drink.
   8 oz ≈ 240 ml, 10 oz ≈ 300 ml, one shot ≈ 35 ml, double ≈ 70 ml. */
const SIZE_MILK = {
  cappuccino:['1 shot + steamed milk & foam to fill ~8 oz (roughly ⅓ coffee · ⅓ milk · ⅓ foam).',
              '2 shots (double) + more steamed milk & foam to fill ~10 oz.'],
  latte:['1 shot + steamed milk to fill ~8 oz, thin foam on top.',
         '2 shots (double) + steamed milk to fill ~10 oz.'],
  'latte-macchiato':['Fill ~8 oz with milk & foam first, then pour 1 shot through.',
                     'Fill ~10 oz with milk & foam first, then pour 2 shots through.'],
  'flat-white':['2 shots + steamed milk to fill ~8 oz, thin foam (bigger than a classic flat white).',
                '2 shots + steamed milk to fill ~10 oz — really a small latte at this size.'],
  'cafe-au-lait':['1 extra-long coffee + hot milk to fill ~8 oz (about 1:1).',
                  '1 extra-long coffee (or 2) + hot milk to fill ~10 oz.'],
  breve:['1 shot + steamed half-and-half to fill ~8 oz.',
         '2 shots + steamed half-and-half to fill ~10 oz.'],
  'cafe-con-leche':['1–2 shots + hot milk to fill ~8 oz; sugar to taste.',
                    '2 shots + hot milk to fill ~10 oz; sugar to taste.'],
  galao:['1 shot + steamed milk to fill ~8 oz (about 1:3).',
         '2 shots + steamed milk to fill ~10 oz.'],
  'wiener-melange':['1 shot + steamed milk to fill ~8 oz, foam cap.',
                    '2 shots + steamed milk to fill ~10 oz, foam cap.'],
  mocha:['Chocolate paste + 1 shot + steamed milk to fill ~8 oz.',
         'Chocolate paste + 2 shots + steamed milk to fill ~10 oz.'],
  'hot-chocolate':['Cocoa paste + frothed milk to fill ~8 oz (no coffee).',
                   'Cocoa paste + frothed milk to fill ~10 oz (no coffee).'],
  'iced-latte':['1–2 shots over ice + cold milk to fill ~8 oz.',
                '2 shots over ice + cold milk to fill ~10 oz.'],
  'iced-cappuccino':['1 shot + cold milk & foam over ice to ~8 oz.',
                     '2 shots + cold milk & foam over ice to ~10 oz.'],
  'freddo-cappuccino':['Double espresso, shaken, + cold foam over ice to ~8 oz.',
                       'Double espresso, shaken, + more cold foam over ice to ~10 oz.'],
};
const SIZE_WATER = {
  lungo:['2 shots + hot water to fill ~8 oz.','2–3 shots + hot water to fill ~10 oz.'],
  americano:['1–2 shots + hot water to fill ~8 oz.','2 shots + hot water to fill ~10 oz.'],
  redeye:['1 long coffee + 1 shot, then hot water to ~8 oz.','1 extra-long coffee + 1 shot to ~10 oz.'],
  'iced-americano':['1–2 shots + cold water over ice to ~8 oz.','2 shots + cold water over ice to ~10 oz.'],
  'espresso-tonic':['1 shot + tonic water over ice to ~8 oz.','2 shots + tonic water over ice to ~10 oz.'],
};
const SIZE_NOTE = {
  espresso:'An espresso is 1–1.5 oz. For an 8–10 oz mug, make an <b>Americano</b>.',
  doppio:'A doppio is ~2–3 oz. For a big mug, make an <b>Americano</b> or a <b>latte</b>.',
  ristretto:'A ristretto is ~1 oz. For a big mug, make an <b>Americano</b>.',
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
RECIPES.forEach(r=>{
  if(SIZE_MILK[r.id])       r.sizes={mode:'milk',  s8:SIZE_MILK[r.id][0],  s10:SIZE_MILK[r.id][1]};
  else if(SIZE_WATER[r.id]) r.sizes={mode:'water', s8:SIZE_WATER[r.id][0], s10:SIZE_WATER[r.id][1]};
  else if(SIZE_NOTE[r.id])  r.sizeNote=SIZE_NOTE[r.id];
});
