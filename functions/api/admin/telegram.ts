// Cloudflare Pages Function: GET & POST /api/admin/telegram
interface Env {
  DB: D1Database;
}

const DEFAULT_BOT_TOKEN = '8700850904:AAGQUd380KftNANpmU3mbx7wNmHvH5oe4I4';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    let botToken = DEFAULT_BOT_TOKEN;
    let chatId = '';

    if (env && env.DB) {
      const tokenRow: any = await env.DB.prepare(
        "SELECT value FROM system_settings WHERE key = 'telegram_bot_token'"
      ).first();
      if (tokenRow && tokenRow.value) botToken = tokenRow.value;

      const chatRow: any = await env.DB.prepare(
        "SELECT value FROM system_settings WHERE key = 'telegram_chat_id'"
      ).first();
      if (chatRow && chatRow.value) chatId = chatRow.value;
    }

    // Auto-detect group Chat ID from getUpdates
    if (action === 'detect') {
      const tokenToUse = url.searchParams.get('token') || botToken;
      const teleRes = await fetch(`https://api.telegram.org/bot${tokenToUse}/getUpdates`);
      const teleData: any = await teleRes.json();

      if (!teleData.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            error: teleData.description || 'Không thể kết nối với Telegram Bot API.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const updates = teleData.result || [];
      const foundChats: Array<{ id: string; title: string; type: string }> = [];

      for (const u of updates) {
        const chat =
          u.message?.chat ||
          u.channel_post?.chat ||
          u.my_chat_member?.chat ||
          u.chat_member?.chat;
        if (chat && chat.id) {
          const idStr = String(chat.id);
          if (!foundChats.some((c) => c.id === idStr)) {
            foundChats.push({
              id: idStr,
              title: chat.title || chat.username || chat.first_name || 'Nhóm chat',
              type: chat.type,
            });
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          foundChats,
          totalUpdates: updates.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bot_token: botToken,
          chat_id: chatId,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    const { action, bot_token, chat_id } = body;

    const token = bot_token || DEFAULT_BOT_TOKEN;

    if (action === 'save') {
      if (env && env.DB) {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS system_settings (
            key TEXT PRIMARY KEY,
            value TEXT
          )
        `).run();

        await env.DB.prepare(
          "INSERT OR REPLACE INTO system_settings (key, value) VALUES ('telegram_bot_token', ?)"
        )
          .bind(token)
          .run();

        await env.DB.prepare(
          "INSERT OR REPLACE INTO system_settings (key, value) VALUES ('telegram_chat_id', ?)"
        )
          .bind(chat_id || '')
          .run();
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Đã lưu cấu hình Telegram thành công!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'test') {
      if (!chat_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Chưa có ID nhóm (Chat ID) để gửi tin nhắn.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const testMessage = `🔔 *[THỬ NGHIỆM KẾT NỐI BOT]*\n\nXin chào! Bot thông báo của *Ngân Care* đã liên kết thành công với nhóm này.\nKhi khách hàng gửi lịch đặt mới trên website, thông tin chi tiết sẽ được tự động gửi về đây tức thì!`;

      const teleRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text: testMessage,
          parse_mode: 'Markdown',
        }),
      });

      const teleData: any = await teleRes.json();

      if (!teleData.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            error: teleData.description || 'Gửi tin nhắn thử nghiệm thất bại.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Đã gửi tin nhắn thử nghiệm thành công vào nhóm Telegram!',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Hành động không hợp lệ.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
