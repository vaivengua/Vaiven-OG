import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  const handleAccessClick = () => {
    navigate('/login');
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-white" />,
      title: "Email",
      details: ["info@vaivengt.com", "soporte@vaivengt.com"],
      gradient: "from-primary to-secondary"
    },
    {
      icon: <Phone className="h-6 w-6 text-white" />,
      title: "Teléfono",
      details: ["+502 50004030"],
      gradient: "from-accent to-green-600"
    },
    {
      icon: <MapPin className="h-6 w-6 text-white" />,
      title: "Oficina Principal",
      details: ["Av. Reforma 123, Piso 15", "Ciudad de Guatemala, Guatemala"],
      gradient: "from-secondary to-blue-600"
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      title: "Horarios",
      details: ["Lunes - Viernes: 9:00 - 18:00", "Sábados: 9:00 - 14:00"],
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            Contáctanos
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            Contáctanos
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 md:mb-8">
            Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo de expertos.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: <Clock className="h-6 w-6 md:h-7 md:w-7 text-primary" />, 
                label: 'Tiempo de Respuesta', 
                value: '24h', 
                color: 'bg-primary/10 text-primary'
              },
              {
                icon: <Phone className="h-6 w-6 md:h-7 md:w-7 text-accent" />, 
                label: 'Soporte', 
                value: 'Lun-Sab', 
                color: 'bg-accent/10 text-accent'
              },
              {
                icon: <MapPin className="h-6 w-6 md:h-7 md:w-7 text-yellow-600" />, 
                label: 'Cobertura', 
                value: 'Nacional', 
                color: 'bg-yellow-500/10 text-yellow-600'
              }
            ].map((kpi, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow border-0 shadow-lg">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 ${kpi.color}`}>
                    {kpi.icon}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">{kpi.value}</div>
                  <div className="text-neutral-500 font-medium text-sm md:text-base">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-primary text-white rounded-t-xl">
                <CardTitle className="text-2xl font-bold mb-2 text-white">📧 Envíanos un Mensaje</CardTitle>
                <CardDescription className="text-blue-100">
                  Completa el formulario y nos pondremos en contacto contigo pronto.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" placeholder="Tu nombre" className="border border-neutral-200 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" placeholder="Tu apellido" className="border border-neutral-200 focus:border-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" className="border border-neutral-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+502 1234-5678" className="border border-neutral-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input id="subject" placeholder="¿En qué podemos ayudarte?" className="border border-neutral-200 focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                      rows={5}
                      className="border border-neutral-200 focus:border-primary"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-colors py-4 text-lg">
                    ✨ Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
                  <Mail className="h-4 w-4 mr-2" />
                  Información de Contacto
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                  📞 Información de Contacto
                </h2>
                <p className="text-xl text-neutral-500 mb-8">
                  Múltiples formas de ponerte en contacto con nosotros. Elige la que más te convenga.
                </p>
              </div>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-start">
                        <div className={`bg-gradient-to-r ${info.gradient} p-4 flex items-center justify-center rounded-l-xl h-full`}>
                          {info.icon}
                        </div>
                        <div className="p-6 flex-1">
                          <h3 className="font-semibold text-white mb-2 text-lg">
                            {info.title}
                          </h3>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-neutral-500 text-base mb-1">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {/*<section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              Encuéntranos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Nuestra Ubicación</h2>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto">Visítanos en nuestra oficina principal en Ciudad de Guatemala.</p>
          </div>
          <Card className="overflow-hidden shadow-lg border-0 max-w-4xl mx-auto">
            <div className="w-full h-96">
              <iframe
                title="Ubicación VAIVEN"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.857234567890!2d-90.5132736846771!3d14.634915789776073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a1e7b1e7b1e7%3A0x1234567890abcdef!2sAv.%20Reforma%20123%2C%20Ciudad%20de%20Guatemala!5e0!3m2!1ses-419!2sgt!4v1680000000000!5m2!1ses-419!2sgt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Card>
        </div>
      </section>*/}

      <Footer />
    </div>
  );
};

export default Contact;