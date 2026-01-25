import { Button } from '../../components';
import { Undo2, Trash2, CheckCircle } from 'lucide-react';
import { usePanierStore, selectPanier, selectPeutAnnuler, type PanierStore, type UEPanier } from '../../stores/panierStore';
import { PanierItem } from './components/PanierItem';

export const PanierPage = () => {
  const panier = usePanierStore(selectPanier);
  const peutAnnuler = usePanierStore(selectPeutAnnuler);
  const annuler = usePanierStore((state: PanierStore) => state.annuler);
  const viderPanier = usePanierStore((state: PanierStore) => state.viderPanier);

  const handleValider = () => {
    if (panier.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    if (window.confirm(`Valider l'inscription à ${panier.length} UE(s) ?`)) {
      // Ici tu peux appeler ton API pour valider l'inscription
      console.log('Inscription validée:', panier);
      alert('Inscription validée avec succès !');
      viderPanier();
      window.location.href = '/ue';
    }
  };

  const handleRetourUE = () => {
    window.location.href = '/ue';
  };

  if (panier.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-600 text-lg">Votre panier est vide</p>
        <Button
          onClick={handleRetourUE}
          className="bg-gray-800 text-white p-3 rounded-lg"
        >
          Parcourir les UEs
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mon Panier d'UEs</h1>
          <p className="text-gray-600 mt-2">
            {panier.length} UE{panier.length > 1 ? 's' : ''} sélectionnée{panier.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={annuler}
            disabled={!peutAnnuler}
            className="bg-gray-300 text-gray-800 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Annuler la dernière action"
          >
            <Undo2 className="w-5 h-5" />
            Annuler
          </Button>

          <Button
            onClick={() => {
              if (window.confirm('Vider tout le panier ?')) {
                viderPanier();
              }
            }}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Vider
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {panier.map((ue: UEPanier) => (
          <PanierItem key={ue.id} ue={ue} />
        ))}
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <Button
          onClick={handleValider}
          className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <CheckCircle className="w-6 h-6" />
          Valider mon inscription
        </Button>
      </div>
    </div>
  );
};
