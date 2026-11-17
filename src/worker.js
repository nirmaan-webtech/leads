const headers = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "cache-control": "no-store"
};
const htmlHeaders = { "content-type": "text/html; charset=utf-8", "x-content-type-options":"nosniff", "x-frame-options":"DENY", "referrer-policy":"strict-origin-when-cross-origin", "content-security-policy":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'", "cache-control":"no-store" };
const enc = new TextEncoder();

function json(data, status=200) { return new Response(JSON.stringify(data), {status, headers}); }
function html(body, status=200) { return new Response(body, {status, headers:htmlHeaders}); }
function escapeHtml(s="") { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function uuid() { return crypto.randomUUID(); }
function hex(bytes) { return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
async function sha(text) { return hex(await crypto.subtle.digest("SHA-256", enc.encode(text))); }
async function cookieSession(req, env) {
  const raw = req.headers.get("Cookie") || "";
  const token = raw.split(";").map(x=>x.trim()).find(x=>x.startsWith("nlh_session="))?.slice(12);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const tokenHash = await sha(token);
  const row = await env.DB.prepare("SELECT u.id,u.username FROM app_sessions s JOIN app_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at > datetime('now')").bind(tokenHash).first();
  return row || null;
}
async function requireAuth(req, env) { return cookieSession(req, env); }
async function body(req) { try { return await req.json(); } catch { return {}; } }
function shell(title, content, active="Overview") {
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} · Nirmaan Lead Hunter</title><style>
:root{color-scheme:dark;--bg:#090d16;--panel:#111827;--line:#253047;--text:#edf2fb;--muted:#96a3b8;--gold:#d7b56d;--blue:#64a8ff}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 80% -20%,#1b2b45 0,transparent 45%),var(--bg);color:var(--text);font:14px Inter,system-ui,Segoe UI,sans-serif}
a{color:inherit;text-decoration:none}.layout{display:flex;min-height:100vh}.side{width:230px;padding:26px 16px;border-right:1px solid var(--line);background:#0c1220}.brand{font-weight:800;font-size:16px;letter-spacing:.3px;padding:8px 12px 28px}.brand span{color:var(--gold)}nav a{display:block;padding:12px;border-radius:9px;color:var(--muted);margin:4px 0}nav a.active,nav a:hover{background:#19253a;color:#fff}.main{flex:1;min-width:0;padding:30px;max-width:1500px}.top{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:26px}.eyebrow{color:var(--gold);font-size:11px;text-transform:uppercase;letter-spacing:2px}.muted{color:var(--muted)}h1{font-size:27px;margin:5px 0 0}h2{font-size:17px;margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.panel,.stat{background:linear-gradient(145deg,#141d2d,#101725);border:1px solid var(--line);border-radius:13px;padding:19px;margin-bottom:16px}.stat small{color:var(--muted)}.value{font-size:27px;font-weight:750;margin-top:10px}.gold{color:var(--gold)}.btn{border:0;border-radius:8px;background:var(--gold);color:#15120b;padding:10px 14px;font-weight:700;cursor:pointer}.btn.secondary{background:#1b2b43;color:var(--text);border:1px solid var(--line)}input,select,textarea{background:#0b1220;color:var(--text);border:1px solid #314059;border-radius:8px;padding:11px;width:100%;outline:none}label{display:block;color:var(--muted);margin:12px 0 6px}.row{display:flex;gap:10px;align-items:center}.row>*{flex:1}table{border-collapse:collapse;width:100%;min-width:720px}th,td{text-align:left;padding:12px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--muted);font-weight:600;font-size:12px}td{font-size:13px}.tablewrap{overflow:auto}.pill{display:inline-block;padding:4px 8px;border-radius:99px;background:#1b2a42;color:#9fc7ff;font-size:11px}.warn{color:#ffcf84}.empty{padding:28px;text-align:center;color:var(--muted)}.form{max-width:440px;margin:8vh auto}.error{color:#ff9292;margin-top:12px}.hint{font-size:12px;color:var(--muted);line-height:1.55}.mobileNav{display:none}
@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.side{width:190px}.main{padding:22px}}
@media(max-width:650px){.layout{display:block}.side{width:auto;padding:12px;border-right:0;border-bottom:1px solid var(--line)}.brand{padding:5px 8px 10px}.side nav{display:flex;overflow:auto;gap:5px}.side nav a{white-space:nowrap;margin:0;padding:9px}.main{padding:17px}.grid{grid-template-columns:1fr 1fr}.top{align-items:flex-start}h1{font-size:22px}.stat{padding:14px}.value{font-size:22px}}
</style></head><body><div class="layout"><aside class="side"><div class="brand">NIRMAAN <span>LEAD HUNTER</span></div><nav>
<a class="${active==="Overview"?"active":""}" href="/">Overview</a>
<a class="${active==="Businesses"?"active":""}" href="/businesses">Businesses</a>
<a class="${active==="Audits"?"active":""}" href="/audits">Website audits</a>
<a class="${active==="Outreach"?"active":""}" href="/outreach">Outreach drafts</a>
<a class="${active==="Runs"?"active":""}" href="/runs">Research runs</a>
<form method="post" action="/logout" style="margin:0"><button class="btn secondary" style="padding:9px 12px">Sign out</button></form></nav></aside><main class="main"><div class="top"><div><div class="eyebrow">India · B2B prospecting</div><h1>${escapeHtml(title)}</h1></div><span class="pill">Private workspace</span></div>${content}</main></div></body></html>`;
}
const loginPage = (error="") => html(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in · Nirmaan Lead Hunter</title><style>body{background:#090d16;color:#edf2fb;font:15px system-ui;display:grid;place-items:center;min-height:100vh;margin:0}.card{background:#111827;border:1px solid #253047;border-radius:16px;padding:30px;width:min(92vw,420px)}h1{font-size:24px}.muted{color:#96a3b8}label{display:block;margin:14px 0 6px;color:#96a3b8}input{width:100%;box-sizing:border-box;padding:12px;border-radius:8px;border:1px solid #314059;background:#0b1220;color:white}button{margin-top:18px;width:100%;padding:12px;background:#d7b56d;border:0;border-radius:8px;font-weight:700}.err{color:#ff9292}</style></head><body><form class="card" method="post" action="/login"><div class="muted">NIRMAAN WEBTECH</div><h1>Lead Hunter</h1><p class="muted">Sign in to your private prospecting dashboard.</p><label>Username</label><input name="username" autocomplete="username" required><label>Password</label><input name="password" type="password" autocomplete="current-password" required><button>Sign in</button><p class="err">${escapeHtml(error)}</p></form></body></html>`);

const DISCOVERY_CITIES=[
{city:"Delhi",state:"Delhi",bbox:[28.48,76.84,28.88,77.35]},
{city:"Mumbai",state:"Maharashtra",bbox:[18.89,72.75,19.28,73.05]},
{city:"Bengaluru",state:"Karnataka",bbox:[12.82,77.42,13.15,77.75]},
{city:"Chennai",state:"Tamil Nadu",bbox:[12.88,80.12,13.22,80.32]},
{city:"Hyderabad",state:"Telangana",bbox:[17.25,78.25,17.55,78.65]},
{city:"Kolkata",state:"West Bengal",bbox:[22.43,88.25,22.68,88.48]},
{city:"Pune",state:"Maharashtra",bbox:[18.40,73.72,18.66,74.00]},
{city:"Ahmedabad",state:"Gujarat",bbox:[22.92,72.48,23.15,72.72]},
{city:"Jaipur",state:"Rajasthan",bbox:[26.78,75.68,27.02,76.00]},
{city:"Lucknow",state:"Uttar Pradesh",bbox:[26.72,80.82,26.98,81.08]},
{city:"Chandigarh",state:"Chandigarh",bbox:[30.65,76.68,30.82,76.85]},
{city:"Ludhiana",state:"Punjab",bbox:[30.80,75.72,30.98,76.00]},
{city:"Amritsar",state:"Punjab",bbox:[31.58,74.78,31.75,74.98]},
{city:"Jalandhar",state:"Punjab",bbox:[31.27,75.48,31.38,75.65]},
{city:"Patiala",state:"Punjab",bbox:[30.28,76.32,30.42,76.48]},
{city:"Surat",state:"Gujarat",bbox:[21.10,72.72,21.28,72.92]},
{city:"Indore",state:"Madhya Pradesh",bbox:[22.62,75.78,22.82,76.00]},
{city:"Bhopal",state:"Madhya Pradesh",bbox:[23.15,77.30,23.32,77.48]},
{city:"Kochi",state:"Kerala",bbox:[9.88,76.20,10.10,76.38]},
{city:"Coimbatore",state:"Tamil Nadu",bbox:[10.95,76.90,11.08,77.08]}
];
function engClean(v){return typeof v==="string"?v.trim().slice(0,500):"";}
function engUrl(raw){
 if(!raw)return null;let s=String(raw).trim();if(!/^https?:\/\//i.test(s))s="https://"+s;
 try{const u=new URL(s);const h=u.hostname.toLowerCase();if(!["http:","https:"].includes(u.protocol)||!h||u.username||u.password||h==="localhost"||h.endsWith(".local")||h==="127.0.0.1"||h==="0.0.0.0"||/^10\./.test(h)||/^192\.168\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h))return null;return u.toString();}catch{return null;}
}
function engTag(t,keys){for(const k of keys){const v=engClean(t&&t[k]);if(v)return v;}return "";}
function engCategory(t){for(const k of ["shop","office","craft","amenity","healthcare","tourism"]){if(t[k]&&t[k]!=="yes")return k+": "+String(t[k]).replace(/_/g," ");}return "Local business";}
function engDedupe(el){return "osm:"+el.type+":"+el.id;}
function engSource(el){return "https://www.openstreetmap.org/"+el.type+"/"+el.id;}
function engQuery(city){
 const b=city.bbox;
 return '[out:json][timeout:22];(nwr["name"]["shop"]('+b.join(",")+');nwr["name"]["office"]('+b.join(",")+');nwr["name"]["craft"]('+b.join(",")+');nwr["name"]["amenity"~"restaurant|cafe|clinic|dentist|doctors|hospital|school|college|bank|pharmacy|beauty_salon|fast_food|car_repair|fuel"]('+b.join(",")+');nwr["name"]["healthcare"]('+b.join(",")+'););out center tags meta 70;';
}
async function engDiscover(city){
 const query="data="+encodeURIComponent(engQuery(city));
 const endpoints=[
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter"
 ];
 const failures=[];
 for(const endpoint of endpoints){
  try{
   const r=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded;charset=UTF-8","accept":"application/json","user-agent":"NirmaanLeadHunter/1.0 (business discovery; contact via GitHub repository)"},body:query,signal:AbortSignal.timeout(8500)});
   if(!r.ok){failures.push(new URL(endpoint).hostname+" HTTP "+r.status);continue;}
   const d=await r.json();
   if(!d||!Array.isArray(d.elements))throw new Error("Invalid Overpass JSON response");
   return d.elements.map(el=>({...el,tags:{...(el.tags||{}),source_provider:"Overpass"}}));
  }catch(e){failures.push(new URL(endpoint).hostname+" "+String(e&&e.message||e).slice(0,100));}
 }
 try{
  const b=city.bbox,lat=(b[0]+b[2])/2,lon=(b[1]+b[3])/2;
  const items=[],seen=new Set();
  const osmFilters=["shop","office","craft","amenity:restaurant","amenity:cafe","amenity:clinic","amenity:doctors","amenity:dentist","amenity:school","amenity:college","amenity:bank","amenity:pharmacy","amenity:beauty_salon","amenity:car_repair","healthcare"];
  const photonResults=await Promise.all(osmFilters.map(async tag=>{
   try{
    const u=new URL("https://photon.komoot.io/reverse");
    u.searchParams.set("lon",String(lon));u.searchParams.set("lat",String(lat));u.searchParams.set("radius","12000");u.searchParams.set("limit","50");u.searchParams.set("lang","en");u.searchParams.set("osm_tag",tag);
    const p=await fetch(u,{headers:{"accept":"application/json"},signal:AbortSignal.timeout(6500)});
    if(!p.ok)return [];
    const d=await p.json();return d.features||[];
   }catch{return [];}
  }));
  for(const features of photonResults){
   for(const f of features){
    const x=f.properties||{},id=x.osm_id,name=engClean(x.name),key=String(x.osm_type)+":"+String(id);
    if(!id||!name||seen.has(key))continue;seen.add(key);
    const extra=x.extra||{};
    items.push({type:x.osm_type==="R"?"relation":x.osm_type==="W"?"way":"node",id:Number(id),tags:{name,shop:x.osm_key==="shop"?x.osm_value:undefined,office:x.osm_key==="office"?x.osm_value:undefined,craft:x.osm_key==="craft"?x.osm_value:undefined,amenity:x.osm_key==="amenity"?x.osm_value:undefined,healthcare:x.osm_key==="healthcare"?x.osm_value:undefined,"addr:city":x.city||city.city,"addr:state":x.state||city.state,"addr:street":x.street,"addr:postcode":x.postcode,phone:x.phone||extra.phone,email:x.email||extra.email,website:x.website||extra.website,source_provider:"Photon"}});
   }
  }
  if(items.length)return items.slice(0,50);
 }catch(e){failures.push("Photon "+String(e&&e.message||e).slice(0,80));}
 throw new Error("Discovery providers unavailable: "+failures.join(" | "));
}
function engRecord(el,city){
 const t=el.tags||{},name=engClean(t.name);if(!name)return null;
 const website=engUrl(engTag(t,["contact:website","website","url"]));
 const phone=engTag(t,["contact:phone","phone","mobile"]),email=engTag(t,["contact:email","email"]);
 const instagram=engTag(t,["contact:instagram","instagram"]),facebook=engTag(t,["contact:facebook","facebook"]);
 const address=[t["addr:housenumber"],t["addr:street"],t["addr:suburb"],t["addr:postcode"]].filter(Boolean).join(", ");
 const domain=website?new URL(website).hostname.replace(/^www\./,"").toLowerCase():null;
 const ev={source:t.source_provider||"OpenStreetMap",osm_type:el.type,osm_id:el.id,osm_version:el.version||null,osm_timestamp:el.timestamp||null,observed_at:new Date().toISOString(),activity_signal:"A public map listing exists; this does not independently prove current trading or revenue."};
 return {id:uuid(),dedupe:engDedupe(el),name,category:engCategory(t),city:engClean(t["addr:city"])||city.city,state:engClean(t["addr:state"])||city.state,address,phone,email,website,domain,instagram,facebook,source:engSource(el),evidence:ev};
}
async function engAudit(biz){
 const checked=new Date().toISOString();
 if(!biz.website_url)return {status:"missing",audit:null,findings:["No website URL was present in the public map listing."]};
 const url=engUrl(biz.website_url);if(!url)return {status:"invalid_url",audit:null,findings:["Website URL is invalid or restricted."]};
 const start=Date.now();let res=null,htmlText="",error="",finalUrl=url;
 try{res=await fetch(url,{redirect:"manual",headers:{"accept":"text/html,application/xhtml+xml","user-agent":"NirmaanLeadHunter/1.0 website-audit"},signal:AbortSignal.timeout(12000)});finalUrl=res.url||url;if(res.status>=300&&res.status<400)throw new Error("Website redirected; redirect target was not fetched for SSRF safety.");if((res.headers.get("content-type")||"").includes("text/html")){const reader=res.body?.getReader();let total=0,chunks=[];if(reader){while(total<250000){const part=await reader.read();if(part.done)break;const chunk=part.value.slice(0,250000-total);chunks.push(chunk);total+=chunk.length;if(total>=250000){await reader.cancel();break;}}const merged=new Uint8Array(total);let offset=0;for(const c of chunks){merged.set(c,offset);offset+=c.length;}htmlText=new TextDecoder().decode(merged);}}}catch(e){error=String(e&&e.message||e).slice(0,220);}
 const elapsed=Date.now()-start,title=(htmlText.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||"";
 const cleanTitle=title.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,180);
 const viewport=/<meta[^>]+name\s*=\s*["']viewport["']/i.test(htmlText),description=/<meta[^>]+name\s*=\s*["']description["']/i.test(htmlText),h1=(htmlText.match(/<h1\b/gi)||[]).length;
 const forms=(htmlText.match(/<form\b/gi)||[]).length;
 const mediaQueries=(htmlText.match(/@media[^{}]*\([^)]*(?:width|device-width)[^)]*\)/gi)||[]).length;
 const emails=[...new Set((htmlText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[]).map(x=>x.toLowerCase()))].slice(0,10);
 const links=[...new Set([...htmlText.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#]+)["']/gi)].map(m=>m[1]).filter(h=>!/^mailto:|^tel:|^javascript:/i.test(h)).map(h=>{try{return new URL(h,url).toString()}catch{return null}}).filter(Boolean))].filter(h=>{try{return new URL(h).origin===new URL(url).origin}catch{return false}}).slice(0,10);
 const broken=[];let linksChecked=0;
 for(const link of links){try{const lr=await fetch(link,{method:"HEAD",redirect:"follow",signal:AbortSignal.timeout(3000)});linksChecked++;if(lr.status>=400)broken.push({url:link,status:lr.status});}catch(e){linksChecked++;broken.push({url:link,status:"request_failed"});}}
 const findings=[];if(error)findings.push(error);if(res&&res.status>=400)findings.push("Homepage returned HTTP "+res.status+".");if(!finalUrl.startsWith("https://"))findings.push("Final website URL does not use HTTPS.");if(!cleanTitle)findings.push("HTML title tag missing.");if(!viewport)findings.push("Responsive viewport meta tag missing.");if(!description)findings.push("Meta description missing.");if(!h1)findings.push("No H1 heading detected.");if(!mediaQueries)findings.push("No responsive CSS media query detected in homepage HTML.");if(broken.length)findings.push(broken.length+" same-origin links failed or could not be checked.");if(htmlText.length<1200&&res&&res.ok)findings.push("Very small HTML response; content may be incomplete or client-rendered.");
 const status=!res||error?(String(error).includes("redirected")?"redirect_requires_manual_review":"unreachable"):res.status>=400?"http_error":findings.length?"needs_review":"reachable_basic_checks_passed";
 return {status,findings,audit:{id:uuid(),checked,requested:url,final:finalUrl,http:res?res.status:null,ssl:finalUrl.startsWith("https://")?1:0,mobile:viewport?"viewport_meta_present":"viewport_meta_missing",desktop:res?"http_response_received":"not_reached",title:cleanTitle,linksChecked,brokenLinks:broken,forms,emails,mobileScore:Math.max(0,100-(viewport?0:35)-(mediaQueries?0:20)),auditScore:Math.max(0,100-(res&&res.status<400?0:35)-(url.startsWith("https://")?0:15)-(cleanTitle?0:10)-(viewport?0:15)-(description?0:5)-(h1?0:5)-Math.min(broken.length*3,15)),evidence:{elapsed_ms:elapsed,content_type:res?res.headers.get("content-type"):null,html_bytes:htmlText.length,has_viewport:viewport,has_meta_description:description,h1_count:h1,media_query_count:mediaQueries,forms_detected:forms,limitations:["Mobile score is a markup heuristic, not a real mobile browser test.","Forms are detected, never submitted.","Only up to 10 same-origin links are checked with HEAD.","No Lighthouse/PageSpeed or visual rendering."]}}};
}
async function engEmailCheck(email){
 const value=String(email||"").trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))return "invalid_format";
 try{
  const u=new URL("https://dns.google/resolve");u.searchParams.set("name",value.split("@").pop());u.searchParams.set("type","MX");
  const r=await fetch(u,{headers:{"accept":"application/dns-json"},signal:AbortSignal.timeout(3500)});
  if(!r.ok)return "dns_check_unavailable";
  const d=await r.json();return (d.Answer||[]).some(x=>x.type===15)?"mx_found_mailbox_not_verified":"no_mx_record";
 }catch{return "dns_check_unavailable";}
}
function engPhoneCheck(phone){
 if(!phone)return "not_provided";
 const digits=String(phone).replace(/\D/g,""),n=digits.startsWith("91")&&digits.length===12?digits.slice(2):digits;
 return /^[6-9]\d{9}$/.test(n)?"india_mobile_format_valid_not_called":"invalid_or_unrecognized_format";
}
function engOutreach(biz,findings){
 const noSite=!biz.website_url,issue=noSite?"no website URL appeared in its public business listing":(findings[0]||"the homepage needs a closer technical review");
 return {subject:(noSite?"Website for ":"Website improvement idea for ")+biz.name,message:"Hi "+biz.name+" team,\n\nI came across your business listing in "+biz.city+", "+biz.state+". I noticed that "+issue+". A clear, mobile-friendly website can help customers understand your services and contact you directly.\n\nNirmaan WebTech builds practical business websites. If improving your online presence is on your roadmap, I can share a few specific ideas for your business.\n\nWould you be open to a brief conversation?\n\nRegards,\nNirmaan WebTech",strategy:noSite?"Offer a starter website; manually confirm the business is currently operating before sending.":"Offer a short homepage review based on recorded checks; manually validate findings before sending."};
}
async function engRun(env){
 const runId=uuid(),started=new Date().toISOString();
 await env.DB.prepare("INSERT INTO research_runs(id,started_at,target_count,status,notes) VALUES(?,?,50,'running','OpenStreetMap discovery; one city per run; trading status not independently verified')").bind(runId,started).run();
 let discovered=0,qualified=0,duplicates=0,failed=0,audited=0,drafts=0,city=null,elements=[],provider="unknown";
 try{
  const cur=await env.DB.prepare("SELECT value FROM app_settings WHERE key='city_cursor'").first();
  const idx=Number(cur&&cur.value||0)%DISCOVERY_CITIES.length;city=DISCOVERY_CITIES[idx];
  await env.DB.prepare("INSERT OR REPLACE INTO app_settings(key,value,updated_at) VALUES('city_cursor',?,CURRENT_TIMESTAMP)").bind(String((idx+1)%DISCOVERY_CITIES.length)).run();
  elements=await engDiscover(city);provider=elements[0]?.tags?.source_provider||"unknown";const seen=new Set();
  for(const el of elements){
   if(discovered>=50)break;
   const b=engRecord(el,city);if(!b)continue;if(seen.has(b.dedupe)){duplicates++;continue;}seen.add(b.dedupe);
   const confidence=50+(b.phone?15:0)+(b.email?15:0)+(b.website?10:0)+(b.address?10:0);
   const score=b.website?35:65;
   const ins=await env.DB.prepare("INSERT OR IGNORE INTO businesses(id,dedupe_key,name,category,city,state,country,address,phone,email,website_url,domain,instagram_url,facebook_url,discovery_source,activity_evidence,website_status,qualification_status,confidence_score,opportunity_score,first_seen_at,last_verified_at,raw_evidence_json,source_url) VALUES(?,?,?,?,?,?,'India',?,?,?,?,?,?,?,?,?,'unverified','pending',?,?,?,?,?,?)")
    .bind(b.id,b.dedupe,b.name,b.category,b.city,b.state,b.address||null,b.phone||null,b.email||null,b.website,b.domain,b.instagram||null,b.facebook||null,b.evidence.source,b.evidence.activity_signal,confidence,score,started,started,JSON.stringify(b.evidence),b.source).run();
   if(ins.meta&&ins.meta.changes)discovered++;else duplicates++;
  }
  const candidates=await env.DB.prepare("SELECT * FROM businesses WHERE city=? AND state=? AND website_status='unverified' ORDER BY opportunity_score DESC LIMIT 10").bind(city.city,city.state).all();
  for(const biz of candidates.results){
   try{
    const a=await engAudit(biz),isLead=["missing","unreachable","http_error","needs_review","redirect_requires_manual_review"].includes(a.status);
    const extracted=(a.audit&&a.audit.emails||[]).find(e=>!biz.email)||biz.email||null;
    const emailStatus=extracted?await engEmailCheck(extracted):"not_provided",phoneStatus=engPhoneCheck(biz.phone);
    const mobileScore=a.audit?a.audit.mobileScore:0;
    const activityScore=Math.min(100,(biz.phone?15:0)+(biz.email?10:0)+(biz.website_url?20:0)+(a.status==="reachable_basic_checks_passed"?30:0)+(a.status==="needs_review"?15:0)+(biz.address?10:0));
    const activityStatus=activityScore>=55?"signals_present_unverified":"insufficient_public_signals";
    const hasContact=Boolean(biz.phone||biz.email||extracted);
    const hasAddress=Boolean(biz.address);
    const isQualified=isLead&&activityScore>=20&&(hasContact||hasAddress);
    const confidence=Math.min(100,25+(biz.phone?15:0)+(extracted?15:0)+(biz.website_url?15:0)+(biz.address?10:0)+(emailStatus==="mx_found_mailbox_not_verified"?20:0)+(phoneStatus==="india_mobile_format_valid_not_called"?15:0));
    const opportunity=Math.min(100,(biz.website_url?15:55)+(a.status==="unreachable"||a.status==="http_error"?25:0)+(a.status==="needs_review"?20:0)+(a.status==="missing"?25:0)+(a.audit?Math.min(15,(a.audit.brokenLinks||[]).length*3):0));
    await env.DB.prepare("UPDATE businesses SET email=COALESCE(email,?),email_verification=?,phone_verification=?,activity_status=?,activity_score=?,qualification_status=?,qualification_reason=?,confidence_score=?,opportunity_score=?,website_status=?,last_verified_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(extracted,emailStatus,phoneStatus,activityStatus,activityScore,isQualified?"qualified":"screened_out",a.findings.join(" "),confidence,opportunity,a.status,new Date().toISOString(),biz.id).run();
    if(a.audit){const x=a.audit;await env.DB.prepare("INSERT INTO website_audits(id,business_id,checked_at,requested_url,final_url,http_status,ssl_valid,mobile_test_status,desktop_test_status,broken_links_count,findings_json,evidence_json,links_checked,broken_links_json,forms_detected,contact_emails_json,mobile_heuristic_score,audit_score) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(x.id,biz.id,x.checked,x.requested,x.final,x.http,x.ssl,x.mobile,x.desktop,x.brokenLinks.length,JSON.stringify(a.findings),JSON.stringify(x.evidence),x.linksChecked,JSON.stringify(x.brokenLinks),x.forms,JSON.stringify(x.emails),mobileScore,x.auditScore).run();audited++;}else{await env.DB.prepare("INSERT INTO website_audits(id,business_id,checked_at,requested_url,final_url,http_status,ssl_valid,mobile_test_status,desktop_test_status,broken_links_count,findings_json,evidence_json,links_checked,broken_links_json,forms_detected,contact_emails_json,mobile_heuristic_score,audit_score) VALUES(?,?,?,NULL,NULL,NULL,NULL,?,?,0,?,'{}',0,'[]',0,'[]',0,0)").bind(uuid(),biz.id,new Date().toISOString(),a.status,"not_applicable",JSON.stringify(a.findings)).run();audited++;}
    if(isQualified){qualified++;const refreshed=await env.DB.prepare("SELECT * FROM businesses WHERE id=?").bind(biz.id).first();const o=engOutreach(refreshed,a.findings);await env.DB.prepare("INSERT INTO outreach_drafts(id,business_id,channel,subject,message,strategy,status) VALUES(?,?,?,?,?,?,'draft')").bind(uuid(),biz.id,refreshed.email?"email":"manual_review",o.subject,o.message,o.strategy).run();drafts++;}
   }catch(e){failed++;}
  }
  const status=failed?"partial":"completed";
  await env.DB.prepare("UPDATE research_runs SET completed_at=?,discovered_count=?,qualified_count=?,duplicate_count=?,failed_count=?,status=?,notes=? WHERE id=?").bind(new Date().toISOString(),discovered,qualified,duplicates,failed,status,"Provider: "+provider+" · "+city.city+", "+city.state+" · "+elements.length+" map objects scanned · "+audited+" website checks · "+drafts+" unsent drafts · trading status not independently confirmed",runId).run();
  return {runId,status,provider,city:city.city,state:city.state,osmObjects:elements.length,discovered,qualified,duplicates,failed,audited,drafts};
 }catch(e){await env.DB.prepare("UPDATE research_runs SET completed_at=?,status='failed',notes=? WHERE id=?").bind(new Date().toISOString(),String(e&&e.message||e).slice(0,350),runId).run();throw e;}
}

async function api(req, env, path) {
  if(path==="/api/run" && req.method==="POST"){
    if(req.headers.get("Origin")!==new URL(req.url).origin)return json({error:"Invalid request origin."},403);
    const last=await env.DB.prepare("SELECT value FROM app_settings WHERE key='last_manual_run'").first();
    if(last&&Date.now()-Date.parse(last.value)<60*1000)return json({error:"Please wait 60 seconds between manual runs."},429);
    await env.DB.prepare("INSERT OR REPLACE INTO app_settings(key,value,updated_at) VALUES('last_manual_run',?,CURRENT_TIMESTAMP)").bind(new Date().toISOString()).run();
    try{return json(await engRun(env));}catch(e){return json({error:"Discovery run failed",detail:String(e&&e.message||e)},502);}
  }
  if (path==="/api/summary") {
    const [b,a,r,o]=await Promise.all([
      env.DB.prepare("SELECT COUNT(*) n FROM businesses").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM website_audits").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM research_runs").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM outreach_drafts").first()
    ]);
    const qualified=await env.DB.prepare("SELECT COUNT(*) n FROM businesses WHERE qualification_status='qualified'").first();
    const latest=await env.DB.prepare("SELECT * FROM research_runs ORDER BY started_at DESC LIMIT 5").all();
    return json({businesses:b.n,audits:a.n,runs:r.n,drafts:o.n,qualified:qualified.n,recentRuns:latest.results});
  }
  if (path==="/api/businesses") {
    const u=new URL(req.url), q=u.searchParams.get("q")||"", status=u.searchParams.get("status")||"",city=u.searchParams.get("city")||"",state=u.searchParams.get("state")||"",website=u.searchParams.get("website")||"",contact=u.searchParams.get("contact")||"",minScore=Number(u.searchParams.get("minScore")||0);
    let query="SELECT * FROM businesses WHERE 1=1", params=[];
    if(q){query+=" AND (name LIKE ? OR city LIKE ? OR state LIKE ? OR category LIKE ?)";params.push(...Array(4).fill("%"+q+"%"))}
    if(status){query+=" AND qualification_status=?";params.push(status)}
    if(city){query+=" AND city LIKE ?";params.push("%"+city+"%")}
    if(state){query+=" AND state LIKE ?";params.push("%"+state+"%")}
    if(website==="missing")query+=" AND (website_url IS NULL OR website_url='')";
    if(website==="present")query+=" AND website_url IS NOT NULL AND website_url<>''";
    if(contact==="email")query+=" AND email IS NOT NULL AND email<>''";
    if(contact==="phone")query+=" AND phone IS NOT NULL AND phone<>''";
    if(contact==="both")query+=" AND phone IS NOT NULL AND phone<>'' AND email IS NOT NULL AND email<>''";
    if(minScore>0){query+=" AND opportunity_score>=?";params.push(Math.min(100,minScore))}
    query+=" ORDER BY opportunity_score DESC, created_at DESC LIMIT 500";
    const rows=await env.DB.prepare(query).bind(...params).all();
    return json(rows.results);
  }
  if(path==="/api/runs"){const rows=await env.DB.prepare("SELECT * FROM research_runs ORDER BY started_at DESC LIMIT 100").all();return json(rows.results)}
  if(path==="/api/audits"){const rows=await env.DB.prepare("SELECT a.*,b.name,b.website_url FROM website_audits a LEFT JOIN businesses b ON b.id=a.business_id ORDER BY a.checked_at DESC LIMIT 100").all();return json(rows.results)}
  if(path==="/api/outreach"){const rows=await env.DB.prepare("SELECT o.*,b.name FROM outreach_drafts o LEFT JOIN businesses b ON b.id=o.business_id ORDER BY o.created_at DESC LIMIT 100").all();return json(rows.results)}
  if(path==="/api/export.csv"){
    const u=new URL(req.url),city=u.searchParams.get("city")||"",state=u.searchParams.get("state")||"",status=u.searchParams.get("status")||"",minScore=Number(u.searchParams.get("minScore")||0);
    let sql="SELECT name,category,city,state,phone,email,phone_verification,email_verification,website_url,website_status,activity_status,activity_score,qualification_status,qualification_reason,confidence_score,opportunity_score,source_url,discovery_source FROM businesses WHERE 1=1",p=[];
    if(city){sql+=" AND city LIKE ?";p.push("%"+city+"%")}
    if(state){sql+=" AND state LIKE ?";p.push("%"+state+"%")}
    if(status){sql+=" AND qualification_status=?";p.push(status)}
    if(minScore>0){sql+=" AND opportunity_score>=?";p.push(Math.min(100,minScore))}
    sql+=" ORDER BY opportunity_score DESC";
    const rows=await env.DB.prepare(sql).bind(...p).all();
    const keys=["name","category","city","state","phone","email","phone_verification","email_verification","website_url","website_status","activity_status","activity_score","qualification_status","qualification_reason","confidence_score","opportunity_score","source_url","discovery_source"];
    const safeCell=v=>{let x=String(v??"");if(/^[\s\u0000-\u001f]*[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"';};
    const csv=[keys.join(","),...rows.results.map(r=>keys.map(k=>safeCell(r[k])).join(","))].join("\r\n");
    return new Response(csv,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":"attachment; filename=lead-hunter-businesses.csv"}});
  }
  return json({error:"Not found"},404);
}
export default {
 async fetch(req,env,ctx){
  const url=new URL(req.url), path=url.pathname;
  try {
   if(path==="/health") return json({ok:true,service:"nirmaan-ai-lead-hunter",database:!!env.DB});
   if(path==="/setup" && req.method==="GET"){
     const count=await env.DB.prepare("SELECT COUNT(*) n FROM app_users").first();
     if(count.n>0)return html(loginPage("Initial setup has already been completed."));
     return html(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Initial setup</title><style>body{background:#090d16;color:#edf2fb;font:15px system-ui;display:grid;place-items:center;min-height:100vh;margin:0}.card{background:#111827;padding:30px;border:1px solid #253047;border-radius:15px;width:min(92vw,430px)}label{display:block;margin:14px 0 6px;color:#96a3b8}input{width:100%;box-sizing:border-box;padding:12px;background:#0b1220;color:white;border:1px solid #314059;border-radius:8px}button{margin-top:18px;padding:12px;width:100%;background:#d7b56d;border:0;border-radius:8px;font-weight:700}</style></head><body><form class="card" method="post" action="/setup"><h1>Set up Lead Hunter</h1><p>Create the only initial admin account. Use a unique password and save it securely.</p><label>Username</label><input name="username" required minlength="3" maxlength="40"><label>Password (minimum 14 characters)</label><input name="password" type="password" required minlength="14"><button>Create admin account</button></form></body></html>`);
   }
   if(path==="/setup" && req.method==="POST"){
     const count=await env.DB.prepare("SELECT COUNT(*) n FROM app_users").first();
     if(count.n>0)return html("Setup already completed",409);
     const form=await req.formData(), username=String(form.get("username")||"").trim(), password=String(form.get("password")||"");
     if(!/^[a-zA-Z0-9_.-]{3,40}$/.test(username)||password.length<14)return html("Invalid username or password. Password must be at least 14 characters.",400);
     const salt=crypto.getRandomValues(new Uint8Array(16)), key=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveBits"]);
     const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:100000,hash:"SHA-256"},key,256);
     const passHash="pbkdf2$100000$"+hex(salt)+"$"+hex(bits);
     await env.DB.prepare("INSERT INTO app_users(username,password_hash) VALUES(?,?)").bind(username,passHash).run();
     return Response.redirect(new URL("/login",req.url),303);
   }
   if(path==="/login" && req.method==="GET")return loginPage();
   if(path==="/login" && req.method==="POST"){
     const ipHash=await sha(req.headers.get("CF-Connecting-IP")||"unknown");
     const limit=await env.DB.prepare("SELECT attempts,locked_until,window_start FROM auth_rate_limits WHERE ip_hash=?").bind(ipHash).first();
     if(limit&&limit.locked_until&&Date.parse(limit.locked_until+"Z")>Date.now())return html(loginPage("Too many attempts. Try again in 15 minutes."),429);
     const form=await req.formData(), username=String(form.get("username")||""), password=String(form.get("password")||"");
     const user=await env.DB.prepare("SELECT * FROM app_users WHERE username=?").bind(username).first();
     if(!user){await env.DB.prepare("INSERT INTO auth_rate_limits(ip_hash,attempts,window_start,locked_until) VALUES(?,1,CURRENT_TIMESTAMP,NULL) ON CONFLICT(ip_hash) DO UPDATE SET attempts=CASE WHEN window_start<datetime('now','-15 minutes') THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<datetime('now','-15 minutes') THEN CURRENT_TIMESTAMP ELSE window_start END,locked_until=CASE WHEN (CASE WHEN window_start<datetime('now','-15 minutes') THEN 1 ELSE attempts+1 END)>=8 THEN datetime('now','+15 minutes') ELSE locked_until END").bind(ipHash).run();return html(loginPage("Invalid username or password."),401);}
     const parts=user.password_hash.split("$"), salt=Uint8Array.from(parts[2].match(/../g),x=>parseInt(x,16));
     const key=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveBits"]);
     const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:Number(parts[1]),hash:"SHA-256"},key,256);
     if(hex(bits)!==parts[3]){await env.DB.prepare("INSERT INTO auth_rate_limits(ip_hash,attempts,window_start,locked_until) VALUES(?,1,CURRENT_TIMESTAMP,NULL) ON CONFLICT(ip_hash) DO UPDATE SET attempts=CASE WHEN window_start<datetime('now','-15 minutes') THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<datetime('now','-15 minutes') THEN CURRENT_TIMESTAMP ELSE window_start END,locked_until=CASE WHEN (CASE WHEN window_start<datetime('now','-15 minutes') THEN 1 ELSE attempts+1 END)>=8 THEN datetime('now','+15 minutes') ELSE locked_until END").bind(ipHash).run();return html(loginPage("Invalid username or password."),401);}
     await env.DB.prepare("DELETE FROM auth_rate_limits WHERE ip_hash=?").bind(ipHash).run();
     const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,"0")).join("");
     const tokenHash=await sha(token);
     await env.DB.prepare("INSERT INTO app_sessions(token_hash,user_id,expires_at) VALUES(?,?,datetime('now','+12 hours'))").bind(tokenHash,user.id).run();
     return new Response(null,{status:303,headers:{"location":"/","set-cookie":"nlh_session="+token+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200"}});
   }
   if(path==="/logout" && req.method==="POST"){
     if(req.headers.get("Origin")!==new URL(req.url).origin)return json({error:"Invalid request origin."},403);
     const raw=req.headers.get("Cookie")||"";
     const token=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith("nlh_session="))?.slice(12);
     if(token && /^[a-f0-9]{64}$/.test(token)) await env.DB.prepare("DELETE FROM app_sessions WHERE token_hash=?").bind(await sha(token)).run();
     return new Response(null,{status:303,headers:{"location":"/login","set-cookie":"nlh_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"}});
   }
   const user=await requireAuth(req,env);
   if(!user)return Response.redirect(new URL("/login",req.url),302);
   if(path.startsWith("/api/"))return await api(req,env,path);
   if(path==="/"){
    const [b,q,a,d,r]=await Promise.all([
      env.DB.prepare("SELECT COUNT(*) n FROM businesses").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM businesses WHERE qualification_status='qualified'").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM website_audits").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM outreach_drafts").first(),
      env.DB.prepare("SELECT COUNT(*) n FROM research_runs").first()
    ]);
    const latest=await env.DB.prepare("SELECT * FROM research_runs ORDER BY started_at DESC LIMIT 6").all();
    const stats=[["Businesses found",b.n],["Qualified leads",q.n],["Website audits",a.n],["Outreach drafts",d.n]];
    const cards=stats.map(([l,v])=>`<div class="stat"><small>${l}</small><div class="value">${v}</div></div>`).join("");
    const rows=latest.results.map(x=>`<tr><td>${escapeHtml(x.started_at)}</td><td>${escapeHtml(x.status)}</td><td>${x.discovered_count}</td><td>${x.qualified_count}</td><td>${escapeHtml(x.notes||"—")}</td></tr>`).join("");
    return html(shell("Overview",`<div class="grid">${cards}</div><div class="panel"><div class="row"><div><h2>Research engine</h2><div class="hint">OpenStreetMap public data · one city per run · duplicate filtering · up to 10 homepage checks · unsent outreach drafts. Map listing does not prove current trading.</div></div><button class="btn" id="runNow">Run discovery now</button></div><p class="hint" id="runStatus">Automatic schedule: every 2 hours · India city rotation · 50 target records (actual qualified count may be lower).</p></div><script>document.getElementById("runNow").addEventListener("click",async()=>{const b=document.getElementById("runNow"),s=document.getElementById("runStatus");b.disabled=true;b.textContent="Running…";s.textContent="Scanning city and checking candidate websites…";try{const r=await fetch("/api/run",{method:"POST"}),d=await r.json();s.textContent=r.ok?("Run "+d.status+" · "+d.city+", "+d.state+" · found "+d.discovered+" · qualified "+d.qualified+" · duplicates "+d.duplicates+" · audits "+d.audited+" · drafts "+d.drafts):("Run failed: "+(d.detail||d.error));}catch(e){s.textContent="Request failed: "+e.message;}finally{b.disabled=false;b.textContent="Run discovery now";}});</script><div class="panel"><h2>Recent research runs</h2><div class="tablewrap"><table><thead><tr><th>Started</th><th>Status</th><th>Found</th><th>Qualified</th><th>Notes</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">No runs yet</td></tr>'}</tbody></table></div></div>`));
   }
   const tablePage=async(title,active,endpoint,cols)=>{
     return html(shell(title,`<div class="panel"><div class="row"><div><h2>${title}</h2><div class="hint">Latest 100 records. Business export is available in CSV format.</div></div><a class="btn secondary" href="/api/export.csv">Export CSV</a></div><div class="tablewrap"><table id="data"><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join("")}</tr></thead><tbody><tr><td colspan="${cols.length}" class="empty">Loading…</td></tr></tbody></table></div></div><script>
fetch("${endpoint}").then(r=>r.json()).then(rows=>{const tb=document.querySelector("#data tbody");tb.innerHTML="";if(!rows.length){tb.innerHTML='<tr><td colspan="${cols.length}" class="empty">No records yet</td></tr>';return}for(const r of rows){const tr=document.createElement("tr");tr.innerHTML=${JSON.stringify(cols.map(c=>c[0]))}.map(k=>{const td=document.createElement("td");td.textContent=r[k]??"—";return td.outerHTML}).join("");tb.appendChild(tr)}}).catch(()=>document.querySelector("#data tbody").innerHTML='<tr><td class="empty">Could not load data</td></tr>');
</script>`,active));
   };
   if(path==="/businesses")return await tablePage("Businesses","Businesses","/api/businesses",[["name","Business"],["category","Category"],["city","City"],["state","State"],["phone","Phone"],["phone_verification","Phone check"],["email","Email"],["email_verification","Email check"],["website_url","Website"],["website_status","Website status"],["activity_status","Activity"],["activity_score","Activity score"],["qualification_status","Qualification"],["qualification_reason","Qualification reason"],["confidence_score","Confidence"],["opportunity_score","Opportunity"]]);
   if(path==="/audits")return await tablePage("Website audits","Audits","/api/audits",[["name","Business"],["requested_url","Requested URL"],["http_status","HTTP"],["ssl_valid","SSL"],["mobile_test_status","Mobile viewport"],["mobile_heuristic_score","Mobile heuristic"],["audit_score","Audit score"],["links_checked","Links checked"],["broken_links_count","Broken links"],["forms_detected","Forms detected"],["contact_emails_json","Extracted emails"],["checked_at","Checked"]]);
   if(path==="/outreach")return await tablePage("Outreach drafts","Outreach","/api/outreach",[["name","Business"],["channel","Channel"],["subject","Subject"],["message","Message"],["strategy","Strategy"],["status","Status"],["created_at","Created"]]);
   if(path==="/runs")return await tablePage("Research runs","Runs","/api/runs",[["started_at","Started"],["completed_at","Completed"],["status","Status"],["target_count","Target"],["discovered_count","Found"],["qualified_count","Qualified"],["duplicate_count","Duplicates"],["failed_count","Failed"],["notes","Notes"]]);
   return json({error:"Not found"},404);
  } catch(e){
    return json({error:"Internal server error"},500);
  }
 },
 async scheduled(event,env,ctx){
   ctx.waitUntil(engRun(env).catch(async e=>{await env.DB.prepare("INSERT INTO research_runs(id,started_at,completed_at,target_count,status,notes) VALUES(?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,50,'failed',?)").bind(uuid(),String(e&&e.message||e).slice(0,350)).run();}));
 }
};
