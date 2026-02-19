import { useNavigate } from '@tanstack/react-router';
import { Title } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Star, Film, Tv } from 'lucide-react';

interface TitleCardProps {
  title: Title;
}

export default function TitleCard({ title }: TitleCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/title/$id', params: { id: title.id.toString() } });
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#8B0000]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#8B0000]/20"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={title.coverImage.getDirectURL()}
          alt={title.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge
          variant="outline"
          className="absolute top-3 right-3 border-white/30 bg-black/50 backdrop-blur-sm text-white"
        >
          {title.titleType === 'movie' ? (
            <Film className="w-3 h-3 mr-1" />
          ) : (
            <Tv className="w-3 h-3 mr-1" />
          )}
          {title.titleType === 'movie' ? 'Film' : 'Série'}
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-[#8B0000] transition-colors">
          {title.title}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="font-semibold">
              {title.averageRating > 0 ? title.averageRating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <span className="text-gray-400">
            {title.ratingCount > 0 ? `(${title.ratingCount} notes)` : '(Aucune note)'}
          </span>
        </div>
      </div>
    </div>
  );
}
