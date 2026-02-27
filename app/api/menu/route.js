import { NextResponse } from 'next/server';
import { addMenuItem, getMenu } from '../../../lib/store';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-secret-token';

export async function GET() {
  const menu = await getMenu();
  return NextResponse.json(menu);
}

export async function POST(request) {
  if (request.headers.get('x-admin-token') !== ADMIN_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  if (!data.name || !data.description || Number(data.price) < 0) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const item = await addMenuItem({
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80',
    price: Number(data.price),
    isAvailable: Boolean(data.isAvailable ?? true),
  });

  return NextResponse.json({ message: 'Menu item created', id: item.id }, { status: 201 });
}
