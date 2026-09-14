import fs from 'node:fs';
fs.copyFileSync('scripts/auth-client.js','public/auth.js');
for(const path of ['public/index.html','public/app.js','public/auth.js','api/handler.js','server/planner.js'])if(!fs.existsSync(path))throw Error('Missing '+path);
console.log('Vercel planner build complete.');
