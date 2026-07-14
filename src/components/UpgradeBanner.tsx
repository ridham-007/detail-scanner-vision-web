import React from 'react';
import { Crown, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradeBannerProps {
  scansRemaining?: number;
  maxScans?: number;
  variant?: 'compact' | 'full';
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ 
  scansRemaining = 0, 
  maxScans = 5,
  variant = 'full' 
}) => {
  const router = useRouter();
  const { tier } = useSubscription();

  // Don't show for paid users
  if (tier !== 'free') return null;

  const percentage = Math.max(0, (scansRemaining / maxScans) * 100);
  const isLow = scansRemaining <= 2;
  const isEmpty = scansRemaining <= 0;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between gap-3 rounded-[24px] border px-4 py-3 shadow-[var(--shadow-soft)] ${
        isEmpty 
          ? 'border-red-200/80 bg-red-50/90' 
          : isLow 
          ? 'border-amber-200/80 bg-amber-50/90' 
          : 'border-white/70 bg-white/80'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-2 ${isEmpty ? 'bg-red-100 text-red-600' : isLow ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-primary'}`}>
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">
            {isEmpty 
              ? "No scans left today" 
              : `${scansRemaining} scan${scansRemaining !== 1 ? 's' : ''} left today`
            }
          </span>
        </div>
        <Button 
          size="sm" 
          variant={isEmpty ? "default" : "outline"}
          onClick={() => router.push('/download')}
          className="gap-1 rounded-full border-orange-200/80 bg-primary text-white shadow-[var(--shadow-soft)]"
        >
          <Crown className="w-3 h-3" />
          Upgrade
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[28px] border p-6 shadow-product ${
      isEmpty 
        ? 'border-red-200/70 bg-[linear-gradient(180deg,rgba(254,242,242,0.98),rgba(255,255,255,0.96))]' 
        : 'border-white/70 bg-[linear-gradient(180deg,rgba(255,237,213,0.8),rgba(255,250,244,0.98))]'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-2xl p-3 shadow-[var(--shadow-soft)] ${isEmpty ? 'bg-red-100 text-red-600' : 'bg-white/90 text-primary'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {isEmpty 
                ? "You've reached your daily limit" 
                : `${scansRemaining} free scan${scansRemaining !== 1 ? 's' : ''} remaining`
              }
            </h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            {isEmpty 
              ? "Upgrade to Pro for unlimited scans and personalized health insights."
              : "Unlock unlimited scans, full history, and personalized insights with Pro."
            }
          </p>
          
          {/* Progress bar */}
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-orange-100/80">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <Button 
          onClick={() => router.push('/download')}
          className="gap-2 whitespace-nowrap rounded-full shadow-[var(--shadow-warm)]"
          size="lg"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UpgradeBanner;
