import { promises as fs } from 'fs';
import path from 'path';

const storePath = path.join(process.cwd(), 'data', 'store.json');

async function readStore() {
  const raw = await fs.readFile(storePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeStore(data) {
  await fs.writeFile(storePath, JSON.stringify(data, null, 2));
}

export async function getMenu() {
  const store = await readStore();
  return store.menu;
}

export async function addMenuItem(item) {
  const store = await readStore();
  const id = Math.max(0, ...store.menu.map((x) => x.id)) + 1;
  const created = { id, ...item };
  store.menu.unshift(created);
  await writeStore(store);
  return created;
}

export async function createOrder(payload) {
  const store = await readStore();
  const orderId = Math.max(0, ...store.orders.map((x) => x.orderId)) + 1;
  const total = payload.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
  const order = { orderId, ...payload, total: Number(total.toFixed(2)), createdAt: new Date().toISOString() };
  store.orders.push(order);
  await writeStore(store);
  return { orderId, total: order.total };
}
