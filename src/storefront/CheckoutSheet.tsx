import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  FileTextIcon,
  SmartphoneIcon,
  BanknoteIcon,
  CreditCardIcon,
  CheckCircleIcon } from
'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatUsd } from '../lib/currency';
import { useCart } from './useCart';
const paymentMethods = [
{
  id: 'mobile_money',
  label: 'Mobile Money',
  sublabel: 'Orange, MTN, Wave...',
  icon: SmartphoneIcon
},
{
  id: 'cash',
  label: 'Cash à la livraison',
  sublabel: 'Payer à la réception',
  icon: BanknoteIcon
},
{
  id: 'virement',
  label: 'Virement bancaire',
  sublabel: 'Transfert direct',
  icon: CreditCardIcon
}];

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CheckoutSheet({ isOpen, onClose }: CheckoutSheetProps) {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    payment: 'mobile_money'
  });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      clearCart();
      setSubmitted(false);
      setForm({
        name: '',
        phone: '',
        address: '',
        notes: '',
        payment: 'mobile_money'
      });
      onClose();
    }, 2500);
  };
  const isValid = form.name.trim() && form.phone.trim() && form.address.trim();
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-50" />
        
          <motion.div
          initial={{
            y: '100%'
          }}
          animate={{
            y: 0
          }}
          exit={{
            y: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 300
          }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
          
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 rounded-t-3xl">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Finaliser la commande
                </h2>
                <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {submitted ?
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="flex-1 flex flex-col items-center justify-center py-16 px-6">
            
                <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              transition={{
                type: 'spring',
                delay: 0.1
              }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              
                  <CheckCircleIcon className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900">
                  Commande envoyée !
                </h3>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Ta commande a été envoyée via WhatsApp. Le vendeur te
                  contactera bientôt.
                </p>
              </motion.div> :

          <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-4 space-y-5">
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Résumé de la commande
                    </p>
                    <div className="space-y-2">
                      {items.map((item) =>
                  <div
                    key={`${item.id}-${item.size || 'default'}`}
                    className="flex items-center justify-between">
                    
                          <span className="text-sm text-gray-600">
                            {item.name} {item.size ? `(${item.size})` : ''} ×{' '}
                            {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatUsd(item.price * item.quantity)}
                          </span>
                        </div>
                  )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-bold text-primary-600">
                        {formatUsd(total)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">
                      Tes informations
                    </p>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                    type="text"
                    placeholder="Nom complet *"
                    value={form.name}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300" />
                  
                    </div>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                    type="tel"
                    placeholder="Numéro WhatsApp *"
                    value={form.phone}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300" />
                  
                    </div>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                    type="text"
                    placeholder="Adresse de livraison *"
                    value={form.address}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value
                    })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300" />
                  
                    </div>
                    <div className="relative">
                      <FileTextIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                    placeholder="Notes (optionnel)"
                    value={form.notes}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value
                    })
                    }
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 resize-none" />
                  
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-900">
                      Mode de paiement
                    </p>
                    <div className="space-y-2">
                      {paymentMethods.map((method) =>
                  <button
                    key={method.id}
                    onClick={() =>
                    setForm({
                      ...form,
                      payment: method.id
                    })
                    }
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${form.payment === method.id ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                    
                          <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.payment === method.id ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      
                            <method.icon
                        className={`w-5 h-5 ${form.payment === method.id ? 'text-primary-600' : 'text-gray-400'}`} />
                      
                          </div>
                          <div>
                            <p
                        className={`text-sm font-medium ${form.payment === method.id ? 'text-primary-700' : 'text-gray-900'}`}>
                        
                              {method.label}
                            </p>
                            <p className="text-xs text-gray-400">
                              {method.sublabel}
                            </p>
                          </div>
                        </button>
                  )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4">
                  <motion.button
                whileTap={{
                  scale: 0.97
                }}
                onClick={handleSubmit}
                disabled={!isValid}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-base transition-all ${isValid ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                
                    <WhatsAppIcon className="w-5 h-5" />
                    Confirmer et envoyer via WhatsApp
                  </motion.button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Ta commande sera envoyée au vendeur via WhatsApp
                  </p>
                </div>
              </div>
          }
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
