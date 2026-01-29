import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-neutral-500">
            Proceso simple en 3 pasos para conectar clientes y transportistas
          </p>
        </div>
        
        {/* For Clients */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-neutral-900 mb-12">Para Clientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">Publica tu envío</h4>
              <p className="text-neutral-500">
                Describe tu carga, origen, destino y fecha. Recibe cotizaciones automáticas.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">Selecciona transportista</h4>
              <p className="text-neutral-500">
                Compara precios, calificaciones y elige el transportista que mejor se adapte.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">Rastrea y recibe</h4>
              <p className="text-neutral-500">
                Monitorea tu envío en tiempo real hasta que llegue a su destino.
              </p>
            </div>
          </div>
        </div>

        {/* For Transporters */}
        <div>
          <h3 className="text-2xl font-bold text-center text-neutral-900 mb-12">Para Transportistas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">Publica tu ruta</h4>
              <p className="text-neutral-500">
                Indica tus rutas disponibles, capacidad y fechas de viaje.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">Acepta envíos</h4>
              <p className="text-neutral-500">
                Recibe notificaciones de cargas compatibles con tus rutas.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-3">Entrega y cobra</h4>
              <p className="text-neutral-500">
                Completa la entrega y recibe tu pago de forma automática.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;