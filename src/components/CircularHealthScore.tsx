
import React from 'react';

interface CircularHealthScoreProps {
  score: number;
  size?: number;
}

const CircularHealthScore: React.FC<CircularHealthScoreProps> = ({ 
  score, 
  size = 120 
}) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div 
      className="flex flex-col items-center space-y-2"
      role="figure"
      aria-label={`Health score: ${score} out of 100, rated ${getScoreLabel(score)}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 animate-fade-in"
          width={size}
          height={size}
          viewBox="0 0 100 100"
          role="img"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="text-2xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: getScoreColor(score) }}>
          {getScoreLabel(score)}
        </p>
        <p className="text-xs text-muted-foreground">Health Score</p>
      </div>
    </div>
  );
};

export default CircularHealthScore;
