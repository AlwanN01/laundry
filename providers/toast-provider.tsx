"use client"

import { type FC } from "react"
import { Toaster } from "react-hot-toast"

type Props = {}

const ToastProvider: FC<Props> = ({}) => {
  return (
    <Toaster
      toastOptions={{
        style: {
          border: "3px solid hsl(var(--border))",
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
        },
      }}
    />
  )
}

export { ToastProvider }
