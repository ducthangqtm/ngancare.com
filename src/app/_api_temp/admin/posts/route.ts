import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';
import { BlogPost } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await localDb.getAllPostsAdmin();
    return NextResponse.json({ success: true, data: posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category,
      author,
      is_published,
      meta_title,
      meta_description,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề, slug và nội dung không được để trống.' },
        { status: 400 }
      );
    }

    const newPost: BlogPost = {
      id: 'post-' + Date.now(),
      title,
      slug,
      excerpt: excerpt || '',
      content,
      cover_image: cover_image || '/images/banner.jpg',
      category: category || 'KienThucMeBe',
      author: author || 'Điều Dưỡng Nguyễn Thúy Ngân',
      views: 0,
      is_published: is_published !== undefined ? is_published : 1,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || '',
      created_at: new Date().toISOString(),
    };

    const saved = await localDb.createPost(newPost);
    return NextResponse.json({ success: true, message: 'Tạo bài viết thành công', data: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu id bài viết' }, { status: 400 });
    }

    const updated = await localDb.updatePost(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Cập nhật bài viết thành công', data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu id bài viết cần xóa' }, { status: 400 });
    }

    const deleted = await localDb.deletePost(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết để xóa' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
