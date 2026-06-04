import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

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

    // Update all exact-match URL columns in one pass
    const urlColumns = ['featured_image_url', 'og_image', 'twitter_image'] as const;
    await Promise.all(
      urlColumns.map((col) =>
        supabaseAdmin
          .from('blog_posts')
          .update({ [col]: newUrl })
          .eq(col, oldUrl),
      ),
    );

    // Update the old URL inside rich-text content (embedded <img> tags etc.)
    const { data: postsWithOldUrl } = await supabaseAdmin
      .from('blog_posts')
      .select('id, content')
      .ilike('content', `%${oldUrl}%`);

    if (postsWithOldUrl && postsWithOldUrl.length > 0) {
      await Promise.all(
        postsWithOldUrl
          .filter((post) => post.content)
          .map((post) =>
            supabaseAdmin
              .from('blog_posts')
              .update({ content: (post.content as string).replaceAll(oldUrl, newUrl) })
              .eq('id', post.id),
          ),
      );
    }

    revalidatePath('/blog', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/', 'page');

    return NextResponse.json({ success: true, newUrl, updatedPosts: postsWithOldUrl?.length ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Rename failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
