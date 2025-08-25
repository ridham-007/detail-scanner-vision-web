
import React from 'react';
import { BlogPost } from '@/types/Blog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.featured_image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(post.published_at || post.created_at)}</span>
          {post.reading_time && (
            <>
              <Clock className="h-4 w-4 ml-2" />
              <span>{post.reading_time} min read</span>
            </>
          )}
        </div>
        
        <Link to={`/blog/${post.slug}`} className="group">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-3 mt-2">
            {post.excerpt}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-end">
          {!post.is_published && (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
