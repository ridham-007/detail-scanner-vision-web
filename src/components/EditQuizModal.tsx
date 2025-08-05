
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question_text: string;
  correct_answer: string;
  wrong_answer_1: string;
  wrong_answer_2: string;
  wrong_answer_3: string;
  question_order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  creator_id: string;
  is_published?: boolean;
}

interface EditQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
  onQuizUpdated: () => void;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
  open,
  onOpenChange,
  quiz,
  onQuizUpdated
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (quiz && open) {
      setFormData({
        title: quiz.title,
        description: quiz.description || '',
        difficulty: quiz.difficulty
      });
      fetchQuestions();
    }
  }, [quiz, open]);

  const fetchQuestions = async () => {
    if (!quiz) return;

    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id, question_text, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, question_order')
        .eq('quiz_id', quiz.id)
        .order('question_order');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions.",
        variant: "destructive",
      });
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      question_text: '',
      correct_answer: '',
      wrong_answer_1: '',
      wrong_answer_2: '',
      wrong_answer_3: '',
      question_order: questions.length + 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Reorder remaining questions
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      question_order: i + 1
    }));
    setQuestions(reorderedQuestions);
  };

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setLoading(true);
    try {
      // Update quiz basic info
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          updated_at: new Date().toISOString()
        })
        .eq('id', quiz.id);

      if (quizError) throw quizError;

      // Delete existing questions
      const { error: deleteError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quiz.id);

      if (deleteError) throw deleteError;

      // Insert updated questions
      const questionsToInsert = questions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        correct_answer: q.correct_answer,
        wrong_answer_1: q.wrong_answer_1,
        wrong_answer_2: q.wrong_answer_2,
        wrong_answer_3: q.wrong_answer_3,
        question_order: q.question_order
      }));

      const { error: insertError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "Quiz Updated!",
        description: "Your quiz has been updated successfully.",
      });

      onOpenChange(false);
      onQuizUpdated();
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to update quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           questions.length > 0 && 
           questions.every(q => 
             q.question_text.trim() && 
             q.correct_answer.trim() && 
             q.wrong_answer_1.trim() && 
             q.wrong_answer_2.trim() && 
             q.wrong_answer_3.trim()
           );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-title">Quiz Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-difficulty">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                setFormData(prev => ({ ...prev, difficulty: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your quiz"
              rows={3}
            />
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button type="button" onClick={addQuestion} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      Question {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Question Text</Label>
                    <Textarea
                      value={question.question_text}
                      onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                      placeholder="Enter your question"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-green-600">Correct Answer</Label>
                      <Input
                        value={question.correct_answer}
                        onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                        placeholder="Correct answer"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-600">Wrong Answer 1</Label>
                      <Input
                        value={question.wrong_answer_1}
                        onChange={(e) => updateQuestion(index, 'wrong_answer_1', e.target.value)}
                        placeholder="Wrong answer 1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-600">Wrong Answer 2</Label>
                      <Input
                        value={question.wrong_answer_2}
                        onChange={(e) => updateQuestion(index, 'wrong_answer_2', e.target.value)}
                        placeholder="Wrong answer 2"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-600">Wrong Answer 3</Label>
                      <Input
                        value={question.wrong_answer_3}
                        onChange={(e) => updateQuestion(index, 'wrong_answer_3', e.target.value)}
                        placeholder="Wrong answer 3"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions yet. Click "Add Question" to get started.</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !isFormValid()} 
              className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Quiz'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuizModal;
