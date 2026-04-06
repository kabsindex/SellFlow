import { motion } from 'framer-motion';
import { StarIcon, QuoteIcon } from 'lucide-react';
const testimonials = [
{
  name: 'Amina Diallo',
  role: 'Vendeuse de vêtements, Dakar',
  quote:
  'Avant SellFlow, je perdais des commandes dans mes DMs Instagram. Maintenant tout est organisé et mes clientes commandent directement via mon lien WhatsApp. Mon chiffre a doublé en 2 mois.',
  avatar: 'AD',
  color: 'bg-pink-100 text-pink-600'
},
{
  name: 'Kofi Mensah',
  role: 'Boutique électronique, Accra',
  quote:
  "Le dashboard est incroyable. Je vois mes ventes, mes commandes en attente et mes livraisons en un coup d'œil. C'est exactement ce qu'il me fallait pour structurer mon business.",
  avatar: 'KM',
  color: 'bg-blue-100 text-blue-600'
},
{
  name: 'Fatoumata Bah',
  role: 'Traiteur & pâtissière, Abidjan',
  quote:
  "Mes clients adorent pouvoir voir mon catalogue et commander en ligne. Et moi j'adore recevoir les commandes sur WhatsApp avec tous les détails. Plus besoin de noter à la main !",
  avatar: 'FB',
  color: 'bg-amber-100 text-amber-600'
}];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
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
            Témoignages
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Ils vendent déjà avec SellFlow
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Des vendeurs comme toi qui ont transformé leur activité.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) =>
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
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) =>
              <StarIcon
                key={j}
                className="w-4 h-4 text-amber-400 fill-amber-400" />

              )}
              </div>

              <QuoteIcon className="w-8 h-8 text-gray-100 mb-3" />

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${testimonial.color}`}>
                
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
