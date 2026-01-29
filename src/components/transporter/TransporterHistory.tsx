import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  History, 
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
  Calendar,
  MapPin,
  BarChart3,
  Activity,
  Target,
  Award,
  Users as UsersIcon,
  Clock as ClockIcon,
  Download,
  FileText,
  AlertTriangle,
  Route,
  Fuel,
  Thermometer,
  Shield
} from 'lucide-react';

export default function TransporterHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('history');

  const deliveryHistory = [
    {
      id: 'H001',
      cargo: 'Electrodomésticos',
      origin: 'Ciudad de Guatemala',
      destination: 'Quetzaltenango',
      status: 'completado',
      client: {
        name: 'Distribuidora Maya',
        rating: 4.9,
        phone: '+502 1234-5678',
        email: 'contacto@distribuidoramaya.com'
      },
      startDate: '2024-01-15',
      completionDate: '2024-01-16 14:30',
      deliveryTime: '30.5 horas',
      distance: '225 km',
      weight: '850 kg',
      volume: '12 m³',
      price: 'Q650',
      rating: 5,
      feedback: 'Excelente servicio, entrega puntual y en perfectas condiciones.',
      earnings: 'Q650',
      fuelCost: 'Q85',
      netEarnings: 'Q565',
      vehicleType: 'Camión Rígido',
      insurance: true,
      temperatureControl: false,
      onTime: true,
      specialRequirements: ['Frágil', 'Asegurado']
    },
    {
      id: 'H002',
      cargo: 'Material de Construcción',
      origin: 'Ciudad de Guatemala',
      destination: 'Zacapa',
      status: 'completado',
      client: {
        name: 'ConstruPro Guatemala',
        rating: 4.7,
        phone: '+502 9876-5432',
        email: 'info@construproguatemala.com'
      },
      startDate: '2024-01-14',
      completionDate: '2024-01-15 10:00',
      deliveryTime: '26 horas',
      distance: '150 km',
      weight: '1200 kg',
      volume: '8 m³',
      price: 'Q480',
      rating: 4,
      feedback: 'Buen servicio, pero llegó 30 minutos tarde.',
      earnings: 'Q480',
      fuelCost: 'Q65',
      netEarnings: 'Q415',
      vehicleType: 'Tráiler',
      insurance: false,
      temperatureControl: false,
      onTime: false,
      specialRequirements: ['Peso pesado']
    },
    {
      id: 'H003',
      cargo: 'Productos Textiles',
      origin: 'Ciudad de Guatemala',
      destination: 'Huehuetenango',
      status: 'completado',
      client: {
        name: 'Express Fashion',
        rating: 4.8,
        phone: '+502 1122-3344',
        email: 'ventas@expressfashion.com'
      },
      startDate: '2024-01-13',
      completionDate: '2024-01-13 16:30',
      deliveryTime: '8.5 horas',
      distance: '180 km',
      weight: '300 kg',
      volume: '25 m³',
      price: 'Q420',
      rating: 5,
      feedback: 'Servicio excepcional, muy profesional.',
      earnings: 'Q420',
      fuelCost: 'Q45',
      netEarnings: 'Q375',
      vehicleType: 'Furgoneta',
      insurance: true,
      temperatureControl: false,
      onTime: true,
      specialRequirements: ['Seco', 'Ventilado']
    },
    {
      id: 'H004',
      cargo: 'Equipos Informáticos',
      origin: 'Ciudad de Guatemala',
      destination: 'Ciudad de Guatemala',
      status: 'completado',
      client: {
        name: 'IT Solutions Pro',
        rating: 4.6,
        phone: '+502 5566-7788',
        email: 'info@itsolutions.com'
      },
      startDate: '2024-01-12',
      completionDate: '2024-01-12 15:45',
      deliveryTime: '7.75 horas',
      distance: '100 km',
      weight: '450 kg',
      volume: '6 m³',
      price: 'Q380',
      rating: 4,
      feedback: 'Buen servicio, pero llegó 15 minutos tarde.',
      earnings: 'Q380',
      fuelCost: 'Q52',
      netEarnings: 'Q328',
      vehicleType: 'Camión Rígido',
      insurance: true,
      temperatureControl: true,
      onTime: false,
      specialRequirements: ['Frágil', 'Asegurado', 'Temperatura controlada']
    },
    {
      id: 'H005',
      cargo: 'Productos Alimentarios',
      origin: 'Ciudad de Guatemala',
      destination: 'Ciudad de Guatemala',
      status: 'completado',
      client: {
        name: 'FreshFood Express',
        rating: 4.5,
        phone: '+502 9900-1122',
        email: 'ventas@freshfood.com'
      },
      startDate: '2024-01-11',
      completionDate: '2024-01-11 10:30',
      deliveryTime: '2.5 horas',
      distance: '50 km',
      weight: '800 kg',
      volume: '15 m³',
      price: 'Q720',
      rating: 5,
      feedback: 'Entrega perfecta, productos en excelente estado.',
      earnings: 'Q720',
      fuelCost: 'Q15',
      netEarnings: 'Q705',
      vehicleType: 'Camión Refrigerado',
      insurance: true,
      temperatureControl: true,
      onTime: true,
      specialRequirements: ['Refrigerado', 'Fresco']
    },
    {
      id: 'H006',
      cargo: 'Maquinaria Industrial',
      origin: 'Ciudad de Guatemala',
      destination: 'Ciudad de Guatemala',
      status: 'completado',
      client: {
        name: 'Industrial Parts Co.',
        rating: 4.3,
        phone: '+502 1111-2222',
        email: 'info@industrialparts.com'
      },
      startDate: '2024-01-10',
      completionDate: '2024-01-11 12:00',
      deliveryTime: '28 horas',
      distance: '150 km',
      weight: '1800 kg',
      volume: '30 m³',
      price: 'Q950',
      rating: 4,
      feedback: 'Llegó un día tarde pero en perfecto estado.',
      earnings: 'Q950',
      fuelCost: 'Q120',
      netEarnings: 'Q830',
      vehicleType: 'Mega Tráiler',
      insurance: true,
      temperatureControl: false,
      onTime: false,
      specialRequirements: ['Peso pesado', 'Especializado']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completado': return <CheckCircle className="h-4 w-4" />;
      case 'cancelado': return <AlertTriangle className="h-4 w-4" />;
      case 'retrasado': return <Clock className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const filteredHistory = deliveryHistory.filter(delivery => {
    const matchesSearch = delivery.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || delivery.startDate.startsWith(monthFilter);
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date': return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'price': return Number(b.price.replace('Q', '')) - Number(a.price.replace('Q', ''));
      case 'rating': return b.rating - a.rating;
      case 'earnings': return Number(b.netEarnings.replace('Q', '')) - Number(a.netEarnings.replace('Q', ''));
      default: return 0;
    }
  });

  const stats = [
    { 
      title: 'Total Entregas', 
      value: deliveryHistory.length.toString(), 
      change: '+5', 
      changeType: 'positive',
      icon: Truck, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up',
      description: 'Este mes'
    },
    { 
      title: 'Ganancias Netas', 
      value: 'Q2,388', 
      change: '+12%', 
      changeType: 'positive',
      icon: Euro, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up',
      description: 'Este mes'
    },
    { 
      title: 'Calificación Promedio', 
      value: (deliveryHistory.reduce((sum, d) => sum + d.rating, 0) / deliveryHistory.length).toFixed(1), 
      icon: Star, 
      color: 'text-yellow-600',
      change: '+0.2',
      trend: 'up'
    },
    { 
      title: 'A Tiempo', 
      value: `${Math.round((deliveryHistory.filter(d => d.onTime).length / deliveryHistory.length) * 100)}%`, 
      icon: CheckCircle, 
      color: 'text-blue-600',
      change: '+5%',
      trend: 'up'
    }
  ];

  const monthlyStats = [
    { month: 'Enero 2024', deliveries: 6, earnings: 3218, rating: 4.5 },
    { month: 'Diciembre 2023', deliveries: 8, earnings: 2850, rating: 4.3 },
    { month: 'Noviembre 2023', deliveries: 7, earnings: 2950, rating: 4.4 },
    { month: 'Octubre 2023', deliveries: 9, earnings: 3100, rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial de Entregas</h1>
          <p className="text-gray-600 mt-1">Revisa tu historial completo de entregas y rendimiento</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[blue-500] text-[blue-500] hover:bg-[blue-500] hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-[blue-500] hover:bg-[blue-600]">
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
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
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="retrasado">Retrasado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                <SelectItem value="2024-01">Enero 2024</SelectItem>
                <SelectItem value="2023-12">Diciembre 2023</SelectItem>
                <SelectItem value="2023-11">Noviembre 2023</SelectItem>
                <SelectItem value="2023-10">Octubre 2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
                <SelectItem value="earnings">Ganancias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Historial ({deliveryHistory.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedHistory.map((delivery) => (
              <Card key={delivery.id} className="border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-900">{delivery.cargo}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Completado
                        </Badge>
                        {delivery.onTime ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            A tiempo
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            Retrasado
                          </Badge>
                        )}
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Vehículo:</span>
                        <span className="font-medium">{delivery.vehicleType}</span>
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Costos:</span>
                        <span className="font-medium text-red-600">-{delivery.fuelCost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  {delivery.specialRequirements.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Requisitos Especiales:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {delivery.specialRequirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insurance and Temperature Control */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4">
                      {delivery.insurance && (
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Asegurado</span>
                        </div>
                      )}
                      {delivery.temperatureControl && (
                        <div className="flex items-center space-x-1">
                          <Thermometer className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Temperatura controlada</span>
                        </div>
                      )}
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
                  Rendimiento Mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{stat.month}</p>
                        <p className="text-sm text-gray-600">{stat.deliveries} entregas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">Q{stat.earnings}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{stat.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      <p className="font-medium text-yellow-900">Transportista Experto</p>
                      <p className="text-sm text-yellow-700">Completaste 100+ entregas exitosas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Excelente Calificación</p>
                      <p className="text-sm text-blue-700">Mantienes 4.5+ estrellas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Puntualidad</p>
                      <p className="text-sm text-blue-700">85% de entregas a tiempo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[blue-500]" />
                  Generar Reportes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Reporte Mensual (PDF)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Reporte de Ganancias (Excel)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Reporte de Rendimiento (PDF)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Historial Completo (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-[blue-500]" />
                  Métricas Clave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entregas este mes</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ganancias promedio</span>
                    <span className="font-medium">Q536</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Distancia promedio</span>
                    <span className="font-medium">357 km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tiempo promedio</span>
                    <span className="font-medium">17.2 horas</span>
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
