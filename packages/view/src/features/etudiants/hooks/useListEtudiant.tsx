import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Etudiant } from "../types"

export const useListEtudiant = () => {
  return useQuery({
    queryKey: ["etudiants"],
    queryFn: async (): Promise<Etudiant[]> => {
      const response = await apiFetch("/etudiants", {
        method: "GET",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch etudiants")
      }

      return response.json()
    },
  })
}
