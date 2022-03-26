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

  async sendConfirmationEmail(to: string, registrantName: string, sessionDates: string, camperName: string, camperAge: string, registrantEmail: string, registrantPhoneNumber: string, campFees: string, earlyDropOffAndPickupFees: string, totalPayment: string, link:string): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature: Confirmation Email",
      `Hi =${registrantName}<br>Thank you for registering for a Focus on Nature Camp! We are very excited to have your young photographer join us. We will be emailing you closer to the start of the camp with additional information for you and your camper. <br> Please find your registration information below, and if you need to edit any of the fields, reach out to camps@focusonnature.ca.
      <br>
      <ul>
        <li><b>Camp name:</b> =${registrantName}
        <li><b>Session dates:</b> ${sessionDates} </li>
        <li><b>Name of camper:</b> ${camperName} </li>
        <li><b>Camper's age:</b> ${camperAge}n</li>
        <li><b>Your name:</b> ${registrantName}</li>
        <li><b>Your email:</b> ${registrantEmail}</li>
        <li><b>Your phone number:</b> ${registrantPhoneNumber}</li>
      </ul>
      <br> This is the total amount we have received from you.
      <ul>
        <li><b>Camp name:</b> =${campFees}
        <li><b>Session dates:</b> ${earlyDropOffAndPickupFees} </li>
        <li> Name of camper:</b> ${totalPayment} </li>
      </ul>

      <br>Refund Policy<br>
      If you would like to cancel the registration, please use the following ${link}. We will refund your camp fee up to 30 days before your camp date. After that, we can still make a refund if we have another camper on our waitlist.
      <br>Thanks, <br> Focus on Nature.
      `,
    );
  }

  async sendCancellationEmail(to: string, registrantName:string): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature: Cancellation Email",
      `Hi ${registrantName},<br> Your Focus on Nature camp registration has been successfully canceled. You can expect any fees paid to be refunded within the next 4-5 business days. If this cancellation was a mistake or you have any further concerns, please do not hesitate to contact camps@focusonnature.ca.<br>
      Thanks,<br>
      Focus on Nature
      `,
    );
  }

  async registrationInviteEmail(to: string, campName:string, waitlistName:string, sessionDates: string, link: string): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature Camp Registration - Invitation to Register",
      `Hi ${waitlistName}<br>
      A spot opened up in ${campName} for the following session dates ${sessionDates}. To register your camper, please use the following <a href=${link}>link></a> Please complete this registration within 24 hours to confirm your spot.<br>
      Thanks,<br>
      Focus on Nature  
      `,
    );
  }

  async specialNeedsEmail(to: string, registrantName: string, sessionDates: string, camperName: string, camperAge: string, registrantEmail: string, registrantPhoneNumber: string, specialNeeds: string): Promise<void> {
    await this.sendEmail(
      to,
      "Special Needs Camper Registration Notice",
      `This following email is to notify you of a special needs camper registration. The camper listed below checked the special needs box on their registration form: <br>
      <ul>
        <li><b>Name of camper:</b> ${camperName} </li>
        <li><b>Camp name:</b> =${registrantName}
        <li><b>Session dates:</b> ${sessionDates} </li>
        <li><b>Camper's age:</b> ${camperAge}n</li>
        <li><b>Parent's name:</b> ${registrantName}</li>
        <li><b>Parent's email:</b> ${registrantEmail}</li>
        <li><b>Parent's phone number:</b> ${registrantPhoneNumber}</li>
        <li><b>Special needs:</b> ${specialNeeds}</li>
      </ul>
      `,
    );
  }

  async fullCamp(to: string, campName:string, sessionDates: string): Promise<void> {
    await this.sendEmail(
      to,
      "Camp Registration Notice - FULL CAPACITY",
      `This following email is to notify you that ${campName} is full for the following session dates ${sessionDates}`,
    );
  }

  async camperCancellationNoticeEmail(to: string, camperName:string, campName: string, sessionDates: string): Promise<void> {
    await this.sendEmail(
      to,
      "Camper Cancellation Notice",
      `This following email is to notify you that ${camperName} has canceled their camp registration. A spot has now opened up in ${campName} for the following session dates ${sessionDates}`,
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
