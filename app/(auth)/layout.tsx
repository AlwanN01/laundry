import { FC } from "react"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import DynamicLink from "@/components/ui/dynamic-link"

interface layoutProps {
  children: React.ReactNode
}

const AuthLayout: FC<layoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <Button
        asChild
        className="fixed left-5 top-5 scale-100 md:scale-150"
        variant="outline"
        size="icon"
      >
        <DynamicLink href="/" prefetch>
          <ArrowLeftIcon className="opacity-75" />
        </DynamicLink>
      </Button>
      {children}
    </main>
  )
}

export default AuthLayout
