import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  PlayCircleIcon,
  TruckIcon,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const heroOrders = [
  {
    name: 'Robe Ankara',
    price: '$24',
    status: 'Nouveau',
    tone: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Sac en cuir',
    price: '$39',
    status: 'En cours',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    name: 'Bijoux dorés',
    price: '$12',
    status: 'Livré',
    tone: 'bg-slate-100 text-slate-600',
  },
];

const heroHighlights = [
  'Catalogue professionnel et partageable',
  'Commandes structurées directement sur WhatsApp',
  'Paiements, suivi client et livraison au même endroit',
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 right-0 h-80 w-80 rounded-full bg-emerald-100 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-primary-50 blur-3xl opacity-60" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <WhatsAppIcon className="h-4 w-4" />
            La boutique WhatsApp pensée pour les vendeurs qui veulent structurer
            leurs ventes
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Transformez vos conversations WhatsApp en commandes claires,
            suivies et prêtes à être payées.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            SellFlow centralise votre catalogue, votre panier, vos commandes et
            vos confirmations clients dans une expérience simple pour acheter et
            professionnelle pour vendre.
          </p>

          <div className="mt-8 space-y-3">
            {heroHighlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-3 text-sm font-medium text-gray-700 sm:text-base"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="text-xs">+</span>
                </span>
                {highlight}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/20 transition-colors hover:bg-primary-600"
            >
              Créer ma boutique
              <ArrowRightIcon className="h-5 w-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-7 py-4 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              <PlayCircleIcon className="h-5 w-5" />
              Voir le parcours client
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Mise en ligne en 2 minutes • Aucune carte requise • Essai gratuit
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="relative mx-auto w-[320px] max-w-full sm:w-[360px]">
            <div className="rounded-[3.2rem] bg-slate-900 p-3 shadow-[0_40px_120px_-30px_rgba(15,23,42,0.45)]">
              <div className="overflow-hidden rounded-[2.5rem] bg-white">
                <div className="flex items-center justify-between bg-emerald-500 px-6 py-4">
                  <span className="text-lg font-bold text-white">SellFlow</span>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55" />
                  </div>
                </div>

                <div className="relative px-5 pt-6 pb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Aujourd&apos;hui</p>
                      <p className="mt-1 text-4xl font-bold text-slate-900">
                        $399
                      </p>
                    </div>
                    <span className="inline-flex rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                      +18%
                    </span>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <div className="w-[46%] rounded-[1.35rem] bg-slate-50 px-4 py-5 shadow-inner ring-1 ring-slate-100">
                      <WhatsAppIcon className="h-4 w-4 text-emerald-500" />
                      <p className="mt-3 text-sm text-slate-500">WhatsApp</p>
                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        18
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {heroOrders.map((order) => (
                      <div
                        key={order.name}
                        className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {order.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {order.price}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${order.tone}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700 ring-1 ring-emerald-100">
                    <TruckIcon className="h-4 w-4" />
                    <p className="text-sm font-semibold">3 livraisons en cours</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: -14 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.45 }}
              className="absolute left-[-26px] top-[150px] sm:left-[-58px]"
            >
              <div className="flex items-center gap-3 rounded-[1.45rem] border border-white/70 bg-white px-4 py-3 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Nouvelle commande!
                  </p>
                  <p className="text-sm text-slate-500">via WhatsApp</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.45 }}
              className="absolute right-[-18px] bottom-[112px] sm:right-[-54px]"
            >
              <div className="flex items-center gap-3 rounded-[1.45rem] border border-white/70 bg-white px-4 py-3 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <span className="text-lg font-bold">$</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Paiement reçu
                  </p>
                  <p className="text-sm font-semibold text-emerald-600">
                    +$24
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}




