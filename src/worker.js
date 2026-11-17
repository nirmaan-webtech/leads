const headers = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "cache-control": "no-store"
};
const htmlHeaders = { "content-type": "text/html; charset=utf-8", "x-content-type-options":"nosniff", "x-frame-options":"DENY", "referrer-policy":"strict-origin-when-cross-origin" };
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
<a href="/logout">Sign out</a></nav></aside><main class="main"><div class="top"><div><div class="eyebrow">India · B2B prospecting</div><h1>${escapeHtml(title)}</h1></div><span class="pill">Private workspace</span></div>${content}</main></div></body></html>`;
}
const loginPage = (error="") => html(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in · Nirmaan Lead Hunter</title><style>body{background:#090d16;color:#edf2fb;font:15px system-ui;display:grid;place-items:center;min-height:100vh;margin:0}.card{background:#111827;border:1px solid #253047;border-radius:16px;padding:30px;width:min(92vw,420px)}h1{font-size:24px}.muted{color:#96a3b8}label{display:block;margin:14px 0 6px;color:#96a3b8}input{width:100%;box-sizing:border-box;padding:12px;border-radius:8px;border:1px solid #314059;background:#0b1220;color:white}button{margin-top:18px;width:100%;padding:12px;background:#d7b56d;border:0;border-radius:8px;font-weight:700}.err{color:#ff9292}</style></head><body><form class="card" method="post" action="/login"><div class="muted">NIRMAAN WEBTECH</div><h1>Lead Hunter</h1><p class="muted">Sign in to your private prospecting dashboard.</p><label>Username</label><input name="username" autocomplete="username" required><label>Password</label><input name="password" type="password" autocomplete="current-password" required><button>Sign in</button><p class="err">${escapeHtml(error)}</p></form></body></html>`);
async function api(req, env, path) {
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
    const u=new URL(req.url), q=u.searchParams.get("q")||"", status=u.searchParams.get("status")||"";
    let query="SELECT * FROM businesses WHERE 1=1", params=[];
    if(q){query+=" AND (name LIKE ? OR city LIKE ? OR state LIKE ? OR category LIKE ?)";params.push(...Array(4).fill("%"+q+"%"))}
    if(status){query+=" AND qualification_status=?";params.push(status)}
    query+=" ORDER BY opportunity_score DESC, created_at DESC LIMIT 250";
    const rows=await env.DB.prepare(query).bind(...params).all();
    return json(rows.results);
  }
  if(path==="/api/runs"){const rows=await env.DB.prepare("SELECT * FROM research_runs ORDER BY started_at DESC LIMIT 100").all();return json(rows.results)}
  if(path==="/api/audits"){const rows=await env.DB.prepare("SELECT a.*,b.name,b.website_url FROM website_audits a LEFT JOIN businesses b ON b.id=a.business_id ORDER BY a.checked_at DESC LIMIT 100").all();return json(rows.results)}
  if(path==="/api/outreach"){const rows=await env.DB.prepare("SELECT o.*,b.name FROM outreach_drafts o LEFT JOIN businesses b ON b.id=o.business_id ORDER BY o.created_at DESC LIMIT 100").all();return json(rows.results)}
  if(path==="/api/export.csv"){
    const rows=await env.DB.prepare("SELECT name,category,city,state,phone,email,website_url,website_status,qualification_status,opportunity_score,source_url FROM businesses ORDER BY opportunity_score DESC").all();
    const keys=["name","category","city","state","phone","email","website_url","website_status","qualification_status","opportunity_score","source_url"];
    const csv=[keys.join(","),...rows.results.map(r=>keys.map(k=>'"'+String(r[k]??"").replace(/"/g,'""')+'"').join(","))].join("\r\n");
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
     const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:310000,hash:"SHA-256"},key,256);
     const passHash="pbkdf2$310000$"+hex(salt)+"$"+hex(bits);
     await env.DB.prepare("INSERT INTO app_users(username,password_hash) VALUES(?,?)").bind(username,passHash).run();
     return Response.redirect(new URL("/login",req.url),303);
   }
   if(path==="/login" && req.method==="GET")return loginPage();
   if(path==="/login" && req.method==="POST"){
     const form=await req.formData(), username=String(form.get("username")||""), password=String(form.get("password")||"");
     const user=await env.DB.prepare("SELECT * FROM app_users WHERE username=?").bind(username).first();
     if(!user)return loginPage("Invalid username or password.");
     const parts=user.password_hash.split("$"), salt=Uint8Array.from(parts[2].match(/../g),x=>parseInt(x,16));
     const key=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveBits"]);
     const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:Number(parts[1]),hash:"SHA-256"},key,256);
     if(hex(bits)!==parts[3])return loginPage("Invalid username or password.");
     const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,"0")).join("");
     const tokenHash=await sha(token);
     await env.DB.prepare("INSERT INTO app_sessions(token_hash,user_id,expires_at) VALUES(?,?,datetime('now','+12 hours'))").bind(tokenHash,user.id).run();
     return new Response(null,{status:303,headers:{"location":"/","set-cookie":"nlh_session="+token+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200"}});
   }
   if(path==="/logout"){
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
    return html(shell("Overview",`<div class="grid">${cards}</div><div class="panel"><div class="row"><div><h2>Research engine</h2><div class="hint">Two-hour schedule is registered. Discovery remains safely inactive until a permitted provider is configured; no synthetic lead records are created.</div></div><span class="pill warn">Provider required</span></div><p class="hint">Target per run: 50 qualified prospects · Geography: India · Duplicate prevention: enabled through unique business keys.</p></div><div class="panel"><h2>Recent research runs</h2><div class="tablewrap"><table><thead><tr><th>Started</th><th>Status</th><th>Found</th><th>Qualified</th><th>Notes</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">No runs yet</td></tr>'}</tbody></table></div></div>`));
   }
   const tablePage=async(title,active,endpoint,cols)=>{
     return html(shell(title,`<div class="panel"><div class="row"><div><h2>${title}</h2><div class="hint">Latest 100 records. Business export is available in CSV format.</div></div><a class="btn secondary" href="/api/export.csv">Export CSV</a></div><div class="tablewrap"><table id="data"><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join("")}</tr></thead><tbody><tr><td colspan="${cols.length}" class="empty">Loading…</td></tr></tbody></table></div></div><script>
fetch("${endpoint}").then(r=>r.json()).then(rows=>{const tb=document.querySelector("#data tbody");tb.innerHTML="";if(!rows.length){tb.innerHTML='<tr><td colspan="${cols.length}" class="empty">No records yet</td></tr>';return}for(const r of rows){const tr=document.createElement("tr");tr.innerHTML=${JSON.stringify(cols.map(c=>c[0]))}.map(k=>{const td=document.createElement("td");td.textContent=r[k]??"—";return td.outerHTML}).join("");tb.appendChild(tr)}}).catch(()=>document.querySelector("#data tbody").innerHTML='<tr><td class="empty">Could not load data</td></tr>');
</script>`,active));
   };
   if(path==="/businesses")return await tablePage("Businesses","Businesses","/api/businesses",[["name","Business"],["category","Category"],["city","City"],["state","State"],["phone","Phone"],["email","Email"],["website_url","Website"],["website_status","Website status"],["qualification_status","Qualification"],["opportunity_score","Score"]]);
   if(path==="/audits")return await tablePage("Website audits","Audits","/api/audits",[["name","Business"],["requested_url","Requested URL"],["http_status","HTTP"],["ssl_valid","SSL"],["mobile_test_status","Mobile"],["desktop_test_status","Desktop"],["performance_mobile","Mobile score"],["broken_links_count","Broken links"],["checked_at","Checked"]]);
   if(path==="/outreach")return await tablePage("Outreach drafts","Outreach","/api/outreach",[["name","Business"],["channel","Channel"],["subject","Subject"],["message","Message"],["strategy","Strategy"],["status","Status"],["created_at","Created"]]);
   if(path==="/runs")return await tablePage("Research runs","Runs","/api/runs",[["started_at","Started"],["completed_at","Completed"],["status","Status"],["target_count","Target"],["discovered_count","Found"],["qualified_count","Qualified"],["duplicate_count","Duplicates"],["failed_count","Failed"],["notes","Notes"]]);
   return json({error:"Not found"},404);
  } catch(e){return json({error:"Internal server error",detail:env.ENVIRONMENT==="development"?String(e):undefined},500);}
 },
 async scheduled(event,env,ctx){
   const provider=await env.DB.prepare("SELECT value FROM app_settings WHERE key='discovery_provider_enabled'").first();
   const runId=uuid();
   await env.DB.prepare("INSERT INTO research_runs(id,started_at,target_count,status,notes) VALUES(?,CURRENT_TIMESTAMP,50,'skipped',?)").bind(runId,provider?.value==="true"?"Provider enabled but adapter not configured":"No discovery provider configured; skipped to avoid fake leads").run();
 }
};
