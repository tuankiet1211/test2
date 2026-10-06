(function(){
/* ==========================================================================
   KLIGHT – Bài thử tư duy v2
   Đề được SINH BẰNG THUẬT TOÁN: đáp án đúng luôn được tính từ quy luật,
   các đáp án nhiễu luôn khác đáp án đúng (so sánh theo hình thật sự được vẽ),
   vị trí đáp án được xáo ngẫu nhiên. Mỗi lần làm là một đề khác.
   LƯU Ý: chưa có chuẩn hóa -> chỉ báo điểm thô theo nhóm năng lực, KHÔNG báo số IQ.
   ========================================================================== */
const INK="#2F3E55",CL=["#5196D6","#E07A5F","#E8C443","#9B6CC9"]; /* tránh cặp đỏ/xanh lá (mù màu) */
const SH=["circle","square","triangle","diamond","hexagon"],NEXT={circle:"square",square:"triangle",triangle:"diamond",diamond:"hexagon",hexagon:"circle"};
const DOM={c:[0,1,2,3],k:SH,f:[0,1],z:[0,1,2],n:[1,2,3,4]},DEF={c:0,k:"circle",f:1,z:1,n:1};

/* ---------- tiện ích ngẫu nhiên ---------- */
let seed=(Date.now()^(Math.random()*4294967296))>>>0;
const rand=()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const ri=(a,b)=>a+Math.floor(rand()*(b-a+1)),pick=a=>a[ri(0,a.length-1)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const chg=(m,a)=>({...m,[a]:pick(DOM[a].filter(x=>x!==(m[a]??DEF[a])))});

/* ---------- vẽ hình ---------- */
const plg=(p,at)=>`<polygon points="${p.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ")}" ${at}/>`;
function shp(k,x,y,r,at){
 if(k==="circle")return`<circle cx="${x}" cy="${y}" r="${r}" ${at}/>`;
 if(k==="square")return`<rect x="${x-r*.85}" y="${y-r*.85}" width="${r*1.7}" height="${r*1.7}" ${at}/>`;
 if(k==="diamond")return plg([[x,y-r*1.2],[x+r*.9,y],[x,y+r*1.2],[x-r*.9,y]],at);
 if(k==="arrow")return plg([[-1,-.35],[.2,-.35],[.2,-.8],[1,0],[.2,.8],[.2,.35],[-1,.35]].map(([a,b])=>[x+a*r,y+b*r]),at);
 const n={triangle:3,hexagon:6}[k],p=[];for(let i=0;i<n;i++){const a=i*2*Math.PI/n-Math.PI/2;p.push([x+r*Math.cos(a),y+r*Math.sin(a)])}return plg(p,at)}
const POS={1:[[50,50]],2:[[32,50],[68,50]],3:[[50,30],[30,66],[70,66]],4:[[32,32],[68,32],[32,68],[68,68]]};
function mk(m){ /* m: k hình, c màu, z cỡ, f đặc/rỗng, r góc xoay, n số lượng */
 const n=Math.min(m.n||1,4),r=n>1?13:[14,22,30][m.z??1],col=CL[m.c??0],h=m.f===0,rr=(m.r||0)%360;
 const at=`fill="${h?"#fff":col}" stroke="${h?col:INK}" stroke-width="${h?4:2.4}" stroke-linejoin="round"`;
 return`<svg viewBox="0 0 100 100" aria-hidden="true"><g${rr?` transform="rotate(${rr} 50 50)"`:""}>${POS[n].map(([x,y])=>shp(m.k,x,y,r,at)).join("")}</g></svg>`}
function cs(set,n){ /* lưới ô tô màu */
 const w=92/n,e=(r,c,f,s)=>`<rect x="${4+c*w+1.5}" y="${4+r*w+1.5}" width="${w-3}" height="${w-3}" rx="3" fill="${f}" ${s||""}/>`;
 let s=`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="8" fill="#EEF1F3"/>`;
 for(let r=0;r<n;r++)for(let c=0;c<n;c++)s+=e(r,c,"#fff");
 set.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]).forEach(([r,c])=>s+=e(r,c,CL[0],`stroke="${INK}" stroke-width="1.5"`));return s+"</svg>"}

/* ---------- khung hiển thị ---------- */
const bx=(h,s)=>`<div style="width:${s||52}px;height:${s||52}px;flex:none;background:#fff;border:1px solid #D5DADF;border-radius:8px;display:flex;padding:2px">${h}</div>`;
const qb=s=>`<div style="width:${s||52}px;height:${s||52}px;flex:none;background:#FCFAEA;border:2px dashed #F0A23E;border-radius:8px;display:flex;align-items:center;justify-content:center;font:700 1.3rem var(--font-display);color:#8A9A9A">?</div>`;
const AR='<span style="color:#8A9A9A;font-weight:700;flex:none">→</span>';
const strip=a=>`<div style="display:flex;align-items:center;gap:6px;background:#EEF1F3;padding:10px;border-radius:14px;max-width:100%;overflow-x:auto">${a.join(AR)}${AR}${qb()}</div>`;
const grid=(cells,n)=>`<div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:4px;width:${n*70}px;max-width:100%;background:#EEF1F3;padding:5px;border-radius:12px">${cells.map(c=>`<div style="aspect-ratio:1;background:#fff;border:1px solid #D5DADF;border-radius:6px;display:flex;padding:2px">${c}</div>`).join("")}<div style="aspect-ratio:1;background:#FCFAEA;border:2px dashed #F0A23E;border-radius:6px;display:flex;align-items:center;justify-content:center;font:700 1.4rem var(--font-display);color:#8A9A9A">?</div></div>`;
const tx=n=>`<span style="font:700 1.5rem var(--font-display);color:var(--navy);margin:auto">${n}</span>`;
const nbx=n=>`<div style="min-width:46px;height:46px;padding:0 8px;flex:none;background:#fff;border:1px solid #D5DADF;border-radius:8px;display:flex;align-items:center;justify-content:center;font:700 1.15rem var(--font-display);color:var(--navy)">${n}</div>`;

/* ---------- hoàn thiện câu hỏi: loại trùng, xáo đáp án ---------- */
function fin(o,k){
 const seen=new Set([o.cor]),d=[];
 for(const x of o.dis)if(!seen.has(x)){seen.add(x);d.push(x)}
 if(d.length<k-1)return null;
 const opts=shuf([o.cor,...d.slice(0,k-1)]);return{...o,opts,ans:opts.indexOf(o.cor)}}

/* ---------- câu hỏi: 8 dạng ---------- */
const P={matrix:["Mảnh ghép nào hoàn thành bảng?","Which piece completes the grid?"],
 series:["Hình nào tiếp theo trong dãy?","What comes next in the sequence?"],
 num:["Số nào tiếp theo trong dãy?","Which number comes next?"],
 eq:["Giá trị của hình vuông là bao nhiêu?","What is the value of the square?"],
 odd:["Hình nào khác với các hình còn lại?","Which one is different from the others?"],
 analogy:["Hoàn thành cặp hình tương quan.","Complete the analogy."],
 count:["Có bao nhiêu hình?","How many shapes are there?"],
 mem:["Nhấn “Xem mẫu” (chỉ xem 1 lần), ghi nhớ rồi chọn đúng hình đã thấy.","Press “View” (once only), memorise it, then pick the pattern you saw."],
 sp:[["Hình nào là hình mẫu sau khi xoay 90° theo chiều kim đồng hồ?","Which shows the shape after turning it 90° clockwise?"],
     ["Hình nào là ảnh của hình mẫu khi soi gương (gương đặt bên phải)?","Which is the mirror image (mirror on the right)?"],
     ["Hình nào là hình mẫu đã được xoay (không bị lật)?","Which is the same shape turned around (not flipped)?"]]};
const G={};

/* 1. Ma trận (suy luận lưu động – kiểu Raven) */
G.matrix=(lvl,k,young)=>{
 const n=young?2:3,S=shuf(SH).slice(0,n),C=shuf([0,1,2,3]).slice(0,n);let f;
 if(young||lvl<=1)f=(r,c)=>({k:S[c],c:C[r]});
 else if(lvl===2)f=(r,c)=>({k:S[(r+c)%3],c:C[(r+2*c)%3]});
 else if(lvl===3)f=(r,c)=>({k:S[(r+c)%3],c:C[(r+2*c)%3],z:r});
 else f=(r,c)=>({k:S[(r+c)%3],c:C[(r+2*c)%3],z:r,n:c+1});
 const cells=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(r<n-1||c<n-1)cells.push(mk(f(r,c)));
 const a=f(n-1,n-1),dis=young?[mk(f(0,1)),mk(f(1,0))]:[mk(f(2,1)),mk(f(1,2))];
 dis.push(mk(chg(a,"k")),mk(chg(a,"c")),mk(chg(a,"z")),mk(chg(a,"n")));
 return fin({p:P.matrix,stim:grid(cells,n),cor:mk(a),dis},k)};

/* 2. Dãy hình */
G.series=(lvl,k)=>{
 const S=shuf(SH).slice(0,3),C=shuf([0,1,2,3]),c0=C[0],st=pick([45,90]);let fn,show=5;
 switch(Math.min(lvl,5)){
  case 0:fn=i=>({k:S[0],c:c0,n:i+1});show=3;break;
  case 1:fn=i=>({k:S[i%2],c:c0});break;
  case 2:fn=i=>({k:S[i%3],c:C[i%3]});break;
  case 3:fn=i=>({k:S[i%3],c:c0,f:i%2});break;
  case 4:fn=i=>({k:"arrow",c:c0,r:i*st});break;
  default:fn=i=>({k:S[0],c:C[i%2],z:i%3})}
 const a=fn(show),dis=[mk(fn(show-1)),mk(fn(show+1)),mk(chg(a,"c")),mk(chg(a,"k")),mk(chg(a,"f")),mk(chg(a,"z"))];
 if(a.k==="arrow")dis.unshift(mk({...a,r:a.r+180}));
 return fin({p:P.series,stim:strip([...Array(show)].map((_,i)=>bx(mk(fn(i))))),cor:mk(a),dis},k)};

/* 3. Dãy số (suy luận định lượng) */
G.num=(lvl,k)=>{
 const a=ri(1,9);let s=[],d=1,sh=5;
 switch(Math.min(lvl,6)){
  case 1:d=ri(2,5);s=[0,1,2,3,4,5].map(i=>a+i*d);sh=4;break;
  case 2:{const d1=ri(1,4),d2=ri(2,6);let v=a;s=[v];for(let i=0;i<5;i++){v+=i%2?d2:d1;s.push(v)}d=d1+d2;break}
  case 3:{const m=pick([2,3]),b=ri(1,3);s=[0,1,2,3,4,5].map(i=>b*m**i);d=s[3];sh=4;break}
  case 4:s=[0,1,2,3,4,5].map(i=>a+i*(i+1)/2);d=5;break;
  case 5:{const x=ri(1,4),y=ri(2,6);s=[x,y];for(let i=2;i<6;i++)s.push(s[i-1]+s[i-2]);d=s[4];break}
  default:{const p=ri(1,6),q=ri(10,30),d1=ri(2,5),d2=ri(2,5);s=[...Array(6)].map((_,i)=>i%2?q+(i>>1)*d2:p+(i>>1)*d1);d=d2}}
 const ans=s[sh],last=s[sh-1],ex=last+(last-s[sh-2]);
 const dis=[ex,ans+1,ans-1,ans+d,ans-d,ans+2,ans-2].filter(x=>x>0&&x!==ans).map(tx);
 return fin({p:P.num,stim:`<div style="display:flex;align-items:center;gap:6px;background:#EEF1F3;padding:10px;border-radius:14px;max-width:100%;overflow-x:auto">${s.slice(0,sh).map(nbx).join(AR)}${AR}${qb(46)}</div>`,cor:tx(ans),dis},k)};

/* 4. Hệ phương trình bằng hình */
G.eq=(lvl,k)=>{
 const ico=m=>`<span style="width:30px;height:30px;display:inline-flex">${mk(m)}</span>`,X=ico({k:"square",c:1}),Y=ico({k:"circle",c:0});
 const row=(t,v)=>`<div style="display:flex;align-items:center;gap:4px;font:700 1.1rem var(--font-display);color:var(--navy)">${t.join("+")}&nbsp;=&nbsp;${v}</div>`;
 let x=ri(2,7),y=ri(2,7),ans,rows;
 if(lvl<=1){ans=y;rows=[row([X,X],2*x),row([X,Y],x+y)];ans=y}
 else if(lvl===2){ans=x;rows=[row([X,X,Y],2*x+y),row([X,Y],x+y)]}
 else{y=2*ri(1,4);ans=x;rows=[row([X,X,Y],2*x+y),row([Y,Y],2*y)]}
 const w=lvl<=1?"Giá trị của hình tròn là bao nhiêu?":null;
 const dis=[ans+1,ans-1,ans+2,ans-2,x+y,2*ans].filter(v=>v>0&&v!==ans).map(tx);
 return fin({p:lvl<=1?["Giá trị của hình tròn là bao nhiêu?","What is the value of the circle?"]:P.eq,stim:`<div style="display:flex;flex-direction:column;gap:6px;background:#EEF1F3;padding:12px;border-radius:14px">${rows.join("")}</div>`,cor:tx(ans),dis},k)};

/* 5. Hình khác biệt (phân loại) – 5 lựa chọn */
G.odd=lvl=>{
 const A=["c","k","f","z","n"][Math.min(Math.max(lvl,1),5)-1],base={k:"circle",c:0,f:1,z:1,n:1},d=DOM[A];
 const v=pick(d),w=pick(d.filter(x=>x!==v)),pos=ri(0,4),ms=[];
 const noise=a=>{const nv=shuf(DOM[a]).slice(0,2);return shuf([nv[0],nv[0],nv[0],nv[1],nv[1]])};
 const nz={};["c","k"].forEach(a=>{if(a!==A)nz[a]=noise(a)});
 for(let i=0;i<5;i++){const m={...base};for(const a in nz)m[a]=nz[a][i];m[A]=i===pos?w:v;ms.push(m)}
 return{p:P.odd,stim:"",opts:ms.map(mk),ans:pos}};

/* 6. Tương quan A:B = C:? */
const TF=[{l:1,f:m=>({...m,f:1-(m.f??1)}),ok:()=>1},
 {l:2,f:m=>({...m,z:(m.z??1)+1}),ok:m=>(m.z??1)<2},
 {l:2,f:m=>({...m,c:(m.c+1)%4}),ok:()=>1},
 {l:3,f:m=>({...m,r:((m.r||0)+90)%360}),ok:m=>m.k==="arrow",ar:1},
 {l:3,f:m=>({...m,n:(m.n||1)+1}),ok:m=>(m.n||1)<4},
 {l:4,f:m=>({...m,k:NEXT[m.k]}),ok:m=>m.k!=="arrow"}];
G.analogy=(lvl,k)=>{
 const L=Math.min(lvl,5);let pool=TF.filter(t=>L>=5?t.l<=3&&!t.ar:t.l<=L&&t.l>=Math.max(1,L-1)),t=pick(pool),f=t.f,ok=t.ok;
 if(L>=5){const t2=pick(pool.filter(x=>x!==t));f=m=>t2.f(t.f(m));ok=m=>t.ok(m)&&t2.ok(t.f(m))}
 const rm=()=>({k:t.ar?"arrow":pick(SH),c:ri(0,3),z:ri(0,1),n:ri(1,3),f:ri(0,1),r:0});
 let A,Cc;do{A=rm();Cc=rm()}while(!ok(A)||!ok(Cc)||(A.k===Cc.k&&A.c===Cc.c));
 const D=f(Cc),dis=[mk(Cc),mk(chg(D,"c")),mk(chg(D,"f"))];
 TF.filter(x=>x.ok(Cc)&&x.l<=Math.max(L,3)&&x.f!==f&&x!==t).forEach(x=>dis.push(mk(x.f(Cc))));
 const s=`<div style="display:grid;grid-template-columns:70px 22px 70px;gap:6px;align-items:center;justify-items:center;background:#EEF1F3;padding:10px;border-radius:14px;width:fit-content;max-width:100%">${bx(mk(A),70)}${AR}${bx(mk(f(A)),70)}${bx(mk(Cc),70)}${AR}${qb(70)}</div>`;
 return fin({p:P.analogy,stim:s,cor:mk(D),dis},k)};

/* 7. Không gian: xoay / lật khối ô vuông */
const rot=(s,n)=>s.map(([r,c])=>[c,n-1-r]),flp=(s,n)=>s.map(([r,c])=>[r,n-1-c]);
const key=s=>s.map(x=>x.join()).sort().join("|");
const nk=s=>{const a=Math.min(...s.map(x=>x[0])),b=Math.min(...s.map(x=>x[1]));return key(s.map(([r,c])=>[r-a,c-b]))};
function poly(n,m){const s=[[ri(0,n-1),ri(0,n-1)]];while(s.length<m){const[r,c]=pick(s),[dr,dc]=pick([[0,1],[1,0],[0,-1],[-1,0]]),a=r+dr,b=c+dc;if(a>=0&&b>=0&&a<n&&b<n&&!s.some(x=>x[0]===a&&x[1]===b))s.push([a,b])}return s}
G.spatial=(lvl,k)=>{
 const n=lvl<=1?3:4,m=lvl<=1?4:lvl<=3?5:6,v=lvl<=2?0:lvl<=4?1:2;
 for(let t=0;t<500;t++){
  const s0=poly(n,m),R=[s0];for(let i=0;i<3;i++)R.push(rot(R[i],n));
  const M=[flp(s0,n)];for(let i=0;i<3;i++)M.push(rot(M[i],n));
  if(new Set([...R,...M].map(nk)).size<8)continue; /* chỉ dùng hình bất đối xứng */
  const g=a=>cs(a,n);let cor,dis;
  if(v===0){cor=g(R[1]);dis=[g(R[2]),g(R[3]),g(M[0])]}
  else if(v===1){cor=g(M[0]);dis=shuf([g(R[1]),g(R[2]),g(R[3]),g(R[0])])}
  else{cor=g(R[ri(1,3)]);dis=shuf(M.map(g))}
  const o=fin({p:P.sp[v],stim:`<div style="width:130px;height:130px">${g(s0)}</div>`,cor,dis},k);if(o)return o}
 return null};

/* 8. Trí nhớ hình ảnh (làm việc ngắn hạn) */
G.mem=(lvl,k)=>{
 const n=lvl<=3?3:4,m=lvl+1,all=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)all.push([r,c]);
 const set=shuf(all).slice(0,m),dis=[];
 for(let i=0;i<8;i++){const s=shuf(set).slice(1),e=pick(all.filter(x=>!set.some(y=>y[0]===x[0]&&y[1]===x[1])));dis.push(cs([...s,e],n))}
 return fin({p:P.mem,stim:"",mem:{pat:cs(set,n),sec:lvl<=2?4:5},cor:cs(set,n),dis},k)};

/* 9. Đếm (trẻ 4–5 tuổi) */
G.count=(lvl,k)=>{
 const m=ri([2,4,6][lvl-1],[4,6,9][lvl-1]),sp=shuf([...Array(9).keys()]).slice(0,m),kk=pick(SH),cc=ri(0,3);
 const at=`fill="${CL[cc]}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"`;
 const sv=`<svg viewBox="0 0 100 100" aria-hidden="true">${sp.map(i=>shp(kk,20+30*(i%3),20+30*(i/3|0),11,at)).join("")}</svg>`;
 return fin({p:P.count,stim:`<div style="width:130px;height:130px;background:#fff;border:1px solid #D5DADF;border-radius:12px">${sv}</div>`,cor:tx(m),dis:[m+1,m-1,m+2,m-2].filter(x=>x>0).map(tx)},k)};

/* ---------- cấu hình theo độ tuổi (4 nhóm; mỗi mục = 1 câu, số là mức khó) ---------- */
const AGES=[
{id:"a",name:"Starter",min:20,k:3,y:1,n:["4 – 5 tuổi","Ages 4–5"],
 d:["Hình khối lớn, đếm, dãy hình và ghi nhớ đơn giản.","Large shapes, counting, simple sequences and memory."],
 s:{matrix:[1,1,1,1],series:[0,0,0],count:[1,2,3],odd:[1,1,2],analogy:[1,1,2],mem:[1,1]}},
{id:"b",name:"Junior",min:25,k:4,n:["6 – 8 tuổi","Ages 6–8"],
 d:["Ma trận 3×3, dãy hình, dãy số, xoay hình và trí nhớ.","3×3 matrices, sequences, number series, rotation and memory."],
 s:{matrix:[1,1,2,2,2],series:[1,2,2,3],num:[1,1,2],spatial:[1,1,1],odd:[1,2,3],analogy:[1,2,3],mem:[1,2,3]}},
{id:"c",name:"Standard",min:30,k:4,n:["9 – 11 tuổi","Ages 9–11"],
 d:["Quy luật nhiều biến, suy luận số, lật xoay khối và trí nhớ.","Multi-variable rules, numerical reasoning, spatial turning and memory."],
 s:{matrix:[2,2,3,3,4],series:[2,3,3,4],num:[2,3,3,4],eq:[1,2],spatial:[1,2,3,3],odd:[2,3,4],analogy:[2,3,4],mem:[2,3,4]}},
{id:"d",name:"Advanced",min:35,k:4,n:["12 – 15 tuổi","Ages 12–15"],
 d:["Logic trừu tượng, hệ phương trình, hình không gian khó, trí nhớ 4×4.","Abstract logic, equation systems, hard spatial items, 4×4 memory."],
 s:{matrix:[3,3,4,4,4,4],series:[3,4,4,5,5],num:[3,4,4,5,5,6],eq:[2,3,3],spatial:[3,3,4,5,5],odd:[3,4,5],analogy:[3,4,5],mem:[3,4,5]}}];
const GRP={matrix:"lg",series:"lg",odd:"lg",analogy:"lg",num:"nm",eq:"nm",count:"nm",spatial:"sp",mem:"mm"};
const GN={lg:["Suy luận logic","Logical reasoning"],nm:["Suy luận số","Numerical reasoning"],sp:["Tư duy không gian","Spatial reasoning"],mm:["Trí nhớ hình ảnh","Visual memory"]};

function build(a){
 const out=[];
 for(const dom in a.s)for(const lvl of a.s[dom]){
  let q=null;for(let t=0;t<40&&!q;t++){try{q=G[dom](lvl,a.k,a.y)}catch(e){q=null}}
  if(!q)throw new Error("Không sinh được câu: "+dom);
  out.push({...q,dom,lvl,o:rand()})}
 return out.sort((x,y)=>x.lvl-y.lvl||x.o-y.o)}
window.__iqBuild=build;window.__iqAges=AGES;
if(typeof document==="undefined"||!document.getElementById("iq-cards"))return;

/* ==========================================================================
   GIAO DIỆN (giữ nguyên id/class của index.html và iq.css)
   ========================================================================== */
const st=document.createElement("style");
st.textContent=".iq-st svg{width:100%;height:100%}.iq-c4{background:linear-gradient(135deg,#9B7BB8,#7A5C9B)}.iq-bar{height:10px;border-radius:99px;background:var(--line);overflow:hidden;margin:4px 0 12px}.iq-bar i{display:block;height:100%;background:var(--navy)}";
document.head.appendChild(st);
const tg=document.querySelector(".iq-tg");if(tg)tg.style.display="none"; /* không báo đúng/sai ngay: tránh làm sai lệch kết quả */
const ft=document.querySelectorAll(".iq-feat span");if(ft[2])ft[2].textContent="⏱ 20–35 phút theo độ tuổi · 20–35 min by age";

const S={vi:{it:"Bài thử",back:"← Chọn độ tuổi khác",go:"Bắt đầu làm bài",t:"Bài thử tư duy trẻ em online – ",cau:"Câu",qs:"câu hỏi",min:"phút",ph:"Câu hỏi",prev:"Quay lại",next:"Tiếp theo",page:"Trang",sub:"Nộp bài",left:"Còn %d câu chưa làm. Vẫn nộp bài?",view:"👁 Xem mẫu",
 fT:"Bé đã hoàn thành bài thử!",fS:"Ba mẹ vui lòng để lại thông tin để nhận kết quả của bé.",l:["Tên của bé *","Ngày sinh / tuổi của bé","Tên phụ huynh *","Số điện thoại / Zalo *"],send:"Nhận kết quả",
 err:"Vui lòng nhập tên bé, tên phụ huynh và số điện thoại 10 số (bắt đầu bằng 0).",tT:"Cảm ơn ba mẹ!",tm:"Đội ngũ KLight sẽ liên hệ trong 24h tới. Đây là điểm tham khảo, chưa phải kết quả đo IQ chính thức.",fail:"Có lỗi xảy ra. Vui lòng thử lại sau.",sending:"Đang gửi...",home:"Về trang chủ",res:"Bé trả lời đúng",
 ld:(a,n)=>`Đề gồm ${n} câu hình ảnh (${a.min} phút) đo 4 nhóm: suy luận logic, suy luận số, tư duy không gian, trí nhớ hình ảnh. Ba mẹ để bé tự làm, không gợi ý. Đây là bài thử tham khảo, không phải bài đo IQ chính thức.`},
en:{it:"Test",back:"← Choose another age",go:"Start the test",t:"Kids Reasoning Practice Test Online – ",cau:"Question",qs:"questions",min:"minutes",ph:"Questions",prev:"Back",next:"Next",page:"Page",sub:"Submit",left:"%d question(s) unanswered. Submit anyway?",view:"👁 View pattern",
 fT:"Your child has finished the test!",fS:"Please leave your details to receive your child's result.",l:["Child's name *","Child's birthday / age","Parent's name *","Phone / Zalo *"],send:"Get result",
 err:"Please enter the child's name, parent's name and a 10-digit phone number starting with 0.",tT:"Thank you!",tm:"The KLight team will contact you within 24 hours. This is a reference score, not an official IQ result.",fail:"Something went wrong. Please try again later.",sending:"Sending...",home:"Back to home",res:"Correct answers",
 ld:(a,n)=>`${n} visual questions (${a.min} minutes) covering logical, numerical, spatial reasoning and visual memory. Let your child work alone without hints. This is a reference practice test, not an official IQ test.`}};
const $=i=>document.getElementById("iq-"+i),app=document.getElementById("iqApp"),T=k=>S[L][k],li=()=>L==="vi"?0:1,PS=25;
let age,L="vi",QS,N,ans,tick,left,score,pg,doms;
const show=i=>{["home","intro","exam","form","thanks"].forEach(s=>$(s).classList.toggle("iq-hide",s!==i));app.scrollIntoView({block:"start"})};

$("cards").innerHTML=AGES.map((a,i)=>`<button type="button" class="iq-age iq-c${i+1}" data-id="${a.id}"><small>${a.n[1].toUpperCase()} · ${a.n[0]}</small><h3>${a.name}</h3><p>${a.d[0]}</p><p class="iq-en2">${a.d[1]}</p><span class="iq-go">Bắt đầu · Start →</span></button>`).join("");
document.querySelectorAll(".iq-age").forEach(e=>e.onclick=()=>{age=AGES.find(a=>a.id===e.dataset.id);setLang("vi");show("intro")});
const cnt=a=>Object.values(a.s).reduce((x,y)=>x+y.length,0);
function renderIntro(){const n=cnt(age);$("iTitle").textContent=T("it")+" "+age.name+" · "+age.n[li()];$("iMeta").innerHTML=`<span>📝 ${n} ${T("qs")}</span><span>⏱ ${age.min} ${T("min")}</span>`;$("iDesc").textContent=T("ld")(age,n);$("back1").textContent=T("back");$("start").textContent=T("go")}
function head(){$("title").textContent=T("t")+age.name+" · "+age.n[li()];$("m1").textContent=`📝 ${N} ${T("qs")}`;$("m2").textContent=`⏱ ${age.min} ${T("min")}`;$("m3").textContent="🎓 "+age.n[li()];$("ph").textContent=T("ph");$("pp").textContent=T("prev");$("pnx").textContent=T("next");$("submit").textContent=T("sub")}
function setLang(l){L=l;document.querySelectorAll(".iq-lang button").forEach(b=>b.classList.toggle("on",b.dataset.l===l));if(age)renderIntro();if(!$("exam").classList.contains("iq-hide")){head();draw()}}
document.querySelectorAll(".iq-lang button").forEach(b=>b.onclick=()=>setLang(b.dataset.l));
$("back1").onclick=()=>show("home");$("again").onclick=()=>show("home");
const clock=()=>$("timer").textContent=String(left/60|0).padStart(2,"0")+":"+String(left%60).padStart(2,"0");
$("start").onclick=()=>{QS=build(age);N=QS.length;ans=Array(N).fill(null);left=age.min*60;pg=0;head();draw();show("exam");clock();clearInterval(tick);tick=setInterval(()=>{left--;clock();if(left<=0)finish()},1000)};

const memHtml=(q,i)=>`<div class="iq-st" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><div id="iq-mv${i}" style="width:130px;height:130px;background:#EEF1F3;border-radius:14px;display:flex;align-items:center;justify-content:center;font:700 1.6rem var(--font-display);color:#8A9A9A">${q.seen?"?":"👁"}</div><button type="button" class="btn btn-outline iq-mb" data-i="${i}" ${q.seen?"disabled":""}>${T("view")}</button></div>`;
function draw(){
 $("qs").innerHTML=QS.map((q,i)=>`<div class="iq-q" id="iq-q${i}"><b>${T("cau")} ${i+1}:</b><div class="iq-qp"><div style="font-weight:700;color:var(--navy);font-size:1.05rem">${q.p[li()]}</div></div><div class="iq-qrow">${q.mem?memHtml(q,i):q.stim?`<div class="iq-st">${q.stim}</div>`:""}<div class="iq-opts">${q.opts.map((o,j)=>`<label class="iq-opt${ans[i]===j?" on":""}" id="iq-o${i}_${j}"><input type="radio" name="iqq${i}" value="${j}" ${ans[i]===j?"checked":""} aria-label="${"ABCDE"[j]}"><b>${"ABCDE"[j]}</b>${o}</label>`).join("")}</div></div></div>`).join("");
 document.querySelectorAll("#iq-qs input").forEach(r=>r.onchange=()=>{const i=+r.name.slice(3),j=+r.value;ans[i]=j;QS[i].opts.forEach((_,k)=>$("o"+i+"_"+k).classList.toggle("on",k===j));pal()});
 document.querySelectorAll(".iq-mb").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,q=QS[i],v=$("mv"+i);q.seen=1;b.disabled=true;v.style.padding="6px";v.innerHTML=q.mem.pat;setTimeout(()=>{v.style.padding="0";v.textContent="?"},q.mem.sec*1000)});
 pal()}
function pal(){
 const pages=Math.ceil(N/PS);
 $("pal").innerHTML=[...Array(N).keys()].slice(pg*PS,pg*PS+PS).map(i=>`<button type="button" class="${ans[i]!==null?"done":""}" data-i="${i}">${i+1}</button>`).join("");
 document.querySelectorAll("#iq-pal button").forEach(b=>b.onclick=()=>document.getElementById("iq-q"+b.dataset.i).scrollIntoView({block:"center"}));
 $("pn").textContent=`${T("page")} ${pg+1}/${pages}`;$("pp").disabled=pg===0;$("pnx").disabled=pg>=pages-1}
$("pp").onclick=()=>{pg--;pal()};$("pnx").onclick=()=>{pg++;pal()};
$("submit").onclick=()=>{const u=ans.filter(a=>a===null).length;if(u&&!confirm(T("left").replace("%d",u)))return;finish()};

function finish(){
 clearInterval(tick);score=0;doms={};
 QS.forEach((q,i)=>{const g=GRP[q.dom],d=doms[g]=doms[g]||[0,0],ok=ans[i]===q.ans;d[1]++;if(ok){d[0]++;score++}});
 $("fT").textContent=T("fT");$("fS").textContent=T("fS");T("l").forEach((t,i)=>$("l"+(i+1)).textContent=t);$("send").textContent=T("send");$("err").textContent="";show("form")}

$("send").onclick=async()=>{
 const d={child:$("fChild").value.trim(),age:$("fAge").value.trim(),parent:$("fParent").value.trim(),phone:$("fPhone").value.trim()};
 if(!d.child||!d.parent||!/^0\d{9}$/.test(d.phone)){$("err").textContent=T("err");return}
 const lang=L==="vi"?"Tiếng Việt":"English",as=ans.map(a=>a===null?"-":"ABCDE"[a]).join(""),ex=age.name+" "+age.n[0],used=age.min*60-Math.max(left,0);
 const ds=Object.entries(doms).map(([g,v])=>g+":"+v[0]+"/"+v[1]).join(",");
 const payload={name:d.parent,phone:d.phone,product:`Bài thử tư duy v2 | Bé: ${d.child}${d.age?" ("+d.age+")":""} | ${ex} | Điểm ${score}/${N} | ${ds} | ${used}s | ${lang}`,
  source:"Bài thử tư duy v2",child:d.child,childAge:d.age,exam:ex,score:score+"/"+N,domains:ds,seconds:used,language:lang,answers:as,version:"v2"};
 $("err").textContent=T("sending");$("send").disabled=true;
 try{await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
  $("err").textContent="";$("tT").textContent=T("tT");
  $("tmsg").innerHTML=`<b>${T("res")}: ${score}/${N}</b><br><br>`+Object.entries(doms).map(([g,v])=>`${GN[g][li()]}: ${v[0]}/${v[1]}<div class="iq-bar"><i style="width:${Math.round(v[0]/v[1]*100)}%"></i></div>`).join("")+T("tm");
  $("again").textContent=T("home");["fChild","fAge","fParent","fPhone"].forEach(k=>$(k).value="");show("thanks")}
 catch(e){console.error(e);$("err").textContent=T("fail")}
 finally{$("send").disabled=false}};
})();