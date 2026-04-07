import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2Icon,
  Clock3Icon,
  CrownIcon,
  PaintbrushIcon,
  SparklesIcon,
  StoreIcon,
  XCircleIcon,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { apiRequest } from '../lib/api';
import type { BillingConfirmResponse } from '../lib/types';

export function BillingReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, reloadSession } = useAuth();
  const [result, setResult] = useState<BillingConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const subscriptionId = searchParams.get('subscriptionId');
  const redirectPath = `/billing/return${window.location.search}`;

  useEffect(() => {
    if (loading || !isAuthenticated || !subscriptionId) {
      return;
    }

    let cancelled = false;
    const safeSubscriptionId = subscriptionId;

    async function confirmPayment() {
      setChecking(true);
      setError(null);

      try {
        const response = await apiRequest<BillingConfirmResponse>(
          `/billing/confirm?subscriptionId=${encodeURIComponent(safeSubscriptionId)}`,
        );

        if (cancelled) {
          return;
        }

        setResult(response);
        await reloadSession();
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Impossible de vérifier le paiement Maketou.',
        );
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    void confirmPayment();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loading, reloadSession, subscriptionId]);

  if (!subscriptionId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!loading && !isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  const isSuccess = result?.cartStatus === 'completed' && result.activated;
  const isPending = result?.cartStatus === 'waiting_payment';
  const isFailed =
    result?.cartStatus === 'payment_failed' || result?.cartStatus === 'abandoned';
  const unlockedBenefits = [
    'Suppression du branding SellFlow',
    'Personnalisation visuelle de la boutique',
    'Ajout du logo vendeur',
    'Produits illimités',
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] sm:p-8">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-600'
              : isPending
                ? 'bg-amber-50 text-amber-600'
                : 'bg-red-50 text-red-600'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2Icon className="h-8 w-8" />
          ) : isPending ? (
            <Clock3Icon className="h-8 w-8" />
          ) : (
            <XCircleIcon className="h-8 w-8" />
          )}
        </div>

        <h1 className="mt-5 text-center text-3xl font-bold text-slate-900">
          {checking
            ? 'Vérification du paiement'
            : isSuccess
              ? 'Premium activé'
              : isPending
                ? 'Paiement en attente'
                : 'Paiement non confirmé'}
        </h1>

        <p className="mt-3 text-center text-sm leading-relaxed text-slate-500">
          {checking
            ? 'Nous vérifions maintenant le statut du panier Maketou avant de mettre à jour ton abonnement.'
            : error ??
              result?.message ??
              'Impossible de récupérer le statut du paiement.'}
        </p>

        {isSuccess ? (
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#f8fafc_100%)]">
            <div className="border-b border-emerald-100 px-5 py-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
                <CrownIcon className="h-4 w-4" />
                Premium actif
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">
                Ton espace vendeur est passé en Premium.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Tu peux maintenant personnaliser la boutique, ajouter ton logo,
                retirer le branding SellFlow et publier sans limite.
              </p>
            </div>

            <div className="grid gap-3 px-5 py-5 sm:grid-cols-2">
              {unlockedBenefits.map((benefit, index) => {
                const Icon = index % 2 === 0 ? PaintbrushIcon : SparklesIcon;

                return (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm ring-1 ring-emerald-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {result?.capabilities.subscriptionEndDate ? (
          <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Fin d'abonnement :
            <span className="ml-2 font-semibold text-slate-900">
              {new Date(result.capabilities.subscriptionEndDate).toLocaleDateString(
                'fr-FR',
              )}
            </span>
          </div>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="inline-flex items-center justify-center rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Aller au dashboard
          </button>

          <Link
            to="/dashboard?tab=plus"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
          >
            Voir l'abonnement
          </Link>
        </div>

        {isSuccess ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/dashboard?tab=plus"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <PaintbrushIcon className="h-4 w-4" />
              Personnaliser ma boutique
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              <StoreIcon className="h-4 w-4" />
              Voir ma boutique
            </Link>
          </div>
        ) : null}

        {isFailed ? (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Le paiement n'a pas été confirmé par Maketou. Tu peux relancer le
            passage au Premium depuis ton dashboard.
          </div>
        ) : null}
      </div>
    </div>
  );
}



