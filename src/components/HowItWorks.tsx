import { motion } from 'framer-motion';
import { StoreIcon, Share2Icon } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
const steps = [
{
  number: '01',
  icon: StoreIcon,
  title: 'Crée ta boutique',
  description:
  'Inscris-toi gratuitement, ajoute tes produits avec photos et prix. Ta boutique est prête en 2 minutes.'
},
{
  number: '02',
  icon: Share2Icon,
  title: 'Partage ton lien',
  description:
  'Envoie le lien de ta boutique sur WhatsApp, Instagram, Facebook ou par SMS à tes clients.'
},
{
  number: '03',
  icon: WhatsAppIcon,
  title: 'Reçois des commandes',
  description:
  'Tes clients commandent en ligne et tu reçois chaque commande directement sur WhatsApp.'
}];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
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
            Comment ça marche
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Prêt en 3 étapes simples
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Pas besoin d'être technique. Si tu sais utiliser WhatsApp, tu sais
            utiliser SellFlow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) =>
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
              delay: i * 0.15
            }}
            className="relative text-center">
            
              {i < steps.length - 1 &&
            <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
            }
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-primary-50 rounded-3xl mb-6">
                <step.icon className="w-10 h-10 text-primary-500" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
