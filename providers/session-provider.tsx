"use client"

import { type FC } from "react"
import { SessionProvider as SessionProvider_ } from "next-auth/react"

type Props = {
  children: React.ReactNode
}

const SessionProvider: FC<Props> = ({ children }) => {
  return <SessionProvider_>{children}</SessionProvider_>
}

export { SessionProvider }
