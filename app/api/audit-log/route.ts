import { NextResponse } from 'next/server';
import { getAllRecords } from '@/lib/trustgate/audit-store';

export async function GET() {
  const records = getAllRecords();
  return NextResponse.json({
    total: records.length,
    records,
  });
}
