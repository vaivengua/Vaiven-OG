import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const { loginAsClient, loginAsTransporter } = useAuth();
  const navigate = useNavigate();

  const handleClientClick = () => {
    loginAsClient();
    navigate('/client-dashboard');
  };

  const handleTransporterClick = () => {
    loginAsTransporter();
    navigate('/transporter-dashboard');
  };

  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      description: "Perfecto para comenzar",
      features: [
        "Hasta 5 envíos por mes",
        "Seguimiento básico",
        "Soporte por email",
        "Comisión del 8%"
      ],
      popular: false,
      icon: <Star className="h-8 w-8 text-white" />,
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      name: "Profesional",
      price: "$29",
      period: "/mes",
      description: "Para empresas en crecimiento",
      features: [
        "Envíos ilimitados",
        "Seguimiento avanzado",
        "Soporte prioritario",
        "Comisión del 5%",
        "Análisis y reportes",
        "API integración"
      ],
      popular: true,
      icon: <Zap className="h-8 w-8 text-white" />,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      name: "Empresarial",
      price: "$99",
      period: "/mes",
      description: "Para grandes operaciones",
      features: [
        "Todo lo del plan Profesional",
        "Comisión del 3%",
        "Gestor de cuenta dedicado",
        "SLA garantizado",
        "Integración personalizada",
        "Soporte 24/7"
      ],
      popular: false,
      icon: <Crown className="h-8 w-8 text-white" />,
      gradient: "from-indigo-600 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg border border-blue-200">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Precios de VAIVEN
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-800">
            Precios Transparentes
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Elige el plan que mejor se adapte a tus necesidades. Sin costos ocultos, sin sorpresas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl font-semibold"
              onClick={handleClientClick}
            >
              🚀 Acceder como Cliente
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-xl font-semibold"
              onClick={handleTransporterClick}
            >
              🚛 Acceder como Transportista
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${plan.popular ? 'scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    ⭐ Más Popular
                  </Badge>
                )}
                <div className={`bg-gradient-to-r ${plan.gradient} p-8 text-center`}>
                  <div className="mx-auto mb-4">{plan.icon}</div>
                  <CardTitle className="text-2xl text-white font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-white/80">{plan.period}</span>}
                  </div>
                  <CardDescription className="text-white/90 mt-2 mb-2">{plan.description}</CardDescription>
                </div>
                <CardContent className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-base text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg font-semibold py-4 text-lg rounded-xl`}
                    onClick={handleClientClick}
                  >
                    {plan.price === 'Gratis' ? '🚀 Comenzar Gratis' : '✨ Elegir Plan'}
                  </Button>
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

export default Pricing;