import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Route, Bell, History, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TransporterDashboardProps {
  onBack: () => void;
}

const TransporterDashboard: React.FC<TransporterDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Transportista</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Verificado</Badge>
            <span className="text-sm text-gray-600">Transportista Pro</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'routes', label: 'Mis Rutas', icon: Route },
              { id: 'notifications', label: 'Notificaciones', icon: Bell },
              { id: 'history', label: 'Historial', icon: History }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicar Nueva Ruta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="route-origin">Origen</Label>
                    <Input id="route-origin" placeholder="Ciudad de origen" />
                  </div>
                  <div>
                    <Label htmlFor="route-destination">Destino</Label>
                    <Input id="route-destination" placeholder="Ciudad de destino" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="departure-date">Fecha de Salida</Label>
                    <Input id="departure-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidad (kg)</Label>
                    <Input id="capacity" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio por kg</Label>
                    <Input id="price" type="number" placeholder="0.00" step="0.01" />
                  </div>
                </div>
                <Button className="w-full">Publicar Ruta</Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Mis Rutas Activas</h2>
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Ruta {i}</h3>
                        <p className="text-sm text-gray-600">Ciudad A → Ciudad B</p>
                        <p className="text-sm text-gray-600">Salida: 2024-01-{15 + i}</p>
                        <p className="text-sm text-gray-600">Capacidad disponible: {500 - i * 100} kg</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Activa</Badge>
                        <p className="text-sm mt-2">${2 + i * 0.5}/kg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notificaciones</h2>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">Nueva solicitud de carga</h3>
                      <p className="text-sm text-gray-600">Un cliente necesita transportar 200kg de Ciudad A a Ciudad B</p>
                      <p className="text-xs text-gray-500 mt-1">Hace {i} hora{i > 1 ? 's' : ''}</p>
                      <div className="mt-3 space-x-2">
                        <Button size="sm">Ver Detalles</Button>
                        <Button size="sm" variant="outline">Rechazar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Historial de Transportes</h2>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Transporte #{1000 + i}</h3>
                      <p className="text-sm text-gray-600">Ciudad A → Ciudad B</p>
                      <p className="text-sm text-gray-600">Fecha: 2024-01-{i}</p>
                      <p className="text-sm text-gray-600">Peso: {150 + i * 50} kg</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Completado</span>
                      </div>
                      <p className="text-sm mt-1">${(150 + i * 50) * 2.5}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TransporterDashboard;