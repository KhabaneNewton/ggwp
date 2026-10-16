(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var cl=function(v,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.max(a,Math.min(b,v))};
var pinned=0,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,vh=innerHeight,vw=innerWidth,ticking=false;
/* loader ~5 detik */
var LD=$('#loader'),num=$('#ldNum'),t0=null,DUR=reduce?1200:4650;
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function lstep(ts){if(t0===null)t0=ts;var t=Math.min((ts-t0)/DUR,1),p=Math.round(ease(t)*100);LD.style.setProperty('--p',p);num.textContent=String(p).padStart(3,'0');
 if(t<1){requestAnimationFrame(lstep);return}
 setTimeout(function(){LD.classList.add('out');document.documentElement.classList.remove('loading');scrollTo(0,0);tgt=cur=0;measure();req();setTimeout(function(){LD.remove()},1000)},350)}
requestAnimationFrame(lstep);
/* smooth scroll berinersia */
var tgt=scrollY,cur=scrollY,sraf=0,smooth=!reduce&&!matchMedia('(pointer:coarse)').matches;
function maxS(){return document.documentElement.scrollHeight-innerHeight}
var TAU=.45,sprev=0;/* TAU = lama meluncur: makin besar makin lama berhenti (.45 = sekitar 3 detik) */
function sloop(ts){var dt=sprev?Math.min(ts-sprev,64)/1000:.016;sprev=ts;var d=tgt-cur;if(Math.abs(d)<.3){cur=tgt;scrollTo(0,cur);sraf=0;sprev=0;return}cur+=d*(1-Math.exp(-dt/TAU));scrollTo(0,cur);sraf=requestAnimationFrame(sloop)}
function goTo(y){tgt=cl(y,0,maxS());if(smooth){if(!sraf)sraf=requestAnimationFrame(sloop)}else scrollTo({top:tgt,behavior:'smooth'})}
if(smooth){addEventListener('wheel',function(e){if(e.ctrlKey||document.documentElement.classList.contains('loading')||$('#panel').classList.contains('open'))return;e.preventDefault();var dy=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*innerHeight:e.deltaY;tgt=cl((sraf?tgt:scrollY)+dy,0,maxS());if(!sraf)sraf=requestAnimationFrame(sloop)},{passive:false});
 addEventListener('keydown',function(e){if(e.metaKey||e.ctrlKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||'')||document.documentElement.classList.contains('loading'))return;var k=e.key,base=sraf?tgt:scrollY,m=null;
  if(k==='ArrowDown')m=base+120;else if(k==='ArrowUp')m=base-120;else if(k==='PageDown'||(k===' '&&!e.shiftKey))m=base+vh*.9;else if(k==='PageUp'||(k===' '&&e.shiftKey))m=base-vh*.9;else if(k==='Home')m=0;else if(k==='End')m=maxS();
  if(m===null)return;e.preventDefault();goTo(m)});
 addEventListener('scroll',function(){if(!sraf){tgt=cur=scrollY}},{passive:true})}
/* transisi blok miring */
$$('.tiles').forEach(function(h){['a','b'].forEach(function(k){var g=document.createElement('div');g.className='tl '+k;for(var i=0;i<12;i++){var t=document.createElement('div');t.className='tt';t.innerHTML='<i></i>';g.appendChild(t)}h.appendChild(g)})});
function wipe(h,c){for(var l=0;l<2;l++){var ts=h.children[l].children;for(var k=0;k<12;k++){var d=(k%4)*.12+Math.floor(k/4)*.04,v,y;if(c<=1){v=ease(cl(c*2-d-(l?.5:0)));y=(v-1)*110}else{v=ease(cl((c-1)*2-d-(l?0:.5)));y=v*110}ts[k].firstChild.style.transform='translateY('+y+'%)'}}}
/* scene */
var CFG={hero:{A:.15,B:.55,under:1,inw:0},q1:{A:.72,B:.86,under:1,inw:.1},q2:{A:.9,B:1,under:0,inw:.1},galeri:{A:.9,B:.95,under:1,inw:.04,ov:1}};
var sc=$$('.scene').map(function(el){var s={el:el,t:el.dataset.t,tiles:$('.tiles',el),pin:$('.pin',el),cfg:CFG[el.id],top:0,h:1,idx:-1};
 if(s.t==='hero'){s.frame=$('.frame',el);s.h1=$('h1',el);s.cue=$('.cue',el);s.tag=$('.tag',el);s.hide=[s.frame,s.h1,s.cue,s.tag]}
 else if(s.t==='quote'){s.a=$('[data-a]',el);s.b=$('[data-b]',el);s.c=$('[data-c]',el);s.tw=0;s.hide=[s.a,s.b,s.c]}
 else{s.stage=$('.stage',el);s.items=$$('.gi',el);s.caps=$$('.caps span',el);s.hide=[s.stage,$('.caps',el),$('.gtit',el)]}
 return s});
var par=$$('[data-par]'),secs=['tentang','puncak','riwayat','galeri','endorse'].map(function(id){return $('#'+id)}),lis=$$('#panel li'),bar=$('#bar');
function measure(){vh=innerHeight;vw=innerWidth;sc.forEach(function(s){s.top=s.el.getBoundingClientRect().top+scrollY;s.h=Math.max(1,s.el.offsetHeight-vh);if(s.c)s.tw=s.c.scrollWidth})}
function update(){ticking=false;var y=scrollY;
 bar.style.transform='scaleX('+(y/Math.max(1,document.documentElement.scrollHeight-vh))+')';
 sc.forEach(function(s){if(s.cfg.ov)s.pin.style.display=y>=s.top-1?'':'none';if(y+vh<s.top||y>s.top+s.h+vh)return;
  var p=cl((y-s.top)/s.h),f=s.cfg,A=f.A,B=f.B,
   cin=(p<.3&&f.inw)?1+cl(p/f.inw):0,cout=p>=.3?cl((p-A)/(B-A))+(B<1?cl((p-B)/(1-B)):0):0,c=cin||cout,hid=f.under&&p>=B;
  if(s.t==='hero'){s.frame.style.transform='scale('+(1+.1*Math.min(p,B))+')';s.h1.style.transform='translateY('+(-18*Math.min(p,B))+'vh)';s.h1.style.opacity=1-Math.min(p,B)*1.4;s.cue.style.opacity=1-cl(p*5);s.tag.style.opacity=1-cl(p*4)}
  else if(s.t==='quote'){var tp=cl(p/A);s.a.style.transform='scale('+(1.25-.2*tp)+')';s.b.style.opacity=.5-.12*tp;s.c.style.transform='translate3d('+(vw*.9-tp*(s.tw+vw*.9))+'px,0,0)'}
  else{var gp=cl(p/A),N=s.items.length,GAP=260,t=gp*(N+.5)*GAP,e=cl(p/.08);
   s.stage.style.transform='scale('+(.72+.28*e)+')';s.stage.style.borderRadius=(8*(1-e))+'px';
   s.items.forEach(function(it,i){var z=-i*GAP+t,o=cl((z+GAP*2.6)/GAP)*(1-cl((z-40)/220));it.style.zIndex=N-i;it.style.transform='translate3d(0,0,'+z+'px)';it.style.opacity=o;it.style.visibility=o<.01?'hidden':'visible'});
   var ix=cl(Math.round(t/GAP),0,N-1);if(ix!==s.idx){s.idx=ix;s.caps.forEach(function(cp,k){cp.classList.toggle('on',k===ix)})}}
  s.hide.forEach(function(el){el.style.visibility=hid?'hidden':'visible'});s.pin.style.background=hid?'transparent':'';
  wipe(s.tiles,c)});
 par.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;el.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*parseFloat(el.dataset.par))+'px,0)'});
 var cur=-1;secs.forEach(function(el,i){if(el.getBoundingClientRect().top<=vh*.5)cur=i});lis.forEach(function(li,i){li.classList.toggle('on',i===cur)})}
function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){measure();req()});addEventListener('load',function(){measure();req()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){measure();req()});
measure();req();
/* reveal */
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});$$('.rv').forEach(function(el){io.observe(el)})}else{$$('.rv').forEach(function(el){el.classList.add('in')})}
/* panel bab */
var panel=$('#panel'),shade=$('#shade');function tog(o){panel.classList.toggle('open',o);shade.classList.toggle('on',o)}
$('#chBtn').onclick=function(){tog(true)};$('#chX').onclick=function(){tog(false)};shade.onclick=function(){tog(false)};
addEventListener('keydown',function(e){if(e.key==='Escape')tog(false)});
$$('#panel [data-go]').forEach(function(b){b.onclick=function(){tog(false);var el=$('#'+b.dataset.go);goTo(el.getBoundingClientRect().top+scrollY)}});
/* bahasa ID/EN: nama gunung tidak diterjemahkan */
var tr=$$('[data-en]'),wa=$('a[href^="https://wa.me"]'),waID=wa.getAttribute('href');
tr.forEach(function(e){e.setAttribute('data-id',e.textContent)});
function setLang(l){tr.forEach(function(e){e.textContent=e.getAttribute(l==='en'?'data-en':'data-id')});
 wa.setAttribute('href',l==='en'?'https://wa.me/628172864881?text=Hello%20abynxz%2C%20I%27m%20interested%20in%20an%20endorsement.':waID);
 document.documentElement.lang=l;$$('.lang b').forEach(function(b,i){b.classList.toggle('on',(i===1)===(l==='en'))});measure();try{localStorage.setItem('lang',l)}catch(e){}}
$('.lang').onclick=function(){setLang(document.documentElement.lang==='en'?'id':'en')};
try{if(localStorage.getItem('lang')==='en')setLang('en')}catch(e){}
/* kontur ketinggian */
var cv=$('#topo'),g=cv.getContext('2d'),W,H,S,cols,rows,F,last=0;
function csize(){var d=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;S=W<700?22:18;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0);cols=Math.ceil(W/S)+2;rows=Math.ceil(H/S)+2;F=new Float32Array(cols*rows)}
function draw(t){var ty=scrollY*.5,tj=Math.floor(ty/S),fy=ty-tj*S,i,j,k;
 for(j=0;j<rows;j++)for(i=0;i<cols;i++){var X=i*S/650,Y=(tj+j)*S/650;F[j*cols+i]=Math.sin(X*3.1)+Math.sin(Y*2.6)+Math.sin((X+Y)*2.2)+.8*Math.sin(Math.hypot(X-1.2,Y-.6)*5)+1.5*Math.sin(X*6.6+1)*Math.sin(Y*6.1)*Math.sin(t*.5)+1.3*Math.cos(X*5.2)*Math.cos(Y*6.8+2)*Math.sin(t*.4+2)+1.1*Math.sin((X-Y)*6)*Math.sin(t*.65+4)+.9*Math.cos((X+Y)*7.4)*Math.sin(t*.35+1)}
 g.clearRect(0,0,W,H);var mi=new Path2D(),ma=new Path2D(),best={};
 for(k=-11;k<=11;k++){var Lv=k*.35,M=((k%4)+4)%4===0,P=M?ma:mi;
  for(j=0;j<rows-1;j++)for(i=0;i<cols-1;i++){var a=F[j*cols+i],b=F[j*cols+i+1],e=F[(j+1)*cols+i+1],d=F[(j+1)*cols+i],m=(a<Lv)+(b<Lv)+(e<Lv)+(d<Lv);if(m===0||m===4)continue;
   var x0=i*S,y0=j*S-fy,p=[];
   if((a<Lv)!==(b<Lv))p.push(x0+S*(Lv-a)/(b-a),y0);
   if((b<Lv)!==(e<Lv))p.push(x0+S,y0+S*(Lv-b)/(e-b));
   if((d<Lv)!==(e<Lv))p.push(x0+S*(Lv-d)/(e-d),y0+S);
   if((a<Lv)!==(d<Lv))p.push(x0,y0+S*(Lv-a)/(d-a));
   P.moveTo(p[0],p[1]);P.lineTo(p[2],p[3]);if(p.length>4){P.moveTo(p[4],p[5]);P.lineTo(p[6],p[7])}
   var mx=(p[0]+p[2])/2,my=(p[1]+p[3])/2,ax=W*(.12+.76*((k*.618+12)%1)),ay=H*(.12+.76*((k*.382+12.3)%1)),dd=(mx-ax)*(mx-ax)+(my-ay)*(my-ay);if(!best[k]||dd<best[k][0])best[k]=[dd,mx,my,Math.atan2(p[3]-p[1],p[2]-p[0])]}}
 g.lineWidth=1;g.strokeStyle='rgba(255,255,255,.14)';g.stroke(mi);g.lineWidth=1.3;g.strokeStyle='rgba(255,255,255,.34)';g.stroke(ma);
 g.font='600 10px Manrope,sans-serif';g.textAlign='center';g.textBaseline='middle';
 Object.keys(best).forEach(function(k){var q=best[k],a=q[3];if(a>Math.PI/2)a-=Math.PI;else if(a<-Math.PI/2)a+=Math.PI;var s=(2000+(+k)*50)+' m',w=g.measureText(s).width;g.save();g.translate(q[1],q[2]);g.rotate(a);g.fillStyle='#000';g.fillRect(-w/2-4,-7,w+8,14);g.fillStyle='rgba(255,255,255,.8)';g.fillText(s,0,0);g.restore()})}
function cloop(ms){requestAnimationFrame(cloop);if(ms-last<48)return;last=ms;draw(ms/1000)}
csize();addEventListener('resize',function(){csize();draw(performance.now()/1000)});
if(reduce){draw(0);addEventListener('scroll',function(){draw(0)},{passive:true})}else requestAnimationFrame(cloop);
})();
