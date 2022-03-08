import{d as v,o as u,c as g,a as n,b as c,u as T,R as P,F as C,s as E,e as M,f as X,g as Y,h as V,B as F,i as O,r as h,t as p,j as R,k as B,p as Z,l as L,m as N,n as z,q as A,v as U,P as j}from"./vendor.dfb9e074.js";const q=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}};q();const H=n("header",null,[n("nav")],-1),K={class:"app-content"},G=v({setup(t){return(e,o)=>(u(),g(C,null,[H,n("div",K,[c(T(P))])],64))}}),J="modulepreload",_={},Q="/fractals/",y=function(e,o){return!o||o.length===0?e():Promise.all(o.map(a=>{if(a=`${Q}${a}`,a in _)return;_[a]=!0;const s=a.endsWith(".css"),r=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${r}`))return;const d=document.createElement("link");if(d.rel=s?"stylesheet":J,s||(d.as="script",d.crossOrigin=""),d.href=a,document.head.appendChild(d),s)return new Promise((l,m)=>{d.addEventListener("load",l),d.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${a}`)))})})).then(()=>e())};function tt(){return new Worker("/fractals/assets/mandelbrot.429441bd.js",{type:"module"})}const S=1.5,I=-1.5,D=-1,f=300,$=2/f,x=1e3;var et=v({name:"MandelbrotPlot",components:{Button:E,InputNumber:M,Slider:X,InputSwitch:Y,ProgressSpinner:V},data(){return{canvasWidth:f,startX:I,startY:D,delta:$,zoomFactor:S,maxIter:x,computing:!1,worker:null,debouncedEvent:new F(void 0),debouncedCallback:()=>{},dragStart:null}},computed:{isTouchScreen(){return window.matchMedia("(pointer: coarse)").matches}},mounted(){this.doReset(),this.computeMandelbrot(),this.debouncedEvent.pipe(O(500)).subscribe(()=>this.debouncedCallback())},methods:{async handleReset(){this.doInterrupt(),this.doReset(),this.doDebounced(()=>this.computeMandelbrot())},handleTouchStart(t){t.preventDefault(),t.stopPropagation(),this.dragStart={x:t.touches[0].clientX,y:t.touches[0].clientY}},handleTouchEnd(t){if(t.preventDefault(),t.stopPropagation(),this.dragStart){const[e,o]=[this.dragStart.x-t.changedTouches[0].clientX,t.changedTouches[0].clientY-this.dragStart.y];this.doDebounced(()=>this.doTranslate(e,o))}},handleDragStart(t){var e;this.isTouchScreen||(t.dataTransfer&&(t.dataTransfer.dropEffect="move"),(e=t.dataTransfer)==null||e.setDragImage(new Image(0,0),0,0),this.dragStart={x:t.clientX,y:t.clientY})},handleDrop(t){if(!this.isTouchScreen&&this.dragStart){const[e,o]=[this.dragStart.x-t.clientX,t.clientY-this.dragStart.y];this.doDebounced(()=>this.doTranslate(e,o))}},handleDragOver(t){t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move")},handleZoomIn(){this.doDebounced(()=>{this.doInterrupt(),this.doZoom(this.zoomFactor)})},handleZoomOut(){this.doDebounced(()=>{this.doInterrupt(),this.doZoom(1/this.zoomFactor)})},handleCanvasWidthChanged(t){const[e,o]=[this.startX+this.canvasWidth/2*this.delta,this.startY+this.canvasWidth/2*this.delta];this.startX=e-this.delta*t/2,this.startY=o-this.delta*t/2,this.canvasWidth=t,this.doInterrupt(),this.doDebounced(()=>this.computeMandelbrot())},handleZoomFactorChanged(){this.doInterrupt()},handleMaxIterChanged(){this.doInterrupt(),this.doDebounced(()=>this.computeMandelbrot())},doTranslate(t,e){this.startX=this.startX+t*this.delta,this.startY=this.startY+e*this.delta,this.computeMandelbrot()},doDebounced(t){this.debouncedCallback=t,this.debouncedEvent.next()},doInterrupt(){var t;(t=this.worker)==null||t.terminate()},async doReset(){this.doInterrupt(),this.zoomFactor=S,this.startX=I,this.startY=D,this.canvasWidth=f,this.delta=$,this.maxIter=x},doZoom(t){const[e,o]=[this.canvasWidth/2,this.canvasWidth/2],[a,s]=[this.startX+e*this.delta,this.startY+o*this.delta];return this.delta=1/t*this.delta,this.startX=a-this.delta*this.canvasWidth/2,this.startY=s-this.delta*this.canvasWidth/2,this.computeMandelbrot()},computeMandelbrot(){return this.computing=!0,new Promise(t=>{this.worker=new tt,this.worker.postMessage({startX:this.startX,startY:this.startY,delta:this.delta,size:this.canvasWidth,maxIter:this.maxIter}),this.worker.onmessage=({data:e})=>{ot({data:st(e,this.canvasWidth),canvas:this.$refs.canvas,size:this.canvasWidth,max_iter:this.maxIter}),this.computing=!1,t()}})}}});function st(t,e){const o=new ArrayBuffer(t.buffer.byteLength),a=new Uint32Array(o);for(let s=0;s<e;s++)a.set(t.slice(s*e,(s+1)*e),(e-1-s)*e);return a}function ot({data:t,canvas:e,size:o,max_iter:a}){const s=e.getContext("2d"),r=s.createImageData(o,o);t.forEach((d,l)=>{r.data[4*l+0]=0,r.data[4*l+1]=0,r.data[4*l+2]=255,r.data[4*l+3]=d===a?255:0}),s.putImageData(r,0,0)}var W=(t,e)=>{const o=t.__vccOpts||t;for(const[a,s]of e)o[a]=s;return o};const b=t=>(Z("data-v-0988c969"),t=t(),L(),t),at=b(()=>n("div",{class:"text-xs secondary-text-color mb-2"},"Settings:",-1)),nt={class:"control-panel"},rt={class:"zoom-factor"},it={class:"mb-2"},dt={class:"size"},lt={class:"mb-2"},ct=b(()=>n("div",{class:"mb-1"},"Max iterations:",-1)),ht={class:"align-self-end"},ut={class:"canvas-container"},mt={class:"canvas-header"},pt={class:"text-sm secondary-text-color flex align-items-center"},ft=b(()=>n("span",{class:"mr-1 text-xs"},"zoom",-1)),vt={class:"spinner-wrapper"},gt=["width","height"],bt={class:"text-xs secondary-text-color"};function _t(t,e,o,a,s,r){const d=h("Slider"),l=h("InputNumber"),m=h("Button"),k=h("ProgressSpinner");return u(),g(C,null,[at,n("div",nt,[n("div",rt,[n("div",it,"Zoom factor: "+p(t.zoomFactor),1),c(d,{modelValue:t.zoomFactor,"onUpdate:modelValue":e[0]||(e[0]=i=>t.zoomFactor=i),step:.05,min:1,max:4,onChange:e[1]||(e[1]=i=>t.handleZoomFactorChanged())},null,8,["modelValue","step","min","max"])]),n("div",dt,[n("div",lt,"Size: "+p(t.canvasWidth+"px"),1),c(d,{modelValue:t.canvasWidth,onChange:e[2]||(e[2]=i=>t.handleCanvasWidthChanged(i)),step:10,min:300,max:1e3},null,8,["modelValue"])]),n("div",null,[ct,c(l,{modelValue:t.maxIter,"onUpdate:modelValue":e[3]||(e[3]=i=>t.maxIter=i),onInput:e[4]||(e[4]=i=>t.handleMaxIterChanged()),step:500,min:1e3,max:1e5,showButtons:!0},null,8,["modelValue"])]),n("div",ht,[c(m,{label:"Reset",onClick:e[5]||(e[5]=i=>t.handleReset())})])]),n("div",ut,[n("div",null,[n("div",mt,[n("div",pt,[ft,n("i",{onClick:e[6]||(e[6]=i=>t.handleZoomIn()),class:"pi pi-plus-circle mr-1 cursor-pointer"}),n("i",{onClick:e[7]||(e[7]=i=>t.handleZoomOut()),class:"pi pi-minus-circle cursor-pointer"})]),n("div",vt,[t.computing?(u(),R(k,{key:0,strokeWidth:"5"})):B("",!0)])]),n("canvas",{ref:"canvas",draggable:"true",onDragstart:e[8]||(e[8]=i=>t.handleDragStart(i)),onDragover:e[9]||(e[9]=i=>t.handleDragOver(i)),onDrop:e[10]||(e[10]=i=>t.handleDrop(i)),onTouchstart:e[11]||(e[11]=i=>t.handleTouchStart(i)),onTouchend:e[12]||(e[12]=i=>t.handleTouchEnd(i)),width:t.canvasWidth,height:t.canvasWidth},null,40,gt),n("div",bt," units per pixel: "+p(t.delta),1)])])],64)}var yt=W(et,[["render",_t],["__scopeId","data-v-0988c969"]]);const St=v({name:"MandelbrotDocs"});function It(t,e,o,a,s,r){return u(),g("div",null,"hello")}var Dt=W(St,[["render",It]]);const $t=N({history:z("/fractals/"),routes:[{path:"/",redirect:"/mandelbrot"},{path:"/mandelbrot",component:()=>y(()=>import("./MandelbrotView.0bed5b1c.js"),["assets/MandelbrotView.0bed5b1c.js","assets/vendor.dfb9e074.js"]),children:[{path:"",component:yt},{path:"docs",component:Dt}]},{path:"/about",name:"about",component:()=>y(()=>import("./AboutView.6399d92d.js"),["assets/AboutView.6399d92d.js","assets/AboutView.ab071ea6.css","assets/vendor.dfb9e074.js"])}]});const w=A(G);w.use(U()).use($t).use(j);w.mount("#app");export{W as _};
