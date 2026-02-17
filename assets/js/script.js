function checkout() {
    window.location.href = 'checkout.html';
}
// Sironi Specials
const sironiSpecials = [
    {
        image: "../assets/images/dish1.jpg",
        description: "Delicious pasta with homemade sauce."
    },
    {
        image: "../assets/images/dish2.jpg",
        description: "Grilled salmon with fresh herbs."
    },
    {
        image: "../assets/images/dish3.jpg",
        description: "Classic Biriyani Rice."
    }
];

const sironiContainer = document.querySelector(".sironi-specials .specials-container");

sironiSpecials.forEach(special => {
    const specialElement = document.createElement("div");
    specialElement.classList.add("special");
    specialElement.innerHTML = `
        <img src="${special.image}" alt="${special.description}">
        <p>${special.description}</p>
    `;
    sironiContainer.appendChild(specialElement);
});

// Paul's Cafe Specials
const paulsCafeSpecials = [
    {
        image: "../assets/images/coffee.jpg",
        description: "Coffee brewed to perfection."
    },
    {
        image: "../assets/images/croissant.jpg",
        description: "Freshly baked croissants."
    }
];

const paulsCafeContainer = document.querySelector(".pauls-cafe-specials .cafe-specials-container");

paulsCafeSpecials.forEach(specialItem => {
    const specialItemElement = document.createElement("div");
    specialItemElement.classList.add("special-item");
    specialItemElement.innerHTML = `
        <img src="${specialItem.image}" alt="${specialItem.description}">
        <p>${specialItem.description}</p>
    `;
    paulsCafeContainer.appendChild(specialItemElement);
});
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
// Function to add item to cart
function addToCart(itemName, itemPrice) {
    // Get the special request if available
    const specialRequests = document.querySelector(`.menu-item h3:contains('${itemName}')`)?.parentNode.querySelector("textarea")?.value || "";

    // Create the item object
    const item = {
        name: itemName,
        price: itemPrice,
        specialRequests: specialRequests
    };

    // Retrieve cart or initialize it if not present
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add the item to the cart
    cart.push(item);

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Notify and open cart
    alert(`${itemName} added to cart!`);
    window.open("cart.html", "_blank");
}
