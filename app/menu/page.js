'use client';

import { useEffect, useState } from 'react';
import { getCart, money, saveCart } from '../../lib/cart';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState({});
  const [status, setStatus] = useState('Loading menu...');

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setStatus(`Loaded ${data.length} items.`);
      })
      .catch(() => setStatus('Could not load menu.'));
  }, []);

  const addToCart = (item) => {
    const cart = getCart();
    const note = (notes[item.id] || '').trim();
    const existing = cart.find((x) => x.id === item.id && x.notes === note);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, notes: note, quantity: 1 });
    saveCart(cart);
    setStatus(`${item.name} added to cart.`);
  };

  return (
    <div>
      <h1>Menu</h1>
      <p className="muted">{status}</p>
      <section className="grid grid-3">
        {items.map((item) => (
          <article className="card" key={item.id}>
            <img className="thumb" src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="muted">{item.description}</p>
            <p>{money(item.price)}</p>
            <textarea
              rows="2"
              placeholder="Special requests"
              value={notes[item.id] || ''}
              onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
            />
            <button disabled={!item.isAvailable} onClick={() => addToCart(item)}>
              Add to cart
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
