import { useState, useEffect, useRef } from "react";

/* ───────── SECTION CONFIG ───────── */
const SECTIONS = [
  { id:"landscape", num:"01", title:"Market Landscape", icon:"🗺️", sub:"20+ platforms mapped" },
  { id:"features", num:"02", title:"Feature Matrix", icon:"⚔️", sub:"Side-by-side comparison" },
  { id:"reverse", num:"03", title:"Reverse Engineering", icon:"🔍", sub:"How competitors work internally" },
  { id:"repos", num:"04", title:"Open Source Intel", icon:"📦", sub:"GitHub repo deep-dive" },
  { id:"arch", num:"05", title:"Architecture", icon:"🏗️", sub:"System design + diagrams" },
  { id:"scraping", num:"06", title:"Scraping Strategy", icon:"🕷️", sub:"Per-platform approach" },
  { id:"speed", num:"07", title:"Speed Engine", icon:"⚡", sub:"Sub-30s detection pipeline" },
  { id:"dedup", num:"08", title:"Deduplication", icon:"🔗", sub:"Cross-platform matching" },
  { id:"fraud", num:"09", title:"Anti-Scam System", icon:"🛡️", sub:"Trust scoring engine" },
  { id:"legal", num:"10", title:"Legal Strategy", icon:"⚖️", sub:"EU/NL compliance blueprint" },
  { id:"data", num:"11", title:"Data Model", icon:"🗄️", sub:"PostgreSQL schema" },
  { id:"stack", num:"12", title:"Tech Stack", icon:"🧰", sub:"Recommended tools" },
  { id:"roadmap", num:"13", title:"Implementation Roadmap", icon:"🚀", sub:"Week-by-week plan" },
];

/* ───────── REUSABLE COMPONENTS ───────── */
function P({children,style:s}){return <p style={{color:"#b0b8c8",fontSize:14,lineHeight:1.8,margin:"0 0 14px",...s}}>{children}</p>}
function H3({children}){return <h3 style={{color:"#e5e7eb",fontSize:17,fontWeight:800,margin:"28px 0 14px"}}>{children}</h3>}
function H4({children,color}){return <h4 style={{color:color||"#d1d5db",fontSize:15,fontWeight:700,margin:"20px 0 8px"}}>{children}</h4>}
function Code({children}){return <pre style={{background:"#0d1117",color:"#c9d1d9",padding:"16px 20px",borderRadius:10,fontSize:12,lineHeight:1.6,overflowX:"auto",fontFamily:"'JetBrains Mono',monospace",border:"1px solid #21262d",margin:"12px 0",whiteSpace:"pre"}}><code>{children}</code></pre>}
function Tag({children,color="#a78bfa"}){return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:6,fontSize:11,fontWeight:700,background:color+"18",color,border:`1px solid ${color}33`,marginRight:5,marginBottom:3}}>{children}</span>}
function Card({title,children,accent="#a78bfa"}){return <div style={{background:"#12122a",border:"1px solid #ffffff08",borderLeft:`3px solid ${accent}`,borderRadius:10,padding:"16px 20px",marginBottom:12}}>{title&&<h4 style={{color:accent,margin:"0 0 8px",fontSize:14,fontWeight:800}}>{title}</h4>}{children}</div>}
function Bullet({items,color="#9ca3af",icon="▸"}){return <>{items.map((it,i)=><div key={i} style={{color,fontSize:13,padding:"2px 0"}}>{icon} {it}</div>)}</>}

/* ───────── ALL PLATFORM DATA ───────── */
const PLATFORMS = [
  {name:"Stekkies",type:"aggregator",price:"€29.95/mo",sources:"500+",alerts:"Push, Email",autoApply:false,scamFilter:true,free:false,tp:"4.3",desc:"Volume-focused aggregator with real-time alerts from hundreds of websites including Facebook groups. Strong on coverage breadth.",killer:"Massive source coverage, Facebook group monitoring",url:"stekkies.com"},
  {name:"Rentbird",type:"aggregator",price:"€29/mo",sources:"1,400+",alerts:"Push, Email",autoApply:false,scamFilter:false,free:false,tp:"4.6",desc:"Most established aggregator. Partner search lets couples share a search. Scans 1,400+ rental sites 24/7. Consistent alerts but no automation beyond notifications.",killer:"Partner/shared search, brand trust, 1,400+ sources",url:"rentbird.nl"},
  {name:"RentSlam",type:"aggregator",price:"€29.95/mo",sources:"1,000+",alerts:"Email, WhatsApp",autoApply:false,scamFilter:false,free:false,tp:"4.2",desc:"Speed-focused. Claims AI-powered matching. WhatsApp alerts are a unique channel advantage. 40,000+ users. Alerts within minutes of listings going online.",killer:"WhatsApp alerts, speed reputation, 40K users",url:"rentslam.com"},
  {name:"Findify",type:"aggregator",price:"€19.99/mo",sources:"Verified agencies",alerts:"Push (30s)",autoApply:true,scamFilter:true,free:false,tp:"4.8",desc:"Most feature-rich. Auto-apply fills forms in 10-15 seconds vs 3-5 min manually. In-app landlord chat. WWS point estimation for fair rent verification. Only sources from verified real estate agencies.",killer:"Auto-apply, in-app chat, WWS estimator, cheapest paid option",url:"findify.nl"},
  {name:"RentHunter",type:"aggregator",price:"€29/mo",sources:"Multi-platform",alerts:"Email",autoApply:false,scamFilter:true,free:false,tp:"4.0",desc:"Expat-focused aggregator. Scam protection filter screens out fake listings. Clean interface but email-only alerts make it slower than push-based competitors.",killer:"Scam protection focus, expat-friendly UX",url:"renthunter.nl"},
  {name:"Huisly",type:"aggregator",price:"FREE",sources:"1,400+",alerts:"Push",autoApply:false,scamFilter:false,free:true,tp:"5.0",desc:"Free aggregator disrupting the paid model. 1,400+ sources. Native iOS and Android apps. Also covers the buying market. 5-star rating. Redirects to original source for applications.",killer:"Completely free, native apps, 1,400+ sources, covers buying too",url:"huisly.nl"},
  {name:"Uprent",type:"aggregator",price:"Freemium",sources:"239 platforms",alerts:"Push, Email",autoApply:true,scamFilter:false,free:true,tp:"4.7",desc:"Most innovative technically. AI agent 'Bob' auto-applies to listings. Chrome browser extension. Application CRM/dashboard tracks all your applications. Contract review AI checks for unfair clauses. 13,000+ active listings from 239 distinct platforms.",killer:"AI auto-apply agent, browser extension, contract review AI, application CRM dashboard",url:"uprent.nl"},
  {name:"Luntero",type:"aggregator",price:"FREE",sources:"50+ platforms",alerts:"Email",autoApply:false,scamFilter:false,free:true,tp:"N/A",desc:"Free multilingual aggregator with AI summaries and side-by-side listing comparisons. 20,000+ listings. Strong content/guides section. Platform directory with reviews of 233+ rental sites.",killer:"AI summaries, multilingual, side-by-side comparison, platform directory",url:"luntero.com"},
  {name:"Funda",type:"platform",price:"Free",sources:"NVM agents",alerts:"Email",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"The #1 Dutch property portal. 50,000+ active rental listings. NVM agent network ensures verified listings. English website available (but not the mobile app). Uses Cloudflare WAF + rate limiting for bot protection.",killer:"Largest database, NVM agent trust, brand dominance, 50K+ listings",url:"funda.nl"},
  {name:"Pararius",type:"platform",price:"Free / Plus €9.95",sources:"Agencies",alerts:"Push (Plus)",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"Major rental-focused platform. Available in 6 languages (EN, ES, FR, DE, IT, NL). Pararius+ subscription unlocks instant alerts and one-click applications. Lighter bot protection than Funda.",killer:"6 languages, agent-verified, Pararius+ instant alerts",url:"pararius.com"},
  {name:"Kamernet",type:"platform",price:"€34/mo",sources:"Direct listings",alerts:"Email",autoApply:false,scamFilter:true,free:false,tp:"3.5",desc:"Largest room and studio platform in the Netherlands. Student and expat focus. Requires paid subscription to message landlords. Login-gated content makes scraping harder.",killer:"Room/shared housing specialization, largest room platform",url:"kamernet.nl"},
  {name:"HousingAnywhere",type:"platform",price:"Free to search",sources:"Direct listings",alerts:"Email",autoApply:false,scamFilter:true,free:true,tp:"4.2",desc:"International mid-term furnished rentals. Built-in booking and payment system. Strong in university cities. React SPA with REST API (good for API interception scraping).",killer:"Furnished mid-term, international, booking+payment built-in",url:"housinganywhere.com"},
  {name:"Huurwoningen.nl",type:"platform",price:"Smart: €25/mo",sources:"Agents + private",alerts:"Email",autoApply:false,scamFilter:false,free:true,tp:"3.8",desc:"One of the largest Dutch rental databases. Shows competition count (how many people responded to each listing). Smart account provides early access to new listings.",killer:"Competition counter per listing, nationwide coverage",url:"huurwoningen.nl"},
  {name:"DirectWonen",type:"platform",price:"€24.50/mo",sources:"Direct listings",alerts:"Email",autoApply:false,scamFilter:false,free:false,tp:"3.2",desc:"Fast listing platform. Requires paid subscription to contact landlords. Broad property types including anti-squat.",killer:"Listing speed, broad property types",url:"directwonen.nl"},
  {name:"Kamer.nl",type:"platform",price:"Low cost",sources:"Direct listings",alerts:"Yes",autoApply:false,scamFilter:true,free:false,tp:"3.5",desc:"Room-focused alternative to Kamernet. Quality assurance on listings and clear rental terms. Reliable for students.",killer:"Quality assurance on rooms, clear terms",url:"kamer.nl"},
  {name:"Jaap.nl",type:"platform",price:"Free",sources:"Agents",alerts:"Email",autoApply:false,scamFilter:false,free:true,tp:"N/A",desc:"Property portal covering both buying and renting. Server-rendered, low bot protection. Good for market research and secondary listings.",killer:"Buy+rent coverage, easy to scrape",url:"jaap.nl"},
  {name:"RentSwap",type:"niche",price:"Success-based",sources:"Tenant network",alerts:"Yes",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"Unique model: connect with tenants who are moving out and take over their rental. Zero competition because listings never go public. Success-based pricing (pay only when matched).",killer:"Pre-market access via leaving tenants, zero competition",url:"rentswap.nl"},
  {name:"OnlyExpats",type:"niche",price:"Free",sources:"Curated agents",alerts:"Email",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"Curated listings specifically for expats. English-speaking agents. Thousands of rentals. Guided rental process for internationals unfamiliar with Dutch market.",killer:"Full expat hand-holding, English-only curated experience",url:"onlyexpats.nl"},
  {name:"MVGM",type:"niche",price:"€36 first year",sources:"Own portfolio",alerts:"Email",autoApply:false,scamFilter:true,free:false,tp:"N/A",desc:"Property manager with direct rentals from their managed portfolio (~197 active). Plus subscription for early access. Lottery system for viewing candidates. Fee refunded upon signing rental.",killer:"Direct from property manager, refundable fee, lottery viewings",url:"mvgm.nl"},
  {name:"Domakin",type:"niche",price:"Free",sources:"Curated rooms",alerts:"Yes",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"Founded by Bulgarian Society student association. Personalized room search for students new to NL. Community-driven with personal support.",killer:"Community-driven student support, personalized search",url:"domakin.nl"},
  {name:"IamExpat Housing",type:"niche",price:"Free",sources:"Curated listings",alerts:"Email",autoApply:false,scamFilter:false,free:true,tp:"N/A",desc:"Combines rental listings with broader expat resources (jobs, events, guides). One-stop platform for internationals navigating housing + Dutch life. Rental agencies directory.",killer:"Housing + full expat ecosystem, agency directory",url:"iamexpat.nl/housing"},
  {name:"Studentenwoningweb",type:"niche",price:"Free",sources:"Student housing corps",alerts:"Email",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"Dedicated student housing platform. Connected to housing corporations. Long waiting lists but legitimate affordable options.",killer:"Official student housing, housing corporation connections",url:"studentenwoningweb.nl"},
  {name:"HospiHousing",type:"niche",price:"€295 one-time",sources:"Verified host families",alerts:"Yes",autoApply:false,scamFilter:true,free:true,tp:"N/A",desc:"Largest network of verified hosts and guest families. Lower-than-market prices. Private room + shared facilities. No room, no pay concept. Perfect soft landing.",killer:"Host family model, verified hosts, below-market pricing",url:"hospihousing.com"},
];

/* ───────── SECTION COMPONENTS ───────── */

function SectionLandscape(){
  const[filter,setFilter]=useState("all");
  const filtered=filter==="all"?PLATFORMS:PLATFORMS.filter(p=>p.type===filter);
  const counts={all:PLATFORMS.length,aggregator:PLATFORMS.filter(p=>p.type==="aggregator").length,platform:PLATFORMS.filter(p=>p.type==="platform").length,niche:PLATFORMS.filter(p=>p.type==="niche").length};
  return(<div>
    <P>The complete competitive landscape: <strong style={{color:"#a78bfa"}}>{PLATFORMS.length} platforms</strong> across aggregators, listing sites, and niche players. This is every platform your engine needs to aggregate from and compete against.</P>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
      {[["all","All"],["aggregator","Aggregators"],["platform","Listing Platforms"],["niche","Niche/Specialty"]].map(([k,l])=>(
        <button key={k} onClick={()=>setFilter(k)} style={{padding:"7px 16px",borderRadius:8,border:filter===k?"1px solid #a78bfa":"1px solid #ffffff10",background:filter===k?"#a78bfa18":"#0f0f1f",color:filter===k?"#a78bfa":"#6b7280",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>{l} ({counts[k]})</button>
      ))}
    </div>
    {filtered.map(p=>(<div key={p.name} style={{background:"#12122a",border:"1px solid #ffffff08",borderRadius:12,padding:"16px 18px",marginBottom:11}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <h4 style={{margin:0,color:"#e5e7eb",fontSize:15,fontWeight:800}}>{p.name}</h4>
          <Tag color={p.type==="aggregator"?"#a78bfa":p.type==="platform"?"#60a5fa":"#34d399"}>{p.type}</Tag>
          {p.free&&<Tag color="#22c55e">FREE</Tag>}
          {p.autoApply&&<Tag color="#f472b6">AUTO-APPLY</Tag>}
          {p.scamFilter&&<Tag color="#f59e0b">SCAM FILTER</Tag>}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#e5e7eb",fontWeight:800,fontSize:14}}>{p.price}</div>
          {p.tp!=="N/A"&&<div style={{color:"#f59e0b",fontSize:11}}>{"★ "}{p.tp}</div>}
        </div>
      </div>
      <P style={{margin:"6px 0",fontSize:13}}>{p.desc}</P>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:11,color:"#6b7280",marginBottom:5}}>
        <span>{"📡 "}{p.sources}</span><span>{"🔔 "}{p.alerts}</span><span>{"🌐 "}{p.url}</span>
      </div>
      <div style={{background:"#f472b610",borderRadius:6,padding:"5px 10px",borderLeft:"3px solid #f472b6"}}>
        <span style={{color:"#f472b6",fontSize:10,fontWeight:700}}>KILLER FEATURE: </span>
        <span style={{color:"#d1d5db",fontSize:12}}>{p.killer}</span>
      </div>
    </div>))}
  </div>);
}

function SectionFeatures(){
  const c=[
    {n:"Stekkies",push:true,email:true,wa:false,auto:false,chat:false,scam:"Basic",partner:false,crm:false,ext:false,contract:false,wws:false,free:false,p:"€29.95",src:"500+"},
    {n:"Rentbird",push:true,email:true,wa:false,auto:false,chat:false,scam:false,partner:true,crm:false,ext:false,contract:false,wws:false,free:false,p:"€29",src:"1,400+"},
    {n:"RentSlam",push:false,email:true,wa:true,auto:false,chat:false,scam:false,partner:false,crm:false,ext:false,contract:false,wws:false,free:false,p:"€29.95",src:"1,000+"},
    {n:"Findify",push:true,email:true,wa:false,auto:true,chat:true,scam:true,partner:false,crm:false,ext:false,contract:false,wws:true,free:false,p:"€19.99",src:"Verified"},
    {n:"RentHunter",push:false,email:true,wa:false,auto:false,chat:false,scam:true,partner:false,crm:false,ext:false,contract:false,wws:false,free:false,p:"€29",src:"Multi"},
    {n:"Huisly",push:true,email:false,wa:false,auto:false,chat:false,scam:false,partner:false,crm:false,ext:false,contract:false,wws:false,free:true,p:"Free",src:"1,400+"},
    {n:"Uprent",push:true,email:true,wa:false,auto:true,chat:false,scam:false,partner:true,crm:true,ext:true,contract:true,wws:false,free:true,p:"Freemium",src:"239"},
    {n:"Luntero",push:false,email:true,wa:false,auto:false,chat:false,scam:false,partner:false,crm:false,ext:false,contract:false,wws:false,free:true,p:"Free",src:"50+"},
    {n:"YOUR APP",push:true,email:true,wa:true,auto:true,chat:true,scam:true,partner:true,crm:true,ext:true,contract:true,wws:true,free:true,p:"Freemium",src:"1,400+"},
  ];
  const feats=[["push","Push"],["email","Email"],["wa","WhatsApp"],["auto","Auto-Apply"],["chat","Chat"],["scam","Scam"],["partner","Partner"],["crm","CRM"],["ext","Ext."],["contract","Contract"],["wws","WWS"],["free","Free"]];
  const cell=v=>v===true?<span style={{color:"#22c55e",fontWeight:700}}>{"✓"}</span>:v===false?<span style={{color:"#333"}}>{"—"}</span>:<span style={{color:"#f59e0b",fontSize:11}}>{String(v)}</span>;
  return(<div>
    <P>Side-by-side feature comparison of every Dutch rental aggregator. The last row shows the complete superset your platform should target to beat every competitor.</P>
    <div style={{overflowX:"auto",margin:"14px 0"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:820}}>
        <thead><tr>
          <th style={{textAlign:"left",padding:"8px 10px",background:"#1a1a2e",color:"#a78bfa",fontWeight:700,fontSize:10,textTransform:"uppercase",position:"sticky",left:0,zIndex:1}}>Platform</th>
          {feats.map(([k,l])=><th key={k} style={{textAlign:"center",padding:"8px 5px",background:"#1a1a2e",color:"#6b7280",fontWeight:600,fontSize:9,textTransform:"uppercase"}}>{l}</th>)}
          <th style={{textAlign:"center",padding:"8px 5px",background:"#1a1a2e",color:"#6b7280",fontWeight:600,fontSize:9}}>PRICE</th>
          <th style={{textAlign:"center",padding:"8px 5px",background:"#1a1a2e",color:"#6b7280",fontWeight:600,fontSize:9}}>SOURCES</th>
        </tr></thead>
        <tbody>{c.map((r,ri)=>{
          const isY=r.n==="YOUR APP";
          return(<tr key={r.n} style={{background:isY?"#a78bfa10":ri%2===0?"#0f0f1a":"#12122a"}}>
            <td style={{padding:"8px 10px",fontWeight:isY?800:600,color:isY?"#a78bfa":"#d1d5db",borderBottom:"1px solid #ffffff06",position:"sticky",left:0,background:isY?"#1a1a35":ri%2===0?"#0f0f1a":"#12122a",fontSize:12}}>{r.n}</td>
            {feats.map(([k])=><td key={k} style={{textAlign:"center",padding:"8px 5px",borderBottom:"1px solid #ffffff06"}}>{cell(r[k])}</td>)}
            <td style={{textAlign:"center",padding:"8px 5px",borderBottom:"1px solid #ffffff06",color:"#9ca3af",fontWeight:600,fontSize:11}}>{r.p}</td>
            <td style={{textAlign:"center",padding:"8px 5px",borderBottom:"1px solid #ffffff06",color:"#9ca3af",fontSize:11}}>{r.src}</td>
          </tr>);
        })}</tbody>
      </table>
    </div>
    <H3>Unoccupied Feature Combinations (Your Opportunity)</H3>
    {[
      {f:"AI Auto-Apply + In-App Chat + Application CRM",w:"Uprent has auto-apply + CRM. Findify has auto-apply + chat. Nobody has all three combined in one platform.",c:"#f472b6"},
      {f:"WhatsApp + Push + Email (all notification channels)",w:"RentSlam has WhatsApp. Others have push/email. Nobody offers all three channels simultaneously.",c:"#22c55e"},
      {f:"WWS Point Estimation + Contract Review AI",w:"Findify has WWS estimation. Uprent has contract review AI. Nobody combines both rent fairness + contract safety.",c:"#60a5fa"},
      {f:"Free Tier + 1,400+ Sources + Auto-Apply",w:"Huisly is free with 1,400+ sources. Uprent is free with auto-apply. Nobody has free + massive coverage + automation.",c:"#f59e0b"},
      {f:"Transparent Trust Scores + Price Analytics + Neighborhood Intelligence",w:"Nobody provides transparent per-listing trust scores, neighborhood price analytics, or market intelligence dashboards.",c:"#a78bfa"},
    ].map((g,i)=><Card key={i} accent={g.c} title={g.f}><P style={{margin:0,fontSize:13}}>{g.w}</P></Card>)}
  </div>);
}

function SectionReverse(){
  const items=[
    {name:"Stekkies",color:"#f472b6",
      arch:["Fleet of scraper workers per platform, each with a platform-specific parser","Listing pages polled at 30-120s for Funda/Pararius, 5-15 min for agency sites","Detail pages fetched only for new listings (URL/ID diff against seen-set)","Includes Facebook group monitoring (likely via Graph API or headless browser)","Alerts triggered by change-detection: new URL not in seen-set -> normalize -> match filters -> push"],
      speed:"Real-time push notifications. Polling-based detection. Estimated 30-120s latency on major platforms.",
      antibot:"Must handle Cloudflare on Funda. Likely residential proxies + Playwright with stealth. Lower-protection sites via httpx.",
      legal:"Link-back model - redirects to source. Charges users (not landlords). Positions as search engine."},
    {name:"Rentbird",color:"#fb923c",
      arch:["Claims 1,400+ sites - maintains massive registry of makelaar/agency sites with per-site configs","Generic HTML parsers (CSS selector-based) with fallback to regex for agencies without APIs","Batch-crawls long tail (agency sites) at 15-60 min, prioritizes big platforms","Partner search feature suggests some agencies provide feeds (RSS, API, or email ingestion)","For agencies without APIs, uses generic parsers with CSS selectors + regex fallback"],
      speed:"Good but not fastest. Some users report 30-minute delays vs competitors. Push + email alerts.",
      antibot:"Similar to Stekkies. Residential proxies for Funda. Direct requests for most agency sites.",
      legal:"Most established brand - likely has legal counsel. Link-back model. May have informal agreements with some platforms."},
    {name:"RentSlam",color:"#34d399",
      arch:["AI-powered matching across 1,000+ platforms - the AI likely refers to NLP matching/ranking logic","WhatsApp integration via Business API - unique channel advantage for instant delivery","Aggressive polling on major platforms (possibly sub-minute on Funda/Pararius)","Incremental scraping: sort by newest, stop at first previously-seen listing","40,000+ users means significant infrastructure and proxy costs"],
      speed:"Speed is core brand. Sub-minute on Funda/Pararius. WhatsApp delivery = instant (faster than email).",
      antibot:"Standard approaches at scale. 40K users requires significant proxy infrastructure.",
      legal:"Standard link-back model. Positions as search engine. Claims AI-powered (good for transformative use defense)."},
    {name:"Findify",color:"#60a5fa",
      arch:["Most sophisticated product architecture of all competitors","Sources only from verified agencies - uses whitelist + partnerships, reducing scraping complexity","Auto-apply requires form submission automation (Playwright-based form detection + filling)","In-app landlord chat requires WebSocket messaging backend with notification system","WWS point estimation requires property data analysis engine calculating Dutch housing valuation","Claims 30-second alerts - fastest in market, likely using API interception on major platforms"],
      speed:"Claims 30-second alerts = fastest in market. Likely API interception on major platforms + aggressive polling.",
      antibot:"Verified-agency-only sourcing massively reduces anti-bot problems. May have API partnerships with some agencies.",
      legal:"Highest legal risk due to auto-apply (potential ToS violation on target platforms). Mitigated by agency-only sourcing. Cheapest at €19.99/mo."},
    {name:"Uprent",color:"#a78bfa",
      arch:["Most technically innovative platform in the market","AI agent 'Bob' auto-applies - sophisticated form detection and filling automation","Chrome browser extension intercepts listings on other sites in real-time","Application CRM/dashboard tracks all applications with status updates","Contract review AI uses NLP/LLM to detect unfair clauses before signing","Aggregates from 239 distinct platforms with unique-only policy (avoids re-aggregators)","Free tier + paid Confident plan for AI features"],
      speed:"Push + email alerts. Competitive speed but some users report bugs like duplicate applications.",
      antibot:"239 platforms requires diverse anti-bot strategies. Likely tiered approach matching our proposed architecture.",
      legal:"Auto-apply is legally aggressive. Free tier reduces commercial exploitation arguments. Open about scraping 200+ sites in marketing."},
    {name:"Huisly",color:"#22c55e",
      arch:["Free model funded differently (likely affiliates, data insights, or pre-launch growth strategy)","1,400+ sources - matching Rentbird's coverage but completely free","Native iOS and Android apps with push notifications","Simpler feature set (no auto-apply) reduces engineering complexity significantly","Also covers the buying market - broader TAM than rental-only competitors","5-star Trustpilot rating suggests strong product-market fit"],
      speed:"Push notifications via native apps. Competitive speed.",
      antibot:"Similar challenges to Rentbird/Stekkies at 1,400+ sources. Likely similar infrastructure.",
      legal:"Free = harder to argue commercial exploitation. Clean link-back model. Strongest legal positioning of all competitors."},
  ];
  return(<div>
    <P>Deep analysis of how each major aggregator likely works internally, based on product behavior, public claims, user reviews, and technical analysis.</P>
    {items.map(c=>(<div key={c.name} style={{background:"#12122a",border:"1px solid #ffffff08",borderRadius:12,padding:"20px",marginBottom:14}}>
      <h4 style={{color:c.color,margin:"0 0 14px",fontSize:17,fontWeight:800}}>{c.name}</h4>
      <div style={{marginBottom:12}}>
        <span style={{color:c.color,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>INFERRED ARCHITECTURE</span>
        <Bullet items={c.arch} />
      </div>
      {[["SPEED STRATEGY",c.speed],["ANTI-BOT HANDLING",c.antibot],["LEGAL POSITIONING",c.legal]].map(([l,t])=>(
        <div key={l} style={{marginBottom:8}}>
          <span style={{color:c.color,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</span>
          <P style={{margin:"3px 0 0",fontSize:13}}>{t}</P>
        </div>
      ))}
    </div>))}
  </div>);
}

function SectionRepos(){
  const repos=[
    {name:"Hestia",author:"wtfloris",stars:228,commits:498,lang:"Python",desc:"Most mature open-source project. Scrapes real estate websites for new rental listings, broadcasts via Telegram. Plugin architecture for per-site parsers.",
      s:["Plugin parser architecture (one class per site, common interface)","Docker + CI/CD pipeline (GitHub Actions)","Most active dev history (498 commits, 69 forks)","Community contributions"],
      w:["No deduplication across platforms","No fraud detection","Telegram-only alerting","No normalization schema"],
      verdict:"Best reference architecture for the parser plugin system. Adopt the one-class-per-site pattern with common interface. Docker setup is reusable.",
      reuse:"Parser interface pattern, Docker setup, CI/CD",rewrite:"Everything else (no dedup, no fraud, no normalization)",c:"#34d399"},
    {name:"Letify",author:"KevinHang",stars:52,commits:145,lang:"Python",desc:"Full-stack rental monitoring for Funda, Pararius with Telegram alerts. Custom bot prevention algorithms. 1,000+ production users. MIT licensed.",
      s:["Production-tested at scale (1,000+ users)","Custom anti-bot evasion (browser fingerprinting, request timing)","PostgreSQL database schema exists","MIT licensed - can freely reuse"],
      w:["Monolithic (scraping + storage + alerting in one app)","No cross-platform deduplication","Breaks when platform HTML changes","No normalization layer"],
      verdict:"Best reference for anti-bot patterns and production realities. Learn from their evasion techniques. Rewrite architecture into services.",
      reuse:"Anti-bot logic, DB schema concepts, parser patterns",rewrite:"Architecture (split into service-oriented)",c:"#a78bfa"},
    {name:"funda-scraper",author:"whchien",stars:155,commits:126,lang:"Python",desc:"Pip-installable Funda scraper. Clean API: FundaScraper(area='amsterdam', want_to='rent'). Handles pagination. Outputs to pandas DataFrame. Historical data support.",
      s:["Clean API design (area, want_to params)","Pagination handling","Good field coverage for Funda","Structured pandas output"],
      w:["No anti-bot (will be blocked at scale by Cloudflare)","Single-site only (Funda)","No real-time capability","Fragile to HTML changes"],
      verdict:"Good reference for Funda page structure and data fields. Do NOT use directly in production - Cloudflare will block it immediately.",
      reuse:"Funda field mapping, URL patterns, pagination logic",rewrite:"Entire scraping approach (needs Playwright + proxies)",c:"#f472b6"},
    {name:"ParariusBot",author:"ashokolarov",stars:14,commits:14,lang:"Python",desc:"Auto-applies to Pararius listings based on YAML filters. Uses Selenium for form submission. Born from housing market frustration.",
      s:["Demonstrates full scrape -> filter -> auto-apply pipeline","YAML config is good UX pattern","Shows how Pararius forms/fields work","Real-world motivation (housing crisis)"],
      w:["Selenium is slow and detectable","Single-site only","No error handling for blocks","Auto-apply is legally risky"],
      verdict:"Useful reference for Pararius page structure and auto-apply flow. Replace Selenium with Playwright. Auto-apply needs explicit user consent + legal review.",
      reuse:"Pararius form field mapping, YAML config pattern",rewrite:"Selenium -> Playwright with stealth, add consent flow",c:"#fb923c"},
    {name:"home-finder",author:"WeRules",stars:22,commits:45,lang:"JavaScript",desc:"Gatsby (React) frontend for displaying aggregated listings + companion scraping script. Clean separation of concerns.",
      s:["Clean frontend patterns for listing display","Good separation (data collection vs display)","React/Gatsby architecture"],
      w:["Frontend-focused, not useful for aggregation engine","No scraping intelligence"],
      verdict:"Reference for frontend data display patterns only. Not relevant to the aggregation engine itself.",
      reuse:"Display card patterns if building frontend",rewrite:"N/A (different concern)",c:"#6b7280"},
    {name:"funda-analysis",author:"nathmota",stars:10,commits:30,lang:"Python",desc:"Data analysis pipeline for Funda listings. Pandas + visualization for analyzing scraped data.",
      s:["Shows which fields are analytically valuable","Good pandas pipeline patterns"],
      w:["Not real-time","Analysis only, no scraping"],
      verdict:"Useful for understanding which Funda fields matter for analytics. Not relevant to real-time aggregation.",
      reuse:"Field importance insights",rewrite:"N/A",c:"#6b7280"},
  ];
  return(<div>
    <P>Deep analysis of every relevant open-source repository. For each: purpose, architecture, what to learn, what to steal, and what to skip.</P>
    {repos.map(r=>(<div key={r.name} style={{background:"#12122a",border:"1px solid #ffffff08",borderRadius:12,padding:"18px 20px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
        <h4 style={{margin:0,color:r.c,fontSize:16,fontWeight:800}}>{r.name}</h4>
        <span style={{color:"#6b7280",fontSize:12}}>by {r.author}</span>
        <Tag color="#f59e0b">{"⭐"}{r.stars}</Tag>
        <Tag color="#6b7280">{r.commits} commits</Tag>
        <Tag color="#60a5fa">{r.lang}</Tag>
      </div>
      <P style={{marginBottom:10,fontSize:13}}>{r.desc}</P>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:10}}>
        <div style={{flex:1,minWidth:180}}>
          <div style={{color:"#22c55e",fontSize:10,fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>STRENGTHS</div>
          {r.s.map((s,i)=><div key={i} style={{color:"#9ca3af",fontSize:12,padding:"1px 0"}}>{"✓ "}{s}</div>)}
        </div>
        <div style={{flex:1,minWidth:180}}>
          <div style={{color:"#ef4444",fontSize:10,fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>WEAKNESSES</div>
          {r.w.map((w,i)=><div key={i} style={{color:"#9ca3af",fontSize:12,padding:"1px 0"}}>{"✗ "}{w}</div>)}
        </div>
      </div>
      <div style={{background:r.c+"10",borderRadius:6,padding:"8px 12px",borderLeft:`3px solid ${r.c}`,marginBottom:8}}>
        <span style={{color:r.c,fontSize:11,fontWeight:700}}>VERDICT: </span>
        <span style={{color:"#d1d5db",fontSize:12}}>{r.verdict}</span>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <div style={{flex:1,background:"#22c55e10",borderRadius:6,padding:"5px 10px",borderLeft:"2px solid #22c55e"}}>
          <span style={{color:"#22c55e",fontSize:10,fontWeight:700}}>REUSE: </span><span style={{color:"#d1d5db",fontSize:12}}>{r.reuse}</span>
        </div>
        <div style={{flex:1,background:"#ef444410",borderRadius:6,padding:"5px 10px",borderLeft:"2px solid #ef4444"}}>
          <span style={{color:"#ef4444",fontSize:10,fontWeight:700}}>REWRITE: </span><span style={{color:"#d1d5db",fontSize:12}}>{r.rewrite}</span>
        </div>
      </div>
    </div>))}
  </div>);
}

function SectionArch(){
  return(<div>
    <P>The complete system architecture. Your engine is a 7-stage pipeline: Schedule, Scrape, Normalize, Deduplicate, Score, Store, Alert. Each stage is a separate service that communicates via Redis.</P>
    <H3>System Architecture Diagram</H3>
    <svg viewBox="0 0 700 520" style={{width:"100%",maxWidth:720,margin:"0 auto 20px",display:"block"}} xmlns="http://www.w3.org/2000/svg">
      <rect width="700" height="520" fill="#0a0a1a" rx="12"/>
      {[
        {x:230,y:12,w:240,h:40,l:"SCHEDULER SERVICE",s:"Per-source cron, priority queue",c:"#a78bfa"},
        {x:260,y:72,w:180,h:32,l:"REDIS + BULLMQ",s:"",c:"#f59e0b"},
      ].map((b,i)=><g key={i}><rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill="#1a1a2e" stroke={b.c} strokeWidth="1.5"/><text x={b.x+b.w/2} y={b.y+(b.s?b.h/2-3:b.h/2+4)} textAnchor="middle" fill={b.c} fontSize="11" fontWeight="700" fontFamily="sans-serif">{b.l}</text>{b.s ? <text x={b.x+b.w/2} y={b.y+b.h/2+10} textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="sans-serif">{b.s}</text> : null}</g>)}
      <line x1="350" y1="52" x2="350" y2="72" stroke="#a78bfa44" strokeWidth="2"/>
      <line x1="350" y1="104" x2="350" y2="120" stroke="#f59e0b44" strokeWidth="2"/>
      <rect x="40" y="120" width="620" height="75" rx="8" fill="#0f0f1f" stroke="#22c55e44" strokeWidth="1"/>
      <text x="350" y="137" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="700" fontFamily="sans-serif">SCRAPER WORKER POOL</text>
      {[["Funda","#ef4444",100],["Pararius","#60a5fa",210],["Kamernet","#f59e0b",320],["HousingAny","#a78bfa",430],["Agencies","#34d399",550]].map(([n,c,x])=>(
        <g key={n}><rect x={x-30} y={148} width={72} height={28} rx="5" fill="#1a1a2e" stroke={c} strokeWidth="1"/><text x={x+6} y={166} textAnchor="middle" fill={c} fontSize="9" fontWeight="600" fontFamily="sans-serif">{n}</text></g>
      ))}
      <rect x="130" y="180" width="440" height="22" rx="4" fill="#1a1a2e" stroke="#f472b644" strokeWidth="1"/>
      <text x="350" y="194" textAnchor="middle" fill="#f472b6" fontSize="9" fontWeight="600" fontFamily="sans-serif">PROXY MANAGER — Residential IP Rotation + Health Checks</text>
      <line x1="350" y1="202" x2="350" y2="220" stroke="#22c55e44" strokeWidth="2"/>
      {[
        {y:220,l:"NORMALIZER",s:"Schema mapping, Address parsing, Price parsing",c:"#60a5fa"},
        {y:275,l:"DEDUPLICATOR",s:"Address + Image hash + Price matching",c:"#f472b6"},
        {y:330,l:"TRUST / FRAUD SCORER",s:"Price anomaly, Scam patterns, Source trust, Image reuse",c:"#f59e0b"},
        {y:385,l:"PostgreSQL + Redis",s:"Canonical listings, Source records, Fraud log",c:"#a78bfa"},
      ].map((b,i)=><g key={i}>
        <rect x={200} y={b.y} width={300} height={40} rx="8" fill="#1a1a2e" stroke={b.c} strokeWidth="1.5"/>
        <text x={350} y={b.y+16} textAnchor="middle" fill={b.c} fontSize="11" fontWeight="700" fontFamily="sans-serif">{b.l}</text>
        <text x={350} y={b.y+30} textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="sans-serif">{b.s}</text>
        {i < 3 ? <line x1="350" y1={b.y+40} x2="350" y2={b.y+55} stroke={b.c+"44"} strokeWidth="2"/> : null}
      </g>)}
      <line x1="350" y1="425" x2="350" y2="445" stroke="#a78bfa44" strokeWidth="2"/>
      <rect x="160" y="445" width="380" height="44" rx="10" fill="#1a1a2e" stroke="#a78bfa" strokeWidth="2"/>
      <text x="350" y="464" textAnchor="middle" fill="#e5e7eb" fontSize="11" fontWeight="700" fontFamily="sans-serif">EVENT BUS / ALERTING SERVICE</text>
      <text x="350" y="480" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="sans-serif">Match user filters → Push / Email / WhatsApp / Webhook</text>
    </svg>
    <H3>Service Breakdown</H3>
    <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead><tr>{["Service","Responsibility","Technology"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",background:"#1a1a2e",color:"#a78bfa",fontWeight:700,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
      <tbody>{[
        ["Scheduler","Crawl intervals per source, priority queuing","Node.js + BullMQ repeatable jobs"],
        ["Queue","Decouples scheduling from execution","Redis + BullMQ"],
        ["Scraper Workers","Platform-specific scraping logic","Python (Playwright for JS, httpx for static)"],
        ["Proxy Manager","IP rotation, health checking, geo-targeting","BrightData/Oxylabs + custom rotation"],
        ["Normalizer","Maps raw data to canonical schema","Python microservice"],
        ["Deduplicator","Cross-platform entity resolution","Python + PostgreSQL fuzzy matching"],
        ["Trust Scorer","Fraud detection and risk scoring","Python + rule engine → ML"],
        ["Datastore","Persistent storage + caching","PostgreSQL + Redis"],
        ["Event Bus","Real-time alerting pipeline","Redis Pub/Sub or BullMQ"],
      ].map((r,i)=><tr key={i} style={{background:i%2===0?"#0f0f1a":"#12122a"}}>{r.map((c,j)=><td key={j} style={{padding:"8px 12px",borderBottom:"1px solid #ffffff06",color:"#d1d5db"}}>{c}</td>)}</tr>)}</tbody>
    </table></div>
    <H3>Pipeline Latency: Target under 30 seconds</H3>
    <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",margin:"16px 0"}}>
      {[{l:"Poll Detects",t:"~15s",c:"#a78bfa"},{l:"Fetch+Parse",t:"+3s",c:"#22c55e"},{l:"Normalize",t:"+1s",c:"#60a5fa"},{l:"Dedup",t:"+2s",c:"#f472b6"},{l:"Score",t:"+1s",c:"#f59e0b"},{l:"Alert",t:"+3s",c:"#22c55e"}].map((s,i)=>(
        <div key={i} style={{background:"#12122a",border:`1px solid ${s.c}44`,borderRadius:8,padding:"10px 14px",textAlign:"center",minWidth:85}}>
          <div style={{color:s.c,fontSize:10,fontWeight:700}}>{s.l}</div>
          <div style={{color:s.c,fontSize:16,fontWeight:800,fontFamily:"monospace",marginTop:3}}>{s.t}</div>
        </div>
      ))}
    </div>
  </div>);
}

function SectionScraping(){
  return(<div>
    <H3>Platform Classification and Approach</H3>
    <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead><tr>{["Platform","Type","Protection","Tool","Proxy","Rate Limit"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",background:"#1a1a2e",color:"#a78bfa",fontWeight:700,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
      <tbody>{[
        ["Funda","Dynamic JS + Cloudflare","HIGH","Playwright + stealth","Residential NL","1 req / 5s"],
        ["Pararius","Server-rendered","MEDIUM","httpx async","Datacenter rotating","1 req / 2s"],
        ["Kamernet","Dynamic JS + auth","MEDIUM","Playwright + sessions","Residential","1 req / 3s"],
        ["HousingAnywhere","React SPA + API","MEDIUM","API interception","Datacenter","1 req / 2s"],
        ["Huurwoningen.nl","Server-rendered","LOW","httpx","Direct / datacenter","1 req / 1s"],
        ["Jaap.nl","Server-rendered","LOW","httpx","Direct","1 req / 1s"],
        ["DirectWonen","Server-rendered","LOW","httpx","Direct","1 req / 1s"],
        ["Agency sites (1000+)","Mixed","LOW-NONE","httpx with Playwright fallback","Direct","1 req / 1s"],
      ].map((r,i)=><tr key={i} style={{background:i%2===0?"#0f0f1a":"#12122a"}}>{r.map((c,j)=><td key={j} style={{padding:"8px 12px",borderBottom:"1px solid #ffffff06",color:"#d1d5db"}}>{j===2?<Tag color={c==="HIGH"?"#ef4444":c==="MEDIUM"?"#f59e0b":"#22c55e"}>{c}</Tag>:c}</td>)}</tr>)}</tbody>
    </table></div>
    <H3>Tool Selection</H3>
    <Card title="Primary: Playwright (Python) — JS-heavy/protected sites" accent="#a78bfa">
      <Bullet items={["Use playwright-stealth to patch detectable browser fingerprints (navigator.webdriver, chrome.runtime, Permissions.query)","Run persistent browser contexts to maintain cookies/sessions across requests","Intercept network requests to capture API responses directly (10x faster than DOM parsing)","Headed mode with --no-sandbox for better stealth against Cloudflare","Simulate mouse movement and scrolling before extracting data"]} />
    </Card>
    <Card title="Secondary: httpx (async) + selectolax — static/light sites" accent="#34d399">
      <Bullet items={["Async HTTP client, 10x faster than requests, native HTTP/2 support","Use httpx.AsyncClient for connection pooling across requests","Combine with selectolax (C-based HTML parser, 20x faster than BeautifulSoup)","Add random delays (0.5-2s) between requests to avoid rate limiting"]} />
    </Card>
    <Card title="Do NOT use these tools" accent="#ef4444">
      <Bullet items={["Scrapy: Too opinionated for real-time monitoring. Designed for batch crawling, not sub-minute polling.","Selenium: Slow, easily detectable, no stealth support. Use Playwright instead.","BeautifulSoup: Slow parser. selectolax is 20x faster with similar API."]} />
    </Card>
    <H3>Proxy Strategy</H3>
    <Card title="Funda (Cloudflare-protected)" accent="#ef4444">
      <Bullet items={["Residential proxies mandatory — datacenter IPs instantly flagged","Netherlands-geolocated residential IPs (BrightData, Oxylabs, NetNut)","Rotate IPs per-request for listing pages, sticky sessions (5-10 min) for detail pages","Budget: ~$15-25/GB. At 50KB/page and 10K requests/day = ~$8-12/day"]} />
    </Card>
    <Card title="Pararius + medium sites" accent="#f59e0b"><P style={{margin:0,fontSize:13}}>Datacenter proxies with rotation suffice (~$1-3/GB). Rotate user-agents to match common Dutch browsers.</P></Card>
    <Card title="Agency sites (low protection)" accent="#22c55e"><P style={{margin:0,fontSize:13}}>Direct requests from your server work initially. Add proxy rotation only if rate-limited.</P></Card>
    <H3>Anti-Detection Checklist</H3>
    <Bullet items={[
      "1. Browser fingerprint: playwright-stealth removes navigator.webdriver, patches chrome.runtime, Permissions.query",
      "2. TLS fingerprint: Use real browser (Playwright) not HTTP libs for protected sites — HTTP libs have detectable ja3 fingerprints",
      "3. Request headers: Match real Chrome exactly (Accept, Accept-Language, sec-ch-ua, Accept-Encoding)",
      "4. Timing: Random delays 2-8s for Funda, 0.5-2s for others. NEVER exact intervals.",
      "5. Behavioral: Simulate mouse movement, scrolling before extraction. Cloudflare tracks interaction patterns.",
      "6. Cookies: Accept and persist across sessions. Cloudflare sets tracking cookies.",
      "7. Rate limiting: Per-domain limiters. Funda max 1/5s, Pararius 1/2s, agencies 1/1s.",
    ]} />
    <H3>Parser Resilience</H3>
    <P>Parsers WILL break when platforms update HTML. Build multi-layer resilience:</P>
    <Bullet items={[
      "Multi-strategy: CSS selector -> XPath -> regex -> LLM extraction fallback",
      "Schema validation: Every parsed listing must pass JSON Schema check. Missing required fields = parser broken alert.",
      "Health monitoring: Track success rate per parser. Below 90% = auto-disable + alert.",
      "Snapshot testing: Store reference HTML per platform. Run parser tests against snapshots in CI.",
    ]} />
  </div>);
}

function SectionSpeed(){
  return(<div>
    <P style={{color:"#f472b6",fontWeight:700}}>Speed is the single most important competitive advantage. Users who respond first get viewings. Target: under 30 seconds from listing published to user alerted.</P>
    <H3>Adaptive Polling Tiers</H3>
    {[
      {t:"T0 Critical",s:"Funda, Pararius",i:"30-60 seconds",r:"Highest volume, most competitive",c:"#ef4444"},
      {t:"T1 High",s:"Kamernet, Huurwoningen, HousingAnywhere",i:"2-5 minutes",r:"Good volume, moderate competition",c:"#f59e0b"},
      {t:"T2 Medium",s:"Jaap.nl, DirectWonen, VBO, Huislijn",i:"5-15 minutes",r:"Lower volume",c:"#60a5fa"},
      {t:"T3 Long tail",s:"Individual agency sites (1000+)",i:"15-60 minutes",r:"Low volume but unique listings",c:"#6b7280"},
    ].map(t=>(<div key={t.t} style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0",borderBottom:"1px solid #ffffff06"}}>
      <Tag color={t.c}>{t.t}</Tag><span style={{color:"#d1d5db",fontSize:13,flex:1}}>{t.s}</span>
      <strong style={{color:t.c,fontFamily:"monospace",fontSize:13}}>{t.i}</strong>
    </div>))}
    <H3>Incremental Scraping (Critical)</H3>
    <Bullet items={[
      "Sort by newest: Always request listings sorted by date (newest first)",
      "Stop at known: Iterate until you hit a previously-seen listing ID -> stop",
      "Hash-based diff: Hash the listing URL list. If identical to last poll -> skip entirely",
      "Conditional requests: Use If-Modified-Since / ETag headers when available",
    ]} />
    <H3>API Interception (Fastest Method)</H3>
    <Card title="10x faster than HTML parsing" accent="#22c55e">
      <Bullet items={[
        "Funda: Uses internal GraphQL/REST API for search results. Intercept XHR in Playwright, parse JSON directly.",
        "HousingAnywhere: React SPA with REST API. Call the API endpoint directly with appropriate headers.",
        "Pararius: Server-rendered but has undocumented API for filtering. Reverse-engineer via DevTools.",
        "How to find APIs: DevTools -> Network tab -> filter XHR/Fetch -> search for listings -> inspect JSON responses.",
      ]} />
    </Card>
    <H3>Time-of-Day Optimization</H3>
    <P>Dutch rental listings follow predictable patterns. Peak posting: 8:00-10:00 and 13:00-15:00 on weekdays. Low posting: evenings and weekends. Increase polling frequency during peak hours. Reduce at night to save proxy costs.</P>
  </div>);
}

function SectionDedup(){
  return(<div>
    <P>The same listing often appears on Funda + Pararius + agency site. Users must see each property once, with all sources linked.</P>
    <H3>Multi-Signal Scoring Model</H3>
    <Code>{`DEDUP_SCORE = (
  address_score * 0.35 +   // Postal code + house number = strongest signal
  price_score   * 0.20 +   // Within 2% = 1.0, within 5% = 0.8, within 10% = 0.5
  size_score    * 0.15 +   // m² comparison with 5-10% tolerance
  image_score   * 0.20 +   // Perceptual hash (pHash) comparison
  geo_score     * 0.10     // Lat/lng distance
)

> 0.80  =  DUPLICATE (auto-merge into canonical listing)
0.60-0.80 =  PROBABLE DUPLICATE (flag for review)
below 0.60 =  DISTINCT (separate listings)`}</Code>
    <H3>Address Matching (Highest Signal)</H3>
    <P>Dutch addresses follow: <code style={{background:"#1a1a2e",color:"#a78bfa",padding:"2px 6px",borderRadius:4,fontSize:13}}>[street] [number][suffix], [postal_code] [city]</code></P>
    <Bullet items={[
      "Parse: Extract street, number, suffix (a/b/c/1/2), postal code, city using Dutch address regex",
      "Normalize: Lowercase, remove diacritics, expand abbreviations (str.→straat, gr.→gracht, ln.→laan)",
      "Exact match: postal_code + house_number + suffix = 1.0 score",
      "Same building: postal_code + house_number (different suffix) = 0.85",
      "Fuzzy: Trigram similarity on street name + matching house number = 0.9",
    ]} />
    <H3>Image Similarity (Strong Secondary Signal)</H3>
    <Bullet items={[
      "Compute perceptual hash (pHash/dHash) for first 2-3 listing images",
      "Hamming distance < 10 between hashes = same image = score 1.0",
      "Strong dedup signal even when addresses formatted differently across platforms",
      "Use imagehash Python library (pip install imagehash)",
    ]} />
    <H3>Canonical Listing System</H3>
    <P>When duplicates detected, create a canonical listing merging best data from each source:</P>
    <Code>{`CanonicalListing:
  id: uuid
  best_address: (from source with most complete address)
  best_price: (lowest non-suspicious price)
  best_images: (highest resolution set)
  sources: [
    { platform: "funda", url: "...", first_seen, last_seen },
    { platform: "pararius", url: "...", first_seen, last_seen },
  ]
  trust_score: 0.92
  status: active | removed | expired`}</Code>
  </div>);
}

function SectionFraud(){
  return(<div>
    <P>The Dutch rental market has significant scam problems. Detecting and flagging suspicious listings builds trust and differentiates your product.</P>
    <H3>Risk Scoring Model</H3>
    <Code>{`trust_score = 1.0 - (
  price_anomaly_risk    * 0.25 +   // vs neighborhood median price per m²
  source_risk           * 0.20 +   // platform verification level
  image_risk            * 0.20 +   // stock photos, reuse, quality mismatch
  text_risk             * 0.15 +   // scam phrases, language patterns
  listing_behavior_risk * 0.10 +   // relisting, cross-posting patterns
  contact_risk          * 0.10     // non-Dutch numbers, free email domains
)`}</Code>
    <H3>Fraud Signal Details</H3>
    {[
      {s:"Price Anomalies (strongest signal)",d:"Compute median price/m² per neighborhood per property type. If listing < 60% of median = HIGH RISK. Example: 70m² in Amsterdam Centrum at €800/month when median is €1,800 is almost certainly a scam.",c:"#ef4444"},
      {s:"Source Trust Levels",d:"Funda via NVM makelaar: 0.95 trust. Pararius: 0.85. Kamernet: 0.70. Facebook/Marketplace: 0.40. Maintain these as configurable platform trust scores.",c:"#f59e0b"},
      {s:"Image Analysis",d:"Reverse image search for stock photos and stolen listing images. Quality mismatch (professional luxury photos + suspiciously low price). No images at all = moderate risk. EXIF data location inconsistencies.",c:"#a78bfa"},
      {s:"Text Analysis",d:"Scam red flags: 'deposit via Western Union', 'I am abroad', 'send money before viewing', 'keys will be sent', 'no viewing needed', 'WhatsApp only'. English on Dutch-only platforms targeting expats.",c:"#f472b6"},
      {s:"Listing Behavior",d:"Listing appears/disappears frequently (relisted scam). Same listing text/images with different addresses across sites. Simultaneous identical posting across many platforms (combine with other signals - agencies do this legitimately too).",c:"#60a5fa"},
      {s:"Contact Information",d:"Non-Dutch phone numbers (weak signal, not definitive). Free email (gmail, hotmail) instead of agency domain. Same phone number appearing across multiple unrelated listings.",c:"#34d399"},
    ].map(f=><Card key={f.s} title={f.s} accent={f.c}><P style={{margin:0,fontSize:13}}>{f.d}</P></Card>)}
    <H3>Implementation Phases</H3>
    <Card title="Phase 1: Rules (Week 1)" accent="#22c55e"><P style={{margin:0,fontSize:13}}>Start rule-based: price deviation + source trust map + keyword matching for scam phrases. Works well for obvious scams. Fast to implement.</P></Card>
    <Card title="Phase 2: ML (After 500+ labeled examples)" accent="#a78bfa"><P style={{margin:0,fontSize:13}}>Train classifier on manually labeled data (scam vs legitimate). Features: price deviation, source, text embeddings, image hashes, contact patterns. Even simple logistic regression outperforms rules with enough data.</P></Card>
  </div>);
}

function SectionLegal(){
  return(<div>
    <H3>Key Legal Risks in EU/NL</H3>
    <Card title="1. EU Database Directive — Sui Generis Right (BIGGEST RISK)" accent="#ef4444">
      <P style={{margin:0,fontSize:13}}>Grants database creators with "substantial investment" the right to prevent extraction of "the whole or a substantial part." Funda invests substantially in verifying listings — almost certainly qualifies. HOWEVER: individual factual data points (address, price, size) are NOT protected. Only the database as a whole or substantial part. Extracting individual listings and transforming/enriching the data is lower risk.</P>
    </Card>
    <Card title="2. Terms of Service (Enforceable)" accent="#f59e0b">
      <P style={{margin:0,fontSize:13}}>Per Ryanair v. PR Aviation (ECJ/Dutch Supreme Court): even unprotected databases can restrict scraping through contractual terms. Funda and Pararius both prohibit scraping in their ToS. Violation could support breach-of-contract claim enforceable under Dutch law.</P>
    </Card>
    <Card title="3. Copyright" accent="#60a5fa">
      <P style={{margin:0,fontSize:13}}>Factual data (price, address, number of rooms) is NOT copyrightable. Listing descriptions (written by agents) and photographs ARE copyrighted. Reproducing full descriptions or displaying full-resolution photos = copyright infringement.</P>
    </Card>
    <Card title="4. GDPR" accent="#a78bfa">
      <P style={{margin:0,fontSize:13}}>If listings contain personal data (landlord names, phone numbers, personal emails), scraping triggers GDPR obligations. Need lawful basis (likely legitimate interest) and must handle data subject requests.</P>
    </Card>
    <H3>The "Google Model" — Legally Safer Aggregation</H3>
    {[
      ["Link, don't copy","Store minimum metadata for filtering. Always link back to original. Never reproduce full descriptions."],
      ["Minimal data retention","Store: address, price, size, rooms, type, URL, thumbnail URL (hotlinked). Do NOT store: descriptions, hi-res images, agent contact details."],
      ["Transformative value","Add cross-platform dedup, price analytics, fraud scoring, faster alerting. Positions you as transformative service, not mere copy."],
      ["Attribution","Always clearly show source platform. Link directly to original listing. Prominent 'View on [Source]' button."],
      ["Opt-out mechanism","Let platforms/agents request removal. Respond within 48 hours. Log all requests and response times."],
      ["robots.txt compliance","Respect robots.txt as strong good-faith signal. Document compliance for potential legal defense."],
    ].map(([t,d],i)=>(<div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid #ffffff06"}}>
      <span style={{color:"#22c55e",fontWeight:800}}>{"✓"}</span>
      <div><strong style={{color:"#e5e7eb",fontSize:13}}>{t}: </strong><span style={{color:"#9ca3af",fontSize:13}}>{d}</span></div>
    </div>))}
    <H3>Risk Level Table</H3>
    {[
      ["Store address, price, size, rooms, link","#22c55e","LOW","Factual data, minimal extraction"],
      ["Link back to source for full details","#22c55e","LOW","Google-model aggregation"],
      ["Store factual data + provide analytics/scoring","#22c55e","LOW","Transformative use"],
      ["Provide opt-out mechanism","#3b82f6","RISK REDUCER","Shows good faith"],
      ["Hotlink thumbnail images","#f59e0b","MEDIUM","Gray area; some platforms block hotlinks"],
      ["Scrape behind login (Kamernet)","#f97316","MED-HIGH","Potential ToS violation + circumvention"],
      ["Auto-apply on behalf of users","#f97316","MED-HIGH","Tortious interference, ToS violation"],
      ["Scrape at rate impacting site performance","#ef4444","HIGH","Computer misuse / tort claim"],
      ["Store full listing descriptions","#ef4444","HIGH","Copyright infringement"],
      ["Download and host listing photos","#ef4444","HIGH","Copyright infringement"],
      ["Cache full database mirror","#ef4444","HIGH","Sui generis database right violation"],
    ].map(([p,c,r,n])=>(<div key={p} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:"1px solid #ffffff06"}}>
      <Tag color={c}>{r}</Tag><span style={{color:"#d1d5db",fontSize:12.5,flex:1}}>{p}</span><span style={{color:"#6b7280",fontSize:11}}>{n}</span>
    </div>))}
    <H3>What You Store vs. What You Do NOT Store</H3>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <Card title="STORE (minimal)" accent="#22c55e"><div style={{fontSize:12,color:"#9ca3af",lineHeight:1.8}}>Listing URL (canonical link) · Address (parsed, normalized) · Price · Size (m²) · Number of rooms · Property type · Listing date (first_seen) · Thumbnail URL (hotlinked, NOT downloaded) · Source platform · Your trust/fraud score · Your dedup group ID</div></Card>
      <Card title="DO NOT STORE" accent="#ef4444"><div style={{fontSize:12,color:"#9ca3af",lineHeight:1.8}}>Full description text · High-resolution photos · Agent personal contact info · Full HTML pages · Cached copies of listings</div></Card>
    </div>
    <H3>Legal Defense Preparation</H3>
    <Bullet items={[
      "Maintain log of all opt-out requests and response times",
      "Document robots.txt compliance per platform",
      "Keep evidence of transformative value (analytics, fraud detection, dedup)",
      "Implement rate limiting so scraping never degrades source site performance",
      "Consult a Dutch IP lawyer before scaling commercially — worth the €2-5K investment",
    ]} />
  </div>);
}

function SectionData(){
  return(<div>
    <P>Complete PostgreSQL schema for the aggregation engine. Designed for minimal storage (legal compliance) with maximum query performance.</P>
    <Code>{`-- Source platforms registry
CREATE TABLE sources (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE,         -- 'funda', 'pararius'
    base_url        TEXT NOT NULL,
    trust_level     REAL DEFAULT 0.8,             -- platform-level trust
    poll_interval_seconds INTEGER DEFAULT 300,
    parser_class    TEXT NOT NULL,                -- 'FundaParser'
    is_active       BOOLEAN DEFAULT true,
    last_success    TIMESTAMPTZ,
    last_failure    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Raw scraped listings (one row per source occurrence)
CREATE TABLE source_listings (
    id              SERIAL PRIMARY KEY,
    source_id       INTEGER REFERENCES sources(id),
    external_id     TEXT NOT NULL,                -- platform's listing ID
    url             TEXT NOT NULL,
    raw_address     TEXT,
    parsed_address  JSONB,      -- {street, number, suffix, postal_code, city}
    price_cents     INTEGER,
    size_m2         REAL,
    rooms           INTEGER,
    property_type   TEXT,        -- 'apartment','house','room','studio'
    thumbnail_urls  TEXT[],      -- hotlinked, NOT downloaded
    listing_date    DATE,
    first_seen      TIMESTAMPTZ DEFAULT now(),
    last_seen       TIMESTAMPTZ DEFAULT now(),
    is_active       BOOLEAN DEFAULT true,
    image_hashes    TEXT[],      -- perceptual hashes for dedup
    raw_data        JSONB,       -- full parsed data for debugging
    UNIQUE(source_id, external_id)
);

-- Canonical deduplicated listings
CREATE TABLE canonical_listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    best_address    JSONB NOT NULL,
    display_address TEXT NOT NULL,
    price_cents     INTEGER,
    size_m2         REAL,
    rooms           INTEGER,
    property_type   TEXT,
    latitude        REAL,
    longitude       REAL,
    neighborhood    TEXT,
    city            TEXT,
    trust_score     REAL DEFAULT 0.5,
    fraud_signals   JSONB DEFAULT '[]',
    status          TEXT DEFAULT 'active',
    first_seen      TIMESTAMPTZ DEFAULT now(),
    last_seen       TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Link table: canonical <-> source listings
CREATE TABLE listing_sources (
    canonical_id      UUID REFERENCES canonical_listings(id),
    source_listing_id INTEGER REFERENCES source_listings(id),
    PRIMARY KEY (canonical_id, source_listing_id)
);

-- Deduplication decisions (audit trail)
CREATE TABLE dedup_decisions (
    id              SERIAL PRIMARY KEY,
    listing_a_id    INTEGER REFERENCES source_listings(id),
    listing_b_id    INTEGER REFERENCES source_listings(id),
    score           REAL NOT NULL,
    decision        TEXT NOT NULL,     -- 'merge','distinct','review'
    signals         JSONB,            -- {address:0.9, price:1.0, image:0.8}
    decided_at      TIMESTAMPTZ DEFAULT now()
);

-- Fraud signals log
CREATE TABLE fraud_signals (
    id              SERIAL PRIMARY KEY,
    canonical_id    UUID REFERENCES canonical_listings(id),
    signal_type     TEXT NOT NULL,
    severity        REAL NOT NULL,     -- 0.0-1.0
    details         JSONB,
    detected_at     TIMESTAMPTZ DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_source_active ON source_listings(source_id, is_active)
  WHERE is_active;
CREATE INDEX idx_source_external ON source_listings(source_id, external_id);
CREATE INDEX idx_canonical_city ON canonical_listings(city, status);
CREATE INDEX idx_canonical_trust ON canonical_listings(trust_score);
CREATE INDEX idx_canonical_price ON canonical_listings(price_cents);`}</Code>
  </div>);
}

function SectionStack(){
  return(<div>
    <H3>Recommended Stack</H3>
    {[
      ["Scraping (JS sites)","Playwright (Python) + playwright-stealth","Best Cloudflare bypass, real browser fingerprints","#a78bfa"],
      ["Scraping (static)","httpx (async) + selectolax","20x faster than BS4, async-native, HTTP/2","#34d399"],
      ["Job Queue","BullMQ (Node.js) or Python RQ + Redis","Simple, reliable, repeatable jobs","#f59e0b"],
      ["Primary Database","PostgreSQL 16+","JSONB support, PostGIS for geo queries, reliable","#60a5fa"],
      ["Cache / Seen-set","Redis","Sub-ms lookups for dedup seen-set, pub/sub for events","#f472b6"],
      ["Proxy Management","BrightData or Oxylabs residential","NL-geolocated residential IPs for Funda","#ef4444"],
      ["Address Parsing","Custom regex + libpostal","Dutch address format regular enough for regex","#fb923c"],
      ["Image Hashing","imagehash (Python)","Perceptual hashing for dedup (pHash/dHash)","#a78bfa"],
      ["Monitoring","Prometheus + Grafana","Scraper health, success rates, latency dashboards","#22c55e"],
      ["Error Tracking","Sentry","Exception tracking, alerting on parser failures","#f59e0b"],
      ["Container Runtime","Docker Compose (MVP) -> Kubernetes (scale)","Start simple, scale when needed","#6b7280"],
      ["CI/CD","GitHub Actions","Auto-deploy, parser health tests against snapshots","#60a5fa"],
    ].map(([l,t,w,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid #ffffff06"}}>
      <div style={{width:130,color:c,fontWeight:700,fontSize:12.5,flexShrink:0}}>{l}</div>
      <div><strong style={{color:"#e5e7eb",fontSize:13}}>{t}</strong><span style={{color:"#6b7280",fontSize:12,marginLeft:6}}>— {w}</span></div>
    </div>))}
    <H3>What NOT to Use</H3>
    {[
      ["Scrapy","Too opinionated for real-time monitoring. Designed for large-scale batch crawling."],
      ["Selenium","Slow, easily detectable, no stealth support. Playwright is strictly better."],
      ["MongoDB","Premature. PostgreSQL with JSONB handles semi-structured data AND gives you SQL for analytics."],
      ["Elasticsearch","Don't add until 100K+ listings need full-text search. PostgreSQL tsvector is enough initially."],
      ["Kafka","Overkill for NL market volume (~5K listings/day). BullMQ handles this trivially. Kafka adds ZooKeeper complexity."],
      ["BeautifulSoup","Slow parser. selectolax is 20x faster with similar API."],
    ].map(([t,r])=>(<div key={t} style={{padding:"4px 0",fontSize:13}}>
      <span style={{color:"#ef4444",marginRight:8}}>{"✗"}</span>
      <strong style={{color:"#e5e7eb"}}>{t}</strong>: <span style={{color:"#6b7280"}}>{r}</span>
    </div>))}
  </div>);
}

function SectionRoadmap(){
  const weeks=[
    {w:"Week 1",t:"Foundation",c:"#22c55e",items:["Set up PostgreSQL schema + Redis","Build scraper framework: base class with scrape(), parse(), normalize() interface","Implement Funda parser (Playwright + stealth + residential proxy)","Implement basic dedup (address + price matching)","Deploy: single VPS (4 CPU, 8GB RAM, ~€40/mo), Docker Compose"],d:"Funda listings scraped every 60 seconds, deduplicated, stored in PostgreSQL."},
    {w:"Week 2",t:"Second Source + Alerting",c:"#34d399",items:["Implement Pararius parser (httpx)","Cross-platform deduplication (Funda <-> Pararius)","Build event emission for new listings (Redis pub/sub)","Build basic alerting service (webhook to your existing API)"],d:"Two-source aggregation with cross-platform dedup and alerts."},
    {w:"Week 3",t:"Normalization + Trust",c:"#60a5fa",items:["Build proper Dutch address parser (regex)","Build normalization pipeline (consistent schema)","Implement rule-based trust scoring (price anomaly + source trust)","Add Kamernet parser"],d:"Three-source aggregation with normalized data and basic fraud scoring."},
    {w:"Week 4",t:"Speed + Resilience",c:"#a78bfa",items:["Optimize polling intervals (adaptive scheduling)","Add API interception for Funda (scrape JSON API, not HTML)","Add parser health monitoring (success rate tracking)","Add retry logic + error alerting (Sentry)","Stress test: 24 hours crawling, measure detection latency"],d:"MVP with <60 second detection latency on core sources."},
    {w:"Weeks 5-8",t:"Source Expansion",c:"#f472b6",items:["Add 5-10 more sources (Huurwoningen, HousingAnywhere, DirectWonen, Jaap.nl, 3-5 agency sites)","Add image perceptual hashing for dedup","Build agency site generic crawler (configurable CSS selectors per site)","Add user filter matching service","Add push notifications"],d:""},
    {w:"Weeks 9-12",t:"Hardening",c:"#fb923c",items:["Add comprehensive fraud detection (text analysis, price modeling per neighborhood)","Build parser auto-disable + alerting when parsers break","Add opt-out mechanism for platforms/agents","Performance optimization: caching, connection pooling, query optimization","Set up monitoring dashboards (Grafana)"],d:""},
  ];
  return(<div>
    <div style={{position:"relative",paddingLeft:26}}>
      <div style={{position:"absolute",left:7,top:0,bottom:0,width:2,background:"linear-gradient(to bottom,#22c55e,#fb923c)"}}/>
      {weeks.map((w,i)=>(<div key={i} style={{position:"relative",marginBottom:20}}>
        <div style={{position:"absolute",left:-22,top:3,width:12,height:12,borderRadius:"50%",background:w.c,border:"3px solid #0a0a1a"}}/>
        <div style={{background:"#12122a",borderRadius:10,padding:"14px 16px",border:"1px solid #ffffff08"}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:5}}><Tag color={w.c}>{w.w}</Tag><span style={{color:"#e5e7eb",fontWeight:700,fontSize:14}}>{w.t}</span></div>
          {w.items.map((it,j)=><div key={j} style={{color:"#9ca3af",fontSize:12,padding:"2px 0"}}>{"▸ "}{it}</div>)}
          {w.d&&<div style={{marginTop:7,background:w.c+"10",borderRadius:5,padding:"6px 10px",fontSize:11.5,color:w.c,fontWeight:600}}>{"→ "}{w.d}</div>}
        </div>
      </div>))}
    </div>
    <H3>What to Delay (Not Overengineer)</H3>
    {[
      "ML-based fraud detection — wait for 500+ labeled examples. Rules work fine initially.",
      "Kubernetes — Docker Compose is fine for < 20 scraper workers.",
      "Kafka — BullMQ handles NL-scale volume (5K listings/day) trivially.",
      "Full-text search — PostgreSQL tsvector is enough until 100K+ listings.",
      "Auto-apply features — high legal risk. Delay until lawyer consulted + user consent flows built.",
      "Mobile app — your API can serve any frontend. Prove product-market fit first.",
      "Agency partnerships / API integrations — valuable but take months to negotiate. Build scraper first, pursue partnerships in parallel.",
    ].map((item,i)=>(<div key={i} style={{color:"#9ca3af",fontSize:12.5,padding:"4px 0",borderBottom:"1px solid #ffffff06"}}>
      <span style={{color:"#f59e0b",marginRight:8}}>{"⏳"}</span>{item}
    </div>))}
  </div>);
}

/* ───────── SECTION MAP ───────── */
const SECTION_MAP = {
  landscape: SectionLandscape,features: SectionFeatures,reverse: SectionReverse,repos: SectionRepos,
  arch: SectionArch,scraping: SectionScraping,speed: SectionSpeed,dedup: SectionDedup,
  fraud: SectionFraud,legal: SectionLegal,data: SectionData,stack: SectionStack,roadmap: SectionRoadmap,
};

/* ───────── MAIN APP ───────── */
export default function App(){
  const[active,setActive]=useState("landscape");
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=0},[active]);
  const Sec=SECTION_MAP[active];
  const sec=SECTIONS.find(s=>s.id===active);
  const idx=SECTIONS.findIndex(s=>s.id===active);

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#0a0a1a",color:"#e5e7eb",height:"100vh",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <header style={{background:"linear-gradient(135deg,#0f0f2a,#1a0a2e 50%,#0a1a2e)",borderBottom:"1px solid #ffffff0a",padding:"14px 20px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>🏠</span>
            <div>
              <h1 style={{margin:0,fontSize:18,fontWeight:800,background:"linear-gradient(135deg,#a78bfa,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NL Housing Aggregation Engine</h1>
              <p style={{margin:0,fontSize:11,color:"#6b7280"}}>Complete Blueprint — {SECTIONS.length} Sections — Architecture, Competitive Intel, Legal Strategy, Roadmap</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:"#6b7280",fontSize:11}}>Research by</span>
            <span style={{color:"#a78bfa",fontSize:12,fontWeight:700}}>Rami Al-Hakimi</span>
            <a href="https://www.linkedin.com/in/rami-hakimi" target="_blank" rel="noopener noreferrer" style={{color:"#60a5fa",fontSize:11,textDecoration:"none",padding:"2px 8px",background:"#60a5fa15",borderRadius:4,border:"1px solid #60a5fa33"}}>LinkedIn</a>
            <a href="https://github.com/rami-hakimi" target="_blank" rel="noopener noreferrer" style={{color:"#9ca3af",fontSize:11,textDecoration:"none",padding:"2px 8px",background:"#ffffff08",borderRadius:4,border:"1px solid #ffffff15"}}>GitHub</a>
          </div>
        </div>
      </header>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <nav style={{width:215,minWidth:215,background:"#0d0d1f",borderRight:"1px solid #ffffff08",overflowY:"auto",padding:"6px 0",flexShrink:0}}>
          {SECTIONS.map(s=>{
            const isA=s.id===active;
            return(<button key={s.id} onClick={()=>setActive(s.id)} style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"8px 13px",border:"none",background:isA?"linear-gradient(90deg,#a78bfa12,transparent)":"transparent",borderLeft:isA?"3px solid #a78bfa":"3px solid transparent",color:isA?"#e5e7eb":"#6b7280",cursor:"pointer",fontSize:12,fontWeight:isA?700:500,textAlign:"left",fontFamily:"inherit"}}>
              <span style={{fontSize:14}}>{s.icon}</span>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:9,color:isA?"#a78bfa":"#4b5563",fontWeight:700,fontFamily:"monospace"}}>{s.num}</span>
                  <span>{s.title}</span>
                </div>
                <div style={{fontSize:9.5,color:"#4b5563",marginTop:1}}>{s.sub}</div>
              </div>
            </button>);
          })}
        </nav>
        <main ref={ref} style={{flex:1,overflowY:"auto",padding:"24px 32px 60px"}}>
          <div style={{maxWidth:880}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
              <span style={{fontSize:28}}>{sec?.icon}</span>
              <div>
                <span style={{fontSize:10,color:"#a78bfa",fontWeight:700,fontFamily:"monospace",letterSpacing:"0.1em"}}>SECTION {sec?.num}</span>
                <h2 style={{margin:0,fontSize:24,fontWeight:800}}>{sec?.title}</h2>
              </div>
            </div>
            <div style={{height:2,background:"linear-gradient(90deg,#a78bfa,transparent)",marginBottom:24,borderRadius:1}}/>
            <Sec/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:36}}>
              {idx>0?<button onClick={()=>setActive(SECTIONS[idx-1].id)} style={{background:"#1a1a2e",border:"1px solid #ffffff10",color:"#9ca3af",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>{"← "}{SECTIONS[idx-1].title}</button>:<div/>}
              {idx<SECTIONS.length-1?<button onClick={()=>setActive(SECTIONS[idx+1].id)} style={{background:"#a78bfa18",border:"1px solid #a78bfa33",color:"#e5e7eb",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{SECTIONS[idx+1].title}{" →"}</button>:<div/>}
            </div>
          </div>
        </main>
      </div>
      <footer style={{background:"#0d0d1f",borderTop:"1px solid #ffffff0a",padding:"12px 20px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{color:"#6b7280",fontSize:11}}>Research and analysis by</span>
          <span style={{color:"#e5e7eb",fontSize:12,fontWeight:700}}>Rami Al-Hakimi</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <a href="https://www.linkedin.com/in/rami-hakimi" target="_blank" rel="noopener noreferrer" style={{color:"#60a5fa",fontSize:11,textDecoration:"none",display:"flex",alignItems:"center",gap:4,padding:"3px 10px",background:"#60a5fa10",borderRadius:6,border:"1px solid #60a5fa22"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <a href="https://github.com/rami-hakimi" target="_blank" rel="noopener noreferrer" style={{color:"#9ca3af",fontSize:11,textDecoration:"none",display:"flex",alignItems:"center",gap:4,padding:"3px 10px",background:"#ffffff08",borderRadius:6,border:"1px solid #ffffff15"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
