import { WhatsAppIcon } from './WhatsAppIcon';
import { BrandLogo } from './BrandLogo';
const footerLinks = {
  Produit: [
  {
    label: 'Fonctionnalités',
    href: '#features'
  },
  {
    label: 'Tarifs',
    href: '#pricing'
  },
  {
    label: 'Comment ça marche',
    href: '#how-it-works'
  },
  {
    label: 'FAQ',
    href: '#faq'
  }],

  Entreprise: [
  {
    label: 'À propos',
    href: '#'
  },
  {
    label: 'Blog',
    href: '#'
  },
  {
    label: 'Carrières',
    href: '#'
  },
  {
    label: 'Contact',
    href: '#'
  }],

  Légal: [
  {
    label: "Conditions d'utilisation",
    href: '#'
  },
  {
    label: 'Politique de confidentialité',
    href: '#'
  },
  {
    label: 'Mentions légales',
    href: '#'
  }]

};
export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <BrandLogo
                iconClassName="h-8 w-8 rounded-lg"
                nameClassName="text-xl font-bold text-gray-900"
              />
            </a>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              La plateforme de commerce conversationnel pour les vendeurs
              modernes.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
              
              <WhatsAppIcon className="w-4 h-4" />
              Nous contacter sur WhatsApp
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) =>
          <div key={title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) =>
              <li key={link.label}>
                    <a
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  
                      {link.label}
                    </a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SellFlow. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              
              Twitter
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              
              Instagram
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              
              LinkedIn
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>);

}
