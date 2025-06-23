
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, Cookie } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <AnimatedBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/')} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">How we protect and handle your data</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Data Protection Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                At EaterIQ, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This privacy policy explains how we collect, use, and safeguard your data when you use our AI-powered food 
                intelligence platform and quiz services.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Email address and profile information</li>
                  <li>• Username and display name</li>
                  <li>• Authentication data (handled securely by Supabase)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Food Scanning Data</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Barcode scan results and product information</li>
                  <li>• Health scores and nutritional analysis</li>
                  <li>• Scanning history and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quiz Activity</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Quiz scores and completion rates</li>
                  <li>• Created quizzes and their content</li>
                  <li>• Leaderboard rankings and achievements</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Service Provision:</strong> To provide barcode scanning, health analysis, and quiz functionality</li>
                <li>• <strong>Personalization:</strong> To offer personalized food recommendations and quiz suggestions</li>
                <li>• <strong>Performance:</strong> To improve our AI algorithms and user experience</li>
                <li>• <strong>Communication:</strong> To send important updates about your account and our services</li>
                <li>• <strong>Analytics:</strong> To understand usage patterns and improve our platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Data Security & Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use industry-standard security measures to protect your data:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                <li>• <strong>Secure Infrastructure:</strong> Hosted on Supabase with enterprise-grade security</li>
                <li>• <strong>Access Controls:</strong> Strict authentication and authorization protocols</li>
                <li>• <strong>Regular Audits:</strong> Continuous monitoring and security assessments</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-orange-600" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  EaterIQ integrates with the following third-party services:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Supabase:</strong> Database and authentication services</li>
                  <li>• <strong>OpenAI:</strong> AI-powered quiz generation and food analysis</li>
                  <li>• <strong>Product Databases:</strong> For barcode scanning and nutritional information</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  These services have their own privacy policies and security measures that we ensure meet our standards.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                <li>• <strong>Correction:</strong> Update or correct your information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your account and data</li>
                <li>• <strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li>• <strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise these rights, please contact us through our support page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this privacy policy or how we handle your data, 
                please don't hesitate to contact us through our{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-emerald-600"
                  onClick={() => navigate('/support')}
                >
                  support page
                </Button>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
