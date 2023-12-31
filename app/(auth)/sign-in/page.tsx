import { type FC } from "react"

import { AuthForm } from "../components/auth-form"

type Props = {}

const SignInPage: FC<Props> = ({}) => {
  return <AuthForm variant="login" />
}

export default SignInPage
