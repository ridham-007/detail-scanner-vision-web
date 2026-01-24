import React from 'react';
import UserProfilePage from '@/views/UserProfilePage';
import { Metadata } from 'next';
import { supabase } from '@/integrations/supabase/client';

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { username } = await params;

  // Fetch data
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, bio, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) {
    return {
      title: 'User Not Found | EaterIQ',
    };
  }

  return {
    title: `${profile.username} | EaterIQ Profile`,
    description: profile.bio || `Check out ${profile.username}'s profile on EaterIQ.`,
    openGraph: {
      title: `${profile.username} | EaterIQ Profile`,
      description: profile.bio || undefined,
      images: [profile.avatar_url || '/avatar-placeholder.png'],
    },
  };
}

export default function Page() {
  return <UserProfilePage />;
}
