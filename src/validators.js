const LIMITS = {
  clientName: 120,
  itemName: 120,
  itemCount: 100,
  maxQty: 100000,
  maxPrice: 100000000
};

function sanitizeText(input = '') {
  return String(input)
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanAndLimit(input, maxLength) {
  const value = sanitizeText(input);
  return value.slice(0, maxLength);
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

function validateClientName(rawClientName) {
  const clientName = cleanAndLimit(rawClientName, LIMITS.clientName);
  if (!clientName) {
    return { ok: false, message: 'Client name is required.' };
  }

  return { ok: true, clientName };
}

function validateItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, message: 'At least one item is required.' };
  }

  if (rawItems.length > LIMITS.itemCount) {
    return { ok: false, message: `Maximum ${LIMITS.itemCount} items allowed.` };
  }

  const items = rawItems.map((item) => {
    const name = cleanAndLimit(item.name, LIMITS.itemName);
    const qty = toNumber(item.qty);
    const price = toNumber(item.price);

    return {
      name,
      qty,
      price,
      lineTotal: qty * price
    };
  });

  const isValid = items.every((item) => (
    item.name
    && Number.isFinite(item.qty)
    && Number.isFinite(item.price)
    && item.qty > 0
    && item.qty <= LIMITS.maxQty
    && item.price >= 0
    && item.price <= LIMITS.maxPrice
  ));

  if (!isValid) {
    return { ok: false, message: 'Items must have valid name, qty and price values.' };
  }

  return { ok: true, items };
}

module.exports = {
  sanitizeText,
  validateClientName,
  validateItems
};
