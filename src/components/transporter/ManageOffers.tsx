import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Euro, 
  MapPin, 
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Edit,
  AlertTriangle,
  Calendar,
  Truck,
  Zap,
  Eye,
  Send,
  DollarSign,
  Percent
} from 'lucide-react';

export default function ManageOffers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('sent');

  const offers = [
    {
      id: 'O001',
      type: 'sent',
      cargo: 'Electrodomésticos',
      origin: 'Ciudad de Guatemala',
      destination: 'Quetzaltenango',
      price: 650,
      proposedPrice: 620,
      status: 'pending',
      client: {
        name: 'Distribuidora Maya',
        rating: 4.9,
        completedDeliveries: 45,
        phone: '+502 1234-5678',
        email: 'contacto@distribuidoramaya.com'
      },
      date: '2024-01-15',
      deadline: '2024-01-20',
      weight: 850,
      volume: '12 m³',
      vehicleType: 'Camión Rígido',
      description: 'Lavadoras y refrigeradores para tienda',
      urgency: 'normal',
      distance: '225 km',
      estimatedTime: '6-8 horas',
      insurance: true,
      temperatureControl: false,
      message: 'Ofrezco un precio competitivo con entrega garantizada en el plazo establecido.'
    },
    {
      id: 'O002',
      type: 'received',
      cargo: 'Material de Construcción',
      origin: 'Escuintla',
      destination: 'Retalhuleu',
      price: 480,
      proposedPrice: 520,
      status: 'accepted',
      client: {
        name: 'Constructora Nacional',
        rating: 4.7,
        completedDeliveries: 23,
        phone: '+502 2345-6789',
        email: 'envios@constructora.com.gt'
      },
      date: '2024-01-14',
      deadline: '2024-01-22',
      weight: 1200,
      volume: '8 m³',
      vehicleType: 'Tráiler',
      description: 'Cemento y materiales varios',
      urgency: 'high',
      distance: '180 km',
      estimatedTime: '5-6 horas',
      insurance: false,
      temperatureControl: false,
      message: 'Acepto el trabajo con las condiciones especificadas.'
    },
    {
      id: 'O003',
      type: 'sent',
      cargo: 'Productos Textiles',
      origin: 'Chimaltenango',
      destination: 'Sacatepéquez',
      price: 420,
      proposedPrice: 400,
      status: 'rejected',
      client: {
        name: 'Textiles Centroamericanos',
        rating: 4.8,
        completedDeliveries: 67,
        phone: '+502 3456-7890',
        email: 'logistica@textilesca.com.gt'
      },
      date: '2024-01-13',
      deadline: '2024-01-25',
      weight: 300,
      volume: '25 m³',
      vehicleType: 'Furgoneta',
      description: 'Ropa y accesorios de temporada',
      urgency: 'normal',
      distance: '40 km',
      estimatedTime: '1-2 horas',
      insurance: true,
      temperatureControl: false,
      message: 'Precio reducido por volumen y frecuencia de trabajo.'
    },
    {
      id: 'O004',
      type: 'received',
      cargo: 'Equipos Informáticos',
      origin: 'Cobán',
      destination: 'Puerto Barrios',
      price: 380,
      proposedPrice: 410,
      status: 'negotiating',
      client: {
        name: 'IT Solutions GT',
        rating: 4.6,
        completedDeliveries: 34,
        phone: '+502 4567-8901',
        email: 'info@itsolutions.com.gt'
      },
      date: '2024-01-12',
      deadline: '2024-01-18',
      weight: 450,
      volume: '6 m³',
      vehicleType: 'Camión Rígido',
      description: 'Ordenadores y servidores',
      urgency: 'high',
      distance: '320 km',
      estimatedTime: '4-5 horas',
      insurance: true,
      temperatureControl: true,
      message: 'Propongo un precio ligeramente superior por el manejo especial requerido.'
    },
    {
      id: 'O005',
      type: 'sent',
      cargo: 'Productos Alimentarios',
      origin: 'Petén',
      destination: 'Alta Verapaz',
      price: 720,
      proposedPrice: 680,
      status: 'pending',
      client: {
        name: 'Alimentos del Norte',
        rating: 4.5,
        completedDeliveries: 89,
        phone: '+502 5678-9012',
        email: 'contacto@alimentosnorte.com.gt'
      },
      date: '2024-01-11',
      deadline: '2024-01-19',
      weight: 800,
      volume: '15 m³',
      vehicleType: 'Camión Refrigerado',
      description: 'Productos frescos y congelados',
      urgency: 'normal',
      distance: '150 km',
      estimatedTime: '2-3 horas',
      insurance: true,
      temperatureControl: true,
      message: 'Ofrezco descuento por la corta distancia y disponibilidad inmediata.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'negotiating': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'negotiating': return <MessageCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    const matchesPrice = offer.proposedPrice >= priceRange[0] && offer.proposedPrice <= priceRange[1];
    const matchesTab = activeTab === 'sent' ? offer.type === 'sent' : offer.type === 'received';
    
    return matchesSearch && matchesStatus && matchesPrice && matchesTab;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'price': return b.proposedPrice - a.proposedPrice;
      case 'date': return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'status': return a.status.localeCompare(b.status);
      default: return 0;
    }
  });

  const stats = [
    { 
      label: 'Ofertas Enviadas', 
      value: offers.filter(o => o.type === 'sent').length, 
      icon: Send, 
      color: 'text-blue-600',
      change: '+2',
      trend: 'up'
    },
    { 
      label: 'Ofertas Recibidas', 
      value: offers.filter(o => o.type === 'received').length, 
      icon: FileText, 
      color: 'text-blue-600',
      change: '+1',
      trend: 'up'
    },
    { 
      label: 'Aceptadas', 
      value: offers.filter(o => o.status === 'accepted').length, 
      icon: CheckCircle, 
      color: 'text-blue-600',
      change: '+3',
      trend: 'up'
    },
    { 
      label: 'En Negociación', 
      value: offers.filter(o => o.status === 'negotiating').length, 
      icon: MessageCircle, 
      color: 'text-yellow-600',
      change: '+1',
      trend: 'up'
    }
  ];

  const handleOfferAction = (offerId: string, action: string) => {
    console.log(`Offer ${offerId}: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ofertas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus ofertas enviadas y recibidas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Ver Estadísticas
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Send className="h-4 w-4 mr-2" />
            Nueva Oferta
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
                    <ArrowUpRight className="h-3 w-3 mr-1 text-blue-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span className="text-xs text-blue-600">
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
                placeholder="Buscar ofertas..."
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
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="accepted">Aceptada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="negotiating">En negociación</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 hover:border-[blue-500]">
              <Filter className="h-4 w-4 mr-2" />
              Más Filtros
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Rango de Precio: Q{priceRange[0]} - Q{priceRange[1]}</Label>
            <div className="flex space-x-4">
              <Input
                type="number"
                placeholder="Mín"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-24 border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]"
              />
              <Input
                type="number"
                placeholder="Máx"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-24 border-gray-300 focus:border-[blue-500] focus:ring-[blue-500]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offers Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent">Enviadas ({offers.filter(o => o.type === 'sent').length})</TabsTrigger>
          <TabsTrigger value="received">Recibidas ({offers.filter(o => o.type === 'received').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedOffers.map((offer) => (
              <Card key={offer.id} className="border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-900">{offer.cargo}</CardTitle>
                        {offer.urgency === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{offer.origin} → {offer.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{offer.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(offer.status)}
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status === 'pending' ? 'Pendiente' :
                         offer.status === 'accepted' ? 'Aceptada' :
                         offer.status === 'rejected' ? 'Rechazada' :
                         'Negociando'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{offer.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Peso:</span>
                        <span className="text-sm font-medium">{offer.weight} kg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Volumen:</span>
                        <span className="text-sm font-medium">{offer.volume}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Distancia:</span>
                        <span className="text-sm font-medium">{offer.distance}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Precio original:</span>
                        <span className="text-sm font-medium line-through text-gray-500">Q{offer.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Precio propuesto:</span>
                        <span className="text-lg font-bold text-[blue-500]">Q{offer.proposedPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Diferencia:</span>
                        <span className={`text-sm font-medium ${offer.proposedPrice > offer.price ? 'text-red-600' : 'text-blue-600'}`}>
                          {offer.proposedPrice > offer.price ? '+' : ''}Q{offer.proposedPrice - offer.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{offer.client.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{offer.client.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{offer.client.completedDeliveries} entregas</span>
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

                  {/* Message */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Mensaje:</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {offer.message}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                        {offer.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Modificar
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {offer.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleOfferAction(offer.id, 'cancel')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {offer.type === 'received' && offer.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleOfferAction(offer.id, 'accept')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aceptar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleOfferAction(offer.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleOfferAction(offer.id, 'negotiate')}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Negociar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedOffers.length === 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No se encontraron ofertas que coincidan con los filtros aplicados</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
