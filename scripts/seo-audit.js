const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function checkFile(filePath){
  const out = {file: filePath, issues: [], warnings: [], info: []};
  if(!fs.existsSync(filePath)){
    out.issues.push('File not found');
    return out;
  }
  const html = fs.readFileSync(filePath,'utf8');
  const $ = cheerio.load(html);

  const title = $('head title').text().trim();
  if(!title) out.issues.push('Missing <title>');
  else if(title.length < 20) out.warnings.push(`<title> is short (${title.length} chars)`);

  const desc = $('meta[name="description"]').attr('content') || '';
  if(!desc) out.issues.push('Missing meta description');
  else if(desc.length < 50) out.warnings.push(`Meta description is very short (${desc.length} chars)`);
  else if(desc.length > 160) out.warnings.push(`Meta description is long (${desc.length} chars)`);

  const canonical = $('link[rel="canonical"]').attr('href');
  if(!canonical) out.warnings.push('Missing canonical link');

  const jsonld = $('script[type="application/ld+json"]').map((i,el)=>$(el).html()).get();
  if(jsonld.length===0) out.warnings.push('No JSON-LD structured data found');
  else{
    let hasPerson=false, hasAlternate=false;
    jsonld.forEach(s=>{
      try{
        const j = JSON.parse(s);
        const items = Array.isArray(j)?j:[j];
        items.forEach(it=>{
          if(it['@type'] && it['@type'].toLowerCase().includes('person')) hasPerson=true;
          if(it['alternateName']) hasAlternate=true;
        });
      }catch(e){ /* ignore parse errors */ }
    });
    if(!hasPerson) out.warnings.push('JSON-LD present but no Person schema found');
    if(!hasAlternate) out.warnings.push('Person schema does not include alternateName entries');
  }

  const imgsMissingAlt = $('img').filter((i,el)=>!$(el).attr('alt') || $(el).attr('alt').trim()==='').length;
  if(imgsMissingAlt>0) out.warnings.push(`${imgsMissingAlt} <img> elements missing alt text`);

  const h1count = $('h1').length;
  if(h1count===0) out.warnings.push('No H1 found');
  else if(h1count>1) out.warnings.push(`Multiple H1 elements found (${h1count})`);

  const metas = $('meta[name="keywords"]').attr('content');
  if(!metas) out.info.push('No meta keywords (OK — not required)');

  // check nav order if present
  const navLinks = $('.nav-links a').map((i,el)=>$(el).text().trim()).get();
  if(navLinks.length>0){
    const desired = ['About','Work','Resume'];
    const idxs = desired.map(d=>navLinks.indexOf(d));
    if(idxs.some(i=>i===-1)) out.warnings.push('Navigation missing one of About/Work/Resume (check link text)');
    else if(!(idxs[0] < idxs[1] && idxs[1] < idxs[2])) out.warnings.push('Navigation order is not About → Work → Resume');
    else out.info.push('Navigation order About → Work → Resume is correct');
  } else {
    out.warnings.push('No .nav-links found to validate order');
  }

  return out;
}

function checkExtras(dir){
  const out = {robots:false,sitemap:false};
  out.robots = fs.existsSync(path.join(dir,'robots.txt'));
  out.sitemap = fs.existsSync(path.join(dir,'sitemap.xml'));
  return out;
}

function run(){
  const args = process.argv.slice(2);
  const files = args.length?args:['index.html'];
  const cwd = process.cwd();
  const extras = checkExtras(cwd);
  const results = files.map(f=>checkFile(path.join(cwd,f))).filter(r=>r);
  console.log('\nSEO Audit — quick checklist');
  console.log('Directory:', cwd);
  console.log('robots.txt:', extras.robots ? 'found' : 'MISSING');
  console.log('sitemap.xml:', extras.sitemap ? 'found' : 'MISSING');
  console.log('\nFiles checked:', results.map(r=>r.file).join(', '), '\n');
  results.forEach(r=>{
    console.log('---', r.file, '---');
    if(r.issues.length) { console.log('ISSUES:'); r.issues.forEach(x=>console.log('  -',x)); }
    if(r.warnings.length) { console.log('WARNINGS:'); r.warnings.forEach(x=>console.log('  -',x)); }
    if(r.info.length) { console.log('INFO:'); r.info.forEach(x=>console.log('  -',x)); }
    console.log('');
  });
  console.log('Suggested next steps:');
  console.log('- Ensure meta description length ~50-160 chars.');
  console.log('- Add/validate JSON-LD Person alternateName entries include target search variants.');
  console.log('- Add alt text to images missing it.');
  console.log('- Verify canonical and open graph images are reachable.');
  console.log('- If you want a full Lighthouse run, ensure Node + Chrome are available and run `npx lighthouse <url>` or use Chrome DevTools audits.');
}

run();
