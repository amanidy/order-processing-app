const salesEl = document.getElementById("sales");

function handleDelete(id) {
  const key = "items";
  const orderItems = JSON.parse(localStorage.getItem(key)) || [];
  const updated = orderItems.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
  location.reload();
}

function handleEdit(id) {
  const newName = prompt("Enter the new name");
  const newPrice = prompt("Enter the new price");
  const newQty = prompt("Enter the new quantity");

  const key = "items";
  const orderItems = JSON.parse(localStorage.getItem(key)) || [];

  const updated = orderItems.map(item => {
    if (item.id === id) {
      return { ...item, name: newName, price: Number(newPrice), quantity: Number(newQty) }
    }
    return item;
  });

  localStorage.setItem(key, JSON.stringify(updated));
  location.reload();
}

document.addEventListener('DOMContentLoaded', () => {

  const key = "items";
  const orderItems = JSON.parse(localStorage.getItem(key)) || [];

  const orderButtonEl = document.getElementById('order-btn');

  orderButtonEl.addEventListener('click', () => {
    const orderFormEl = document.getElementById('itemForm');

    if (!orderFormEl) {
      console.log('ID not be found');
      return;
    }

    orderFormEl.classList.toggle('visible');
  });

  function updatePendingItems() {
    const pendingEl = document.querySelector('.pending-card .value');
    if (pendingEl) {
      pendingEl.textContent = orderItems.length;
    }
  }

  const addButton = document.getElementById('add-item');

  addButton.addEventListener('click', (e) => {
    e.preventDefault();

    let nameEl = document.getElementById('product-name');
    let priceEl = document.getElementById('product-price');
    let quantityEl = document.getElementById('product-quantity');

    // Basic validation — don't add empty items
    if (!nameEl.value.trim() || !priceEl.value.trim()) {
      alert("Please fill in item name and price.");
      return;
    }

    orderItems.push({
      id: Date.now(),
      name: nameEl.value.trim(),
      price: Number(priceEl.value.trim()),
      quantity: Number(quantityEl.value.trim())
    });

    saveItemsToLocalStorage();

    nameEl.value = "";
    priceEl.value = "";
    quantityEl.value = "1";

    renderItems();
    updatePendingItems();
  });

  function renderItems() {
    const itemsEl = document.getElementById('list-container');

    if (!itemsEl) {
      console.log('list-container was not found');
      return;
    }

    itemsEl.innerHTML = orderItems.map(item => `
      <div class="quick-item">
        <div class="item-name">${item.name}</div>
        <div class="item-price">Ksh ${item.price}</div>
        <div class="item-qty">Qty: ${item.quantity}</div>
        <button class="delete-btn" onclick="handleEdit(${item.id})">Edit</button>
        <button class="delete-btn" onclick="handleDelete(${item.id})">Delete</button>
      </div>
    `).join('');
  }

  function saveItemsToLocalStorage() {
    localStorage.setItem(key, JSON.stringify(orderItems));
  }

  const processBtnEl = document.getElementById('process-btn');

  processBtnEl.addEventListener('click', () => {

    // Don't process if there are no items
    if (orderItems.length === 0) {
      alert("Add at least one item before processing.");
      return;
    }

    const receiptEl = document.getElementById('receipt-box');

    let subtotal = 0;
    let isValid = true;

    orderItems.forEach(item => {
      if (!item || item.quantity <= 0) {
        isValid = false;
      }
      const itemTotal = Number(item.price) * Number(item.quantity);
      subtotal += itemTotal;
    });

    if (!isValid) return;

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // ✅ Save completed order to "orders" key — separate from "items"
    const completedOrder = {
      id: Date.now(),
      items: [...orderItems],
      total: total,
      createdAt: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(completedOrder);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    let receipt = `
      <div class="receipt-container">
        <h2 class="receipt-header">🧾 RECEIPT</h2>
        <hr class="receipt-divider">
        
        <div class="receipt-items">
          ${orderItems.map(item => `
            <div class="receipt-item">
              <span class="receipt-item-name">${item.name}</span>
              <span class="receipt-item-qty">x${item.quantity}</span>
              <span class="receipt-item-price">Ksh ${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <hr class="receipt-divider">

        <div class="receipt-summary">
          <div class="receipt-row">
            <span>Subtotal</span>
            <span>Ksh ${subtotal.toFixed(2)}</span>
          </div>
          <div class="receipt-row">
            <span>Tax (10%)</span>
            <span>Ksh ${tax.toFixed(2)}</span>
          </div>
          <div class="receipt-row receipt-total">
            <span>TOTAL</span>
            <span>Ksh ${total.toFixed(2)}</span>
          </div>
        </div>

        <hr class="receipt-divider">
        <p class="receipt-footer">Thank you for your order!</p>
      </div>
    `;

    salesEl.innerHTML = `Ksh ${total.toFixed(2)}`;
    receiptEl.innerHTML = receipt;

    // Clear current order items from localStorage and memory
    orderItems.length = 0;
    localStorage.removeItem(key);
    updatePendingItems();
    renderItems();
  });

  const priceInput = document.getElementById("product-price");
  const qtyInput = document.getElementById("product-quantity");
  const subtotalEl = document.getElementById("subtotal-value");

  function updateSubtotal() {
    const price = Number(priceInput.value) || 0;
    const qty = Number(qtyInput.value) || 0;
    const subtotal = price * qty;
    subtotalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
  }

  priceInput.addEventListener("input", updateSubtotal);
  qtyInput.addEventListener("input", updateSubtotal);

  document.getElementById("increase").onclick = () => {
    qtyInput.value++;
    updateSubtotal();
  };

  document.getElementById("decrease").onclick = () => {
    if (qtyInput.value > 1) {
      qtyInput.value--;
      updateSubtotal();
    }
  };

  renderItems();
  updatePendingItems();

});