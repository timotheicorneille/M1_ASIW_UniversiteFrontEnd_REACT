import { ShoppingCart } from 'lucide-react';
import { usePanierStore, selectPanierCount } from '../../../stores/panierStore';
import { Link } from 'react-router';

export const PanierSummary = () => {
  const count = usePanierStore(selectPanierCount);

  if (count === 0) return null;

  return (
    <Link
      to="/panier"
      className="fixed bottom-6 right-6 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-3"
    >
      <ShoppingCart className="w-6 h-6" />
      <div className="flex flex-col">
        <span className="font-semibold">{count} UE{count > 1 ? 's' : ''}</span>
      </div>
    </Link>
  );
};
