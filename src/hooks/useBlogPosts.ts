
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, CreateBlogPost } from '@/types/Blog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useBlogPosts = (includeUnpublished = false) => {
  return useQuery({
    queryKey: ['blog-posts', includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(id, full_name, username, avatar_url)
        `)
        .order('published_at', { ascending: false, nullsFirst: false });

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(id, full_name, username, avatar_url)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });
};

export const useBlogPostById = (id: string) => {
  return useQuery({
    queryKey: ['blog-post-by-id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(id, full_name, username, avatar_url)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rawPostData: CreateBlogPost) => {
      if (!user) throw new Error('User not authenticated');

      // Sanitize empty strings to null for optional fields
      const postData = Object.fromEntries(
        Object.entries(rawPostData).map(([k, v]) => [k, v === '' ? null : v])
      ) as CreateBlogPost;

      // Generate slug from title
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      // Calculate reading time (average 200 words per minute)
      const wordCount = postData.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          slug,
          author_id: user.id,
          word_count: wordCount,
          reading_time: readingTime,
          published_at: postData.is_published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: 'Success',
        description: 'Blog post created successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create blog post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, postData }: { id: string; postData: Partial<CreateBlogPost> }) => {
      // Sanitize empty strings to null for optional fields
      const sanitized = Object.fromEntries(
        Object.entries(postData).map(([k, v]) => [k, v === '' ? null : v])
      ) as Partial<CreateBlogPost>;

      // Calculate reading time if content is updated
      let updateData = { ...sanitized };
      if (postData.content) {
        const wordCount = postData.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        updateData = {
          ...updateData,
          word_count: wordCount,
          reading_time: readingTime,
        };
      }

      // Update published_at if publishing for the first time
      if (postData.is_published) {
        const { data: existingPost } = await supabase
          .from('blog_posts')
          .select('published_at')
          .eq('id', id)
          .single();
        
        if (existingPost && !existingPost.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update blog post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete blog post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};
