const ADMIN_FORM = document.getElementById('addItemForm');
const ADMIN_STATUS = document.getElementById('admin-status');

function setAdminStatus(message, isError = false) {
  ADMIN_STATUS.textContent = message;
  ADMIN_STATUS.className = `status-text ${isError ? 'status-error' : 'status-success'}`;
}

ADMIN_FORM?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById('itemName').value.trim(),
    description: document.getElementById('description').value.trim(),
    price: Number(document.getElementById('price').value),
    imageUrl: document.getElementById('imageUrl').value.trim(),
    isAvailable: true,
  };

  try {
    setAdminStatus('Saving menu item...');
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': document.getElementById('token').value.trim(),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create item');

    ADMIN_FORM.reset();
    setAdminStatus(`Item added successfully (id: ${data.id}).`);
  } catch (error) {
    setAdminStatus(error.message, true);
  }
});
