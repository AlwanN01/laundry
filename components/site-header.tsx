import Link from "next/link"

import { siteConfig } from "@/config/site"
import { session } from "@/lib/session"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

import { Signout } from "./signout"
import DynamicLink from "./ui/dynamic-link"

export async function SiteHeader() {
  const user = await session()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
            <div className="flex space-x-3">
              {user ? (
                <Signout />
              ) : (
                <>
                  <DynamicLink
                    href="/sign-in"
                    prefetch
                    className={buttonVariants({ variant: "default", size: "sm" })}
                  >
                    Sign In
                  </DynamicLink>
                  <DynamicLink
                    href="/sign-up"
                    prefetch
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    Sign Up
                  </DynamicLink>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
