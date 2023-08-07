"use client"

import { forwardRef, useRef } from "react"
import { useRouter } from "next/navigation"
import { mergeRefs } from "@/utils/merge-ref"

import { useIntersectionObserver } from "@/hooks/useInterSection"

type Props = Omit<React.ComponentProps<"a">, "ref"> & {
  href: string
  prefetch?: boolean
  prerender?: boolean
}

const DynamicLink = forwardRef<HTMLAnchorElement, Props>(
  ({ href, children, prefetch, prerender, ...props }, ref) => {
    const linkRef = useRef<HTMLAnchorElement>(null)
    const entry = useIntersectionObserver(linkRef, { freezeOnceVisible: true })
    const router = useRouter()
    const isPrefetchTimeout = useRef(false)
    const prefetchTimeout = setTimeout(() => {
      isPrefetchTimeout.current = true
    }, 1000 * 24)
    if (prefetch && entry?.isIntersecting) {
      setTimeout(() => router.prefetch(href), 300)
    }
    return (
      <a
        {...props}
        ref={mergeRefs(linkRef, ref)}
        href={href}
        onClick={(e) => {
          e.preventDefault()
          router.push(href)
          if (isPrefetchTimeout.current) {
            prerender ? router.refresh() : setTimeout(() => router.refresh(), 100)
            clearTimeout(prefetchTimeout)
          }
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
