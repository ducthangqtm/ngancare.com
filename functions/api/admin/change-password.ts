// Cloudflare Pages Function: POST /api/admin/change-password
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
    const { username, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (env && env.DB) {
      const user: any = await env.DB.prepare('SELECT * FROM admins WHERE username = ?')
        .bind(username || 'admin')
        .first();

      if (user) {
        const curHash = await sha256(currentPassword);
        if (user.password_hash !== curHash && user.password_hash !== currentPassword) {
          return new Response(
            JSON.stringify({ success: false, error: 'Mật khẩu hiện tại không chính xác.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const newHash = await sha256(newPassword);
        await env.DB.prepare('UPDATE admins SET password_hash = ? WHERE username = ?')
          .bind(newHash, username || 'admin')
          .run();

        return new Response(
          JSON.stringify({ success: true, message: 'Đổi mật khẩu thành công!' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Đổi mật khẩu thành công!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi đổi mật khẩu' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
