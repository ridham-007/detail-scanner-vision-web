import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://tzxvlfemmamhrxtcqfhz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const CDN_BASE = 'https://images.eateriq.com/blog-images';

export async function POST(request: NextRequest) {
  try {
    const { oldName, newName } = await request.json();

    if (!oldName || !newName) {
      return NextResponse.json({ error: 'oldName and newName are required' }, { status: 400 });
    }

    const newFileName = newName.endsWith('.webp') ? newName : `${newName}.webp`;

    // Rename file in Supabase storage
    const { error: moveError } = await supabaseAdmin.storage
      .from('blog-images')
      .move(oldName, newFileName);

    if (moveError) {
      return NextResponse.json({ error: moveError.message }, { status: 500 });
    }

    const oldUrl = `${CDN_BASE}/${oldName}`;
    const newUrl = `${CDN_BASE}/${newFileName}`;

    // Update featured_image_url in blog_posts
    await supabaseAdmin
      .from('blog_posts')
      .update({ featured_image_url: newUrl })
      .eq('featured_image_url', oldUrl);

    // Update og_image / twitter_image if they reference the same file
    await supabaseAdmin
      .from('blog_posts')
      .update({ og_image: newUrl })
      .eq('og_image', oldUrl);

    await supabaseAdmin
      .from('blog_posts')
      .update({ twitter_image: newUrl })
      .eq('twitter_image', oldUrl);

    return NextResponse.json({ success: true, newUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Rename failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
