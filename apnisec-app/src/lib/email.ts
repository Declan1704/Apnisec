import { EmailService } from "../../src/app/core/EmailService";

export const emailService = new EmailService(process.env.RESEND_API_KEY!);
