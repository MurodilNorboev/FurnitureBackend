import nodemailer from "nodemailer";

class MailService {
  constructor() {
    // Create transporter and connect to SMTP server
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587" || "465", 10),
      secure: process.env.SMTP_SECURE === "true",  // Ensure this is a boolean
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection configuration
    this.transporter.verify()
      .then(() => console.log("SMTP server is ready"))
      .catch((error) => console.error("SMTP verification failed:", error));
  }
  async sendMail(to, subject, text) {
    const mailOptions = {
      from: process.env.SMTP_USER, 
      to, 
      subject, 
      text, 
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Message sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  }
  async sendOTP(to, otp) {
    const subject = "Your OTP for Account Activation";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50; text-align: center;">Account Activation OTP</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering. To complete your account activation, please use the OTP below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 4px;">${otp}</span>
        </div>
        <p style="font-size: 16px; color: #333;">
          This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #333;">Best regards,</p>
        <p style="font-size: 16px; color: #333; font-weight: bold;">Your Company Name</p>
      </div>
    `;
  
    return await this.sendMail(to, subject, undefined, html);
  }
  
}

export default new MailService();
