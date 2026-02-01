"use client"

import React, { useState } from "react"
import { DesktopSidebar, DesktopNavbar, MobileNavbar, TopHeader } from "@/app/(protected)/_components"
import { HeaderProvider } from "@/app/(protected)/_contexts"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      <div
        className="flex-1 flex flex-col transition-[margin-left] duration-300 ease-out md:ml-[var(--sidebar-width)]"
      >
        {/* Mobile Navbar - shown only on mobile */}
        <div className="md:hidden">
          <MobileNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Desktop Navbar - hidden on mobile */}
        <div className="hidden md:block">
          <DesktopNavbar />
        </div>

        <HeaderProvider>
          <div className="w-full md:w-[calc(100%-var(--sidebar-width))] fixed top-16 md:top-16 z-10" >
            <TopHeader />
          </div>
          <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:pt-12 pb-safe">
            {children}
          </main>
        </HeaderProvider>
      </div>
    </div>
  )
}