import { Table } from "@/components/ui/Table"
import { Pen, Trash2 } from "lucide-react"
import { useState } from "react"
import { ParcoursFormModal } from "./components/ParcoursFormModal"
import { useListParcours } from "./hooks/useListParcours"
import { useDeleteParcours } from "./hooks/useDeleteParcours"
import type { Parcours } from "./types"

export const ParcoursPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingParcours, setEditingParcours] = useState<Parcours | null>(null)

  const { data: parcours } = useListParcours()
  const deleteParcourseMutation = useDeleteParcours()

  const handleOpenCreate = () => {
    setEditingParcours(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (parcours: Parcours) => {
    setEditingParcours(parcours)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingParcours(null)
  }

  const handleDelete = async (parcours: Parcours) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le parcours "${parcours.nomParcours}" ?`)) {
      try {
        await deleteParcourseMutation.mutateAsync(parcours.id)
      } catch (error) {
        alert(`Erreur lors de la suppression du parcours: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter un parcours
        </button>
      </div>
      <Table
        data={parcours}
        columns={[
          { key: "nomParcours", label: "Nom" },
          { key: "anneeFormation", label: "Année" },
          {
            key: "actions",
            label: "Actions",
            render: (row: Parcours) => (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleOpenEdit(row)}
                  className="hover:text-blue-600 transition-colors"
                  title="Modifier"
                >
                  <Pen className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="hover:text-red-600 transition-colors"
                  disabled={deleteParcourseMutation.isPending}
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ),
          },
        ]}
      />
      <ParcoursFormModal
        isOpen={modalOpen}
        editingParcours={editingParcours}
        onClose={handleCloseModal}
      />
    </div>
  )
}
