import { FC } from "react"

interface layoutProps {
  children: React.ReactNode
}

const AuthLayout: FC<layoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      {children}
    </main>
  )
}

export default AuthLayout
