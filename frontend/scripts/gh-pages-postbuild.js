const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, '../dist');
const nodeModulesPath = path.join(distPath, 'assets', 'node_modules');
const vendorPath = path.join(distPath, 'assets', 'vendor');

console.log('--- GH Pages Post-Build Fix Start ---');

// 1. Rename directory dist/assets/node_modules to dist/assets/vendor
if (fs.existsSync(nodeModulesPath)) {
  console.log('Renaming assets/node_modules to assets/vendor...');
  if (fs.existsSync(vendorPath)) {
    // If vendor exists (e.g. from previous build), merge or remove it
    // Actually, we can just remove it for now or just merge the contents.
    // For simplicity, we just delete the old vendor
    fs.rmSync(vendorPath, { recursive: true, force: true });
  }
  fs.renameSync(nodeModulesPath, vendorPath);
} else {
  console.log('Warning: assets/node_modules not found in dist. Maybe nothing to fix or build failed.');
}

// 2. Search and replace 'assets/node_modules' with 'assets/vendor' in all files in dist/
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.html') || filePath.endsWith('.json')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('assets/node_modules')) {
        console.log(`Patching ${filePath}...`);
        // Using global regex to replace all occurrences
        const updated = content.replace(/assets\/node_modules/g, 'assets/vendor');
        fs.writeFileSync(filePath, updated, 'utf8');
      }
    }
  }
}

if (fs.existsSync(distPath)) {
  console.log('Scanning dist for references to assets/node_modules...');
  walkDir(distPath);
  
  // Also create .nojekyll just in case it was missed
  const nojekyll = path.join(distPath, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    console.log('Creating .nojekyll in dist...');
    fs.writeFileSync(nojekyll, '', 'utf8');
  }
}

console.log('--- GH Pages Post-Build Fix End ---');
