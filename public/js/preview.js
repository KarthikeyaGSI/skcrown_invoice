const result = document.getElementById('result');
const link = document.getElementById('downloadLink');

const lastId = localStorage.getItem('lastDocumentId');
if (lastId) {
  document.getElementById('documentId').value = lastId;
}

async function generatePdf() {
  const documentId = Number(document.getElementById('documentId').value);
  if (!documentId) {
    result.textContent = 'Please enter a valid document ID.';
    return;
  }

  const res = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId })
  });

  const data = await res.json();
  if (!res.ok) {
    result.textContent = data.message || 'Failed to generate PDF.';
    return;
  }

  link.href = data.downloadPath;
  link.textContent = 'Download PDF';
  result.textContent = 'PDF generated. Temporary full data has been deleted and summary retained.';
}

document.getElementById('generateBtn').addEventListener('click', () => {
  generatePdf().catch((err) => {
    console.error(err);
    result.textContent = 'PDF generation failed.';
  });
});
