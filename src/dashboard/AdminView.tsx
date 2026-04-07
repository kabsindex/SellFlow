import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CrownIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import type { AdminDashboardPayload, PlanType } from '../lib/types';

interface PlanPreviewPayload {
  premiumPrice: string;
  plans: {
    basic: {
      name: string;
      features: string[];
    };
    premium: {
      name: string;
      features: string[];
    };
  };
}

export function AdminView() {
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [planPreview, setPlanPreview] = useState<PlanPreviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingTenantId, setSubmittingTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboardPayload, previewPayload] = await Promise.all([
        apiRequest<AdminDashboardPayload>('/admin/dashboard'),
        apiRequest<PlanPreviewPayload>('/admin/plan-preview'),
      ]);

      setDashboard(dashboardPayload);
      setPlanPreview(previewPayload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger la vue admin.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const handlePlanSwitch = async (
    tenantId: string,
    planType: PlanType,
    previewMode?: boolean,
  ) => {
    setSubmittingTenantId(tenantId);

    try {
      await apiRequest(`/admin/subscriptions/${tenantId}/plan`, {
        method: 'PATCH',
        body: JSON.stringify({
          planType,
          previewMode,
        }),
      });

      await loadAdminData();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de mettre le plan à jour.',
      );
    } finally {
      setSubmittingTenantId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Chargement de la vue super admin...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
            <CrownIcon className="h-4 w-4" />
            Super admin plateforme
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Administration SellFlow
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            Gère les comptes vendeurs, les abonnements actifs ou expirés et
            teste la bascule Basic / Premium de manière contrôlée.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAdminData()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Actualiser
        </button>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Comptes
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {dashboard?.totals.accounts ?? 0}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Premium actifs
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {dashboard?.totals.activeSubscriptions ?? 0}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Premium expirés
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {dashboard?.totals.expiredSubscriptions ?? 0}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <SparklesIcon className="h-4 w-4 text-primary-500" />
            Premium
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {planPreview?.premiumPrice ?? '1$ / mois'}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Tarif officiel utilisé par la plateforme.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Comptes vendeurs
              </p>
              <p className="text-xs text-slate-500">
                Bascule Basic / Premium et mode preview
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {dashboard?.accounts.map((account) => {
              const isSubmitting = submittingTenantId === account.tenantId;

              return (
                <div
                  key={account.tenantId}
                  className="rounded-[1.5rem] border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {account.storeName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {account.ownerName ?? 'Sans propriétaire'} ·{' '}
                        {account.ownerWhatsapp ?? 'Sans numéro'}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {account.currentPlan} · {account.subscriptionStatus}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          void handlePlanSwitch(account.tenantId, 'BASIC', false)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Vue Basic
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          void handlePlanSwitch(account.tenantId, 'PREMIUM', false)
                        }
                        className="rounded-xl bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Forcer Premium
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          void handlePlanSwitch(
                            account.tenantId,
                            account.currentPlan,
                            !account.premiumPreview,
                          )
                        }
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {account.premiumPreview ? 'Couper preview' : 'Activer preview'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Plan
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {account.currentPlan}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Preview
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {account.premiumPreview ? 'Actif' : 'Inactif'}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Fin abonnement
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {account.subscriptionEndDate
                          ? new Date(account.subscriptionEndDate).toLocaleDateString(
                              'fr-FR',
                            )
                          : 'Aucune'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Fonctionnalités par plan
                </p>
                <p className="text-xs text-slate-500">
                  Lecture rapide des différences Basic / Premium
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {planPreview?.plans.basic.name ?? 'Basic'}
                </p>
                <div className="mt-3 space-y-2">
                  {planPreview?.plans.basic.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-600"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {planPreview?.plans.premium.name ?? 'Premium'}
                </p>
                <div className="mt-3 space-y-2">
                  {planPreview?.plans.premium.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-600"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




