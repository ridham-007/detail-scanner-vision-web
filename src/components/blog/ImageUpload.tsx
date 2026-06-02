import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Copy, Check, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertToWebP } from '@/lib/image-utils';

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
  defaultName?: string;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, defaultName }) => {
  const [uploading, setUploading] = useState(false);
  const [imageName, setImageName] = useState(() => slugify(defaultName ?? ''));
  const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string }[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userEdited = useRef(false);
  const { toast } = useToast();

  // Keep name in sync with blog title unless user has manually edited it
  useEffect(() => {
    if (!userEdited.current) {
      setImageName(slugify(defaultName ?? ''));
    }
  }, [defaultName]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!imageName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter an image name before uploading.',
        variant: 'destructive',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image must be smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const webpBlob = await convertToWebP(file);
      const slug = slugify(imageName);
      const fileName = `${slug}.webp`;
      const webpFile = new File([webpBlob], fileName, { type: 'image/webp' });

      const form = new FormData();
      form.append('file', webpFile);
      form.append('filePath', fileName);

      const res = await fetch('/api/upload-blog-image', { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Upload failed');
      }

      const customUrl = `https://images.eateriq.com/blog-images/${fileName}`;
      setUploadedImages(prev => [{ name: fileName, url: customUrl }, ...prev]);

      if (onImageUploaded) {
        onImageUploaded(customUrl);
      }

      toast({
        title: 'Success!',
        description: 'Image uploaded successfully.',
      });

      setImageName(slugify(defaultName ?? ''));
      userEdited.current = false;
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Upload failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast({ title: 'Copied!', description: 'Image URL copied to clipboard.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to copy URL.', variant: 'destructive' });
    }
  };

  const removeImage = (urlToRemove: string) => {
    setUploadedImages(prev => prev.filter(img => img.url !== urlToRemove));
  };

  const previewFilename = imageName.trim() ? `${slugify(imageName)}.webp` : null;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Image Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name input */}
        <div className="space-y-1.5">
          <Label htmlFor="image-name">Image Name <span className="text-destructive">*</span></Label>
          <Input
            id="image-name"
            type="text"
            placeholder="e.g. healthy-breakfast-bowl"
            value={imageName}
            onChange={(e) => { userEdited.current = true; setImageName(e.target.value); }}
            disabled={uploading}
          />
          {previewFilename && (
            <p className="text-xs text-muted-foreground">
              Will be stored as:{' '}
              <span className="font-medium text-foreground break-all">
                https://images.eateriq.com/blog-images/{previewFilename}
              </span>
            </p>
          )}
        </div>

        {/* File picker */}
        <div className="space-y-1.5">
          <Label htmlFor="image-upload">Image File</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !imageName.trim()}
            className="w-full"
            variant="outline"
            type="button"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                Uploading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Choose Image
              </div>
            )}
          </Button>
        </div>

        {/* Uploaded list */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <Label>Uploaded Images</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedImages.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-12 h-12 object-contain rounded bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{image.url}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(image.url)}
                    className="h-8 w-8 p-0 shrink-0"
                    type="button"
                  >
                    {copiedUrl === image.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(image.url)}
                    className="h-8 w-8 p-0 shrink-0 text-destructive hover:text-destructive"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
