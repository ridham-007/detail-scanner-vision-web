"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, ShoppingCart, Package } from 'lucide-react';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { useAuth } from '@/contexts/AuthContext';

interface ShoppingList {
  id: string;
  name: string;
  shopping_list_items?: Array<{ id: string }>;
  is_completed?: boolean;
}

interface AddToShoppingListModalProps {
  barcode?: string;
  productName: string;
  children: React.ReactNode;
}

export const AddToShoppingListModal: React.FC<AddToShoppingListModalProps> = ({
  barcode,
  productName,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  
  const { user } = useAuth();
  const { shoppingLists, addItemToList, createShoppingList } = useShoppingLists();

  const handleAddToList = async () => {
    if (!user) return;

    if (isCreatingList && newListName.trim()) {
      // Create new list and add item to it
      const newList = await createShoppingList(newListName.trim());
      if (newList) {
        await addItemToList(newList.id, {
          barcode,
          product_name: productName,
          quantity: parseInt(quantity) || 1,
          notes: notes.trim() || undefined
        });
      }
    } else if (selectedListId) {
      // Add to existing list
      await addItemToList(selectedListId, {
        barcode,
        product_name: productName,
        quantity: parseInt(quantity) || 1,
        notes: notes.trim() || undefined
      });
    }

    // Reset form and close modal
    setOpen(false);
    setSelectedListId('');
    setQuantity('1');
    setNotes('');
    setNewListName('');
    setIsCreatingList(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form when closing
      setSelectedListId('');
      setQuantity('1');
      setNotes('');
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add to Shopping List
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{productName}</h4>
                  {barcode && (
                    <p className="text-xs text-muted-foreground">Barcode: {barcode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* List Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Choose Shopping List</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingList(!isCreatingList)}
                className="h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                New List
              </Button>
            </div>

            {isCreatingList ? (
              <div className="space-y-2">
                <Input
                  placeholder="Enter list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="h-9"
                />
              </div>
            ) : (
              <Select value={selectedListId} onValueChange={setSelectedListId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a shopping list" />
                </SelectTrigger>
                <SelectContent>
                  {shoppingLists.map((list: ShoppingList) => (
                    <SelectItem key={list.id} value={list.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{list.name}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            {list.shopping_list_items?.length || 0} items
                          </Badge>
                          {list.is_completed && (
                            <Badge variant="outline" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {shoppingLists.length === 0 && !isCreatingList && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No shopping lists yet. Create your first one!
              </p>
            )}
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this item..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToList}
              disabled={!isCreatingList ? !selectedListId : !newListName.trim()}
              className="flex-1"
            >
              Add to List
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};