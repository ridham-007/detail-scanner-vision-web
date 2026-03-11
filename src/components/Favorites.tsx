import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Heart, Trash2, ShoppingCart, Package, Calendar, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { AddToShoppingListModal } from '@/components/AddToShoppingListModal';
import { format } from 'date-fns';

const MAX_FREE_FAVORITES = 10;

const Favorites = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const router = useRouter();
  const { favorites, isLoading, removeFromFavorites } = useFavorites();

  const getHealthScoreBadgeVariant = (score: number | null) => {
    if (!score) return 'secondary';
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sign in to view your favorites</h3>
            <p className="text-muted-foreground">Save your favorite products for quick access</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading favorites...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isFreeTier = tier === 'free';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-current text-red-500" />
            Favorite Products
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'product' : 'products'} saved
          </p>
        </CardHeader>
      </Card>

      {/* Free tier limit notice */}
      {isFreeTier && favorites.length >= MAX_FREE_FAVORITES && (
        <Card className="border-dashed border-primary/40 bg-primary/5">
          <CardContent className="pt-4 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Favourites limit reached ({favorites.length}/{MAX_FREE_FAVORITES})
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upgrade to Pro to save unlimited favourite products.
              </p>
            </div>
            <Button size="sm" onClick={() => router.push('/pricing')}>
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start scanning products and add them to your favorites for quick access
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {favorites.map((favorite, index) => (
                  <div key={favorite.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{favorite.product_name}</h4>
                            <Badge variant={getHealthScoreBadgeVariant(favorite.health_score)}>
                              {favorite.health_score || 'N/A'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Barcode: {favorite.barcode}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(favorite.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <AddToShoppingListModal
                          barcode={favorite.barcode}
                          productName={favorite.product_name}
                        >
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            Add to List
                          </Button>
                        </AddToShoppingListModal>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromFavorites(favorite.barcode)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < favorites.length - 1 && <Separator className="my-3" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Favorites;