import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Users, Award, TrendingUp, Truck, Globe, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    navigate('/login');
  };

  const stats = [
    { number: "10,000+", label: "Transportistas Activos", color: "from-primary to-secondary" },
    { number: "50,000+", label: "Envíos Completados", color: "from-accent to-green-600" },
    { number: "500+", label: "Ciudades Conectadas", color: "from-secondary to-blue-600" },
    { number: "99%", label: "Satisfacción del Cliente", color: "from-blue-500 to-cyan-500" }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-white" />,
      title: "Misión",
      description: "Revolucionar el transporte de carga conectando eficientemente transportistas con clientes, reduciendo costos y optimizando rutas.",
      gradient: "from-primary to-secondary"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Visión",
      description: "Ser la plataforma líder en logística colaborativa, creando un ecosistema sostenible para el transporte de mercancías.",
      gradient: "from-accent to-green-600"
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: "Valores",
      description: "Transparencia, confiabilidad, innovación y compromiso con la excelencia en cada transacción.",
      gradient: "from-secondary to-blue-600"
    }
  ];

  const features = [
    {
      icon: <Globe className="h-6 w-6 text-white" />,
      title: "Cobertura Nacional",
      description: "Conectamos todo el territorio con nuestra red de transportistas"
    },
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Seguridad Garantizada",
      description: "Protección total para tus envíos con seguros incluidos"
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Tecnología Avanzada",
      description: "Plataforma inteligente que optimiza rutas automáticamente"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Crecimiento Sostenible",
      description: "Reducimos la huella de carbono optimizando cada viaje"
    },
    {
      icon: <Truck className="h-6 w-6 text-white" />,
      title: "Seguimiento en Tiempo Real",
      description: "Monitorea tus envíos minuto a minuto desde cualquier dispositivo."
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Soporte 24/7",
      description: "Nuestro equipo está disponible para ayudarte en todo momento."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section aria-label="Hero - Sobre VAIVEN" className="py-12 md:py-20 bg-gradient-to-br from-primary to-secondary text-white" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            Sobre VAIVEN
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            Sobre VAIVEN
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 md:mb-8">
            Transformamos la industria del transporte conectando transportistas con cargas de manera inteligente y eficiente.
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

      {/* Stats Section */}
      <section aria-label="Estadísticas de VAIVEN" className="py-12 md:py-20 bg-white" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-neutral-500 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline/History Section */}
      <section aria-label="Historia de VAIVEN" className="py-12 md:py-20 bg-neutral-50" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Nuestra Historia
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 md:mb-6 leading-tight">
              Evolución de VAIVEN
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 max-w-3xl mx-auto">
              Un recorrido por los hitos que han marcado nuestro crecimiento y liderazgo en logística colaborativa.
            </p>
          </div>
          {/* Timeline */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-primary/30 via-primary to-secondary/30 rounded-full z-0" style={{transform: 'translateX(-50%)'}} aria-hidden="true"></div>
            {/* Timeline items */}
            {[
              {
                year: '2019',
                title: 'Fundación',
                desc: 'VAIVEN nace con la visión de digitalizar el transporte de carga en LATAM.',
                icon: <Sparkles className="h-6 w-6 text-primary" />,
              },
              {
                year: '2020',
                title: 'Primeros 1,000 envíos',
                desc: 'Alcanzamos nuestro primer gran hito de envíos exitosos en la plataforma.',
                icon: <Truck className="h-6 w-6 text-primary" />,
              },
              {
                year: '2021',
                title: 'Expansión Nacional',
                desc: 'Conectamos más de 300 ciudades y ampliamos nuestra red de transportistas.',
                icon: <Globe className="h-6 w-6 text-primary" />,
              },
              {
                year: '2022',
                title: 'Innovación Tecnológica',
                desc: 'Lanzamos nuestra app móvil y optimización inteligente de rutas.',
                icon: <Zap className="h-6 w-6 text-primary" />,
              },
              {
                year: '2023',
                title: 'Liderazgo en Logística',
                desc: 'Nos consolidamos como la plataforma líder en logística colaborativa.',
                icon: <Award className="h-6 w-6 text-primary" />,
              },
            ].map((milestone, idx, arr) => (
              <div key={milestone.year} className="relative z-10 flex flex-col items-center md:w-1/5 w-full mb-12 md:mb-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-transform duration-200 ease-in-out transform hover:scale-105 focus:scale-105" tabIndex={0} role="listitem">
                <Card className="w-full bg-white shadow-lg border-0 p-6 flex flex-col items-center text-center transition-shadow duration-200 ease-in-out hover:shadow-xl">
                  <Badge className="mb-2 bg-primary text-white px-4 py-1 text-base font-semibold rounded-full">
                    {milestone.year}
                  </Badge>
                  <div className="mb-3">{milestone.icon}</div>
                  <CardTitle className="text-lg font-bold text-neutral-900 mb-2 min-h-[32px] flex items-center justify-center">{milestone.title}</CardTitle>
                  <CardContent className="p-0">
                    <CardDescription className="text-neutral-500 text-base min-h-[56px] flex items-center justify-center leading-normal">{milestone.desc}</CardDescription>
                  </CardContent>
                </Card>
                {/* Timeline connector dots */}
                {idx < arr.length - 1 && (
                  <div className="hidden md:block absolute right-0 left-0 mx-auto top-full w-3 h-3 bg-primary rounded-full border-4 border-white z-20" style={{marginTop: '-0.75rem'}} aria-hidden="true"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Leadership Section */}
      <section aria-label="Equipo de VAIVEN" className="py-20 bg-white" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Users className="h-4 w-4 mr-2" />
              Nuestro Equipo
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Conoce al equipo detrás de VAIVEN
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Profesionales apasionados por la logística, la tecnología y la excelencia en el servicio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                name: 'María González',
                role: 'CEO & Fundadora',
                img: 'https://randomuser.me/api/portraits/women/44.jpg',
                desc: 'Líder visionaria con más de 15 años en logística y transformación digital.'
              },
              {
                name: 'Carlos Ramírez',
                role: 'CTO',
                img: 'https://randomuser.me/api/portraits/men/32.jpg',
                desc: 'Apasionado por la tecnología, experto en plataformas escalables y optimización de rutas.'
              },
              {
                name: 'Lucía Torres',
                role: 'COO',
                img: 'https://randomuser.me/api/portraits/women/65.jpg',
                desc: 'Especialista en operaciones y logística colaborativa, enfocada en la excelencia.'
              },
              {
                name: 'Javier López',
                role: 'Director Comercial',
                img: 'https://randomuser.me/api/portraits/men/41.jpg',
                desc: 'Estratega comercial con amplia experiencia en el sector transporte y alianzas.'
              }
            ].map((member, idx) => (
              <Card key={idx} className="group flex flex-col items-center text-center p-8 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" tabIndex={0} role="listitem">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 mb-4 shadow-lg">
                  <img src={member.img} alt={`Foto de ${member.name}, ${member.role}`} className="w-full h-full object-cover" />
                </div>
                <Badge className="mb-2 bg-primary text-white px-4 py-1 text-base font-semibold rounded-full">
                  {member.role}
                </Badge>
                <CardTitle className="text-lg font-bold text-neutral-900 mb-1">{member.name}</CardTitle>
                <CardContent className="p-0">
                  <CardDescription className="text-neutral-500 text-base">{member.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Award className="h-4 w-4 mr-2" />
              Nuestros Principios
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Nuestros Principios
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Los valores que nos guían en cada decisión y nos impulsan hacia la excelencia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group text-center hover:shadow-xl transition-shadow border-0 shadow-lg bg-white overflow-hidden">
                <div className={`bg-gradient-to-r ${value.gradient} p-8`}>
                  <div className="mx-auto mb-4">{value.icon}</div>
                  <CardTitle className="text-white text-xl font-bold mb-2">{value.title}</CardTitle>
                </div>
                <CardContent className="p-8">
                  <CardDescription className="text-neutral-500 leading-relaxed text-base mb-4">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Shield className="h-4 w-4 mr-2" />
              ¿Por qué elegirnos?
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              ¿Por qué elegirnos?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" tabIndex={0} role="listitem">
                <div className="bg-primary w-14 h-14 rounded-lg flex items-center justify-center text-white mb-6 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors duration-300 text-lg">{feature.title}</h3>
                <p className="text-neutral-500 text-base mb-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials & Partners Section */}
      <section aria-label="Testimonios y Socios de VAIVEN" className="py-20 bg-white" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Award className="h-4 w-4 mr-2" />
              Testimonios y Socios
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Lo que dicen nuestros clientes y aliados
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              La confianza y satisfacción de nuestros usuarios y socios es nuestro mayor logro.
            </p>
          </div>
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {[
              {
                name: 'Ana Martínez',
                company: 'Logística Express',
                img: 'https://randomuser.me/api/portraits/women/68.jpg',
                quote: 'VAIVEN ha transformado la forma en que gestionamos nuestros envíos. ¡Eficiencia y confianza total!'
              },
              {
                name: 'Pedro Gómez',
                company: 'Transporte Gómez',
                img: 'https://randomuser.me/api/portraits/men/53.jpg',
                quote: 'Gracias a la plataforma, hemos optimizado rutas y reducido costos. El soporte es excelente.'
              },
              {
                name: 'Laura Ruiz',
                company: 'EcoCargo',
                img: 'https://randomuser.me/api/portraits/women/22.jpg',
                quote: 'La tecnología de VAIVEN nos permite ofrecer un mejor servicio a nuestros clientes.'
              },
              {
                name: 'Miguel Torres',
                company: 'Torres y Asociados',
                img: 'https://randomuser.me/api/portraits/men/24.jpg',
                quote: 'La red de transportistas y la seguridad de la plataforma son incomparables.'
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="flex flex-col items-center text-center p-8 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" tabIndex={0} role="listitem">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 mb-4 shadow-lg">
                  <img src={testimonial.img} alt={`Foto de ${testimonial.name}, ${testimonial.company}`} className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-lg font-bold text-neutral-900 mb-1">{testimonial.name}</CardTitle>
                <Badge className="mb-2 bg-primary text-white px-4 py-1 text-base font-semibold rounded-full">
                  {testimonial.company}
                </Badge>
                <CardContent className="p-0">
                  <CardDescription className="text-neutral-500 text-base italic">"{testimonial.quote}"</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Partner Logos */}
          <div className="flex flex-wrap justify-center items-center gap-8" role="list">
            {[
              'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
              'https://upload.wikimedia.org/wikipedia/commons/4/4e/DHL_Logo.svg',
              'https://upload.wikimedia.org/wikipedia/commons/5/5e/FedEx_Express.svg',
              'https://upload.wikimedia.org/wikipedia/commons/6/6b/UPS_Logo_Shield_2017.svg',
              'https://upload.wikimedia.org/wikipedia/commons/2/2d/Coca_Cola_logo.svg',
            ].map((logo, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-4 flex items-center justify-center h-20 w-36 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105" tabIndex={0} role="listitem">
                <img src={logo} alt="Logo de socio de VAIVEN" className="max-h-12 max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section aria-label="Llamado a la acción - Únete a VAIVEN" className="py-16 px-4 bg-gradient-to-r from-primary to-secondary" tabIndex={-1}>
        <div className="max-w-7xl mx-auto flex justify-center">
          <Card className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between p-10 bg-white/95 shadow-xl border-0 text-center md:text-left">
            <div className="flex-1 mb-6 md:mb-0">
              <h3 className="text-3xl font-bold text-primary mb-2">¿Listo para transformar tu logística?</h3>
              <p className="text-lg text-neutral-600">Únete a la red líder en transporte colaborativo y lleva tu negocio al siguiente nivel.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:ml-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors">
                Regístrate Gratis
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                Solicita una Demo
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;