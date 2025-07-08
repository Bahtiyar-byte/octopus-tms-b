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
  cyan: '\x1b[36m'
};

// Test results storage
const testResults = {
  puppeteer: { passed: 0, failed: 0, errors: [] },
  playwright: { passed: 0, failed: 0, errors: [] }
};

async function ensureDevServerRunning() {
  console.log(`${colors.cyan}Checking if dev server is running...${colors.reset}`);
  
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log(`${colors.green}✓ Dev server is running${colors.reset}`);
      return true;
    }
  } catch (error) {
    console.log(`${colors.yellow}Dev server not running. Starting it...${colors.reset}`);
    
    // Start dev server
    const devServer = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      detached: true,
      stdio: 'ignore'
    });
    
    devServer.unref();
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log(`${colors.green}✓ Dev server started${colors.reset}`);
  }
}

async function runPuppeteerTests() {
  console.log(`\n${colors.bright}${colors.blue}Running Puppeteer Tests...${colors.reset}`);
  
  return new Promise((resolve) => {
    const puppeteer = spawn('npx', ['jest', 'tests/puppeteer', '--verbose'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    let output = '';
    
    puppeteer.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
      
      // Parse test results
      if (text.includes('PASS')) testResults.puppeteer.passed++;
      if (text.includes('FAIL')) testResults.puppeteer.failed++;
    });
    
    puppeteer.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(`${colors.red}${text}${colors.reset}`);
      testResults.puppeteer.errors.push(text);
    });
    
    puppeteer.on('close', (code) => {
      if (code !== 0) {
        console.log(`${colors.red}Puppeteer tests failed with code ${code}${colors.reset}`);
      } else {
        console.log(`${colors.green}Puppeteer tests completed successfully${colors.reset}`);
      }
      resolve(code);
    });
  });
}

async function runPlaywrightTests() {
  console.log(`\n${colors.bright}${colors.blue}Running Playwright Tests...${colors.reset}`);
  
  return new Promise((resolve) => {
    const playwright = spawn('npx', ['playwright', 'test', '--reporter=list'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    let output = '';
    
    playwright.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
      
      // Parse test results
      if (text.includes('✓') || text.includes('passed')) testResults.playwright.passed++;
      if (text.includes('✗') || text.includes('failed')) testResults.playwright.failed++;
    });
    
    playwright.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(`${colors.red}${text}${colors.reset}`);
      testResults.playwright.errors.push(text);
    });
    
    playwright.on('close', (code) => {
      if (code !== 0) {
        console.log(`${colors.red}Playwright tests failed with code ${code}${colors.reset}`);
      } else {
        console.log(`${colors.green}Playwright tests completed successfully${colors.reset}`);
      }
      resolve(code);
    });
  });
}

async function generateReport() {
  console.log(`\n${colors.bright}${colors.cyan}Test Results Summary${colors.reset}`);
  console.log('='.repeat(50));
  
  // Puppeteer results
  console.log(`\n${colors.bright}Puppeteer Tests:${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${testResults.puppeteer.passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${testResults.puppeteer.failed}${colors.reset}`);
  if (testResults.puppeteer.errors.length > 0) {
    console.log(`  ${colors.red}Errors: ${testResults.puppeteer.errors.length}${colors.reset}`);
  }
  
  // Playwright results
  console.log(`\n${colors.bright}Playwright Tests:${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${testResults.playwright.passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${testResults.playwright.failed}${colors.reset}`);
  if (testResults.playwright.errors.length > 0) {
    console.log(`  ${colors.red}Errors: ${testResults.playwright.errors.length}${colors.reset}`);
  }
  
  // Overall summary
  const totalPassed = testResults.puppeteer.passed + testResults.playwright.passed;
  const totalFailed = testResults.puppeteer.failed + testResults.playwright.failed;
  const totalErrors = testResults.puppeteer.errors.length + testResults.playwright.errors.length;
  
  console.log(`\n${colors.bright}Overall:${colors.reset}`);
  console.log(`  Total Tests: ${totalPassed + totalFailed}`);
  console.log(`  ${colors.green}Passed: ${totalPassed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${totalFailed}${colors.reset}`);
  console.log(`  ${colors.red}Errors: ${totalErrors}${colors.reset}`);
  
  // Save report to file
  const report = {
    timestamp: new Date().toISOString(),
    results: testResults,
    summary: {
      totalTests: totalPassed + totalFailed,
      passed: totalPassed,
      failed: totalFailed,
      errors: totalErrors
    }
  };
  
  await fs.writeFile(
    path.join(__dirname, 'test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n${colors.cyan}Report saved to: tests/test-report.json${colors.reset}`);
  
  return totalFailed === 0 && totalErrors === 0;
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}Starting UI Tests for Octopus TMS${colors.reset}`);
  console.log('='.repeat(50));
  
  try {
    // Ensure dev server is running
    await ensureDevServerRunning();
    
    // Run tests
    const puppeteerCode = await runPuppeteerTests();
    const playwrightCode = await runPlaywrightTests();
    
    // Generate report
    const success = await generateReport();
    
    if (success) {
      console.log(`\n${colors.bright}${colors.green}✓ All tests passed!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`\n${colors.bright}${colors.red}✗ Some tests failed!${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}Error running tests:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the tests
main();