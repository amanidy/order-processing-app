document.addEventListener('DOMContentLoaded',()=>{
  
  const orderItems = [];



const addButton = document.getElementById('add-item');


addButton.addEventListener('click',()=>{
  
  let nameEl = document.getElementById('product-name');
let priceEl = document.getElementById('product-price');
let quantityEl = document.getElementById('product-quantity');


  
  orderItems.push({
    name:nameEl.value,
    price:priceEl.value,
    quantity:quantityEl.value
  });
  
  
  
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
     <div id="lists">
     <h3>Name:${item.name}</h3>
     <p>Price:${item.price}</p>
     <p>Quantity:${item.quantity}</p>
        
      </div>
  
  `).join('');
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
  
})


