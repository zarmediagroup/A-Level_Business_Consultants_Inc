import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, clientName, fileName, category, docId } = body;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  try {
    if (type === "document_uploaded") {
      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/admin/documents`;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_USER,
        subject: `New Document Upload — ${clientName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; background: #f0f2f8; padding: 40px 20px;">
            <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              <div style="background: linear-gradient(135deg, #0b1d3a, #1a2f5e); padding: 32px; text-align: center;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #c9a84c, #a07830); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  <span style="color: white; font-weight: bold; font-size: 14px;">AL</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 20px;">New Document Received</h1>
                <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">A-Level Business Consultants Inc — Client Portal</p>
              </div>
              <div style="padding: 32px;">
                <p style="color: #0b1d3a; font-size: 15px; margin-top: 0;">
                  <strong>${clientName}</strong> has uploaded a new document to the portal.
                </p>
                <div style="background: #f8f9fc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a84c;">
                  <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">File Name</p>
                  <p style="margin: 0 0 16px; font-size: 15px; font-weight: 600; color: #0b1d3a;">${fileName}</p>
                  <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Category</p>
                  <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0b1d3a; text-transform: capitalize;">${category?.replace(/_/g, " ") ?? "Other"}</p>
                </div>
                <a href="${portalUrl}" style="display: block; background: #c9a84c; color: #0b1d3a; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; text-decoration: none; margin-top: 24px;">
                  Review Document in Portal →
                </a>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
                  A-Level Business Consultants Inc · Powered by ZarMediaGroup
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
