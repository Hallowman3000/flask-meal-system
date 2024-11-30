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
