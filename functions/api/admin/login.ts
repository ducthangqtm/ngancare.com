// Cloudflare Pages Function: POST /api/admin/login
interface Env {
  DB: D1Database;
}

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let isValid = false;

    // Check with D1 if available
    if (env && env.DB) {
      const user: any = await env.DB.prepare('SELECT * FROM admins WHERE username = ?')
        .bind(username)
        .first();

      if (user) {
        const hash = await sha256(password);
        // Supports SHA-256 hash match OR plain text OR initial fallbacks
        if (
          user.password_hash === hash ||
          user.password_hash === password ||
          (username === 'admin' && (password === 'ngancare2026!' || password === 'admin'))
        ) {
          isValid = true;
        }
      }
    } else {
      // Local dev check fallback
      if (username === 'admin' && (password === 'ngancare2026!' || password === 'admin')) {
        isValid = true;
      }
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate lightweight token
    const token = 'nc_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: { username, role: 'admin' },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi hệ thống' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
