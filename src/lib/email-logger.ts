'use server';

export async function sendInvoiceEmail(to: string, invoiceNumber: string, pdfData?: string) {
  console.log('--- 📧 DEVELOPMENT EMAIL LOG ---');
  console.log(`To: ${to}`);
  console.log(`Subject: New Invoice from SK Crown Conventions - ${invoiceNumber}`);
  console.log(`Body: Hello, please find your invoice attached.`);
  if (pdfData) {
    console.log(`Attachment: [PDF Data Detected - Size: ${pdfData.length} chars]`);
  }
  console.log('--- END LOG ---');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { success: true };
}
