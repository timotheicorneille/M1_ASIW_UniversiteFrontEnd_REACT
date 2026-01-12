import { Button } from "@/components"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { useState, useEffect } from "react"
import { useCreateEtudiant } from "../hooks/useCreateEtudiant"
import { useUpdateEtudiant } from "../hooks/useUpdateEtudiant"
import type { Etudiant, CreateEtudiantPayload, UpdateEtudiantPayload } from "../types"

interface EtudiantFormModalProps {
  isOpen: boolean;
  editingEtudiant: Etudiant | null;
  onClose: () => void;
}

export const EtudiantFormModal: React.FC<EtudiantFormModalProps> = ({
  isOpen,
  editingEtudiant,
  onClose,
}) => {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [parcoursId, setParcoursId] = useState("")

  const createEtudiantMutation = useCreateEtudiant()
  const updateEtudiantMutation = useUpdateEtudiant()

  useEffect(() => {
    if (editingEtudiant) {
      setNom(editingEtudiant.nom)
      setPrenom(editingEtudiant.prenom)
      setEmail(editingEtudiant.email)
      setParcoursId(editingEtudiant.parcours_id?.toString() || "")
    } else {
      setNom("")
      setPrenom("")
      setEmail("")
      setParcoursId("")
    }
  }, [editingEtudiant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateEtudiantPayload | UpdateEtudiantPayload = {
      nom,
      prenom,
      email,
      parcours_id: parcoursId ? parseInt(parcoursId) : undefined,
    }

    try {
      if (editingEtudiant) {
        await updateEtudiantMutation.mutateAsync({
          id: editingEtudiant.id,
          payload,
        })
      } else {
        await createEtudiantMutation.mutateAsync(payload as CreateEtudiantPayload)
      }
      onClose()
    } catch (error) {
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingEtudiant ? "Modifier l'étudiant" : "Ajouter un étudiant"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <Input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            placeholder="Nom de l'étudiant"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <Input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
            placeholder="Prénom de l'étudiant"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ID Parcours (optionnel)</label>
          <Input
            type="number"
            value={parcoursId}
            onChange={(e) => setParcoursId(e.target.value)}
            placeholder="ID du parcours"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 p-2 rounded-lg"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-gray-800 text-white p-2 rounded-lg"
            disabled={createEtudiantMutation.isPending || updateEtudiantMutation.isPending}
          >
            {editingEtudiant ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
