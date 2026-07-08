import fs from 'fs';

function main() {
  const html = fs.readFileSync('./fetched_site.html', 'utf-8');
  
  // Find all text tags and print where they contain event elements
  const blocks: string[] = [];
  
  // A regex that extracts inner content from elements that contain text
  // we look for specific event-related keywords in sections
  console.log('--- SCANNING ALL UNIFIED TEXT BLOCKS ---');
  
  // Look for text elements inside the main content container
  // Let's print out text strings that look like dates or event locations
  const regex = />([^<]{2,100})</g;
  let match;
  const uniqueTexts = new Set<string>();
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 1 && !text.startsWith('framer-') && !text.startsWith('.')) {
      uniqueTexts.add(text);
    }
  }
  
  console.log(`Found ${uniqueTexts.size} unique text clips. Saving to uniques.txt...`);
  fs.writeFileSync('./uniques.txt', Array.from(uniqueTexts).join('\n'));
}

main();
