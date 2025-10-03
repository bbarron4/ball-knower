import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (process.env.SENDGRID_API_KEY) {
      this.transporter = nodemailer.createTransporter({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
      console.log('✅ Email service initialized with SendGrid');
    } else {
      console.log('⚠️  SendGrid API key not found - email notifications disabled');
    }
  }

  async sendEmail(to, subject, html, text = '') {
    if (!this.transporter) {
      console.log('📧 Email service not configured - skipping email to:', to);
      return { success: false, reason: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@ballknower.com',
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully to:', to);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  // Weekly challenge notification templates
  async sendWeeklyChallengeOpen(user, challenge) {
    const subject = `🏈 Week ${challenge.week_number} Challenge is Open!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🏈 Ball Knower</h1>
          <h2 style="margin: 10px 0 0 0; font-size: 24px;">Week ${challenge.week_number} Challenge is Open!</h2>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h3 style="color: #333; margin-top: 0;">Hey ${user.username}! 👋</h3>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            The Week ${challenge.week_number} challenge is now open! Make your picks and test your football knowledge.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="margin-top: 0; color: #28a745;">🎯 This Week's Challenge</h4>
            <ul style="color: #555;">
              <li><strong>5 Games to Pick</strong> - Choose your winners</li>
              <li><strong>3 Trivia Questions</strong> - Test your knowledge</li>
              <li><strong>Confidence Ratings</strong> - Boost your score</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🏈 Start Your Picks
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Challenge locks on ${new Date(challenge.locks_at).toLocaleDateString()} at ${new Date(challenge.locks_at).toLocaleTimeString()}.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>You're receiving this because you signed up for Ball Knower weekly challenges.</p>
          <p><a href="#" style="color: #666;">Unsubscribe</a> | <a href="#" style="color: #666;">Update Preferences</a></p>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendReminderEmail(user, challenge) {
    const subject = `⏰ Last Chance - Week ${challenge.week_number} Challenge Closes Soon!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">⏰ Last Chance!</h1>
          <h2 style="margin: 10px 0 0 0; font-size: 24px;">Week ${challenge.week_number} Challenge Closes Soon</h2>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h3 style="color: #333; margin-top: 0;">Don't miss out, ${user.username}! 🏈</h3>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            The Week ${challenge.week_number} challenge closes soon. Make sure you've made all your picks!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}" 
               style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🏈 Complete Your Picks
            </a>
          </div>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendResultsEmail(user, challenge, results) {
    const subject = `🏆 Week ${challenge.week_number} Results Are In!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🏆 Results Are In!</h1>
          <h2 style="margin: 10px 0 0 0; font-size: 24px;">Week ${challenge.week_number} Challenge Results</h2>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h3 style="color: #333; margin-top: 0;">Great job, ${user.username}! 🎉</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #28a745;">📊 Your Performance</h4>
            <p><strong>Total Points:</strong> ${results.totalPoints}</p>
            <p><strong>Rank:</strong> #${results.rank}</p>
            <p><strong>Picks Correct:</strong> ${results.picksCorrect}/5</p>
            <p><strong>Trivia Correct:</strong> ${results.triviaCorrect}/3</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🏈 View Full Leaderboard
            </a>
          </div>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }
}

export default new EmailService();
