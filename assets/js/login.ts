document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    // Perform basic validation (e.g., check if fields are not empty)
    if (email && password) {
        // Simulate login process
        loginMessage.innerText = 'Logging in...';

        setTimeout(() => {
            // Simulate successful login
            loginMessage.innerText = 'Login successful!';
            loginMessage.style.color = 'green';
            
            // Redirect to another page after successful login
            window.location.href = 'homepage.html';
        }, 2000);
    } else {
        loginMessage.innerText = 'Please fill in all fields.';
        loginMessage.style.color = 'red';
    }
});
