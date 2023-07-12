"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { trySubmit } from "@/utils/try-catch"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { submitRegister } from "../actions/register"
import { LoginSchema, RegisterSchema, loginSchema, registerSchema } from "../schemas/auth-schema"

type Props = {
  variant: "register" | "login"
}

const AuthForm: FC<Props> = ({ variant }) => {
  const router = useRouter()
  const form = useForm<RegisterSchema | LoginSchema>({
    resolver: zodResolver(variant == "register" ? registerSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
  })
  const onSubmit = trySubmit(
    async (values) => {
      if (variant == "register") {
        // const user = await api.auth.register(values) // client action
        const user = await submitRegister(values as RegisterSchema) // server action
        router.push("/sign-in")
      } else {
        const res = await signIn("credentials", { ...(values as LoginSchema), redirect: false })
        if (res?.error) throw new Error(res.error)
        router.push("/")
        setTimeout(() => router.refresh(), 100)
      }
    },
    { success: variant == "register" ? "Success Registered" : "Login Success" }
  )

  return (
    <div className="w-full rounded-lg border-2 shadow sm:max-w-md md:mt-0 xl:p-0">
      <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight md:text-2xl">
          {variant == "register" ? "Sign up" : "Sign in"}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {variant == "register" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex justify-between">
                      <span>Password</span>
                      {variant == "login" && (
                        <span className="text-muted-foreground hover:underline">
                          Forgot Password?
                        </span>
                      )}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
            {variant == "login" && (
              <p className="text-sm font-light text-muted-foreground">
                Don’t have an account yet?{" "}
                <a href="#" className="font-medium hover:underline">
                  Sign up
                </a>
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export { AuthForm }
