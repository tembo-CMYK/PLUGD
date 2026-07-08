import fs from 'fs';

function main() {
  const html = fs.readFileSync('./fetched_site.html', 'utf-8');
  
  console.log('--- SCANNING FOR FILTER CATEGORIES ---');
  // Look for text fragments near "interactive calendar" or "Upcoming Events"
  // Let's print out text that appears in buttons or elements with "active" or standard category names (e.g. Music, Art, Category, All, etc.)
  const regex = /Upcoming Events[\s\S]*?(?:Explore our interactive calendar[\s\S]*?)([\s\S]*?)Create a free website/gi;
  const match = regex.exec(html);
  if (match) {
    const chunk = match[1];
    fs.writeFileSync('./calendar_section.html', chunk);
    console.log('Saved calendar segment to calendar_section.html!');
    
    // Find any buttons or list items in this segment
    const buttonRegex = /<[^>]*button[^>]*>([\s\S]*?)<\/button>/gi;
    let btn;
    while ((btn = buttonRegex.exec(chunk)) !== null) {
      console.log(`Button: ${btn[1].replace(/<[^>]*>/g, '').trim()}`);
    }
  } else {
    console.log('Could not separate calendar segment.');
  }
}

main();
