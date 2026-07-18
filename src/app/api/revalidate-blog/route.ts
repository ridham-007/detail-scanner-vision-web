import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Revalidate the blog listing and post pages on demand (e.g. after
// create/update/delete/publish) so production reflects changes immediately
// instead of waiting for the ISR `revalidate` window to elapse.
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json().catch(() => ({ slug: undefined }));

    revalidatePath('/blog', 'page');
    revalidatePath('/blog/[slug]', 'page');
    // Home page surfaces recent posts too
    revalidatePath('/', 'page');

    if (slug) {
      revalidatePath(`/blog/${slug}`, 'page');
    }

    return NextResponse.json({ revalidated: true, slug: slug ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Revalidation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
