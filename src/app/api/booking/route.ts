import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';
import { Booking } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_address, service_id, booking_date, booking_time, notes } = body;

    if (!customer_name || !customer_phone || !customer_address || !booking_date || !booking_time) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng điền đầy đủ các thông tin bắt buộc: Họ tên, Số điện thoại, Địa chỉ, Ngày và Giờ hẹn.',
        },
        { status: 400 }
      );
    }

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      customer_name,
      customer_phone,
      customer_address,
      service_id: service_id || '',
      booking_date,
      booking_time,
      notes: notes || '',
      status: 'pending',
    };

    const saved = await localDb.createBooking(newBooking);

    return NextResponse.json({
      success: true,
      message: 'Đặt lịch thành công! Điều dưỡng Thúy Ngân sẽ liên hệ xác nhận trong ít phút.',
      data: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
