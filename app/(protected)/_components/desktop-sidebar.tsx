"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import {
  BookOpen, Settings, HelpCircle, LogOut, Moon, Sun,
  ChevronRight, Menu, Lock, Unlock, Loader2
} from "lucide-react"

import { ISidebarItem, SIDEBAR_ITEMS } from "@/config"
import { useTheme } from "next-themes"


export const SIDEBAR_WIDTH = {
  expanded: 256,
  collapsed: 72,
}

export const DesktopSidebar = () => {
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [navigating, setNavigating] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const shouldExpand = !collapsed || hovering

  const handleNavigate = (href: string) => {
    setNavigating(href)
    router.push(href)
    // Clear navigating state after a reasonable time
    setTimeout(() => setNavigating(null), 2000)
  }

  useEffect(() => {
    const width = shouldExpand
      ? SIDEBAR_WIDTH.expanded
      : SIDEBAR_WIDTH.collapsed

    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${width}px`
    )
  }, [shouldExpand])

  const handleLogout = () => {
    console.log("Logout clicked")
    // Add actual logout logic here
  }

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen bg-background dark:bg-background z-50">
      <motion.aside
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        animate={{ width: shouldExpand ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed }}
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex flex-col bg-card dark:bg-card border-r border-border dark:border-border overflow-hidden shadow-sleek"
      >

        {/* Logo / top */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border dark:border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-card" />
            </div>
            <AnimatePresence>
              {shouldExpand && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-semibold text-foreground tracking-wide"
                >
                  ExamPrep
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {shouldExpand && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-md hover:bg-accent/10 transition-colors"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <AnimatePresence mode="wait">
                  {collapsed ? (
                    <motion.div
                      key="lock"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Unlock className="h-4 w-4 text-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlock"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      >
                      <Lock className="h-4 w-4 text-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-4 px-2 custom-scrollbar">
          {SIDEBAR_ITEMS.map((item, idx) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              expanded={shouldExpand}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
              pathname={pathname}
              delay={idx * 0.03}
              navigating={navigating}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        {/* Bottom area */}
        <div className="p-3 border-t border-border dark:border-border/50 space-y-2">
          <SidebarButton icon={Settings} label="Settings" expanded={shouldExpand} onClick={() => console.log("Settings")} />
          <SidebarButton icon={HelpCircle} label="Help & Support" expanded={shouldExpand} onClick={() => console.log("Help")} />
          <SidebarButton icon={LogOut} label="Logout" expanded={shouldExpand} onClick={handleLogout} />

          <div className="pt-2 border-t border-border/40 dark:border-border/40">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-all group"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <AnimatePresence>
                {shouldExpand && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-foreground font-medium"
                  >
                    {theme === "dark" ? "Light" : "Dark"} Mode
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  )
}

const SidebarNavItem = ({ item, expanded, active, delay, onNavigate, pathname, navigating }: { 
  item: ISidebarItem, 
  expanded: boolean, 
  active: boolean, 
  delay: number, 
  onNavigate: (href: string) => void, 
  pathname: string,
  navigating: string | null
}) => {
  const [open, setOpen] = useState(false)
  const Icon = item.icon
  const isNavigating = navigating === item.href

  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="mb-1">
      <button
        onClick={() => (item.subItems ? setOpen(!open) : onNavigate(item.href))}
        disabled={isNavigating}
        className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden ${
          active
            ? "bg-primary text-background shadow-sm"
            : "hover:bg-accent text-foreground"
        } ${isNavigating ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <div className="relative">
          <Icon className={`h-5 w-5 flex-shrink-0 relative z-10 ${isNavigating ? "animate-pulse" : ""}`} />
          {isNavigating && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Loader2 className="h-3 w-3 animate-spin" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-medium truncate relative z-10"
            >
              {isNavigating ? "Loading..." : item.name}
            </motion.span>
          )}
        </AnimatePresence>
        {item.subItems && expanded && (
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="ml-auto relative z-10">
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {item.subItems && open && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-11 pr-2 pt-1 pb-1 space-y-1">
              {item.subItems.map((s: any) => {
                const isSubNavigating = navigating === s.href
                return (
                  <button
                    key={s.name}
                    onClick={() => onNavigate(s.href)}
                    disabled={isSubNavigating}
                    className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-all relative
                      ${pathname === s.href || pathname.startsWith(s.href + "/")
                        ? "text-primary bg-accent"
                        : "text-foreground/70 hover:text-primary hover:bg-accent"
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SidebarButton = ({ icon: Icon, label, expanded, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-transparent hover:bg-accent transition-all group"
    >
      <Icon className="h-4 w-4 text-foreground flex-shrink-0" />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-foreground font-medium truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
