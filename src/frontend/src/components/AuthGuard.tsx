import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  if (isLoggingIn) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#8B0000]/20 to-[#A52A2A]/20 p-8 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <LogIn className="w-12 h-12 text-[#8B0000]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connexion requise</h2>
          <p className="text-gray-400 mb-8">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <Button
            onClick={login}
            className="bg-gradient-to-r from-[#8B0000] to-[#A52A2A] hover:from-[#A52A2A] hover:to-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
