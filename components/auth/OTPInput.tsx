import React, { useRef, useState } from "react"

interface OTPInputProps {
  onComplete: (otp: string) => void
  length?: number
}

export const OTPInput: React.FC<OTPInputProps> = ({ onComplete, length = 6 }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<HTMLInputElement[]>([])

  const handleChange = (value: string, index: number) => {
    const char = value.slice(-1)
    if (char && !/^\d+$/.test(char)) return

    const newOtp = [...otp]
    newOtp[index] = char
    setOtp(newOtp)

    const combined = newOtp.join("")
    if (combined.length === length) {
      onComplete(combined)
    }

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp]
      if (!newOtp[index] && index > 0) {
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        newOtp[index] = ""
        setOtp(newOtp)
      }
      onComplete(newOtp.join(""))
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    const chars = pastedData.split("")
    const newOtp = [...otp]
    for (let i = 0; i < length; i++) {
      newOtp[i] = chars[i] || ""
    }
    setOtp(newOtp)
    onComplete(newOtp.join(""))

    const focusIndex = Math.min(chars.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex justify-between items-center gap-2 max-w-sm mx-auto my-6 font-body">
      {otp.map((char, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={char}
          ref={(el) => {
            if (el) inputRefs.current[index] = el
          }}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 md:w-14 md:h-14 border border-border bg-white text-center text-lg font-bold text-dark focus:outline-none focus:border-gold transition-colors duration-200"
        />
      ))}
    </div>
  )
}
