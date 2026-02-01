"use client"

import React, { useState } from "react"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter, usePathname } from "next/navigation"
import { AuthService } from "@/services/api/auth.service"
import { ISidebarItem, SIDEBAR_ITEMS } from "@/config"
import { Loader2 } from "lucide-react"

interface MobileSidebarProps {
  onClose: () => void
}

export const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const authService = new AuthService()
  const [navigating, setNavigating] = useState<string | null>(null)

  const handleNavigate = (href: string) => {
    setNavigating(href)
    router.push(href)
    onClose()
    // Clear navigating state after a reasonable time
    setTimeout(() => setNavigating(null), 2000)
  }

  const handleLogout = async () => {
    try {
      await authService.userLogout()
      router.push("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Icons.bookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">ExamPrep</span>
      </div>

      <nav className="flex-1 overflow-auto p-2">
        {SIDEBAR_ITEMS.map((item: ISidebarItem) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const isNavigating = navigating === item.href
          return (
            <div key={item.name} className="mb-1">
              <button 
                onClick={() => handleNavigate(item.href)} 
                disabled={isNavigating}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/30 text-left ${
                  isActive ? "bg-primary text-primary-foreground" : ""
                } ${isNavigating ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <div className="relative">
                  <Icon className={`h-4 w-4 ${isNavigating ? "animate-pulse" : ""}`} />
                  {isNavigating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  )}
                </div>
                <span className={isNavigating ? "animate-pulse" : ""}>
                  {isNavigating ? "Loading..." : item.name}
                </span>
              </button>
              {item.subItems && (
                <div className="pl-8 mt-1">
                  {item.subItems.map((s) => {
                    const isSubActive = pathname === s.href || pathname.startsWith(s.href + "/")
                    const isSubNavigating = navigating === s.href
                    return (
                      <button 
                        key={s.name} 
                        onClick={() => handleNavigate(s.href)}
                        disabled={isSubNavigating}
                        className={`block w-full px-2 py-1 rounded-md text-sm hover:bg-accent/40 text-left ${
                          isSubActive ? "text-primary bg-accent" : ""
                        } ${isSubNavigating ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          {isSubNavigating && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          <span className={isSubNavigating ? "animate-pulse" : ""}>
                            {isSubNavigating ? "Loading..." : s.name}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button 
          onClick={() => {
            router.push('/settings')
            onClose()
          }}
          className="w-full text-left px-2 py-2 rounded-md hover:bg-accent/30"
        >
          Settings
        </button>
        <button 
          onClick={() => {
            router.push('/help')
            onClose()
          }}
          className="w-full text-left px-2 py-2 rounded-md hover:bg-accent/30"
        >
          Help & Support
        </button>
        <div className="flex items-center justify-between mt-2">
          <span>Theme</span>
          <ThemeToggle />
        </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left px-2 py-2 rounded-md text-red-600 mt-3 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  )
}