const fallbackHighlights = [
  {
    kitchen: 'Sironi Restaurant',
    dish: 'Classic Biryani Rice',
    description: 'Aromatic basmati rice with warm spices and slow-cooked flavor.',
    image: 'Screenshot (16).png'
  },
  {
    kitchen: "Paul's Café",
    dish: 'Freshly Baked Croissants',
    description: 'Buttery, flaky pastries baked daily and served warm.',
    image: 'Screenshot (20).png'
  },
  {
    kitchen: 'Sironi Restaurant',
    dish: 'Homemade Red Sauce Pasta',
    description: 'Comfort pasta with rich tomato sauce and garden herbs.',
    image: 'Screenshot (18).png'
  }
];

function renderHighlights(highlights) {
  const grid = document.getElementById('highlight-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = '';
  highlights.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'highlight-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.dish}">
      <div class="card-body">
        <h4>${item.dish}</h4>
        <p><strong>${item.kitchen}</strong></p>
        <p>${item.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function loadHighlights() {
  try {
    const response = await fetch('http://localhost:5001/highlights');
    if (!response.ok) {
      throw new Error('Could not load highlights from backend');
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      renderHighlights(data);
      return;
    }
    renderHighlights(fallbackHighlights);
  } catch (error) {
    renderHighlights(fallbackHighlights);
  }
}

document.addEventListener('DOMContentLoaded', loadHighlights);
