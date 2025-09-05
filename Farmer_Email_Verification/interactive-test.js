const { generateThankYouPage, generateErrorPage } = require('./email-verification-hardcoded');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function interactiveTest() {
  console.log('🎭 INTERACTIVE HTML PAGE TEST');
  console.log('=' .repeat(40));
  
  const choice = await askQuestion(
    'Choose page to generate:\n' +
    '1. Thank You Page (successful verification)\n' +
    '2. Error Page (verification failed)\n' +
    '3. Both pages\n' +
    'Enter choice (1-3): '
  );

  const email = await askQuestion('Enter farmer email (for demo): ');
  
  let htmlContent = '';
  let filename = '';

  switch(choice) {
    case '1':
      htmlContent = generateThankYouPage();
      filename = `thank-you-${email.split('@')[0]}.html`;
      break;
    case '2':
      const errorMsg = await askQuestion('Enter error message: ');
      htmlContent = generateErrorPage(errorMsg || 'Verification failed');
      filename = `error-${email.split('@')[0]}.html`;
      break;
    case '3':
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Both Pages - ${email}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .page { margin: 40px; padding: 20px; border: 2px solid #ddd; }
            h2 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Email Verification Pages for: ${email}</h1>
          
          <div class="page">
            <h2>Thank You Page</h2>
            ${generateThankYouPage()}
          </div>
          
          <div class="page">
            <h2>Error Page</h2>
            ${generateErrorPage('Token expired')}
          </div>
        </body>
        </html>
      `;
      filename = `both-pages-${email.split('@')[0]}.html`;
      break;
    default:
      console.log('Invalid choice');
      rl.close();
      return;
  }

  fs.writeFileSync(filename, htmlContent);
  console.log(`\n✅ Generated: ${filename}`);
  console.log(`🌐 Open this file in your browser to view the page`);
  
  rl.close();
}

// Check if the functions exist before running
if (typeof generateThankYouPage === 'function' && typeof generateErrorPage === 'function') {
  interactiveTest().catch(console.error);
} else {
  console.log('❌ Error: Functions not found. Please check your email-verification-hardcoded.js file');
  console.log('Make sure it exports generateThankYouPage and generateErrorPage functions');
}