export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  parcours_id?: number | null;
  created_at: string;
}

export interface CreateEtudiantPayload {
  nom: string;
  prenom: string;
  email: string;
  parcours_id?: number;
}

export interface UpdateEtudiantPayload {
  nom?: string;
  prenom?: string;
  email?: string;
  parcours_id?: number | null;
}
