import type z from "zod"

/**
 * Génère automatiquement le type des erreurs renvoyées par Zod
 * sous forme d'arbre (via `z.treeifyError`), à partir d'un schéma donné.
 *
 * Ce helper permet :
 * - d'obtenir un typage précis des erreurs pour chaque champ d'un formulaire
 * - d'activer l'autocomplétion dans l'éditeur (VSCode, WebStorm…)
 * - d'éviter de créer manuellement des types d'erreurs pour chaque schema
 *
 * @template TSchema - Le schéma Zod dont on veut extraire le type d'erreur.
 * @example
 * const schema = z.object({
 *   email: z.string().email(),
 * });
 *
 * type Errors = ZodErrorTree<typeof schema>;
 *
 * // errors.email.errors[0] → autocomplétion + typage garanti
 */
export type ZodErrorTree<TSchema extends z.ZodTypeAny> = ReturnType<
  typeof z.treeifyError<z.infer<TSchema>>
>

