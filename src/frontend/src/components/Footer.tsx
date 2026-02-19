import { SiCoffeescript } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'cinestream-app');

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0A0A0A]/60 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
          <p className="flex items-center gap-2">
            © {currentYear} CinéStream. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2">
            Built with{' '}
            <Heart className="w-4 h-4 text-[#8B0000] fill-[#8B0000] animate-pulse" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B0000] hover:text-[#A52A2A] transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
