import Stripe from "stripe";
import nodemailer, { Transporter } from "nodemailer";
import IEmailService from "../interfaces/emailService";
import { CampLocation, NodemailerConfig } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import { Camper } from "../../models/camper.model";
import { Camp } from "../../models/camp.model";
import { CampSession } from "../../models/campSession.model";
import { WaitlistedCamper } from "../../models/waitlistedCamper.model";
import { retrieveStripeCheckoutSession } from "../../utilities/stripeUtils";

// TODO: swap out this email for the focus on nature admin email
const ADMIN_EMAIL = "focusonnature@uwblueprint.org";

const Logger = logger(__filename);

function sessionDatesToString(dates: Date[] | undefined) {
  if (!dates) {
    return "";
  }
  return dates.map((date) => date.toDateString()).join(", ");
}

// Returns a list item for each camp session with the dates of the camp session
function getSessionDatesListItems(campSessions: CampSession[]) {
  campSessions.map((campSession) => {
    return campSession.dates.sort((a, b) => {
      return a.getTime() - b.getTime();
    });
  });
  return campSessions.map((campSession) => {
    return `<li>${sessionDatesToString(campSession.dates)}</li>`;
  });
}

function getLocationString(location: CampLocation): string {
  return `${location.streetAddress1} ${
    location.streetAddress2 && `, ${location.streetAddress2}`
  }, ${location.city}, ${location.province}, ${location.postalCode}`;
}

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

  async sendParentConfirmationEmail(
    camp: Camp,
    campers: Camper[],
    campSessions: CampSession[],
  ): Promise<void> {
    const contact = campers[0].contacts[0];
    const { chargeId } = campers[0];
    const link = `${process.env.CLIENT_URL}/refund/${campers[0].refundCode}`;
    const sessionDatesListItems: string[] = getSessionDatesListItems(
      campSessions,
    );
    const campLocationString: string = getLocationString(camp.location);
    let discountAmount = 0;

    try {
      const checkoutSession: Stripe.Checkout.Session = await retrieveStripeCheckoutSession(
        chargeId,
      );

      if (!checkoutSession) {
        throw new Error(`Could not find checkout session with id ${chargeId}`);
      }

      // Stripe returns value without decimal point so divide by 100.0 to convert to float
      discountAmount = checkoutSession.total_details?.amount_discount
        ? checkoutSession.total_details?.amount_discount / 100.0
        : 0;
    } catch (error: unknown) {
      Logger.error("Failed to retrieve checkout session.");
      throw error;
    }

    // Remove duplicated campers (each camper has entity per camp session)
    const uniqueCampers = campers.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (c) =>
            c.firstName === value.firstName && c.lastName === value.lastName,
        ),
    );

    // Fees calculations
    let totalPayment = 0;
    let campFees = 0;
    let dropoffAndPickupFees = 0;
    const totalCampDays = campSessions
      .map((cs) => cs.dates.length)
      .reduce((sumDays, days) => sumDays + days);
    uniqueCampers.forEach((camper) => {
      campFees += camper.charges.camp;
      dropoffAndPickupFees +=
        camper.charges.earlyDropoff + camper.charges.latePickup;
    });

    totalPayment = campFees + dropoffAndPickupFees - discountAmount;

    await this.sendEmail(
      contact.email,
      "Focus on Nature Camp Registration - Confirmation Email",
      `Hi ${contact.firstName} ${contact.lastName},<br><br>
      Thank you for registering for a Focus on Nature Camp! We are very excited 
      to have your young photographer join us. We will be emailing you closer to 
      the start of the camp with additional information for you and your camper(s). 
      Please find your registration information below, and if you need to edit any 
      of the fields, reach out to camps@focusonnature.ca.
      <br>

      <ul>
        <li><b>Camp name:</b> ${camp.name} </li>
        <li><b>Camp location:</b> ${campLocationString} </li>
        <li><b>Session dates:</b></li>
        <ol>
          ${sessionDatesListItems.join("")}
        </ol>
        <li><b>Your phone number:</b> ${contact.phoneNumber}</li>
        <li><b>Campers:</b></li>
        ${uniqueCampers
          .map((camper) => {
            return `<ul>
              <li><b>Name:</b> ${camper.firstName} ${camper.lastName}</li>
              <ul><li><b>Age:</b> ${camper.age}</li></ul>
            </ul>`;
          })
          .join("")}
      </ul>
      <br> This is the total amount we have received from you.
      <ul>
        <li><b>Camp fees:</b> 
        $${campFees} (${
        uniqueCampers.length
      } campers x ${totalCampDays} total days of camp) </li> 
        <li><b>Early drop-off and late pick-up fees:</b> $${dropoffAndPickupFees} </li>
        ${
          discountAmount > 0
            ? `<li><b>Discount Amount:</b> $${discountAmount} </li>`
            : ``
        }
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

  async sendParentCancellationConfirmationEmail(
    campers: Camper[],
  ): Promise<void> {
    const contact = campers[0].contacts[0];
    await this.sendEmail(
      contact.email,
      "Focus on Nature Camp Registration - Cancellation",
      `Hi ${contact.firstName} ${contact.lastName},<br><br> 
      Your Focus on Nature camp registration has been 
      successfully canceled. You can expect any fees paid to be refunded within the next 
      4-5 business days. If this cancellation was a mistake or you have any further concerns, 
      please do not hesitate to contact camps@focusonnature.ca.<br><br>
      Thanks,<br><br>
      Focus on Nature`,
    );
  }

  async sendParentMovedConfirmationEmail(
    campers: Camper[],
    camp: Camp,
    oldCampSession: CampSession,
    newCampSession: CampSession,
  ): Promise<void> {
    let camperNames = "";
    const placeholder = campers.length > 1 ? "have" : "has";
    const contact = campers[0].contacts[0];
    for (let i = 0; i < campers.length; i += 1) {
      camperNames += `${campers[i].firstName} ${campers[i].lastName}`;
      if (i === campers.length - 1) {
        break;
      } else if (i === campers.length - 2) {
        camperNames += " and ";
      } else {
        camperNames += ", ";
      }
    }

    await this.sendEmail(
      contact.email,
      "Focus on Nature Camp Session Change - Confirmation",
      `Hi ${contact.firstName} ${contact.lastName},<br><br>
      This following email is to notify you that ${camperNames} ${placeholder} been successfully 
      moved from ${camp.name} happening on
      ${sessionDatesToString(oldCampSession.dates)} to ${camp.name} happening on
      ${sessionDatesToString(newCampSession.dates)}.<br><br>
      If you have further questions or concerns, please do not hesitate to contact camps@focusonnature.ca.<br><br>
      Thanks,<br><br>
      Focus on Nature
      `,
    );
  }

  async sendParentWaitlistConfirmationEmail(
    camp: Camp,
    campSessions: CampSession[],
    waitlistedCampers: WaitlistedCamper[],
  ): Promise<void> {
    const sessionDatesListItems: string[] = getSessionDatesListItems(
      campSessions,
    );
    const campLocationString: string = getLocationString(camp.location);

    // Remove duplicated campers (each camper has entity per camp session)
    const uniqueCamperIds = new Set(
      waitlistedCampers.map((camper) => camper.id),
    );
    await this.sendEmail(
      waitlistedCampers[0].contactEmail,
      "Focus on Nature Camp Waitlist - Confirmation",
      `Hi ${waitlistedCampers[0].contactFirstName} ${
        waitlistedCampers[0].contactLastName
      },<br><br>
      Thank you for joining the waitlist for a Focus on Nature Camp! We will 
      reach out to you if a spot opens up. <br>
      Please find your waitlist information below, and if you need to edit any 
      of the fields, reach out to camps@focusonnature.ca. <br>
      <ul>
        <li><b>Camp name:</b> ${camp.name}</li>
        <li><b>Camp location:</b> ${campLocationString}</li>
        <li><b>Session dates:</b></li>
        <ol>
          ${sessionDatesListItems.join("")}
        </ol>
        <li><b>Campers:</b></li>
        ${waitlistedCampers
          .filter((camper) => uniqueCamperIds.has(camper.id))
          .map((camper) => {
            return `<ul>
              <li><b>Name:</b> ${camper.firstName} ${camper.lastName}</li>
              <ul><li><b>Age:</b> ${camper.age}</li></ul>
            </ul>`;
          })
          .join("")}
        <li><b>Your phone number:</b> ${waitlistedCampers[0].contactNumber}</li>
      </ul>
      Thanks, <br><br>
      Focus on Nature
      `,
    );
  }

  async sendParentRegistrationInviteEmail(
    camp: Camp,
    campSession: CampSession,
    waitlistedCamper: WaitlistedCamper,
  ): Promise<void> {
    const link = `${process.env.CLIENT_URL}/register/camp/${camp.id}?waitlistedSessionId=${campSession.id}&waitlistedCamperId=${waitlistedCamper.id}`;
    await this.sendEmail(
      waitlistedCamper.contactEmail,
      "Focus on Nature Camp Registration - Invitation to Register",
      `Hi ${waitlistedCamper.contactFirstName} ${
        waitlistedCamper.contactLastName
      },<br><br>
      A spot opened up in ${camp.name} for the following session dates: 
      ${sessionDatesToString(
        campSession.dates,
      )}. To register your camper, please use the following link:
      <a href=${link}>${link}</a>.<br> Please complete this registration within 
      72 hours to confirm your spot.<br><br>
      Thanks,<br><br>
      Focus on Nature
      `,
    );
  }

  async sendAdminSpecialNeedsNoticeEmail(
    camp: Camp,
    camper: Camper,
    campSessions: CampSession[],
  ): Promise<void> {
    const contact = camper.contacts[0];
    const sessionDatesListItems: string[] = getSessionDatesListItems(
      campSessions,
    );

    await this.sendEmail(
      ADMIN_EMAIL,
      "Special Needs Camper Registration Notice",
      `This following email is to notify you of a special needs camper 
      registration. The camper listed below checked the special needs box 
      on their registration form: <br><br>
      <ul>
        <li><b>Name of camper:</b> ${camper.firstName} ${camper.lastName}</li>
        <li><b>Camp name:</b> ${camp.name} </li>
        <li><b>Session dates:</b></li> 
        <ol>
          ${sessionDatesListItems.join("")}
        </ol>
        <li><b>Parent's name:</b> ${contact.firstName} ${contact.lastName}</li>
        <li><b>Parent's email:</b> ${contact.email}</li>
        <li><b>Parent's phone number:</b> ${contact.phoneNumber}</li>
        <li><b>Special need:</b> ${camper.specialNeeds}</li>
      </ul>
      `,
    );
  }

  async sendAdminFullCampNoticeEmail(
    camp: Camp,
    campSessions: CampSession[],
  ): Promise<void> {
    const sessionDatesListItems: string[] = campSessions.map((campSession) => {
      return `<li> Session with dates: ${sessionDatesToString(
        campSession.dates,
      )}</li>`;
    });
    await this.sendEmail(
      ADMIN_EMAIL,
      "Camp Registration Notice - FULL CAPACITY",
      `This following email is to notify you that ${camp.name} is full for the 
      following following sessions. <br/>
      <ol>
        ${sessionDatesListItems.join("")}
      </ol>
      `,
    );
  }

  async sendAdminCamperCancellationNoticeEmail(
    camp: Camp,
    camper: Camper,
    campSession: CampSession,
  ): Promise<void> {
    await this.sendEmail(
      ADMIN_EMAIL,
      "Camper Cancellation Notice",
      `This following email is to notify you that ${camper.firstName} 
      ${camper.lastName} has cancelled their camp registration. One spot 
      has now opened up in ${camp.name} for the following session dates: 
      ${sessionDatesToString(campSession.dates)}.`,
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
