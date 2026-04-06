import { motion } from 'framer-motion';
import {
  BarChart3Icon,
  UsersIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  PackageIcon } from
'lucide-react';
export function ProductMockup() {
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
            Tableau de bord
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Pilote ton business en un coup d'œil
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Un dashboard pensé pour les vendeurs. Simple, clair et actionnable.
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 30
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
            duration: 0.6
          }}
          className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
          
          {/* Top bar */}
          <div className="bg-gray-900 px-4 sm:px-6 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-800 rounded-lg px-4 py-1.5 text-xs text-gray-400 text-center max-w-xs mx-auto">
                app.sellflow.io/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Bonjour, Amina 👋
                </h3>
                <p className="text-sm text-gray-500">
                  Voici le résumé de ta journée
                </p>
              </div>
              <div className="bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                Premium
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[
              {
                icon: TrendingUpIcon,
                label: 'Revenus',
                value: '$799',
                change: '+23%',
                color: 'text-primary-500'
              },
              {
                icon: ShoppingBagIcon,
                label: 'Commandes',
                value: '47',
                change: '+12%',
                color: 'text-blue-500'
              },
              {
                icon: UsersIcon,
                label: 'Clients',
                value: '156',
                change: '+8%',
                color: 'text-purple-500'
              },
              {
                icon: PackageIcon,
                label: 'Produits',
                value: '32',
                change: '',
                color: 'text-amber-500'
              }].
              map((stat, i) =>
              <div key={i} className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.change &&
                <p className="text-xs text-primary-600 font-medium mt-0.5">
                      {stat.change}
                    </p>
                }
                </div>
              )}
            </div>

            {/* Chart placeholder */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-900">
                  Revenus cette semaine
                </p>
                <BarChart3Icon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) =>
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1">
                  
                    <div
                    className="w-full bg-primary-400 rounded-t-md transition-all"
                    style={{
                      height: `${h}%`
                    }} />
                  
                    <span className="text-[10px] text-gray-400">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent orders */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Commandes récentes
              </p>
              <div className="space-y-2">
                {[
                {
                  client: 'Fatou D.',
                  product: 'Robe Wax',
                  amount: '$29',
                  status: 'Nouveau',
                  statusColor: 'bg-blue-50 text-blue-600'
                },
                {
                  client: 'Kofi M.',
                  product: 'Sneakers',
                  amount: '$55',
                  status: 'Payé',
                  statusColor: 'bg-primary-50 text-primary-600'
                },
                {
                  client: 'Awa S.',
                  product: 'Sac cuir',
                  amount: '$35',
                  status: 'Expédié',
                  statusColor: 'bg-amber-50 text-amber-600'
                }].
                map((order, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">
                          {order.client[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.client}
                        </p>
                        <p className="text-xs text-gray-400">{order.product}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {order.amount}
                      </p>
                      <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.statusColor}`}>
                      
                        {order.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}
