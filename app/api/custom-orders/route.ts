import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const customOrders = await prisma.customOrder.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(customOrders)
  } catch (error) {
    console.error("Custom orders GET error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()

    const {
      name,
      email,
      phone,
      occasion,
      garmentType,
      fabricPreference,
      colorPreference,
      measurements,
      referenceImageUrls,
      notes
    } = await req.json()

    if (!name || !email || !phone || !occasion || !garmentType || !measurements) {
      return NextResponse.json(
        { message: "Missing required tailoring inquiry details" },
        { status: 400 }
      )
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        userId: user?.id || null,
        name,
        email,
        phone,
        occasion,
        garmentType,
        fabricPreference: fabricPreference || null,
        colorPreference: colorPreference || null,
        measurements,
        referenceImageUrls: referenceImageUrls || [],
        notes: notes || null,
        status: "PENDING"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Custom clothing inquiry submitted successfully. Our designer will contact you soon.",
      customOrder
    }, { status: 201 })
  } catch (error) {
    console.error("Custom order POST error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 })
    }

    const { id, status, notes } = await req.json()

    if (!id || !status) {
      return NextResponse.json(
        { message: "Custom Order ID and status are required" },
        { status: 400 }
      )
    }

    const updatedCustomOrder = await prisma.customOrder.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : undefined
      }
    })

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      customOrder: updatedCustomOrder
    })
  } catch (error) {
    console.error("Custom order PUT error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
