import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL;
    const from = process.env.EMAIL_FROM;

    if (!frontendUrl || !from) {
      throw new Error('Email configuration missing');
    }

    const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    const { error } = await this.resend.emails.send({
      from,
      to: email,
      subject: 'Verify your email',
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your account:</p>
        <p>
          <a href="${verificationUrl}">Verify email</a>
        </p>
        <p>This link expires in 1 hour.</p>
      `,
    });

    if (error) {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
}