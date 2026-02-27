'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState({ token: '', name: '', description: '', imageUrl: '', price: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': form.token },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl,
        price: Number(form.price),
        isAvailable: true,
      }),
    });
    const data = await res.json();
    setStatus(res.ok ? `Created item #${data.id}` : data.message || 'Failed to create item');
  };

  return (
    <section className="card" style={{ maxWidth: 680 }}>
      <h1>Admin</h1>
      <form onSubmit={submit} className="grid">
        <input placeholder="Admin token" value={form.token} onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))} />
        <input required placeholder="Item name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
        <input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
        <button type="submit">Save</button>
      </form>
      {status && <p className="muted">{status}</p>}
    </section>
  );
}
