import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Loader2 } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimize';
import { ExternalBlob } from '../../backend';
import OptimizedImage from '../media/OptimizedImage';

interface ImageUploadFieldProps {
  currentImage?: ExternalBlob;
  onImageChange: (blob: ExternalBlob | null) => void;
  label?: string;
}

export default function ImageUploadField({ currentImage, onImageChange, label = 'Food Image' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage ? currentImage.getDirectURL() : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      // Optimize image
      const optimizedBytes = await optimizeImage(file);
      
      // Create ExternalBlob with progress tracking
      const blob = ExternalBlob.fromBytes(optimizedBytes).withUploadProgress((percentage) => {
        setProgress(percentage);
      });

      // Create preview URL using the buffer directly
      const url = URL.createObjectURL(new Blob([optimizedBytes.buffer], { type: 'image/jpeg' }));
      setPreviewUrl(url);

      onImageChange(blob);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
            <OptimizedImage
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            PNG, JPG up to 10MB
          </p>
        </div>
      )}

      {uploading && progress > 0 && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground text-center">{progress}%</p>
        </div>
      )}
    </div>
  );
}
