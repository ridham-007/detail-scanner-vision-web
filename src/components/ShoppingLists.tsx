import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Trash2, Edit3, Check, Package, Calendar, Users, Loader2 } from 'lucide-react';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ShoppingListItem {
  id: string;
  product_name: string;
  quantity: number;
  is_purchased: boolean;
  barcode?: string;
  notes?: string;
}

interface ShoppingList {
  id: string;
  name: string;
  description?: string | null;
  is_completed: boolean;
  created_at: string;
  shopping_list_items?: ShoppingListItem[];
  items?: ShoppingListItem[];
}

const ShoppingLists = () => {
  const { user } = useAuth();
  const { shoppingLists, isLoading, createShoppingList, updateShoppingList, deleteShoppingList, updateListItem, removeItemFromList } = useShoppingLists();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    
    await createShoppingList(newListName.trim(), newListDescription.trim() || undefined);
    setNewListName('');
    setNewListDescription('');
    setShowCreateModal(false);
  };

  const toggleItemPurchased = async (itemId: string, isPurchased: boolean) => {
    await updateListItem(itemId, { is_purchased: !isPurchased });
  };

  const toggleListCompleted = async (listId: string, isCompleted: boolean) => {
    await updateShoppingList(listId, { is_completed: !isCompleted });
  };

  if (!user) {
    return (
      <Card className="mx-auto w-full max-w-4xl rounded-[28px] border-white/70 bg-white/85 shadow-product">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <span className="text-lg font-medium mb-2">Sign in to view your shopping lists</span>
            <p className="text-muted-foreground">Create and manage your shopping lists</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-4xl rounded-[28px] border-white/70 bg-white/85 shadow-product">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading shopping lists...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/82 px-5 py-4 shadow-[var(--shadow-soft)]">
        <div>
          <h1 className="text-2xl font-bold">Shopping Lists</h1>
          <p className="text-muted-foreground">Manage your shopping lists and items</p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 rounded-full shadow-[var(--shadow-warm)]">
              <Plus className="w-4 h-4" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[28px] border-white/70 bg-white/95 shadow-product">
            <DialogHeader>
              <DialogTitle>Create Shopping List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">List Name</label>
                <Input
                  placeholder="e.g. Weekly Groceries"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="rounded-2xl border-orange-100/80 bg-white/90"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  placeholder="Add any notes about this shopping list..."
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="min-h-[80px] rounded-2xl border-orange-100/80 bg-white/90"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 rounded-full border-orange-200/80 bg-white/90">
                  Cancel
                </Button>
                <Button onClick={handleCreateList} disabled={!newListName.trim()} className="flex-1 rounded-full shadow-[var(--shadow-warm)]">
                  Create List
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Shopping Lists */}
      {shoppingLists.length === 0 ? (
        <Card className="rounded-[28px] border-white/70 bg-white/88 shadow-product">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <span className="text-xl font-medium mb-2">No shopping lists yet</span>
              <p className="text-muted-foreground mb-6">Create your first shopping list to get started</p>
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 rounded-full shadow-[var(--shadow-warm)]">
                <Plus className="w-4 h-4" />
                Create Your First List
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {shoppingLists.map((list: ShoppingList) => {
            const totalItems = list.shopping_list_items?.length || 0;
            const purchasedItems = list.items?.filter(item => item.is_purchased).length || 0;
            const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;

            return (
              <Card key={list.id} className={`rounded-[28px] border-white/70 shadow-product ${list.is_completed ? 'bg-orange-50/40' : 'bg-white/88'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className={`${list.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                          {list.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={list.is_completed ? 'default' : 'secondary'}>
                            {purchasedItems}/{totalItems} items
                          </Badge>
                          {list.is_completed && (
                            <Badge variant="outline" className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700">
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      {list.description && (
                        <p className="text-sm text-muted-foreground">{list.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created {format(new Date(list.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleListCompleted(list.id, list.is_completed)}
                        className="flex items-center gap-1 rounded-full border-orange-200/80 bg-white/90"
                      >
                        <Check className="w-3 h-3" />
                        {list.is_completed ? 'Reopen' : 'Complete'}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full border-red-200/80 bg-white/90 text-destructive hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete shopping list?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{list.name}" and all its items. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteShoppingList(list.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {totalItems > 0 && (
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full bg-orange-100/80">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  )}
                </CardHeader>
                
                {totalItems > 0 && (
                  <CardContent>
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-3">
                        {list.items?.map((item, index) => (
                          <div key={item.id}>
                            <div className="flex items-center justify-between rounded-[22px] border border-orange-100/70 bg-white/82 p-3">
                              <div className="flex items-center gap-3 flex-1">
                                <Checkbox
                                  checked={item.is_purchased}
                                  onCheckedChange={() => toggleItemPurchased(item.id, item.is_purchased)}
                                />
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-muted-foreground" />
                                  <div className="flex-1">
                                    <span className={`font-medium text-sm ${item.is_purchased ? 'line-through text-muted-foreground' : ''}`}>
                                      {item.product_name}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>Qty: {item.quantity}</span>
                                      {item.barcode && <span>• {item.barcode}</span>}
                                    </div>
                                    {item.notes && (
                                      <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemFromList(item.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            {index < (list.items?.length || 0) - 1 && <Separator className="my-2" />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShoppingLists;
