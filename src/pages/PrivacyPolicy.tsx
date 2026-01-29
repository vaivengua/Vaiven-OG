import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Lock, Eye, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
            <Shield className="h-4 w-4 mr-2" />
            Política de Privacidad
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Política de Privacidad
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Protegemos tu información personal y garantizamos la seguridad de tus datos en VAIVEN.
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

      {/* Privacy Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-0">
                         <CardHeader className="bg-primary text-white rounded-t-xl">
               <CardTitle className="text-2xl font-bold text-white">Política de Privacidad y Protección de Datos</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Información que Recopilamos</h2>
                <p className="text-neutral-600 mb-6">
                  Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, 
                  publica una carga, envía una cotización o se comunica con nosotros. Esta información puede incluir:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Información de contacto (nombre, email, teléfono)</li>
                  <li>Información de la empresa y documentos comerciales</li>
                  <li>Información de vehículos y licencias de transporte</li>
                  <li>Información de pagos y transacciones</li>
                  <li>Comunicaciones y mensajes intercambiados</li>
                </ul>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Información Recopilada Automáticamente</h2>
                <p className="text-neutral-600 mb-6">
                  También recopilamos información automáticamente cuando utiliza nuestra plataforma:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Información del dispositivo y navegador</li>
                  <li>Dirección IP y ubicación aproximada</li>
                  <li>Información de uso y actividad en la plataforma</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Cómo Utilizamos su Información</h2>
                <p className="text-neutral-600 mb-6">
                  Utilizamos la información recopilada para:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Conectar transportistas con clientes</li>
                  <li>Procesar pagos y transacciones</li>
                  <li>Comunicarnos con usted sobre servicios y actualizaciones</li>
                  <li>Garantizar la seguridad y prevenir fraudes</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Compartir Información</h2>
                <p className="text-neutral-600 mb-6">
                  No vendemos, alquilamos ni compartimos su información personal con terceros, excepto:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Con su consentimiento explícito</li>
                  <li>Para facilitar transacciones entre usuarios</li>
                  <li>Con proveedores de servicios que nos ayudan a operar</li>
                  <li>Cuando es requerido por ley o para proteger derechos</li>
                </ul>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">5. Seguridad de Datos</h2>
                <p className="text-neutral-600 mb-6">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Encriptación de datos en tránsito y en reposo</li>
                  <li>Acceso restringido a información personal</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Actualizaciones regulares de seguridad</li>
                </ul>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">6. Sus Derechos</h2>
                <p className="text-neutral-600 mb-6">
                  Usted tiene los siguientes derechos respecto a su información personal:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Acceder a la información que tenemos sobre usted</li>
                  <li>Corregir información inexacta o incompleta</li>
                  <li>Solicitar la eliminación de su información</li>
                  <li>Oponerse al procesamiento de su información</li>
                  <li>Retirar su consentimiento en cualquier momento</li>
                </ul>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">7. Retención de Datos</h2>
                <p className="text-neutral-600 mb-6">
                  Conservamos su información personal solo durante el tiempo necesario para los fines descritos 
                  en esta política o según lo requiera la ley. Cuando ya no necesitemos su información, 
                  la eliminaremos de forma segura.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">8. Transferencias Internacionales</h2>
                <p className="text-neutral-600 mb-6">
                  Su información puede ser transferida y procesada en países distintos a Guatemala. 
                  Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos aplicables 
                  y mantengan el mismo nivel de protección.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">9. Cookies y Tecnologías Similares</h2>
                <p className="text-neutral-600 mb-6">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso 
                  de nuestra plataforma y personalizar contenido. Puede controlar el uso de cookies 
                  a través de la configuración de su navegador.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">10. Menores de Edad</h2>
                <p className="text-neutral-600 mb-6">
                  Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente 
                  información personal de menores de edad. Si cree que hemos recopilado información de un menor, 
                  contáctenos inmediatamente.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">11. Cambios a esta Política</h2>
                <p className="text-neutral-600 mb-6">
                  Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre 
                  cambios significativos a través de la plataforma o por correo electrónico. 
                  Le recomendamos revisar esta política periódicamente.
                </p>

                <h2 className="text-xl font-bold text-neutral-900 mb-4">12. Contacto</h2>
                <p className="text-neutral-600 mb-6">
                  Si tiene preguntas sobre esta política de privacidad o sobre cómo manejamos su información, 
                  puede contactarnos:
                </p>
                <ul className="text-neutral-600 mb-6 list-disc pl-6">
                  <li>Email: privacidad@vaivengt.com</li>
                  <li>Teléfono: +502 XXXX-XXXX</li>
                  <li>Dirección: Av. Reforma 123, Ciudad de Guatemala, Guatemala</li>
                </ul>

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

export default PrivacyPolicy;
