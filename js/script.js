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
  
  
  
})
  
  
  
  
})


