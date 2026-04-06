import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
const faqs = [
{
  question: 'Est-ce que SellFlow est vraiment gratuit ?',
  answer:
  'Oui ! Le plan Basique est 100% gratuit et te permet de créer ta boutique, recevoir des commandes illimitées et vendre via WhatsApp. Tu peux passer au Premium à 1$/mois quand tu veux plus de fonctionnalités.'
},
{
  question: 'Ai-je besoin de compétences techniques ?',
  answer:
  "Pas du tout. Si tu sais utiliser WhatsApp, tu sais utiliser SellFlow. L'interface est conçue pour être simple et intuitive. Ta boutique est prête en moins de 2 minutes."
},
{
  question: 'Comment mes clients passent commande ?',
  answer:
  'Tu partages le lien de ta boutique sur WhatsApp, Instagram ou par SMS. Tes clients voient ton catalogue, ajoutent des produits au panier et passent commande. Tu reçois la commande directement sur WhatsApp.'
},
{
  question: 'Quels moyens de paiement sont acceptés ?',
  answer:
  'SellFlow supporte le Mobile Money (Orange Money, MTN, Wave...), le paiement à la livraison (cash) et les virements bancaires. Tu choisis les méthodes qui conviennent à tes clients.'
},
{
  question: 'Est-ce que ça marche dans mon pays ?',
  answer:
  'SellFlow est disponible dans plus de 12 pays en Afrique et dans les marchés émergents. Si tu as accès à WhatsApp et à internet, tu peux utiliser SellFlow.'
},
{
  question: 'Puis-je annuler le Premium à tout moment ?',
  answer:
  "Absolument. Il n'y a aucun engagement. Tu peux passer au Premium et revenir au plan Basique quand tu veux. Tes données et ta boutique restent intactes."
}];

function FAQItem({
  faq,
  isOpen,
  onToggle




}: {faq: (typeof faqs)[0];isOpen: boolean;onToggle: () => void;}) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
        aria-expanded={isOpen}>
        
        <span className="text-base font-semibold text-gray-900 pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0
          }}
          transition={{
            duration: 0.2
          }}
          className="flex-shrink-0">
          
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="overflow-hidden">
          
            <p className="pb-5 text-gray-500 leading-relaxed text-sm">
              {faq.answer}
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
          className="text-center mb-12">
          
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Questions fréquentes
          </h2>
        </motion.div>

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
            margin: '-30px'
          }}
          transition={{
            duration: 0.5
          }}
          className="bg-gray-50 rounded-2xl border border-gray-100 px-6 sm:px-8">
          
          {faqs.map((faq, i) =>
          <FAQItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)} />

          )}
        </motion.div>
      </div>
    </section>);

}
