// Cloudflare Pages Function: /api/admin/products (GET, POST, PUT, DELETE)
interface Env {
  DB: D1Database;
}

// Ensure products table and one-time initialization
export async function ensureProductsTable(db: D1Database) {
  try {
    // 1. Create system_settings table if not exists
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run();

    // 2. Create products table if not exists
    await db.prepare(`
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

    // 3. One-time seeding: only runs once ever so deleted products NEVER reappear
    const checkInit: any = await db.prepare("SELECT value FROM system_settings WHERE key = 'products_initialized'").first();
    if (!checkInit) {
      // First check if products table already has rows
      const countRes: any = await db.prepare('SELECT COUNT(*) as count FROM products').first();
      if (!countRes || countRes.count === 0) {
        // Try migrating from legacy services table if any exist
        try {
          await db.prepare(`
            INSERT OR IGNORE INTO products (id, name, slug, price, description, features, image_url, affiliate_url, is_active)
            SELECT id, name, slug, price, description, features, image_url, affiliate_url, is_active 
            FROM services WHERE category = 'san_pham'
          `).run();
        } catch (e) {}

        // If still empty, insert the initial 4 natural products
        const countAfter: any = await db.prepare('SELECT COUNT(*) as count FROM products').first();
        if (!countAfter || countAfter.count === 0) {
          await db.prepare(`
            INSERT INTO products (id, name, slug, price, description, features, image_url, affiliate_url, is_active)
            VALUES 
            ('sp-01', 'Cao Chè Vằng Sẻ Quảng Trị Nguyên Chất', 'cao-che-vang-se-nguyen-chat', 180000, 
             'Chiết xuất 100% từ lá chè vằng sẻ tự nhiên Quảng Trị, giúp kích thích tuyến sữa hoạt động mạnh mẽ, sữa đặc sánh thơm ngon.',
             '["100% nguyên chất không chất bảo quản","Kích sữa về nhanh sánh đặc"]', '/images/banner.jpg', 'https://shopee.vn', 1),
            ('sp-02', 'Cốt Gừng Nghệ Hạt Gấc Hạ Thổ 3 Tháng 10 Ngày', 'cot-gung-nghe-hat-gac-ha-tho', 250000,
             'Bài thuốc cổ truyền làm ấm cơ thể, phòng chống gió máy hậu sản, dưỡng sáng mờ thâm rạn da bụng.',
             '["Gừng ta và nghệ nếp nguyên chất","Giữ ấm cơ thể tránh cảm lạnh"]', '/images/banner.jpg', 'https://shopee.vn', 1),
            ('sp-03', 'Tinh Dầu Tràm Gió Huế Nguyên Chất', 'tinh-dau-tram-hue-nguyen-chat', 160000,
             'Tinh dầu tràm tự nhiên xứ Huế cô đặc, hương thơm dịu nhẹ an toàn tuyệt đối cho trẻ sơ sinh.',
             '["Chiết xuất lá tràm tự nhiên 100%","Giữ ấm phổi và lòng bàn chân"]', '/images/banner.jpg', 'https://shopee.vn', 1),
            ('sp-04', 'Lá Xông Tắm Thảo Dược Mẹ Sau Sinh Dao Đỏ', 'la-xong-tam-thao-duoc-dao-do', 220000,
             'Bài thuốc lá xông tắm cổ truyền của đồng bào Dao Đỏ hơn 10 vị thảo mộc rừng giúp mẹ hồi phục thể lực.',
             '["Thảo mộc rừng Tây Bắc sấy sạch","Lưu thông khí huyết giảm đau mỏi"]', '/images/banner.jpg', 'https://shopee.vn', 1)
          `).run();
        }
      }

      // Mark as initialized so subsequent deletes won't trigger re-seeding
      await db.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('products_initialized', '1')").run();
    }
  } catch (e) {
    // Ignore error
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    if (env && env.DB) {
      await ensureProductsTable(env.DB);
      const { results } = await env.DB.prepare(
        'SELECT * FROM products ORDER BY created_at ASC'
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    const { name, slug, price, description, features, image_url, affiliate_url, is_active } = body;

    if (!name || !slug) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tên và slug không được để trống.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = 'sp-' + Date.now();
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    if (env && env.DB) {
      await ensureProductsTable(env.DB);
      await env.DB.prepare(`
        INSERT INTO products (id, name, slug, price, description, features, image_url, affiliate_url, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)
        .bind(
          id,
          name,
          slug,
          price !== undefined ? price : null,
          description || '',
          featuresJson,
          image_url || '/images/banner.jpg',
          affiliate_url || '',
          is_active !== undefined ? is_active : 1
        )
        .run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Thêm sản phẩm thành công!', data: { id, name } }),
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
    const { id, name, slug, price, description, features, image_url, affiliate_url, is_active } = body;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu ID cần cập nhật.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    if (env && env.DB) {
      await ensureProductsTable(env.DB);
      await env.DB.prepare(`
        UPDATE products 
        SET name = ?, slug = ?, price = ?, description = ?, features = ?, image_url = ?, affiliate_url = ?, is_active = ?
        WHERE id = ?
      `)
        .bind(
          name,
          slug,
          price !== undefined ? price : null,
          description || '',
          featuresJson,
          image_url || '/images/banner.jpg',
          affiliate_url !== undefined ? affiliate_url : '',
          is_active !== undefined ? is_active : 1,
          id
        )
        .run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Cập nhật sản phẩm thành công!' }),
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
      return new Response(JSON.stringify({ success: false, error: 'Thiếu ID cần xóa.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (env && env.DB) {
      await ensureProductsTable(env.DB);
      await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Đã xóa sản phẩm thành công.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
