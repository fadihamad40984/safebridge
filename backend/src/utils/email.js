const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        .header .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .reset-button {
          display: inline-block;
          padding: 15px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .info-box {
          background: #f8f9fa;
          border-right: 4px solid #667eea;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .info-box p {
          margin: 0;
          color: #555;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
        .link {
          color: #667eea;
          word-break: break-all;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌉</div>
          <h1>جِسر الأمان</h1>
        </div>
        
        <div class="content">
          <h2>إعادة تعيين كلمة المرور</h2>
          
          <p>مرحباً <strong>${user.name}</strong>،</p>
          
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في جِسر الأمان.</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="reset-button">إعادة تعيين كلمة المرور</a>
          </div>
          
          <div class="info-box">
            <p>⏰ <strong>هام:</strong> هذا الرابط صالح لمدة 30 دقيقة فقط.</p>
          </div>
          
          <p>إذا لم يعمل الزر أعلاه، يمكنك نسخ ولصق الرابط التالي في متصفحك:</p>
          
          <p><a href="${resetUrl}" class="link">${resetUrl}</a></p>
          
          <div class="info-box">
            <p>⚠️ إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني. حسابك آمن.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2026 جِسر الأمان - SafeBridge</p>
          <p>منصة متابعة الصحة النفسية للأطفال</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'إعادة تعيين كلمة المرور - جِسر الأمان',
    html,
  });
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (user) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 64px;
          margin-bottom: 10px;
        }
        h1 {
          margin: 0;
          font-size: 32px;
        }
        .content {
          padding: 40px 30px;
        }
        h2 {
          color: #333;
          margin-bottom: 20px;
        }
        p {
          color: #666;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin: 20px 0;
          padding: 15px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎉</div>
          <h1>مرحباً بك في جِسر الأمان!</h1>
        </div>
        
        <div class="content">
          <h2>أهلاً ${user.name}،</h2>
          
          <p>نحن سعداء جداً بانضمامك إلى عائلة جِسر الأمان 🌉</p>
          
          <p>تم إنشاء حسابك بنجاح. يمكنك الآن البدء باستخدام المنصة لمتابعة الحالة النفسية بشكل فعال وآمن.</p>
          
          <div style="text-align: center;">
            <a href="${loginUrl}" class="button">تسجيل الدخول الآن</a>
          </div>
          
          <p>إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، لا تتردد في التواصل معنا.</p>
        </div>
        
        <div class="footer">
          <p>© 2026 جِسر الأمان - SafeBridge</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'مرحباً بك في جِسر الأمان! 🎉',
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
