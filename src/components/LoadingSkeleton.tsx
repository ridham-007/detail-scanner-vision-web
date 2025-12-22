import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'product' | 'quiz' | 'page' | 'table';
  count?: number;
}

const CardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </CardContent>
  </Card>
);

const ListSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border rounded-lg">
    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

const ProductSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <Skeleton className="h-48 w-full rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
);

const QuizSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="text-center space-y-3">
      <Skeleton className="h-10 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-muted px-4 py-3 border-b">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="px-4 py-3 border-b last:border-0">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    ))}
  </div>
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 1 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'product':
        return <ProductSkeleton />;
      case 'quiz':
        return <QuizSkeleton />;
      case 'page':
        return <PageSkeleton />;
      case 'table':
        return <TableSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  if (variant === 'page' || variant === 'table') {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
