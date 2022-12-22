import { Camp } from "../../models/camp.model";
import { Camper } from "../../models/camper.model";
import { CampSession } from "../../models/campSession.model";
import { WaitlistedCamper } from "../../models/waitlistedCamper.model";

interface IEmailService {
  /**
   * Send camp registration confirmation email.
   * @throws Error if email was not sent successfully
   */
  sendParentConfirmationEmail(
    camp: Camp,
    campers: Camper[],
    campSession: CampSession,
  ): Promise<void>;

  /**
   * Send camp registration cancellation confirmation email.
   * @throws Error if email was not sent successfully
   */
  sendParentCancellationConfirmationEmail(campers: Camper[]): Promise<void>;

  /**
   * Send a confirmation email that a camper has been successfully between camp sessions.
   * @throws Error if email was not sent successfully
   */
  sendParentMovedConfirmationEmail(
    campers: Camper[],
    camp: Camp,
    oldCampSession: CampSession,
    newCampSession: CampSession,
  ): Promise<void>;

  /**
   * Send camp waitlist confirmation email.
   * @throws Error if email was not sent successfully
   */
  sendParentWaitlistConfirmationEmail(
    camp: Camp,
    campSessions: CampSession[],
    waitlistedCampers: WaitlistedCamper[],
  ): Promise<void>;

  /**
   * Send registration invite email.
   * @throws Error if email was not sent successfully
   */
  sendParentRegistrationInviteEmail(
    camp: Camp,
    campSession: CampSession,
    waitlistedCamper: WaitlistedCamper,
  ): Promise<void>;

  /**
   * Send special needs notice email.
   * @throws Error if email was not sent successfully
   */
  sendAdminSpecialNeedsNoticeEmail(
    camp: Camp,
    camper: Camper,
    campSession: CampSession,
  ): Promise<void>;

  /**
   * Send full camp notice email.
   * @throws Error if email was not sent successfully
   */
  sendAdminFullCampNoticeEmail(
    camp: Camp,
    campSession: CampSession,
  ): Promise<void>;

  /**
   * Send camper cancellation notice email.
   * @throws Error if email was not sent successfully
   */
  sendAdminCamperCancellationNoticeEmail(
    camp: Camp,
    camper: Camper,
    campSession: CampSession,
  ): Promise<void>;

  /**
   * Send email
   * @param to recipient's email
   * @param subject email subject
   * @param htmlBody email body as html
   * @throws Error if email was not sent successfully
   */
  sendEmail(to: string, subject: string, htmlBody: string): Promise<void>;
}

export default IEmailService;
