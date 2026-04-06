import { motion } from 'framer-motion';
import { UsersIcon, ShoppingCartIcon, StoreIcon, GlobeIcon } from 'lucide-react';
const stats = [
{
  icon: UsersIcon,
  value: '2 000+',
  label: 'Vendeurs actifs'
},
{
  icon: ShoppingCartIcon,
  value: '50 000+',
  label: 'Commandes traitées'
},
{
  icon: StoreIcon,
  value: '1 500+',
  label: 'Boutiques créées'
},
{
  icon: GlobeIcon,
  value: '12',
  label: 'Pays'
}];

export function SocialProof() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 16
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
          className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {stats.map((stat, i) =>
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: 16
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.1
            }}
            className="text-center">
            
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl mb-3">
                <stat.icon className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}
