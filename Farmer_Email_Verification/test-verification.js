const { 
    sendVerificationEmail, 
    verifyEmail, 
    simulatedDB,
    exampleSendVerification, 
    exampleVerifyEmail 
  } = require('./email-verification-hardcoded');
  
  // Test the complete flow
  async function testCompleteFlow() {
    console.log('🧪 TESTING COMPLETE EMAIL VERIFICATION FLOW\n');
    
    // Test 1: Send verification email
    console.log('1. 📧 Sending verification email to farmer1@example.com');
    const sendResult = await sendVerificationEmail('farmer1@example.com');
    console.log('Send Result:', sendResult);
    
    // Check database state
    const farmerAfterSend = simulatedDB.findFarmerByEmail('farmer1@example.com');
    console.log('Farmer after sending email:', {
      email: farmerAfterSend.email,
      hasToken: !!farmerAfterSend.verificationToken,
      status: farmerAfterSend.status
    });
    
    // Test 2: Verify email with the correct token
    console.log('\n2. ✅ Verifying email with correct token');
    const verifyResult = await verifyEmail(
      farmerAfterSend.verificationToken, 
      'farmer1@example.com'
    );
    console.log('Verify Result:', verifyResult);
    
    // Check final status
    const farmerAfterVerify = simulatedDB.findFarmerByEmail('farmer1@example.com');
    console.log('Farmer after verification:', {
      email: farmerAfterVerify.email,
      status: farmerAfterVerify.status,
      emailVerified: farmerAfterVerify.emailVerified
    });
    
    // Test 3: Try to verify with invalid token
    console.log('\n3. ❌ Testing with invalid token (should fail)');
    const invalidResult = await verifyEmail(
      'invalid-token-123', 
      'farmer1@example.com'
    );
    console.log('Invalid Token Result:', invalidResult);
  }
  
  // Run the test
  async function runTest() {
    console.log('🚀 STARTING EMAIL VERIFICATION TEST');
    console.log('=====================================\n');
    
    await testCompleteFlow();
    
    console.log('\n=====================================');
    console.log('✅ TEST COMPLETED');
    console.log('📊 Final database state:');
    
    simulatedDB.simulatedFarmers.forEach((farmer, index) => {
      console.log(`\nFarmer ${index + 1}:`);
      console.log(`  Email: ${farmer.email}`);
      console.log(`  Status: ${farmer.status}`);
      console.log(`  Email Verified: ${farmer.emailVerified}`);
    });
  }
  
  // Run the test
  runTest().catch(console.error);