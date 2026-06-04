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
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    // Delete from Supabase storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from('blog-images')
      .remove([fileName]);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const deletedUrl = `${CDN_BASE}/${fileName}`;

    // Clear exact-match URL columns
    const urlColumns = ['featured_image_url', 'og_image', 'twitter_image'] as const;
    await Promise.all(
      urlColumns.map((col) =>
        supabaseAdmin
          .from('blog_posts')
          .update({ [col]: null })
          .eq(col, deletedUrl),
      ),
    );

    // Clear from rich-text content
    const { data: postsWithUrl } = await supabaseAdmin
      .from('blog_posts')
      .select('id, content')
      .ilike('content', `%${deletedUrl}%`);

    if (postsWithUrl && postsWithUrl.length > 0) {
      await Promise.all(
        postsWithUrl
          .filter((post) => post.content)
          .map((post) =>
            supabaseAdmin
              .from('blog_posts')
              .update({ content: (post.content as string).replaceAll(deletedUrl, '') })
              .eq('id', post.id),
          ),
      );
    }

    revalidatePath('/blog', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/', 'page');

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
