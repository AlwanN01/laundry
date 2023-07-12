import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().nonempty(),
  password: z.string().nonempty(),
})
export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = registerSchema.omit({ name: true })
export type LoginSchema = z.infer<typeof loginSchema>
