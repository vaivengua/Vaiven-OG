import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, Truck, MapPin, Globe, CreditCard, Sparkles, ArrowRight, Shield, Zap, Award, ClipboardList, CheckCircle, MessageSquare, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const clientSteps = [
  {
    icon: <Users className="h-8 w-8 text-white" />,
    title: 'Regístrate',
    desc: 'Crea tu cuenta gratis y accede a la plataforma.'
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-white" />,
    title: 'Publica tu carga',
    desc: 'Describe tu envío, origen, destino y requisitos.'
  },
  {
    icon: <Truck className="h-8 w-8 text-white" />,
    title: 'Recibe ofertas',
    desc: 'Transportistas verificados te envían cotizaciones.'
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    title: 'Elige y coordina',
    desc: 'Selecciona la mejor opción y coordina detalles.'
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-white" />,
    title: 'Seguimiento y pago',
    desc: 'Monitorea el envío y paga de forma segura al finalizar.'
  }
];

const transporterSteps = [
  {
    icon: <Truck className="h-8 w-8 text-white" />,
    title: 'Regístrate',
    desc: 'Crea tu cuenta y completa tu perfil de transportista.'
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-white" />,
    title: 'Busca cargas',
    desc: 'Explora cargas publicadas compatibles con tu ruta.'
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    title: 'Envía ofertas',
    desc: 'Cotiza y ofrece tu servicio a los clientes.'
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-white" />,
    title: 'Confirma y transporta',
    desc: 'Coordina detalles, recoge la carga y realiza el envío.'
  },
  {
    icon: <Star className="h-8 w-8 text-white" />,
    title: 'Califica y cobra',
    desc: 'Recibe tu pago seguro y califica la experiencia.'
  }
];

const benefits = [
  {
    icon: <Shield className="h-7 w-7 text-white" />,
    title: 'Seguridad Garantizada',
    desc: 'Tus datos y envíos están protegidos en todo momento.'
  },
  {
    icon: <Zap className="h-7 w-7 text-white" />,
    title: 'Tecnología Avanzada',
    desc: 'Optimizamos rutas y procesos con IA y automatización.'
  },
  {
    icon: <Award className="h-7 w-7 text-white" />,
    title: 'Calidad Certificada',
    desc: 'Servicio avalado por miles de clientes satisfechos.'
  }
];

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            Cómo Funciona
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            ¿Cómo funciona VAIVEN?
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 md:mb-8">
            Descubre el proceso sencillo y seguro para conectar cargas con transportistas en minutos.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 transition-colors w-full sm:w-auto"
              onClick={handleAccessClick}
            >
              🚀 Acceder a VAIVEN
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs for Cliente/Transportista */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="cliente" className="w-full">
            <TabsList className="flex justify-center mb-8 md:mb-12 bg-white rounded-xl shadow-lg p-1 md:p-2 gap-2 md:gap-4">
              <TabsTrigger value="cliente" className="text-sm md:text-lg font-semibold">Para Clientes</TabsTrigger>
              <TabsTrigger value="transportista" className="text-sm md:text-lg font-semibold">Para Transportistas</TabsTrigger>
            </TabsList>
            <TabsContent value="cliente">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">¿Cómo funciona para Clientes?</h2>
                <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto mb-6 md:mb-8">Publica tu carga, recibe ofertas y gestiona tus envíos de forma segura y eficiente.</p>
              </div>
              <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-0">
                <div className="hidden md:block absolute left-0 right-0" style={{top: '44px', height: '4px'}}>
                  <div className="w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-secondary/30 rounded-full z-0"></div>
                </div>
                {clientSteps.map((step, idx, arr) => (
                  <div key={step.title} className="relative z-10 flex flex-col items-center md:w-1/5 w-full mb-12 md:mb-0">
                    <div className="relative z-20 mb-3">
                      <div className="mb-0 bg-gradient-to-r from-primary to-secondary w-14 h-14 flex items-center justify-center rounded-full shadow-lg">{step.icon}</div>
                      {idx < arr.length - 1 && (
                        <div className="hidden md:block absolute right-[-50%] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-4 border-white z-30" style={{left: '100%'}}></div>
                      )}
                    </div>
                    <Card className="w-full bg-white shadow-lg border-0 p-6 flex flex-col items-center text-center mt-0 hover:shadow-xl transition-shadow">
                      <CardTitle className="text-lg font-bold text-neutral-900 mb-2 min-h-[32px] flex items-center justify-center">{step.title}</CardTitle>
                      <CardContent className="p-0">
                        <CardDescription className="text-neutral-500 text-base min-h-[56px] flex items-center justify-center leading-normal">{step.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="transportista">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">¿Cómo funciona para Transportistas?</h2>
                <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto mb-6 md:mb-8">Encuentra cargas, cotiza y gestiona tus servicios de transporte de manera eficiente y segura.</p>
              </div>
              <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-0">
                <div className="hidden md:block absolute left-0 right-0" style={{top: '44px', height: '4px'}}>
                  <div className="w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-secondary/30 rounded-full z-0"></div>
                </div>
                {transporterSteps.map((step, idx, arr) => (
                  <div key={step.title} className="relative z-10 flex flex-col items-center md:w-1/5 w-full mb-12 md:mb-0">
                    <div className="relative z-20 mb-3">
                      <div className="mb-0 bg-gradient-to-r from-primary to-secondary w-14 h-14 flex items-center justify-center rounded-full shadow-lg">{step.icon}</div>
                      {idx < arr.length - 1 && (
                        <div className="hidden md:block absolute right-[-50%] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-4 border-white z-30" style={{left: '100%'}}></div>
                      )}
                    </div>
                    <Card className="w-full bg-white shadow-lg border-0 p-6 flex flex-col items-center text-center mt-0 hover:shadow-xl transition-shadow">
                      <CardTitle className="text-lg font-bold text-neutral-900 mb-2 min-h-[32px] flex items-center justify-center">{step.title}</CardTitle>
                      <CardContent className="p-0">
                        <CardDescription className="text-neutral-500 text-base min-h-[56px] flex items-center justify-center leading-normal">{step.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
              <Shield className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Beneficios
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">¿Por qué elegir VAIVEN?</h2>
            <p className="text-base md:text-lg text-neutral-500 max-w-2xl mx-auto">Ventajas exclusivas para clientes y transportistas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="flex flex-col items-center text-center bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow border-0">
                <div className="mb-3 bg-gradient-to-r from-primary to-secondary w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg">{benefit.icon}</div>
                <CardTitle className="text-base md:text-lg font-bold text-neutral-900 mb-2">{benefit.title}</CardTitle>
                <CardContent className="p-0">
                  <CardDescription className="text-neutral-500 text-sm md:text-base flex items-center justify-center leading-normal">{benefit.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Card className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 md:p-10 bg-white/95 shadow-xl border-0 text-center md:text-left">
            <div className="flex-1 mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">¿Listo para transformar tu logística?</h3>
              <p className="text-base md:text-lg text-neutral-600">Únete a la red líder en transporte colaborativo y lleva tu negocio al siguiente nivel.</p>
            </div>
            <div className="flex justify-center md:ml-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transition-colors w-full sm:w-auto"
                onClick={handleAccessClick}
              >
                Regístrate Gratis
              </Button>
            </div>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks; 