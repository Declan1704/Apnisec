import { Resend } from "resend";
import { AppError } from "./AppError";

export class EmailService {
  private resend: Resend;
  private fromEmail: string = "ApniSec <no-reply@resend.dev>"; // Customize sender (verify domain later for prod)

  constructor(apiKey: string) {
    if (!apiKey) throw new AppError("Resend API key missing", 500);
    this.resend = new Resend(apiKey);
  }

  async sendWelcome(email: string, name?: string) {
    const subject = "Welcome to ApniSec!";
    const html = `
      <h1>Welcome${name ? `, ${name}` : ""}!</h1>
      <p>Thank you for joining <strong>ApniSec</strong> – your trusted cybersecurity partner.</p>
      <p>You can now create and manage security issues like Cloud Security assessments, Red Team exercises, and VAPT reports.</p>
      <p>Stay secure!<br/>The ApniSec Team</p>
      <hr/>
      <small>This is an automated message. Please do not reply.</small>
    `;

    return this.send(email, subject, html);
  }

  async sendIssueCreated(
    email: string,
    issue: { type: string; title: string; description?: string }
  ) {
    const subject = `New Issue Created: ${issue.title}`;
    const typeLabel = issue.type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const html = `
      <h2>New Security Issue Logged</h2>
      <p><strong>Type:</strong> ${typeLabel}</p>
      <p><strong>Title:</strong> ${issue.title}</p>
      ${
        issue.description
          ? `<p><strong>Description:</strong> ${issue.description}</p>`
          : ""
      }
      <p>You can view and manage this issue in your <a href="https://your-deployed-url/dashboard">ApniSec Dashboard</a>.</p>
      <hr/>
      <small>Notification from ApniSec</small>
    `;

    return this.send(email, subject, html);
  }

  private async send(to: string, subject: string, html: string) {
    try {
      const data = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
      });
      console.log("Email sent:", data);
      return data;
    } catch (error) {
      console.error("Email failed:", error);
      // Don't throw in dev – emails are non-critical
      // In prod: log to monitoring
    }
  }
}
