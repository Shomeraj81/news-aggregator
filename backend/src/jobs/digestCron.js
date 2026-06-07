import cron from "node-cron";
import User from "../models/User.js";
import Article from "../models/Article.js";
import sendEmail from "../utils/sendEmail.js";

const buildEmailTemplate = (username, articles) => {
  const articleRows = articles.map((article) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #27272a;">
        <span style="
          background: #1d4ed8;
          color: white;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 11px;
          text-transform: capitalize;
        ">${article.category}</span>
        <h3 style="margin: 8px 0 4px; color: #ffffff; font-size: 16px;">
          ${article.title}
        </h3>
        <p style="margin: 0 0 8px; color: #a1a1aa; font-size: 14px; line-height: 1.5;">
          ${article.description?.slice(0, 120)}...
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #60a5fa; font-size: 12px;">${article.source}</span>
          <a href="${article.url}" style="
            background: #2563eb;
            color: white;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 12px;
            text-decoration: none;
          ">Read →</a>
        </div>
      </td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#ffffff;font-size:28px;margin:0;">📰 News Aggregator</h1>
          <p style="color:#71717a;margin:8px 0 0;">Your weekly digest — top stories this week</p>
        </div>
        <p style="color:#a1a1aa;font-size:15px;">Hey ${username} 👋 here are the top stories you might have missed:</p>
        <table style="width:100%;border-collapse:collapse;">${articleRows}</table>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #27272a;text-align:center;">
          <p style="color:#52525b;font-size:12px;margin:0;">You're receiving this because you registered at News Aggregator.</p>
          <p style="color:#52525b;font-size:12px;margin:4px 0 0;">© 2026 News Aggregator — Personalized Intelligence</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const startDigestCron = () => {
  // every Monday at 8AM
  cron.schedule("0 8 * * 1", async () => {
    console.log("Starting weekly email digest...");
    try {
      const articles = await Article.find()
        .sort({ trendingScore: -1 })
        .limit(5);

      if (articles.length === 0) {
        console.log("No articles for digest");
        return;
      }

      // only fetch subscribed users
      const users = await User.find(
        { digestSubscribed: true },
        "username email"
      );

      console.log(`Sending digest to ${users.length} users...`);

      for (const user of users) {
        try {
          const html = buildEmailTemplate(user.username, articles);
          await sendEmail(user.email, "📰 Your Weekly News Digest", html);
          console.log(`Sent to ${user.email}`);
        } catch (error) {
          console.error(`Failed for ${user.email}:`, error.message);
        }
      }

      console.log("Weekly digest complete");
    } catch (error) {
      console.error("Digest cron error:", error);
    }
  });

  console.log("Digest cron job started");
};

export default startDigestCron;