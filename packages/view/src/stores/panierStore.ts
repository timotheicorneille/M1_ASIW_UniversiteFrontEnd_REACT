// view/src/stores/panierStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type UEPanier = {
  id: number;
  numeroUe: string;
  intitule: string;
  ajouteA: string; // timestamp ISO
};

type PanierState = {
  panier: UEPanier[];
  history: UEPanier[][];
};

type PanierActions = {
  ajouterUE: (ue: UEPanier) => void;
  retirerUE: (id: number) => void;
  viderPanier: () => void;
  annuler: () => void;
  peutAnnuler: () => boolean;
  estDansPanier: (id: number) => boolean;
};

export type PanierStore = PanierState & PanierActions;

export const usePanierStore = create<PanierStore>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        panier: [],
        history: [],

        // Actions
        ajouterUE: (ue: UEPanier) => {
          const { estDansPanier } = get();

          // Vérifier si l'UE est déjà dans le panier
          if (estDansPanier(ue.id)) {
            console.warn(`UE ${ue.intitule} est déjà dans le panier`);
            return;
          }

          set((state: PanierState) => ({
            history: [...state.history, state.panier],
            panier: [...state.panier, { ...ue, ajouteA: new Date().toISOString() }],
          }), false, 'panier/ajouterUE');
        },

        retirerUE: (id: number) => {
          set((state: PanierState) => ({
            history: [...state.history, state.panier],
            panier: state.panier.filter((ue: UEPanier) => ue.id !== id),
          }), false, 'panier/retirerUE');
        },

        viderPanier: () => {
          set((state: PanierState) => ({
            history: [...state.history, state.panier],
            panier: [],
          }), false, 'panier/viderPanier');
        },

        annuler: () => {
          const { history } = get();

          if (history.length === 0) {
            console.warn('Aucune action à annuler');
            return;
          }

          const dernierEtat = history[history.length - 1];

          set({
            panier: dernierEtat,
            history: history.slice(0, -1),
          }, false, 'panier/annuler');
        },

        peutAnnuler: () => {
          return get().history.length > 0;
        },

        estDansPanier: (id: number) => {
          return get().panier.some((ue: UEPanier) => ue.id === id);
        },
      }),
      {
        name: 'panier-storage',
        // Ne persister que le panier, pas l'historique
        partialize: (state) => ({ panier: state.panier }),
      }
    )
  )
);

// Sélecteurs optimisés pour éviter les re-renders inutiles
export const selectPanier = (state: PanierStore) => state.panier;
export const selectPanierCount = (state: PanierStore) => state.panier.length;
export const selectPeutAnnuler = (state: PanierStore) => state.peutAnnuler();
