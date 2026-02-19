import { useState } from 'react';
import { useRateTitle } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Star, LogIn } from 'lucide-react';
import { toast } from 'sonner';

interface RatingInputProps {
  titleId: bigint;
}

export default function RatingInput({ titleId }: RatingInputProps) {
  const { identity, login } = useInternetIdentity();
  const rateMutation = useRateTitle();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const isAuthenticated = !!identity;

  const handleRatingClick = async (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour noter ce contenu');
      return;
    }

    setSelectedRating(rating);
    try {
      await rateMutation.mutateAsync({ titleId, userRating: BigInt(rating) });
      toast.success('Votre note a été enregistrée');
    } catch (error) {
      console.error('Rating error:', error);
      toast.error("Erreur lors de l'enregistrement de votre note");
      setSelectedRating(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Notez ce contenu</h3>
        <p className="text-gray-400 mb-4">Connectez-vous pour noter ce contenu</p>
        <Button
          onClick={login}
          variant="outline"
          className="border-[#8B0000]/30 hover:bg-[#8B0000]/10 hover:border-[#8B0000]/50"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Notez ce contenu</h3>
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => {
          const rating = i + 1;
          const isFilled = rating <= (hoveredRating || selectedRating);
          return (
            <button
              key={rating}
              onClick={() => handleRatingClick(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              disabled={rateMutation.isPending}
              className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  isFilled ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {selectedRating > 0 && (
        <p className="text-sm text-gray-400">Vous avez noté ce contenu {selectedRating}/5</p>
      )}
    </div>
  );
}
