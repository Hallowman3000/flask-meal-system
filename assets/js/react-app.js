const { useEffect, useMemo, useState } = React;

const CART_KEY = 'mealHubCart';

const navLinks = [
  { href: '/pages/index.html', label: 'Home', key: 'home' },
  { href: '/pages/menu.html', label: 'Menu', key: 'menu' },
  { href: '/pages/cart.html', label: 'Cart', key: 'cart' },
  { href: '/pages/admin.html', label: 'Admin', key: 'admin' },
];

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function money(value) {
  return `KES ${Number(value || 0).toFixed(2)}`;
}

function Layout({ page, children }) {
  return (
    <div className="min-h-screen text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold text-emerald-700">Meal Hub</h1>
          <nav className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  page === link.key ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
    </div>
  );
}

function HomePage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/assets/data/home-content.json')
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setContent({ headline: 'Welcome to Meal Hub', subheadline: 'Browse meals and order instantly.', featuredItems: [] }));
  }, []);

  return (
    <>
      <section className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-8 shadow-lg">
        <p className="uppercase tracking-wider text-sm text-emerald-100">Meal ordering simplified</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">{content?.headline || 'Loading...'}</h2>
        <p className="mt-3 max-w-2xl text-emerald-50">{content?.subheadline || 'Preparing your experience.'}</p>
        <a href="/pages/menu.html" className="inline-block mt-6 bg-white text-emerald-700 px-5 py-3 rounded-lg font-semibold hover:bg-emerald-50">Explore Menu</a>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(content?.featuredItems || []).map((item) => (
          <article key={item.title} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function MenuPage() {
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState({});
  const [status, setStatus] = useState({ text: 'Loading menu...', error: false });

  useEffect(() => {
    fetch('/api/menu')
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load menu');
        const data = await res.json();
        setItems(data);
        setStatus({ text: `Loaded ${data.length} menu items.`, error: false });
      })
      .catch((err) => setStatus({ text: err.message, error: true }));
  }, []);

  const addToCart = (item) => {
    const cart = getCart();
    const note = (notes[item.id] || '').trim();
    const existing = cart.find((x) => x.id === item.id && x.notes === note);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1, notes: note });
    saveCart(cart);
    setStatus({ text: `${item.name} added to cart.`, error: false });
  };

  return (
    <>
      <section>
        <h2 className="text-3xl font-bold">Today&apos;s meals</h2>
        <p className="text-slate-600 mt-1">Freshly prepared and synced from the backend API.</p>
        <p className={`mt-3 text-sm ${status.error ? 'text-rose-600' : 'text-emerald-700'}`}>{status.text}</p>
      </section>
      <section className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item) => (
          <article key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <img src={item.imageUrl || '../assets/images/fried.jpg'} alt={item.name} className="h-44 w-full object-cover" />
            <div className="p-4 space-y-2">
              <p className={`text-xs font-semibold uppercase ${item.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </p>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-slate-600 text-sm">{item.description}</p>
              <p className="font-semibold">{money(item.price)}</p>
              <textarea
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                rows="2"
                placeholder="Special requests"
                value={notes[item.id] || ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
              />
              <button
                disabled={!item.isAvailable}
                onClick={() => addToCart(item)}
                className="w-full bg-emerald-600 disabled:bg-slate-300 text-white py-2 rounded-md font-medium hover:bg-emerald-700"
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function CartPage() {
  const [cart, setCart] = useState(getCart());
  const [status, setStatus] = useState({ text: '', error: false });
  const [form, setForm] = useState({ customerName: '', customerEmail: '' });

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);

  const syncCart = (next) => {
    saveCart(next);
    setCart(next);
  };

  const updateQty = (index, delta) => {
    const next = [...cart];
    next[index].quantity += delta;
    if (next[index].quantity <= 0) next.splice(index, 1);
    syncCart(next);
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!cart.length) {
      setStatus({ text: 'Cannot checkout an empty cart.', error: true });
      return;
    }
    try {
      setStatus({ text: 'Submitting order...', error: false });
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: cart }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Order request failed');

      syncCart([]);
      setForm({ customerName: '', customerEmail: '' });
      setStatus({ text: `Order #${data.orderId} placed successfully. Total ${money(data.total)}.`, error: false });
    } catch (error) {
      setStatus({ text: error.message, error: true });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-2xl font-bold">Your cart</h2>
        <p className="text-slate-600 text-sm mt-1">Review and update your items.</p>
        {!cart.length ? (
          <p className="mt-5 text-slate-600">Your cart is empty. Add meals from the menu.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {cart.map((item, index) => (
              <article key={`${item.id}-${item.notes}-${index}`} className="flex items-start justify-between border border-slate-200 rounded-lg p-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.notes || 'No special requests.'}</p>
                  <p className="text-sm text-slate-500">{money(item.price)} each</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <button className="px-3 py-1 rounded-md bg-slate-200" onClick={() => updateQty(index, -1)}>-</button>
                    <span className="font-medium">{item.quantity}</span>
                    <button className="px-3 py-1 rounded-md bg-slate-200" onClick={() => updateQty(index, 1)}>+</button>
                  </div>
                  <p className="mt-2 font-semibold">{money(item.quantity * item.price)}</p>
                </div>
              </article>
            ))}
            <p className="text-right font-bold text-lg">Total: {money(total)}</p>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-xl font-bold">Checkout</h3>
        <form className="mt-4 space-y-3" onSubmit={submitOrder}>
          <input
            required
            placeholder="Name"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.customerEmail}
            onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
          />
          <button className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700" type="submit">Place order</button>
        </form>
        {status.text && <p className={`mt-3 text-sm ${status.error ? 'text-rose-600' : 'text-emerald-700'}`}>{status.text}</p>}
      </section>
    </div>
  );
}

function AdminPage() {
  const [form, setForm] = useState({ token: '', name: '', price: '', description: '', imageUrl: '' });
  const [status, setStatus] = useState({ text: '', error: false });

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ text: 'Saving menu item...', error: false });
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': form.token.trim(),
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          imageUrl: form.imageUrl.trim(),
          isAvailable: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create item');

      setForm({ token: '', name: '', price: '', description: '', imageUrl: '' });
      setStatus({ text: `Item added successfully (id: ${data.id}).`, error: false });
    } catch (error) {
      setStatus({ text: error.message, error: true });
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold">Admin panel</h2>
      <p className="text-sm text-slate-600 mt-1">Create menu items via token-protected API endpoint.</p>
      <form className="space-y-3 mt-4" onSubmit={submit}>
        <input type="password" required placeholder="Admin token" className="w-full border border-slate-300 rounded-md px-3 py-2" value={form.token} onChange={(e) => updateForm('token', e.target.value)} />
        <input required placeholder="Item name" className="w-full border border-slate-300 rounded-md px-3 py-2" value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
        <input required type="number" min="0" step="0.01" placeholder="Price (KES)" className="w-full border border-slate-300 rounded-md px-3 py-2" value={form.price} onChange={(e) => updateForm('price', e.target.value)} />
        <textarea required rows="4" placeholder="Description" className="w-full border border-slate-300 rounded-md px-3 py-2" value={form.description} onChange={(e) => updateForm('description', e.target.value)} />
        <input placeholder="Image path" className="w-full border border-slate-300 rounded-md px-3 py-2" value={form.imageUrl} onChange={(e) => updateForm('imageUrl', e.target.value)} />
        <button className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700" type="submit">Add item</button>
      </form>
      {status.text && <p className={`mt-3 text-sm ${status.error ? 'text-rose-600' : 'text-emerald-700'}`}>{status.text}</p>}
    </section>
  );
}

function AppRouter() {
  const mount = document.getElementById('app');
  const page = mount.dataset.page;

  let component = <HomePage />;
  if (page === 'menu') component = <MenuPage />;
  if (page === 'cart') component = <CartPage />;
  if (page === 'admin') component = <AdminPage />;

  return <Layout page={page}>{component}</Layout>;
}

ReactDOM.createRoot(document.getElementById('app')).render(<AppRouter />);
