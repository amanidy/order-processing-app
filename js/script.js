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
  
})


