import "server-only";
import type { Faq } from "@prisma/client";
import { faqsRepo } from "../repositories/faqs";
import { NotFoundError } from "../errors";
import {
  FaqCreateInput,
  FaqUpdateInput,
  type FaqCreateInputT,
  type FaqEntityT,
  type FaqUpdateInputT,
} from "@/lib/zod";

function mapFaq(row: Faq): FaqEntityT {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function listFaqs(includeInactive = false): Promise<FaqEntityT[]> {
  const rows = includeInactive ? await faqsRepo.list() : await faqsRepo.listActive();
  return rows.map(mapFaq);
}

export async function getFaq(id: string): Promise<FaqEntityT> {
  const row = await faqsRepo.getById(id);
  if (!row) throw new NotFoundError("FAQ", id);
  return mapFaq(row);
}

export async function createFaq(input: FaqCreateInputT): Promise<FaqEntityT> {
  const data = FaqCreateInput.parse(input);
  const row = await faqsRepo.create({
    question: data.question,
    answer: data.answer,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
  });
  return mapFaq(row);
}

export async function updateFaq(id: string, input: FaqUpdateInputT): Promise<FaqEntityT> {
  const data = FaqUpdateInput.parse(input);
  await getFaq(id);
  const row = await faqsRepo.update(id, data);
  return mapFaq(row);
}

export async function deleteFaq(id: string): Promise<void> {
  await getFaq(id);
  await faqsRepo.delete(id);
}
