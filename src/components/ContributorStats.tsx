import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  useProductSubmission,
  ContributionLevel,
  Badge as ContributorBadge,
} from "@/hooks/useProductSubmission";
import {
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Star,
  Crown,
  Trophy,
  Database,
  Coins,
  HandHelping,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-5 h-5" />,
  crown: <Crown className="w-5 h-5" />,
  trophy: <Trophy className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  coins: <Coins className="w-5 h-5" />,
  target: <Target className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  "hand-helping": <HandHelping className="w-5 h-5" />,
};

export function ContributorStats() {
  const {
    getContributionLevel,
    getUserBadges,
    getAvailableBadges,
    isLoggedIn,
  } = useProductSubmission();
  const [stats, setStats] = useState<ContributionLevel | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<ContributorBadge[]>([]);
  const [allBadges, setAllBadges] = useState<ContributorBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      const [level, badges, available] = await Promise.all([
        getContributionLevel(),
        getUserBadges(),
        getAvailableBadges(),
      ]);

      setStats(level);
      setEarnedBadges(badges);
      setAllBadges(available);
      setLoading(false);
    };

    fetchData();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Sign in to view your contribution stats
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierColors = {
    guest: "bg-muted text-muted-foreground",
    logged_in: "bg-primary/10 text-primary",
    verified:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  const tierLabels = {
    guest: "Guest",
    logged_in: "Member",
    verified: "Verified Contributor",
  };

  const nextTierProgress = stats
    ? Math.min((stats.approvedSubmissions / 10) * 100, 100)
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Contribution Level</CardTitle>
            <Badge className={tierColors[stats?.tier || "logged_in"]}>
              {tierLabels[stats?.tier || "logged_in"]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {stats?.contributionPoints || 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Coins className="w-3 h-3" /> Points
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {stats?.totalSubmissions || 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" /> Submitted
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats?.approvedSubmissions || 0}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Approved
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {stats?.accuracyRate?.toFixed(0) || 0}%
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Target className="w-3 h-3" /> Accuracy
              </div>
            </div>
          </div>

          {stats?.tier !== "verified" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress to Verified
                </span>
                <span className="font-medium">
                  {stats?.approvedSubmissions || 0}/10 approved
                </span>
              </div>
              <Progress value={nextTierProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Get 10 approved submissions with 80%+ accuracy to become a
                Verified Contributor
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" /> Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allBadges.map((badge) => {
              const isEarned = earnedBadges.some((eb) => eb.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isEarned
                      ? "bg-primary/5 border-primary/30"
                      : "bg-muted/40 border-border"
                  }`}
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      isEarned
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {iconMap[badge.icon] || <Star className="w-5 h-5" />}
                  </div>
                  <div className="text-xs font-medium truncate text-foreground">
                    {badge.name}
                  </div>
                  {isEarned && (
                    <CheckCircle2 className="w-4 h-4 mx-auto mt-1 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
