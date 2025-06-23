
import React, { useEffect, useRef } from 'react';
import { Heart, Github, Star, Brain, Zap, Award, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(footerRef.current?.querySelectorAll('.footer-section'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
      }
    });
  }, []);

  return (
    <footer ref={footerRef} className="border-t bg-background/50 backdrop-blur">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="footer-section space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg">
                <Brain className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl">EaterIQ</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience the future of food intelligence with EaterIQ's AI-powered barcode scanner. 
              Make smarter eating choices with instant health scores and personalized recommendations.
            </p>
          </div>

          {/* Features Section */}
          <div className="footer-section space-y-4">
            <h3 className="font-semibold text-base md:text-lg">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Award className="h-4 w-4 text-emerald-500" />
                <span>Health Score Analysis</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Brain className="h-4 w-4 text-blue-500" />
                <span>AI-Powered Insights</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>Smart Recommendations</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-foreground transition-colors">
                <Users className="h-4 w-4 text-green-500" />
                <span>Real-time Scanning</span>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="footer-section space-y-4">
            <h3 className="font-semibold text-base md:text-lg">Connect</h3>
            <div className="flex space-x-4">
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors hover:scale-110 duration-200">
                <Github className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors hover:scale-110 duration-200">
                <Star className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Built with modern web technologies for intelligent food choices.
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2024 EaterIQ. Made with{' '}
              <Heart className="inline h-4 w-4 text-red-500 animate-pulse" />{' '}
              for smarter eating
            </p>
            <div className="flex space-x-4 md:space-x-6 text-sm text-muted-foreground">
              <button 
                onClick={() => navigate('/privacy')}
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="hover:text-foreground transition-colors"
              >
                Terms
              </button>
              <button 
                onClick={() => navigate('/support')}
                className="hover:text-foreground transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
