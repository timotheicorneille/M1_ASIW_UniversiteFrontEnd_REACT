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
import { useCreateParcours } from '../hooks/useCreateParcours';
import { useUpdateParcours } from '../hooks/useUpdateParcours';
import { createParcoursSchema, updateParcoursSchema } from '../schemas';
import type { Parcours } from '../types';
import { z } from 'zod';

interface ParcoursFormModalProps {
  isOpen: boolean;
  editingParcours: Parcours | null;
  onClose: () => void;
}

export const ParcoursFormModal: React.FC<ParcoursFormModalProps> = ({
  isOpen,
  editingParcours,
  onClose,
}) => {
  const [nomParcours, setNomParcours] = useState('');
  const [anneeFormation, setAnneeFormation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createParcoursMutation = useCreateParcours();
  const updateParcoursMutation = useUpdateParcours();

  useEffect(() => {
    if (isOpen) {
      if (editingParcours) {
        setNomParcours(editingParcours.nomParcours);
        setAnneeFormation(editingParcours.anneeFormation?.toString() || '');
      } else {
        setNomParcours('');
        setAnneeFormation('');
      }
      setErrors({});
    }
  }, [editingParcours, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      nomParcours,
      anneeFormation: anneeFormation ? parseInt(anneeFormation) : undefined,
    };

    try {
      // Validation avec Zod
      if (editingParcours) {
        updateParcoursSchema.parse(payload);
        await updateParcoursMutation.mutateAsync({
          id: editingParcours.id,
          payload,
        });
      } else {
        createParcoursSchema.parse(payload);
        await createParcoursMutation.mutateAsync(payload);
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
          {editingParcours ? "Modifier le parcours" : "Ajouter un parcours"}
        </ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du parcours</label>
            <Input
              type="text"
              value={nomParcours}
              onChange={(e) => setNomParcours(e.target.value)}
              placeholder="Nom du parcours"
              id="nomParcours"
              label=""
            />
            {errors.nomParcours && (
              <p className="text-red-500 text-sm mt-1">{errors.nomParcours}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Année de formation</label>
            <Input
              type="number"
              value={anneeFormation}
              onChange={(e) => setAnneeFormation(e.target.value)}
              placeholder="Année de formation"
              id="anneeFormation"
              label=""
            />
            {errors.anneeFormation && (
              <p className="text-red-500 text-sm mt-1">{errors.anneeFormation}</p>
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
            disabled={createParcoursMutation.isPending || updateParcoursMutation.isPending}
          >
            {editingParcours ? "Modifier" : "Créer"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
