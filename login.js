document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  if (!username || !password) {
    message.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const response = await fetch("http://localhost:5004/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.success) {
      message.textContent = "Login successful. Redirecting...";
      setTimeout(() => (window.location.href = "index.html"), 700);
    } else {
      message.textContent = `Login failed: ${data.message || "unknown error"}`;
    }
  } catch {
    message.textContent = "Service unavailable. Please try again later.";
  }
});
