import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Route, 
  MapPin, 
  Shield, 
  Star, 
  FileText, 
  Headphones 
} from 'lucide-react';

const features = [
  {
    icon: Route,
    title: "Matching Inteligente",
    description: "Conectamos automáticamente tus envíos con transportistas disponibles en las rutas que necesitas.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: MapPin,
    title: "Rastreo GPS",
    description: "Seguimiento en tiempo real de tu carga desde la recolección hasta la entrega final.",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Shield,
    title: "Pagos Seguros",
    description: "Procesamiento seguro de pagos con retención hasta confirmar la entrega exitosa.",
    color: "bg-yellow-500/10 text-yellow-600"
  },
  {
    icon: Star,
    title: "Sistema de Calificación",
    description: "Calificaciones mutuas y comentarios para garantizar la calidad del servicio.",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: FileText,
    title: "Gestión Documental",
    description: "Manejo digital de facturas, guías de transporte y evidencia de entrega.",
    color: "bg-red-500/10 text-red-600"
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description: "Chat en vivo y soporte técnico disponible las 24 horas del día.",
    color: "bg-blue-500/10 text-blue-600"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Todo lo que necesitas para transportar tu carga
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto">
            Desde la cotización hasta la entrega, nuestra plataforma te acompaña en cada paso del proceso.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 ${feature.color}`}>
                  <feature.icon className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;