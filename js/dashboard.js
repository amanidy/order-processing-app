const key = "items";
const orderItems = JSON.parse(localStorage.getItem(key)) || [];

console.log(orderItems);

let totalRevenue = 0;
let totalItems = 0;


orderItems.forEach(item =>{
  totalRevenue += Number(item.price) *Number(item.quantity);
  
  totalItems += Number(item.quantity);
  
})