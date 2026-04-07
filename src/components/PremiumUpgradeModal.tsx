import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, EyeIcon, SparklesIcon, XIcon } from 'lucide-react';
import { apiRequest } from '../lib/api';
import type {
  BillingUpgradeResponse,
  PlanCapabilities,
} from '../lib/types';

interface PremiumUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onPlanUpdated?: (capabilities: PlanCapabilities) => void;
}

const premiumBenefits = [
  'Produits illimités',
  'Suppression du branding SellFlow',
  'Personnalisation visuelle de la boutique',
  'Ajout du logo vendeur',
  'CRM enrichi avec tags, notes et historique',
  'Analytics revenus du mois et top produits',
];

export function PremiumUpgradeModal({
  open,
  onClose,
  onPlanUpdated,
}: PremiumUpgradeModalProps) {
  const [loadingAction, setLoadingAction] = useState<'preview' | 'upgrade' | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    setLoadingAction('preview');
    setError(null);

    try {
      const capabilities = await apiRequest<PlanCapabilities>('/billing/preview', {
        method: 'POST',
        body: JSON.stringify({ enabled: true }),
      });

      onPlanUpdated?.(capabilities);
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Impossible d'ouvrir l'aperçu Premium.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpgrade = async () => {
    setLoadingAction('upgrade');
    setError(null);

    try {
      const response = await apiRequest<BillingUpgradeResponse>('/billing/upgrade', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      if (!response.maketou.redirectUrl) {
        throw new Error('URL de paiement Maketou introuvable.');
      }

      window.location.assign(response.maketou.redirectUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de lancer le paiement Premium.',
      );
      setLoadingAction(null);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-slate-950/50"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[91] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="flex w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_35px_100px_-40px_rgba(15,23,42,0.55)] max-h-[calc(100vh-2rem)] sm:max-h-[90vh]"
            >
              <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    Passer au Premium
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Le Premium est à <strong>1$ / mois</strong> et débloque les
                    fonctions boutique avancées sans casser la logique Basic.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

                <div className="mt-6 space-y-3">
                  {premiumBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {benefit}
                    </div>
                  ))}
                </div>

                {error ? (
                  <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:grid-cols-2 sm:px-6">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={loadingAction !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  <EyeIcon className="h-4 w-4" />
                  {loadingAction === 'preview'
                    ? 'Ouverture...'
                    : "Tester l'aperçu Premium"}
                </button>

                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={loadingAction !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  {loadingAction === 'upgrade'
                    ? 'Redirection...'
                    : 'Passer au Premium'}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}




