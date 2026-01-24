import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import SEOHead from '@/components/SEOHead';

const PrivacyPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | EaterIQ"
        description="Learn how EaterIQ protects your privacy and handles your personal data. Read our comprehensive privacy policy."
        keywords="privacy policy, data protection, EaterIQ privacy, personal data"
        canonicalUrl="https://www.eateriq.com/privacy/"
      />
      <div className="min-h-screen bg-background">
      <AnimatedBackground />

      <main className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="flex flex-col gap-4 mb-8">
          {/* Back to Home Link */}
          {/* <Link
            to="/"
            className="flex items-center w-fit px-3 py-1 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link> */}

          <div className="flex flex-col w-full !justify-center items-center">
            <h1 className="text-3xl sm:text-4xl !h-11 font-bold text-primary">
              Privacy Policy
            </h1>
            <h2 className="text-sm text-muted-foreground text-center">
              How we protect and handle your data
            </h2>
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
                This privacy policy explains how we collect, use, and safeguard your data when you use our food
                analysis platform and quiz services.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: December 22, 2025
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
                <li>• <strong>Performance:</strong> To improve our analysis tools and user experience</li>
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
              <CardTitle>Cookies & Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site (with your consent)</li>
                <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                You can manage your cookie preferences through our cookie consent banner or your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services & Advertising</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We may display advertisements from third-party ad networks. These networks may use cookies to serve ads based on your prior visits to our website or other websites.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Google AdSense:</strong> We may use Google AdSense to display advertisements. Google uses cookies to serve ads based on your interests.</li>
                <li>• <strong>Opt-Out:</strong> You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a></li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You may opt out of personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.aboutads.info</a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We retain your personal data only for as long as necessary:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Account Data:</strong> Retained until you delete your account</li>
                <li>• <strong>Scan History:</strong> Retained for 2 years or until account deletion</li>
                <li>• <strong>Analytics Data:</strong> Anonymized and retained for up to 26 months</li>
                <li>• <strong>Support Inquiries:</strong> Retained for 3 years for quality assurance</li>
              </ul>
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
                <Link
                  to="/support"
                  aria-label="Support Page"
                  className="p-0 h-auto font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                >
                  support page
                </Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </>
  );
};

export default PrivacyPage;
