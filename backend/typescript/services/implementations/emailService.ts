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

  async sendConfirmationEmail(
    to: string,
    registrantName: string,
    campName: string,
    sessionDates: string,
    campers: { name: string; age: number }[],
    registrantPhoneNumber: string,
    campFee: number,
    totalCampFees: number,
    dropOffAndPickupFees: number,
    totalPayment: number,
    link: string,
  ): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature Camp Registration - Confirmation Email",
      `Hi ${registrantName},<br><br>
      Thank you for registering for a Focus on Nature Camp! We are very excited 
      to have your young photographer join us. We will be emailing you closer to 
      the start of the camp with additional information for you and your camper(s). 
      Please find your registration information below, and if you need to edit any 
      of the fields, reach out to camps@focusonnature.ca.
      <br>

      <ul>
        <li><b>Camp name:</b> ${campName} </li>
        <li><b>Session dates:</b> ${sessionDates} </li>
        <li><b>Your phone number:</b> ${registrantPhoneNumber}</li>
        <li><b>Campers:</b></li>
        ${campers
          .map((camper) => {
            return `<ul>
              <li><b>Camper:</b> ${camper.name} </li>
              <ul><li><b>Camper's age:</b> ${camper.age}</li></ul>
            </ul>`;
          })
          .join("")}
      </ul>
      <br> This is the total amount we have received from you.
      <ul>
        <li><b>Camp fees:</b> 
        $${totalCampFees} (${campers.length} campers x $${campFee} fee) </li> 
        <li><b>Early drop-off and late pick-up fees:</b> $${dropOffAndPickupFees} </li>
        <li><b>Total payment:</b> $${totalPayment} </li>
      </ul>

      <b><u>Refund Policy:</u></b><br>
      If you would like to cancel the registration, please use the following 
      link: <a href=${link}>${link}</a>. <br> We will refund your camp fee up 
      to 30 days before your camp date. After that, we can still make a refund 
      if we have another camper on our waitlist.
      <br><br>Thanks, <br><br>
      Focus on Nature`,
    );
  }

  async sendCancellationEmail(
    to: string,
    registrantName: string,
  ): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature Camp Registration - Cancellation",
      `Hi ${registrantName},<br><br> 
      Your Focus on Nature camp registration has been 
      successfully canceled. You can expect any fees paid to be refunded within the next 
      4-5 business days. If this cancellation was a mistake or you have any further concerns, 
      please do not hesitate to contact camps@focusonnature.ca.<br><br>
      Thanks,<br><br>
      Focus on Nature`,
    );
  }

  async sendRegistrationInviteEmail(
    to: string,
    campName: string,
    waitlistName: string,
    sessionDates: string,
    link: string,
  ): Promise<void> {
    await this.sendEmail(
      to,
      "Focus on Nature Camp Registration - Invitation to Register",
      `Hi ${waitlistName},<br><br>
      A spot opened up in ${campName} for the following session dates: 
      ${sessionDates}. To register your camper, please use the following link:
      <a href=${link}>${link}</a>.<br> Please complete this registration within 
      24 hours to confirm your spot.<br><br>
      Thanks,<br><br>
      Focus on Nature
      `,
    );
  }

  async sendSpecialNeedsNoticeEmail(
    to: string,
    registrantName: string,
    campName: string,
    sessionDates: string,
    camperName: string,
    camperAge: number,
    registrantEmail: string,
    registrantPhoneNumber: string,
    specialNeeds: string,
  ): Promise<void> {
    await this.sendEmail(
      to,
      "Special Needs Camper Registration Notice",
      `This following email is to notify you of a special needs camper 
      registration. The camper listed below checked the special needs box 
      on their registration form: <br><br>
      <ul>
        <li><b>Name of camper:</b> ${camperName} </li>
        <li><b>Camp name:</b> ${campName} </li>
        <li><b>Session dates:</b> ${sessionDates} </li>
        <li><b>Camper's age:</b> ${camperAge} </li>
        <li><b>Parent's name:</b> ${registrantName}</li>
        <li><b>Parent's email:</b> ${registrantEmail}</li>
        <li><b>Parent's phone number:</b> ${registrantPhoneNumber}</li>
        <li><b>Special need:</b> ${specialNeeds}</li>
      </ul>
      `,
    );
  }

  async sendFullCampNoticeEmail(
    to: string,
    campName: string,
    sessionDates: string,
  ): Promise<void> {
    await this.sendEmail(
      to,
      "Camp Registration Notice - FULL CAPACITY",
      `This following email is to notify you that ${campName} is full for the 
      following session dates: ${sessionDates}`,
    );
  }

  async sendCamperCancellationNoticeEmail(
    to: string,
    camperName: string,
    campName: string,
    sessionDates: string,
  ): Promise<void> {
    await this.sendEmail(
      to,
      "Camper Cancellation Notice",
      `This following email is to notify you that ${camperName} has canceled 
      their camp registration. A spot has now opened up in ${campName} for the 
      following session dates: ${sessionDates}`,
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
