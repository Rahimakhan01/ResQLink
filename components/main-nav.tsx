"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Button
        variant="ghost"
        asChild
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" && "text-primary"
        )}
      >
        <Link href="/">Home</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/disasters" && "text-primary"
        )}
      >
        <Link href="/disasters">Disaster Reports</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/volunteer" && "text-primary"
        )}
      >
        <Link href="/volunteer">Volunteer</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/report" && "text-primary"
        )}
      >
        <Link href="/report">Report Emergency</Link>
      </Button>
    </nav>
  )
}