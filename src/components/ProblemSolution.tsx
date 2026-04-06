import { motion } from 'framer-motion';
import {
  XCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  CreditCardIcon,
  ArrowRightIcon } from
'lucide-react';
const problems = [
{
  icon: MessageSquareIcon,
  text: 'Messages éparpillés entre WhatsApp, Instagram et SMS'
},
{
  icon: ClipboardListIcon,
  text: 'Commandes perdues ou oubliées dans les conversations'
},
{
  icon: CreditCardIcon,
  text: 'Aucun suivi des paiements ni des livraisons'
},
{
  icon: AlertTriangleIcon,
  text: "Pas de visibilité sur ton chiffre d'affaires réel"
}];

const solutions = [
'Toutes tes commandes centralisées en un seul endroit',
'Boutique en ligne partageable sur WhatsApp en 1 clic',
'Suivi automatique des paiements et livraisons',
'Dashboard clair avec tes chiffres en temps réel'];

export function ProblemSolution() {
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
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Tu vends déjà. Mais tu perds du temps.
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            La plupart des vendeurs gèrent tout manuellement. SellFlow
            transforme le chaos en système.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problems */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.5
            }}
            className="bg-red-50/50 border border-red-100 rounded-2xl p-6 sm:p-8">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircleIcon className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sans SellFlow</h3>
            </div>
            <div className="space-y-4">
              {problems.map((problem, i) =>
              <div key={i} className="flex items-start gap-3">
                  <problem.icon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">
                    {problem.text}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="bg-primary-50/50 border border-primary-100 rounded-2xl p-6 sm:p-8">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Avec SellFlow</h3>
            </div>
            <div className="space-y-4">
              {solutions.map((solution, i) =>
              <div key={i} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">
                    {solution}
                  </p>
                </div>
              )}
            </div>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 mt-6 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors">
              
              Commencer maintenant
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>);

}
