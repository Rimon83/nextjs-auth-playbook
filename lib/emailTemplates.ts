export const emailTemplates = {
  verification: (verificationLink: string) => ({
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome!</h1>
        <p style="font-size: 16px; color: #555;">
          Thank you for signing up! Please verify your email address to complete your registration.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">
          ${verificationLink}
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
    text: `Welcome! Please verify your email by visiting: ${verificationLink}`,
  }),

  welcome: (name?: string) => ({
    subject: "Welcome to Our Platform!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome${name ? `, ${name}` : ""}!</h1>
        <p style="font-size: 16px; color: #555;">
          Your account has been successfully created and verified.
        </p>
        <p style="font-size: 16px; color: #555;">
          You can now access all features of our platform.
        </p>
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="color: #333;">Getting Started:</h3>
          <ul style="color: #555;">
            <li>Complete your profile</li>
            <li>Explore our features</li>
            <li>Invite team members</li>
            <li>Check out our tutorials</li>
          </ul>
        </div>
      </div>
    `,
    text: `Welcome${name ? ` ${name}` : ""}! Your account has been successfully created and verified.`,
  }),

  passwordReset: (resetLink: string) => ({
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p style="font-size: 16px; color: #555;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #DC2626; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If you didn't request this, please ignore this email.
        </p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">
          Reset link: ${resetLink}
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          This link will expire in 1 hour.
        </p>
      </div>
    `,
    text: `Reset your password by visiting: ${resetLink}`,
  }),
  passwordResetConfirmation: (name: string, browser: string, os: string) => ({
    subject: "Your Password Has Been Updated",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="text-align: center background-color: #4CAF50; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 30px;">✓</span>
          </div>
          <h2 style="color: #333; margin-top: 20px;">Password Updated Successfully</h2>
        </div>
        
        <p style="color: #666; line-height: 1.6;">Hello ${name ? name : "there"},</p>
        
        <p style="color: #666; line-height: 1.6;">
          Your password has been successfully updated. If you made this change, no further action is needed.
        </p>
        
        <div style="background-color: #FFF3CD; border: 1px solid #FFEEBA; border-radius: 4px; padding: 15px; margin: 25px 0;">
          <p style="color: #856404; margin: 0;">
            <strong>⚠️ Didn't request this change?</strong><br>
            If you didn't change your password, please <a href="${process.env.NEXTAUTH_URL}/contact-support" style="color: #4F46E5;">contact support immediately</a>.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated security message from Your App.<br>
        </p>
      </div>
      <p> Change Details:</p>
      <p> Date & Time: ${new Date().toLocaleString()}</p>
      <p> Device/Browser: ${browser} on ${os}</p>
      
      <ul>Security Tips:</ul>
      <li> Use a unique password </li>
      <li> Enable two-factor authentication</li>
      <li> Regularly review connected devices</li>
      <li> Never share your passwords</li>
      
      <p>This email was sent as a security notification for your account.</p>  
      <p>Need help? Contact us at support@yourapp.com</p>
      
      © ${new Date().getFullYear()} Your Company Name. All rights reserved.
    `,
    text: `
      PASSWORD CHANGED SUCCESSFULLY
      This email is to confirm that your account password has been successfully changed.
      
     
    `,
  }),
};
