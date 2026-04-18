const tbody = document.querySelector('#itemsTable tbody');
const totalNode = document.getElementById('grandTotal');
const statusNode = document.getElementById('status');

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(value || 0);

function createInput(className, type = 'text', min = null, step = null, value = '') {
  const input = document.createElement('input');
  input.className = className;
  input.type = type;
  input.value = value;
  if (min !== null) input.min = min;
  if (step !== null) input.step = step;
  return input;
}

function addItemRow(item = { name: '', qty: 1, price: 0 }) {
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.appendChild(createInput('item-name', 'text', null, null, item.name));

  const qtyCell = document.createElement('td');
  qtyCell.appendChild(createInput('item-qty', 'number', '1', null, item.qty));

  const priceCell = document.createElement('td');
  priceCell.appendChild(createInput('item-price', 'number', '0', '0.01', item.price));

  const totalCell = document.createElement('td');
  totalCell.className = 'line-total';
  totalCell.textContent = '$0.00';

  const removeCell = document.createElement('td');
  const removeBtn = document.createElement('button');
  removeBtn.className = 'secondary remove-item';
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeCell.appendChild(removeBtn);

  row.append(nameCell, qtyCell, priceCell, totalCell, removeCell);

  row.addEventListener('input', updateTotals);
  removeBtn.addEventListener('click', () => {
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

async function saveDocument(type = null) {
  const payload = {
    clientName: document.getElementById('clientName').value,
    type: type || document.getElementById('docType').value,
    items: collectItems()
  };

  const endpoint = type === 'invoice' ? '/api/create-invoice' : '/api/create-quotation';

  const res = await fetch(endpoint, {
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
  statusNode.textContent = `Saved! Document ID: ${data.document.id}. Open PDF Preview to generate and download.`;
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
