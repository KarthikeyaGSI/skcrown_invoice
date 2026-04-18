function sanitizeText(input = '') {
  return String(input)
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

function validateItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, message: 'At least one item is required.' };
  }

  const items = rawItems.map((item) => {
    const name = sanitizeText(item.name);
    const qty = toNumber(item.qty);
    const price = toNumber(item.price);

    return {
      name,
      qty,
      price,
      lineTotal: qty * price
    };
  });

  const isValid = items.every((item) => item.name && item.qty > 0 && item.price >= 0);
  if (!isValid) {
    return { ok: false, message: 'Items must include valid name, qty (>0), and price (>=0).' };
  }

  return { ok: true, items };
}

module.exports = {
  sanitizeText,
  validateItems
};
