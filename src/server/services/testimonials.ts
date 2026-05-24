import "server-only";
import type { Testimonial } from "@prisma/client";
import { testimonialsRepo } from "../repositories/testimonials";
import { NotFoundError } from "../errors";
import {
  TestimonialCreateInput,
  TestimonialUpdateInput,
  type TestimonialCreateInputT,
  type TestimonialEntityT,
  type TestimonialUpdateInputT,
} from "@/lib/zod";

function mapTestimonial(row: Testimonial): TestimonialEntityT {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    rating: row.rating,
    location: row.location,
    vehicle: row.vehicle,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function listTestimonials(includeInactive = false): Promise<TestimonialEntityT[]> {
  const rows = includeInactive ? await testimonialsRepo.list() : await testimonialsRepo.listActive();
  return rows.map(mapTestimonial);
}

export async function getTestimonial(id: string): Promise<TestimonialEntityT> {
  const row = await testimonialsRepo.getById(id);
  if (!row) throw new NotFoundError("Testimonial", id);
  return mapTestimonial(row);
}

export async function createTestimonial(input: TestimonialCreateInputT): Promise<TestimonialEntityT> {
  const data = TestimonialCreateInput.parse(input);
  const row = await testimonialsRepo.create({
    name: data.name,
    content: data.content,
    rating: data.rating,
    location: data.location ?? null,
    vehicle: data.vehicle ?? null,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
  });
  return mapTestimonial(row);
}

export async function updateTestimonial(id: string, input: TestimonialUpdateInputT): Promise<TestimonialEntityT> {
  const data = TestimonialUpdateInput.parse(input);
  await getTestimonial(id);
  const row = await testimonialsRepo.update(id, data);
  return mapTestimonial(row);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await getTestimonial(id);
  await testimonialsRepo.delete(id);
}
