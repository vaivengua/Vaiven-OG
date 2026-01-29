import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Transportista",
      company: "Transportes del Norte",
      content: "VAIVEN me ha permitido optimizar mis rutas y reducir los viajes vacíos en un 70%. Ahora tengo carga tanto de ida como de vuelta.",
      rating: 5,
      avatar: "CM"
    },
    {
      name: "María González",
      role: "Gerente de Logística",
      company: "Industrias ABC",
      content: "La plataforma es increíblemente fácil de usar. Hemos reducido nuestros costos de transporte en un 40% y mejorado los tiempos de entrega.",
      rating: 5,
      avatar: "MG"
    },
    {
      name: "Roberto Silva",
      role: "Propietario",
      company: "Flota Silva",
      content: "El seguimiento en tiempo real nos da tranquilidad total. Nuestros clientes están más satisfechos que nunca con la transparencia.",
      rating: 5,
      avatar: "RS"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Lo que Dicen Nuestros Usuarios</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Testimonios reales de transportistas y clientes satisfechos
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative">
              <CardContent className="pt-6">
                <div className="absolute -top-4 left-6">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Quote className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center mb-4 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;