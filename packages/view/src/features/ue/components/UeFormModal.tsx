import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { useCreateUe } from "../hooks/useCreateUe"
import { useUpdateUe } from "../hooks/useUpdateUe"
import { useState, useEffect } from "react"
import type { Ue } from "../types"

type FormState = {
  id?: number
  numeroUe: string
  intitule: string
}

interface UeFormModalProps {
  isOpen: boolean
  editingUe?: Ue | null
  onClose: () => void
}

export const UeFormModal: React.FC<UeFormModalProps> = ({
  isOpen,
  editingUe,
  onClose,
}) => {
  const [formState, setFormState] = useState<FormState>({
    numeroUe: "",
    intitule: "",
  })

  const createUeeMutation = useCreateUe()
  const updateUeeMutation = useUpdateUe()

  const isEditing = formState.id !== undefined
  const isLoading =
    createUeeMutation.isPending || updateUeeMutation.isPending

  useEffect(() => {
    if (isOpen) {
      if (editingUe) {
        setFormState({
          id: editingUe.id,
          numeroUe: editingUe.numeroUe,
          intitule: editingUe.intitule
        })
      } else {
        setFormState({
          numeroUe: "",
          intitule: "",
        })
      }
    }
  }, [isOpen, editingUe])

  const handleSubmit = async () => {
    if (isEditing && formState.id) {
      await updateUeeMutation.mutateAsync(
        {
          id: formState.id,
          payload: {
            numeroUe: formState.numeroUe,
            intitule: formState.intitule
          },
        },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (error) => {
            alert(
              `Erreur lors de la modification de l'ue: ${error.message}`
            )
          },
        }
      )
    } else {
      await createUeeMutation.mutateAsync(
        {
          numeroUe: formState.numeroUe,
          intitule: formState.intitule
        },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (error) => {
            alert(`Erreur lors de la création de l'ue: ${error.message}`)
          },
        }
      )
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Modifier une ue" : "Ajouter une ue"}
      </h2>
      <Input
        id="ue-name"
        label="Numero de l'ue"
        value={formState.numeroUe}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, numeroUe: e.target.value }))
        }
      />
      <Input
        id="ue-intitule"
        label="Intitule de l'ue"
        value={formState.intitule}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, intitule: e.target.value }))
        }
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="p-2 rounded-lg "
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !formState.numeroUe}
          className="bg-gray-800 hover:bg-gray-600 disabled:bg-gray-400 p-2 rounded-lg text-white"
        >
          {isLoading
            ? isEditing
              ? "Modification..."
              : "Création..."
            : isEditing
              ? "Modifier"
              : "Créer"}
        </button>
      </div>
    </Modal>
  )
}

