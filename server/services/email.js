const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendPasswordResetEmail(toEmail, userName, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@biblihub.com',
    subject: 'Bibli Hub - Reset Your Password',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FEFAE0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2D6A4F, #40916C); padding: 40px 30px; text-align: center;">
          <h1 style="color: #FEFAE0; margin: 0; font-size: 28px;">📚 Bibli Hub</h1>
          <p style="color: #B7E4C7; margin: 8px 0 0;">Give a book. Get a book. Change a life.</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2B2D42; margin-top: 0;">Hi ${userName}! 👋</h2>
          <p style="color: #555; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #2D6A4F, #40916C); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #888; font-size: 14px; line-height: 1.5;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #E8E8E8; margin: 20px 0;" />
          <p style="color: #AAA; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Bibli Hub. Promoting book reuse, one exchange at a time.
          </p>
        </div>
      </div>
    `,
  };

  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
      console.log(`✅ Password reset email sent to ${toEmail}`);
      return true;
    } else {
      // Dev mode - log the reset URL instead
      console.log(`\n📧 PASSWORD RESET (Dev Mode - No SendGrid key configured)`);
      console.log(`   Email: ${toEmail}`);
      console.log(`   Reset URL: ${resetUrl}`);
      console.log(`   Token: ${resetToken}\n`);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return false;
  }
}

module.exports = { sendPasswordResetEmail };
