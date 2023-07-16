"use server"

import { users } from "@/db/schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { db } from "@/lib/drizzle"

import { RegisterSchema, registerSchema } from "../schemas/auth-schema"

export const submitRegister = async (values: RegisterSchema) => {
  const { name, email, password } = registerSchema.parse(values)

  const exist = await db.query.users
    .findFirst({
      where: eq(users.email, email),
    })
    .execute()
  if (exist) throw new Error("Email already taken.")
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
  return user
}
