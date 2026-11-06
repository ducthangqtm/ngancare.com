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

