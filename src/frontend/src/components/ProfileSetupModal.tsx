import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    setIsOpen(showProfileSetup);
  }, [showProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    try {
      await saveMutation.mutateAsync({ name: name.trim() });
      toast.success('Profil créé avec succès !');
      setIsOpen(false);
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Erreur lors de la création du profil');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1A1A2E] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#8B0000] to-[#A52A2A] p-2 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            Bienvenue sur CinéStream
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Pour commencer, veuillez nous indiquer votre nom
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nom
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez votre nom"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              autoFocus
              required
            />
          </div>
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full bg-gradient-to-r from-[#8B0000] to-[#A52A2A] hover:from-[#A52A2A] hover:to-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30"
          >
            {saveMutation.isPending ? 'Création...' : 'Créer mon profil'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
