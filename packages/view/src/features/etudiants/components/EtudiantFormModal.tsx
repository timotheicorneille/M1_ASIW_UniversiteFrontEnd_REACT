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
import { createEtudiantSchema, updateEtudiantSchema } from '../schemas';
import type { Etudiant } from '../types';
import { z } from 'zod';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setErrors({});
    }
  }, [editingEtudiant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      nom,
      prenom,
      email,
      parcours_id: parcoursId ? parseInt(parcoursId) : undefined,
    };

    try {
      // Validation avec Zod
      if (editingEtudiant) {
        updateEtudiantSchema.parse(payload);
        await updateEtudiantMutation.mutateAsync({
          id: editingEtudiant.id,
          payload,
        });
      } else {
        createEtudiantSchema.parse(payload);
        await createEtudiantMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
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
              placeholder="Nom de l'étudiant"
              id="nom"
              label=""
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <Input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom de l'étudiant"
              id="prenom"
              label=""
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              id="email"
              label=""
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID Parcours (optionnel)</label>
            <Input
              type="number"
              value={parcoursId}
              onChange={(e) => setParcoursId(e.target.value)}
              placeholder="ID du parcours"
              id="parcoursId"
              label=""
            />
            {errors.parcours_id && (
              <p className="text-red-500 text-sm mt-1">{errors.parcours_id}</p>
            )}
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
