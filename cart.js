const CART_KEY = "mealhub_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price, specialRequests = "") {
  const cart = getCart();
  cart.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    price: Number(price),
    specialRequests
  });
  saveCart(cart);
}

function addToCartFromCard(button) {
  const card = button.closest(".menu-item");
  const name = card.dataset.name;
  const price = card.dataset.price;
  const specialRequests = card.querySelector("textarea")?.value.trim() || "";

  addToCart(name, price, specialRequests);
  button.textContent = "Added ✓";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = "Add to cart";
    button.disabled = false;
  }, 800);
}

function removeCartItem(id) {
  const updated = getCart().filter(item => item.id !== id);
  saveCart(updated);
  renderCartItems();
}

function clearCart() {
  saveCart([]);
  renderCartItems();
}

function renderCartItems() {
  const cartContainer = document.getElementById("cart-items");
  const totalNode = document.getElementById("cart-total");

  if (!cartContainer || !totalNode) {
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = '<div class="card" style="padding:1rem;">Your cart is empty.</div>';
    totalNode.textContent = "Total: KES 0";
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <article class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <span>KES ${item.price}</span>
        ${item.specialRequests ? `<p style="margin:.45rem 0 0;color:#6b7280;">Request: ${item.specialRequests}</p>` : ""}
      </div>
      <button class="btn" onclick="removeCartItem('${item.id}')">Remove</button>
    </article>
  `).join("");

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  totalNode.textContent = `Total: KES ${total}`;
}

renderCartItems();
