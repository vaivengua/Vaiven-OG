import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
          ¿Listo para optimizar tu logística?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
          Únete a la comunidad de empresas y transportistas que confían en VAIVEN
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
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
    </section>
  );
};

export default CTASection;