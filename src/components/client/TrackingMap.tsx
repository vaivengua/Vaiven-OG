import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { MapPin, Truck, Clock, Phone, MessageCircle, Navigation, Package, AlertCircle, CheckCircle, Calendar, Route, Zap, Users, DollarSign } from 'lucide-react';

export default function TrackingMap() {
  const [selectedShipment, setSelectedShipment] = useState('001');
  const [currentLocation, setCurrentLocation] = useState({ lat: 14.6349, lng: -90.5069 }); // Guatemala City
  const [activeTab, setActiveTab] = useState('map');

  const shipments = [
    {
      id: '001',
      origin: 'Ciudad de Guatemala',
      destination: 'Antigua Guatemala',
      status: 'En tránsito',
      progress: 65,
      estimatedArrival: '2024-01-16 14:30',
      driver: 'Carlos Méndez',
      phone: '+502 1234-5678',
      currentLocation: 'San Lucas Sacatepéquez',
      lastUpdate: '2024-01-15 16:45',
      cargoType: 'Electrónicos',
      weight: '500 kg',
      budget: 'Q 2,500',
      vehicle: 'Camión Refrigerado',
      route: 'Guatemala → Antigua',
      distance: '45 km',
      timeRemaining: '2 horas 15 min',
      alerts: ['Carga frágil - manejo especial'],
      milestones: [
        { id: 1, location: 'Ciudad de Guatemala', status: 'completed', time: '08:00', description: 'Carga recogida' },
        { id: 2, location: 'Mixco', status: 'completed', time: '09:30', description: 'En tránsito' },
        { id: 3, location: 'San Lucas Sacatepéquez', status: 'current', time: '16:45', description: 'En ruta' },
        { id: 4, location: 'Antigua Guatemala', status: 'pending', time: '14:30', description: 'Entrega programada' }
      ]
    },
    {
      id: '002',
      origin: 'Quetzaltenango',
      destination: 'Huehuetenango',
      status: 'Recogido',
      progress: 25,
      estimatedArrival: '2024-01-17 10:00',
      driver: 'Ana Rodríguez',
      phone: '+502 2345-6789',
      currentLocation: 'San Marcos',
      lastUpdate: '2024-01-15 12:30',
      cargoType: 'Cristalería',
      weight: '200 kg',
      budget: 'Q 1,800',
      vehicle: 'Furgón Cerrado',
      route: 'Quetzaltenango → Huehuetenango',
      distance: '120 km',
      timeRemaining: '18 horas 30 min',
      alerts: ['Carga frágil - sin vibraciones'],
      milestones: [
        { id: 1, location: 'Quetzaltenango', status: 'completed', time: '10:00', description: 'Carga recogida' },
        { id: 2, location: 'San Marcos', status: 'current', time: '12:30', description: 'En tránsito' },
        { id: 3, location: 'Huehuetenango', status: 'pending', time: '10:00', description: 'Entrega programada' }
      ]
    },
    {
      id: '003',
      origin: 'Escuintla',
      destination: 'Retalhuleu',
      status: 'Entregado',
      progress: 100,
      estimatedArrival: '2024-01-14 15:00',
      driver: 'Roberto Morales',
      phone: '+502 3456-7890',
      currentLocation: 'Retalhuleu',
      lastUpdate: '2024-01-14 15:00',
      cargoType: 'Productos Agrícolas',
      weight: '1,000 kg',
      budget: 'Q 4,200',
      vehicle: 'Camión Refrigerado',
      route: 'Escuintla → Retalhuleu',
      distance: '85 km',
      timeRemaining: 'Completado',
      alerts: [],
      milestones: [
        { id: 1, location: 'Escuintla', status: 'completed', time: '08:00', description: 'Carga recogida' },
        { id: 2, location: 'Mazatenango', status: 'completed', time: '12:00', description: 'En tránsito' },
        { id: 3, location: 'Retalhuleu', status: 'completed', time: '15:00', description: 'Entrega completada' }
      ]
    }
  ];

  const activeShipment = shipments.find(s => s.id === selectedShipment);

  // KPI calculations
  const totalShipments = shipments.length;
  const activeShipments = shipments.filter(s => s.status === 'En tránsito' || s.status === 'Recogido').length;
  const completedShipments = shipments.filter(s => s.status === 'Entregado').length;
  const totalDistance = shipments.reduce((sum, s) => sum + parseInt(s.distance), 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En tránsito': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Recogido': return 'bg-green-100 text-green-800 border-green-200';
      case 'Entregado': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'current': return <Navigation className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Seguimiento de Envíos</h1>
        <p className="text-blue-600">Monitorea tus cargas en tiempo real en Guatemala</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Envíos</p>
                <p className="text-2xl font-bold text-blue-800">{totalShipments}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">En Tránsito</p>
                <p className="text-2xl font-bold text-green-800">{activeShipments}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Completados</p>
                <p className="text-2xl font-bold text-purple-800">{completedShipments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Distancia Total</p>
                <p className="text-2xl font-bold text-orange-800">{totalDistance} km</p>
              </div>
              <Route className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipments List */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Envíos Activos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedShipment === shipment.id 
                      ? 'border-blue-500 bg-blue-50/50 shadow-lg' 
                      : 'border-blue-200 hover:bg-blue-50/30 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedShipment(shipment.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-blue-800">#{shipment.id}</span>
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-600 mb-3 font-medium">
                    {shipment.origin} → {shipment.destination}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-blue-500">
                      <span>Progreso</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <Progress value={shipment.progress} className="h-2" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                    <Clock className="h-3 w-3" />
                    <span>{shipment.timeRemaining}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map and Details */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
              <TabsTrigger value="map" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Mapa</TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Detalles</TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    <MapPin className="h-5 w-5" />
                    Mapa de Seguimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-xl h-96 flex items-center justify-center relative overflow-hidden border-2 border-blue-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 opacity-50"></div>
                    <div className="relative z-10 text-center">
                      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl mb-6 border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Truck className="h-6 w-6 text-blue-600" />
                          <span className="font-bold text-blue-900">Ubicación Actual</span>
                        </div>
                        <p className="text-lg font-semibold text-blue-800 mb-1">{activeShipment?.currentLocation}</p>
                        <p className="text-sm text-blue-600">Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}</p>
                      </div>
                      <div className="animate-pulse">
                        <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto shadow-lg"></div>
                        <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto -mt-9 animate-ping"></div>
                      </div>
                    </div>
                    
                    {/* Route lines */}
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-blue-400 rounded transform rotate-45 shadow-lg"></div>
                    <div className="absolute top-1/2 right-1/4 w-1/3 h-1 bg-blue-500 rounded transform -rotate-12 shadow-lg"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1/4 h-1 bg-blue-300 rounded transform rotate-30 shadow-lg"></div>
                  </div>

                  {activeShipment && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-semibold text-blue-800">Llegada Estimada</p>
                            <p className="text-sm text-blue-600">{activeShipment.estimatedArrival}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-semibold text-blue-800">Última Actualización</p>
                            <p className="text-sm text-blue-600">{activeShipment.lastUpdate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Route className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-semibold text-blue-800">Distancia Restante</p>
                            <p className="text-sm text-blue-600">{activeShipment.distance}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-2 text-blue-800">Conductor</p>
                          <p className="text-sm text-blue-600">{activeShipment.driver}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Detalles del Envío #{activeShipment?.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeShipment && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-blue-800 mb-2">Información de Carga</p>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Tipo:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.cargoType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Peso:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.weight}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Presupuesto:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.budget}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Vehículo:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.vehicle}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-blue-800 mb-2">Información de Ruta</p>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Ruta:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.route}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Distancia:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.distance}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-blue-600">Tiempo Restante:</span>
                                <span className="text-sm font-medium text-blue-800">{activeShipment.timeRemaining}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {activeShipment.alerts.length > 0 && (
                        <div className="border-2 border-yellow-200 bg-yellow-50/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <p className="font-semibold text-yellow-800">Alertas Especiales</p>
                          </div>
                          <ul className="space-y-1">
                            {activeShipment.alerts.map((alert, index) => (
                              <li key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                                <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                                {alert}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Timeline del Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeShipment && (
                    <div className="space-y-4">
                      {activeShipment.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            {getMilestoneIcon(milestone.status)}
                            {index < activeShipment.milestones.length - 1 && (
                              <div className="w-0.5 h-8 bg-blue-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-blue-800">{milestone.location}</p>
                              <p className="text-sm text-blue-600">{milestone.time}</p>
                            </div>
                            <p className="text-sm text-blue-600">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}