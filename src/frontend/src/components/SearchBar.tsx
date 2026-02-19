import { useState, useEffect } from 'react';
import { useSearchTitles } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Title } from '../backend';

interface SearchBarProps {
  onSearchResults: (results: Title[] | null) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading } = useSearchTitles(searchQuery);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      onSearchResults(null);
    } else if (searchResults) {
      onSearchResults(searchResults);
    }
  }, [searchResults, searchQuery, onSearchResults]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher des films et séries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#8B0000]/50 focus:ring-[#8B0000]/20 text-lg rounded-xl"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B0000] animate-spin" />
        )}
      </div>
    </div>
  );
}
