import nodemailer from "nodemailer";

class MailService {
  constructor() {
    // Create transporter and connect to SMTP server
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
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








// import nodemailer from 'nodemailer';

// class MailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT || '587', 10),
//       secure: process.env.SMTP_SECURE === 'true', 
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//       },
//       tls: { // Add this if you are using TLS
//         ciphers: 'SSLv3',
//         rejectUnauthorized: false
//     }
//     });
//     this.transporter.verify(function(error, success) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Server is ready to take our messages");
//       }
//     });
//   }

//   async sendActivationEmail(email, activationLink) {
//     try {
//       const mailOptions = {
//         from: `"Your Company Name" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: 'Activate Your Account',
//         html: `
//           <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 20px auto; background-color: #f9f9f9;">
//             <h2 style="color: #4CAF50;">Activate Your Account</h2>
//             <p style="font-size: 16px; margin-bottom: 20px;">Thank you for signing up! Please confirm your email address to activate your account by clicking the button below.</p>
//             <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Activate Account</a>
//             <p style="font-size: 14px; margin-top: 20px; color: #555;">If you did not request this email, please ignore it.</p>
//             <p style="font-size: 12px; color: #aaa; margin-top: 10px;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//           </div>
//         `,
//       };

//       const info = await this.transporter.sendMail(mailOptions);
//       console.log(`Activation email sent to ${email}:`, info.messageId);
//       return info;
//     } catch (error) {
//       console.error(`Error sending activation email to ${email}:`, error);
//       if (error.code === 'EENVELOPE') {
//         console.error("Possible invalid email address provided.");
//       }
//       throw error; // Re-throw the error for handling in the controller
//     }
//   }

//   async sendForgotPasswordMail(email, resetLink, expirationMinutes = 5) {
//     try {
//       const mailOptions = {
//         from: `"Your Company Name" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: 'Password Reset Request',
//         html: `
//           <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 20px auto; background-color: #f9f9f9;">
//             <h2 style="color: #4CAF50;">Password Reset Request</h2>
//             <p style="font-size: 16px; margin-bottom: 20px;">You recently requested to reset your password. Click the link below to proceed.</p>
//             <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
//             <p style="font-size: 14px; margin-top: 20px; color: #555;">This link will expire in ${expirationMinutes} minutes.</p>
//             <p style="font-size: 14px; margin-top: 20px; color: #555;">If you did not request a password reset, please ignore this email.</p>
//             <p style="font-size: 12px; color: #aaa; margin-top: 10px;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//           </div>
//         `,
//       };

//       const info = await this.transporter.sendMail(mailOptions);
//       console.log(`Password reset email sent to ${email}:`, info.messageId);
//       return info;
//     } catch (error) {
//       console.error(`Error sending password reset email to ${email}:`, error);
//       if (error.code === 'EENVELOPE') {
//         console.error("Possible invalid email address provided.");
//       }
//       throw error; // Re-throw the error
//     }
//   }
// }

// export default new MailService();