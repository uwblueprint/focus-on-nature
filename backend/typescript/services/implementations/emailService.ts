import nodemailer, { Transporter } from "nodemailer";
import IEmailService from "../interfaces/emailService";
import { NodemailerConfig } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class EmailService implements IEmailService {
  transporter: Transporter;

  sender: string;

  constructor(nodemailerConfig: NodemailerConfig, displayName?: string) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
    if (displayName) {
      this.sender = `${displayName} <${nodemailerConfig.auth.user}>`;
    } else {
      this.sender = nodemailerConfig.auth.user;
    }
  }

  async sendConfirmationEmail(to: string): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature: Confirmation Email",
      "dummy body",
    );
  }

  async sendWaitlistEmail(to: string): Promise<void> {
    await this.sendEmail(to, "Focus on Nature: Waitlist Email", "dummy body");
  }

  async sendWaitlistAdminEmail(to: string): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature: Waitlist Admin Email",
      "dummy body",
    );
  }

  async sendCancellationEmail(to: string): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature: Cancellation Email",
      "dummy body",
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.sender,
      to,
      subject,
      html: htmlBody,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      Logger.error(`Failed to send email. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default EmailService;
