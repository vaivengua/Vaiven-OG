import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Bell, MapPin, MessageSquare, Package, CheckCircle, Coins } from 'lucide-react';

const MobilePreview: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Aplicación móvil para estar conectado siempre
          </h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
            Recibe notificaciones en tiempo real, rastrea envíos y gestiona tu logística desde cualquier lugar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Smartphone className="h-5 w-5 text-neutral-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Nueva Oferta Recibida</p>
                        <p className="text-xs text-neutral-500">Carlos Mendoza - Q 2,500</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Envío En Proceso</p>
                        <p className="text-xs text-neutral-500">Textiles - Guatemala → Antigua</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Mensaje del Cliente</p>
                        <p className="text-xs text-neutral-500">"¿Confirmas hora de entrega?"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <Coins className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Pago Confirmado</p>
                        <p className="text-xs text-neutral-500">Q 2,200 - Envío #1234</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <span className="text-neutral-500">Activos</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <span className="text-xs font-bold text-green-600">8</span>
                      </div>
                      <span className="text-neutral-500">Completados</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <span className="text-xs font-bold text-orange-600">2</span>
                      </div>
                      <span className="text-neutral-500">Pendientes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Bell className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Notificaciones Push</h3>
                      <p className="text-sm text-neutral-500">Alertas instantáneas de ofertas y cambios de estado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Mapas Interactivos</h3>
                      <p className="text-sm text-neutral-500">Selecciona ubicaciones exactas para recogida y entrega</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Chat Integrado</h3>
                      <p className="text-sm text-neutral-500">Comunicación directa entre clientes y transportistas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Gestión de Pagos</h3>
                      <p className="text-sm text-neutral-500">Acepta y confirma pagos directamente desde la app</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobilePreview;
