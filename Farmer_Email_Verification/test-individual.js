const { sendVerificationEmail, verifyEmail, simulatedDB } = require('./email-verification-hardcoded');

// Test just sending email
async function testSendEmail() {
  console.log('📧 Testing email sending...');
  const result = await sendVerificationEmail('farmer2@example.com');
  console.log('Result:', result);
  
  const farmer = simulatedDB.findFarmerByEmail('farmer2@example.com');
  console.log('Token generated:', farmer.verificationToken);
}

// Test just verification
async function testVerification() {
  console.log('\n✅ Testing verification...');
  
  // First send email to get token
  await sendVerificationEmail('farmer2@example.com');
  const farmer = simulatedDB.findFarmerByEmail('farmer2@example.com');
  
  // Then verify
  const result = await verifyEmail(farmer.verificationToken, 'farmer2@example.com');
  console.log('Verification result:', result);
}

// Run both tests
testSendEmail()
  .then(() => testVerification())
  .catch(console.error);