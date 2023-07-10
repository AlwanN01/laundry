import { getServerSession } from "next-auth"

import { nextAuthOptions } from "@/config/next-auth"

export const session = () =>
  getServerSession(nextAuthOptions).then((data) => data?.user)
