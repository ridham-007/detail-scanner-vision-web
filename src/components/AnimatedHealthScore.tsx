import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp } from 'lucide-react';

interface AnimatedHealthScoreProps {
  score: number;
  size?: number;
  categoryRank?: number;
  categoryTotal?: number;
}

const AnimatedHealthScore: React.FC<AnimatedHealthScoreProps> = ({ 
  score, 
  size = 160,
  categoryRank,
  categoryTotal
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    let currentScore = 0;
    
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
        // Show confetti for high scores
        if (score >= 80) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } else {
        setAnimatedScore(Math.round(currentScore));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'hsl(var(--health-excellent))';
    if (score >= 60) return 'hsl(var(--health-good))';
    if (score >= 40) return 'hsl(var(--health-fair))';
    return 'hsl(var(--health-poor))';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getGradientId = (score: number) => {
    if (score >= 80) return 'greenGradient';
    if (score >= 60) return 'yellowGradient';
    if (score >= 40) return 'orangeGradient';
    return 'redGradient';
  };

  return (
    <div className="flex flex-col items-center space-y-4 relative p-6 rounded-3xl bg-white dark:bg-card shadow-[var(--shadow-health-score)] border border-border/20">
      {/* Confetti Effect for High Scores */}
      {showConfetti && (
        <div className="absolute -inset-8 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-bounce ${
                ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400'][i % 5]
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--health-excellent))" />
              <stop offset="100%" stopColor="hsl(var(--health-excellent) / 0.8)" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--health-good))" />
              <stop offset="100%" stopColor="hsl(var(--health-good) / 0.8)" />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--health-fair))" />
              <stop offset="100%" stopColor="hsl(var(--health-fair) / 0.8)" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--health-poor))" />
              <stop offset="100%" stopColor="hsl(var(--health-poor) / 0.8)" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
            className="dark:stroke-gray-700"
          />
          
          {/* Animated progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={`url(#${getGradientId(animatedScore)})`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(0,0,0,0.1))"
          />

          {/* Glow effect for high scores */}
          {animatedScore >= 80 && (
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getScoreColor(animatedScore)}
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="animate-pulse opacity-80"
              strokeLinecap="round"
            />
          )}
        </svg>
        
        {/* Score text with animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className={`text-3xl font-bold transition-all duration-300 ${
              animatedScore >= 80 ? 'text-green-600 scale-110' : 
              animatedScore >= 60 ? 'text-yellow-600' : 
              animatedScore >= 40 ? 'text-orange-600' : 'text-red-600'
            }`}
            style={{ 
              textShadow: animatedScore >= 80 ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      
        <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}
            className="text-base font-bold px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: score >= 80 ? 'hsl(var(--health-excellent))' : 
                              score >= 60 ? 'hsl(var(--health-good))' : 
                              score >= 40 ? 'hsl(var(--health-fair))' : 'hsl(var(--health-poor))',
              color: 'white'
            }}
          >
            {score >= 80 && <Trophy className="w-4 h-4 mr-1" />}
            {getScoreLabel(animatedScore)}
          </Badge>
        </div>
        
        <p className="text-sm font-medium text-foreground">Nutri-Score</p>
        
        {/* Category Ranking */}
        {categoryRank && categoryTotal && (
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span>#{categoryRank} of {categoryTotal} in category</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedHealthScore;