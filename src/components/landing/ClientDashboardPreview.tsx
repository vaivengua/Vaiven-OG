import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, CheckCircle, Coins, Star, Users, Truck, MapPin, MessageCircle, Plus, Bell, Calendar, CreditCard, Shield } from 'lucide-react';

const ClientDashboardPreview: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Gestiona tus envíos
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto">
            Controla todos tus envíos, recibe ofertas de transportistas y gestiona tus pagos desde un solo lugar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-blue-700" />
                  </div>
                  <p className="text-2xl font-bold text-blue-700">3</p>
                  <p className="text-sm text-blue-600 font-medium">Envíos Activos</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-700" />
                  </div>
                  <p className="text-2xl font-bold text-green-700">12</p>
                  <p className="text-sm text-green-600 font-medium">Completados</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coins className="h-6 w-6 text-orange-700" />
                  </div>
                  <p className="text-2xl font-bold text-orange-700">Q 30,548</p>
                  <p className="text-sm text-orange-600 font-medium">Total Gastado</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-purple-700" />
                  </div>
                  <p className="text-2xl font-bold text-purple-700">4.8</p>
                  <p className="text-sm text-purple-600 font-medium">Calificación</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Notificaciones Recientes</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">Envío #12345 entregado</p>
                    <p className="text-xs text-neutral-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">Nueva oferta recibida</p>
                    <p className="text-xs text-neutral-500">Hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">Pago procesado</p>
                    <p className="text-xs text-neutral-500">Ayer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neutral-900">Ofertas Recibidas</h3>
                  <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">3 transportistas</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Truck className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900">Carlos Mendoza</h4>
                        <p className="text-sm text-neutral-600">Camión Grande • 4.9 ⭐</p>
                        <p className="text-xs text-yellow-600 font-medium">Tiempo estimado: 2 días</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900">Q 2,500</p>
                      <p className="text-xs text-yellow-600 font-medium">Pendiente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900">María López</h4>
                        <p className="text-sm text-neutral-600">Furgoneta • 4.7 ⭐</p>
                        <p className="text-xs text-blue-600 font-medium">Tiempo estimado: 1 día</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900">Q 2,200</p>
                      <p className="text-xs text-blue-600 font-medium">Aceptada</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Truck className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900">Juan Pérez</h4>
                        <p className="text-sm text-neutral-600">Pickup • 4.8 ⭐</p>
                        <p className="text-xs text-green-600 font-medium">Tiempo estimado: 3 días</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neutral-900">Q 1,800</p>
                      <p className="text-xs text-green-600 font-medium">Pagada</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-neutral-600">Pagos protegidos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-neutral-900">4.8</span>
                      <span className="text-sm text-neutral-500">promedio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientDashboardPreview;