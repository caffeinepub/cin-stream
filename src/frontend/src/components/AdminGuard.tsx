import { ReactNode } from 'react';
import { useGetCallerUserRole } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { ShieldAlert, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userRole, isLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  if (isLoading || loginStatus === 'logging-in') {
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

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#8B0000]/20 to-[#A52A2A]/20 p-8 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-[#8B0000]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Accès refusé</h2>
          <p className="text-gray-400 mb-2">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-gray-500 text-sm">
            Seuls les administrateurs peuvent ajouter du contenu.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
