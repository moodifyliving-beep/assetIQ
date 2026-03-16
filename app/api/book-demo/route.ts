import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Moodify <info@moodify.site>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "info@moodify.site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Moodify] Demo booking request from ${name}`,
      html: `
        <h2>New demo booking request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company.replace(/</g, "&lt;")}</p>` : ""}
        ${message ? `<p><strong>Message:</strong></p><pre style="white-space: pre-wrap; font-family: inherit;">${message.replace(/</g, "&lt;")}</pre>` : ""}
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to send request" },
        { status: 500 }
      );
    }

    const { error: confirmError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We've received your demo request – Moodify",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for requesting a demo of the Moodify platform. We've received your request and will reach out shortly to schedule a time that works for you.</p>
        <p>In the meantime, you can explore our <a href="https://moodify.site/pitch-deck">pitch deck</a> or <a href="https://moodify.site/contact">contact us</a> with any questions.</p>
        <p>Best regards,<br>The Moodify Team</p>
      `,
    });

    if (confirmError) {
      console.error("Book demo confirmation error:", confirmError);
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Book demo API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
