// Cloudflare Pages Function: /api/admin/posts (GET, POST, PUT, DELETE)
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    if (env && env.DB) {
      const { results } = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
      return new Response(JSON.stringify({ success: true, data: results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true, data: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
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
      return new Response(
        JSON.stringify({ success: false, error: 'Tiêu đề, slug và nội dung không được để trống.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = 'post-' + Date.now();

    if (env && env.DB) {
      await env.DB.prepare(`
        INSERT INTO posts (id, title, slug, excerpt, content, cover_image, category, author, views, is_published, meta_title, meta_description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
        .bind(
          id,
          title,
          slug,
          excerpt || '',
          content,
          cover_image || '/images/banner.jpg',
          category || 'KienThucMeBe',
          author || 'Điều Dưỡng Nguyễn Thúy Ngân',
          is_published !== undefined ? is_published : 1,
          meta_title || title,
          meta_description || excerpt || ''
        )
        .run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Tạo bài viết thành công!', data: { id, title, slug } }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    const {
      id,
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

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu ID bài viết.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (env && env.DB) {
      await env.DB.prepare(`
        UPDATE posts 
        SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, category = ?, author = ?, is_published = ?, meta_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(
          title,
          slug,
          excerpt || '',
          content,
          cover_image || '/images/banner.jpg',
          category || 'KienThucMeBe',
          author || 'Điều Dưỡng Nguyễn Thúy Ngân',
          is_published !== undefined ? is_published : 1,
          meta_title || title,
          meta_description || excerpt || '',
          id
        )
        .run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Cập nhật bài viết thành công!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu ID bài viết cần xóa.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (env && env.DB) {
      await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Đã xóa bài viết thành công.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
