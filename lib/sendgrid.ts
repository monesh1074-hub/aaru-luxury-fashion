/**
 * Email utility using SendGrid HTTP API (no extra package needed).
 * Works reliably on Vercel/production - avoids SMTP port blocking issues.
 * Falls back to console mock if SENDGRID_API_KEY is not set.
 */

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  try {
    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.EMAIL_FROM || "kamaleshmonesh908@gmail.com"

    // No API key → mock log (useful in local dev)
    if (!apiKey || apiKey === "your_sendgrid_api_key_here") {
      console.log("=========================================")
      console.log(`[MOCK EMAIL] To: ${to}`)
      console.log(`[MOCK EMAIL] Subject: ${subject}`)
      console.log("=========================================")
      return true
    }

    console.log(`[SendGrid] Sending email to ${to} | Subject: ${subject}`)

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: "AARU Luxury Fashion" },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    })

    if (response.ok || response.status === 202) {
      console.log(`[SendGrid] Email sent successfully to ${to}`)
      return true
    }

    // Log the error body from SendGrid for debugging
    const errorBody = await response.text()
    console.error(
      `[SendGrid] Failed to send email. Status: ${response.status}, Body: ${errorBody}`
    )
    return false
  } catch (error) {
    console.error("[SendGrid] Exception while sending email:", error)
    return false
  }
}
