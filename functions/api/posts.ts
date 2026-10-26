// Cloudflare Pages Function: GET /api/posts
interface Env {
  DB: D1Database;
}

// Helper: Ensure posts table exists (No auto-seed)
async function ensurePostsTable(db: D1Database) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image TEXT,
        category TEXT DEFAULT 'KienThucMeBe',
        author TEXT DEFAULT 'Điều Dưỡng Nguyễn Thúy Ngân',
        views INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 1,
        meta_title TEXT,
        meta_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (e) {}
}


export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('q');

    if (env && env.DB) {
      await ensurePostsTable(env.DB);

      let query = 'SELECT id, title, slug, excerpt, cover_image, category, author, views, created_at FROM posts WHERE is_published = 1';
      const params: any[] = [];

      if (category && category !== 'all' && category !== 'Tất cả') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (title LIKE ? OR excerpt LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY created_at DESC';

      const stmt = env.DB.prepare(query);
      const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

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
