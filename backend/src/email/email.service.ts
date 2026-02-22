import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        // Configure SMTP transporter. In production, provide the env variables.
        // For development, if no SMTP config is provided, we can fallback to ethereal or console log.
        if (process.env.SMTP_HOST) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            this.logger.log('SMTP Configured for Transactional Emails.');
        } else {
            // Development Mock
            this.transporter = nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
            });
            this.logger.warn('No SMTP config found. Emails will be logged to console instead of sending.');
        }
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Gigligo Team" <noreply@gigligo.com>',
                to,
                subject,
                html,
            });

            if (info.message && Buffer.isBuffer(info.message)) {
                // If using stream transport (local dev), log it.
                this.logger.debug('---- MOCK EMAIL SENT ----');
                this.logger.debug(info.message.toString());
                this.logger.debug('-------------------------');
            } else {
                this.logger.log(`Email sent successfully to ${to} [Message ID: ${info.messageId}]`);
            }

            return { success: true, messageId: info.messageId };
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
            // We usually don't want email failures to break the main application flow
            return { success: false, error };
        }
    }

    async sendWelcomeEmail(to: string, fullName: string, role: string) {
        const roleLabel = role === 'SELLER' ? 'Freelancer' : (role === 'BUYER' || role === 'EMPLOYER') ? 'Client' : 'Member';
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #0d9488;">Welcome to Gigligo, ${fullName}!</h1>
                <p>We are thrilled to have you join our community as a <strong>${roleLabel}</strong>.</p>
                <p>Gigligo is Pakistan's premier platform connecting top university talent with ambitious businesses.</p>
                <p>Your next steps:</p>
                <ul>
                    <li>Complete your profile completely to build trust.</li>
                    ${role === 'SELLER' || role === 'STUDENT' ? '<li>Start browsing jobs and submit applications.</li>' : '<li>Post your first gig to start receiving applications.</li>'}
                </ul>
                <br>
                <p>Best Regards,</p>
                <p><strong>The Gigligo Team</strong></p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                <small style="color: #999;">If you didn't create an account with Gigligo, please ignore this email.</small>
            </div>
        `;

        return this.sendMail(to, 'Welcome to Gigligo! 🎉', html);
    }

    async sendApplicationSubmittedEmail(to: string, employerName: string, freelancerName: string, jobTitle: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0d9488;">New Applicant for: ${jobTitle}</h2>
                <p>Hello ${employerName},</p>
                <p><strong>${freelancerName}</strong> has just submitted a proposal for your job posting.</p>
                <p>Log in to your dashboard to review their cover letter, proposed rate, and profile.</p>
                <br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com'}/dashboard" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Application</a>
                <br><br>
                <p>Best Regards,</p>
                <p><strong>The Gigligo Team</strong></p>
            </div>
        `;
        return this.sendMail(to, `New Applicant: ${jobTitle}`, html);
    }

    async sendApplicationHiredEmail(to: string, freelancerName: string, jobTitle: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #0d9488;">Congratulations, ${freelancerName}! 🎉</h1>
                <p>You have been <strong>HIRED</strong> for the job: <strong>${jobTitle}</strong>.</p>
                <p>The client was impressed with your proposal and has decided to move forward with you as their selected professional.</p>
                <p>Log in to your dashboard to view the order details and securely communicate with the client.</p>
                <br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com'}/dashboard" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order Details</a>
                <br><br>
                <p>Good luck!</p>
                <p><strong>The Gigligo Team</strong></p>
            </div>
        `;
        return this.sendMail(to, `You've been Hired! 🎉 (${jobTitle})`, html);
    }

    async sendOrderCreatedEmail(to: string, buyerName: string, gigTitle: string, orderId: string) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com';
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e8793a;">New Order Received! 🎉</h2>
                <p>Great news! <strong>${buyerName}</strong> has placed an order for your gig:</p>
                <p style="font-size: 18px; font-weight: bold; color: #0d9488;">${gigTitle}</p>
                <p>Log in to your dashboard to view the order details and start working.</p>
                <br>
                <a href="${appUrl}/dashboard" style="background-color: #e8793a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Order</a>
                <br><br>
                <p>Best Regards,</p>
                <p><strong>The Gigligo Team</strong></p>
            </div>
        `;
        return this.sendMail(to, `New Order: ${gigTitle}`, html);
    }

    async sendOrderCompletedEmail(to: string, recipientName: string, gigTitle: string, amountPKR: number) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com';
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0d9488;">Order Completed ✅</h2>
                <p>Hello ${recipientName},</p>
                <p>The order for <strong>${gigTitle}</strong> has been marked as completed.</p>
                <p>Amount: <strong>PKR ${amountPKR.toLocaleString()}</strong></p>
                <p>Please leave a review to help the community!</p>
                <br>
                <a href="${appUrl}/dashboard" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Leave a Review</a>
                <br><br>
                <p>Best Regards,</p>
                <p><strong>The Gigligo Team</strong></p>
            </div>
        `;
        return this.sendMail(to, `Order Completed: ${gigTitle}`, html);
    }

    async sendNewMessageEmail(to: string, recipientName: string, senderName: string) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com';
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0d9488;">New Message 💬</h2>
                <p>Hello ${recipientName},</p>
                <p><strong>${senderName}</strong> sent you a new message on Gigligo.</p>
                <br>
                <a href="${appUrl}/dashboard" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Message</a>
                <br><br>
                <p>Best Regards,</p>
                <p><strong>The Gigligo Team</strong></p>
            </div>
        `;
        return this.sendMail(to, `New message from ${senderName}`, html);
    }

    async sendDisputeOpenedEmail(to: string, recipientName: string, orderId: string, reason: string) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com';
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Dispute Opened ⚠️</h2>
                <p>Hello ${recipientName},</p>
                <p>A dispute has been raised for one of your orders.</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p>Our team will review the case and reach out to both parties. You can add evidence or respond within your dashboard.</p>
                <br>
                <a href="${appUrl}/dashboard" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Dispute</a>
                <br><br>
                <p>Best Regards,</p>
                <p><strong>The Gigligo Team</strong></p>
            </div>
        `;
        return this.sendMail(to, `Dispute Opened — Action Required`, html);
    }
}
