import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, CheckCircle, Coins, Star, Users, Truck, MapPin, MessageCircle, TrendingUp, Target, Zap, Award, BarChart3 } from 'lucide-react';

const TransporterDashboardPreview: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Maximiza tus ganancias
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Encuentra envíos rentables, gestiona tus rutas y construye tu reputación como transportista confiable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-blue-600">11</p>
                        <p className="text-sm text-neutral-600 font-medium">Envíos Completados</p>
                        <p className="text-xs text-blue-500">+2 esta semana</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <Truck className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">2</p>
                        <p className="text-sm text-neutral-600 font-medium">Envíos Activos</p>
                        <p className="text-xs text-green-500">En proceso</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Zap className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <Coins className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-orange-600">Q 30,548</p>
                        <p className="text-sm text-neutral-600 font-medium">Total Ganado</p>
                        <p className="text-xs text-orange-500">Este mes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Logros Recientes</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Transportista Estrella</p>
                    <p className="text-xs text-neutral-600">Calificación promedio 4.5+</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Meta Mensual</p>
                    <p className="text-xs text-neutral-600">10 envíos completados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Marketplace de Envíos</h3>
                <p className="text-neutral-600">Oportunidades disponibles para ti</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-neutral-900">Guatemala → Antigua</h4>
                        <p className="text-sm text-neutral-600">Textiles • 500kg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">Q 2,500</p>
                      <p className="text-xs text-blue-600 font-medium">Disponible</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Distancia: 45 km</span>
                    <span className="text-neutral-500">Tiempo: 1.5 horas</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Alta demanda</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-neutral-900">Quetzaltenango → Ciudad</h4>
                        <p className="text-sm text-neutral-600">Electrónicos • 200kg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">Q 1,800</p>
                      <p className="text-xs text-purple-600 font-medium">Disponible</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Distancia: 200 km</span>
                    <span className="text-neutral-500">Tiempo: 4 horas</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">Urgente</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-neutral-900">Petén → Flores</h4>
                        <p className="text-sm text-neutral-600">Muebles • 800kg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">Q 3,200</p>
                      <p className="text-xs text-orange-600 font-medium">Disponible</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Distancia: 500 km</span>
                    <span className="text-neutral-500">Tiempo: 8 horas</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">Premium</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-neutral-600">Tu Calificación</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-neutral-900">4.5</span>
                    <span className="text-sm text-neutral-500">/5.0</span>
                  </div>
                </div>
                <div className="mt-2 bg-neutral-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransporterDashboardPreview;