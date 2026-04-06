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
    "Le plan ideal pour lancer sa boutique, vendre sur WhatsApp et gerer ses premieres commandes sans complexite.",
  cta: 'Commencer gratuitement',
  highlighted: false,
  limitNote: 'Jusqu a 5 produits publies',
  sections: [
    {
      title: 'Vente',
      items: [
        'Connexion via numero WhatsApp + mot de passe',
        'Catalogue produit et boutique en ligne',
        'Panier et checkout simple',
        'Commandes illimitees',
        'Paiements et livraison basiques',
      ],
    },
    {
      title: 'Pilotage',
      items: [
        'Dashboard vendeur essentiel',
        'Ajout produit, prix, stock et SKU',
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
    'Pour les vendeurs qui veulent un dashboard plus avance, un CRM plus riche et une boutique sans limites.',
  cta: 'Passer au Premium',
  highlighted: true,
  badge: 'Recommande',
  limitNote: 'Produits illimites',
  sections: [
    {
      title: 'Tout le Basique +',
      items: [
        'Suppression du branding SellFlow',
        'Produits illimites',
        'Priorite sur les demandes et relances clients',
      ],
    },
    {
      title: 'CRM avance',
      items: [
        'Tags, segments et scoring client',
        'Historique client enrichi',
        'Relances WhatsApp et vues CRM avancees',
      ],
    },
    {
      title: 'Pilotage avance',
      items: [
        'Analytics revenus, panier moyen et top produits',
        'Suivi commande plus detaille',
        "Gestion d'equipe et support prioritaire",
      ],
    },
  ],
};

export const planDefinitions = [freePlan, premiumPlan];
