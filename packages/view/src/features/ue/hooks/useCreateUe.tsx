
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue, CreateUePayload } from "../types";

interface CreateUeResponse {
  message: string;
  ue: Ue;
}

export const useCreateUe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUePayload): Promise<Ue> => {
      const response = await apiFetch("/ues", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create ue")
      }

      const data = (await response.json()) as CreateUeResponse
      return data.ue
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ue"] })
    },
  })
}
