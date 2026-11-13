// Bouwt index.html uit src/ (HTML, CSS, JS-modules), vendor/pixi.min.js en data/game.json.
// Gebruik:  node tools/build.mjs            (leesbaar)
//           node tools/build.mjs --min      (game-code verkleind, vereist esbuild: npm i -D esbuild)
import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),rd=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=fs.readdirSync(path.join(root,'src/js')).filter(f=>f.endsWith('.js')).sort();
let game=files.map(f=>`// ---- ${f}\n`+rd('src/js/'+f)).join('\n');
if(process.argv.includes('--min')){const esb=await import('esbuild');game=(await esb.transform(game,{minify:true,target:'es2020'})).code;}
const html=rd('src/index.html').replace('/*CSS*/',()=>rd('src/style.css'))
  .replace('__WORLD__',()=>rd('data/game.json'))
  .replace('<script>\n/*GAME*/\n</script>',()=>`<script>${rd('vendor/pixi.min.js')}</script>\n<script>\n${game}\n</script>`);
fs.writeFileSync(path.join(root,'index.html'),html);
console.log(`index.html gebouwd: ${files.length} modules, ${(html.length/1024|0)} kB`);
