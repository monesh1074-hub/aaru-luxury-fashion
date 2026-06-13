import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      )
    }

    // Convert file to buffer and then to base64 Data URI
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const result = await uploadToCloudinary(buffer, file.type, "aaru-products")

    return NextResponse.json({
      success: true,
      url: result.url
    })
  } catch (error: any) {
    console.error("Upload route error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

