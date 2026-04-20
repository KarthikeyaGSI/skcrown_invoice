const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  await prisma.lead.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.expense.deleteMany({});

  console.log('Seeding Leads...');
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        clientName: 'Suresh & Kavya Wedding',
        email: 'suresh@example.com',
        phone: '9848012345',
        amount: 850000,
        status: 'Completed',
        eventType: 'Traditional Hindu Wedding',
        guests: 1500,
        date: new Date('2026-01-15')
      }
    }),
    prisma.lead.create({
      data: {
        clientName: 'Dr. Reddy Reception',
        email: 'reddy@example.com',
        phone: '9848054321',
        amount: 450000,
        status: 'Booked',
        eventType: 'Grand Reception',
        guests: 800,
        date: new Date('2026-02-20')
      }
    }),
    prisma.lead.create({
      data: {
        clientName: 'Corporate Tech Meetup 2026',
        email: 'hr@techcorp.com',
        phone: '9900011223',
        amount: 125000,
        status: 'Negotiation',
        eventType: 'Corporate Seminar',
        guests: 200,
        date: new Date('2026-03-10')
      }
    }),
    prisma.lead.create({
      data: {
        clientName: 'Riya Birthday Gala',
        email: 'riya@example.com',
        phone: '9000012345',
        amount: 75000,
        status: 'Site Visit',
        eventType: 'Birthday Party',
        guests: 150,
        date: new Date('2026-04-05')
      }
    }),
    prisma.lead.create({
      data: {
        clientName: 'Anand Engagements',
        email: 'anand@example.com',
        phone: '9123456789',
        amount: 250000,
        status: 'Inquiry',
        eventType: 'Engagement Ceremony',
        guests: 400,
        date: new Date('2026-04-18')
      }
    })
  ]);

  console.log('Seeding Invoices...');
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV-2026-001',
        clientName: 'Suresh Kumar',
        clientEmail: 'suresh@example.com',
        clientAddress: 'Hanamkonda, Warangal',
        items: JSON.stringify([{ description: 'Venue Booking', quantity: 1, rate: 500000, amount: 500000 }]),
        subtotal: 500000,
        taxAmount: 90000,
        total: 590000,
        status: 'Paid',
        date: new Date('2026-01-20')
      },
      {
        invoiceNumber: 'INV-2026-002',
        clientName: 'Reddy Builders',
        clientEmail: 'reddy@example.com',
        clientAddress: 'Kazipet, Warangal',
        items: JSON.stringify([{ description: 'Event Decoration', quantity: 1, rate: 250000, amount: 250000 }]),
        subtotal: 250000,
        taxAmount: 45000,
        total: 295000,
        status: 'Sent',
        date: new Date('2026-02-25')
      },
      {
        invoiceNumber: 'INV-2026-003',
        clientName: 'Corporate Tech',
        clientEmail: 'hr@tech.com',
        clientAddress: 'Hitech City, Hyderabad',
        items: JSON.stringify([{ description: 'Meeting Space', quantity: 1, rate: 100000, amount: 100000 }]),
        subtotal: 100000,
        taxAmount: 18000,
        total: 118000,
        status: 'Published',
        date: new Date('2026-03-15')
      }
    ]
  });

  console.log('Seeding Expenses...');
  await prisma.expense.createMany({
    data: [
      { description: 'Electricity Bill - Jan', amount: 45000, category: 'Utilities', date: new Date('2026-01-25'), status: 'Paid' },
      { description: 'Decoration Flowers Vendor', amount: 120000, category: 'Decoration', date: new Date('2026-01-10'), status: 'Paid' },
      { description: 'Staff Salaries - Feb', amount: 85000, category: 'Other', date: new Date('2026-02-28'), status: 'Paid' },
      { description: 'Catering Raw Materials', amount: 210000, category: 'Catering', date: new Date('2026-02-15'), status: 'Paid' },
      { description: 'Marketing Ads', amount: 30000, category: 'Other', date: new Date('2026-03-05'), status: 'Paid' },
      { description: 'Maintenance Repair', amount: 55000, category: 'Venue', date: new Date('2026-03-20'), status: 'Paid' }
    ]
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
