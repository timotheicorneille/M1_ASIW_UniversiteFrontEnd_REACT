import { Button } from "@/components";
import { Table } from "@/components/ui/Table";
import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { EtudiantFormModal } from "./components/EtudiantFormModal";
import { useListEtudiant } from "./hooks/useListEtudiant";
import { useDeleteEtudiant } from "./hooks/useDeleteEtudiant";
import type { Etudiant } from "./types";

export const EtudiantPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState<Etudiant | null>(null);

  const { data: etudiants } = useListEtudiant();
  const deleteEtudiantMutation = useDeleteEtudiant();

  const handleOpenCreate = () => {
    setEditingEtudiant(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (etudiant: Etudiant) => {
    setEditingEtudiant(etudiant);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEtudiant(null);
  };

  const handleDelete = async (etudiant: Etudiant) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant "${etudiant.nom} ${etudiant.prenom}" ?`)) {
      try {
        await deleteEtudiantMutation.mutateAsync(etudiant.id);
      } catch (error) {
        alert(`Erreur lors de la suppression de l'étudiant: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter un étudiant
        </Button>
      </div>

      <Table
        data={etudiants}
        columns={[
          { key: "nom", label: "Nom" },
          { key: "prenom", label: "Prénom" },
          { key: "email", label: "Email" },
          { key: "parcours_id", label: "Parcours ID" },
          {
            key: "actions",
            label: "Actions",
            render: (row: Etudiant) => (
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
                  disabled={deleteEtudiantMutation.isPending}
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <EtudiantFormModal
        isOpen={modalOpen}
        editingEtudiant={editingEtudiant}
        onClose={handleCloseModal}
      />
    </div>
  );
};
