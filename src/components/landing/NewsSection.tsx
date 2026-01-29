import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Eye } from 'lucide-react';

const NewsSection: React.FC = () => {
  const news = [
    {
      title: "Nueva Expansión a Colombia y Perú",
      excerpt: "VAIVEN amplía su red de transportistas a dos nuevos países, ofreciendo más opciones de envío.",
      date: "15 Nov 2024",
      category: "Expansión",
      image: "🌎",
      views: "1.2K"
    },
    {
      title: "Tecnología de Seguimiento Mejorada",
      excerpt: "Implementamos IA avanzada para predicción de rutas y optimización de tiempos de entrega.",
      date: "10 Nov 2024",
      category: "Tecnología",
      image: "🤖",
      views: "890"
    },
    {
      title: "Programa de Sostenibilidad Verde",
      excerpt: "Lanzamos iniciativas para reducir la huella de carbono en el transporte de carga.",
      date: "5 Nov 2024",
      category: "Sostenibilidad",
      image: "🌱",
      views: "756"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Últimas Noticias
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente al día con las últimas novedades y actualizaciones de VAIVEN
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {news.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 text-center">
                <div className="text-6xl mb-4">{article.image}</div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {article.date}
                  <div className="flex items-center ml-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    {article.views}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Button variant="outline" className="w-full group">
                  Leer Más
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3">
            Ver Todas las Noticias
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;