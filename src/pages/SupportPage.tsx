import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, MessageCircle, HelpCircle, Bug, Lightbulb, Mail, Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useRateLimit } from '@/hooks/useRateLimit';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SEOHead from '@/components/SEOHead';

const SupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });

  // Rate limiting: 3 submissions per 5 minutes
  const { isLimited, checkRateLimit, recordAttempt, getRemainingCooldown } = useRateLimit({
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000,
    cooldownMs: 60 * 1000,
  });

  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (isLimited) {
      const interval = setInterval(() => {
        const remaining = getRemainingCooldown();
        setCooldownSeconds(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLimited, getRemainingCooldown]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit()) {
      toast({
        title: "Too many submissions",
        description: `Please wait ${getRemainingCooldown()} seconds before submitting again.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    recordAttempt();

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          category: formData.category,
          subject: formData.subject,
          message: formData.message
        }]);

      if (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "Failed to submit your message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const faqItems = [
    {
      question: "How does the barcode scanner work?",
      answer: "Our barcode scanner analyzes product information and provides instant health scores. Simply point your camera at any barcode, and our system will process the nutritional data to give you personalized insights and recommendations."
    },
    {
      question: "How are health scores calculated?",
      answer: "Health scores are calculated using our proprietary algorithm that analyzes multiple factors including nutritional content, ingredient quality, processing level, and dietary guidelines. The score ranges from 1-100, with higher scores indicating healthier choices."
    },
    {
      question: "Can I create custom quizzes?",
      answer: "Yes! Registered users can create custom quizzes using our quiz generator. Simply provide a topic or prompt, choose the difficulty level, and the system will generate engaging questions for you."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use enterprise-grade security measures including end-to-end encryption, secure cloud infrastructure, and strict access controls. Your personal data is never shared with third parties without your consent."
    },
    {
      question: "What should I do if a barcode scan returns incorrect information?",
      answer: "If you encounter incorrect product information, please report it through this support page. We continuously improve our database and appreciate user feedback to maintain accuracy."
    },
    {
      question: "How do leaderboards work in quizzes?",
      answer: "Leaderboards rank users based on their total quiz scores and completion rates. Scores are calculated based on correct answers, quiz difficulty, and completion time. Rankings are updated in real-time."
    },
    {
      question: "Can I use EaterIQ offline?",
      answer: "Currently, EaterIQ requires an internet connection for barcode scanning and product analysis."
    }
  ];

  return (
    <>
      <SEOHead
        title="Support Center | EaterIQ"
        description="Get help with EaterIQ. Contact our support team, report bugs, request features, or browse FAQs."
        keywords="support, help, FAQ, contact, bug report, feature request"
        canonicalUrl="https://www.eateriq.com/support/"
      />
      <div className="min-h-screen bg-background">
        <AnimatedBackground />

      <main className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        <div className="flex flex-col gap-4 mb-8">
          {/* <Button variant="outline" onClick={() => navigate('/')} size="sm" className='w-fit'>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button> */}
          <div className='flex flex-col w-full !justify-center items-center'>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              Support Center
            </h1>
            <h2 className="text-sm text-muted-foreground text-center">Get help with EaterIQ</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-6">
            {isLimited && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Too many submissions. Please wait {cooldownSeconds} seconds before trying again.
                </AlertDescription>
              </Alert>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className='space-y-1'>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                        disabled={isSubmitting}
                        className="border border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300"
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={isSubmitting}
                        className="border border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      disabled={isSubmitting}

                    >
                      <SelectTrigger className="border border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="account">Account Issue</SelectItem>
                        <SelectItem value="privacy">Privacy Concern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-1'>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                      disabled={isSubmitting}
                      className="border border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300"

                    />
                  </div>

                  <div className='space-y-1'>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please describe your issue or question in detail..."
                      rows={5}
                      required
                      disabled={isSubmitting}
                      className="border border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300"

                    />
                  </div>

                  <Button
                    aria-label="Send Message"
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Other Ways to Reach Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Bug className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Bug Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      Found a bug? Help us improve by reporting it with detailed steps to reproduce.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Feature Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      Have an idea for a new feature? We'd love to hear your suggestions!
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Response Time:</strong> We typically respond within 24 hours during business days.
                    For urgent issues, please mark your message as "Technical Issue" for faster processing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default SupportPage;
