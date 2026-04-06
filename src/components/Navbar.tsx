import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon, ShoppingBagIcon } from 'lucide-react';

const navLinks = [
  {
    label: 'Fonctionnalites',
    href: '#features',
  },
  {
    label: 'Comment ca marche',
    href: '#how-it-works',
  },
  {
    label: 'Tarifs',
    href: '#pricing',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <ShoppingBagIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SellFlow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Se connecter
          </Link>
          <a
            href="#pricing"
            className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Commencer gratuitement
          </a>
        </div>

        <button
          className="p-2 text-gray-600 md:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-gray-100 bg-white md:hidden"
          >
            <div className="space-y-3 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ))}

              <div className="space-y-2 border-t border-gray-100 pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-center text-sm font-medium text-gray-700"
                >
                  Se connecter
                </Link>
                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-primary-500 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Commencer gratuitement
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
