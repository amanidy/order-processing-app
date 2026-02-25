document.addEventListener('DOMContentLoaded',()=>{


  const key = "items;"
  const orderItems = JSON.parse(localStorage.getItem(key)) || [];
  
const orderButtonEl = document.getElementById('order-btn');

orderButtonEl.addEventListener('click', () =>{
  
  
  
  const orderFormEl = document.getElementById('itemForm');
  
  if (!orderFormEl) {
    console.log('ID not be found')
    
  }
  
  orderFormEl.classList.toggle('visible');
})



const addButton = document.getElementById('add-item');


addButton.addEventListener('click',()=>{
  
  let nameEl = document.getElementById('product-name');
let priceEl = document.getElementById('product-price');
let quantityEl = document.getElementById('product-quantity');


  
  orderItems.push({
    name:nameEl.value.trim(),
    price:priceEl.value.trim(),
    quantity:quantityEl.value.trim()
  });

saveItemsToLocalStorage();
  
  
  
   

  nameEl.value = "";
  priceEl.value = "";
  quantityEl.value = "";
  
  console.log(orderItems);

  renderItems();
  
 
})

function renderItems(){
  
  const itemsEl = document.getElementById('list-container');

  
  if (!itemsEl) {
    console.log('list-container was not found')
    return;
    
  }
  
  itemsEl.innerHTML = orderItems.map(item => `
     <div class="quick-item">
      <div class="item-name">${item.name}</div>
      <div class="item-price">Ksh ${item.price}</div>
      <div class="item-qty">Qty: ${item.quantity}</div>
  </div>
  
  `).join('');
}

function saveItemsToLocalStorage(){
  localStorage.setItem(key,JSON.stringify(orderItems));
}

const processBtnEl = document.getElementById('process-btn');

processBtnEl.addEventListener('click', () =>{
  
  const receiptEl = document.getElementById('receipt-box')
  
  let subtotal = 0;
  let isValid = true;
  let receipt ='---RECEIPT---\n';
  
  orderItems.forEach(item =>{
    
    if (!item || item.quantity <=0) {
      console.log(`Invalid process order for:${item.id}`);
      isValid = false;
    }
    const itemTotal = Number(item.price) * item.quantity;
    
    subtotal += itemTotal;
    receipt +=`${item.name} x${item.quantity}:$${itemTotal.toFixed(2)} \n`
  });
  
  if(!isValid) return 'Order processor failed';
  
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  receipt += `----------------\nSubtotal: $${subtotal.toFixed(2)}\n`;
    receipt += `Tax (10%): $${tax.toFixed(2)}\n`;
    receipt += `Total: $${total.toFixed(2)}`;
    
    receiptEl.innerHTML = receipt;
  
  
})



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
  
})


