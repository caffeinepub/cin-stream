import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetTitleById, useDeleteTitle, useIsCallerAdmin } from '../hooks/useQueries';
import VideoPlayer from '../components/VideoPlayer';
import RatingDisplay from '../components/RatingDisplay';
import RatingInput from '../components/RatingInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Film, Tv, Trash2 } from 'lucide-react';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { toast } from 'sonner';

export default function TitleDetailPage() {
  const { id } = useParams({ from: '/title/$id' });
  const navigate = useNavigate();
  const { data: title, isLoading } = useGetTitleById(BigInt(id));
  const { data: isAdmin } = useIsCallerAdmin();
  const deleteMutation = useDeleteTitle();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(BigInt(id));
      toast.success('Contenu supprimé avec succès');
      navigate({ to: '/' });
    } catch (error: any) {
      console.error('Delete error:', error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('admin')) {
        toast.error('Seuls les administrateurs peuvent supprimer du contenu');
      } else {
        toast.error('Erreur lors de la suppression du contenu');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!title) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Titre introuvable</h2>
        <Button onClick={() => navigate({ to: '/' })} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="ghost"
            className="hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          {isAdmin && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1A1A1A] border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Confirmer la suppression
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Êtes-vous sûr de vouloir supprimer "{title.title}" ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <img
              src={title.coverImage.getDirectURL()}
              alt={title.title}
              className="w-full h-auto rounded-xl shadow-2xl shadow-[#8B0000]/20 border border-white/10"
            />
            <RatingDisplay titleId={title.id} />
            <RatingInput titleId={title.id} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="border-[#8B0000]/50 bg-[#8B0000]/10 text-[#8B0000] flex items-center gap-2"
                >
                  {title.titleType === 'movie' ? (
                    <>
                      <Film className="w-3 h-3" />
                      Film
                    </>
                  ) : (
                    <>
                      <Tv className="w-3 h-3" />
                      Série
                    </>
                  )}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title.title}</h1>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{title.description}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Regarder maintenant</h2>
              <VideoPlayer video={title.video} title={title.title} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
