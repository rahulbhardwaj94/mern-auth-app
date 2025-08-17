const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Only create transporter if we have email credentials
    if (process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      this.transporter = null;
      console.log('Email service initialized in development mode - OTPs will be logged to console');
    }
  }

  // Send OTP email
  async sendOTPEmail(email, otp, firstName) {
    // If no transporter (development mode), log OTP to console
    if (!this.transporter) {
      console.log('=== DEVELOPMENT MODE: OTP LOGGED INSTEAD OF EMAIL ===');
      console.log(`Email: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log(`First Name: ${firstName}`);
      console.log('=== END OTP LOG ===');
      return true;
    }

    const mailOptions = {
      from: `"MERN Auth App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Email Verification</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff;">
            <p>Hello ${firstName},</p>
            <p>Thank you for registering with our application. Please use the following OTP to verify your email address:</p>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this verification, please ignore this email</li>
            </ul>
            <p>Best regards,<br>MERN Auth App Team</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken, firstName) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"MERN Auth App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff;">
            <p>Hello ${firstName},</p>
            <p>You requested a password reset for your account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This link is valid for 1 hour only</li>
              <li>If you didn't request a password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you reset it</li>
            </ul>
            <p>Best regards,<br>MERN Auth App Team</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

module.exports = new EmailService();
