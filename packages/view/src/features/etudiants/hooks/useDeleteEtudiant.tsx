import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Etudiant } from "../types"

export const useDeleteEtudiant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiFetch(`/etudiants/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete etudiant")
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (old) => {
        return old?.filter((etudiant) => etudiant.id !== id) ?? []
      })
    },
  })
}
