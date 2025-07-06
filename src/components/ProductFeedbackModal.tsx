
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProductFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: string, comment?: string) => Promise<void>;
  isLoading: boolean;
}

const feedbackCategories = [
  { value: 'wrong_product', label: 'Wrong product information' },
  { value: 'incorrect_nutrition', label: 'Incorrect nutrition data' },
  { value: 'misleading_health_score', label: 'Misleading health score' },
  { value: 'wrong_image', label: 'Product image doesn\'t match' },
  { value: 'other', label: 'Other issue' }
];

const ProductFeedbackModal: React.FC<ProductFeedbackModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!selectedCategory) return;
    
    await onSubmit(selectedCategory, comment.trim() || undefined);
    
    // Reset form
    setSelectedCategory('');
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help Us Improve</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">
              What's wrong with this product information?
            </Label>
            <RadioGroup
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="space-y-2"
            >
              {feedbackCategories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.value} id={category.value} />
                  <Label htmlFor={category.value} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
              Additional details (optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Tell us more about the issue..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedCategory || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFeedbackModal;
