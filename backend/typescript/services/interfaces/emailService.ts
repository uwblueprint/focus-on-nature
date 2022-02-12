interface IEmailService {
  /**
   * Send confirmation email
   * @param to recipient's email
   * @throws Error if email was not sent successfully
   */
   sendConfirmationEmail(to:string): Promise<void>;
   /**
    * Send waitlist email
    * @param to recipient's email
    * @throws Error if email was not sent successfully
    */
   sendWaitlistEmail(to:string): Promise<void>;
   /**
    * Send waitlist admin email
    * @param to recipient's email
    * @throws Error if email was not sent successfully
    */
   sendWaitlistAdminEmail(to:string):Promise<void>;
   /**
    * Send cancellation email
    * @param to recipient's email
    * @throws Error if email was not sent successfully
    */
   sendCancellationEmail(to:string):Promise<void>;
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
