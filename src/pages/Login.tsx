import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  LockIcon,
  PackageIcon,
  ShoppingBagIcon,
  StoreIcon,
  UsersIcon,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

const loginHighlights = [
  {
    icon: StoreIcon,
    title: 'Catalogue vendeur',
    text: 'Ajoute tes produits, tes prix et publie ta boutique en quelques minutes.',
  },
  {
    icon: ShoppingBagIcon,
    title: 'Suivi des commandes',
    text: 'Confirme, prepare et livre chaque commande depuis un dashboard simple.',
  },
  {
    icon: UsersIcon,
    title: 'CRM client',
    text: 'Retrouve les historiques, les notes et les segments importants.',
  },
];

export function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    whatsapp: '',
    password: '',
  });

  const isValid = Boolean(form.whatsapp.trim() && form.password.trim());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex-1"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white">
              <ShoppingBagIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">SellFlow</span>
          </Link>

          <div className="mt-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <WhatsAppIcon className="h-4 w-4" />
              Connexion vendeur simple et rapide
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Connecte-toi avec ton numero WhatsApp et gere ta boutique.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Une connexion simple pour acceder a ton espace vendeur, ton
              catalogue, tes commandes et ton CRM sans friction.
            </p>

            <div className="mt-8 space-y-4">
              {loginHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-10 w-full max-w-xl lg:mt-0 lg:w-[460px]"
        >
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <WhatsAppIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Connexion</p>
                <p className="text-sm text-slate-500">
                  Accede a ton espace vendeur SellFlow
                </p>
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Numero WhatsApp
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-400 focus-within:bg-white">
                  <WhatsAppIcon className="h-5 w-5 text-emerald-500" />
                  <input
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    value={form.whatsapp}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        whatsapp: event.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-400 focus-within:bg-white">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Ton mot de passe"
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">
                  Acces apres connexion
                </p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                    Dashboard vendeur
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                    Ajout produit & prix
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                    CRM & fiches clients
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                    Suivi des commandes
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold transition-all ${
                  isValid
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400'
                }`}
              >
                Se connecter
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <Link to="/" className="font-semibold text-primary-600 hover:text-primary-700">
                Voir les plans
              </Link>
            </p>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <p className="font-semibold">Connexion simple pour la demo</p>
              <p className="mt-1">
                Entre ton numero WhatsApp et ton mot de passe puis accede au
                dashboard vendeur.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <PackageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Acces vendeur
                  </p>
                  <p className="text-xs text-slate-500">
                    Catalogue, commandes, CRM et suivi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
