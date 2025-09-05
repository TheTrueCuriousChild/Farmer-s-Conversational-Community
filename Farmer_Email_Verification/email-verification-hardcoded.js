const crypto = require('crypto');

// ==================== SIMULATED DATABASE (HARDCODED) ====================
const simulatedFarmers = [
  {
    _id: '1',
    email: 'farmer1@example.com',
    name: 'John Farmer',
    status: 'pending_verification',
    emailVerified: false,
    verificationToken: null,
    verificationTokenExpires: null
  },
  {
    _id: '2', 
    email: 'farmer2@example.com',
    name: 'Jane Farmer',
    status: 'pending_verification',
    emailVerified: false,
    verificationToken: null,
    verificationTokenExpires: null
  }
];

// Simulated database functions
const simulatedDB = {
  findFarmerByEmail: (email) => {
    return simulatedFarmers.find(farmer => farmer.email === email);
  },
  
  findFarmerByToken: (token, email) => {
    return simulatedFarmers.find(farmer => 
      farmer.verificationToken === token && 
      farmer.email === email &&
      farmer.verificationTokenExpires > Date.now()
    );
  },
  
  updateFarmer: (email, updates) => {
    const farmerIndex = simulatedFarmers.findIndex(f => f.email === email);
    if (farmerIndex !== -1) {
      simulatedFarmers[farmerIndex] = { ...simulatedFarmers[farmerIndex], ...updates };
      return simulatedFarmers[farmerIndex];
    }
    return null;
  },
  
  saveVerificationToken: (email, token, expires) => {
    return simulatedDB.updateFarmer(email, {
      verificationToken: token,
      verificationTokenExpires: expires
    });
  },
  
  verifyEmail: (email) => {
    return simulatedDB.updateFarmer(email, {
      emailVerified: true,
      status: 'active',
      verificationToken: null,
      verificationTokenExpires: null
    });
  }
};

// ==================== EMAIL SERVICE (HARDCODED) ====================
const simulatedEmailService = {
  sendVerificationEmail: (email, verificationUrl) => {
    console.log('=== SIMULATED EMAIL SENT ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email Address`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('============================');
    return Promise.resolve();
  }
};

// ==================== CORE VERIFICATION FUNCTIONS ====================
async function sendVerificationEmail(email) {
  try {
    console.log(`Attempting to send verification email to: ${email}`);
    
    const farmer = simulatedDB.findFarmerByEmail(email);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    simulatedDB.saveVerificationToken(email, verificationToken, verificationTokenExpires);
    console.log(`Verification token generated for ${email}: ${verificationToken}`);

    const baseUrl = 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    await simulatedEmailService.sendVerificationEmail(email, verificationUrl);

    return {
      success: true,
      message: 'Verification email sent successfully',
      email: email
    };

  } catch (error) {
    console.error('Error in sendVerificationEmail:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyEmail(token, email) {
  try {
    console.log(`Attempting to verify email: ${email} with token: ${token}`);
    
    const decodedEmail = decodeURIComponent(email);
    const farmer = simulatedDB.findFarmerByToken(token, decodedEmail);
    
    if (!farmer) {
      throw new Error('Invalid or expired verification link');
    }

    simulatedDB.verifyEmail(decodedEmail);
    console.log(`Email verified successfully for: ${decodedEmail}`);

    return {
      success: true,
      message: 'Email verified successfully',
      farmer: {
        email: decodedEmail,
        status: 'active',
        emailVerified: true
      }
    };

  } catch (error) {
    console.error('Error in verifyEmail:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function generateThankYouPage() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Verified Successfully</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background-color: #f5f5f5;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 10px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        h1 { color: #4CAF50; }
        .icon { font-size: 48px; color: #4CAF50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">✓</div>
        <h1>Thank You!</h1>
        <h2>Your email has been verified successfully</h2>
        <p>Your farmer account is now <strong>active</strong> and you can start using all features of our platform.</p>
        <p>You can close this window and return to the application.</p>
      </div>
    </body>
    </html>
  `;
}
function generateErrorPage(errorMessage) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Error</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background-color: #f5f5f5;
          }
          .container { 
            background: white; 
            padding: 40px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
          }
          h1 { color: #ff4444; }
          .icon { font-size: 48px; color: #ff4444; }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✗</div>
          <h1>Verification Failed</h1>
          <p>${errorMessage}</p>
          <p>Please try requesting a new verification email or contact support.</p>
          <a href="/request-verification" class="button">Request New Verification Email</a>
        </div>
      </body>
      </html>
    `;
}
// ==================== EXAMPLE USAGE ====================

async function exampleSendVerification() {
  console.log('\n=== EXAMPLE: Sending Verification Email ===');
  const result = await sendVerificationEmail('farmer1@example.com');
  console.log('Result:', result);
}

async function exampleVerifyEmail() {
  console.log('\n=== EXAMPLE: Verifying Email ===');
  
  await sendVerificationEmail('farmer1@example.com');
  const farmer = simulatedDB.findFarmerByEmail('farmer1@example.com');
  
  const result = await verifyEmail(farmer.verificationToken, farmer.email);
  console.log('Verification Result:', result);
  
  const updatedFarmer = simulatedDB.findFarmerByEmail('farmer1@example.com');
  console.log('Final Farmer Status:', {
    email: updatedFarmer.email,
    status: updatedFarmer.status,
    emailVerified: updatedFarmer.emailVerified
  });
}

// Run examples if executed directly
if (require.main === module) {
  console.log('🚀 Running email verification examples...');
  setTimeout(exampleSendVerification, 1000);
  setTimeout(exampleVerifyEmail, 3000);
}

module.exports = {
    sendVerificationEmail,
    verifyEmail,
    generateThankYouPage,
    generateErrorPage,   
    simulatedDB,
    simulatedEmailService,
    exampleSendVerification,
    exampleVerifyEmail
  };
