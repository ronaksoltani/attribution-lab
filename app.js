/* Attribution Lab | dependency-free browser interactions | MIT License */ "use strict";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector)
];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
}
[
  char
]));
const toast = message =>{
   const node = $(".toast");
   if (!node) return;
   node.textContent = message;
   node.classList.add("is-visible");
   clearTimeout(window.toastTimer);
   window.toastTimer = setTimeout(() => node.classList.remove("is-visible"), 2600);
};
const downloadText = (filename, text, type = "text/plain;charset=utf-8") =>{
   const url = URL.createObjectURL(new Blob([
    text
  ],{
    type
  }));
   const link = document.createElement("a");
   link.href = url;
   link.download = filename;
   link.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const copyText = async text =>{
   try{
     await navigator.clipboard.writeText(text);
     return true;
  }
   catch{
     const field = document.createElement("textarea");
     field.value = text;
     field.style.position = "fixed";
     field.style.opacity = "0";
     document.body.append(field);
     field.select();
     const ok = document.execCommand("copy");
     field.remove();
     return ok;
  }
};
const readFileText = file => new Promise((resolve, reject) =>{
   const reader = new FileReader();
   reader.onload = () => resolve(String(reader.result));
   reader.onerror = () => reject(new Error("Could not read this file."));
   reader.readAsText(file);
});
const parseCSV = text =>{
   const rows = [
  ];
   let row = [
  ], cell = "", quoted = false;
   for (let i = 0; i < text.length; i++){
     const c = text[
      i
    ];
     if (quoted){
       if (c === '"' && text[
        i + 1
      ]
       === '"'){
         cell += '"';
         i++;
      }
       else if (c === '"') quoted = false;
       else cell += c;
    }
     else if (c === '"') quoted = true;
     else if (c === ","){
       row.push(cell);
       cell = "";
    }
     else if (c === "\n"){
       row.push(cell.replace(/\r$/, ""));
       if (row.some(value => value.trim())) rows.push(row);
       row = [
      ];
       cell = "";
    }
     else cell += c;
  }
   row.push(cell.replace(/\r$/, ""));
   if (row.some(value => value.trim())) rows.push(row);
   return rows;
};
const saveJSON = (key, value) =>{
   try{
     localStorage.setItem(key, JSON.stringify(value));
     return true;
  }
   catch{
     return false;
  }
};
const loadJSON = (key, fallback) =>{
   try{
     return JSON.parse(localStorage.getItem(key)) ?? fallback;
  }
   catch{
     return fallback;
  }
};
const menuButton = $(".menu-toggle"), nav = $("#main-navigation");
menuButton?.addEventListener("click", () =>{
   const opened = nav.classList.toggle("is-open");
   menuButton.setAttribute("aria-expanded", String(opened));
   menuButton.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
});
nav?.addEventListener("click", event =>{
   if (event.target.closest("a")){
     nav.classList.remove("is-open");
     menuButton?.setAttribute("aria-expanded", "false");
  }
});
$$('[data-toast]').forEach(button => button.addEventListener("click", () => toast(button.dataset.toast)));
$$('[data-scroll]').forEach(button => button.addEventListener("click", () => $(button.dataset.scroll)?.scrollIntoView({
  behavior:"smooth"
})));
const demoTouches=[
{
    journey:"A",
    channel:"Organic search",
    position:1,
    revenue:180
  },
{
    journey:"A",
    channel:"Email",
    position:2,
    revenue:180
  },
{
    journey:"A",
    channel:"Direct",
    position:3,
    revenue:180
  },
{
    journey:"B",
    channel:"Paid social",
    position:1,
    revenue:96
  },
{
    journey:"B",
    channel:"Organic search",
    position:2,
    revenue:96
  },
{
    journey:"C",
    channel:"Referral",
    position:1,
    revenue:240
  },
{
    journey:"C",
    channel:"Email",
    position:2,
    revenue:240
  },
{
    journey:"D",
    channel:"Paid search",
    position:1,
    revenue:125
  },
{
    journey:"E",
    channel:"Organic search",
    position:1,
    revenue:75
  },
{
    journey:"E",
    channel:"Direct",
    position:2,
    revenue:75
  }
];
let touchRows=demoTouches;
const allocateCredit=()=>{
  const mode=$("#attr-model").value,journeys=new Map();
  touchRows.forEach(row=>{
    if(!journeys.has(row.journey))journeys.set(row.journey,[
    ]);
    journeys.get(row.journey).push(row);
  });
  const totals=new Map();
  for(const touches of journeys.values()){
    touches.sort((a,b)=>a.position-b.position);
    touches.forEach((touch,index)=>{
      let weight=mode==="linear"?1/touches.length:mode==="first"?(index===0?1:0):(index===touches.length-1?1:0);
      const old=totals.get(touch.channel)||{
        touches:0,
        conversions:0,
        credit:0,
        revenue:0
      };
      old.touches++;
      old.credit+=weight;
      old.conversions+=weight;
      old.revenue+=touch.revenue*weight;
      totals.set(touch.channel,old);
    });
  }
  const data=[
    ...totals
  ].map(([
    channel,
    item
  ])=>({
    channel,
    ...item
  })).sort((a,b)=>b.credit-a.credit),sum=data.reduce((total,item)=>total+item.credit,0)||1;
  $("#attr-model-title").textContent={
    last:"Last-touch view",
    first:"First-touch view",
    linear:"Linear-credit view"
  }
  [
    mode
  ];
  $("#attr-kpis").innerHTML=[
    [
      'Journeys',
      journeys.size,
      "observed demo paths"
    ],
    [
      'Touchpoints',
      touchRows.length,
      "rows in this dataset"
    ],
    [
      'Channels',
      data.length,
      "distinct channels"
    ],
    [
      'Attributed revenue',
      "$"+data.reduce((total,
      item)=>total+item.revenue,
      0).toFixed(2),
      "illustrative only"
    ]
  ].map(row=>'<article class="metric-card"><span>'+row[
    0
  ]
  +'</span><strong>'+row[
    1
  ]
  +'</strong><small>'+row[
    2
  ]
  +'</small></article>').join("");
  $("#attr-results").innerHTML=data.map(item=>{
    const share=item.credit/sum*100;
    return '<div class="attrib-bar-row"><span>'+escapeHTML(item.channel)+'</span><div class="attrib-bar-track"><i style="--share:'+share.toFixed(1)+'%"></i></div><b>'+share.toFixed(1)+'%</b></div>';
  }).join("");
  $("#attr-table").innerHTML=data.map(item=>'<tr><td>'+escapeHTML(item.channel)+'</td><td>'+item.touches+'</td><td>'+item.conversions.toFixed(2)+'</td><td>'+((item.credit/sum)*100).toFixed(1)+'%</td><td>$'+item.revenue.toFixed(2)+'</td></tr>').join("");
};
$("#attr-model")?.addEventListener("change",allocateCredit);
$("#load-attr-sample")?.addEventListener("click",()=>{
  touchRows=demoTouches;
  allocateCredit();
  $("#attr-status").textContent="Illustrative demo data restored.";
});
$("#attr-file")?.addEventListener("change",async event=>{
  try{
    const rows=parseCSV(await readFileText(event.target.files[
      0
    ]));
    const headers=rows[
      0
    ].map(value=>value.trim().toLowerCase()),get=(row,key)=>row[
      headers.indexOf(key)
    ];
    if(![
      "journey",
      "channel",
      "position",
      "revenue"
    ].every(key=>headers.includes(key)))throw new Error("Required headers: journey, channel, position, revenue.");
    const parsed=rows.slice(1).map(row=>({
      journey:get(row,
      "journey"),
      channel:get(row,
      "channel"),
      position:Number(get(row,
      "position")),
      revenue:Number(get(row,
      "revenue"))
    })).filter(row=>row.journey&&row.channel&&Number.isFinite(row.position)&&Number.isFinite(row.revenue)&&row.position>0);
    if(!parsed.length)throw new Error("No valid touchpoint rows found.");
    touchRows=parsed;
    allocateCredit();
    $("#attr-status").textContent=parsed.length+" touchpoints analyzed locally. Check that each journey is represented as intended.";
  }
  catch(error){
    $("#attr-status").textContent=error.message;
  }
});
allocateCredit();
