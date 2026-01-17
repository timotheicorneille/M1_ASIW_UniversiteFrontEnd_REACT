import { Trash2 } from 'lucide-react';
import { Button } from '../../../components';
import { usePanierStore, type UEPanier } from '../../../stores/panierStore';

type PanierItemProps = {
  ue: UEPanier;
};

export const PanierItem = ({ ue }: PanierItemProps) => {
  const retirerUE = usePanierStore((state) => state.retirerUE);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{ue.intitule}</h3>
        <p className="text-sm text-gray-600">N° UE: {ue.numeroUe}</p>
      </div>
      <Button
        onClick={() => retirerUE(ue.id)}
        className="hover:text-red-600 transition-colors"
        title="Retirer du panier"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};
