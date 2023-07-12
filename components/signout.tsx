"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

import { Button } from "./ui/button"

type Props = {}

const Signout: FC<Props> = ({}) => {
  const router = useRouter()
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => {
        signOut({ redirect: false })
        router.push("/")
        setTimeout(() => router.refresh(), 100)
      }}
    >
      Logout
    </Button>
  )
}

export { Signout }
