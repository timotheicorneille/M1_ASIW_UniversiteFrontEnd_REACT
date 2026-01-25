import { Button } from "@/components";
import { Table } from "@/components/ui/Table";
import { Pen, Trash2, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { UeFormModal } from "./components/UeFormModal";
import { useListUe } from "./hooks/useListUe";
import { useDeleteUe } from "./hooks/useDeleteUe";
import { usePanierStore, type PanierStore, type UEPanier } from "../../stores/panierStore";
import { PanierSummary } from "../panier/components/PanierSummary";
import type { Ue } from "./types";

export const UePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUe, setEditingUe] = useState<Ue | null>(null);

  const { data: ues } = useListUe();
  const deleteUeMutation = useDeleteUe();

  // Actions du panier
  const ajouterUE = usePanierStore((state: PanierStore) => state.ajouterUE);
  const retirerUE = usePanierStore((state: PanierStore) => state.retirerUE);
  const panier = usePanierStore((state: PanierStore) => state.panier);

  const handleOpenCreate = () => {
    setEditingUe(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (ue: Ue) => {
    setEditingUe(ue);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUe(null);
  };

  const handleDelete = async (ue: Ue) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'UE "${ue.intitule}" ?`)) {
      try {
        await deleteUeMutation.mutateAsync(ue.id);
        // Retirer l'UE du panier si elle y est
        if (panier.some((u: UEPanier) => u.id === ue.id)) {
          retirerUE(ue.id);
        }
      } catch (error) {
        alert(`Erreur lors de la suppression de l'UE: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  const handleTogglePanier = (ue: Ue) => {
    const estDansPanier = panier.some((u: UEPanier) => u.id === ue.id);

    if (estDansPanier) {
      retirerUE(ue.id);
    } else {
      ajouterUE({
        id: ue.id,
        numeroUe: ue.numeroUe,
        intitule: ue.intitule,
        ajouteA: new Date().toISOString(),
      } as UEPanier);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des UEs</h1>
        <Button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter une UE
        </Button>
      </div>

      <Table
        data={ues}
        columns={[
          { key: "numeroUe", label: "N° UE" },
          { key: "intitule", label: "Intitulé" },
          {
            key: "panier",
            label: "Panier",
            render: (row: Ue) => {
              const dansPanier = panier.some((u: UEPanier) => u.id === row.id);
              return (
                <Button
                  onClick={() => handleTogglePanier(row)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${dansPanier
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  title={dansPanier ? 'Retirer du panier' : 'Ajouter au panier'}
                >
                  {dansPanier ? (
                    <>
                      <Check className="w-4 h-4" />
                      Dans le panier
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter
                    </>
                  )}
                </Button>
              );
            },
          },
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
                  disabled={deleteUeMutation.isPending}
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

      {/* Floating Panier Summary */}
      <PanierSummary />
    </div>
  );
};
