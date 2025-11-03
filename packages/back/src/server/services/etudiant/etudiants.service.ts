import { db } from "../../db";
import type {
  Etudiant,
  CreateEtudiantPayload,
  UpdateEtudiantPayload,
} from "../../models/Etudiant";

export async function createEtudiant(
  payload: CreateEtudiantPayload
): Promise<Etudiant | null> {
  try {
    const stmt = db.prepare(
      "INSERT INTO etudiants (nom, prenom, email, parcours_id) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(
      payload.nom,
      payload.prenom,
      payload.email,
      payload.parcours_id || null
    );

    if (result) {
      return {
        id: result.lastInsertRowid as number,
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        parcours_id: payload.parcours_id || null,
        created_at: new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error creating student:", error);
    return null;
  }
}

export function getEtudiantById(id: number): Etudiant | null {
  const stmt = db.prepare(
    "SELECT id, nom, prenom, email, parcours_id, created_at FROM etudiants WHERE id = ?"
  );
  return (stmt.get(id) as Etudiant) || null;
}

export function getEtudiantByEmail(email: string): Etudiant | null {
  const stmt = db.prepare(
    "SELECT id, nom, prenom, email, parcours_id, created_at FROM etudiants WHERE email = ?"
  );
  return (stmt.get(email) as Etudiant) || null;
}

export function getAllEtudiants(): Etudiant[] {
  const stmt = db.prepare(
    "SELECT id, nom, prenom, email, parcours_id, created_at FROM etudiants"
  );
  return (stmt.all() as Etudiant[]) || [];
}

export function updateEtudiant(
  id: number,
  payload: UpdateEtudiantPayload
): Etudiant | null {
  try {
    const student = getEtudiantById(id);
    if (!student) {
      return null;
    }

    const nom = payload.nom || student.nom;
    const prenom = payload.prenom || student.prenom;
    const email = payload.email || student.email;
    const parcours_id =
      payload.parcours_id !== undefined ? payload.parcours_id : student.parcours_id;

    const stmt = db.prepare(
      "UPDATE etudiants SET nom = ?, prenom = ?, email = ?, parcours_id = ? WHERE id = ?"
    );
    stmt.run(nom, prenom, email, parcours_id || null, id);

    return {
      id,
      nom,
      prenom,
      email,
      parcours_id: parcours_id || null,
      created_at: student.created_at,
    };
  } catch (error) {
    console.error("Error updating student:", error);
    return null;
  }
}

export function deleteEtudiant(id: number): boolean {
  try {
    const stmt = db.prepare("DELETE FROM etudiants WHERE id = ?");
    const result = stmt.run(id);
    return (result.changes as number) > 0;
  } catch (error) {
    console.error("Error deleting student:", error);
    return false;
  }
}
