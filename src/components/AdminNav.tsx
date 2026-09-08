'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Stethoscope, ShoppingBag, FileText, LogOut, LayoutDashboard, Globe, KeyRound, X, Loader2, CheckCircle2, AlertCircle, Bell, Send, Search } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Telegram Configuration State
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [teleBotToken, setTeleBotToken] = useState('');
  const [teleChatId, setTeleChatId] = useState('');
  const [teleLoading, setTeleLoading] = useState(false);
  const [teleTesting, setTeleTesting] = useState(false);
  const [teleDetecting, setTeleDetecting] = useState(false);
  const [teleMsg, setTeleMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const openTelegramModal = async () => {
    setShowTelegramModal(true);
    setTeleMsg(null);
    try {
      const res = await fetch('/api/admin/telegram');
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.bot_token) setTeleBotToken(data.data.bot_token);
        if (data.data.chat_id) setTeleChatId(data.data.chat_id);
      }
    } catch (e) {}
  };

  const handleDetectChatId = async () => {
    setTeleDetecting(true);
    setTeleMsg(null);
    try {
      const res = await fetch(`/api/admin/telegram?action=detect&token=${encodeURIComponent(teleBotToken.trim())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.foundChats) && data.foundChats.length > 0) {
        const firstChat = data.foundChats[0];
        setTeleChatId(firstChat.id);
        setTeleMsg({
          text: `Đã tìm thấy nhóm: "${firstChat.title}" (ID: ${firstChat.id}). Hãy bấm Lưu Cấu Hình!`,
          type: 'success',
        });
      } else {
        setTeleMsg({
          text: 'Chưa thấy tin nhắn nào trong nhóm. Vui lòng thêm bot làm Quản trị viên (Admin) hoặc gõ tin nhắn bất kỳ (ví dụ: /start) vào nhóm rồi thử lại.',
          type: 'error',
        });
      }
    } catch (e: any) {
      setTeleMsg({ text: 'Lỗi khi dò tìm nhóm Telegram.', type: 'error' });
    } finally {
      setTeleDetecting(false);
    }
  };

  const handleTestTelegram = async () => {
    if (!teleChatId.trim()) {
      setTeleMsg({ text: 'Vui lòng nhập hoặc dò tìm ID nhóm (Chat ID) trước.', type: 'error' });
      return;
    }
    setTeleTesting(true);
    setTeleMsg(null);
    try {
      const res = await fetch('/api/admin/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          bot_token: teleBotToken.trim(),
          chat_id: teleChatId.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeleMsg({ text: 'Tin nhắn thử nghiệm đã được gửi vào nhóm Telegram thành công!', type: 'success' });
      } else {
        setTeleMsg({ text: data.error || 'Gửi thất bại. Hãy kiểm tra lại Bot Token và Chat ID.', type: 'error' });
      }
    } catch (e: any) {
      setTeleMsg({ text: 'Lỗi gửi tin nhắn đến Telegram.', type: 'error' });
    } finally {
      setTeleTesting(false);
    }
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeleLoading(true);
    setTeleMsg(null);
    try {
      const res = await fetch('/api/admin/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          bot_token: teleBotToken.trim(),
          chat_id: teleChatId.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeleMsg({ text: 'Đã lưu cấu hình thông báo Telegram thành công!', type: 'success' });
        setTimeout(() => {
          setShowTelegramModal(false);
          setTeleMsg(null);
        }, 1500);
      } else {
        setTeleMsg({ text: data.error || 'Lưu cấu hình thất bại.', type: 'error' });
      }
    } catch (e: any) {
      setTeleMsg({ text: 'Lỗi lưu cấu hình vào máy chủ.', type: 'error' });
    } finally {
      setTeleLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ngancare_admin_token');
      localStorage.removeItem('ngancare_admin_user');
    }
    router.push('/admin/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage(null);
        }, 1500);
      } else {
        setMessage({ text: data.error || 'Đổi mật khẩu thất bại.', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { name: 'Tổng Quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Lịch Hẹn Đặt', href: '/admin/bookings', icon: Calendar },
    { name: 'Dịch Vụ Y Tế', href: '/admin/services', icon: Stethoscope },
    { name: 'Sản Phẩm & Affiliate', href: '/admin/products', icon: ShoppingBag },
    { name: 'Bài Viết Blog', href: '/admin/posts', icon: FileText },
  ];

  return (
    <>
      <aside className="w-full md:w-64 bg-charcoal-900 text-white flex-shrink-0 flex flex-col justify-between min-h-screen p-4 border-r border-gray-800">
        <div>
          {/* Admin Brand */}
          <div className="p-3 mb-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gold-500 text-charcoal-900 font-black flex items-center justify-center text-sm shadow-sm">
                NC
              </span>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">Ngân Care Admin</h2>
                <p className="text-[11px] text-gold-400">Hệ thống quản trị</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-500 text-white font-bold shadow-gold-soft'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Controls */}
        <div className="pt-4 border-t border-gray-800 space-y-2">
          <button
            onClick={openTelegramModal}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-800/40 transition-colors"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Báo Đặt Lịch Telegram</span>
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-gold-400" />
            <span>Đổi Mật Khẩu Admin</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Globe className="w-4 h-4 text-gold-400" />
            <span>Xem Trang Khách (Web)</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Modal Đổi Mật Khẩu */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-charcoal-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-gold-400" />
                <h3 className="text-base sm:text-lg font-bold">Đổi Mật Khẩu Quản Trị</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setMessage(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/60 border border-red-800 text-red-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Mật Khẩu Hiện Tại *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu đang dùng..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Mật Khẩu Mới *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Xác Nhận Mật Khẩu Mới *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setMessage(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Lưu Mật Khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cấu Hình Telegram */}
      {showTelegramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-charcoal-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Cấu Hình Báo Telegram</h3>
                  <p className="text-[11px] text-gray-400">Tự động nhận thông báo khi có lịch đặt mới</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTelegramModal(false);
                  setTeleMsg(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert / Notification message */}
            {teleMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2 ${
                  teleMsg.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/60 border border-red-800 text-red-300'
                }`}
              >
                {teleMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{teleMsg.text}</span>
              </div>
            )}

            {/* Guide steps */}
            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-gray-700/60 mb-5 text-[11px] text-gray-300 space-y-1.5">
              <p className="font-bold text-gold-400">💡 3 Bước để nhận thông báo vào nhóm:</p>
              <p>1. Đã thêm bot <strong className="text-white">@ngancare_bot</strong> vào nhóm <strong className="text-white">ngancare.com</strong>.</p>
              <p>2. Đặt bot làm <strong>Quản trị viên (Admin)</strong> trong nhóm, hoặc gõ một tin nhắn bất kỳ (ví dụ: <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">/start</code>) vào nhóm.</p>
              <p>3. Bấm nút <strong className="text-blue-300">🔍 Dò Tìm ID Nhóm</strong> bên dưới rồi bấm <strong className="text-emerald-300">Lưu Cấu Hình</strong>.</p>
            </div>

            <form onSubmit={handleSaveTelegram} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Telegram Bot Token *</label>
                <input
                  type="text"
                  required
                  value={teleBotToken}
                  onChange={(e) => setTeleBotToken(e.target.value)}
                  placeholder="Nhập bot token từ BotFather..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-300 font-medium">ID Nhóm Chat (Chat ID) *</label>
                  <button
                    type="button"
                    onClick={handleDetectChatId}
                    disabled={teleDetecting}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold disabled:opacity-50"
                  >
                    {teleDetecting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Đang dò tìm...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3 h-3" />
                        <span>🔍 Tự Động Tìm ID Nhóm</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={teleChatId}
                  onChange={(e) => setTeleChatId(e.target.value)}
                  placeholder="Ví dụ: -1001234567890 hoặc bấm 'Tự Động Tìm ID Nhóm'"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800 border border-gray-700 focus:border-gold-500 outline-none text-white text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={teleTesting || !teleChatId.trim()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {teleTesting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Gửi Thử Vào Nhóm</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTelegramModal(false);
                      setTeleMsg(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-xs"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={teleLoading}
                    className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-60"
                  >
                    {teleLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Lưu Cấu Hình</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
