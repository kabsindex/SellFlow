import { motion } from 'framer-motion';
import {
  BanknoteIcon,
  BellIcon,
  CheckIcon,
  LinkIcon,
  MapPinIcon,
  SendIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const benefits = [
  {
    title: 'Un resume complet',
    description:
      'Produit, taille, montant, client et adresse arrivent dans un seul message.',
  },
  {
    title: 'Une confirmation rapide',
    description:
      'Vous repondez vite avec un message propre, sans ressaisir les details.',
  },
  {
    title: 'Un suivi rassurant',
    description:
      'Le client recoit des mises a jour claires jusqu a la livraison.',
  },
];

export function WhatsAppHighlight() {
  return (
    <section className="bg-[linear-gradient(180deg,#f7fdf9_0%,#ffffff_100%)] py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            <WhatsAppIcon className="h-4 w-4" />
            Flux WhatsApp structure
          </div>

          <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Chaque commande arrive dans WhatsApp avec tout le contexte utile pour
            vendre plus vite.
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            SellFlow ne se contente pas d envoyer un message. La plateforme
            prepare un recapitulatif clair, facilite la confirmation et garde le
            client informe a chaque etape.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {benefit.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_32px_80px_-24px_rgba(21,128,61,0.22)]">
              <div className="flex items-center gap-3 bg-emerald-600 px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white">
                  B
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    Boutique Amina
                  </p>
                  <p className="text-sm text-emerald-100">en ligne</p>
                </div>
              </div>

              <div className="space-y-4 bg-[#e9dfd4] px-5 py-5">
                <div className="flex justify-end">
                  <div className="max-w-[78%] rounded-[1.7rem] rounded-tr-sm bg-[#dff7b7] px-5 py-4 shadow-sm">
                    <p className="text-[15px] leading-7 text-slate-900">
                      Bonjour ! Je voudrais commander la robe Ankara en taille M
                    </p>
                    <p className="mt-2 text-right text-xs text-slate-500">
                      14:32
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="w-[86%] rounded-[1.7rem] rounded-tl-sm bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-white">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                      <p className="text-xl font-bold">Nouvelle commande recue !</p>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <ShoppingBagIcon className="h-4 w-4 text-emerald-600" />
                        Robe Ankara — Taille M
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                        <BanknoteIcon className="h-4 w-4 text-emerald-600" />
                        $24
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                        <UserIcon className="h-4 w-4 text-emerald-600" />
                        Fatou Diallo
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                        <MapPinIcon className="h-4 w-4 text-emerald-600" />
                        Dakar, Plateau
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">14:32</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[74%] rounded-[1.7rem] rounded-tr-sm bg-[#dff7b7] px-5 py-4 shadow-sm">
                    <p className="text-[15px] leading-7 text-slate-900">
                      Commande confirmee. Livraison demain avant 18h !
                    </p>
                    <p className="mt-2 text-right text-xs text-slate-500">
                      14:33
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
                    <BellIcon className="h-3.5 w-3.5" />
                    Statut mis a jour : En preparation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-3">
                <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                  Ecrire un message...
                </div>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.35 }}
              className="absolute -bottom-5 -left-5 sm:-left-10"
            >
              <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/70 bg-white px-4 py-3 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    sellflow.io/amina
                  </p>
                  <p className="text-xs text-slate-400">Lien boutique partage</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
