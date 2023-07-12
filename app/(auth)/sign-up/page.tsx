import { type FC } from "react"

import { AuthForm } from "../components/auth-form"

type Props = {}

const SignUpPage: FC<Props> = ({}) => {
  return <AuthForm variant="register" />
}

export default SignUpPage
