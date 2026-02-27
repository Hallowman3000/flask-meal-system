'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <section className="card" style={{ maxWidth: 480 }}>
      <h1>Login</h1>
      <form onSubmit={submit} className="grid">
        <input required placeholder="Username" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        <button>Sign in</button>
      </form>
      {status && <p className="muted">{status}</p>}
    </section>
  );
}
