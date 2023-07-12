import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/app/(auth)/schemas/auth-schema"

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)
    const exist = await prisma.user.findUnique({ where: { email } })
    if (exist) return new NextResponse("Email already taken", { status: 422 })
    const hashedPassword = bcrypt.hashSync(password, 10)
    const user = await prisma.user.create({
      data: { name, email, hashedPassword, emailVerified: new Date() },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.log("[REGISTER_POST]", error)
    if (error instanceof z.ZodError) return new NextResponse("Invalid Form Data", { status: 400 })
    else return new NextResponse("internal Error", { status: 500 })
  }
}
