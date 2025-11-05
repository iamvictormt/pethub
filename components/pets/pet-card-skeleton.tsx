import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PetCardSkeleton() {
  return (
    <Card className="relative h-full overflow-hidden border-0 bg-card shadow-md pt-0">
      {/* Image Skeleton - responsive aspect ratio matching PetCard */}
      <Skeleton className="aspect-[4/3] md:aspect-[3/4] w-full" />

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Pet Name - Mobile only */}
        <Skeleton className="md:hidden h-6 w-3/4" />

        {/* Pet Characteristics Badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <Skeleton className="h-4 flex-1" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </Card>
  );
}
