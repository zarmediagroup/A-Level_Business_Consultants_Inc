import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, company, service, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // In development/demo mode, just return success
    console.log("Contact form submission:", { name, email, service, message });
    return NextResponse.json({ success: true });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Website Enquiry — ${name} (${service || "General"})`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background: #f0f2f8; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0b1d3a, #1a2f5e); padding: 28px 32px;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Website Enquiry</h1>
              <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">A-Level Business Consultants Inc</p>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${[
                  ["Name", name],
                  ["Email", email],
                  ["Phone", phone || "—"],
                  ["Company", company || "—"],
                  ["Service Interest", service || "—"],
                ]
                  .map(
                    ([label, value]) => `
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #64748b; width: 120px; vertical-align: top;">${label}</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0b1d3a;">${value}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
              <div style="margin-top: 20px; padding: 16px; background: #f8f9fc; border-radius: 12px; border-left: 4px solid #c9a84c;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Message</p>
                <p style="margin: 0; font-size: 14px; color: #0b1d3a; line-height: 1.6;">${message}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Confirmation to sender
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "We received your enquiry — A-Level Business Consultants Inc",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background: #f0f2f8; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0b1d3a, #1a2f5e); padding: 28px 32px;">
              <h1 style="color: white; margin: 0; font-size: 20px;">Thank you, ${name}!</h1>
              <p style="color: #94a3b8; margin: 8px 0 0;">A-Level Business Consultants Inc</p>
            </div>
            <div style="padding: 32px;">
              <p style="color: #0b1d3a; font-size: 15px;">We've received your enquiry and will be in touch within <strong>1 business day</strong>.</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6;">In the meantime, if you have an urgent query, please call us directly or email <a href="mailto:info@albc.co.za" style="color: #c9a84c;">info@albc.co.za</a>.</p>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">A-Level Business Consultants Inc — Professional Accounting &amp; Business Advisory</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
