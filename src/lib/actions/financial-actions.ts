'use server';

import prisma from "@/lib/prisma";
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

export async function getFinancialSummary() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        status: { in: ['Sent', 'Paid', 'Published'] }
      }
    });

    const expenses = await prisma.expense.findMany();

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Last Month calc
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // This is simple trend mock for now, but values are real
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      revenueTrend: 12.5,
      expenseTrend: -4.2,
      profitTrend: 18.1
    };
  } catch (error) {
    console.error("Failed to fetch financial summary:", error);
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      revenueTrend: 0,
      expenseTrend: 0,
      profitTrend: 0
    };
  }
}

export async function getChartData() {
  try {
    const yearStart = startOfYear(new Date());
    const yearEnd = endOfYear(new Date());

    const invoices = await prisma.invoice.findMany({
      where: {
        date: { gte: yearStart, lte: yearEnd },
        status: { in: ['Sent', 'Paid', 'Published'] }
      }
    });

    const expenses = await prisma.expense.findMany({
      where: {
        date: { gte: yearStart, lte: yearEnd }
      }
    });

    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return months.map(month => {
      const monthStr = format(month, 'MMM');
      const monthInvoices = invoices.filter(inv => format(new Date(inv.date), 'MMM') === monthStr);
      const monthExpenses = expenses.filter(exp => format(new Date(exp.date), 'MMM') === monthStr);

      return {
        name: monthStr,
        revenue: monthInvoices.reduce((sum, inv) => sum + inv.total, 0),
        expenses: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      };
    }).slice(0, 6); // Just H1 for now as in mockup
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return [];
  }
}

export async function getPnLData() {
  try {
    const yearStart = startOfYear(new Date());
    const yearEnd = endOfYear(new Date());

    const invoices = await prisma.invoice.findMany({
      where: {
        date: { gte: yearStart, lte: yearEnd },
        status: { in: ['Sent', 'Paid', 'Published'] }
      }
    });

    const expenses = await prisma.expense.findMany({
      where: {
        date: { gte: yearStart, lte: yearEnd }
      }
    });

    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return months.map(month => {
      const monthStr = format(month, 'MMMM');
      const monthInvoices = invoices.filter(inv => format(new Date(inv.date), 'MMMM') === monthStr);
      const monthExpenses = expenses.filter(exp => format(new Date(exp.date), 'MMMM') === monthStr);
      
      const rev = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const exp = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      return {
        month: monthStr,
        revenue: rev,
        expenses: exp,
        profit: rev - exp
      };
    }).filter(d => d.revenue > 0 || d.expenses > 0);
  } catch (error) {
    console.error("Failed to fetch PnL data:", error);
    return [];
  }
}
