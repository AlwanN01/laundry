"use client"

import { forwardRef, useRef } from "react"
import { useRouter } from "next/navigation"
import { mergeRefs } from "@/utils/merge-ref"

import { useIntersectionObserver } from "@/hooks/useInterSection"

type Props = Omit2<React.ComponentProps<"a">, "ref"> & { href: string; prefetch?: boolean }

const DynamicLink = forwardRef<HTMLAnchorElement, Props>(
  ({ href, children, prefetch, ...props }, ref) => {
    const linkRef = useRef<HTMLAnchorElement>(null)
    const entry = useIntersectionObserver(linkRef, { freezeOnceVisible: true })
    const router = useRouter()
    if (prefetch && entry?.isIntersecting) setTimeout(() => router.prefetch(href), 300)
    return (
      <a
        {...props}
        ref={mergeRefs(linkRef, ref)}
        href={href}
        onClick={(e) => {
          e.preventDefault()
          router.push(href)
          setTimeout(() => router.refresh(), 100)
        }}
        onMouseOver={(e) => {
          e.preventDefault()
          router.prefetch(href)
        }}
      >
        {children}
      </a>
    )
  }
)

DynamicLink.displayName = "Dynamic Link"
export default DynamicLink
