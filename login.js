document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:5004/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert("Login successful!");
          window.location.href = "home.html"; // Redirect after successful login
      } else {
          alert("Login failed: " + data.message);
      }
  })
  .catch(error => console.error('Error:', error));
});