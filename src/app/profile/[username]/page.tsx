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

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, bio, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) {
    return {
      title: 'User Not Found | EaterIQ',
    };
  }

  const displayName = profile.full_name || profile.username;

  return {
    title: `${displayName} | EaterIQ Profile`,
    description: profile.bio || `Check out ${displayName}'s profile on EaterIQ.`,
    openGraph: {
      title: `${displayName} | EaterIQ Profile`,
      description: profile.bio || undefined,
      images: [profile.avatar_url || '/avatar-placeholder.png'],
    },
  };
}

export default function Page() {
  return <UserProfilePage />;
}
