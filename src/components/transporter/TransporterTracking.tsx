import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Euro, 
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Phone,
  Mail,
  User,
  CheckCircle,
  Truck,
  Zap,
  Eye,
  Navigation,
  Fuel,
  Gauge,
  Calendar,
  AlertTriangle,
  Route,
  BarChart3,
  Activity,
  Target,
  Award,
  Users as UsersIcon,
  Clock as ClockIcon,
  Map,
  Navigation2,
  Battery,
  Thermometer,
  Shield
} from 'lucide-react';

export default function TransporterTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('active');

  const activeDeliveries = [
    {
      id: 'D001',
      cargo: 'Electrodomésticos',
      origin: 'Madrid',
      destination: 'Barcelona',
      status: 'en_transito',
      progress: 75,
      client: {
        name: 'TechCorp Solutions',
        rating: 4.9,
        phone: '+34 600 123 456',
        email: 'logistics@techcorp.com'
      },
      startDate: '2024-01-15',
      estimatedArrival: '2024-01-16 14:30',
      currentLocation: 'Zaragoza',
      nextMilestone: 'Lleida',
      distance: '625 km',
      distanceCompleted: '470 km',
      remainingDistance: '155 km',
      weight: '850 kg',
      volume: '12 m³',
      price: '€650',
      vehicle: {
        type: 'Camión Rígido',
        plate: '1234 ABC',
        fuel: 65,
        speed: 85,
        temperature: 22,
        battery: 90
      },
      route: [
        { location: 'Madrid', status: 'completed', time: '2024-01-15 08:00' },
        { location: 'Guadalajara', status: 'completed', time: '2024-01-15 09:30' },
        { location: 'Zaragoza', status: 'current', time: '2024-01-15 12:00' },
        { location: 'Lleida', status: 'pending', time: '2024-01-15 14:30' },
        { location: 'Barcelona', status: 'pending', time: '2024-01-16 14:30' }
      ],
      alerts: [
        { type: 'info', message: 'Próxima parada en 30 minutos', time: '2024-01-15 12:30' }
      ]
    },
    {
      id: 'D002',
      cargo: 'Material de Construcción',
      origin: 'Sevilla',
      destination: 'Valencia',
      status: 'preparando',
      progress: 25,
      client: {
        name: 'ConstructPro',
        rating: 4.7,
        phone: '+34 600 789 012',
        email: 'shipping@constructpro.es'
      },
      startDate: '2024-01-16',
      estimatedArrival: '2024-01-17 10:00',
      currentLocation: 'Sevilla',
      nextMilestone: 'Córdoba',
      distance: '450 km',
      distanceCompleted: '0 km',
      remainingDistance: '450 km',
      weight: '1200 kg',
      volume: '8 m³',
      price: '€480',
      vehicle: {
        type: 'Tráiler',
        plate: '5678 DEF',
        fuel: 85,
        speed: 0,
        temperature: 18,
        battery: 95
      },
      route: [
        { location: 'Sevilla', status: 'current', time: '2024-01-16 08:00' },
        { location: 'Córdoba', status: 'pending', time: '2024-01-16 10:30' },
        { location: 'Jaén', status: 'pending', time: '2024-01-16 13:00' },
        { location: 'Albacete', status: 'pending', time: '2024-01-16 16:00' },
        { location: 'Valencia', status: 'pending', time: '2024-01-17 10:00' }
      ],
      alerts: [
        { type: 'warning', message: 'Carga en proceso de verificación', time: '2024-01-16 08:15' }
      ]
    }
  ];

  const completedDeliveries = [
    {
      id: 'D003',
      cargo: 'Productos Textiles',
      origin: 'Bilbao',
      destination: 'Zaragoza',
      status: 'completado',
      client: {
        name: 'Fashion Express',
        rating: 4.8,
        phone: '+34 600 345 678',
        email: 'logistics@fashion-express.com'
      },
      startDate: '2024-01-14',
      completionDate: '2024-01-14 16:30',
      deliveryTime: '8.5 horas',
      distance: '320 km',
      weight: '300 kg',
      volume: '25 m³',
      price: '€420',
      rating: 5,
      feedback: 'Excelente servicio, entrega puntual y en perfectas condiciones.',
      earnings: '€420',
      fuelCost: '€45',
      netEarnings: '€375'
    },
    {
      id: 'D004',
      cargo: 'Equipos Informáticos',
      origin: 'Valencia',
      destination: 'Madrid',
      status: 'completado',
      client: {
        name: 'IT Solutions Pro',
        rating: 4.6,
        phone: '+34 600 901 234',
        email: 'shipping@itsolutions.es'
      },
      startDate: '2024-01-13',
      completionDate: '2024-01-13 15:45',
      deliveryTime: '7.75 horas',
      distance: '355 km',
      weight: '450 kg',
      volume: '6 m³',
      price: '€380',
      rating: 4,
      feedback: 'Buen servicio, pero llegó 15 minutos tarde.',
      earnings: '€380',
      fuelCost: '€52',
      netEarnings: '€328'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_transito': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparando': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'retrasado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_transito': return <Truck className="h-4 w-4" />;
      case 'preparando': return <Package className="h-4 w-4" />;
      case 'completado': return <CheckCircle className="h-4 w-4" />;
      case 'retrasado': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredDeliveries = activeDeliveries.filter(delivery => {
    const matchesSearch = delivery.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    switch (sortBy) {
      case 'date': return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'progress': return b.progress - a.progress;
      case 'distance': return parseInt(b.distanceCompleted) - parseInt(a.distanceCompleted);
      default: return 0;
    }
  });

  const stats = [
    { 
      title: 'Entregas Activas', 
      value: activeDeliveries.length.toString(), 
      change: '+1', 
      changeType: 'positive',
      icon: Truck, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up',
      description: 'En curso'
    },
    { 
      title: 'Completadas Hoy', 
      value: completedDeliveries.filter(d => d.completionDate?.includes('2024-01-16')).length, 
      icon: CheckCircle, 
      color: 'text-blue-600',
      change: '+2',
      trend: 'up'
    },
    { 
      title: 'Tiempo Promedio', 
      value: '8.2 horas', 
      icon: Clock, 
      color: 'text-purple-600',
      change: '-0.5h',
      trend: 'down'
    },
    { 
      title: 'Calificación', 
      value: '4.8', 
      icon: Star, 
      color: 'text-yellow-600',
      change: '+0.1',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seguimiento de Entregas</h1>
          <p className="text-gray-600 mt-1">Monitorea tus entregas en tiempo real</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[blue-500] text-[blue-500] hover:bg-[blue-500] hover:text-white">
            <Map className="h-4 w-4 mr-2" />
            Ver Mapa
          </Button>
          <Button className="bg-[blue-500] hover:bg-[blue-600]">
            <Navigation2 className="h-4 w-4 mr-2" />
            Nueva Entrega
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200 hover:shadow-lg transition-all duration-200 group cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className="p-2 rounded-lg bg-gray-50 group-hover:scale-110 transition-transform duration-200">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 text-blue-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span className={`text-xs ${stat.changeType === 'positive' ? 'text-blue-600' : 'text-red-600'}`}>
                    {stat.change} este mes
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <Search className="h-5 w-5 mr-2 text-[blue-500]" />
            Buscar y Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar entregas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="preparando">Preparando</SelectItem>
                <SelectItem value="en_transito">En tránsito</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="retrasado">Retrasado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="progress">Progreso</SelectItem>
                <SelectItem value="distance">Distancia</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 hover:border-[blue-500]">
              <Filter className="h-4 w-4 mr-2" />
              Más Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Activas ({activeDeliveries.length})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({completedDeliveries.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-900">{delivery.cargo}</CardTitle>
                        <Badge className={getStatusColor(delivery.status)}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1">
                            {delivery.status === 'en_transito' ? 'En tránsito' :
                             delivery.status === 'preparando' ? 'Preparando' :
                             delivery.status === 'completado' ? 'Completado' :
                             'Retrasado'}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{delivery.origin} → {delivery.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{delivery.startDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress and Location */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Progreso de la entrega</span>
                      <span className="text-sm text-gray-600">{delivery.progress}%</span>
                    </div>
                    <Progress value={delivery.progress} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ubicación actual:</span>
                        <p className="font-medium text-gray-900">{delivery.currentLocation}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Próximo hito:</span>
                        <p className="font-medium text-gray-900">{delivery.nextMilestone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Status */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Estado del Vehículo</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Combustible:</span>
                          <div className="flex items-center space-x-1">
                            <Fuel className="h-3 w-3 text-gray-500" />
                            <span className="font-medium">{delivery.vehicle.fuel}%</span>
                          </div>
                        </div>
                                                 <div className="flex items-center justify-between text-sm">
                           <span className="text-gray-600">Velocidad:</span>
                           <div className="flex items-center space-x-1">
                             <Gauge className="h-3 w-3 text-gray-500" />
                             <span className="font-medium">{delivery.vehicle.speed} km/h</span>
                           </div>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Temperatura:</span>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3 text-gray-500" />
                            <span className="font-medium">{delivery.vehicle.temperature}°C</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Batería:</span>
                          <div className="flex items-center space-x-1">
                            <Battery className="h-3 w-3 text-gray-500" />
                            <span className="font-medium">{delivery.vehicle.battery}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Progress */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Route className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Progreso de la Ruta</span>
                    </div>
                    <div className="space-y-2">
                      {delivery.route.map((stop, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            stop.status === 'completed' ? 'bg-blue-500' :
                            stop.status === 'current' ? 'bg-yellow-500' :
                            'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{stop.location}</p>
                            <p className="text-xs text-gray-500">{stop.time}</p>
                          </div>
                          {stop.status === 'current' && (
                            <Badge variant="outline" className="text-xs">
                              Actual
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{delivery.client.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{delivery.client.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Llamar
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button size="sm" variant="outline">
                          <Navigation className="h-4 w-4 mr-1" />
                          Navegación
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="bg-[blue-500] hover:bg-[blue-600]">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar Completada
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-900">{delivery.cargo}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Completado
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{delivery.origin} → {delivery.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{delivery.completionDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Delivery Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tiempo de entrega:</span>
                        <span className="font-medium">{delivery.deliveryTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Distancia:</span>
                        <span className="font-medium">{delivery.distance}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Peso:</span>
                        <span className="font-medium">{delivery.weight} kg</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Precio:</span>
                        <span className="font-medium text-[blue-500]">{delivery.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Calificación:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="font-medium">{delivery.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ganancias netas:</span>
                        <span className="font-medium text-blue-600">{delivery.netEarnings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Feedback */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Feedback del Cliente</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {delivery.feedback}
                    </p>
                  </div>

                  {/* Client Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{delivery.client.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{delivery.client.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Llamar
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-[blue-500]" />
                  Análisis de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Los gráficos de analytics estarán disponibles próximamente</p>
                  <Button className="mt-4 bg-[blue-500] hover:bg-[blue-600]">
                    Configurar Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-[blue-500]" />
                  Logros y Reconocimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Entregador Destacado</p>
                      <p className="text-sm text-yellow-700">Completaste 50+ entregas exitosas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Excelente Calificación</p>
                      <p className="text-sm text-blue-700">Mantienes 4.8+ estrellas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Puntualidad</p>
                      <p className="text-sm text-blue-700">95% de entregas a tiempo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
