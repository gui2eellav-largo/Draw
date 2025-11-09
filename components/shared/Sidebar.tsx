"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Upload, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Upload",
    icon: Upload,
    href: "/upload",
  },
  {
    label: "Exercices",
    icon: Target,
    href: "/exercises",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-muted/10">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
