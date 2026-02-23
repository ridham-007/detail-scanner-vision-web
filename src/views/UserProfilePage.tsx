"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Globe,
  MapPin,
  Calendar,
  Trophy,
  Play,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import QuizCard from "@/components/QuizCard";
import SEOHead from "@/components/SEOHead";
import Image from "next/image";

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  total_score: number | null;
  quizzes_completed: number | null;
  created_at: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  created_at: string | null;
  creator_id: string;
  slug: string | null;
  is_published: boolean | null; // ✅ ADD THIS
}

const UserProfilePage = () => {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    if (!username) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, username, bio, website, avatar_url, total_score, quizzes_completed, created_at",
        )
        .eq("username", username)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast({
            title: "User not found",
            description: "The user profile you're looking for doesn't exist.",
            variant: "destructive",
          });
          router.push("/");
          return;
        }
        throw error;
      }

      setProfile(data);
      fetchUserQuizzes(data.id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQuizzes = async (userId: string) => {
    setQuizzesLoading(true);
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select(
          "id, title, description, difficulty, created_at, creator_id, slug, is_published",
        )
        .eq("creator_id", userId)
        // .eq('is_published', true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setQuizzes(data || []);
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      toast({
        title: "Error",
        description: "Failed to load user quizzes",
        variant: "destructive",
      });
    } finally {
      setQuizzesLoading(false);
    }
  };

  const handleQuizUpdated = () => {
    if (profile?.id) {
      fetchUserQuizzes(profile.id);
    }
  };

  const handlePlayQuiz = (slug: string) => {
    router.push(`/quiz/${slug}`);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <p className="text-muted-foreground">
              The user profile you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${profile.username}'s Profile | EaterIQ`}
        description={
          profile.bio ||
          `View ${profile.username}'s profile, quiz scores, and created quizzes on EaterIQ.`
        }
        keywords="user profile, quiz creator, EaterIQ user"
        canonicalUrl={`https://www.eateriq.com/user/${profile.username}/`}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-24 w-24 overflow-hidden">
                    <AvatarImage
                      alt={`${profile.username}'s profile picture`}
                      src={
                        profile.avatar_url
                          ? profile.avatar_url.replace(/=s\d+-c/, "=s256-c")
                          : undefined
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold">
                          {profile.username}
                        </h1>
                        <p className="text-muted-foreground">
                          @{profile.username}
                        </p>
                        {profile.bio && (
                          <p className="mt-2 text-muted-foreground">
                            {profile.bio}
                          </p>
                        )}
                      </div>

                      <Button
                        aria-label="Share Profile"
                        onClick={handleShareProfile}
                        variant="outline"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Share Profile
                      </Button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {profile.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary underline"
                          >
                            {profile.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined{" "}
                          {new Date(
                            profile.created_at || Date.now(),
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {profile.total_score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Score
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.quizzes_completed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quizzes Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {quizzes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quizzes Created
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Created Quizzes */}
            <Card>
              <CardHeader>
                <h2 className="!flex gap-2 items-center font-semibold leading-none tracking-tight text-base sm:text-lg mb-2 line-clamp-2 capitalize">
                  <Trophy className="h-5 w-5" />
                  Created Quizzes
                </h2>
              </CardHeader>
              <CardContent>
                {quizzesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : quizzes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onPlay={handlePlayQuiz}
                        onQuizUpdated={handleQuizUpdated}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No quizzes yet
                    </h3>
                    <p className="text-muted-foreground">
                      {profile.username} hasn't created any public quizzes yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
