// ✅ Read from "orders" — completed orders saved by script.js
const orders = JSON.parse(localStorage.getItem("orders")) || [];

console.log("Loaded orders:", orders);

// --- Summary Cards ---
let totalRevenue = 0;
let totalItems = 0;

orders.forEach(order => {
  totalRevenue += order.total; // each completed order has a total

  order.items.forEach(item => {
    totalItems += Number(item.quantity); // dig into each order's items array
  });
});

document.getElementById("total-revenue").textContent = `Ksh ${totalRevenue.toFixed(2)}`;
document.getElementById("total-orders").textContent = orders.length;
document.getElementById("total-items").textContent = totalItems;


// --- Chart 1: Daily Revenue (Last 7 Days) ---
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString("en-KE", { weekday: "short" }));
  }
  return days;
}

function getRevenuePerDay() {
  const revenue = Array(7).fill(0);

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt); // ✅ order has createdAt
    const today = new Date();
    const diffTime = today - orderDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      const index = 6 - diffDays;
      revenue[index] += order.total; // ✅ order has total
    }
  });

  return revenue;
}

const revenueCtx = document.getElementById("revenueChart").getContext("2d");
new Chart(revenueCtx, {
  type: "line",
  data: {
    labels: getLast7Days(),
    datasets: [{
      label: "Revenue (Ksh)",
      data: getRevenuePerDay(),
      borderColor: "#6c63ff",
      backgroundColor: "rgba(108, 99, 255, 0.1)",
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});


// --- Chart 2: Top Selling Items ---
function getTopItems() {
  const itemMap = {};

  orders.forEach(order => {         // ✅ loop over orders first
    order.items.forEach(item => {   // ✅ then dig into each order's items
      if (itemMap[item.name]) {
        itemMap[item.name] += Number(item.quantity);
      } else {
        itemMap[item.name] = Number(item.quantity);
      }
    });
  });

  const sorted = Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    labels: sorted.map(entry => entry[0]),
    data: sorted.map(entry => entry[1])
  };
}

const topItems = getTopItems();
const topItemsCtx = document.getElementById("topItemsChart").getContext("2d");
new Chart(topItemsCtx, {
  type: "bar",
  data: {
    labels: topItems.labels,
    datasets: [{
      label: "Units Sold",
      data: topItems.data,
      backgroundColor: ["#6c63ff", "#ff6584", "#43d9a2", "#ffa94d", "#4dabf7"],
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});


// --- Chart 3: Orders by Hour ---
function getOrdersByHour() {
  const hours = Array(24).fill(0);

  orders.forEach(order => {                              // ✅ loop over orders
    const hour = new Date(order.createdAt).getHours();  // ✅ order has createdAt
    hours[hour]++;
  });

  const activeHours = hours
    .map((count, hour) => ({ hour, count }))
    .filter(entry => entry.count > 0);

  return {
    labels: activeHours.map(e => `${e.hour}:00`),
    data: activeHours.map(e => e.count)
  };
}

const hourly = getOrdersByHour();
const hourlyCtx = document.getElementById("hourlyChart").getContext("2d");
new Chart(hourlyCtx, {
  type: "doughnut",
  data: {
    labels: hourly.labels,
    datasets: [{
      data: hourly.data,
      backgroundColor: ["#6c63ff", "#ff6584", "#43d9a2", "#ffa94d", "#4dabf7", "#f06595"]
    }]
  },
  options: { responsive: true }
});