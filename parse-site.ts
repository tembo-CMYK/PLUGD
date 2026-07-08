import fs from 'fs';

function main() {
  const html = fs.readFileSync('./fetched_site.html', 'utf-8');
  let out = '';

  out += '=== METADATA ===\n';
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="(.*?)"/)?.[1];
  out += `Title: ${title}\n`;
  out += `Description: ${desc}\n\n`;

  out += '=== ALL HEADINGS ===\n';
  const headingRegex = /<(h[1-6])([\s\S]*?)>(.*?)<\/h[1-6]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const attrs = match[2];
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    if (text) {
      out += `${match[1].toUpperCase()} [attrs: ${attrs.substring(0, 40)}...]: ${text}\n`;
    }
  }

  out += '\n=== ALL PARAGRAPHS ===\n';
  const pRegex = /<p([\s\S]*?)>([\s\S]*?)<\/p>/gi;
  while ((match = pRegex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      out += `P: ${text}\n`;
    }
  }

  out += '\n=== ALL SPANS ===\n';
  // Sometimes text is inside spans if Framer uses React elements with span
  const spanRegex = /<span([\s\S]*?)>([\s\S]*?)<\/span>/gi;
  let spanCount = 0;
  while ((match = spanRegex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    // Only output spans with substantial text, not empty layout spans
    if (text && text.length > 5 && !text.includes('<span') && spanCount < 200) {
      out += `SPAN: ${text}\n`;
      spanCount++;
    }
  }

  out += '\n=== ALL LINKS AND ANCHORS ===\n';
  const linkRegex = /<a([\s\S]*?)href="([^"]*?)"[\s\S]*?>([\s\S]*?)<\/a>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[2];
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    out += `Link: "${text}" -> ${url}\n`;
  }

  out += '\n=== ALL IMAGES ===\n';
  const imgRegex = /<img[\s\S]*?src="([^"]*?)"/gi;
  const images = new Set<string>();
  while ((match = imgRegex.exec(html)) !== null) {
    images.add(match[1]);
  }
  images.forEach(src => {
    out += `Image Src: ${src}\n`;
  });

  fs.writeFileSync('./site_structure.txt', out, 'utf-8');
  console.log('Successfully wrote site structure to site_structure.txt!');
}

main();
