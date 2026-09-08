import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await localDb.getBookings();
    return NextResponse.json({ success: true, data: bookings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin id hoặc status' },
        { status: 400 }
      );
    }

    const updated = await localDb.updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy lịch hẹn' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
