import { z } from 'zod';

export const createUeSchema = z.object({
  numeroUe: z.string().min(1, "Le numéro de l'UE est requis"),
  intitule: z.string().min(1, "L'intitulé est requis"),
});

export const updateUeSchema = z.object({
  numeroUe: z.string().min(1, "Le numéro de l'UE est requis").optional(),
  intitule: z.string().min(1, "L'intitulé est requis").optional(),
});

export type CreateUeInput = z.infer<typeof createUeSchema>;
export type UpdateUeInput = z.infer<typeof updateUeSchema>;
