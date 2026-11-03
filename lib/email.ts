import 'server-only'

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

/** Sends via Resend. Only ever called after an admin approves a specific message. */
export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [to],
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
      subject,
      text: body,
    }),
  })
  if (!res.ok) throw new Error(`Email send failed (${res.status})`)
}
