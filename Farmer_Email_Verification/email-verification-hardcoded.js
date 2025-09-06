const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

// ==================== REAL EMAIL SERVICE ====================
const emailConfig = {
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT) || 2525,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'your-mailtrap-username',
    pass: process.env.EMAIL_PASSWORD || 'your-mailtrap-password'
  },
  from: process.env.EMAIL_FROM || 'Farm Management System <noreply@farmmanagement.com>'
};

// Create email transporter
let emailTransporter;
try {
  emailTransporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth
  });
  console.log('✅ Mailtrap transporter configured successfully');
} catch (error) {
  console.warn('❌ Mailtrap configuration failed:', error.message);
  console.warn('Using simulation mode.');
  emailTransporter = null;
}

// Real email service functions
const emailService = {
  sendVerificationEmail: async (email, verificationUrl) => {
    // If email is not configured, use simulation mode
    if (!emailTransporter || process.env.USE_EMAIL_SIMULATION === 'true') {
      console.log('=== SIMULATED EMAIL SENT ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Verify Your Email Address - Farm Management System`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('============================');
      return true;
    }

    try {
      const mailOptions = {
        from: emailConfig.from,
        to: email,
        subject: 'Verify Your Email Address - Farm Management System',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
              .button { 
                display: inline-block; 
                background: #4CAF50; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 15px 0; 
              }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Farm Management System</h1>
              </div>
              <div class="content">
                <h2>Email Verification</h2>
                <p>Hello Farmer,</p>
                <p>Thank you for registering with our Farm Management System. Please verify your email address to activate your account.</p>
                
                <p style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </p>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">
                  ${verificationUrl}
                </p>
                
                <p>This verification link will expire in 24 hours.</p>
                
                <p>If you didn't create an account with us, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2024 Farm Management System. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const result = await emailTransporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to: ${email}`);
      console.log(`📧 Message ID: ${result.messageId}`);
      return true;

    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      console.log('🔄 Falling back to simulation mode');
      
      // Fallback to simulation
      console.log('=== SIMULATED EMAIL SENT (Fallback) ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Verify Your Email Address - Farm Management System`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('=======================================');
      return false;
    }
  }
};

// ==================== CORE VERIFICATION FUNCTIONS ====================
async function sendVerificationEmail(email) {
  try {
    console.log(`📧 Attempting to send verification email to: ${email}`);
    
    const farmer = simulatedDB.findFarmerByEmail(email);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    simulatedDB.saveVerificationToken(email, verificationToken, verificationTokenExpires);
    console.log(`🔐 Verification token generated for ${email}: ${verificationToken}`);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const emailSent = await emailService.sendVerificationEmail(email, verificationUrl);

    return {
      success: true,
      message: emailSent ? 'Verification email sent successfully' : 'Email simulation mode active',
      email: email,
      emailActuallySent: emailSent,
      verificationUrl: verificationUrl // For testing purposes
    };

  } catch (error) {
    console.error('❌ Error in sendVerificationEmail:', error.message);
    return {
      success: false,
      error: error.message,
      emailActuallySent: false
    };
  }
}

async function verifyEmail(token, email) {
  try {
    console.log(`🔍 Attempting to verify email: ${email} with token: ${token}`);
    
    const decodedEmail = decodeURIComponent(email);
    const farmer = simulatedDB.findFarmerByToken(token, decodedEmail);
    
    if (!farmer) {
      throw new Error('Invalid or expired verification link');
    }

    simulatedDB.verifyEmail(decodedEmail);
    console.log(`✅ Email verified successfully for: ${decodedEmail}`);

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
    console.error('❌ Error in verifyEmail:', error.message);
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
      <title>Email Verified Successfully - Farm Management System</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background-color: #f5f5f5;
          margin: 0;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 10px; 
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        h1 { 
          color: #4CAF50; 
          margin-bottom: 20px;
        }
        .icon { 
          font-size: 64px; 
          color: #4CAF50; 
          margin-bottom: 20px;
        }
        .success-message {
          background: #e8f5e8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .button {
          display: inline-block;
          background: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: bold;
        }
        .button:hover {
          background: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">✓</div>
        <h1>Thank You!</h1>
        <h2>Your email has been verified successfully</h2>
        
        <div class="success-message">
          <p>Your farmer account is now <strong>active</strong> and you can start using all features of our platform.</p>
        </div>
        
        <p>You can now:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Access your farmer dashboard</li>
          <li>List your products for sale</li>
          <li>Connect with retailers</li>
          <li>Manage your farm operations</li>
        </ul>
        
        <br>
        <a href="/login" class="button">Continue to Login</a>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          You can close this window and return to the application.
        </p>
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
      <title>Verification Error - Farm Management System</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background-color: #f5f5f5;
          margin: 0;
        }
        .container { 
          background: white; 
          padding: 40px; 
          border-radius: 10px; 
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        h1 { 
          color: #ff4444; 
          margin-bottom: 20px;
        }
        .icon { 
          font-size: 64px; 
          color: #ff4444; 
          margin-bottom: 20px;
        }
        .error-message {
          background: #ffebee;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #ff4444;
        }
        .button {
          display: inline-block;
          background: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px;
          font-weight: bold;
        }
        .support {
          margin-top: 30px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">✗</div>
        <h1>Verification Failed</h1>
        
        <div class="error-message">
          <p><strong>Error:</strong> ${errorMessage}</p>
        </div>
        
        <p>This could be because:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>The verification link has expired</li>
          <li>The link has already been used</li>
          <li>The link is invalid or malformed</li>
        </ul>
        
        <div style="margin: 30px 0;">
          <a href="/request-verification" class="button">Request New Verification Email</a>
          <a href="/support" class="button" style="background: #666;">Contact Support</a>
        </div>
        
        <div class="support">
          <p><strong>Need help?</strong></p>
          <p>Email: support@farmmanagement.com</p>
          <p>Phone: +1 (555) 123-FARM</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==================== EXAMPLE USAGE ====================
async function exampleSendVerification() {
  console.log('\n=== EXAMPLE: Sending Verification Email ===');
  const result = await sendVerificationEmail('farmer1@example.com');
  console.log('Result:', JSON.stringify(result, null, 2));
}

async function exampleVerifyEmail() {
  console.log('\n=== EXAMPLE: Verifying Email ===');
  
  await sendVerificationEmail('farmer1@example.com');
  const farmer = simulatedDB.findFarmerByEmail('farmer1@example.com');
  
  const result = await verifyEmail(farmer.verificationToken, farmer.email);
  console.log('Verification Result:', JSON.stringify(result, null, 2));
  
  const updatedFarmer = simulatedDB.findFarmerByEmail('farmer1@example.com');
  console.log('Final Farmer Status:', {
    email: updatedFarmer.email,
    status: updatedFarmer.status,
    emailVerified: updatedFarmer.emailVerified
  });
}

// ==================== CONFIGURATION CHECK ====================
function checkEmailConfiguration() {
  console.log('\n📧 Email Configuration Check:');
  console.log('=' .repeat(40));
  
  if (emailTransporter) {
    console.log('✅ Email transporter configured');
    console.log(`📧 Service: ${emailConfig.service}`);
    console.log(`👤 User: ${emailConfig.auth.user}`);
    console.log('🔐 Password: ' + (emailConfig.auth.pass ? 'Set' : 'Not set'));
  } else {
    console.log('ℹ️ Email transporter not configured - using simulation mode');
    console.log('💡 Set EMAIL_USER, EMAIL_PASSWORD environment variables to enable real emails');
  }
  
  console.log(`🌐 Base URL: ${process.env.BASE_URL || 'http://localhost:3000 (default)'}`);
  console.log('=' .repeat(40));
}

// Run examples if executed directly
if (require.main === module) {
  console.log('🚀 Farmer Email Verification System');
  console.log('=' .repeat(50));
  
  checkEmailConfiguration();
  
  setTimeout(() => {
    exampleSendVerification().then(() => {
      setTimeout(exampleVerifyEmail, 2000);
    });
  }, 1000);
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  generateThankYouPage,
  generateErrorPage,
  simulatedDB,
  emailService,
  exampleSendVerification,
  exampleVerifyEmail,
  checkEmailConfiguration
};
