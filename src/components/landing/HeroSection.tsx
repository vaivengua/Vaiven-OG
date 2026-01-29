import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };
  return (
    <section className="bg-gradient-to-br from-primary to-secondary text-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 md:mb-6">
              Conecta tu carga con transportistas confiables en Guatemala
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed">
              La plataforma más confiable para envíos de carga. Transportistas verificados, seguimiento en tiempo real y pagos seguros.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 transition-colors w-full sm:w-auto"
                onClick={handleLoginClick}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
              <Button 
                size="lg" 
                className="bg-accent text-white hover:bg-green-600 transition-colors w-full sm:w-auto"
                onClick={handleRegisterClick}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Registrarse
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
              alt="Camión de carga moderno en carretera - Transporte de mercancías"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;