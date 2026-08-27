const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '../client/src/services/api.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');

// Replace fallbackStore courses array with empty array
apiContent = apiContent.replace(/courses:\s*\[[\s\S]*?\n  \],\n\n  testimonials:/, 'courses: [],\n\n  testimonials:');

fs.writeFileSync(apiPath, apiContent, 'utf8');
console.log('Successfully emptied fallbackStore.courses in client/src/services/api.js');

// Also check seed.js
const seedPath = path.join(__dirname, '../server/seed.js');
if (fs.existsSync(seedPath)) {
  let seedContent = fs.readFileSync(seedPath, 'utf8');
  seedContent = seedContent.replace(/const coursesData = \[[\s\S]*?\n\];/, 'const coursesData = [];');
  fs.writeFileSync(seedPath, seedContent, 'utf8');
  console.log('Successfully emptied seed.js coursesData');
}
