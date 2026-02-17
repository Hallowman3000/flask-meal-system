document.getElementById("addItemForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const itemName = document.getElementById("itemName").value.trim();
  const price = Number(document.getElementById("price").value);
  const description = document.getElementById("description").value.trim();

  try {
    const response = await fetch("http://localhost:5000/admin/add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName, price, description })
    });

    const data = await response.json();
    alert(data.success ? "Item added successfully" : `Failed: ${data.message}`);
  } catch {
    alert("Unable to reach admin service.");
  }
});
