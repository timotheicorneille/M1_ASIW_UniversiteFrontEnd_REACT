import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Etudiant, UpdateEtudiantPayload } from "../types"

interface UpdateEtudiantResponse {
  message: string;
  etudiant: Etudiant;
}

export const useUpdateEtudiant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateEtudiantPayload;
    }): Promise<Etudiant> => {
      const response = await apiFetch(`/etudiants/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update etudiant")
      }

      const data = (await response.json()) as UpdateEtudiantResponse
      return data.etudiant
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["etudiants"] })

      const previousEtudiants = queryClient.getQueryData<Etudiant[]>([
        "etudiants",
      ])
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((etudiant) =>
          etudiant.id === id ? { ...etudiant, ...payload } : etudiant
        )
      })
      return { previousEtudiants }
    },
    onSuccess: (updatedEtudiant) => {
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((etudiant) =>
          etudiant.id === updatedEtudiant.id ? updatedEtudiant : etudiant
        )
      })
    },
  })
}
