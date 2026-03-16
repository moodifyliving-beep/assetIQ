import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify moodify.site at https://resend.com/domains to use info@moodify.site as sender.
// Before domain verification, set RESEND_FROM_EMAIL=... to onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Moodify <info@moodify.site>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "info@moodify.site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subject ? `[Moodify Contact] ${subject}` : `[Moodify Contact] Message from ${name}`,
      html: `
        <h2>New contact form message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${message.replace(/</g, "&lt;")}</pre>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to send email" },
        { status: 500 }
      );
    }

    // Send confirmation to the user
    const { error: confirmError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We've received your message – Moodify",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for getting in touch with Moodify. We've received your message and will get back to you as soon as possible.</p>
        <p>In the meantime, feel free to explore our platform or follow us on <a href="https://www.instagram.com/moodifyliving/">Instagram</a>.</p>
        <p>Best regards,<br>The Moodify Team</p>
      `,
    });

    if (confirmError) {
      console.error("Resend confirmation error:", confirmError);
      // Don't fail the request – main message was delivered
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
