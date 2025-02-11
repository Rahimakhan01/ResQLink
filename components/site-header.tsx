import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LifeBuoy } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <LifeBuoy className="h-6 w-6" />
          <span className="font-bold">ResQLink</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <MainNav />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}