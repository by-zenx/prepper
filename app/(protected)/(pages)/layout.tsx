"use client"

import React, { useState } from "react"
import { DesktopSidebar, DesktopNavbar, MobileNavbar, TopHeader, TopHeaderProvider } from "@/app/(protected)/_components"
import { HeaderProvider } from "@/app/(protected)/_contexts"
import { useTopHeader } from "@/app/(protected)/_components/top-header"

interface LayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isVisible: topHeaderVisible, isCollapsed: topHeaderCollapsed } = useTopHeader()

  // Calculate padding based on top header presence and state
  const getTopPadding = () => {
    if (!topHeaderVisible) {
      // No top header - just account for navbar
      console.log("No top header");
      return "pt-8"
    }
    
    if (topHeaderCollapsed) {
      // Top header collapsed - just account for navbar + button height
      console.log("Top header collapsed");
      return "pt-8"
    }
    
    // Top header expanded - account for navbar + full header height
    console.log("Top header expanded");
    return "pt-12"
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      <div
        className="flex-1 flex flex-col transition-[margin-left] duration-300 ease-out md:ml-[var(--sidebar-width)]"
      >
        {/* Mobile Navbar - shown only on mobile, fixed */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30">
          <MobileNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Desktop Navbar - hidden on mobile, fixed */}
        <div className="hidden md:block fixed top-0 left-0 right-0 z-30 md:left-[var(--sidebar-width)]">
          <DesktopNavbar />
        </div>

        {/* Mobile spacer for fixed navbar */}
        <div className="md:hidden h-14 sm:h-16"></div>

        {/* Desktop spacer for fixed navbar */}
        <div className="hidden md:block h-14 sm:h-16"></div>

        <div className="w-full md:w-[calc(100%-var(--sidebar-width))] fixed top-14 sm:top-16 md:top-16 z-20" >
          <TopHeader />
        </div>
        <main className={`flex-1 p-6 pb-safe transition-all duration-600 ease-in-out ${getTopPadding()}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function Layout({ children }: LayoutProps) {
  return (
    <HeaderProvider>
      <TopHeaderProvider>
        <LayoutContent>{children}</LayoutContent>
      </TopHeaderProvider>
    </HeaderProvider>
  )
}