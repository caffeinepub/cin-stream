import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUploadTitle } from '../hooks/useQueries';
import AuthGuard from '../components/AuthGuard';
import UploadProgress from '../components/UploadProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Film, Tv, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { TitleType } from '../backend';

const MAX_VIDEO_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB in bytes

export default function AdminUploadPage() {
  const navigate = useNavigate();
  const uploadMutation = useUploadTitle();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleType, setTitleType] = useState<TitleType>(TitleType.movie);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error(`La taille du fichier dépasse la limite de 5 GB`);
        e.target.value = '';
        return;
      }

      setVideoFile(file);
      setVideoProgress(0);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setCoverProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoFile || !coverFile) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (videoFile.size > MAX_VIDEO_SIZE) {
      toast.error(`La vidéo dépasse la limite de 5 GB`);
      return;
    }

    setIsUploading(true);

    try {
      const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
      const coverBytes = new Uint8Array(await coverFile.arrayBuffer());

      const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress((percentage) => {
        setVideoProgress(percentage);
      });

      const coverBlob = ExternalBlob.fromBytes(coverBytes).withUploadProgress((percentage) => {
        setCoverProgress(percentage);
      });

      await uploadMutation.mutateAsync({
        title,
        description,
        video: videoBlob,
        coverImage: coverBlob,
        titleType,
      });

      toast.success('Contenu publié avec succès !');
      navigate({ to: '/' });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de la publication du contenu");
      setIsUploading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="ghost"
          className="mb-6 hover:bg-white/10"
          disabled={isUploading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#8B0000] to-[#A52A2A] p-2 rounded-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              Ajouter du contenu
            </CardTitle>
            <CardDescription className="text-gray-400">
              Téléchargez un nouveau film ou une série sur la plateforme (max 5 GB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Titre
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrez le titre du film ou de la série"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le contenu..."
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">
                  Type
                </Label>
                <Select 
                  value={titleType} 
                  onValueChange={(value) => setTitleType(value as TitleType)}
                  disabled={isUploading}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TitleType.movie}>
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        Film
                      </div>
                    </SelectItem>
                    <SelectItem value={TitleType.series}>
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4" />
                        Série
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video" className="text-white">
                  Fichier vidéo (max 5 GB)
                </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="bg-white/5 border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B0000] file:text-white hover:file:bg-[#A52A2A] file:cursor-pointer"
                  required
                  disabled={isUploading}
                />
                {videoFile && videoProgress > 0 && (
                  <UploadProgress
                    progress={videoProgress}
                    fileName={videoFile.name}
                    fileSize={videoFile.size}
                    isComplete={videoProgress === 100}
                  />
                )}
                <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    Les fichiers vidéo sont automatiquement divisés en fragments de 2 MB pour l'upload.
                    Le processus peut prendre plusieurs minutes pour les gros fichiers.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover" className="text-white">
                  Image de couverture
                </Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="bg-white/5 border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B0000] file:text-white hover:file:bg-[#A52A2A] file:cursor-pointer"
                  required
                  disabled={isUploading}
                />
                {coverFile && coverProgress > 0 && (
                  <UploadProgress
                    progress={coverProgress}
                    fileName={coverFile.name}
                    fileSize={coverFile.size}
                    isComplete={coverProgress === 100}
                  />
                )}
              </div>

              <Button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-[#8B0000] to-[#A52A2A] hover:from-[#A52A2A] hover:to-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30"
              >
                {isUploading ? 'Publication en cours...' : 'Publier'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
