'use strict';
// ====================== basis ======================
const cv=document.getElementById('c'),wctx=cv.getContext('2d'),fxc=document.getElementById('fxc'),fctx=fxc.getContext('2d');let ctx=wctx;
const IS_TOUCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;
let CW=800,CH=600,DPR=1;
function resize(){DPR=Math.min(window.devicePixelRatio||1,IS_TOUCH?2:2);CW=window.innerWidth;CH=window.innerHeight;cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);cv.style.width=CW+'px';cv.style.height=CH+'px';fxc.width=cv.width;fxc.height=cv.height;fxc.style.width=CW+'px';fxc.style.height=CH+'px';if(typeof lightsResize==='function')lightsResize();placeTopBtns();if(typeof MODE!=='undefined'&&MODE==='play'&&typeof renderWorld==='function'){try{renderWorld();}catch(e){}}}
window.addEventListener('resize',resize);
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,wrap=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a;};
const rr=(a,b)=>a+Math.random()*(b-a),rpick=a=>a[Math.random()*a.length|0];
let seed=1988;function rnd(){seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
const R=(a,b)=>a+rnd()*(b-a),RP=a=>a[Math.floor(rnd()*a.length)];
function shade(hex,f){const n=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,((n>>16)&255)*f)|0},${Math.min(255,((n>>8)&255)*f)|0},${Math.min(255,(n&255)*f)|0})`;}
const hsh=(x,y)=>(((x*73856093)^(y*19349663))>>>0);
function pip(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function bbox(p){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const q of p){if(q[0]<x0)x0=q[0];if(q[1]<y0)y0=q[1];if(q[0]>x1)x1=q[0];if(q[1]>y1)y1=q[1];}return[x0,y0,x1,y1];}
const lsGet=k=>{try{return localStorage.getItem(k);}catch(e){return null;}},lsSet=(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};

