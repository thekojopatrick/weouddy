interface ProgressBarProps {
  current: number
  total: number
  estimatedTime: string
}

export function ProgressBar({ current, total, estimatedTime }: ProgressBarProps) {
  const progress = (current / total) * 100

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 max-w-md mx-auto">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Upload progress</span>
        <div className="flex gap-4">
          <span className="text-sm text-muted-foreground">{current}/{total}</span>
          <span className="text-sm text-muted-foreground">estimate: {estimatedTime}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-gray-700 to-gray-900 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

