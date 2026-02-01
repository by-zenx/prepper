"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, BarChart3, Eye } from "lucide-react"
import { trpc } from "@/app/_trpc/client"

interface TestPaperQuestionsProps {
  testPaperId: string
}

type QuestionOption = {
  key: string   // "A", "B", "C", "D"
  value: string // "27", "2109", etc
}

export function TestPaperQuestions({ testPaperId }: TestPaperQuestionsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [reviewFilter, setReviewFilter] = useState<string>("all")
  const [showAnalytics, setShowAnalytics] = useState(false)

  const {
    data: response,
    isLoading,
    error,
  } = trpc.testPaper.getQuestions.useQuery({ 
    testPaperId,
    page: currentPage,
    limit: 5,
    search: searchTerm || undefined,
    statusFilter: statusFilter !== "all" ? statusFilter : undefined,
    reviewFilter: reviewFilter !== "all" ? reviewFilter : undefined,
  })

  const questions = response?.questions || []
  const pagination = response?.pagination

  // Reset pagination when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-destructive">Error Loading Questions</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error.message || "Failed to load questions. Please try again."}
        </p>
      </div>
    )
  }

  if (questions.length === 0 && !pagination?.totalCount) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">No Questions Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This test paper doesn't have any parsed questions yet.
        </p>
      </div>
    )
  }

  // Analytics data based on current page results
  const analytics = {
    total: pagination?.totalCount || 0,
    approved: questions.filter(q => q.reviewStatus === "approved").length,
    pending: questions.filter(q => q.reviewStatus === "pending").length,
    rejected: questions.filter(q => q.reviewStatus === "rejected").length,
    needsReview: questions.filter(q => q.needReview).length,
    avgConfidence: questions.reduce((sum, q) => sum + (q.detectedAnswerConfidence || 0), 0) / questions.length || 0,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: number | null | undefined) => {
    if (!confidence) return "text-gray-600"
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  console.log("questions", questions)

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value)
            handleFilterChange()
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reviewFilter} onValueChange={(value) => {
            setReviewFilter(value)
            handleFilterChange()
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Review" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Review</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
              <SelectItem value="no_review_needed">No Review Needed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showAnalytics ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showAnalytics ? "Hide" : "Show"} Analytics
          </Button>
        </div>
      </div>

      {/* Quick Analytics View */}
      {showAnalytics && (
        <div className="grid gap-4 md:grid-cols-5 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{analytics.total}</div>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{analytics.approved}</div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{analytics.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{analytics.needsReview}</div>
              <p className="text-sm text-muted-foreground">Needs Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{Math.round(analytics.avgConfidence * 100)}%</div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {questions.length} of {pagination?.totalCount || 0} questions
          {searchTerm || statusFilter !== "all" || reviewFilter !== "all" ? " (filtered)" : ""}
        </span>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>5 per page</span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question: any, index: number) => (
          <Card 
            key={question.parsedQuestionsId}
            className={`cursor-pointer transition-all hover:shadow-md ${selectedQuestion === question.parsedQuestionsId ? "ring-2 ring-primary" : ""
              }`}
            onClick={() => setSelectedQuestion(
              selectedQuestion === question.parsedQuestionsId ? null : question.parsedQuestionsId
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Q{((pagination?.currentPage || 1) - 1) * 5 + index + 1}
                  </span>
                  <Badge variant="outline">
                    Page {question.pageNumber || 'N/A'}
                  </Badge>
                  <Badge className={getStatusColor(question.reviewStatus || 'pending')}>
                    {question.reviewStatus || 'pending'}
                  </Badge>
                  {question.needReview && (
                    <Badge variant="destructive">Needs Review</Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(question.detectedAnswerConfidence || 0)}`}>
                    {Math.round((question.detectedAnswerConfidence || 0) * 100)}% Confidence
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="font-medium">{question.questionText || 'No question text available'}</p>

                {Array.isArray(question.options) && (
                  <div className="space-y-2">
                    {question.options.map((option: QuestionOption) => {
                      const isDetectedAnswer = question.detectedAnswer === option.key

                      return (
                        <div
                          key={option.key}
                          className={`p-2 rounded border ${isDetectedAnswer
                              ? "bg-[var(--custom-green)] border-[var(--custom-green)]"
                              : "bg-muted border-muted"
                            }`}
                        >
                          <span className="text-sm">
                            <strong>{option.key}.</strong> {option.value}
                          </span>

                          {isDetectedAnswer && (
                            <Badge variant="secondary" className="ml-2">
                              Detected Answer
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                  <span>Sequence: {question.sequenceInDoc}</span>
                  <span>Parse Confidence: {Math.round((question.parseConfidence || 0) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(i + 1)}
                className="w-8 h-8 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
