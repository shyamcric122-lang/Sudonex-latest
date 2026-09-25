import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Best-effort in-memory rate limit (per warm serverless instance).
const RATE_LIMIT = 3; // submissions
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, jurisdiction, budget, message } = body;
    // Honeypot: real users never fill this hidden field. Bots do.
    const honeypot = body.company_website || body.website || '';

    if (honeypot) {
      // Silently accept and drop — don't tip off the bot.
      return NextResponse.json({ success: true, message: 'Inquiry sent successfully!' });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const ip =
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in a few minutes.' },
        { status: 429 },
      );
    }

    const host = process.env.SMTP_HOST || '';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    const mailOptions = {
      from: `Sudonex Contact Form <${user || 'hello@sudonex.com'}>`,
      to: 'sudonexofficial@gmail.com',
      subject: `New iGaming Project Inquiry from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Jurisdiction: ${jurisdiction || 'N/A'}
Budget: ${budget || 'N/A'}

Message:
${message}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #FF6600; border-bottom: 2px solid #FF6600; padding-bottom: 8px;">New Sudonex Project Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 6px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Company:</td>
              <td style="padding: 6px 0;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Jurisdiction:</td>
              <td style="padding: 6px 0;">${jurisdiction || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Budget:</td>
              <td style="padding: 6px 0;">${budget || 'N/A'}</td>
            </tr>
          </table>
          <h3 style="color: #FF8533; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">${message}</p>
        </div>
      `,
    };

    if (!host || !user || !pass) {
      // Fail LOUD instead of faking success and silently losing the lead.
      console.error('SMTP env vars missing — cannot send inquiry. Set SMTP_HOST/SMTP_USER/SMTP_PASS.');
      return NextResponse.json(
        { error: 'We could not send your inquiry right now. Please email sudonexofficial@gmail.com directly.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via SMTP.');

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send inquiry.' }, { status: 500 });
  }
}
