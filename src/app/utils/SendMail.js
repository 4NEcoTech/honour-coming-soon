// lib/sendEmail.js
import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text }) {
  try {
    // const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: parseInt(process.env.SMTP_PORT, 10),
    //     secure: process.env.SMTP_PORT === '465', // true if port is 465
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASS,
    //     },
    // });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HCJ Verification" <${process.env.SMTP_USER}>`, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
    });

    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendInstitutionVerificationEmail(
  toEmail,
  institutionName
) {
  // console.log("toEmail", toEmail);
  // console.log("institutionName", institutionName);
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use SMTP settings if using another provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password (or SMTP password)
      },
    });

    const userLang = "en";

    // Define email content
    const mailOptions = {
      from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Institution is Verified!",
      html: `
  <p>Dear <strong>${institutionName}</strong>,</p>
  <p>Great news! Your institution has been successfully verified on Honour Career Junction.</p>
  <p>You can now:</p>
  <ul>
    <li>✔ Import all your students on the platform</li>
    <li>✔ Manage student profiles</li>
    <li>✔ Participate in job fairs</li>
  </ul>
  <p>
    <a href="${process.env.INSTITUTION_VERIFICATION}/${userLang}/vrfctn-scss6034" 
       style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 15px; text-decoration: none; font-size: 16px; border-radius: 5px;">
      Press Here
    </a>
  </p>
  <p>Need any help? Contact us at <a href="mailto:thehonourenterprise@gmail.com">thehonourenterprise@gmail.com</a>.</p>
  <p>Best regards,<br>Honour Career Junction Team</p>
`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    // console.log("Verification Email Sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}

export async function sendUserVerificationEmail(toEmail, userName) {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use SMTP settings if using another provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password (or SMTP password)
      },
    });

    const userLang = "en"; // Change this based on user's language if required

    // Define email content
    const mailOptions = {
      from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Account is Verified!",
      html: `
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Congratulations! Your account has been successfully verified on Honour Career Junction.</p>
          <p>You can now:</p>
          <ul>
            <li>✔ Access all features on our platform</li>
            <li>✔ Apply for jobs and internships</li>
            <li>✔ Connect with institutions and employers</li>
          </ul>
          <p>
            <a href="${process.env.USER_VERIFICATION}/${userLang}/vrfctn-scss6034" 
               style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 15px; text-decoration: none; font-size: 16px; border-radius: 5px;">
              Press Here
            </a>
          </p>
          <p>Need any help? Contact us at <a href="mailto:thehonourenterprise@gmail.com">thehonourenterprise@gmail.com</a>.</p>
          <p>Best regards,<br>Honour Career Junction Team</p>
        `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    //  console.log("User Verification Email Sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending user verification email:", error);
    return false;
  }
}

export async function sendStudentUpdateEmail(
  toEmail,
  studentName,
  institutionName,
  signupUrl,
  mobileDeepLink
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Profile has been Updated!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Profile has been Updated</h2>
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your student profile at <strong>${institutionName}</strong> has been successfully updated.</p>
      
          <p>If you haven't completed your profile yet, please click the appropriate option below:</p>
      
          <div style="text-align: center; margin: 20px 0;">
            <a href="${signupUrl}" style="background-color: #24B5F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Complete Profile (Web)
            </a>
          </div>
      
          <p style="text-align: center;">or</p>
      
          <div style="text-align: center; margin: 20px 0;">
            <a href="${mobileDeepLink}" style="color: #24B5F4; font-weight: bold;">
              Open in Mobile App
            </a>
          </div>
      
          <p>If this update was not done by you, please contact support immediately.</p>
          <p>Best regards,<br/>Honour Career Junction Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending student update email:", error);
    return false;
  }
}

export async function sendStaffUpdateEmail(
  toEmail,
  staffName,
  institutionName,
  signupUrl
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Profile has been Updated!",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Profile has been Updated</h2>
            <p>Dear <strong>${staffName}</strong>,</p>
            <p>Your staff profile at <strong>${institutionName}</strong> has been successfully updated.</p>
            <p>If you haven't completed your profile yet, please click the button below to do so:</p>
            <p><a href="${signupUrl}" style="padding: 10px 20px; background-color: #24B5F4; color: white; border-radius: 5px; text-decoration: none;">Complete Profile</a></p>
            <p>If this update was not done by you, please contact support immediately.</p>
            <p>Best regards,<br>Honour Career Junction Team</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending staff update email:", error);
    return false;
  }
}


export async function sendCompanyStaffUpdateEmail(
  toEmail,
  staffName,
  institutionName,
  signupUrl
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Honour Career Junction" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Profile has been Updated!",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Profile has been Updated</h2>
            <p>Dear <strong>${staffName}</strong>,</p>
            <p>Your staff profile at <strong>${institutionName}</strong> has been successfully updated.</p>
            <p>If you haven't completed your profile yet, please click the button below to do so:</p>
            <p><a href="${signupUrl}" style="padding: 10px 20px; background-color: #24B5F4; color: white; border-radius: 5px; text-decoration: none;">Complete Profile</a></p>
            <p>If this update was not done by you, please contact support immediately.</p>
            <p>Best regards,<br>Honour Career Junction Team</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending staff update email:", error);
    return false;
  }
}