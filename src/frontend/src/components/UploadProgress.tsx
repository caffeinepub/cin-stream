import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  fileName: string;
  fileSize: number;
  isComplete?: boolean;
}

export default function UploadProgress({ progress, fileName, fileSize, isComplete = false }: UploadProgressProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const uploadedSize = (fileSize * progress) / 100;

  return (
    <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Upload className="w-4 h-4 text-[#8B0000] animate-pulse" />
          )}
          <span className="text-sm text-white font-medium truncate max-w-[200px]">{fileName}</span>
        </div>
        <span className="text-xs text-gray-400">
          {formatFileSize(uploadedSize)} / {formatFileSize(fileSize)}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">
          {isComplete ? 'Téléversement terminé' : 'Téléversement en cours...'}
        </span>
        <span className="text-[#8B0000] font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
