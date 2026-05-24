import "server-only";
import type { Lead, Prisma } from "@prisma/client";
import { leadsRepo } from "../repositories/leads";
import { NotFoundError } from "../errors";
import {
  LeadCreateInput,
  LeadStatusUpdateInput,
  type LeadCreateInputT,
  type LeadEntityT,
  type LeadListQueryT,
  type LeadStatusUpdateInputT,
} from "@/lib/zod";

function mapLead(row: Lead): LeadEntityT {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    model: row.model,
    address: row.address,
    note: row.note,
    status: row.status,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listLeads(query: LeadListQueryT = {}): Promise<LeadEntityT[]> {
  const where: Prisma.LeadWhereInput = {};
  if (query.status) where.status = query.status;
  const rows = await leadsRepo.list(where);
  return rows.map(mapLead);
}

export async function getLead(id: string): Promise<LeadEntityT> {
  const row = await leadsRepo.getById(id);
  if (!row) throw new NotFoundError("Lead", id);
  return mapLead(row);
}

export async function createLead(input: LeadCreateInputT): Promise<LeadEntityT> {
  const data = LeadCreateInput.parse(input);
  if (data.website && data.website.length > 0) {
    throw new NotFoundError("Lead");
  }
  const row = await leadsRepo.create({
    name: data.name,
    phone: data.phone,
    model: data.model,
    address: data.address ?? null,
    note: data.note ?? null,
    source: data.source ?? "website",
  });
  return mapLead(row);
}

export async function updateLeadStatus(id: string, input: LeadStatusUpdateInputT): Promise<LeadEntityT> {
  const data = LeadStatusUpdateInput.parse(input);
  await getLead(id);
  const row = await leadsRepo.updateStatus(id, data.status);
  return mapLead(row);
}
