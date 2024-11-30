// admin.js
document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:5000/admin/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemName, price, description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Item added successfully');
            // Optionally clear the form or display the new item
        } else {
            alert('Failed to add item: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
