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

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL;
    const from = process.env.EMAIL_FROM;

    if (!frontendUrl || !from) {
      throw new Error('Email configuration missing');
    }

    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const { error } = await this.resend.emails.send({
      from,
      to: email,
      subject: 'Reset your password',
      html: `
      <h2>Reset your password</h2>

      <p>We received a request to reset your password.</p>

      <p>
        <a href="${resetUrl}">Reset password</a>
      </p>

      <p>This link expires in 1 hour.</p>

      <p>If you didn't request a password reset, you can ignore this email.</p>
    `,
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}