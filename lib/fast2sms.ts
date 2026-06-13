export async function sendOTPviaSMS(mobile: string, otp: string): Promise<boolean> {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY?.replace(/['"]/g, '')
    if (!apiKey || apiKey === "fast2smskeymock12345" || apiKey.startsWith("fast2smskeymock")) {
      console.log('===========================================')
      console.log(`[MOCK SMS] OTP for ${mobile}: ${otp}`)
      console.log('===========================================')
      return true
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: mobile,
        flash: 0
      })
    })

    const data = await response.json()
    console.log('SMS API Response:', JSON.stringify(data))
    return data.return === true

  } catch (err) {
    console.error('SMS send failed:', err)
    return false
  }
}

// Backward compatibility wrapper for other routes that use sendSMS
export async function sendSMS(mobile: string, otpCode: string): Promise<boolean> {
  return sendOTPviaSMS(mobile, otpCode)
}
