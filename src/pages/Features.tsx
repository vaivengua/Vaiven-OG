import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Shield, Clock, Users, BarChart3, MessageSquare, CreditCard, Zap, Globe, Award, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Features: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    navigate('/login');
  };

  const mainFeatures = [
    {
      icon: <Truck className="h-12 w-12 text-white" />,
      title: "Conexión Inteligente",
      description: "Algoritmo avanzado con IA que conecta transportistas con cargas compatibles en tiempo real, optimizando rutas y reduciendo costos.",
      gradient: "from-primary to-secondary",
      badge: "IA Avanzada"
    },
    {
      icon: <MapPin className="h-12 w-12 text-white" />,
      title: "Seguimiento GPS en Vivo",
      description: "Monitorea tu carga desde la recogida hasta la entrega con actualizaciones en tiempo real y notificaciones automáticas.",
      gradient: "from-accent to-green-600",
      badge: "Tiempo Real"
    },
    {
      icon: <Shield className="h-12 w-12 text-white" />,
      title: "Seguridad Total",
      description: "Sistema de pagos protegido con garantía de satisfacción, seguros incluidos y verificación completa de transportistas.",
      gradient: "from-secondary to-blue-600",
      badge: "Garantizado"
    }
  ];

  const additionalFeatures = [
    { icon: <Clock className="h-8 w-8 text-white" />, title: "Disponibilidad 24/7", description: "Plataforma disponible las 24 horas" },
    { icon: <Users className="h-8 w-8 text-white" />, title: "Red Verificada", description: "Transportistas certificados y verificados" },
    { icon: <BarChart3 className="h-8 w-8 text-white" />, title: "Análisis Avanzado", description: "Reportes detallados y métricas" },
    { icon: <MessageSquare className="h-8 w-8 text-white" />, title: "Chat Integrado", description: "Comunicación directa en plataforma" },
    { icon: <CreditCard className="h-8 w-8 text-white" />, title: "Facturación Auto", description: "Genera facturas automáticamente" },
    { icon: <Zap className="h-8 w-8 text-white" />, title: "Respuesta Rápida", description: "Conexiones instantáneas" },
    { icon: <Globe className="h-8 w-8 text-white" />, title: "Cobertura Total", description: "15+ países en América Latina" },
    { icon: <Award className="h-8 w-8 text-white" />, title: "Calidad Premium", description: "Servicio certificado ISO 9001" },
    { icon: <Smartphone className="h-8 w-8 text-white" />, title: "App Móvil", description: "Acceso desde cualquier dispositivo" }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            Características de VAIVEN
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            🚀 Características Poderosas
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 md:mb-8">
            Descubre todas las herramientas avanzadas que hacen de VAIVEN la plataforma líder en logística y transporte.
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

      {/* KPI Cards Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                icon: <Truck className="h-6 w-6 md:h-7 md:w-7 text-primary" />, 
                label: 'Envíos Completados', 
                value: '50,000+', 
                color: 'bg-primary/10 text-primary'
              },
              {
                icon: <Users className="h-6 w-6 md:h-7 md:w-7 text-accent" />, 
                label: 'Transportistas Activos', 
                value: '10,000+', 
                color: 'bg-accent/10 text-accent'
              },
              {
                icon: <Globe className="h-6 w-6 md:h-7 md:w-7 text-secondary" />, 
                label: 'Cobertura', 
                value: '500+ ciudades', 
                color: 'bg-secondary/10 text-secondary'
              },
              {
                icon: <Award className="h-6 w-6 md:h-7 md:w-7 text-yellow-600" />, 
                label: 'Satisfacción', 
                value: '99%', 
                color: 'bg-yellow-500/10 text-yellow-600'
              }
            ].map((kpi, idx) => (
              <Card key={idx} className="flex flex-col items-center text-center bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`mb-3 ${kpi.color} w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full`}>{kpi.icon}</div>
                <div className="text-lg md:text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</div>
                <div className="text-neutral-500 font-medium text-xs md:text-sm">{kpi.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparativa
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">¿Por qué elegir VAIVEN?</h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">Compara las ventajas de nuestra plataforma frente a la logística tradicional y otros competidores.</p>
          </div>
          <Card className="overflow-x-auto p-0 md:p-6 bg-white shadow-lg border-0 max-w-5xl mx-auto">
            <table className="min-w-full text-center border-separate border-spacing-y-2">
              <thead>
                <tr className="text-primary text-base">
                  <th className="py-3 px-2"></th>
                  <th className="py-3 px-2 font-bold">VAIVEN</th>
                  <th className="py-3 px-2">Logística Tradicional</th>
                  <th className="py-3 px-2">Competidor X</th>
                </tr>
              </thead>
              <tbody className="text-neutral-600">
                {[
                  { label: 'Conexión Inteligente', cc: true, trad: false, comp: false },
                  { label: 'Seguimiento en Tiempo Real', cc: true, trad: false, comp: true },
                  { label: 'Red de Transportistas Verificada', cc: true, trad: false, comp: true },
                  { label: 'Cobertura Nacional', cc: true, trad: true, comp: false },
                  { label: 'Soporte 24/7', cc: true, trad: false, comp: false },
                  { label: 'Facturación Automática', cc: true, trad: false, comp: true },
                  { label: 'Optimización de Rutas con IA', cc: true, trad: false, comp: false },
                  { label: 'App Móvil', cc: true, trad: false, comp: true },
                ].map((row, idx) => (
                  <tr key={idx} className="bg-white hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-2 font-semibold text-neutral-800 text-left">{row.label}</td>
                    <td className="py-3 px-2">
                      {row.cc ? <span className="inline-block text-green-600 font-bold text-xl">✔</span> : <span className="inline-block text-red-400 font-bold text-xl">✘</span>}
                    </td>
                    <td className="py-3 px-2">
                      {row.trad ? <span className="inline-block text-green-600 font-bold text-xl">✔</span> : <span className="inline-block text-red-400 font-bold text-xl">✘</span>}
                    </td>
                    <td className="py-3 px-2">
                      {row.comp ? <span className="inline-block text-green-600 font-bold text-xl">✔</span> : <span className="inline-block text-red-400 font-bold text-xl">✘</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* Feature Timeline/Process Flow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              ¿Cómo funciona?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Tu logística en 5 pasos</h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">Descubre lo fácil que es usar VAIVEN para optimizar tus envíos.</p>
          </div>
          <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-0">
            {/* Timeline line - now behind icons at the top */}
            <div className="hidden md:block absolute left-0 right-0" style={{top: '44px', height: '4px'}}>
              <div className="w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-secondary/30 rounded-full z-0"></div>
            </div>
            {/* Timeline steps */}
            {[
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: 'Registro',
                desc: 'Crea tu cuenta gratis en minutos.'
              },
              {
                icon: <Truck className="h-8 w-8 text-white" />,
                title: 'Publica tu carga',
                desc: 'Describe tu envío y publica los detalles.'
              },
              {
                icon: <MapPin className="h-8 w-8 text-white" />,
                title: 'Conexión con transportistas',
                desc: 'Recibe ofertas de transportistas verificados.'
              },
              {
                icon: <Globe className="h-8 w-8 text-white" />,
                title: 'Seguimiento en tiempo real',
                desc: 'Monitorea tu carga desde cualquier dispositivo.'
              },
              {
                icon: <CreditCard className="h-8 w-8 text-white" />,
                title: 'Entrega y pago seguro',
                desc: 'Recibe confirmación y paga de forma protegida.'
              }
            ].map((step, idx, arr) => (
              <div key={step.title} className="relative z-10 flex flex-col items-center md:w-1/5 w-full mb-12 md:mb-0">
                {/* Icon with connector dot */}
                <div className="relative z-20 mb-3">
                  <div className="mb-0 bg-gradient-to-r from-primary to-secondary w-14 h-14 flex items-center justify-center rounded-full shadow-lg">{step.icon}</div>
                  {/* Connector dot */}
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
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Características Principales
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              ✨ Características Principales
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Tecnología de vanguardia para optimizar tu logística
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="group text-center hover:shadow-xl transition-shadow border-0 shadow-lg bg-white overflow-hidden">
                <div className={`bg-gradient-to-r ${feature.gradient} p-8 relative`}>
                  <Badge className="absolute top-4 right-4 bg-white/20 text-white border-0">
                    {feature.badge}
                  </Badge>
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-white text-2xl font-bold mb-2">{feature.title}</CardTitle>
                </div>
                <CardContent className="p-6">
                  <CardDescription className="text-neutral-500 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <BarChart3 className="h-4 w-4 mr-2" />
              Más Características
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              🛠️ Más Características
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Herramientas adicionales para maximizar tu eficiencia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-shadow duration-200 bg-white border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2 text-lg group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-neutral-500 text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;