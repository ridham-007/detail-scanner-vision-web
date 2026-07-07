import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateBlogPost } from '@/types/Blog';
import { Save, Eye, Globe, Wand2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import AIContentGenerator from './AIContentGenerator';
import ImageUpload from './ImageUpload';
import ImageManager from './ImageManager';

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface BlogEditorProps {
  initialData?: Partial<CreateBlogPost>;
  onSave: (data: CreateBlogPost) => void;
  isLoading?: boolean;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialData, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateBlogPost>({
    title: initialData?.title || '',
    slug: initialData?.slug || slugify(initialData?.title || ''),
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featured_image_url: initialData?.featured_image_url || '',
    is_published: initialData?.is_published || false,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
    og_title: initialData?.og_title || '',
    og_description: initialData?.og_description || '',
    og_image: initialData?.og_image || '',
    twitter_title: initialData?.twitter_title || '',
    twitter_description: initialData?.twitter_description || '',
    twitter_image: initialData?.twitter_image || '',
  });

  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const slugManuallyEdited = useRef(Boolean(initialData?.slug));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof CreateBlogPost, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    handleInputChange('content', content);
  };

  useEffect(() => {
    if (!slugManuallyEdited.current) {
      setFormData(prev => ({
        ...prev,
        slug: slugify(prev.title),
      }));
    }
  }, [formData.title]);

  const handleAIContentGenerated = (content: string) => {
    // Append to existing content or replace based on user preference
    const currentContent = formData.content;
    const newContent = currentContent ? `${currentContent}\n\n${content}` : content;
    handleContentChange(newContent);
    setShowAIGenerator(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Blog Post Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => {
                  slugManuallyEdited.current = true;
                  handleInputChange('slug', e.target.value);
                }}
                placeholder="enter-blog-post-slug"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Used in the blog URL. Keep it short, lowercase, and hyphenated.
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Content *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIGenerator(!showAIGenerator)}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
              </div>
              
              {showAIGenerator && (
                <div className="mb-4">
                  <AIContentGenerator
                    onContentGenerated={handleAIContentGenerated}
                    currentTitle={formData.title}
                  />
                </div>
              )}
              
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => handleInputChange('is_published', checked)}
              />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>
          </CardContent>
        </Card>

        <ImageUpload
          defaultName={formData.title}
          onImageUploaded={() => {}}
        />
        <ImageManager />

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>SEO Meta Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="SEO optimized title (60 chars max)"
                    maxLength={60}
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO meta description (160 chars max)"
                    maxLength={160}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_keywords">Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Open Graph (Facebook)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={formData.og_title}
                    onChange={(e) => handleInputChange('og_title', e.target.value)}
                    placeholder="Title for social media sharing"
                  />
                </div>
                
                <div>
                  <Label htmlFor="og_description">OG Description</Label>
                  <Textarea
                    id="og_description"
                    value={formData.og_description}
                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="og_image">OG Image URL</Label>
                  <Input
                    id="og_image"
                    type="url"
                    value={formData.og_image}
                    onChange={(e) => handleInputChange('og_image', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="twitter">
            <Card>
              <CardHeader>
                <CardTitle>Twitter Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twitter_title">Twitter Title</Label>
                  <Input
                    id="twitter_title"
                    value={formData.twitter_title}
                    onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                    placeholder="Title for Twitter sharing"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter_description">Twitter Description</Label>
                  <Textarea
                    id="twitter_description"
                    value={formData.twitter_description}
                    onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                    placeholder="Description for Twitter sharing"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter_image">Twitter Image URL</Label>
                  <Input
                    id="twitter_image"
                    type="url"
                    value={formData.twitter_image}
                    onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || !formData.title || !formData.content}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Blog Post'}
          </Button>
          
          {formData.title && formData.content && (
            <Button type="button" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
