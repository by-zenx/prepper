"use client"

import { useState, createContext, useContext } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { useHeader } from "@/app/(protected)/_contexts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Context to share top header state
const TopHeaderContext = createContext<{
  isVisible: boolean
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}>({
  isVisible: false,
  isCollapsed: false,
  setIsCollapsed: () => {}
})

export const useTopHeader = () => useContext(TopHeaderContext)

export const TopHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const { breadcrumbs, backButton } = useHeader()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if header should be visible
  const isVisible = backButton?.show || breadcrumbs.length > 0

  return (
    <TopHeaderContext.Provider value={{ isVisible, isCollapsed, setIsCollapsed }}>
      {children}
    </TopHeaderContext.Provider>
  )
}

export const TopHeader = () => {
  const { breadcrumbs, backButton } = useHeader()
  const { isCollapsed, setIsCollapsed } = useTopHeader()

  // Check if header should be visible
  const isVisible = backButton?.show || breadcrumbs.length > 0

  // If nothing to show → render nothing (important)
  if (!isVisible) {
    return null
  }

  return (
    <div className="relative">
      {/* Collapse/Expand Button - Fixed Position Outside Container */}
      <div className="absolute top-0 right-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-0 bg-card border border-t-0 ${isCollapsed ? "border-border rounded-t-none h-6 w-6" : "border-l rounded-none h-9 w-6"}`}
          aria-label={isCollapsed ? "Expand header" : "Collapse header"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Header Content - Collapsible */}
      <div
        className={cn(
          "transition-transform duration-300 ease-in-out",
          isCollapsed && "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b px-6 py-2 bg-card">
          {/* Back Button */}
          {backButton?.show && backButton.href && (
            <Link
              href={backButton.href}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          )}

          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className={cn(
                "flex items-center text-sm text-muted-foreground",
                backButton?.show
              )}
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                  <span key={item.href} className="flex items-center">
                    {!isLast ? (
                      <Link
                        href={item.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                    )}

                    {!isLast && (
                      <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/60" />
                    )}
                  </span>
                )
              })}
              {/* Spacer to make room for button */}
              <div className="w-8" />
            </nav>
          )}

          {/* Spacer to make room for button when no breadcrumb */}
          {!backButton?.show && breadcrumbs.length === 0 && <div className="w-8" />}
        </div>
      </div>
    </div>
  )
}
