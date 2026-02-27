import { NextResponse } from 'next/server';
import { createOrder } from '../../../lib/store';

export async function POST(request) {
  const data = await request.json();
  if (!data.customerName || !data.customerEmail || !Array.isArray(data.items) || data.items.length === 0) {
    return NextResponse.json({ message: 'customerName, customerEmail and items are required' }, { status: 400 });
  }

  const badItem = data.items.some((item) => !item.name || Number(item.quantity) <= 0 || Number(item.price) < 0);
  if (badItem) {
    return NextResponse.json({ message: 'Invalid order items' }, { status: 400 });
  }

  const order = await createOrder(data);
  return NextResponse.json({ message: 'Order created', ...order }, { status: 201 });
}
