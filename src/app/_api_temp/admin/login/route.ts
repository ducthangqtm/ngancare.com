import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' },
        { status: 400 }
      );
    }

    const isValid = await localDb.verifyAdmin(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    const token = 'nc_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: { username, role: 'admin' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
