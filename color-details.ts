import fs from 'fs';

function main() {
  const html = fs.readFileSync('./fetched_site.html', 'utf-8');
  
  console.log('--- LOOKING FOR COLOR SCHEMES OR VARIABLES ---');
  // Match CSS variables in style blocks
  const varMatches = html.matchAll(/--[a-zA-Z0-9-]+:\s*[^;]+/g);
  const vars = new Set<string>();
  for (const m of varMatches) {
    vars.add(m[0]);
  }
  vars.forEach(v => console.log(v));

  console.log('\n--- LOOKING FOR INLINE SPREAD STYLES ---');
  // Let's search for container backgrounds
  const bgMatches = html.matchAll(/background(?:-color)?:\s*([^;"]+)/g);
  const bgs = new Set<string>();
  for (const m of bgMatches) {
    bgs.add(m[1].trim());
  }
  bgs.forEach(bg => console.log(bg));
}

main();
