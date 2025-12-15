import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue, UpdateUePayload } from "../types"

interface UpdateUeResponse {
  message: string;
  ue: Ue;
}

export const useUpdateUe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateUePayload;
    }): Promise<Ue> => {
      const response = await apiFetch(`/ues/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update ue")
      }

      const data = (await response.json()) as UpdateUeResponse
      return data.ue
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["ue"] })

      const previousUe = queryClient.getQueryData<Ue[]>([
        "ue",
      ])
      queryClient.setQueryData<Ue[]>(["ue"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((ue) =>
          ue.id === id ? { ...ue, ...payload } : ue
        )
      })
      return { previousUe }
    },
    onSuccess: (updatedUe) => {
      queryClient.setQueryData<Ue[]>(["ue"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((ue) =>
          ue.id === updatedUe.id ? updatedUe : ue
        )
      })
    },
  })
}

