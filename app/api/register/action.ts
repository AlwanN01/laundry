import { axi } from "@/utils/axios"
import { User } from "@prisma/client"

import { RegisterSchema } from "@/app/(auth)/schemas/auth-schema"

export const auth = {
  register: (data: RegisterSchema) => axi.post<User>("/api/register", data),
}
