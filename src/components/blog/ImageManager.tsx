"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Images, Pencil, Check, X, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageFile {
  name: string;
  url: string;
  createdAt: string;
  size: number;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const ImageManager: React.FC = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState<string | null>(null); // current filename being edited
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog-images');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFiles(data.files);
    } catch (err) {
      toast({
        title: 'Failed to load images',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const startEdit = (file: ImageFile) => {
    const baseName = file.name.replace(/\.webp$/, '');
    setEditingName(file.name);
    setNewName(baseName);
  };

  const cancelEdit = () => {
    setEditingName(null);
    setNewName('');
  };

  const handleRename = async (oldName: string) => {
    const slug = slugify(newName);
    if (!slug) {
      toast({ title: 'Invalid name', variant: 'destructive' });
      return;
    }
    if (`${slug}.webp` === oldName) {
      cancelEdit();
      return;
    }

    setRenaming(true);
    try {
      const res = await fetch('/api/rename-blog-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({ title: 'Renamed', description: `→ ${slug}.webp` });
      cancelEdit();
      fetchFiles();
    } catch (err) {
      toast({
        title: 'Rename failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setRenaming(false);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Image Manager
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchFiles} disabled={loading} type="button">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            Loading images...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No images found.</div>
        ) : (
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filtered.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-2 border rounded-lg"
              >
                {/* Thumbnail */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded shrink-0 bg-muted"
                />

                {/* Name / edit */}
                <div className="flex-1 min-w-0">
                  {editingName === file.name ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(file.name);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <span className="text-xs text-muted-foreground shrink-0">.webp</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{file.url}</p>
                    </>
                  )}
                </div>

                {/* Actions */}
                {editingName === file.name ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-green-600 hover:text-green-700"
                      onClick={() => handleRename(file.name)}
                      disabled={renaming}
                      type="button"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={cancelEdit}
                      disabled={renaming}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => startEdit(file)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => copyUrl(file.url)}
                      type="button"
                    >
                      {copiedUrl === file.url
                        ? <Check className="h-4 w-4 text-green-600" />
                        : <Copy className="h-4 w-4" />
                      }
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageManager;
