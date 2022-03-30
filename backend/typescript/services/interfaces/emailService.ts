interface IEmailService {
  /**
   * Send camp registration confirmation email.
   * @throws Error if email was not sent successfully
   */
  sendConfirmationEmail(
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
  ): Promise<void>;
  /**
   * Send camp registration cancellation confirmation email.
   * @throws Error if email was not sent successfully
   */
  sendCancellationEmail(to: string, registrantName: string): Promise<void>;
  /**
   * Send registration invite email.
   * @throws Error if email was not sent successfully
   */
  sendRegistrationInviteEmail(
    to: string,
    campName: string,
    waitlistName: string,
    sessionDates: string,
    link: string,
  ): Promise<void>;
  /**
   * Send special needs notice email.
   * @throws Error if email was not sent successfully
   */
  sendSpecialNeedsNoticeEmail(
    to: string,
    registrantName: string,
    campName: string,
    sessionDates: string,
    camperName: string,
    camperAge: number,
    registrantEmail: string,
    registrantPhoneNumber: string,
    specialNeeds: string,
  ): Promise<void>;
  /**
   * Send full camp notice email.
   * @throws Error if email was not sent successfully
   */
  sendFullCampNoticeEmail(
    to: string,
    campName: string,
    sessionDates: string,
  ): Promise<void>;
  /**
   * Send camper cancellation notice email.
   * @throws Error if email was not sent successfully
   */
  sendCamperCancellationNoticeEmail(
    to: string,
    camperName: string,
    campName: string,
    sessionDates: string,
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
