import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, CheckCircle, Coins, Star, Users, Truck, MapPin, MessageCircle, Plus, TrendingUp, Clock, DollarSign, BarChart3, Activity } from 'lucide-react';

const DashboardPreview: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Plataforma Integral de Logística
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Conecta clientes y transportistas en una plataforma moderna y eficiente
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">Gestión de Envíos</h3>
              <p className="text-sm md:text-base text-neutral-600 mb-4">Crea, rastrea y gestiona todos tus envíos desde un solo lugar</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Envíos activos:</span>
                  <span className="font-semibold text-blue-600">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Completados:</span>
                  <span className="font-semibold text-green-600">127</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">Marketplace Activo</h3>
              <p className="text-sm md:text-base text-neutral-600 mb-4">Encuentra las mejores ofertas y maximiza tus ganancias</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Oportunidades:</span>
                  <span className="font-semibold text-green-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ganancia promedio:</span>
                  <span className="font-semibold text-green-600">Q 2,400</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">Sistema de Calificaciones</h3>
              <p className="text-sm md:text-base text-neutral-600 mb-4">Construye confianza con nuestro sistema de reputación</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Calificación promedio:</span>
                  <span className="font-semibold text-orange-600">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Reseñas:</span>
                  <span className="font-semibold text-orange-600">89</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm md:text-base">Tiempo Real</h4>
                  <p className="text-xs md:text-sm text-neutral-600">Seguimiento en vivo de todos tus envíos</p>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs md:text-sm font-medium">Envío #12345</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">En tránsito</span>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
                  <span className="text-xs md:text-sm font-medium">Envío #12346</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Entregado</span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm md:text-base">Pagos Seguros</h4>
                  <p className="text-xs md:text-sm text-neutral-600">Transacciones protegidas y garantizadas</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-green-600 mb-1">Q 45,230</p>
                <p className="text-xs md:text-sm text-neutral-600">Total procesado este mes</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">Estadísticas en Vivo</h3>
                <p className="text-sm md:text-base text-neutral-600">Datos actualizados en tiempo real</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl">
                  <p className="text-lg md:text-2xl font-bold text-blue-600">342</p>
                  <p className="text-xs md:text-sm text-neutral-600">Envíos activos</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl">
                  <p className="text-lg md:text-2xl font-bold text-green-600">1,247</p>
                  <p className="text-xs md:text-sm text-neutral-600">Completados</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-orange-50 rounded-xl">
                  <p className="text-lg md:text-2xl font-bold text-orange-600">156</p>
                  <p className="text-xs md:text-sm text-neutral-600">Transportistas</p>
                </div>
                <div className="text-center p-3 md:p-4 bg-purple-50 rounded-xl">
                  <p className="text-lg md:text-2xl font-bold text-purple-600">89</p>
                  <p className="text-xs md:text-sm text-neutral-600">Clientes</p>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 md:px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium">Sistema operativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;