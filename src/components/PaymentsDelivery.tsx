import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  TruckIcon,
  SmartphoneIcon,
  BanknoteIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon } from
'lucide-react';
export function PaymentsDelivery() {
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
            Paiements & Livraison
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Encaisse et livre sans prise de tête
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Gère les paiements et les livraisons adaptés à ton marché. Mobile
            money, cash, virement — tout est supporté.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payments */}
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
            className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
            
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
              <CreditCardIcon className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Paiements flexibles
            </h3>
            <p className="text-gray-500 mb-6">
              Accepte les paiements comme tes clients préfèrent payer.
            </p>

            <div className="space-y-3">
              {[
              {
                icon: SmartphoneIcon,
                label: 'Mobile Money (Orange, MTN, Wave...)'
              },
              {
                icon: BanknoteIcon,
                label: 'Paiement à la livraison (Cash)'
              },
              {
                icon: CreditCardIcon,
                label: 'Virement bancaire'
              },
              {
                icon: ShieldCheckIcon,
                label: 'Suivi de chaque transaction'
              }].
              map((item, i) =>
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                
                  <item.icon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">
                    {item.label}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delivery */}
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
              duration: 0.5,
              delay: 0.1
            }}
            className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
            
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Livraison organisée
            </h3>
            <p className="text-gray-500 mb-6">
              Suis chaque livraison et informe tes clients automatiquement.
            </p>

            <div className="space-y-3">
              {[
              {
                icon: MapPinIcon,
                label: 'Zones de livraison personnalisables'
              },
              {
                icon: ClockIcon,
                label: 'Suivi en temps réel des statuts'
              },
              {
                icon: CheckCircleIcon,
                label: 'Confirmation de livraison automatique'
              },
              {
                icon: TruckIcon,
                label: 'Gestion des livreurs intégrée'
              }].
              map((item, i) =>
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                
                  <item.icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">
                    {item.label}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}
