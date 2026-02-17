const MENU_GRID = document.getElementById('menu-grid');
const MENU_STATUS = document.getElementById('menu-status');

function getCart() {
  return JSON.parse(localStorage.getItem('mealHubCart') || '[]');
}

function saveCart(items) {
  localStorage.setItem('mealHubCart', JSON.stringify(items));
}

function setStatus(message, isError = false) {
  MENU_STATUS.textContent = message;
  MENU_STATUS.className = `status-text ${isError ? 'status-error' : 'status-success'}`;
}

function addToCart(item, notesInput) {
  const cart = getCart();
  const existing = cart.find((x) => x.id === item.id && x.notes === notesInput.value.trim());
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1, notes: notesInput.value.trim() });
  }
  saveCart(cart);
  setStatus(`${item.name} added to cart.`);
}

function renderMenu(items) {
  MENU_GRID.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    const notesId = `notes-${item.id}`;
    card.innerHTML = `
      <img src="${item.imageUrl || '../assets/images/fried.jpg'}" alt="${item.name}">
      <div class="card-body">
        <p class="muted">${item.isAvailable ? 'Available' : 'Unavailable'}</p>
        <h3>${item.name}</h3>
        <p class="muted">${item.description}</p>
        <p class="price">KES ${item.price.toFixed(2)}</p>
        <label for="${notesId}" class="muted">Special requests</label>
        <textarea id="${notesId}" rows="2" placeholder="Extra sauce, less spice..."></textarea>
        <button ${item.isAvailable ? '' : 'disabled'}>Add to cart</button>
      </div>
    `;

    const notesInput = card.querySelector('textarea');
    card.querySelector('button').addEventListener('click', () => addToCart(item, notesInput));
    MENU_GRID.appendChild(card);
  });
}

async function loadMenu() {
  try {
    setStatus('Loading menu...');
    const response = await fetch('/api/menu');
    if (!response.ok) throw new Error('Could not load menu');
    const menuItems = await response.json();
    renderMenu(menuItems);
    setStatus(`Loaded ${menuItems.length} menu items.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

loadMenu();
