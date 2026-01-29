import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Términos de Uso
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Términos de Uso
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Conoce las condiciones y términos que rigen el uso de nuestra plataforma VAIVEN.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 transition-colors"
              onClick={handleAccessClick}
            >
              🚀 Acceder a VAIVEN
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-0">
                         <CardHeader className="bg-primary text-white rounded-t-xl">
               <CardTitle className="text-2xl font-bold text-white">Términos y Condiciones de Uso</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Aceptación de los Términos</h2>
                <p className="text-neutral-600 mb-6">
                  Al acceder y utilizar la plataforma VAIVEN, usted acepta estar sujeto a estos términos y condiciones de uso. 
                  Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Descripción del Servicio</h2>
                <p className="text-neutral-600 mb-6">
                  VAIVEN es una plataforma digital que conecta transportistas con clientes para facilitar el transporte de carga. 
                  Nuestros servicios incluyen la publicación de cargas, cotizaciones, seguimiento en tiempo real y gestión de pagos.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Registro y Cuenta de Usuario</h2>
                <p className="text-neutral-600 mb-6">
                  Para utilizar nuestros servicios, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad 
                  de su información de acceso y de todas las actividades que ocurran bajo su cuenta.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Uso Aceptable</h2>
                <p className="text-neutral-600 mb-6">
                  Usted se compromete a utilizar la plataforma únicamente para fines legales y de acuerdo con estos términos. 
                  Está prohibido el uso de la plataforma para actividades fraudulentas, ilegales o que puedan dañar a otros usuarios.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">5. Responsabilidades del Usuario</h2>
                <p className="text-neutral-600 mb-6">
                  Como usuario de VAIVEN, usted es responsable de proporcionar información precisa y actualizada, 
                  cumplir con las leyes de transporte aplicables y mantener un comportamiento profesional en todas las interacciones.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">6. Tarifas y Pagos</h2>
                <p className="text-neutral-600 mb-6">
                  VAIVEN puede cobrar tarifas por el uso de ciertos servicios. Todas las tarifas se comunicarán claramente 
                  antes de la prestación del servicio. Los pagos se procesan de forma segura a través de nuestros proveedores autorizados.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">7. Privacidad y Protección de Datos</h2>
                <p className="text-neutral-600 mb-6">
                  La protección de su información personal es importante para nosotros. Nuestro uso de la información personal 
                  se rige por nuestra Política de Privacidad, que forma parte de estos términos.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">8. Limitación de Responsabilidad</h2>
                <p className="text-neutral-600 mb-6">
                  VAIVEN actúa como intermediario entre transportistas y clientes. No somos responsables por los servicios 
                  prestados por transportistas independientes ni por las acciones de los clientes.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">9. Modificaciones de los Términos</h2>
                <p className="text-neutral-600 mb-6">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados 
                  a través de la plataforma y entrarán en vigor inmediatamente después de su publicación.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">10. Terminación</h2>
                <p className="text-neutral-600 mb-6">
                  Podemos suspender o terminar su acceso a la plataforma en cualquier momento por violación de estos términos 
                  o por cualquier otra razón a nuestra discreción.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">11. Ley Aplicable</h2>
                <p className="text-neutral-600 mb-6">
                  Estos términos se rigen por las leyes de Guatemala. Cualquier disputa será resuelta en los tribunales 
                  competentes de Guatemala.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">12. Contacto</h2>
                <p className="text-neutral-600 mb-6">
                  Si tiene preguntas sobre estos términos, puede contactarnos a través de nuestra página de contacto 
                  o enviando un correo electrónico a legal@vaivengt.com.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                  <p className="text-blue-800 font-medium">
                    <strong>Última actualización:</strong> 4 de septiembre de 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfUse;
