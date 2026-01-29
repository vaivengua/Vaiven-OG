import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

interface PricingSectionProps {
  onClientClick: () => void;
  onTransporterClick: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onClientClick, onTransporterClick }) => {
  const plans = [
    {
      name: "Cliente Básico",
      price: "Gratis",
      description: "Perfecto para empezar",
      features: [
        "Hasta 5 envíos por mes",
        "Seguimiento básico",
        "Soporte por email",
        "Cotizaciones automáticas"
      ],
      buttonText: "Comenzar Gratis",
      popular: false,
      action: onClientClick
    },
    {
      name: "Transportista Pro",
      price: "$29",
      period: "/mes",
      description: "Para transportistas profesionales",
      features: [
        "Rutas ilimitadas",
        "Seguimiento GPS avanzado",
        "Soporte prioritario 24/7",
        "Dashboard analítico",
        "Gestión de flotas",
        "Reportes detallados"
      ],
      buttonText: "Comenzar Prueba",
      popular: true,
      action: onTransporterClick
    },
    {
      name: "Empresa",
      price: "$99",
      period: "/mes",
      description: "Para grandes volúmenes",
      features: [
        "Envíos ilimitados",
        "API personalizada",
        "Gerente de cuenta dedicado",
        "Integración ERP",
        "Reportes personalizados",
        "SLA garantizado"
      ],
      buttonText: "Contactar Ventas",
      popular: false,
      action: onClientClick
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Planes y Precios</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border-0 shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                  onClick={plan.action}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;