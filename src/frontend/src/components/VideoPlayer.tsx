import { useState } from 'react';
import { ExternalBlob } from '../backend';
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  video: ExternalBlob;
  title: string;
}

export default function VideoPlayer({ video, title }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const videoUrl = video.getDirectURL();

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
          <AlertCircle className="w-12 h-12 text-[#8B0000] mb-4" />
          <p className="text-center">Erreur lors du chargement de la vidéo</p>
        </div>
      )}
      <video
        src={videoUrl}
        controls
        className="w-full h-full"
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        title={title}
      >
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
}
