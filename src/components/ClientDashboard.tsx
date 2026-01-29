import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, MapPin, Calendar, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ClientDashboardProps {
  onBack: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('publish');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Cliente</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Bienvenido, Cliente</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'publish', label: 'Publicar Envío', icon: Package },
              { id: 'transporters', label: 'Transportistas', icon: MapPin },
              { id: 'history', label: 'Historial', icon: Calendar }
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
        {activeTab === 'publish' && (
          <Card>
            <CardHeader>
              <CardTitle>Publicar Solicitud de Transporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origen</Label>
                  <Input id="origin" placeholder="Ciudad de origen" />
                </div>
                <div>
                  <Label htmlFor="destination">Destino</Label>
                  <Input id="destination" placeholder="Ciudad de destino" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción de la carga</Label>
                <Textarea id="description" placeholder="Describe tu carga..." />
              </div>
              <Button className="w-full">Publicar Solicitud</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'transporters' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transportistas Disponibles</h2>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Transportista {i}</h3>
                      <p className="text-sm text-gray-600">Ruta: Ciudad A → Ciudad B</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">4.{8 + i}/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">${100 + i * 50}</p>
                      <Button size="sm" className="mt-2">Contratar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Historial de Envíos</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">No tienes envíos anteriores.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;