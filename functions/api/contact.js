// Cloudflare Pages Function — POST /api/contact
// Replaces the old Next.js nodemailer/SMTP route (SMTP can't run on Workers).
// Sends the inquiry via the Resend HTTP API. Same request/response shape as
// before, so ContactForm.tsx / ContactModal.tsx keep working unchanged.
//
// Required env vars (set in Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY   (required)  e.g. re_xxx
//   CONTACT_TO       (optional)  default: sudonexofficial@gmail.com
//   CONTACT_FROM     (optional)  default: "Sudonex Contact <onboarding@resend.dev>"
//                                once sudonex.com is verified in Resend, set to
//                                e.g. "Sudonex <noreply@sudonex.com>"

// Best-effort in-memory rate limit (per warm isolate).
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function esc(s) {
  return String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { name, email, company, jurisdiction, budget, message } = body;

    // Honeypot: real users never fill this hidden field. Bots do.
    const honeypot = body.company_website || body.website || '';
    if (honeypot) {
      return json({ success: true, message: 'Inquiry sent successfully!' });
    }

    if (!name || !email || !message) {
      return json({ error: 'Name, email, and message are required.' }, 400);
    }

    const ip =
      (request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '')
        .split(',')[0]
        .trim() || 'unknown';
    if (isRateLimited(ip)) {
      return json({ error: 'Too many submissions. Please try again in a few minutes.' }, 429);
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      // Fail LOUD instead of silently losing the lead.
      console.error('RESEND_API_KEY missing — cannot send inquiry.');
      return json(
        { error: 'We could not send your inquiry right now. Please email sudonexofficial@gmail.com directly.' },
        500,
      );
    }

    const to = env.CONTACT_TO || 'sudonexofficial@gmail.com';
    const from = env.CONTACT_FROM || 'Sudonex Contact <onboarding@resend.dev>';

    const text =
      `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n` +
      `Jurisdiction: ${jurisdiction || 'N/A'}\nBudget: ${budget || 'N/A'}\n\nMessage:\n${message}\n`;

    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #FF6600; border-bottom: 2px solid #FF6600; padding-bottom: 8px;">New Sudonex Project Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding:6px 0;font-weight:bold;width:120px;">Name:</td><td style="padding:6px 0;">${esc(name)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Email:</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Company:</td><td style="padding:6px 0;">${esc(company) || 'N/A'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Jurisdiction:</td><td style="padding:6px 0;">${esc(jurisdiction) || 'N/A'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Budget:</td><td style="padding:6px 0;">${esc(budget) || 'N/A'}</td></tr>
        </table>
        <h3 style="color:#FF8533;margin-top:20px;border-bottom:1px solid #eee;padding-bottom:4px;">Message</h3>
        <p style="white-space:pre-wrap;line-height:1.6;color:#555;">${esc(message)}</p>
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New iGaming Project Inquiry from ${name}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend send failed:', res.status, detail);
      return json(
        { error: 'We could not send your inquiry right now. Please email sudonexofficial@gmail.com directly.' },
        502,
      );
    }

    return json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return json({ error: 'Failed to send inquiry.' }, 500);
  }
}

// Reject non-POST methods cleanly.
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  }
  return onRequestPost(context);
}
