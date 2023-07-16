import { NextRequest, NextResponse } from "next/server"
import { users } from "@/db/schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/drizzle"
import { registerSchema } from "@/app/(auth)/schemas/auth-schema"

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)
    const exist = await db.query.users
      .findFirst({
        where: eq(users.email, email),
      })
      .execute()
    if (exist) return new NextResponse("Email already taken", { status: 422 })
    const hashedPassword = bcrypt.hashSync(password, 10)
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        hashedPassword,
        emailVerified: new Date(),
      })
      .returning()
      .execute()
    return NextResponse.json(user)
  } catch (error) {
    console.log("[REGISTER_POST]", error)
    if (error instanceof z.ZodError) return new NextResponse("Invalid Form Data", { status: 400 })
    else return new NextResponse("internal Error", { status: 500 })
  }
}
