import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/Logos%20Vaiven/Logos%20en%20PNG/web%20logo%20oficial%20A.png" 
              alt="VAIVEN Logo" 
              className="h-16 md:h-24 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-600 hover:text-primary transition-colors font-medium">
              Inicio
            </Link>
            <Link to="/about" className="text-neutral-600 hover:text-primary transition-colors font-medium">
              Nosotros
            </Link>
            <Link to="/features" className="text-neutral-600 hover:text-primary transition-colors font-medium">
              Características
            </Link>
            <Link to="/how-it-works" className="text-neutral-600 hover:text-primary transition-colors font-medium">
              Cómo Funciona
            </Link>
            <Link to="/contact" className="text-neutral-600 hover:text-primary transition-colors font-medium">
              Contacto
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-neutral-600 hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white border-t border-neutral-200 shadow-lg">
              <Link
                to="/"
                className="block px-4 py-3 text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors font-medium rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/about"
                className="block px-4 py-3 text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors font-medium rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Nosotros
              </Link>
              <Link
                to="/features"
                className="block px-4 py-3 text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors font-medium rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Características
              </Link>
              <Link
                to="/how-it-works"
                className="block px-4 py-3 text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors font-medium rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 text-neutral-600 hover:text-primary hover:bg-neutral-50 transition-colors font-medium rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </Link>
              <div className="pt-4 space-y-3 border-t border-neutral-200">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors py-3"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 transition-colors py-3"
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
