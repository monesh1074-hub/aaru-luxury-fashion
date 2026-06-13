import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    })

    // Set cookie expiry date in the past to delete it
    response.cookies.set({
      name: "aaru_auth_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      expires: new Date(0)
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
