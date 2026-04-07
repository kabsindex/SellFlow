import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
  SparklesIcon,
} from 'lucide-react';
import { planDefinitions } from '../lib/plans';

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
            Tarifs
          </p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Choisis un plan clair pour vendre, gérer ton CRM et suivre tes
            commandes.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Le plan Basique suffit pour démarrer vite. Le plan Premium débloque
            le vrai pilotage vendeur: catalogue sans limite, CRM enrichi et
            meilleur suivi business.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {planDefinitions.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`relative rounded-[2rem] border p-6 shadow-sm sm:p-8 ${
                plan.highlighted
                  ? 'border-primary-500 bg-[linear-gradient(180deg,rgba(236,253,245,0.9)_0%,rgba(255,255,255,1)_38%)] shadow-[0_25px_60px_-30px_rgba(16,185,129,0.35)]'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.badge && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-[linear-gradient(135deg,#16a34a_0%,#10b981_55%,#0f766e_100%)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(16,185,129,0.65)] ring-4 ring-white">
                    <SparklesIcon className="h-4 w-4" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex min-h-full flex-col">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tight text-slate-900">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-lg text-slate-500">
                      {plan.priceDetail}
                    </span>
                  </div>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                    {plan.description}
                  </p>
                </div>

                {plan.limitNote && (
                  <div
                    className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${
                      plan.highlighted
                        ? 'bg-white/90 text-primary-700 ring-1 ring-primary-100'
                        : 'bg-slate-50 text-slate-700 ring-1 ring-slate-100'
                    }`}
                  >
                    {plan.limitNote}
                  </div>
                )}

                <Link
                  to="/login"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>

                <div className="mt-8 space-y-5">
                  {plan.sections.map((section) => (
                    <div key={section.title} className="rounded-2xl bg-slate-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {section.title}
                      </p>
                      <div className="mt-3 space-y-3">
                        {section.items.map((item) => (
                          <div key={item} className="flex items-start gap-3">
                            <CheckIcon
                              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                plan.highlighted ? 'text-primary-500' : 'text-slate-400'
                              }`}
                            />
                            <span className="text-sm leading-relaxed text-slate-700">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {plan.note && (
                  <p className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-400">
                    {plan.note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-10 grid max-w-6xl gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 lg:grid-cols-3"
        >
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Plan Basique</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Idéal pour lancer sa boutique, publier jusqu'à 5 produits et
              suivre manuellement les commandes et clients.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Plan Premium</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Pensé pour les vendeurs qui veulent gérer plus de volume, mieux
              segmenter leurs clients et piloter leur activite.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <LockIcon className="h-4 w-4 text-emerald-300" />
              Ce que Premium débloque
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Produits illimités, CRM avancé, suppression du branding,
              analytics et meilleur suivi business.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


