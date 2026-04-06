import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
export function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          }}>
          
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <WhatsAppIcon className="w-4 h-4" />
            Prêt à vendre ?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Lance ta boutique en ligne{' '}
            <span className="text-primary-400">en 2 minutes</span>
          </h2>

          <p className="mt-5 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Rejoins des milliers de vendeurs qui utilisent SellFlow pour vendre
            via WhatsApp. Gratuit, simple, puissant.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-primary-500/20">
              
              Créer ma boutique gratuitement
              <ArrowRightIcon className="w-5 h-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors border border-white/10">
              
              En savoir plus
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Aucune carte bancaire requise · Prêt en 2 minutes · Annulable à tout
            moment
          </p>
        </motion.div>
      </div>
    </section>);

}
