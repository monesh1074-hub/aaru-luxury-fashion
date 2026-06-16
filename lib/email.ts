import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'kamaleshmonesh908@gmail.com',
    pass: process.env.EMAIL_SERVER_PASSWORD || 'olto xenz qzlu dqde',
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
    const fromUser = process.env.EMAIL_SERVER_USER || 'kamaleshmonesh908@gmail.com'
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
