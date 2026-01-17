// view/src/features/etudiants/components/EtudiantFormModalV2.tsx
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from '../../../components/modals-v2';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components';
import { useCreateEtudiant } from '../hooks/useCreateEtudiant';
import { useUpdateEtudiant } from '../hooks/useUpdateEtudiant';
import type { Etudiant, CreateEtudiantPayload, UpdateEtudiantPayload } from '../types';

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
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [parcoursId, setParcoursId] = useState('');

  const createEtudiantMutation = useCreateEtudiant();
  const updateEtudiantMutation = useUpdateEtudiant();

  useEffect(() => {
    if (isOpen) {
      if (editingEtudiant) {
        setNom(editingEtudiant.nom);
        setPrenom(editingEtudiant.prenom);
        setEmail(editingEtudiant.email);
        setParcoursId(editingEtudiant.parcours_id?.toString() || '');
      } else {
        setNom('');
        setPrenom('');
        setEmail('');
        setParcoursId('');
      }
    }
  }, [editingEtudiant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateEtudiantPayload | UpdateEtudiantPayload = {
      nom,
      prenom,
      email,
      parcours_id: parcoursId ? parseInt(parcoursId) : undefined,
    };

    try {
      if (editingEtudiant) {
        await updateEtudiantMutation.mutateAsync({
          id: editingEtudiant.id,
          payload,
        });
      } else {
        await createEtudiantMutation.mutateAsync(payload as CreateEtudiantPayload);
      }
      onClose();
    } catch (error) {
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader variant="default">
        <ModalTitle size="default">
          {editingEtudiant ? "Modifier l'étudiant" : "Ajouter un étudiant"}
        </ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <Input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Nom de l'étudiant" id={''} label={''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <Input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              placeholder="Prénom de l'étudiant" id={''} label={''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com" id={''} label={''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID Parcours (optionnel)</label>
            <Input
              type="number"
              value={parcoursId}
              onChange={(e) => setParcoursId(e.target.value)}
              placeholder="ID du parcours" id={''} label={''}
            />
          </div>
        </ModalBody>

        <ModalFooter align="right" gap="default">
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
        </ModalFooter>
      </form>
    </Modal>
  );
};
