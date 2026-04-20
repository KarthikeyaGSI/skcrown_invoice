'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Lead } from "@/types";

export async function getLeads() {
  try {
    return await prisma.lead.findMany({
      orderBy: { date: 'desc' }
    }) as unknown as Lead[];
  } catch (error) {

    console.error("Failed to fetch leads:", error);
    return [];
  }
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/crm');
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error };
  }
}

export async function createLead(data: {
  clientName: string;
  email?: string;
  phone?: string;
  amount?: number;
  eventType?: string;
  guests?: number;
}) {
  try {
    const lead = await prisma.lead.create({
      data: {
        ...data,
        status: 'Inquiry'
      }
    });
    revalidatePath('/crm');
    return { success: true, lead };
  } catch (error) {
    console.error("Failed to create lead:", error);
    return { success: false, error };
  }
}
export async function saveLeadSignature(id: string, signature: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { signature }
    });
    revalidatePath('/crm');
    return { success: true };
  } catch (error) {
    console.error("Failed to save lead signature:", error);
    return { success: false, error };
  }
}
