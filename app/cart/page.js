'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCart, money, saveCart } from '../../lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customerName: '', customerEmail: '' });
  const [status, setStatus] = useState('');

  useEffect(() => setCart(getCart()), []);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);

  const sync = (next) => {
    setCart(next);
    saveCart(next);
  };

  const updateQty = (index, delta) => {
    const next = [...cart];
    next[index].quantity += delta;
    if (next[index].quantity <= 0) next.splice(index, 1);
    sync(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items: cart }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.message || 'Checkout failed');
      return;
    }
    sync([]);
    setForm({ customerName: '', customerEmail: '' });
    setStatus(`Order #${data.orderId} created. Total ${money(data.total)}.`);
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <section className="card">
        <h1>Cart</h1>
        {!cart.length && <p className="muted">Your cart is empty.</p>}
        {cart.map((item, index) => (
          <article className="row" key={`${item.id}-${item.notes}-${index}`}>
            <div>
              <strong>{item.name}</strong>
              <p className="muted">{item.notes || 'No notes'}</p>
            </div>
            <div>
              <button onClick={() => updateQty(index, -1)}>-</button>
              <span style={{ margin: '0 .5rem' }}>{item.quantity}</span>
              <button onClick={() => updateQty(index, 1)}>+</button>
            </div>
          </article>
        ))}
        <h3>Total: {money(total)}</h3>
      </section>
      <section className="card">
        <h2>Checkout</h2>
        <form onSubmit={submit} className="grid">
          <input required placeholder="Name" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} />
          <input required type="email" placeholder="Email" value={form.customerEmail} onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))} />
          <button type="submit">Place order</button>
        </form>
        {status && <p className="muted">{status}</p>}
      </section>
    </div>
  );
}
