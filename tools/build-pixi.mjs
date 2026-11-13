import * as esbuild from '/opt/npm-tools/node_modules/esbuild/lib/main.js';
import path from 'path';
const PX='/home/claude/pixijs/pixijs/src', D='/home/claude/pixidep';
const alias={'eventemitter3':D+'/eventemitter3/index.mjs','earcut':D+'/earcut/src/earcut.js','colord':D+'/colord/src/index.ts','colord/plugins/names':D+'/colord/src/plugins/names.ts',
 'tiny-lru':D+'/tiny-lru/src/lru.js','ismobilejs':D+'/isMobile/src/index.ts','parse-svg-path':D+'/parse-svg-path/src/index.ts','@xmldom/xmldom':D+'/xmldom/lib/index.js'};
const plug={name:'px',setup(b){
  b.onResolve({filter:/^(eventemitter3|earcut|colord|colord\/plugins\/names|tiny-lru|ismobilejs|parse-svg-path|@xmldom\/xmldom)$/},a=>({path:alias[a.path]}));
  b.onResolve({filter:/^~\//},a=>({path:path.join(PX,a.path.slice(2))+(a.path.endsWith('.ts')?'':'')}));
  b.onResolve({filter:/^pixi\.js(\/.*)?$/},a=>({path:a.path==='pixi.js'?PX+'/index.ts':path.join(PX,a.path.slice(9))}));
  b.onResolve({filter:/^worker:/},a=>({path:path.join(a.resolveDir,a.path.slice(7)),namespace:'wk'}));
  b.onLoad({filter:/.*/,namespace:'wk'},async a=>{const r=await esbuild.build({entryPoints:[a.path],bundle:true,write:false,minify:true,format:'iife',plugins:[plug]});const code=r.outputFiles[0].text;
    return{contents:`const code=${JSON.stringify(code)};let url=null;export default class W{constructor(){if(!url)url=URL.createObjectURL(new Blob([code],{type:'application/javascript'}));this.worker=new Worker(url);}static revokeObjectURL(){if(url){URL.revokeObjectURL(url);url=null;}}}`,loader:'js'};});
}};
const r=await esbuild.build({entryPoints:[PX+'/index.ts'],bundle:true,minify:true,format:'iife',globalName:'PIXI',outfile:'pixi.min.js',target:'es2020',plugins:[plug],
  resolveExtensions:['.ts','.mjs','.js'],logLevel:'error',ignoreAnnotations:true,define:{'$_VERSION':'"8.23.0"','process.env.NODE_ENV':'"production"'},loader:{'.frag':'text','.vert':'text','.wgsl':'text'}});
console.log('done');
