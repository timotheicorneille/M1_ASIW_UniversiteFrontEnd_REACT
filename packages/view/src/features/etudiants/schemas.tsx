import { z } from 'zod';

export const createEtudiantSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  parcours_id: z.number().optional(),
});

export const updateEtudiantSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").optional(),
  prenom: z.string().min(1, "Le prénom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  parcours_id: z.number().nullable().optional(),
});

export type CreateEtudiantInput = z.infer<typeof createEtudiantSchema>;
export type UpdateEtudiantInput = z.infer<typeof updateEtudiantSchema>;
