import { motion } from 'framer-motion';
import {
  StoreIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  LayoutDashboardIcon } from
'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
const features = [
{
  icon: StoreIcon,
  title: 'Boutique en ligne',
  description:
  'Crée une boutique professionnelle en quelques minutes. Ajoute tes produits, tes prix et partage ton lien.',
  color: 'bg-blue-50 text-blue-600'
},
{
  icon: ShoppingCartIcon,
  title: 'Gestion des commandes',
  description:
  'Reçois, suis et gère toutes tes commandes depuis un seul écran. Plus rien ne se perd.',
  color: 'bg-purple-50 text-purple-600'
},
{
  icon: WhatsAppIcon,
  title: 'Intégration WhatsApp',
  description:
  "Tes clients commandent et tu reçois tout sur WhatsApp. Le canal qu'ils utilisent déjà.",
  color: 'bg-green-50 text-green-600'
},
{
  icon: CreditCardIcon,
  title: 'Paiements',
  description:
  'Accepte les paiements mobile money, virement et cash. Suis chaque transaction facilement.',
  color: 'bg-amber-50 text-amber-600'
},
{
  icon: TruckIcon,
  title: 'Livraison',
  description:
  'Gère tes livraisons, assigne des livreurs et informe tes clients en temps réel.',
  color: 'bg-red-50 text-red-600'
},
{
  icon: LayoutDashboardIcon,
  title: 'Dashboard complet',
  description:
  "Visualise ton chiffre d'affaires, tes commandes et tes clients dans un tableau de bord clair.",
  color: 'bg-primary-50 text-primary-600'
}];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true,
            margin: '-50px'
          }}
          transition={{
            duration: 0.5
          }}
          className="text-center mb-12 sm:mb-16">
          
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-3">
            Fonctionnalités
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Tout ce qu'il faut pour vendre en ligne
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Une plateforme complète qui remplace tes carnets, tes tableurs et
            tes messages éparpillés.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) =>
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              margin: '-30px'
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.08
            }}
            whileHover={{
              y: -4
            }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            
              <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color}`}>
              
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
