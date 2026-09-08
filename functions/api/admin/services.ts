// Cloudflare Pages Function: /api/admin/services (GET, POST, PUT, DELETE)
interface Env {
  DB: D1Database;
}

// Ensure services table and one-time initialization
async function ensureServicesTable(db: D1Database) {
  try {
    // 1. Create system_settings table if not exists
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run();

    // 2. Create services table if not exists
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        price REAL,
        duration INTEGER,
        description TEXT,
        features TEXT,
        image_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 3. One-time seeding: only runs once ever so deleted items NEVER reappear
    const checkInit: any = await db.prepare("SELECT value FROM system_settings WHERE key = 'services_initialized'").first();
    if (!checkInit) {
      const countRes: any = await db.prepare('SELECT COUNT(*) as count FROM services').first();
      if (!countRes || countRes.count === 0) {
        await db.prepare(`
          INSERT INTO services (id, name, slug, category, price, duration, description, features, image_url, is_active)
          VALUES 
          ('srv-01', 'Thông Tắc Tia Sữa & Kích Sữa Tự Nhiên Không Đau', 'thong-tac-tia-sua-khong-dau', 'thong_tac', 350000, 75,
           'Phương pháp massage xoang nang sữa chuẩn y khoa kết hợp máy sóng siêu âm đa tần hiện đại và thảo dược lành tính. Tuyệt đối không nặn bóp thô bạo, giải tỏa cương đau, viêm tắc tức thì, kích hoạt phản xạ xuống sữa mạnh mẽ.',
           '["Không đau đớn, không bóp nặn làm dập nát nang sữa","Công nghệ sóng siêu âm đa tần đánh tan cục tắc sâu","Chườm đắp thảo dược làm dịu cơn sốt cương vú","Hướng dẫn mẹ tư thế bế và chỉnh khớp ngậm đúng tại nhà"]',
           '/images/banner.jpg', 1),
          ('srv-02', 'Tắm Bé Sơ Sinh & Massage Vận Động Sớm Chuẩn Y Khoa', 'tam-be-so-sinh-chuan-y-khoa', 'tam_be', 150000, 45,
           'Quy trình tắm và vệ sinh cuống rốn vô khuẩn 100% do Điều dưỡng chuyên khoa trực tiếp thực hiện. Kết hợp massage toàn thân kích thích tuần hoàn, tiêu hóa, phòng chống vàng da và hơ lá trầu không giữ ấm tỳ vị cho bé.',
           '["Điều dưỡng Y tế trực tiếp thực hiện chuyên nghiệp","Vệ sinh rốn chuẩn vô khuẩn phòng viêm nhiễm","Massage kích thích nhu động ruột, giảm đầy hơi nôn trớ","Hơ lá trầu không giữ ấm thóp, ngực, bụng, lưng"]',
           '/images/banner.jpg', 1),
          ('srv-03', 'Chăm Sóc & Phục Hồi Toàn Diện Mẹ Sau Sinh', 'cham-soc-phuc-hoi-me-sau-sinh', 'sau_sinh', 450000, 90,
           'Liệu trình phục hồi chuyên sâu kết hợp thảo dược cổ truyền và kỹ thuật y khoa. Giúp giảm đau mỏi lưng hông, đẩy sạch sản dịch, co hồi tử cung, xông hơi vùng kín thải độc và quấn bụng thảo mộc định hình vòng eo.',
           '["Xông hơi toàn thân và vùng kín bằng lá thảo dược Dao Đỏ","Massage bấm huyệt lưu thông khí huyết, giảm ứ trệ","Quấn muối thảo dược và đai nịt bụng định hình eo thon","Dưỡng da sáng mịn, mờ thâm rạn với cốt nghệ gừng hạ thổ"]',
           '/images/banner.jpg', 1),
          ('srv-04', 'Massage Mẹ Bầu Thư Giãn & Giảm Đau Nhức Thai Kỳ', 'massage-me-bau-thu-gian', 'me_bau', 350000, 75,
           'Dành cho mẹ từ tuần thai thứ 16 trở đi. Giúp giải tỏa áp lực đè nặng lên cột sống, giảm chuột rút và phù nề bàn chân, xua tan lo âu, cải thiện giấc ngủ ngon cho mẹ và thai nhi phát triển khỏe mạnh.',
           '["Dầu massage hữu cơ chiết xuất tự nhiên 100% an toàn cho thai nhi","Kỹ thuật vuốt miết chuẩn y học cổ truyền, không ấn huyệt nguy hiểm","Giảm phù nề chân, tê bì tay và đau khớp háng","Tư vấn tư thế nằm nghỉ ngơi và chế độ vận động thai kỳ"]',
           '/images/banner.jpg', 1)
        `).run();
      }
      await db.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('services_initialized', '1')").run();
    }

    // 4. Remove any product category if previously stored in services table
    await db.prepare("DELETE FROM services WHERE category = 'san_pham'").run();
  } catch (e) {
    // Ignore schema errors
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;
    if (env && env.DB) {
      await ensureServicesTable(env.DB);
      const { results } = await env.DB.prepare(
        "SELECT * FROM services WHERE category != 'san_pham' ORDER BY created_at ASC"
      ).all();
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
    const { name, slug, category, price, duration, description, features, image_url, is_active } = body;

    if (!name || !slug || !category) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tên, slug và danh mục không được để trống.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = 'srv-' + Date.now();
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    if (env && env.DB) {
      await ensureServicesTable(env.DB);
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

    return new Response(
      JSON.stringify({ success: true, message: 'Thêm dịch vụ thành công!', data: { id, name } }),
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
    const { id, name, slug, category, price, duration, description, features, image_url, is_active } = body;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu ID cần cập nhật.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    if (env && env.DB) {
      await ensureServicesTable(env.DB);
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

    return new Response(
      JSON.stringify({ success: true, message: 'Cập nhật dịch vụ thành công!' }),
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
      await ensureServicesTable(env.DB);
      await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Đã xóa dịch vụ thành công.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
