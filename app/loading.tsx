import { LoadingSpinner } from "../components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
