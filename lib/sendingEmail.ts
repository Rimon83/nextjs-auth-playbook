import nodemailer from "nodemailer";
import { createTransporter } from "./emailConfig";
import { emailTemplates } from "./emailTemplates";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    const template = emailTemplates.verification(verificationLink);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

// Sending welcome email
export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const template = emailTemplates.welcome(name);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}

// Sending password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    const template = emailTemplates.passwordReset(resetLink);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
// Sending password confirmation email
export async function sendPasswordResetConfirmation(email: string, name: string, browser: string, os: string) {
  try {
   
    const template = emailTemplates.passwordResetConfirmation(name, browser, os);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

// Generic email sender
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.GMAIL_USER  || 'noreply@yourdomain.com',
}: EmailOptions) {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Your App'}" <${from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback to plain text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
