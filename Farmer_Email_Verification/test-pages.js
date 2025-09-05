const { generateThankYouPage } = require('./email-verification-hardcoded');
const fs = require('fs');

// Display the HTML in console
console.log('Thank You Page HTML:');
console.log(generateThankYouPage());

// Save to file to view in browser
fs.writeFileSync('thank-you.html', generateThankYouPage());
console.log('\n📁 HTML file saved as "thank-you.html"');
console.log('Open it in a web browser to see the thank you page!');