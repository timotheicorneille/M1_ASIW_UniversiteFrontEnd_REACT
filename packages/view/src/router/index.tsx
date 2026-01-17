import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "@/App";
import { HomePage } from "@/features/home/HomePage";
import { ParcoursPage } from "@/features/parcours/ParcoursPage";
import { UePage } from "@/features/ue/UePage";
import { EtudiantPage } from "@/features/etudiants/EtudiantPage";
import { PanierPage } from "@/features/panier/PanierPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "parcours",
        element: <ParcoursPage />,
      },
      {
        path: "ue",
        element: <UePage />,
      },
      {
        path: "etudiant",
        element: <EtudiantPage />,
      },
      {
        path: "panier",
        element: <PanierPage />,
      }
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
