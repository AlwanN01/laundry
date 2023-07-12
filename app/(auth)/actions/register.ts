"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

import { RegisterSchema, registerSchema } from "../schemas/auth-schema"

export const submitRegister = async (values: RegisterSchema) => {
  const { name, email, password } = registerSchema.parse(values)
  const exist = await prisma.user.findUnique({ where: { email } })
  if (exist) throw new Error("Email already taken.")
  const hashedPassword = bcrypt.hashSync(password, 10)
  const user = await prisma.user.create({
    data: { name, email, hashedPassword, emailVerified: new Date() },
  })
  return user
}
