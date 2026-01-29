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
import { FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download, Eye, MessageCircle, Phone, Star, MapPin, Calendar, Receipt, CreditCard, Banknote, TrendingUp, TrendingDown, Printer, Share2, Archive } from 'lucide-react';

export default function Facturas() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const invoices = [
    {
      id: 'F001',
      invoiceNumber: 'INV-2024-001',
      shipmentId: 'S001',
      cargoType: 'Electrónicos',
      origin: 'Ciudad de Guatemala',
      destination: 'Antigua Guatemala',
      amount: 'Q 2,300',
      tax: 'Q 230',
      total: 'Q 2,530',
      status: 'Pagada',
      dueDate: '2024-01-20',
      paidDate: '2024-01-18',
      paymentMethod: 'Tarjeta de Crédito',
      transporter: 'Transportes Rápidos GT',
      driver: 'Carlos Méndez',
      phone: '+502 1234-5678',
      rating: 4.8,
      reviews: 127,
      description: 'Carga de dispositivos electrónicos que requiere manejo especial y temperatura controlada.',
      items: [
        { description: 'Servicio de transporte', quantity: 1, unitPrice: 'Q 2,000', total: 'Q 2,000' },
        { description: 'Seguro de carga', quantity: 1, unitPrice: 'Q 200', total: 'Q 200' },
        { description: 'Manejo especial', quantity: 1, unitPrice: 'Q 100', total: 'Q 100' }
      ],
      specialRequirements: ['Manejo cuidadoso', 'Temperatura controlada', 'Entrega programada'],
      documents: ['Factura comercial', 'Certificado de origen', 'Seguro de carga'],
      notes: 'Pago realizado antes de la fecha de vencimiento. Servicio excelente.',
      createdAt: '2024-01-15 14:30',
      weight: '500 kg',
      distance: '45 km',
      vehicle: 'Camión Refrigerado'
    },
    {
      id: 'F002',
      invoiceNumber: 'INV-2024-002',
      shipmentId: 'S002',
      cargoType: 'Cristalería',
      origin: 'Quetzaltenango',
      destination: 'Huehuetenango',
      amount: 'Q 1,650',
      tax: 'Q 165',
      total: 'Q 1,815',
      status: 'Pendiente',
      dueDate: '2024-01-25',
      paidDate: null,
      paymentMethod: null,
      transporter: 'Logística Maya',
      driver: 'Ana Rodríguez',
      phone: '+502 2345-6789',
      rating: 4.9,
      reviews: 89,
      description: 'Carga de cristalería fina que requiere embalaje especial y transporte sin vibraciones.',
      items: [
        { description: 'Servicio de transporte', quantity: 1, unitPrice: 'Q 1,400', total: 'Q 1,400' },
        { description: 'Embalaje especial', quantity: 1, unitPrice: 'Q 150', total: 'Q 150' },
        { description: 'Seguro de fragilidad', quantity: 1, unitPrice: 'Q 100', total: 'Q 100' }
      ],
      specialRequirements: ['Sin vibraciones', 'Embalaje especial', 'Ruta pavimentada'],
      documents: ['Factura comercial', 'Certificado de fragilidad'],
      notes: 'Pendiente de pago. Recordatorio enviado.',
      createdAt: '2024-01-14 13:00',
      weight: '200 kg',
      distance: '120 km',
      vehicle: 'Furgón Cerrado'
    },
    {
      id: 'F003',
      invoiceNumber: 'INV-2024-003',
      shipmentId: 'S003',
      cargoType: 'Productos Agrícolas',
      origin: 'Escuintla',
      destination: 'Retalhuleu',
      amount: 'Q 4,500',
      tax: 'Q 450',
      total: 'Q 4,950',
      status: 'Vencida',
      dueDate: '2024-01-10',
      paidDate: null,
      paymentMethod: null,
      transporter: 'Cargo Express',
      driver: 'Roberto Morales',
      phone: '+502 3456-7890',
      rating: 4.6,
      reviews: 203,
      description: 'Carga de productos agrícolas perecederos que requiere refrigeración constante.',
      items: [
        { description: 'Servicio de transporte', quantity: 1, unitPrice: 'Q 3,800', total: 'Q 3,800' },
        { description: 'Refrigeración especial', quantity: 1, unitPrice: 'Q 500', total: 'Q 500' },
        { description: 'Seguro de carga', quantity: 1, unitPrice: 'Q 200', total: 'Q 200' }
      ],
      specialRequirements: ['Refrigeración constante', 'Entrega rápida'],
      documents: ['Certificado fitosanitario', 'Factura comercial'],
      notes: 'Factura vencida. Se aplicarán cargos por mora.',
      createdAt: '2024-01-13 15:00',
      weight: '1,000 kg',
      distance: '85 km',
      vehicle: 'Camión Refrigerado'
    },
    {
      id: 'F004',
      invoiceNumber: 'INV-2024-004',
      shipmentId: 'S004',
      cargoType: 'Textiles',
      origin: 'Chimaltenango',
      destination: 'Sacatepéquez',
      amount: 'Q 2,800',
      tax: 'Q 280',
      total: 'Q 3,080',
      status: 'Pagada',
      dueDate: '2024-01-22',
      paidDate: '2024-01-20',
      paymentMethod: 'Transferencia Bancaria',
      transporter: 'Transportes Unidos',
      driver: 'María López',
      phone: '+502 4567-8901',
      rating: 4.7,
      reviews: 156,
      description: 'Carga de textiles que requiere protección contra humedad y polvo.',
      items: [
        { description: 'Servicio de transporte', quantity: 1, unitPrice: 'Q 2,400', total: 'Q 2,400' },
        { description: 'Protección contra humedad', quantity: 1, unitPrice: 'Q 300', total: 'Q 300' },
        { description: 'Seguro básico', quantity: 1, unitPrice: 'Q 100', total: 'Q 100' }
      ],
      specialRequirements: ['Protección contra humedad', 'Carga seca'],
      documents: ['Factura comercial', 'Certificado de calidad'],
      notes: 'Pago realizado por transferencia bancaria.',
      createdAt: '2024-01-12 11:30',
      weight: '800 kg',
      distance: '35 km',
      vehicle: 'Furgón Cerrado'
    }
  ];

  // KPI calculations
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'Pagada').length;
  const pendingInvoices = invoices.filter(i => i.status === 'Pendiente').length;
  const overdueInvoices = invoices.filter(i => i.status === 'Vencida').length;
  const totalAmount = invoices.reduce((sum, i) => sum + parseInt(i.total.replace('Q ', '').replace(',', '')), 0);
  const paidAmount = invoices
    .filter(i => i.status === 'Pagada')
    .reduce((sum, i) => sum + parseInt(i.total.replace('Q ', '').replace(',', '')), 0);
  const pendingAmount = invoices
    .filter(i => i.status === 'Pendiente' || i.status === 'Vencida')
    .reduce((sum, i) => sum + parseInt(i.total.replace('Q ', '').replace(',', '')), 0);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.cargoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.transporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'paid' && invoice.status === 'Pagada') ||
                      (activeTab === 'pending' && invoice.status === 'Pendiente') ||
                      (activeTab === 'overdue' && invoice.status === 'Vencida');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagada': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Vencida': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pagada': return <CheckCircle className="h-4 w-4" />;
      case 'Pendiente': return <Clock className="h-4 w-4" />;
      case 'Vencida': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const selectedInvoiceData = invoices.find(i => i.id === selectedInvoice);

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Gestión de Facturas</h1>
        <p className="text-blue-600">Administra y revisa todas tus facturas de envíos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Facturas</p>
                <p className="text-2xl font-bold text-blue-800">{totalInvoices}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Pagadas</p>
                <p className="text-2xl font-bold text-green-800">{paidInvoices}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-800">{pendingInvoices}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-800">{overdueInvoices}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Facturado</p>
                <p className="text-2xl font-bold text-purple-800">Q {totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Pagado</p>
                <p className="text-2xl font-bold text-green-800">Q {paidAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pendiente por Cobrar</p>
                <p className="text-2xl font-bold text-orange-800">Q {pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
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
                  placeholder="Buscar por número de factura, tipo de carga o transportista..."
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
                <SelectItem value="Pagada">Pagada</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Todas</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Pagadas</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Pendientes</TabsTrigger>
              <TabsTrigger value="overdue" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Vencidas</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-blue-200">
                <TableHead className="text-blue-800 font-semibold">Factura</TableHead>
                <TableHead className="text-blue-800 font-semibold">Envío</TableHead>
                <TableHead className="text-blue-800 font-semibold">Carga</TableHead>
                <TableHead className="text-blue-800 font-semibold">Transportista</TableHead>
                <TableHead className="text-blue-800 font-semibold">Total</TableHead>
                <TableHead className="text-blue-800 font-semibold">Vencimiento</TableHead>
                <TableHead className="text-blue-800 font-semibold">Estado</TableHead>
                <TableHead className="text-blue-800 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-medium text-blue-800">
                    <div>
                      <p className="font-bold">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-blue-600">{invoice.createdAt}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">#{invoice.shipmentId}</p>
                      <p className="text-sm text-blue-600">{invoice.origin} → {invoice.destination}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{invoice.cargoType}</p>
                      <p className="text-sm text-blue-600">{invoice.weight}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{invoice.transporter}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-blue-600">{invoice.rating} ({invoice.reviews})</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-blue-800">{invoice.total}</p>
                      <p className="text-sm text-blue-600">Subtotal: {invoice.amount}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{invoice.dueDate}</p>
                      {invoice.status === 'Vencida' && (
                        <p className="text-sm text-red-600">
                          {getDaysOverdue(invoice.dueDate)} días vencida
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">{invoice.status}</span>
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
                              Factura {invoice.invoiceNumber}
                            </DialogTitle>
                            <DialogDescription>
                              Detalles completos de la factura y el envío
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-blue-800 mb-2">Información de Factura</h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Número:</span>
                                      <span className="text-sm font-medium text-blue-800">{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Fecha:</span>
                                      <span className="text-sm font-medium text-blue-800">{invoice.createdAt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Vencimiento:</span>
                                      <span className="text-sm font-medium text-blue-800">{invoice.dueDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Estado:</span>
                                      <Badge className={getStatusColor(invoice.status)}>
                                        {getStatusIcon(invoice.status)}
                                        <span className="ml-1">{invoice.status}</span>
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-blue-800 mb-2">Información de Pago</h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Subtotal:</span>
                                      <span className="text-sm font-medium text-blue-800">{invoice.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">IVA:</span>
                                      <span className="text-sm font-medium text-blue-800">{invoice.tax}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm font-bold text-blue-800">Total:</span>
                                      <span className="text-sm font-bold text-blue-800">{invoice.total}</span>
                                    </div>
                                    {invoice.paymentMethod && (
                                      <div className="flex justify-between">
                                        <span className="text-sm text-blue-600">Método de Pago:</span>
                                        <span className="text-sm font-medium text-blue-800">{invoice.paymentMethod}</span>
                                      </div>
                                    )}
                                    {invoice.paidDate && (
                                      <div className="flex justify-between">
                                        <span className="text-sm text-blue-600">Fecha de Pago:</span>
                                        <span className="text-sm font-medium text-blue-800">{invoice.paidDate}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-blue-800 mb-2">Detalles del Envío</h3>
                                <div className="bg-blue-50/50 rounded-lg p-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-blue-600">Envío:</span>
                                      <p className="font-medium text-blue-800">#{invoice.shipmentId}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Tipo de Carga:</span>
                                      <p className="font-medium text-blue-800">{invoice.cargoType}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Peso:</span>
                                      <p className="font-medium text-blue-800">{invoice.weight}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Distancia:</span>
                                      <p className="font-medium text-blue-800">{invoice.distance}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Vehículo:</span>
                                      <p className="font-medium text-blue-800">{invoice.vehicle}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Ruta:</span>
                                      <p className="font-medium text-blue-800">{invoice.origin} → {invoice.destination}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-800">Items de la Factura</h3>
                              <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-blue-200">
                                      <TableHead className="text-blue-800 font-semibold">Descripción</TableHead>
                                      <TableHead className="text-blue-800 font-semibold">Cantidad</TableHead>
                                      <TableHead className="text-blue-800 font-semibold">Precio Unitario</TableHead>
                                      <TableHead className="text-blue-800 font-semibold">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {invoice.items.map((item, index) => (
                                      <TableRow key={index} className="border-blue-100">
                                        <TableCell className="text-blue-800">{item.description}</TableCell>
                                        <TableCell className="text-blue-800">{item.quantity}</TableCell>
                                        <TableCell className="text-blue-800">{item.unitPrice}</TableCell>
                                        <TableCell className="font-medium text-blue-800">{item.total}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-800">Transportista</h3>
                              <div className="bg-blue-50/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <p className="font-semibold text-blue-800">{invoice.transporter}</p>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                      <span className="text-sm text-blue-600">{invoice.rating} ({invoice.reviews} reseñas)</span>
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
                                    <p className="font-medium text-blue-800">{invoice.driver}</p>
                                  </div>
                                  <div>
                                    <span className="text-blue-600">Teléfono:</span>
                                    <p className="font-medium text-blue-800">{invoice.phone}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {invoice.notes && (
                              <div className="space-y-4">
                                <h3 className="font-semibold text-blue-800">Notas</h3>
                                <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
                                  <p className="text-sm text-yellow-800">{invoice.notes}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar PDF
                              </Button>
                              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimir
                              </Button>
                              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Share2 className="h-4 w-4 mr-2" />
                                Compartir
                              </Button>
                              {invoice.status === 'Pendiente' && (
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Pagar Ahora
                                </Button>
                              )}
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