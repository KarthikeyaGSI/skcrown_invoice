const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function addCell(row, text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  row.appendChild(cell);
}

async function loadDashboard() {
  const res = await fetch('/api/dashboard');
  if (!res.ok) {
    alert('Failed to load dashboard data.');
    return;
  }

  const data = await res.json();
  document.getElementById('revenue').textContent = currency.format(data.totalRevenue || 0);
  document.getElementById('clients').textContent = String(data.clientCount || 0);

  const tbody = document.querySelector('#recentClientsTable tbody');
  tbody.innerHTML = '';

  (data.recentClients || []).forEach((client) => {
    const row = document.createElement('tr');
    addCell(row, client.clientName || '-');
    addCell(row, currency.format(client.totalAmount || 0));
    addCell(row, new Date(client.createdAt).toLocaleString());
    tbody.appendChild(row);
  });

  const labels = (data.activity || []).map((entry) => entry.day);
  const values = (data.activity || []).map((entry) => entry.amount);

  new Chart(document.getElementById('activityChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data: values,
        borderColor: '#2f57d7',
        backgroundColor: 'rgba(47,87,215,0.2)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

loadDashboard().catch((err) => {
  console.error(err);
  alert('Dashboard unavailable.');
});
