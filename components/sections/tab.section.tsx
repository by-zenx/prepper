"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabConfig {
  value: string
  label: string
}

interface TabSectionProps {
  tabs: TabConfig[]
  basePath: string
  contents: Record<string, React.ReactNode>
  defaultTab?: string
}

export function TabSection({
  tabs,
  basePath,
  contents,
  defaultTab = tabs[0]?.value,
}: TabSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tabFromUrl = searchParams.get("tab") || defaultTab
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [isAnimating, setIsAnimating] = useState(false)

  /** Ensure tab exists in URL */
  useEffect(() => {
    if (!searchParams.get("tab")) {
      router.replace(`${basePath}?tab=${defaultTab}`, { scroll: false })
    }
  }, [router, searchParams, basePath, defaultTab])

  /** Sync state ← URL */
  useEffect(() => {
    const currentTab = searchParams.get("tab") || defaultTab
    if (currentTab !== activeTab) {
      setActiveTab(currentTab)
    }
  }, [searchParams, activeTab, defaultTab])

  const handleTabChange = (value: string) => {
    if (value === activeTab || isAnimating) return

    setIsAnimating(true)
    setTimeout(() => {
      setActiveTab(value)
      router.push(`${basePath}?tab=${value}`, { scroll: false })
      setTimeout(() => setIsAnimating(false), 50)
    }, 150)
  }

  const activeIndex = tabs.findIndex(t => t.value === activeTab)
  const indicatorWidth = 100 / tabs.length

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid relative" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {/* Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-200 ease-in-out"
          style={{
            left: `${activeIndex * indicatorWidth}%`,
            width: `${indicatorWidth}%`,
          }}
        />

        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative transition-all duration-200 hover:bg-muted/50
              data-[state=active]:text-primary
              data-[state=active]:font-medium"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === tab.value && !isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {contents[tab.value]}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
