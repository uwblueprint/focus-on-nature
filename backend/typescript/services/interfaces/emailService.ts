interface IEmailService {
  /**
   * Send confirmation email
   * @param to recipient's email
   * @throws Error if email was not sent successfully
   */
  sendConfirmationEmail(to: string, registrantName: string, sessionDates: string, camperName: string, camperAge: string, registrantEmail: string, registrantPhoneNumber: string, campFees: string, earlyDropOffAndPickupFees: string, totalPayment: string, link: string): Promise<void>;
  /**
   * Send waitlist email
   * @param to recipient's email
   * @throws Error if email was not sent successfully
   */
   sendCancellationEmail(to: string, registrantName:string): Promise<void>;
  /**
   * Send waitlist admin email
   * @param to recipient's email
   * @throws Error if email was not sent successfully
   */
   registrationInviteEmail(to: string, campName:string, waitlistName:string, sessionDates: string, link: string): Promise<void>;
  /**
   * Send cancellation email
   * @param to recipient's email
   * @throws Error if email was not sent successfully
   */
   specialNeedsEmail(to: string, registrantName: string, sessionDates: string, camperName: string, camperAge: string, registrantEmail: string, registrantPhoneNumber: string, specialNeeds: string): Promise<void>;
  /**
   * Send email
   * @param to recipient's email
   * @param subject email subject
   * @param htmlBody email body as html
   * @throws Error if email was not sent successfully
   */
   fullCamp(to: string, campName:string, sessionDates: string): Promise<void>;

   camperCancellationNoticeEmail(to: string, camperName:string, campName: string, sessionDates: string): Promise<void>;

   sendEmail(to: string, subject: string, htmlBody: string): Promise<void>;
}

export default IEmailService;
