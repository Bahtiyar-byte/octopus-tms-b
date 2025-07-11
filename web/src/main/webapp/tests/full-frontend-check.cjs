#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const results = {
  lint: { errors: 0, warnings: 0, files: [] },
  typecheck: { errors: 0, files: [] },
  ui: { passed: 0, failed: 0, errors: [] }
};

// Run ESLint
async function runLintCheck() {
  console.log(`\n${colors.bright}${colors.blue}Running ESLint...${colors.reset}`);
  
  return new Promise((resolve) => {
    const eslint = spawn('npm', ['run', 'lint'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    let output = '';
    
    eslint.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    eslint.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    eslint.on('close', (code) => {
      // Parse ESLint output
      const lines = output.split('\n');
      lines.forEach(line => {
        if (line.includes('error')) {
          results.lint.errors++;
          if (line.includes('.tsx') || line.includes('.ts')) {
            results.lint.files.push(line);
          }
        } else if (line.includes('warning')) {
          results.lint.warnings++;
        }
      });
      
      // Extract summary
      const summaryMatch = output.match(/(\d+) problems? \((\d+) errors?, (\d+) warnings?\)/);
      if (summaryMatch) {
        results.lint.errors = parseInt(summaryMatch[2]);
        results.lint.warnings = parseInt(summaryMatch[3]);
      }
      
      if (code === 0) {
        console.log(`${colors.green}✓ ESLint passed with no errors${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ ESLint found ${results.lint.errors} errors and ${results.lint.warnings} warnings${colors.reset}`);
      }
      
      resolve(code);
    });
  });
}

// Run TypeScript compiler check
async function runTypeCheck() {
  console.log(`\n${colors.bright}${colors.blue}Running TypeScript check...${colors.reset}`);
  
  return new Promise((resolve) => {
    const tsc = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    let output = '';
    
    tsc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    tsc.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    tsc.on('close', (code) => {
      const lines = output.split('\n');
      const errorFiles = new Set();
      
      lines.forEach(line => {
        if (line.includes('error TS')) {
          results.typecheck.errors++;
          const fileMatch = line.match(/(.+\.(ts|tsx)).*:/);
          if (fileMatch) {
            errorFiles.add(fileMatch[1]);
          }
        }
      });
      
      results.typecheck.files = Array.from(errorFiles);
      
      if (code === 0) {
        console.log(`${colors.green}✓ TypeScript check passed${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ TypeScript found ${results.typecheck.errors} errors in ${results.typecheck.files.length} files${colors.reset}`);
      }
      
      resolve(code);
    });
  });
}

// Check for common issues
async function checkCommonIssues() {
  console.log(`\n${colors.bright}${colors.blue}Checking for common issues...${colors.reset}`);
  
  const issues = [];
  const frontendDir = path.join(__dirname, '..');
  
  // Check for unused imports
  const checkUnusedImports = async (filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const imports = content.match(/import\s+{([^}]+)}\s+from/g) || [];
      
      imports.forEach(imp => {
        const importedItems = imp.match(/{([^}]+)}/)[1].split(',').map(i => i.trim());
        importedItems.forEach(item => {
          const regex = new RegExp(`\\b${item}\\b`, 'g');
          const matches = content.match(regex);
          if (matches && matches.length === 1) {
            issues.push(`Potentially unused import '${item}' in ${filePath}`);
          }
        });
      });
    } catch (error) {
      // Skip if file can't be read
    }
  };
  
  // Check for console.log statements
  const checkConsoleLogs = async (filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      if (content.includes('console.log') && !filePath.includes('test')) {
        issues.push(`console.log found in ${filePath}`);
      }
    } catch (error) {
      // Skip if file can't be read
    }
  };
  
  // Get all TypeScript files
  const walkDir = async (dir) => {
    const files = await fs.readdir(dir);
    const results = [];
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.')) {
        results.push(...await walkDir(fullPath));
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(fullPath);
      }
    }
    
    return results;
  };
  
  const srcFiles = await walkDir(path.join(frontendDir, 'src'));
  
  // Run checks on all files
  for (const file of srcFiles) {
    await checkUnusedImports(file);
    await checkConsoleLogs(file);
  }
  
  if (issues.length > 0) {
    console.log(`${colors.yellow}Found ${issues.length} potential issues:${colors.reset}`);
    issues.slice(0, 10).forEach(issue => {
      console.log(`  ${colors.yellow}⚠${colors.reset} ${issue}`);
    });
    if (issues.length > 10) {
      console.log(`  ... and ${issues.length - 10} more`);
    }
  } else {
    console.log(`${colors.green}✓ No common issues found${colors.reset}`);
  }
  
  return issues;
}

// Generate final report
async function generateReport() {
  console.log(`\n${colors.bright}${colors.cyan}Frontend Check Summary${colors.reset}`);
  console.log('='.repeat(60));
  
  const report = {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      totalErrors: results.lint.errors + results.typecheck.errors,
      totalWarnings: results.lint.warnings,
      lintErrors: results.lint.errors,
      lintWarnings: results.lint.warnings,
      typescriptErrors: results.typecheck.errors,
      filesWithErrors: [...new Set([...results.lint.files, ...results.typecheck.files])].length
    }
  };
  
  // Display summary
  console.log(`\n${colors.bright}ESLint:${colors.reset}`);
  console.log(`  ${results.lint.errors > 0 ? colors.red : colors.green}Errors: ${results.lint.errors}${colors.reset}`);
  console.log(`  ${results.lint.warnings > 0 ? colors.yellow : colors.green}Warnings: ${results.lint.warnings}${colors.reset}`);
  
  console.log(`\n${colors.bright}TypeScript:${colors.reset}`);
  console.log(`  ${results.typecheck.errors > 0 ? colors.red : colors.green}Errors: ${results.typecheck.errors}${colors.reset}`);
  console.log(`  Files with errors: ${results.typecheck.files.length}`);
  
  console.log(`\n${colors.bright}Overall:${colors.reset}`);
  console.log(`  Total Errors: ${report.summary.totalErrors}`);
  console.log(`  Total Warnings: ${report.summary.totalWarnings}`);
  
  // Save report
  await fs.writeFile(
    path.join(__dirname, 'frontend-check-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n${colors.cyan}Full report saved to: tests/frontend-check-report.json${colors.reset}`);
  
  // Specific file issues
  if (results.lint.files.length > 0 || results.typecheck.files.length > 0) {
    console.log(`\n${colors.bright}${colors.red}Files with issues:${colors.reset}`);
    const allFiles = [...new Set([...results.lint.files, ...results.typecheck.files])];
    allFiles.slice(0, 20).forEach(file => {
      console.log(`  ${colors.red}✗${colors.reset} ${file}`);
    });
    if (allFiles.length > 20) {
      console.log(`  ... and ${allFiles.length - 20} more files`);
    }
  }
  
  return report.summary.totalErrors === 0;
}

// Main function
async function main() {
  console.log(`${colors.bright}${colors.magenta}🔍 Full Frontend Check for Octopus TMS${colors.reset}`);
  console.log('='.repeat(60));
  
  try {
    // Run all checks
    const lintCode = await runLintCheck();
    const typeCode = await runTypeCheck();
    const issues = await checkCommonIssues();
    
    // Generate report
    const success = await generateReport();
    
    if (success) {
      console.log(`\n${colors.bright}${colors.green}✓ All checks passed!${colors.reset}`);
      console.log(`${colors.green}The frontend code is clean and ready.${colors.reset}`);
      
      // Suggest running UI tests
      console.log(`\n${colors.cyan}To run UI tests, use: npm run test:ui${colors.reset}`);
      
      process.exit(0);
    } else {
      console.log(`\n${colors.bright}${colors.red}✗ Frontend check failed!${colors.reset}`);
      console.log(`${colors.red}Please fix the errors before proceeding.${colors.reset}`);
      
      // Provide fix suggestions
      console.log(`\n${colors.yellow}Quick fixes:${colors.reset}`);
      console.log(`  • Run ${colors.cyan}npm run lint -- --fix${colors.reset} to auto-fix some lint issues`);
      console.log(`  • Check TypeScript errors with ${colors.cyan}npx tsc --noEmit${colors.reset}`);
      console.log(`  • Use VS Code's Problems panel to navigate to errors`);
      
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}Error during check:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the check
main();