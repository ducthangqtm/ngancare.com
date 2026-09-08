import { NextResponse } from 'next/server';
import { localDb } from '@/lib/db';
import { Service } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await localDb.getAllServicesAdmin();
    return NextResponse.json({ success: true, data: services });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, category, price, duration, description, features, image_url, is_active } = body;

    if (!name || !slug || !category) {
      return NextResponse.json(
        { success: false, error: 'Tên, slug và danh mục không được để trống.' },
        { status: 400 }
      );
    }

    const newService: Service = {
      id: (category === 'san_pham' ? 'sp-' : 'srv-') + Date.now(),
      name,
      slug,
      category,
      price: price !== undefined ? price : null,
      duration: duration !== undefined ? duration : null,
      description: description || '',
      features: Array.isArray(features) ? features : [],
      image_url: image_url || '/images/banner.jpg',
      is_active: is_active !== undefined ? is_active : 1,
      created_at: new Date().toISOString(),
    };

    const saved = await localDb.createService(newService);
    return NextResponse.json({ success: true, message: 'Thêm mới thành công', data: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu id' }, { status: 400 });
    }

    const updated = await localDb.updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy mục cần sửa' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu id cần xóa' }, { status: 400 });
    }

    const deleted = await localDb.deleteService(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy mục để xóa' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa thành công' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
