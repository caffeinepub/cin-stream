import { useState } from 'react';
import { useGetAllTitles } from '../hooks/useQueries';
import SearchBar from '../components/SearchBar';
import TitlesGrid from '../components/TitlesGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Film } from 'lucide-react';
import ProfileSetupModal from '../components/ProfileSetupModal';

export default function HomePage() {
  const { data: titles, isLoading } = useGetAllTitles();
  const [searchResults, setSearchResults] = useState<typeof titles | null>(null);

  const displayTitles = searchResults !== null ? searchResults : titles;

  return (
    <>
      <ProfileSetupModal />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Découvrez votre prochain film préféré
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explorez notre collection de films et séries exceptionnels
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearchResults={setSearchResults} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : displayTitles && displayTitles.length > 0 ? (
          <TitlesGrid titles={displayTitles} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gradient-to-br from-[#8B0000]/20 to-[#A52A2A]/20 p-8 rounded-full mb-6">
              <Film className="w-16 h-16 text-[#8B0000]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchResults !== null ? 'Aucun résultat trouvé' : 'Aucun contenu disponible pour le moment'}
            </h3>
            <p className="text-gray-400 max-w-md">
              {searchResults !== null
                ? 'Essayez une autre recherche ou parcourez tous les titres'
                : 'Revenez bientôt pour découvrir de nouveaux films et séries'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
