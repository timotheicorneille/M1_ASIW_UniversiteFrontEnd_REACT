import { Button } from "@/components"
import { Table } from "@/components/ui/Table"
import { Pen, Trash2 } from "lucide-react"
import { useState } from "react"
import { UeFormModal } from "./components/UeFormModal"
import { useListUe } from "./hooks/useListUe"
import { useDeleteUe } from "./hooks/useDeleteUe"
import type { Ue } from "./types"

export const UePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUe, setEditingUe] = useState<Ue | null>(null)

  const { data: ue } = useListUe()
  const deleteUeeMutation = useDeleteUe()

  const handleOpenCreate = () => {
    setEditingUe(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (ue: Ue) => {
    setEditingUe(ue)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingUe(null)
  }

  const handleDelete = async (ue: Ue) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le ue "${ue.numeroUe}" ?`)) {
      try {
        await deleteUeeMutation.mutateAsync(ue.id)
      } catch (error) {
        alert(`Erreur lors de la suppression du ue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter une ue
        </Button>
      </div>
      <Table
        data={ue}
        columns={[
          { key: "numeroUe", label: "Nom" },
          { key: "intitule", label: "Intitule" },
          {
            key: "actions",
            label: "Actions",
            render: (row: Ue) => (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => handleOpenEdit(row)}
                  className="hover:text-blue-600 transition-colors"
                  title="Modifier"
                >
                  <Pen className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => handleDelete(row)}
                  className="hover:text-red-600 transition-colors"
                  disabled={deleteUeeMutation.isPending}
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ),
          },
        ]}
      />
      <UeFormModal
        isOpen={modalOpen}
        editingUe={editingUe}
        onClose={handleCloseModal}
      />
    </div>
  )
}
