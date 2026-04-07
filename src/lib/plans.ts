export interface PlanSection {
  title: string;
  items: string[];
}

export interface PlanDefinition {
  key: 'free' | 'premium';
  name: string;
  price: string;
  priceDetail: string;
  description: string;
  cta: string;
  highlighted: boolean;
  badge?: string;
  limitNote?: string;
  sections: PlanSection[];
  note?: string;
}

export const freePlanProductLimit = 5;

export const freePlan: PlanDefinition = {
  key: 'free',
  name: 'Basique',
  price: 'Gratuit',
  priceDetail: 'pour toujours',
  description:
    'Le plan idéal pour lancer sa boutique, vendre sur WhatsApp et gérer ses premières commandes sans complexité.',
  cta: 'Commencer gratuitement',
  highlighted: false,
  limitNote: "Jusqu'à 5 produits publiés",
  sections: [
    {
      title: 'Vente',
      items: [
        'Connexion via numéro WhatsApp + mot de passe',
        'Catalogue produit et boutique en ligne',
        'Panier et checkout simple',
        'Commandes illimitées',
        'Paiements et livraison basiques',
      ],
    },
    {
      title: 'Pilotage',
      items: [
        'Dashboard vendeur essentiel',
        'Ajout produit, prix, stock et référence produit',
        'Suivi manuel des statuts de commande',
        'CRM client basique avec notes',
      ],
    },
  ],
  note: 'Branding "Powered by SellFlow" visible sur la boutique.',
};

export const premiumPlan: PlanDefinition = {
  key: 'premium',
  name: 'Premium',
  price: '1$',
  priceDetail: '/ mois',
  description:
    'Pour les vendeurs qui veulent un dashboard plus avancé, un CRM plus riche et une boutique sans limites.',
  cta: 'Passer au Premium',
  highlighted: true,
  badge: 'Recommandé',
  limitNote: 'Produits illimités',
  sections: [
    {
      title: 'Tout le Basique +',
      items: [
        'Suppression du branding SellFlow',
        'Produits illimités',
        'Personnalisation visuelle de la boutique',
      ],
    },
    {
      title: 'CRM avancé',
      items: [
        'Tags et prochaines actions modifiables',
        'Historique client enrichi',
        'Notes et vues CRM avancées',
      ],
    },
    {
      title: 'Pilotage avancé',
      items: [
        'Analytics revenus, panier moyen et top produits',
        'Suivi commande plus détaillé',
        "Gestion d'équipe et options admin plateforme",
      ],
    },
  ],
};

export const planDefinitions = [freePlan, premiumPlan];
