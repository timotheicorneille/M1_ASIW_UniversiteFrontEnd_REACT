import { z } from 'zod';

export const createParcoursSchema = z.object({
  nomParcours: z.string().min(1, "Le nom du parcours est requis"),
  anneeFormation: z.number().min(1, "L'année de formation doit être au moins 1").optional(),
});

export const updateParcoursSchema = z.object({
  nomParcours: z.string().min(1, "Le nom du parcours est requis").optional(),
  anneeFormation: z.number().min(1, "L'année de formation doit être au moins 1").optional(),
});

export type CreateParcoursInput = z.infer<typeof createParcoursSchema>;
export type UpdateParcoursInput = z.infer<typeof updateParcoursSchema>;
