export const CART_KEY = 'mealHubCart';

export function getCart() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function money(value) {
  return `KES ${Number(value || 0).toFixed(2)}`;
}
