"use client"

import { type FC } from "react"
import { useSession } from "next-auth/react"

type Props = {}

const UserExample: FC<Props> = ({}) => {
  const { data: session, status } = useSession()
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}

export { UserExample }
