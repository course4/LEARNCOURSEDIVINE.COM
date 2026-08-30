const axios = require('axios');
const nodemailer = require('nodemailer');

const sendOwnerApprovalEmail = async ({ toEmail = 'coursedivine@gmail.com', adminEmail, token, code, approvalUrl }) => {
  // 1. Dispatch email to coursedivine@gmail.com via FormSubmit AJAX service
  try {
    const formSubmitRes = await axios.post(`https://formsubmit.co/ajax/${toEmail}`, {
      _subject: '🔒 URGENT ACTION REQUIRED: Admin Password Reset Request - Course Divine',
      _captcha: 'false',
      _template: 'table',
      Target_Owner_Email: toEmail,
      Admin_Account_Requesting_Reset: adminEmail,
      Time_Of_Request: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
      Verification_Code: code,
      Direct_Approval_Link: approvalUrl,
      Message: `An admin password reset was requested for ${adminEmail}. Click the Direct Approval Link or provide the 6-digit code (${code}) to proceed.`
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log(`[FORMSUBMIT SUCCESS] Approval email sent to ${toEmail}:`, formSubmitRes.data);
  } catch (formErr) {
    console.error(`[FORMSUBMIT NOTICE]:`, formErr.message);
  }

  // 2. Direct SMTP Transport (if configured in .env)
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Course Divine Security" <noreply@coursedivine.com>',
        to: toEmail,
        subject: '🔒 URGENT ACTION REQUIRED: Admin Password Reset Request - Course Divine',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800;">COURSE DIVINE</h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Owner Security & Authorization Center</p>
            </div>
            
            <div style="padding: 32px 24px; color: #334155; line-height: 1.6;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; color: #92400e; font-weight: 700; font-size: 14px;">⚠️ Owner Authorization Request</p>
                <p style="margin: 4px 0 0 0; color: #b45309; font-size: 13px;">An administrator password update was requested for <strong>${adminEmail}</strong>. Owner approval is required to apply this change to MongoDB.</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #f8fafc; border-radius: 10px; padding: 12px;">
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: 600;">Requested Account:</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a; font-weight: 700;">${adminEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: 600;">Time of Request:</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #0f172a; font-weight: 700;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #64748b; font-weight: 600;">Verification Code:</td>
                  <td style="padding: 10px 14px; font-size: 18px; color: #2563eb; font-weight: 800; letter-spacing: 2px;">${code}</td>
                </tr>
              </table>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${approvalUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
                  PROCEED & APPROVE PASSWORD RESET
                </a>
              </div>

              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">
                If you did not authorize this change, please ignore this email or contact security immediately. This approval link expires in 15 minutes.
              </p>
            </div>
          </div>
        `
      });
      console.log(`[SMTP SUCCESS] Approval email sent to ${toEmail}`);
    } catch (smtpErr) {
      console.error(`[SMTP ERROR]:`, smtpErr.message);
    }
  }
};

module.exports = { sendOwnerApprovalEmail };
