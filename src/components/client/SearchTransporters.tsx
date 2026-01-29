import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, MapPin, Truck, Phone, Mail, Search, Filter, Award, Clock, DollarSign, Users, CheckCircle, AlertCircle, Calendar, Shield, Zap, Navigation } from 'lucide-react';

export default function SearchTransporters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    vehicleType: '',
    rating: '',
    priceRange: '',
    verified: ''
  });
  const [selectedTransporter, setSelectedTransporter] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('grid');

  const transporters = [
    {
      id: 1,
      name: 'Carlos Méndez',
      company: 'Transportes Méndez GT',
      rating: 4.8,
      reviews: 127,
      vehicleType: 'Camión Refrigerado',
      capacity: '10 toneladas',
      routes: ['Ciudad de Guatemala-Antigua', 'Quetzaltenango-Huehuetenango'],
      price: 'Q 2.50/km',
      phone: '+502 1234-5678',
      email: 'carlos@transportesmendez.com',
      verified: true,
      experience: '8 años',
      completedJobs: 1247,
      responseTime: '2 horas',
      specialties: ['Perecederos', 'Frágil', 'Refrigerado'],
      certifications: ['ISO 9001', 'HACCP', 'Transporte Seguro'],
      insurance: 'Q 500,000',
      availability: '24/7',
      languages: ['Español', 'Inglés'],
      location: 'Ciudad de Guatemala',
      description: 'Especialistas en transporte de productos perecederos y carga frágil. Flota moderna con GPS y control de temperatura.',
      recentReviews: [
        { user: 'María L.', rating: 5, comment: 'Excelente servicio, muy puntual' },
        { user: 'Juan P.', rating: 4, comment: 'Buen precio y cuidado de la carga' }
      ]
    },
    {
      id: 2,
      name: 'Ana Rodríguez',
      company: 'LogiExpress Guatemala',
      rating: 4.9,
      reviews: 89,
      vehicleType: 'Furgón Cerrado',
      capacity: '3 toneladas',
      routes: ['Escuintla-Retalhuleu', 'Chimaltenango-Sacatepéquez'],
      price: 'Q 1.80/km',
      phone: '+502 2345-6789',
      email: 'ana@logiexpress.com',
      verified: true,
      experience: '5 años',
      completedJobs: 892,
      responseTime: '1 hora',
      specialties: ['Carga General', 'Documentos', 'Pequeños Envíos'],
      certifications: ['ISO 9001', 'Buenas Prácticas'],
      insurance: 'Q 200,000',
      availability: 'Lun-Vie 8AM-6PM',
      languages: ['Español'],
      location: 'Escuintla',
      description: 'Servicio rápido y confiable para envíos pequeños y medianos. Especialistas en entrega puerta a puerta.',
      recentReviews: [
        { user: 'Pedro M.', rating: 5, comment: 'Muy profesional y rápida' },
        { user: 'Carmen S.', rating: 5, comment: 'Excelente comunicación' }
      ]
    },
    {
      id: 3,
      name: 'Roberto Morales',
      company: 'Cargo Seguro GT',
      rating: 4.7,
      reviews: 203,
      vehicleType: 'Camión Plataforma',
      capacity: '15 toneladas',
      routes: ['Petén-Alta Verapaz', 'Izabal-Zacapa'],
      price: 'Q 3.20/km',
      phone: '+502 3456-7890',
      email: 'roberto@cargoseguro.com',
      verified: true,
      experience: '12 años',
      completedJobs: 2156,
      responseTime: '4 horas',
      specialties: ['Carga Pesada', 'Maquinaria', 'Construcción'],
      certifications: ['ISO 9001', 'Transporte Pesado', 'Seguridad Industrial'],
      insurance: 'Q 1,000,000',
      availability: 'Lun-Sáb 6AM-8PM',
      languages: ['Español', 'Inglés'],
      location: 'Petén',
      description: 'Especialistas en transporte de carga pesada y maquinaria. Equipo especializado para proyectos industriales.',
      recentReviews: [
        { user: 'Ing. Luis F.', rating: 4, comment: 'Muy profesional con maquinaria pesada' },
        { user: 'Constructora ABC', rating: 5, comment: 'Excelente para proyectos grandes' }
      ]
    },
    {
      id: 4,
      name: 'Sofia Herrera',
      company: 'Express Delivery GT',
      rating: 4.6,
      reviews: 156,
      vehicleType: 'Pickup',
      capacity: '1 tonelada',
      routes: ['Ciudad de Guatemala-Zona 1', 'Mixco-San Cristóbal'],
      price: 'Q 1.20/km',
      phone: '+502 4567-8901',
      email: 'sofia@expressdelivery.com',
      verified: false,
      experience: '3 años',
      completedJobs: 567,
      responseTime: '30 minutos',
      specialties: ['Mensajería', 'Pequeños Paquetes', 'Urgente'],
      certifications: ['Buenas Prácticas'],
      insurance: 'Q 50,000',
      availability: 'Lun-Dom 7AM-10PM',
      languages: ['Español'],
      location: 'Mixco',
      description: 'Servicio de mensajería rápida y confiable. Especialistas en entregas urgentes y pequeños paquetes.',
      recentReviews: [
        { user: 'Carlos R.', rating: 4, comment: 'Muy rápida para entregas urgentes' },
        { user: 'María E.', rating: 5, comment: 'Excelente para documentos' }
      ]
    },
    {
      id: 5,
      name: 'Miguel Torres',
      company: 'Transportes Torres',
      rating: 4.5,
      reviews: 98,
      vehicleType: 'Camión Cisterna',
      capacity: '20,000 litros',
      routes: ['Puerto Barrios-Ciudad de Guatemala', 'Puerto San José-Escuintla'],
      price: 'Q 4.50/km',
      phone: '+502 5678-9012',
      email: 'miguel@transportestorres.com',
      verified: true,
      experience: '15 años',
      completedJobs: 3421,
      responseTime: '6 horas',
      specialties: ['Líquidos', 'Combustibles', 'Químicos'],
      certifications: ['ISO 9001', 'Transporte de Líquidos', 'Seguridad Química'],
      insurance: 'Q 2,000,000',
      availability: '24/7',
      languages: ['Español', 'Inglés'],
      location: 'Puerto Barrios',
      description: 'Especialistas en transporte de líquidos y combustibles. Flota de cisternas certificadas para productos químicos.',
      recentReviews: [
        { user: 'Gasolinera Central', rating: 4, comment: 'Muy confiable para combustibles' },
        { user: 'Química GT', rating: 5, comment: 'Excelente para productos químicos' }
      ]
    }
  ];

  // Filter transporters based on search and filters
  const filteredTransporters = transporters.filter(transporter => {
    const matchesSearch = transporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transporter.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transporter.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesOrigin = !filters.origin || transporter.routes.some(route => route.toLowerCase().includes(filters.origin.toLowerCase()));
    const matchesDestination = !filters.destination || transporter.routes.some(route => route.toLowerCase().includes(filters.destination.toLowerCase()));
    const matchesVehicle = !filters.vehicleType || transporter.vehicleType.toLowerCase().includes(filters.vehicleType.toLowerCase());
    const matchesRating = !filters.rating || transporter.rating >= parseFloat(filters.rating);
    const matchesVerified = !filters.verified || (filters.verified === 'verified' && transporter.verified) || (filters.verified === 'unverified' && !transporter.verified);
    
    return matchesSearch && matchesOrigin && matchesDestination && matchesVehicle && matchesRating && matchesVerified;
  });

  // KPI calculations
  const totalTransporters = transporters.length;
  const verifiedTransporters = transporters.filter(t => t.verified).length;
  const avgRating = transporters.reduce((sum, t) => sum + t.rating, 0) / transporters.length;
  const totalExperience = transporters.reduce((sum, t) => sum + parseInt(t.experience.split(' ')[0]), 0);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleViewTransporter = (transporter: any) => {
    setSelectedTransporter(transporter);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Buscar Transportistas</h1>
        <p className="text-blue-600">Encuentra el transportista perfecto para tu carga en Guatemala</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Transportistas</p>
                <p className="text-2xl font-bold text-blue-800">{totalTransporters}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Verificados</p>
                <p className="text-2xl font-bold text-green-800">{verifiedTransporters}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Rating Promedio</p>
                <p className="text-2xl font-bold text-purple-800">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Años Experiencia</p>
                <p className="text-2xl font-bold text-orange-800">{totalExperience}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avanzados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder="Buscar transportista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-blue-200 focus:border-blue-500 bg-white/70"
              />
            </div>
            <Input
              placeholder="Origen"
              value={filters.origin}
              onChange={(e) => setFilters({...filters, origin: e.target.value})}
              className="border-2 border-blue-200 focus:border-blue-500 bg-white/70"
            />
            <Input
              placeholder="Destino"
              value={filters.destination}
              onChange={(e) => setFilters({...filters, destination: e.target.value})}
              className="border-2 border-blue-200 focus:border-blue-500 bg-white/70"
            />
            <Select value={filters.vehicleType} onValueChange={(value) => setFilters({...filters, vehicleType: value})}>
              <SelectTrigger className="border-2 border-blue-200 bg-white/70">
                <SelectValue placeholder="Tipo de vehículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Camión">Camión</SelectItem>
                <SelectItem value="Furgón">Furgón</SelectItem>
                <SelectItem value="Pickup">Pickup</SelectItem>
                <SelectItem value="Cisterna">Cisterna</SelectItem>
                <SelectItem value="Plataforma">Plataforma</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.rating} onValueChange={(value) => setFilters({...filters, rating: value})}>
              <SelectTrigger className="border-2 border-blue-200 bg-white/70">
                <SelectValue placeholder="Rating mínimo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                <SelectItem value="4.0">4.0+ estrellas</SelectItem>
                <SelectItem value="3.5">3.5+ estrellas</SelectItem>
                <SelectItem value="3.0">3.0+ estrellas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.verified} onValueChange={(value) => setFilters({...filters, verified: value})}>
              <SelectTrigger className="border-2 border-blue-200 bg-white/70">
                <SelectValue placeholder="Estado verificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Solo verificados</SelectItem>
                <SelectItem value="unverified">No verificados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle and Content */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-blue-600 font-medium">
          {filteredTransporters.length} transportistas encontrados
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-end mb-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border-2 border-blue-200">
            <TabsTrigger value="grid" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Vista de Tarjetas</TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Vista de Lista</TabsTrigger>
          </TabsList>
        </div>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-6">
        <div className="grid gap-6">
          {filteredTransporters.map((transporter) => (
            <Card key={transporter.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-blue-200">
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800 text-lg font-bold">
                        {transporter.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-blue-800">{transporter.name}</h3>
                        {transporter.verified && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium">{transporter.company}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {renderStars(transporter.rating)}
                        <span className="text-sm text-blue-600 ml-2">
                          {transporter.rating} ({transporter.reviews} reseñas)
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-blue-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {transporter.experience} experiencia
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {transporter.completedJobs} trabajos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-800">{transporter.price}</p>
                    <p className="text-sm text-blue-600">por kilómetro</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                      {transporter.responseTime} respuesta
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-blue-600">Vehículo</p>
                      <p className="font-semibold text-blue-800">{transporter.vehicleType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-blue-600">Teléfono</p>
                      <p className="font-semibold text-blue-800">{transporter.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-blue-600">Email</p>
                      <p className="font-semibold text-blue-800">{transporter.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Especialidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {transporter.specialties.map((specialty, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Rutas frecuentes:</p>
                  <div className="flex flex-wrap gap-2">
                    {transporter.routes.map((route, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1 border-blue-300 text-blue-700">
                        <MapPin className="h-3 w-3" />
                        <span>{route}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                        onClick={() => handleViewTransporter(transporter)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {transporter.name} - {transporter.company}
                        </DialogTitle>
                        <DialogDescription className="text-blue-600">
                          Información detallada del transportista y sus servicios
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <Card className="border-2 border-blue-200 bg-blue-50/30">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                              <Truck className="h-5 w-5" />
                              Información Básica
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-blue-600">Nombre</p>
                                <p className="font-semibold text-blue-800">{transporter.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Empresa</p>
                                <p className="font-semibold text-blue-800">{transporter.company}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Vehículo</p>
                                <p className="font-semibold text-blue-800">{transporter.vehicleType}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Capacidad</p>
                                <p className="font-semibold text-blue-800">{transporter.capacity}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Precio</p>
                                <p className="font-semibold text-blue-800">{transporter.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Experiencia</p>
                                <p className="font-semibold text-blue-800">{transporter.experience}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="border-2 border-blue-200 bg-blue-50/30">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                              <Phone className="h-5 w-5" />
                              Información de Contacto
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-blue-600">Teléfono</p>
                                <p className="font-semibold text-blue-800">{transporter.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Email</p>
                                <p className="font-semibold text-blue-800">{transporter.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Ubicación</p>
                                <p className="font-semibold text-blue-800">{transporter.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">Disponibilidad</p>
                                <p className="font-semibold text-blue-800">{transporter.availability}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Specialties and Certifications */}
                        <Card className="border-2 border-blue-200 bg-blue-50/30">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                              <Award className="h-5 w-5" />
                              Especialidades y Certificaciones
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm text-blue-600 mb-2">Especialidades</p>
                              <div className="flex flex-wrap gap-2">
                                {transporter.specialties.map((specialty, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 mb-2">Certificaciones</p>
                              <div className="flex flex-wrap gap-2">
                                {transporter.certifications.map((cert, index) => (
                                  <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Routes and Reviews */}
                        <Card className="border-2 border-blue-200 bg-blue-50/30">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              Rutas y Reseñas
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm text-blue-600 mb-2">Rutas Frecuentes</p>
                              <div className="flex flex-wrap gap-2">
                                {transporter.routes.map((route, index) => (
                                  <Badge key={index} variant="outline" className="border-blue-300 text-blue-700">
                                    {route}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 mb-2">Reseñas Recientes</p>
                              <div className="space-y-2">
                                {transporter.recentReviews.map((review, index) => (
                                  <div key={index} className="border border-blue-200 rounded-lg p-3 bg-white/70">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="font-medium text-blue-800">{review.user}</p>
                                      <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                    <p className="text-sm text-blue-600">{review.comment}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-4 justify-end">
                          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </Button>
                          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </Button>
                          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Solicitar Cotización
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Cotizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* List View */}
      <TabsContent value="list" className="mt-6">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-0">
            <div className="rounded-xl border-2 border-blue-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <TableRow>
                    <TableHead className="text-blue-800 font-semibold">Transportista</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Vehículo</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Rating</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Precio</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Experiencia</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Estado</TableHead>
                    <TableHead className="text-blue-800 font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransporters.map((transporter) => (
                    <TableRow key={transporter.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {transporter.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-blue-800">{transporter.name}</p>
                            <p className="text-sm text-blue-600">{transporter.company}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-blue-800">{transporter.vehicleType}</p>
                          <p className="text-sm text-blue-600">{transporter.capacity}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(transporter.rating)}
                          <span className="text-sm text-blue-600 ml-1">{transporter.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-blue-800">{transporter.price}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-blue-700">{transporter.experience}</p>
                      </TableCell>
                      <TableCell>
                        {transporter.verified ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() => handleViewTransporter(transporter)}
                              >
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {transporter.name} - {transporter.company}
                                </DialogTitle>
                                <DialogDescription className="text-blue-600">
                                  Información detallada del transportista y sus servicios
                                </DialogDescription>
                              </DialogHeader>
                              {/* Same detailed content as in grid view */}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Cotizar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {filteredTransporters.length === 0 && (
        <div className="text-center py-12">
          <Truck className="mx-auto h-16 w-16 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">No se encontraron transportistas</h3>
          <p className="text-blue-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
        </Tabs>
    </div>
  );
}