import*as e from"path";import{PurgeCSS as s,defaultOptions as t,standardizeSafelist as o,mergeExtractorSelectors as r}from"purgecss";const n=function(n){if(void 0===n)throw new Error("PurgeCSS plugin does not have the correct options");return{postcssPlugin:"postcss-purgecss",OnceExit:(c,i)=>async function(n,c,{result:i}){const a=new s;let l;try{const s=e.resolve(process.cwd(),"purgecss.config.js");l=await import(s)}catch{}const p={...t,...l,...n,safelist:o((null==n?void 0:n.safelist)||(null==l?void 0:l.safelist))};n&&"function"==typeof n.contentFunction&&(p.content=n.contentFunction(c.source&&c.source.input.file||"")),a.options=p,p.variables&&(a.variablesStructure.safelist=p.safelist.variables||[]);const{content:u,extractors:f}=p,m=u.filter((e=>"string"==typeof e)),g=u.filter((e=>"object"==typeof e)),v=await a.extractSelectorsFromFiles(m,f),d=await a.extractSelectorsFromString(g,f),S=r(v,d);a.walkThroughCSS(c,S),a.options.fontFace&&a.removeUnusedFontFaces(),a.options.keyframes&&a.removeUnusedKeyframes(),a.options.variables&&a.removeUnusedCSSVariables(),a.options.rejected&&a.selectorsRemoved.size>0&&(i.messages.push({type:"purgecss",plugin:"postcss-purgecss",text:`purging ${a.selectorsRemoved.size} selectors:\n          ${Array.from(a.selectorsRemoved).map((e=>e.trim())).join("\n  ")}`}),a.selectorsRemoved.clear())}(n,c,i)}};n.postcss=!0;export{n as default};