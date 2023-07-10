import { type FC } from "react"

import { SiteHeader } from "@/components/site-header"

type Props = {
  children: React.ReactNode
}

const SiteLayout: FC<Props> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SiteLayout
