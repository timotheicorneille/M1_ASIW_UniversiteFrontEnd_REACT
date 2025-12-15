import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue } from "../types"

export const useDeleteUe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiFetch(`/ues/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete ue")
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Ue[]>(["ue"], (old) => {
        return old?.filter((ue) => ue.id !== id) ?? []
      })
    },
  })
}
