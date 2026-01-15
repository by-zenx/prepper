"use client"

import { useSearchParams } from "next/navigation"

import { TabSection } from "@/components/sections"
import { Badge } from "@/components/ui/badge"

import { trpc } from "@/app/_trpc/client"
import { TestPaperOverView, TestPaperQuestions } from "@/app/(protected)/(pages)/test-papers/_components"
import { statusColors } from "@/app/(protected)/(pages)/test-papers/_constants"

interface TestPaperOverViewPageProps {
  params: {
    id: string
  }
}

export default function TestPaperOverViewPage({ params }: TestPaperOverViewPageProps) {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "overview"

  const {
    data: testPaper,
    isLoading,
    error,
  } = trpc.testPaper.getById.useQuery({ id: params.id })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !testPaper) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-semibold">Test Paper Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The test paper doesn’t exist or you don’t have access.
        </p>
      </div>
    )
  }


  const tabs = [
    {
      value: "overview",
      label: "Overview"
    },
    {
      value: "questions",
      label: "Questions"
    },
    {
      value: "analytics",
      label: "Analytics"
    },
    {
      value: "settings",
      label: "Settings"
    },
  ]

  const contents = {
    overview: <TestPaperOverView testPaper={testPaper} />,
    questions: <TestPaperQuestions testPaperId={params.id} />,
    analytics: <div>Analytics</div>,
    settings: <div>Settings</div>,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{testPaper.title}</h1>
          <p className="text-muted-foreground">{testPaper.description || 'No description available'}</p>
        </div>
        <Badge className={statusColors[testPaper.status]}>
          {testPaper.status}
        </Badge>
      </div>

      <TabSection tabs={tabs} basePath={`/test-papers/${params.id}`} contents={contents} defaultTab={initialTab} />
    </div>
  )
}
