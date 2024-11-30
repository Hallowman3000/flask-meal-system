function addToCart(itemName, itemPrice) {
    const specialRequests = document.querySelector("textarea").value;

    // Create the order data object
    const orderData = {
        itemName: itemName,
        itemPrice: itemPrice,
        specialRequests: specialRequests
    };

    // Send the order data to the Order Service
    fetch('http://localhost:5003/add-to-cart', {  // Assume Order Service runs on port 5006
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Item added to cart successfully!");
            window.location.href = 'order.html'; // Redirect to cart or order page
        } else {
            alert("Failed to add item to cart: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
