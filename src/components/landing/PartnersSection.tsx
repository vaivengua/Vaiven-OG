import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Award, Shield, Star } from 'lucide-react';

const PartnersSection: React.FC = () => {
  const partners = [
    { name: "LogiCorp", logo: "🏢", category: "Logística" },
    { name: "TransMax", logo: "🚛", category: "Transporte" },
    { name: "CargoPlus", logo: "📦", category: "Distribución" },
    { name: "FleetPro", logo: "🚚", category: "Gestión" },
    { name: "ShipFast", logo: "⚡", category: "Express" },
    { name: "GlobalMove", logo: "🌎", category: "Internacional" }
  ];

  const certifications = [
    { icon: <Award className="h-6 w-6 text-yellow-600" />, name: "ISO 9001" },
    { icon: <Shield className="h-6 w-6 text-green-600" />, name: "Seguridad" },
    { icon: <Star className="h-6 w-6 text-blue-600" />, name: "Calidad" },
    { icon: <Building2 className="h-6 w-6 text-purple-600" />, name: "Certificado" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Socios de Confianza
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trabajamos con las mejores empresas de transporte y logística
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {partners.map((partner, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{partner.logo}</div>
                <h4 className="font-semibold text-gray-800">{partner.name}</h4>
                <p className="text-sm text-gray-600">{partner.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">Certificaciones y Reconocimientos</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-white/10 p-3 rounded-full">
                    {cert.icon}
                  </div>
                </div>
                <h4 className="font-semibold">{cert.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;