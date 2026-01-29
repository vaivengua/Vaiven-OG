import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Euro, 
  Weight, 
  Eye, 
  Search,
  Filter,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Truck,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  User,
  Shield,
  Thermometer,
  Package2
} from 'lucide-react';

export default function ViewCargo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [weightRange, setWeightRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('all');

  const availableCargo = [
    {
      id: 'C001',
      title: 'Electrodomésticos',
      origin: 'Ciudad de Guatemala',
      destination: 'Quetzaltenango',
      weight: 850,
      volume: '12 m³',
      price: 650,
      deadline: '2024-01-20',
      status: 'disponible',
      description: 'Lavadoras y refrigeradores para tienda',
      rating: 4.8,
      urgency: 'normal',
      vehicleType: 'Camión Rígido',
      specialRequirements: ['Frágil', 'Asegurado'],
      client: {
        name: 'Distribuidora Maya',
        rating: 4.9,
        completedDeliveries: 45,
        phone: '+502 1234-5678',
        email: 'contacto@distribuidoramaya.com'
      },
      distance: '225 km',
      estimatedTime: '6-8 horas',
      insurance: true,
      temperatureControl: false
    },
    {
      id: 'C002',
      title: 'Material de Construcción',
      origin: 'Escuintla',
      destination: 'Retalhuleu',
      weight: 1200,
      volume: '8 m³',
      price: 480,
      deadline: '2024-01-22',
      status: 'urgente',
      description: 'Cemento y materiales varios',
      rating: 4.5,
      urgency: 'high',
      vehicleType: 'Tráiler',
      specialRequirements: ['Peso pesado'],
      client: {
        name: 'Constructora Nacional',
        rating: 4.7,
        completedDeliveries: 23,
        phone: '+502 2345-6789',
        email: 'envios@constructora.com.gt'
      },
      distance: '180 km',
      estimatedTime: '5-6 horas',
      insurance: false,
      temperatureControl: false
    },
    {
      id: 'C003',
      title: 'Productos Textiles',
      origin: 'Ciudad de Guatemala',
      destination: 'Zacapa',
      weight: 300,
      volume: '25 m³',
      price: 420,
      deadline: '2024-01-25',
      status: 'disponible',
      description: 'Ropa y accesorios de temporada',
      rating: 4.9,
      urgency: 'normal',
      vehicleType: 'Furgoneta',
      specialRequirements: ['Seco', 'Ventilado'],
      client: {
        name: 'Fashion Express',
        rating: 4.8,
        completedDeliveries: 67,
        phone: '+502 3456-7890',
        email: 'logistica@fashion-express.com'
      },
      distance: '150 km',
      estimatedTime: '4-5 horas',
      insurance: true,
      temperatureControl: false
    },
    {
      id: 'C004',
      title: 'Equipos Informáticos',
      origin: 'Ciudad de Guatemala',
      destination: 'Ciudad de Guatemala',
      weight: 450,
      volume: '6 m³',
      price: 380,
      deadline: '2024-01-18',
      status: 'reservado',
      description: 'Ordenadores y servidores',
      rating: 4.7,
      urgency: 'high',
      vehicleType: 'Camión Rígido',
      specialRequirements: ['Frágil', 'Asegurado', 'Temperatura controlada'],
      client: {
        name: 'IT Solutions Pro',
        rating: 4.6,
        completedDeliveries: 34,
        phone: '+502 4567-8901',
        email: 'envios@itsolutions.com.gt'
      },
      distance: '100 km',
      estimatedTime: '4-5 horas',
      insurance: true,
      temperatureControl: true
    },
    {
      id: 'C005',
      title: 'Productos Alimentarios',
      origin: 'Ciudad de Guatemala',
      destination: 'Ciudad de Guatemala',
      weight: 800,
      volume: '15 m³',
      price: 720,
      deadline: '2024-01-19',
      status: 'disponible',
      description: 'Productos frescos y congelados',
      rating: 4.6,
      urgency: 'normal',
      vehicleType: 'Camión Refrigerado',
      specialRequirements: ['Refrigerado', 'Fresco'],
      client: {
        name: 'FreshFood Express',
        rating: 4.5,
        completedDeliveries: 89,
        phone: '+502 5678-9012',
        email: 'logistica@freshfood.com'
      },
      distance: '20 km',
      estimatedTime: '1-2 horas',
      insurance: true,
      temperatureControl: true
    },
    {
      id: 'C006',
      title: 'Maquinaria Industrial',
      origin: 'Ciudad de Guatemala',
      destination: 'Ciudad de Guatemala',
      weight: 1800,
      volume: '30 m³',
      price: 950,
      deadline: '2024-01-21',
      status: 'disponible',
      description: 'Maquinaria pesada para industria',
      rating: 4.4,
      urgency: 'normal',
      vehicleType: 'Mega Tráiler',
      specialRequirements: ['Peso pesado', 'Especializado'],
      client: {
        name: 'Industrial Parts Co.',
        rating: 4.3,
        completedDeliveries: 12,
        phone: '+502 6789-0123',
        email: 'envios@industrialparts.com.gt'
      },
      distance: '100 km',
      estimatedTime: '4-6 horas',
      insurance: true,
      temperatureControl: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800 border-green-200';
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'reservado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'normal': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredCargo = availableCargo.filter(cargo => {
    const matchesSearch = cargo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cargo.status === statusFilter;
    const matchesPrice = cargo.price >= priceRange[0] && cargo.price <= priceRange[1];
    const matchesWeight = cargo.weight >= weightRange[0] && cargo.weight <= weightRange[1];
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'available' && cargo.status === 'disponible') ||
                      (activeTab === 'urgent' && cargo.status === 'urgente') ||
                      (activeTab === 'reserved' && cargo.status === 'reservado');
    
    return matchesSearch && matchesStatus && matchesPrice && matchesWeight && matchesTab;
  });

  const sortedCargo = [...filteredCargo].sort((a, b) => {
    switch (sortBy) {
      case 'price': return b.price - a.price;
      case 'weight': return b.weight - a.weight;
      case 'rating': return b.rating - a.rating;
      case 'date': return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default: return 0;
    }
  });

  const stats = [
    { 
      label: 'Cargas Disponibles', 
      value: availableCargo.filter(c => c.status === 'disponible').length, 
      icon: Package, 
      color: 'text-green-600',
      change: '+3',
      trend: 'up'
    },
    { 
      label: 'Cargas Urgentes', 
      value: availableCargo.filter(c => c.status === 'urgente').length, 
      icon: AlertTriangle, 
      color: 'text-red-600',
      change: '+1',
      trend: 'up'
    },
    { 
      label: 'Precio Promedio', 
      value: `Q${Math.round(availableCargo.reduce((sum, c) => sum + c.price, 0) / availableCargo.length)}`, 
      icon: Euro, 
      color: 'text-blue-600',
      change: '+5%',
      trend: 'up'
    },
    { 
      label: 'Calificación Promedio', 
      value: (availableCargo.reduce((sum, c) => sum + c.rating, 0) / availableCargo.length).toFixed(1), 
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
          <h1 className="text-3xl font-bold text-gray-900">Cargas Disponibles</h1>
          <p className="text-gray-600 mt-1">Encuentra cargas que coincidan con tus rutas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Ver Estadísticas
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Truck className="h-4 w-4 mr-2" />
            Mis Ofertas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-gray-200 hover:shadow-lg transition-all duration-200 group cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.label}</CardTitle>
                <div className="p-2 rounded-lg bg-gray-50 group-hover:scale-110 transition-transform duration-200">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span className="text-xs text-green-600">
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
            <Search className="h-5 w-5 mr-2 text-blue-500" />
            Buscar y Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cargas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="weight">Peso</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 hover:border-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Más Filtros
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Rango de Precio: Q{priceRange[0]} - Q{priceRange[1]}</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Rango de Peso: {weightRange[0]} - {weightRange[1]} kg</Label>
              <Slider
                value={weightRange}
                onValueChange={setWeightRange}
                max={2000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cargo Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({availableCargo.length})</TabsTrigger>
          <TabsTrigger value="available">Disponibles ({availableCargo.filter(c => c.status === 'disponible').length})</TabsTrigger>
          <TabsTrigger value="urgent">Urgentes ({availableCargo.filter(c => c.status === 'urgente').length})</TabsTrigger>
          <TabsTrigger value="reserved">Reservadas ({availableCargo.filter(c => c.status === 'reservado').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedCargo.map((cargo) => (
              <Card key={cargo.id} className="border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-900">{cargo.title}</CardTitle>
                        {cargo.urgency === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{cargo.origin} → {cargo.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{cargo.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(cargo.status)}>
                      {cargo.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{cargo.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Peso:</span>
                        <span className="text-sm font-medium">{cargo.weight} kg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Volumen:</span>
                        <span className="text-sm font-medium">{cargo.volume}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Distancia:</span>
                        <span className="text-sm font-medium">{cargo.distance}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Precio:</span>
                        <span className="text-lg font-bold text-blue-500">Q{cargo.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tiempo estimado:</span>
                        <span className="text-sm font-medium">{cargo.estimatedTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Vehículo:</span>
                        <span className="text-sm font-medium">{cargo.vehicleType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{cargo.client.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{cargo.client.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{cargo.client.completedDeliveries} entregas</span>
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

                  {/* Special Requirements */}
                  {cargo.specialRequirements.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Requisitos Especiales:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cargo.specialRequirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insurance and Temperature Control */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {cargo.insurance && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">Asegurado</span>
                          </div>
                        )}
                        {cargo.temperatureControl && (
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Temperatura controlada</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Guardar
                        </Button>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}