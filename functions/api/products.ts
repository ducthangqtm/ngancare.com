// Cloudflare Pages Function: GET /api/products
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

    if (env && env.DB) {
      // Ensure products table exists
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            price REAL,
            description TEXT,
            features TEXT,
            image_url TEXT,
            affiliate_url TEXT,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run();
      } catch (e) {}

      const { results } = await env.DB.prepare(
        'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at ASC'
      ).all();

      const mapped = results.map((r: any) => ({
        ...r,
        category: 'san_pham',
        features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : r.features || [],
        affiliate_url: r.affiliate_url || '',
      }));

      return new Response(JSON.stringify({ success: true, data: mapped }), {
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
