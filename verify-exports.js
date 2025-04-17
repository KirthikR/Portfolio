const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function checkExports(directory) {
  try {
    const files = await promisify(fs.readdir)(directory, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        // Recursively check directories
        await checkExports(filePath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        // Check TypeScript files
        const content = await readFileAsync(filePath, 'utf8');
        
        // Check for export pattern inconsistencies
        const hasDefaultExport = content.includes('export default');
        const hasNamedExport = content.match(/export\s+(?:const|function|class|interface|type|enum|let|var)\s+\w+/);
        const hasNamedExportBrackets = content.match(/export\s+\{[^}]*\}/);
        
        console.log(`Checking: ${filePath}`);
        
        if (hasDefaultExport) {
          console.log('  ✓ Has default export');
        }
        
        if (hasNamedExport || hasNamedExportBrackets) {
          console.log('  ✓ Has named export(s)');
        }
        
        if (!hasDefaultExport && !hasNamedExport && !hasNamedExportBrackets) {
          console.log('  ⚠️ No exports found');
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Start checking from the src directory
checkExports(path.join(__dirname, 'src'));
