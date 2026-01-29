import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/Logos%20Vaiven/Logos%20en%20PNG/Logo%20oficial%20B.png" 
                alt="VAIVEN Logo" 
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>
            <p className="text-neutral-400 leading-relaxed text-sm md:text-base">Movemos lo que importa, donde importa.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Plataforma</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/about" className="hover:text-white transition-colors text-sm md:text-base">Nosotros</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors text-sm md:text-base">Características</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors text-sm md:text-base">Cómo Funciona</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors text-sm md:text-base">Precios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Soporte</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/contact" className="hover:text-white transition-colors text-sm md:text-base">Contacto</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors text-sm md:text-base">Acceder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/terms" className="hover:text-white transition-colors text-sm md:text-base">Términos de uso</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors text-sm md:text-base">Política de privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-neutral-400">
          <p className="text-sm md:text-base">&copy; 2026 VAIVEN Guatemala. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;