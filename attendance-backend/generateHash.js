


const bcrypt = require('bcryptjs');

const passwords = {
  suresh: 'suresh@2026',
  priya: 'priya@2026',
};

async function generateAll() {
  for (const [name, pass] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(pass, 10);
    console.log(`${name} (${pass}):`);
    console.log(hash);
    console.log('---');
  }
}

generateAll();