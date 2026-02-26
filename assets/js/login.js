const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username')?.value?.trim() || '';
  const password = document.getElementById('password')?.value || '';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    alert('Login successful!');
    window.location.href = '/pages/index.html';
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
});
