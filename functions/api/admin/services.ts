// Cloudflare Pages Function: /api/admin/services (GET, POST, PUT, DELETE)
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    if (env && env.DB) {
      const { results } = await env.DB.prepare('SELECT * FROM services ORDER BY created_at ASC').all();
      const mapped = results.map((r: any) => ({
        ...r,
        features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : r.features || [],
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
    const { name, slug, category, price, duration, description, features, image_url, affiliate_url, is_active } = body;

    if (!name || !slug || !category) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tên, slug và danh mục không được để trống.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = (category === 'san_pham' ? 'sp-' : 'srv-') + Date.now();
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    if (env && env.DB) {
      try {
        // Try insert with affiliate_url
        await env.DB.prepare(`
          INSERT INTO services (id, name, slug, category, price, duration, description, features, image_url, affiliate_url, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `)
          .bind(
            id,
            name,
            slug,
            category,
            price !== undefined ? price : null,
            duration !== undefined ? duration : null,
            description || '',
            featuresJson,
            image_url || '/images/banner.jpg',
            affiliate_url || '',
            is_active !== undefined ? is_active : 1
          )
          .run();
      } catch (colErr) {
        // Fallback without affiliate_url if column not added yet
        await env.DB.prepare(`
          INSERT INTO services (id, name, slug, category, price, duration, description, features, image_url, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `)
          .bind(
            id,
            name,
            slug,
            category,
            price !== undefined ? price : null,
            duration !== undefined ? duration : null,
            description || '',
            featuresJson,
            image_url || '/images/banner.jpg',
            is_active !== undefined ? is_active : 1
          )
          .run();
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Thêm thành công!', data: { id, name } }),
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
    const { id, name, slug, category, price, duration, description, features, image_url, affiliate_url, is_active } = body;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu ID cần cập nhật.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    if (env && env.DB) {
      try {
        // Try update with affiliate_url
        await env.DB.prepare(`
          UPDATE services 
          SET name = ?, slug = ?, category = ?, price = ?, duration = ?, description = ?, features = ?, image_url = ?, affiliate_url = ?, is_active = ?
          WHERE id = ?
        `)
          .bind(
            name,
            slug,
            category,
            price !== undefined ? price : null,
            duration !== undefined ? duration : null,
            description || '',
            featuresJson,
            image_url || '/images/banner.jpg',
            affiliate_url !== undefined ? affiliate_url : '',
            is_active !== undefined ? is_active : 1,
            id
          )
          .run();
      } catch (colErr) {
        // Fallback without affiliate_url if column not added yet
        await env.DB.prepare(`
          UPDATE services 
          SET name = ?, slug = ?, category = ?, price = ?, duration = ?, description = ?, features = ?, image_url = ?, is_active = ?
          WHERE id = ?
        `)
          .bind(
            name,
            slug,
            category,
            price !== undefined ? price : null,
            duration !== undefined ? duration : null,
            description || '',
            featuresJson,
            image_url || '/images/banner.jpg',
            is_active !== undefined ? is_active : 1,
            id
          )
          .run();
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Cập nhật thành công!' }),
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
      await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Đã xóa thành công.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
