import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  StoreIcon,
  CreditCardIcon,
  TruckIcon,
  CopyIcon,
  CheckIcon,
  LogOutIcon,
  SparklesIcon,
  SmartphoneIcon,
  BanknoteIcon,
  MapPinIcon,
  ShieldCheckIcon } from
'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
export function SettingsView() {
  const [copied, setCopied] = useState(false);
  const [payments, setPayments] = useState({
    mobileMoney: true,
    cash: true,
    virement: false
  });
  const shopLink = 'sellflow.io/amina';
  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shopLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3
        }}>
        
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gère ta boutique et ton compte
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.05
        }}
        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
            <StoreIcon className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Boutique Amina</h3>
            <p className="text-sm text-gray-500">Mode, accessoires & bijoux</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nom de la boutique
            </label>
            <input
              type="text"
              defaultValue="Boutique Amina"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              defaultValue="Mode africaine, accessoires et bijoux artisanaux. Livraison Dakar et banlieue."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
            
          </div>
        </div>
      </motion.div>

      {/* Shop link */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.1
        }}
        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Lien de ta boutique
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-primary-600 font-medium truncate">
            {shopLink}
          </div>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${copied ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            
            {copied ?
            <CheckIcon className="w-5 h-5" /> :

            <CopyIcon className="w-5 h-5" />
            }
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Partage ce lien sur WhatsApp, Instagram ou par SMS
        </p>
      </motion.div>

      {/* WhatsApp */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.15
        }}
        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <WhatsAppIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
            <p className="text-xs text-gray-500">
              Numéro pour recevoir les commandes
            </p>
          </div>
        </div>
        <input
          type="tel"
          defaultValue="+221 77 123 4567"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        
      </motion.div>

      {/* Payments */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.2
        }}
        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <CreditCardIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Moyens de paiement
            </p>
            <p className="text-xs text-gray-500">
              Active les méthodes acceptées
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {[
          {
            key: 'mobileMoney' as const,
            label: 'Mobile Money',
            sublabel: 'Orange, MTN, Wave...',
            icon: SmartphoneIcon
          },
          {
            key: 'cash' as const,
            label: 'Paiement à la livraison',
            sublabel: 'Cash',
            icon: BanknoteIcon
          },
          {
            key: 'virement' as const,
            label: 'Virement bancaire',
            sublabel: 'Transfert',
            icon: ShieldCheckIcon
          }].
          map((method) =>
          <div
            key={method.key}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            
              <div className="flex items-center gap-3">
                <method.icon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-400">{method.sublabel}</p>
                </div>
              </div>
              <button
              onClick={() =>
              setPayments((p) => ({
                ...p,
                [method.key]: !p[method.key]
              }))
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${payments[method.key] ? 'bg-primary-500' : 'bg-gray-200'}`}>
              
                <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${payments[method.key] ? 'translate-x-5.5 left-[1px]' : 'left-0.5'}`}
                style={{
                  transform: payments[method.key] ?
                  'translateX(22px)' :
                  'translateX(0)'
                }} />
              
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delivery zones */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.25
        }}
        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <TruckIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Zones de livraison
            </p>
            <p className="text-xs text-gray-500">
              Configure tes zones et tarifs
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {[
          {
            zone: 'Dakar Centre',
            price: '$3'
          },
          {
            zone: 'Dakar Banlieue',
            price: '$4'
          },
          {
            zone: 'Hors Dakar',
            price: '$8'
          }].
          map((z) =>
          <div
            key={z.zone}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">{z.zone}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{z.price}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Plan */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.3
        }}
        className="bg-primary-50 rounded-2xl border border-primary-100 p-5">
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Plan Basique
              </p>
              <p className="text-xs text-gray-500">
                5 produits · Branding SellFlow
              </p>
            </div>
          </div>
        </div>
        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
          <SparklesIcon className="w-4 h-4" />
          Passer au Premium — 1$/mois
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Produits illimités · Analytics · Sans branding
        </p>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          delay: 0.35
        }}>
        
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-600 font-semibold py-3.5 rounded-xl text-sm hover:bg-red-50 transition-colors">
          <LogOutIcon className="w-5 h-5" />
          Se déconnecter
        </button>
      </motion.div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-4" />
    </div>);

}
