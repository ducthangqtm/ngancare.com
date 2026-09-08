// Cloudflare Pages Function: GET /api/posts/:slug
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env, 'slug'> = async (context) => {
  try {
    const { params, env } = context;
    const slug = params.slug as string;

    if (!slug) {
      return new Response(JSON.stringify({ success: false, error: 'Slug không hợp lệ' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (env && env.DB) {
      const post = await env.DB.prepare('SELECT * FROM posts WHERE slug = ? AND is_published = 1')
        .bind(slug)
        .first();

      if (!post) {
        return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy bài viết' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Increment view count in background
      context.waitUntil(
        env.DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(post.id).run()
      );

      return new Response(JSON.stringify({ success: true, data: post }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Database chưa kết nối' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
