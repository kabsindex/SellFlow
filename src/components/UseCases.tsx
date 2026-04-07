import { motion } from 'framer-motion';
import {
  CameraIcon,
  StoreIcon,
  BriefcaseIcon } from
'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
const useCases = [
{
  icon: CameraIcon,
  title: 'Vendeur Instagram',
  description:
  'Tu postes tes produits sur Insta et tu gères les commandes en DM ? Centralise tout avec une vraie boutique et un suivi automatique.',
  color: 'bg-pink-50 text-pink-600 border-pink-100'
},
{
  icon: StoreIcon,
  title: 'Commerce local',
  description:
  'Tu as une boutique physique et tu veux vendre en ligne ? Crée ton catalogue digital et reçois des commandes même quand tu es fermé.',
  color: 'bg-blue-50 text-blue-600 border-blue-100'
},
{
  icon: BriefcaseIcon,
  title: 'Freelance',
  description:
  'Tu vends des services ou des produits artisanaux ? Présente ton offre, reçois des demandes et gère tes clients facilement.',
  color: 'bg-amber-50 text-amber-600 border-amber-100'
},
{
  icon: WhatsAppIcon,
  title: 'Vendeur WhatsApp',
  description:
  "Tu vends déjà sur WhatsApp mais tu perds des commandes ? Donne à tes clients un vrai parcours d'achat professionnel.",
  color: 'bg-green-50 text-green-600 border-green-100'
}];

export function UseCases() {
  return (
    <section className="py-16 sm:py-24 bg-white">
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
            Cas d'usage
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Conçu pour les vendeurs comme toi
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Que tu vendes des vêtements, de la nourriture, des services ou de
            l'artisanat, SellFlow s'adapte à ton activité.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {useCases.map((useCase, i) =>
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
              delay: i * 0.1
            }}
            whileHover={{
              y: -4
            }}
            className={`rounded-2xl border p-6 sm:p-8 transition-shadow hover:shadow-md ${useCase.color.split(' ')[2]}`}>
            
              <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${useCase.color.split(' ').slice(0, 2).join(' ')}`}>
              
                <useCase.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {useCase.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {useCase.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}


