import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedBackground />

      <main className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* <Button variant="outline" onClick={() => navigate('/')} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button> */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <h2 className="text-sm text-muted-foreground text-center">
              Your agreement with EaterIQ
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Agreement Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Welcome to EaterIQ! These Terms of Service ("Terms") govern your
                use of our AI-powered food intelligence platform and quiz
                services. By accessing or using EaterIQ, you agree to be bound
                by these Terms.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Accounts & Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Creation</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• You must provide accurate and complete information</li>
                  <li>
                    • You are responsible for maintaining account security
                  </li>
                  <li>• One account per person is permitted</li>
                  <li>
                    • You must be at least 13 years old to use our service
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Acceptable Use</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Use EaterIQ for personal, non-commercial purposes</li>
                  <li>• Do not share false or misleading information</li>
                  <li>
                    • Respect other users and maintain a positive community
                  </li>
                  <li>
                    • Do not attempt to reverse engineer or hack our services
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Food Intelligence Features
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• AI-powered barcode scanning and product analysis</li>
                  <li>• Health scores and nutritional information</li>
                  <li>• Personalized food recommendations</li>
                  <li>• Scanning history and progress tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quiz Platform</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• AI-generated quizzes on various topics</li>
                  <li>• User-created quiz content</li>
                  <li>• Scoring system and leaderboards</li>
                  <li>• Social features and community interaction</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Content & Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">User-Generated Content</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  When you create quizzes or submit content to EaterIQ:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• You retain ownership of your original content</li>
                  <li>
                    • You grant us a license to use, display, and distribute
                    your content
                  </li>
                  <li>
                    • You are responsible for ensuring your content doesn't
                    infringe others' rights
                  </li>
                  <li>
                    • We may remove content that violates our community
                    guidelines
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Our Intellectual Property
                </h3>
                <p className="text-sm text-muted-foreground">
                  EaterIQ's technology, algorithms, design, and branding are our
                  intellectual property. You may not copy, modify, or
                  redistribute our proprietary technology.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-red-600" />
                Disclaimers & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Health Information Disclaimer
                </h3>
                <p className="text-sm text-muted-foreground">
                  EaterIQ provides nutritional information and health scores for
                  educational purposes only. Our AI analysis should not be
                  considered medical advice. Always consult healthcare
                  professionals for dietary and health decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>
                    • We strive for 99% uptime but cannot guarantee
                    uninterrupted service
                  </li>
                  <li>
                    • Features may be added, modified, or removed with notice
                  </li>
                  <li>
                    • We are not liable for temporary service interruptions
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-sm text-muted-foreground">
                  To the maximum extent permitted by law, EaterIQ shall not be
                  liable for any indirect, incidental, special, or consequential
                  damages resulting from your use of our service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. Please review our{" "}
                <Link to={"/privacy"}>
                  <Button
                    aria-label="Privacy Policy"
                    variant="link"
                    className="p-0 h-auto font-semibold text-emerald-600"
                  >
                    Privacy Policy
                  </Button>
                </Link>{" "}
                to understand how we collect, use, and protect your personal
                information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Either party may terminate this agreement at any time:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>
                    • You may delete your account through the settings page
                  </li>
                  <li>
                    • We may suspend or terminate accounts that violate these
                    terms
                  </li>
                  <li>
                    • Upon termination, your access to the service will be
                    discontinued
                  </li>
                  <li>
                    • Some provisions of these terms may survive termination
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update these Terms periodically. Significant changes will
                be communicated through our platform or via email. Continued use
                of EaterIQ after changes constitutes acceptance of the updated
                Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Questions about these Terms? Contact us through our{" "}
                <Link to="/support">
                  <Button
                    aria-label="Support Page"
                    variant="link"
                    className="p-0 h-auto font-semibold text-emerald-600"
                  >
                    support page
                  </Button>
                </Link>
                . We're here to help!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
