import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q');

    let posts = await localDb.getPublishedPosts();

    if (category && category !== 'all' && category !== 'Tất cả') {
      posts = posts.filter((p) => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, data: posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
