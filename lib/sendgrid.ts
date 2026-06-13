import * as nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.sendgrid.net",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  auth: {
    user: process.env.EMAIL_SERVER_USER || "apikey",
    pass: process.env.EMAIL_SERVER_PASSWORD || "smtp_password_mock",
  },
})

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
    if (
      !process.env.EMAIL_SERVER_PASSWORD ||
      process.env.EMAIL_SERVER_PASSWORD === "smtp_password_mock"
    ) {
      console.log(`[MOCK EMAIL SENT] To: ${to} | Subject: ${subject}`)
      return true
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "info@aaru.com",
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error("Failed to send transactional email:", error)
    return false
  }
}
