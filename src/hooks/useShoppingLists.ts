import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ShoppingListItem {
  id: string;
  barcode?: string;
  product_name: string;
  quantity: number;
  is_purchased: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  items?: ShoppingListItem[];
}

export const useShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchShoppingLists = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select(`
          *,
          shopping_list_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShoppingLists(data || []);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch shopping lists',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createShoppingList = async (name: string, description?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: user.id,
          name,
          description
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Shopping List Created',
        description: `"${name}" has been created`
      });

      fetchShoppingLists();
      return data;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shopping list',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateShoppingList = async (id: string, updates: { name?: string; description?: string; is_completed?: boolean }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Shopping List Updated',
        description: 'Your shopping list has been updated'
      });

      fetchShoppingLists();
    } catch (error) {
      console.error('Error updating shopping list:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shopping list',
        variant: 'destructive'
      });
    }
  };

  const deleteShoppingList = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Shopping List Deleted',
        description: 'Shopping list has been deleted'
      });

      setShoppingLists(prev => prev.filter(list => list.id !== id));
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete shopping list',
        variant: 'destructive'
      });
    }
  };

  const addItemToList = async (listId: string, item: { barcode?: string; product_name: string; quantity?: number; notes?: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .insert({
          shopping_list_id: listId,
          barcode: item.barcode,
          product_name: item.product_name,
          quantity: item.quantity || 1,
          notes: item.notes
        });

      if (error) throw error;

      toast({
        title: 'Item Added',
        description: `${item.product_name} added to shopping list`
      });

      fetchShoppingLists();
    } catch (error) {
      console.error('Error adding item to list:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to shopping list',
        variant: 'destructive'
      });
    }
  };

  const updateListItem = async (itemId: string, updates: { quantity?: number; is_purchased?: boolean; notes?: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update(updates)
        .eq('id', itemId);

      if (error) throw error;

      fetchShoppingLists();
    } catch (error) {
      console.error('Error updating list item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
    }
  };

  const removeItemFromList = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Item Removed',
        description: 'Item removed from shopping list'
      });

      fetchShoppingLists();
    } catch (error) {
      console.error('Error removing item from list:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchShoppingLists();
    } else {
      setShoppingLists([]);
    }
  }, [user]);

  return {
    shoppingLists,
    isLoading,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    addItemToList,
    updateListItem,
    removeItemFromList,
    fetchShoppingLists
  };
};