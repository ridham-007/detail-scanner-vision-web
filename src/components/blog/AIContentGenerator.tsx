
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
  currentTitle?: string;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ 
  onContentGenerated, 
  currentTitle 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const safeGeneratedContent = DOMPurify.sanitize(generatedContent);

  const contentTypes = [
    { label: 'Blog Introduction', prompt: 'Write an engaging introduction for a blog post about' },
    { label: 'How-to Guide', prompt: 'Create a comprehensive how-to guide about' },
    { label: 'List Article', prompt: 'Write a list-style article about' },
    { label: 'Product Review', prompt: 'Write a detailed product review about' },
    { label: 'Tutorial', prompt: 'Create a step-by-step tutorial about' },
    { label: 'News Article', prompt: 'Write a news-style article about' },
  ];

  const generateContent = async (selectedPrompt?: string) => {
    if (!prompt.trim() && !selectedPrompt) {
      toast({
        title: 'Error',
        description: 'Please enter a topic or select a content type.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://tzxvlfemmamhrxtcqfhz.supabase.co/functions/v1/generate-blog-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6eHZsZmVtbWFtaHJ4dGNxZmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzEwODUsImV4cCI6MjA2NTcwNzA4NX0.wHrtKZiGgo90Ffle_AgeJtJLzqJYv3wEje3QU0epPOQ`,
        },
        body: JSON.stringify({
          prompt: selectedPrompt || prompt,
          title: currentTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
      toast({
        title: 'Content Generated!',
        description: 'AI has generated content for your blog post.',
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = (type: { label: string; prompt: string }) => {
    const fullPrompt = `${type.prompt} ${currentTitle || prompt}. Make it engaging, informative, and SEO-friendly. Use proper HTML formatting with headings, paragraphs, and lists where appropriate.`;
    generateContent(fullPrompt);
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy content.',
        variant: 'destructive',
      });
    }
  };

  const useGeneratedContent = () => {
    onContentGenerated(generatedContent);
    toast({
      title: 'Content Applied!',
      description: 'Generated content has been added to your blog post.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ai-prompt">Topic or Custom Prompt</Label>
          <Textarea
            id="ai-prompt"
            placeholder="Enter your blog topic or custom prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label>Quick Content Types</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {contentTypes.map((type) => (
              <Badge
                key={type.label}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleQuickGenerate(type)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => generateContent()}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>
        </div>

        {generatedContent && (
          <div className="space-y-3">
            <Label>Generated Content</Label>
            <div className="p-4 border rounded-md bg-muted max-h-60 overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: safeGeneratedContent }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={copyContent}
                className="flex-1"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={useGeneratedContent}
                className="flex-1"
              >
                Use This Content
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIContentGenerator;
