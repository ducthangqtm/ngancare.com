import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await localDb.getHomepageConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await localDb.saveHomepageConfig(body);
    return NextResponse.json({
      success: true,
      message: 'Lưu cài đặt trang chủ thành công!',
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

