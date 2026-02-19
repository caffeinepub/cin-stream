import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Film, Upload, LogIn, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="bg-gradient-to-br from-[#8B0000] to-[#A52A2A] p-2 rounded-lg shadow-lg shadow-[#8B0000]/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CinéStream
            </h1>
          </button>

          <nav className="flex items-center gap-3">
            {isAuthenticated && (
              <Button
                onClick={() => navigate({ to: '/admin/upload' })}
                variant="outline"
                className="border-[#8B0000]/30 hover:bg-[#8B0000]/10 hover:border-[#8B0000]/50 transition-all"
              >
                <Upload className="w-4 h-4 mr-2" />
                Ajouter du contenu
              </Button>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className={
                isAuthenticated
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-gradient-to-r from-[#8B0000] to-[#A52A2A] hover:from-[#A52A2A] hover:to-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30'
              }
            >
              {isLoggingIn ? (
                'Connexion...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
