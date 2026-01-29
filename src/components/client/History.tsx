import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { History as HistoryIcon, Package, Truck, CheckCircle, Clock, DollarSign, Star, MapPin, Calendar, FileText, Download, Eye, MessageCircle, Phone, Route, AlertCircle, TrendingUp, TrendingDown, Search } from 'lucide-react';

export default function History() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const shipments = [
    {
      id: 'S001',
      cargoType: 'Electrónicos',
      origin: 'Ciudad de Guatemala',
      destination: 'Antigua Guatemala',
      weight: '500 kg',
      budget: 'Q 2,500',
      finalCost: 'Q 2,300',
      status: 'Entregado',
      transporter: 'Transportes Rápidos GT',
      driver: 'Carlos Méndez',
      phone: '+502 1234-5678',
      rating: 4.8,
      reviews: 127,
      startDate: '2024-01-15 08:00',
      endDate: '2024-01-15 14:30',
      duration: '6 horas 30 min',
      distance: '45 km',
      vehicle: 'Camión Refrigerado',
      insurance: 'Completa',
      description: 'Carga de dispositivos electrónicos que requiere manejo especial y temperatura controlada.',
      specialRequirements: ['Manejo cuidadoso', 'Temperatura controlada', 'Entrega programada'],
      documents: ['Factura comercial', 'Certificado de origen', 'Seguro de carga'],
      milestones: [
        { id: 1, location: 'Ciudad de Guatemala', status: 'completed', time: '08:00', description: 'Carga recogida' },
        { id: 2, location: 'Mixco', status: 'completed', time: '09:30', description: 'En tránsito' },
        { id: 3, location: 'San Lucas Sacatepéquez', status: 'completed', time: '12:00', description: 'En ruta' },
        { id: 4, location: 'Antigua Guatemala', status: 'completed', time: '14:30', description: 'Entrega completada' }
      ],
      customerRating: 5,
      customerReview: 'Excelente servicio, muy puntual y cuidadoso con la carga.',
      issues: [],
      savings: 'Q 200'
    },
    {
      id: 'S002',
      cargoType: 'Cristalería',
      origin: 'Quetzaltenango',
      destination: 'Huehuetenango',
      weight: '200 kg',
      budget: 'Q 1,800',
      finalCost: 'Q 1,650',
      status: 'Entregado',
      transporter: 'Logística Maya',
      driver: 'Ana Rodríguez',
      phone: '+502 2345-6789',
      rating: 4.9,
      reviews: 89,
      startDate: '2024-01-14 10:00',
      endDate: '2024-01-14 13:00',
      duration: '3 horas',
      distance: '120 km',
      vehicle: 'Furgón Cerrado',
      insurance: 'Básica',
      description: 'Carga de cristalería fina que requiere embalaje especial y transporte sin vibraciones.',
      specialRequirements: ['Sin vibraciones', 'Embalaje especial', 'Ruta pavimentada'],
      documents: ['Factura comercial', 'Certificado de fragilidad'],
      milestones: [
        { id: 1, location: 'Quetzaltenango', status: 'completed', time: '10:00', description: 'Carga recogida' },
        { id: 2, location: 'San Marcos', status: 'completed', time: '11:30', description: 'En tránsito' },
        { id: 3, location: 'Huehuetenango', status: 'completed', time: '13:00', description: 'Entrega completada' }
      ],
      customerRating: 4,
      customerReview: 'Buen servicio, aunque llegó un poco tarde.',
      issues: ['Retraso de 30 minutos'],
      savings: 'Q 150'
    },
    {
      id: 'S003',
      cargoType: 'Productos Agrícolas',
      origin: 'Escuintla',
      destination: 'Retalhuleu',
      weight: '1,000 kg',
      budget: 'Q 4,200',
      finalCost: 'Q 4,500',
      status: 'Entregado',
      transporter: 'Cargo Express',
      driver: 'Roberto Morales',
      phone: '+502 3456-7890',
      rating: 4.6,
      reviews: 203,
      startDate: '2024-01-13 08:00',
      endDate: '2024-01-13 15:00',
      duration: '7 horas',
      distance: '85 km',
      vehicle: 'Camión Refrigerado',
      insurance: 'Completa',
      description: 'Carga de productos agrícolas perecederos que requiere refrigeración constante.',
      specialRequirements: ['Refrigeración constante', 'Entrega rápida'],
      documents: ['Certificado fitosanitario', 'Factura comercial'],
      milestones: [
        { id: 1, location: 'Escuintla', status: 'completed', time: '08:00', description: 'Carga recogida' },
        { id: 2, location: 'Mazatenango', status: 'completed', time: '12:00', description: 'En tránsito' },
        { id: 3, location: 'Retalhuleu', status: 'completed', time: '15:00', description: 'Entrega completada' }
      ],
      customerRating: 3,
      customerReview: 'Servicio aceptable, pero el costo fue mayor al presupuesto.',
      issues: ['Costo excedió presupuesto', 'Retraso de 1 hora'],
      savings: '-Q 300'
    },
    {
      id: 'S004',
      cargoType: 'Textiles',
      origin: 'Chimaltenango',
      destination: 'Sacatepéquez',
      weight: '800 kg',
      budget: 'Q 3,000',
      finalCost: 'Q 2,800',
      status: 'Entregado',
      transporter: 'Transportes Unidos',
      driver: 'María López',
      phone: '+502 4567-8901',
      rating: 4.7,
      reviews: 156,
      startDate: '2024-01-12 09:00',
      endDate: '2024-01-12 11:30',
      duration: '2 horas 30 min',
      distance: '35 km',
      vehicle: 'Furgón Cerrado',
      insurance: 'Básica',
      description: 'Carga de textiles que requiere protección contra humedad y polvo.',
      specialRequirements: ['Protección contra humedad', 'Carga seca'],
      documents: ['Factura comercial', 'Certificado de calidad'],
      milestones: [
        { id: 1, location: 'Chimaltenango', status: 'completed', time: '09:00', description: 'Carga recogida' },
        { id: 2, location: 'Sacatepéquez', status: 'completed', time: '11:30', description: 'Entrega completada' }
      ],
      customerRating: 5,
      customerReview: 'Servicio excepcional, muy profesional y puntual.',
      issues: [],
      savings: 'Q 200'
    }
  ];

  // KPI calculations
  const totalShipments = shipments.length;
  const completedShipments = shipments.filter(s => s.status === 'Entregado').length;
  const totalSpent = shipments.reduce((sum, s) => sum + parseInt(s.finalCost.replace('Q ', '').replace(',', '')), 0);
  const totalSavings = shipments.reduce((sum, s) => {
    const savings = parseInt(s.savings.replace('Q ', '').replace(',', ''));
    return sum + (savings > 0 ? savings : 0);
  }, 0);
  const averageRating = shipments.reduce((sum, s) => sum + s.customerRating, 0) / shipments.length;

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.cargoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.transporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'completed' && shipment.status === 'Entregado') ||
                      (activeTab === 'issues' && shipment.issues.length > 0);
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado': return 'bg-green-100 text-green-800 border-green-200';
      case 'En tránsito': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entregado': return <CheckCircle className="h-4 w-4" />;
      case 'En tránsito': return <Truck className="h-4 w-4" />;
      case 'Cancelado': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const selectedShipmentData = shipments.find(s => s.id === selectedShipment);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Historial de Envíos</h1>
        <p className="text-blue-600">Revisa el historial completo de tus envíos y evaluaciones</p>
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
                <p className="text-sm font-medium text-green-600">Completados</p>
                <p className="text-2xl font-bold text-green-800">{completedShipments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Gastado</p>
                <p className="text-2xl font-bold text-purple-800">Q {totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Calificación Promedio</p>
                <p className="text-2xl font-bold text-orange-800">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  placeholder="Buscar por ID, tipo de carga o transportista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 border-blue-200">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="En tránsito">En tránsito</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Todos</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Completados</TabsTrigger>
              <TabsTrigger value="issues" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Con Problemas</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-blue-200">
                <TableHead className="text-blue-800 font-semibold">ID</TableHead>
                <TableHead className="text-blue-800 font-semibold">Carga</TableHead>
                <TableHead className="text-blue-800 font-semibold">Ruta</TableHead>
                <TableHead className="text-blue-800 font-semibold">Transportista</TableHead>
                <TableHead className="text-blue-800 font-semibold">Costo</TableHead>
                <TableHead className="text-blue-800 font-semibold">Duración</TableHead>
                <TableHead className="text-blue-800 font-semibold">Calificación</TableHead>
                <TableHead className="text-blue-800 font-semibold">Estado</TableHead>
                <TableHead className="text-blue-800 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id} className="border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-medium text-blue-800">#{shipment.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{shipment.cargoType}</p>
                      <p className="text-sm text-blue-600">{shipment.weight}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{shipment.origin}</p>
                      <p className="text-sm text-blue-600">→ {shipment.destination}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{shipment.transporter}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-blue-600">{shipment.rating} ({shipment.reviews})</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-blue-800">{shipment.finalCost}</p>
                      <p className="text-sm text-blue-600">Presupuesto: {shipment.budget}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{shipment.duration}</p>
                      <p className="text-sm text-blue-600">{shipment.distance}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-blue-800">{shipment.customerRating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(shipment.status)}>
                      {getStatusIcon(shipment.status)}
                      <span className="ml-1">{shipment.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              Detalles del Envío #{shipment.id}
                            </DialogTitle>
                            <DialogDescription>
                              Información completa del envío, timeline y evaluación
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-blue-800 mb-2">Información de Carga</h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Tipo:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.cargoType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Peso:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.weight}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Presupuesto:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.budget}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Costo Final:</span>
                                      <span className="text-sm font-bold text-blue-800">{shipment.finalCost}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Ahorro:</span>
                                      <span className={`text-sm font-medium ${parseInt(shipment.savings.replace('Q ', '').replace(',', '')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {shipment.savings}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-blue-800 mb-2">Información de Ruta</h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Origen:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.origin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Destino:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.destination}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Duración:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.duration}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Distancia:</span>
                                      <span className="text-sm font-medium text-blue-800">{shipment.distance}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-blue-800">Transportista</h3>
                                <div className="bg-blue-50/50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-semibold text-blue-800">{shipment.transporter}</p>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm text-blue-600">{shipment.rating} ({shipment.reviews} reseñas)</span>
                                      </div>
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
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-blue-600">Conductor:</span>
                                      <p className="font-medium text-blue-800">{shipment.driver}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Teléfono:</span>
                                      <p className="font-medium text-blue-800">{shipment.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-800">Timeline del Envío</h3>
                              <div className="space-y-4">
                                {shipment.milestones.map((milestone, index) => (
                                  <div key={milestone.id} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      {index < shipment.milestones.length - 1 && (
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
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-800">Evaluación del Cliente</h3>
                              <div className="bg-green-50/50 rounded-lg p-4 border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                  <span className="font-semibold text-green-800">{shipment.customerRating}/5</span>
                                </div>
                                <p className="text-sm text-green-700">{shipment.customerReview}</p>
                              </div>
                            </div>

                            {shipment.issues.length > 0 && (
                              <div className="space-y-4">
                                <h3 className="font-semibold text-blue-800">Problemas Reportados</h3>
                                <div className="border-2 border-red-200 bg-red-50/50 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <p className="font-semibold text-red-800">Incidencias</p>
                                  </div>
                                  <ul className="space-y-1">
                                    {shipment.issues.map((issue, index) => (
                                      <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                        {issue}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar Factura
                              </Button>
                              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                <FileText className="h-4 w-4 mr-2" />
                                Ver Documentos
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 