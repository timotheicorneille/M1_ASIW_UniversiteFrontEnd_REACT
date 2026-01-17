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
import { useCreateUe } from '../hooks/useCreateUe';
import { useUpdateUe } from '../hooks/useUpdateUe';
import { createUeSchema, updateUeSchema } from '../schemas';
import type { Ue } from '../types';
import { z } from 'zod';

interface UeFormModalProps {
  isOpen: boolean;
  editingUe: Ue | null;
  onClose: () => void;
}

export const UeFormModal: React.FC<UeFormModalProps> = ({
  isOpen,
  editingUe,
  onClose,
}) => {
  const [numeroUe, setNumeroUe] = useState('');
  const [intitule, setIntitule] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createUeMutation = useCreateUe();
  const updateUeMutation = useUpdateUe();

  useEffect(() => {
    if (isOpen) {
      if (editingUe) {
        setNumeroUe(editingUe.numeroUe);
        setIntitule(editingUe.intitule);
      } else {
        setNumeroUe('');
        setIntitule('');
      }
      setErrors({});
    }
  }, [editingUe, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      numeroUe,
      intitule,
    };

    try {
      // Validation avec Zod
      if (editingUe) {
        updateUeSchema.parse(payload);
        await updateUeMutation.mutateAsync({
          id: editingUe.id,
          payload,
        });
      } else {
        createUeSchema.parse(payload);
        await createUeMutation.mutateAsync(payload);
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
          {editingUe ? "Modifier l'UE" : "Ajouter une UE"}
        </ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Numéro de l'UE</label>
            <Input
              type="text"
              value={numeroUe}
              onChange={(e) => setNumeroUe(e.target.value)}
              placeholder="Numéro de l'UE"
              id="numeroUe"
              label=""
            />
            {errors.numeroUe && (
              <p className="text-red-500 text-sm mt-1">{errors.numeroUe}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Intitulé</label>
            <Input
              type="text"
              value={intitule}
              onChange={(e) => setIntitule(e.target.value)}
              placeholder="Intitulé de l'UE"
              id="intitule"
              label=""
            />
            {errors.intitule && (
              <p className="text-red-500 text-sm mt-1">{errors.intitule}</p>
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
            disabled={createUeMutation.isPending || updateUeMutation.isPending}
          >
            {editingUe ? "Modifier" : "Créer"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
