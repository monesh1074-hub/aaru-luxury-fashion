import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
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
    const fromUser = process.env.EMAIL_SERVER_USER
    if (!fromUser || !process.env.EMAIL_SERVER_PASSWORD) {
      console.warn('[Nodemailer] EMAIL_SERVER_USER or EMAIL_SERVER_PASSWORD not configured')
      return false
    }
    console.log(`[Nodemailer] Sending email to ${to} | Subject: ${subject}`)

    const info = await transporter.sendMail({
      from: `"AARU Luxury Fashion" <${fromUser}>`,
      to,
      subject,
      html,
    })

    console.log(`[Nodemailer] Email sent successfully: ${info.messageId}`)
    return true
  } catch (error) {
    console.error('[Nodemailer] Exception while sending email:', error)
    return false
  }
}
