import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://tzxvlfemmamhrxtcqfhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { data, error } = await supabaseAdmin.storage
    .from('blog-images')
    .list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const files = (data ?? [])
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => ({
      name: f.name,
      url: `https://images.eateriq.com/blog-images/${f.name}`,
      createdAt: f.created_at,
      size: f.metadata?.size ?? 0,
    }));

  return NextResponse.json({ files });
}
