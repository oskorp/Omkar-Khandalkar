const fs = require('fs');
const path = require('path');

function extract(regex, str, flags='i'){ const m = str.match(new RegExp(regex, flags)); return m?m[1].trim():''; }

function countMatches(regex, str, flags='ig'){ const m = str.match(new RegExp(regex, flags)); return m?m.length:0; }

function getNavOrder(str){
  const navMatch = str.match(/<ul[^>]*class=["'][^"']*nav-links[^"']*["'][\s\S]*?<\/ul>/i);
  if(!navMatch) return null;
  const ul = navMatch[0];
  const aMatches = [...ul.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/ig)].map(m=>m[1].replace(/<[^>]+>/g,'').trim());
  return aMatches;
}

function checkFile(filePath){
  const out = {file:filePath, issues:[], warnings:[], info:[]};
  if(!fs.existsSync(filePath)){ out.issues.push('File not found'); return out; }
  const html = fs.readFileSync(filePath,'utf8');

  const title = extract('<title>([\s\S]*?)<\/title>', html);
  if(!title) out.issues.push('Missing <title>');
  else if(title.length < 20) out.warnings.push(`<title> is short (${title.length} chars)`);

  const desc = extract('<meta[^>]*name=["\']description["\'][^>]*content=["\']([\s\S]*?)["\']', html);
  if(!desc) out.issues.push('Missing meta description');
  else if(desc.length < 50) out.warnings.push(`Meta description is very short (${desc.length} chars)`);
  else if(desc.length > 160) out.warnings.push(`Meta description is long (${desc.length} chars)`);

  const canonical = extract('<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([\s\S]*?)["\']', html);
  if(!canonical) out.warnings.push('Missing canonical link');

  const jsonldScripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/ig)].map(m=>m[1]);
  if(jsonldScripts.length===0) out.warnings.push('No JSON-LD structured data found');
  else{
    let hasPerson=false, hasAlternate=false;
    jsonldScripts.forEach(s=>{
      try{
        const j = JSON.parse(s);
        const items = Array.isArray(j)?j:[j];
        items.forEach(it=>{
          if(it['@type'] && String(it['@type']).toLowerCase().includes('person')) hasPerson=true;
          if(it['alternateName']) hasAlternate=true;
        });
      }catch(e){ /* ignore */ }
    });
    if(!hasPerson) out.warnings.push('JSON-LD present but no Person schema found');
    if(!hasAlternate) out.warnings.push('Person schema does not include alternateName entries');
  }

  const imgsTotal = countMatches('<img\b', html);
  const imgsWithAlt = countMatches('<img[^>]*alt=["\']', html);
  const imgsMissingAlt = imgsTotal - imgsWithAlt;
  if(imgsMissingAlt>0) out.warnings.push(`${imgsMissingAlt} <img> elements missing alt text (${imgsTotal} total)`);

  const h1count = countMatches('<h1\b', html);
  if(h1count===0) out.warnings.push('No H1 found');
  else if(h1count>1) out.warnings.push(`Multiple H1 elements found (${h1count})`);

  const navOrder = getNavOrder(html);
  if(navOrder){
    out.info.push('Navigation links: ' + navOrder.join(' | '));
    const desired = ['About','Work','Resume'];
    const idxs = desired.map(d=>navOrder.indexOf(d));
    if(idxs.some(i=>i===-1)) out.warnings.push('Navigation missing one of About/Work/Resume (check link text)');
    else if(!(idxs[0] < idxs[1] && idxs[1] < idxs[2])) out.warnings.push('Navigation order is not About → Work → Resume');
    else out.info.push('Navigation order About → Work → Resume is correct');
  } else {
    out.warnings.push('No .nav-links found to validate order');
  }

  return out;
}

function checkExtras(dir){
  return {robots:fs.existsSync(path.join(dir,'robots.txt')), sitemap:fs.existsSync(path.join(dir,'sitemap.xml'))};
}

function run(){
  const args = process.argv.slice(2);
  const files = args.length?args:['index.html','index-backup.html'];
  const cwd = process.cwd();
  const extras = checkExtras(cwd);
  const results = files.map(f=>checkFile(path.join(cwd,f))).filter(r=>r);

  console.log('\nSEO Audit — quick checklist');
  console.log('Directory:', cwd);
  console.log('robots.txt:', extras.robots ? 'found' : 'MISSING');
  console.log('sitemap.xml:', extras.sitemap ? 'found' : 'MISSING');
  console.log('\nFiles checked:', results.map(r=>r.file).join(', '), '\n');
  results.forEach(r=>{
    console.log('---', path.basename(r.file), '---');
    if(r.issues.length){ console.log('ISSUES:'); r.issues.forEach(x=>console.log('  -',x)); }
    if(r.warnings.length){ console.log('WARNINGS:'); r.warnings.forEach(x=>console.log('  -',x)); }
    if(r.info.length){ console.log('INFO:'); r.info.forEach(x=>console.log('  -',x)); }
    console.log('');
  });
  console.log('Suggested next steps:');
  console.log('- Ensure meta description length ~50-160 chars.');
  console.log('- Confirm JSON-LD Person has alternateName entries with target variants.');
  console.log('- Add alt text to images missing it.');
  console.log('- Verify canonical and open graph images are reachable.');
  console.log('- For a full Lighthouse audit, run Chrome DevTools Lighthouse or run `npx lighthouse <url>` where Chrome is available.');
}

run();
