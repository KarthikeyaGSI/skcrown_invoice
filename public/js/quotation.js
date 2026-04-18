const tbody = document.querySelector('#itemsTable tbody');
const totalNode = document.getElementById('grandTotal');
const statusNode = document.getElementById('status');

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(value || 0);

function addItemRow(item = { name: '', qty: 1, price: 0 }) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input class="item-name" value="${item.name}" /></td>
    <td><input class="item-qty" type="number" min="1" value="${item.qty}" /></td>
    <td><input class="item-price" type="number" min="0" step="0.01" value="${item.price}" /></td>
    <td class="line-total">$0.00</td>
    <td><button class="secondary remove-item" type="button">Remove</button></td>
  `;

  row.addEventListener('input', updateTotals);
  row.querySelector('.remove-item').addEventListener('click', () => {
    row.remove();
    updateTotals();
  });

  tbody.appendChild(row);
  updateTotals();
}

function collectItems() {
  return [...tbody.querySelectorAll('tr')].map((row) => ({
    name: row.querySelector('.item-name').value,
    qty: Number(row.querySelector('.item-qty').value),
    price: Number(row.querySelector('.item-price').value)
  }));
}

function updateTotals() {
  let total = 0;
  [...tbody.querySelectorAll('tr')].forEach((row) => {
    const qty = Number(row.querySelector('.item-qty').value) || 0;
    const price = Number(row.querySelector('.item-price').value) || 0;
    const lineTotal = qty * price;
    row.querySelector('.line-total').textContent = formatCurrency(lineTotal);
    total += lineTotal;
  });

  totalNode.textContent = formatCurrency(total);
}

async function saveDocument() {
  const payload = {
    clientName: document.getElementById('clientName').value,
    type: document.getElementById('docType').value,
    items: collectItems()
  };

  const res = await fetch('/api/create-quotation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    statusNode.textContent = data.message || 'Unable to save.';
    return;
  }

  localStorage.setItem('lastDocumentId', String(data.document.id));
  statusNode.textContent = `Saved! Document ID: ${data.document.id}. Now go to PDF Preview page.`;
}

async function convertToInvoice() {
  const id = localStorage.getItem('lastDocumentId');
  if (!id) {
    statusNode.textContent = 'No saved quotation found. Save a quotation first.';
    return;
  }

  const res = await fetch(`/api/convert-to-invoice/${id}`, { method: 'POST' });
  const data = await res.json();
  statusNode.textContent = data.message;
}

document.getElementById('addItemBtn').addEventListener('click', () => addItemRow());
document.getElementById('saveDocBtn').addEventListener('click', () => {
  saveDocument().catch((err) => {
    console.error(err);
    statusNode.textContent = 'Failed to save document.';
  });
});
document.getElementById('convertBtn').addEventListener('click', () => {
  convertToInvoice().catch((err) => {
    console.error(err);
    statusNode.textContent = 'Conversion failed.';
  });
});

addItemRow();
