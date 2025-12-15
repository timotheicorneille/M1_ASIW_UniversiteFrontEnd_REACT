import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue } from "../types"

export const useListUe = () => {
  return useQuery({
    queryKey: ["ue"],
    queryFn: async (): Promise<Ue[]> => {
      const response = await apiFetch("/ues", {
        method: "GET",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch ue")
      }

      return response.json()
    },
  })
}

