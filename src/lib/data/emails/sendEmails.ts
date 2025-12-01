import { ServerClient } from "postmark";

const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

interface EmailVerificationData {
    user: {
        name: string
        email: string
    }
    url: string
}

// ----------------------------------------------------------------------
// Generic Send Email Function
// ----------------------------------------------------------------------

export function sendEmail({ to, subject, html, text, }: {
    to: string;
    subject: string;
    html: string;
    text: string;
}) {
    return postmarkClient.sendEmail({
        From: process.env.POSTMARK_FROM_EMAIL!,
        To: to,
        Subject: subject,
        HtmlBody: html,
        TextBody: text,
    });
}

// ----------------------------------------------------------------------
// Password Reset Email
// ----------------------------------------------------------------------

export function sendPasswordResetEmail({
    user,
    url,
}: {
    user: { email: string; name: string }
    url: string
}) {
    return sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
        text: `Hello ${user.name},\n\nYou requested to reset your password. Click this link to reset it: ${url}\n\nIf you didn't request this, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
    })
}


// ----------------------------------------------------------------------
// Email Verification Email
// ----------------------------------------------------------------------
export async function sendEmailVerificationEmail({
    user,
    url,
}: EmailVerificationData) {
    await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <a href="${url}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
        text: `Hello ${user.name},\n\nThank you for signing up! Please verify your email address by clicking this link: ${url}\n\nIf you didn't create an account, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
    })
}

// ----------------------------------------------------------------------
// Welcome Email
// ----------------------------------------------------------------------

export async function sendWelcomeEmail(user: { name: string; email: string }) {
    await sendEmail({
        to: user.email,
        subject: "Welcome to Our App!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our App!</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up for our app! We're excited to have you on board.</p>
        <p>Best regards,
        <br>
        Your App Team</p>
      </div>
    `,
        text: `Hello ${user.name},\n\nThank you for signing up for our app! We're excited to have you on board.\n\nBest regards,\nYour App Team`,
    })
}

// ----------------------------------------------------------------------
// Account Deletion Email
// ----------------------------------------------------------------------

export async function sendDeleteAccountVerificationEmail({
    user,
    url,
}: EmailVerificationData) {
    await sendEmail({
        to: user.email,
        subject: "Delete your account",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Account Deletion</h2>
        <p>Hello ${user.name},</p>
        <p>We're sorry to see you go! Please confirm your account deletion by clicking the button below:</p>
        <a href="${url}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Confirm Deletion</a>
        <p>If you don't have an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
        text: `Hello ${user.name},\n\nWe're sorry to see you go! Please confirm your account deletion by clicking this link: ${url}\n\nIf you don't have an account, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
    })
}

// ----------------------------------------------------------------------
// Send Organization Invitation Email
// ----------------------------------------------------------------------

export async function sendOrganizationInviteEmail({
    invitation,
    inviter,
    organization,
    email,
}: {
    invitation: { id: string }
    inviter: { name: string }
    organization: { name: string }
    email: string
}) {
    await sendEmail({
        to: email,
        subject: `You're invited to join the ${organization.name} organization`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You're invited to join ${organization.name}</h2>
        <p>Hello ${inviter.name},</p>
        <p>${inviter.name} invited you to join the ${organization.name} organization. Please click the button below to accept/reject the invitation:</p>
        <a href="${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Manage Invitation</a>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
        text: `You're invited to join the ${organization.name} organization\n\nHello ${inviter.name},\n\n${inviter.name} invited you to join the ${organization.name} organization. Please click the link below to accept/reject the invitation:\n\n${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}\n\nBest regards,\nYour App Team`,
    })
}
