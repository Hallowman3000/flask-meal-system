const CART_LIST = document.getElementById('cart-items');
const CHECKOUT_FORM = document.getElementById('checkout-form');
const CHECKOUT_STATUS = document.getElementById('checkout-status');

function getCart() {
  return JSON.parse(localStorage.getItem('mealHubCart') || '[]');
}

function saveCart(items) {
  localStorage.setItem('mealHubCart', JSON.stringify(items));
}

function setCheckoutStatus(message, isError = false) {
  CHECKOUT_STATUS.textContent = message;
  CHECKOUT_STATUS.className = `status-text ${isError ? 'status-error' : 'status-success'}`;
}

function money(value) {
  return `KES ${value.toFixed(2)}`;
}

function updateQty(index, delta) {
  const cart = getCart();
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  CART_LIST.innerHTML = '';

  if (!cart.length) {
    CART_LIST.innerHTML = '<p class="muted">Your cart is empty. Add meals from the menu.</p>';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    const row = document.createElement('article');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p class="muted">${item.notes || 'No special requests.'}</p>
        <p class="muted">${money(item.price)} each</p>
      </div>
      <div>
        <div class="inline-actions">
          <button data-action="dec">-</button>
          <span>${item.quantity}</span>
          <button data-action="inc">+</button>
        </div>
        <p class="price">${money(subtotal)}</p>
      </div>
    `;
    row.querySelector('[data-action="dec"]').addEventListener('click', () => updateQty(index, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => updateQty(index, +1));
    CART_LIST.appendChild(row);
  });

  const totalRow = document.createElement('p');
  totalRow.className = 'price';
  totalRow.textContent = `Total: ${money(total)}`;
  CART_LIST.appendChild(totalRow);
}

CHECKOUT_FORM?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cart = getCart();
  if (!cart.length) {
    setCheckoutStatus('Cannot checkout an empty cart.', true);
    return;
  }

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    customerEmail: document.getElementById('customerEmail').value.trim(),
    items: cart,
  };

  try {
    setCheckoutStatus('Submitting order...');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Order request failed');

    saveCart([]);
    renderCart();
    CHECKOUT_FORM.reset();
    setCheckoutStatus(`Order #${data.orderId} placed successfully. Total ${money(data.total)}.`);
  } catch (error) {
    setCheckoutStatus(error.message, true);
  }
});

renderCart();
