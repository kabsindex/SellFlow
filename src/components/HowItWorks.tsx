import { motion } from 'framer-motion';
import { Share2Icon, StoreIcon } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const steps = [
  {
    number: '01',
    icon: StoreIcon,
    title: 'Crée ta boutique',
    description:
      'Inscris-toi gratuitement, ajoute tes produits avec photos et prix. Ta boutique est prête en 2 minutes.',
  },
  {
    number: '02',
    icon: Share2Icon,
    title: 'Partage ton lien',
    description:
      'Envoie le lien de ta boutique sur WhatsApp, Instagram, Facebook ou par SMS à tes clients.',
  },
  {
    number: '03',
    icon: WhatsAppIcon,
    title: 'Reçois des commandes',
    description:
      'Tes clients commandent, choisissent un paiement, ajoutent leur preuve et tu reçois le récapitulatif directement sur WhatsApp.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
            Comment ça marche
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Prêt en 3 étapes simples
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Pas besoin d'être technique. Si tu sais utiliser WhatsApp, tu sais
            utiliser SellFlow.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 ? (
                <div className="absolute left-[60%] top-12 hidden w-[80%] border-t-2 border-dashed border-gray-200 md:block" />
              ) : null}

              <div className="relative mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-50">
                <step.icon className="h-10 w-10 text-primary-500" />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mx-auto max-w-xs leading-relaxed text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}




