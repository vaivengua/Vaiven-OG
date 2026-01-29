import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Truck, MapPin } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      number: "500K+",
      label: "Envíos Completados",
      description: "Entregas exitosas en toda América Latina"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      number: "10K+",
      label: "Clientes Activos",
      description: "Empresas que confían en nosotros"
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      number: "2K+",
      label: "Transportistas",
      description: "Red de transportistas verificados"
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-600" />,
      number: "15+",
      label: "Países",
      description: "Cobertura en América Latina"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Números que Hablan por Sí Solos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestra plataforma conecta miles de empresas con transportistas confiables
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">{stat.label}</h4>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;