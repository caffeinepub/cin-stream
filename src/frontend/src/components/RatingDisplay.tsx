import { useGetTitleRatings } from '../hooks/useQueries';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RatingDisplayProps {
  titleId: bigint;
}

export default function RatingDisplay({ titleId }: RatingDisplayProps) {
  const { data: ratings, isLoading } = useGetTitleRatings(titleId);

  if (isLoading) {
    return <Skeleton className="h-12 w-48" />;
  }

  if (!ratings) {
    return null;
  }

  const { averageRating, ratingCount } = ratings;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
        ))}
        {hasHalfStar && <Star className="w-6 h-6 fill-yellow-500/50 text-yellow-500" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-6 h-6 text-gray-600" />
        ))}
      </div>
      <div className="text-white">
        <div className="text-2xl font-bold">
          {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
        </div>
        <div className="text-sm text-gray-400">
          {Number(ratingCount)} {Number(ratingCount) === 1 ? 'note' : 'notes'}
        </div>
      </div>
    </div>
  );
}
