import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Etudiant, CreateEtudiantPayload } from "../types"

interface CreateEtudiantResponse {
  message: string;
  etudiant: Etudiant;
}

export const useCreateEtudiant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateEtudiantPayload): Promise<Etudiant> => {
      const response = await apiFetch("/etudiants", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create etudiant")
      }

      const data = (await response.json()) as CreateEtudiantResponse
      return data.etudiant
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etudiants"] })
    },
  })
}
