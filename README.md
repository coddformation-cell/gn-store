# GN Store

Boutique mode et accessoires à Abidjan. Cette vitrine React/Vite présente les photos fournies par la boutique, permet de parcourir et filtrer une sélection, de gérer un panier local et de transmettre une demande de commande sur WhatsApp.

## Lancer le projet

```bash
npm install
npm run dev
```

Build de production : `npm run build`. Aperçu local : `npm run preview`.

## Informations commerciales à confirmer

Les prix, variantes, tailles, stocks, modalités de livraison et adresse complète ne figuraient pas dans les ressources reçues. Le site ne les invente pas : les produits indiquent « prix et disponibilité sur demande », et le panier envoie une demande de confirmation à la boutique avant finalisation. Les photos sont des vues de la boutique et de présentoirs, pas des visuels individuels détourés.

Le contact WhatsApp repris de l’enseigne est le **+225 07 08 02 83 03**. Vérifier qu’il s’agit bien du numéro de commande avant publication.

## Déploiement

La commande `npm run build` produit le dossier `dist`, à servir comme site statique. Le projet conserve la base Vite `/gn-store/`, adaptée au dépôt GitHub `gn-store` sur GitHub Pages. Pour un domaine personnalisé ou Vercel à la racine, ajuster `base` dans `vite.config.ts`, puis reconstruire. Aucun déploiement n’est déclenché par le projet.

Avant publication, confirmer l’URL publique et aligner l’URL du sitemap `public/sitemap.xml` ainsi que les métadonnées de partage. Renseigner les informations de livraison, l’adresse et les tarifs définitifs dans les contenus commerciaux.
