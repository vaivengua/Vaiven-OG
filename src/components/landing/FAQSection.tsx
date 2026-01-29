import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "¿Cómo funciona VAIVEN?",
      answer: "VAIVEN conecta empresas que necesitan enviar carga con transportistas verificados. Publicas tu carga, recibes cotizaciones y eliges el mejor transportista para tu envío."
    },
    {
      question: "¿Qué tipos de carga pueden transportar?",
      answer: "Manejamos todo tipo de carga: productos secos, refrigerados, peligrosos, sobredimensionados y más. Nuestros transportistas están certificados para diferentes tipos de mercancía."
    },
    {
      question: "¿Cómo garantizan la seguridad de mi carga?",
      answer: "Todos nuestros transportistas están verificados, asegurados y monitoreados en tiempo real. Ofrecemos seguimiento GPS 24/7 y seguro de carga incluido."
    },
    {
      question: "¿Cuáles son los costos del servicio?",
      answer: "No cobramos por publicar tu carga. Solo cobramos una pequeña comisión cuando se completa exitosamente el envío. Los precios son transparentes y competitivos."
    },
    {
      question: "¿En qué países operan?",
      answer: "Actualmente operamos en 15 países de América Latina, incluyendo México, Colombia, Perú, Chile, Argentina, Brasil y más. Expandimos constantemente nuestra cobertura."
    },
    {
      question: "¿Cómo me registro como transportista?",
      answer: "El registro es gratuito. Solo necesitas completar tu perfil, subir documentos de verificación y esperar la aprobación. Una vez aprobado, puedes empezar a recibir trabajos."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-full">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre VAIVEN
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left hover:text-violet-600 transition-colors">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;