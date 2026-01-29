import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download, Eye, MessageCircle, Phone, Star, MapPin, Truck, Package, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Quotes() {
  const { user } = useAuth();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuoteActionDialogOpen, setIsQuoteActionDialogOpen] = useState<boolean>(false);
  const [selectedQuoteAction, setSelectedQuoteAction] = useState<{
    requestId: string;
    action: 'accept' | 'reject';
    quote: any;
  } | null>(null);
  const [isQuoteActionLoading, setIsQuoteActionLoading] = useState<boolean>(false);

  // Load quote requests from database
  useEffect(() => {
    loadQuoteRequests();
  }, [user]);

  const loadQuoteRequests = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading quote requests for client:', user.id);
      
      // First, get the quote requests without the problematic join
      const { data: requests, error } = await supabase
        .from('quote_requests')
        .select(`
          *,
          shipments (
            id,
            title,
            description,
            weight,
            volume,
            cargo_type,
            estimated_price,
            origin_address,
            destination_address,
            pickup_date,
            delivery_date,
            pickup_time,
            delivery_time,
            pieces,
            packaging,
            dimensions_length,
            dimensions_width,
            dimensions_height,
            special_requirements,
            insurance_value,
            pickup_instructions,
            delivery_instructions,
            contact_person,
            contact_phone,
            temperature,
            humidity,
            customs,
            status
          )
        `)
        .eq('client_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('📋 Quote requests found:', requests?.length || 0);
      
      // Get transporter profiles separately to avoid relationship issues
      const transporterUserIds = [...new Set((requests || []).map((request: any) => request.transporter_user_id))];
      let transporterProfiles: any[] = [];
      
      if (transporterUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('transporter_profiles')
          .select('*')
          .in('user_id', transporterUserIds);
        
        if (!profilesError) {
          transporterProfiles = profiles || [];
        } else {
          console.warn('⚠️ Could not fetch transporter profiles:', profilesError);
        }
      }
      
      // Map the data to match the expected format
      const mappedQuotes = (requests || []).map((request: any) => {
        const transporterProfile = transporterProfiles.find(p => p.user_id === request.transporter_user_id);
        
        return {
        id: request.id.substring(0, 8).toUpperCase(),
        cargoType: request.shipments?.cargo_type || 'N/A',
        origin: request.shipments?.origin_address || 'N/A',
        destination: request.shipments?.destination_address || 'N/A',
        weight: request.shipments?.weight ? `${request.shipments.weight} kg` : 'N/A',
        budget: request.shipments?.estimated_price ? `Q ${request.shipments.estimated_price.toLocaleString()}` : 'N/A',
        status: getStatusLabel(request.status),
        transporter: transporterProfile?.company || transporterProfile?.full_name || 'N/A',
        driver: transporterProfile?.full_name || 'N/A',
        phone: transporterProfile?.phone || 'N/A',
        rating: 4.5, // Default rating - could be calculated from reviews if available
        reviews: 0, // Could be fetched from reviews table
        quote: request.response_amount ? `Q ${request.response_amount.toLocaleString()}` : 'Pendiente',
        savings: calculateSavings(request.shipments?.estimated_price, request.response_amount),
        estimatedTime: request.response_estimated_duration || 'N/A',
        vehicle: getVehicleType(transporterProfile?.vehicle_types),
        insurance: request.shipments?.insurance_value ? 'Completa' : 'Básica',
        createdAt: new Date(request.created_at).toLocaleString('es-GT'),
        expiresAt: new Date(request.expires_at).toLocaleString('es-GT'),
        description: request.shipments?.description || request.message || 'Sin descripción',
        specialRequirements: request.shipments?.special_requirements ? 
          request.shipments.special_requirements.split(',').map((req: string) => req.trim()) : [],
        documents: ['Factura comercial'], // Could be expanded based on actual requirements
        raw: request
      }));
      
      setQuotes(mappedQuotes);
    } catch (err) {
      console.error('❌ Error loading quote requests:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'responded': return 'Respondida';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'expired': return 'Expirada';
      default: return 'Pendiente';
    }
  };

  const calculateSavings = (budget: number, quote: number) => {
    if (!budget || !quote) return 'N/A';
    const savings = budget - quote;
    return savings >= 0 ? `Q ${savings.toLocaleString()}` : `-Q ${Math.abs(savings).toLocaleString()}`;
  };

  const getVehicleType = (vehicleTypes: string) => {
    if (!vehicleTypes) return 'N/A';
    const types = vehicleTypes.split(',');
    return types[0]?.trim() || 'N/A';
  };

  // Handle quote actions
  const handleQuoteAction = (quoteId: string, action: 'accept' | 'reject', quote: any) => {
    setSelectedQuoteAction({ requestId: quoteId, action, quote });
    setIsQuoteActionDialogOpen(true);
  };

  // Execute quote action after confirmation
  const executeQuoteAction = async () => {
    if (!selectedQuoteAction) return;

    console.log('🚀 STARTING QUOTE ACCEPTANCE PROCESS');
    console.log('🚀 Selected quote action:', selectedQuoteAction);
    console.log('🚀 Action type:', selectedQuoteAction.action);
    
    setIsQuoteActionLoading(true);
    try {
      // Update quote request status
      const { error: quoteError } = await supabase
        .from('quote_requests')
        .update({ 
          status: selectedQuoteAction.action === 'accept' ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedQuoteAction.requestId);

      if (quoteError) throw quoteError;

      // If accepted, also update the shipment status to 'booked' AND create an offer record
      if (selectedQuoteAction.action === 'accept') {
        const shipmentId = selectedQuoteAction.quote.raw.shipment_id;
        const transporterUserId = selectedQuoteAction.quote.raw.transporter_user_id;
        const responseAmount = selectedQuoteAction.quote.raw.response_amount;
        const responseMessage = selectedQuoteAction.quote.raw.response_message;
        const responseDuration = selectedQuoteAction.quote.raw.response_estimated_duration;
        
        console.log('🚀 Updating shipment status to booked for shipment:', shipmentId);
        console.log('🔍 Quote object:', selectedQuoteAction.quote);
        console.log('🔍 Raw data:', selectedQuoteAction.quote.raw);
        console.log('🔍 Shipment ID from raw:', shipmentId);
        console.log('🔍 Request ID:', selectedQuoteAction.requestId);
        console.log('🔍 Transporter User ID:', transporterUserId);
        console.log('🔍 Response Amount:', responseAmount);
        
        if (shipmentId && transporterUserId && responseAmount) {
          // Step 1: Update shipment status to 'booked'
          console.log('🔧 Step 1: Updating shipment status...');
          const { data: updateData, error: shipmentError } = await supabase
            .from('shipments')
            .update({ 
              status: 'booked',
              updated_at: new Date().toISOString()
            })
            .eq('id', shipmentId)
            .select();

          console.log('🔧 Shipment update result:', { updateData, shipmentError });

          if (shipmentError) {
            console.error('❌ Error updating shipment status:', shipmentError);
            throw shipmentError;
          } else {
            console.log('✅ Shipment status updated to booked successfully');
          }

          // Step 2: Create an offer record so the shipment shows up with accepted offer
          console.log('🔧 Step 2: Creating offer record...');
          const { data: offerData, error: offerError } = await supabase
            .from('offers')
            .insert({
              shipment_id: shipmentId,
              transporter_user_id: transporterUserId,
              amount: responseAmount,
              message: responseMessage || 'Oferta aceptada desde solicitud de cotización',
              estimated_duration: responseDuration,
              vehicle_type: 'general', // Default since we don't have this info from quote request
              status: 'accepted',
              accepted_at: new Date().toISOString()
            })
            .select();

          console.log('🔧 Offer creation result:', { offerData, offerError });

          if (offerError) {
            console.error('❌ Error creating offer record:', offerError);
            // Don't throw here - the shipment was already updated successfully
          } else {
            console.log('✅ Offer record created successfully');
          }
        } else {
          console.error('❌ Missing required data:', { shipmentId, transporterUserId, responseAmount });
          throw new Error('Faltan datos requeridos para procesar la aceptación');
        }
      }

      // Reload quotes to reflect the change
      await loadQuoteRequests();
      
      // Also reload shipments to update their status in the UI
      // We need to trigger a reload of shipments from the parent component
      console.log('🚀 Dispatching reloadShipments event');
      window.dispatchEvent(new CustomEvent('reloadShipments'));
      console.log('✅ reloadShipments event dispatched');
    } catch (err) {
      console.error('Error updating quote:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar cotización');
    } finally {
      setIsQuoteActionLoading(false);
      setIsQuoteActionDialogOpen(false);
      setSelectedQuoteAction(null);
    }
  };

  // KPI calculations
  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter(q => q.status === 'Pendiente').length;
  const acceptedQuotes = quotes.filter(q => q.status === 'Aceptada').length;
  const totalSavings = quotes
    .filter(q => q.status === 'Aceptada' && q.savings !== 'N/A' && q.savings.startsWith('Q'))
    .reduce((sum, q) => {
      const savingsValue = parseInt(q.savings.replace('Q ', '').replace(',', ''));
      return sum + (isNaN(savingsValue) ? 0 : savingsValue);
    }, 0);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.cargoType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.transporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && quote.status === 'Pendiente') ||
                      (activeTab === 'accepted' && quote.status === 'Aceptada') ||
                      (activeTab === 'rejected' && quote.status === 'Rechazada') ||
                      (activeTab === 'expired' && quote.status === 'Expirada');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aceptada': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rechazada': return 'bg-red-100 text-red-800 border-red-200';
      case 'Expirada': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendiente': return <Clock className="h-4 w-4" />;
      case 'Aceptada': return <CheckCircle className="h-4 w-4" />;
      case 'Rechazada': return <XCircle className="h-4 w-4" />;
      case 'Expirada': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const selectedQuoteData = quotes.find(q => q.id === selectedQuote);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Gestión de Cotizaciones</h1>
          <p className="text-blue-600">Revisa y gestiona las cotizaciones de tus envíos</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Cargando cotizaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Gestión de Cotizaciones</h1>
          <p className="text-blue-600">Revisa y gestiona las cotizaciones de tus envíos</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar cotizaciones</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadQuoteRequests} className="bg-red-600 hover:bg-red-700 text-white">
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Gestión de Cotizaciones</h1>
        <p className="text-blue-600">Revisa y gestiona las cotizaciones de tus envíos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Cotizaciones</p>
                <p className="text-2xl font-bold text-blue-800">{totalQuotes}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-800">{pendingQuotes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Aceptadas</p>
                <p className="text-2xl font-bold text-green-800">{acceptedQuotes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Ahorro Total</p>
                <p className="text-2xl font-bold text-purple-800">Q {totalSavings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
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
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aceptada">Aceptada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
                <SelectItem value="Expirada">Expirada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Todas</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Pendientes</TabsTrigger>
              <TabsTrigger value="accepted" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Aceptadas</TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Rechazadas</TabsTrigger>
              <TabsTrigger value="expired" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Expiradas</TabsTrigger>
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
                <TableHead className="text-blue-800 font-semibold">Cotización</TableHead>
                <TableHead className="text-blue-800 font-semibold">Ahorro</TableHead>
                <TableHead className="text-blue-800 font-semibold">Estado</TableHead>
                <TableHead className="text-blue-800 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id} className="border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-medium text-blue-800">#{quote.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{quote.cargoType}</p>
                      <p className="text-sm text-blue-600">{quote.weight}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{quote.origin}</p>
                      <p className="text-sm text-blue-600">→ {quote.destination}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-blue-800">{quote.transporter}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-blue-600">{quote.rating} ({quote.reviews})</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-blue-800">{quote.quote}</p>
                      <p className="text-sm text-blue-600">Presupuesto: {quote.budget}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={parseInt(quote.savings.replace('Q ', '').replace(',', '')) >= 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                      {quote.savings}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(quote.status)}>
                      {getStatusIcon(quote.status)}
                      <span className="ml-1">{quote.status}</span>
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
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              Detalles de Cotización #{quote.id}
                            </DialogTitle>
                            <DialogDescription>
                              Información completa de la cotización y el transportista
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
                                      <span className="text-sm font-medium text-blue-800">{quote.cargoType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Peso:</span>
                                      <span className="text-sm font-medium text-blue-800">{quote.weight}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Presupuesto:</span>
                                      <span className="text-sm font-medium text-blue-800">{quote.budget}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Cotización:</span>
                                      <span className="text-sm font-bold text-blue-800">{quote.quote}</span>
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
                                      <span className="text-sm font-medium text-blue-800">{quote.origin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Destino:</span>
                                      <span className="text-sm font-medium text-blue-800">{quote.destination}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Tiempo Estimado:</span>
                                      <span className="text-sm font-medium text-blue-800">{quote.estimatedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-blue-600">Vehículo:</span>
                                      <span className="text-sm font-medium text-blue-800">{quote.vehicle}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-blue-800 mb-2">Transportista</h3>
                                <div className="bg-blue-50/50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-semibold text-blue-800">{quote.transporter}</p>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm text-blue-600">{quote.rating} ({quote.reviews} reseñas)</span>
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
                                      <p className="font-medium text-blue-800">{quote.driver}</p>
                                    </div>
                                    <div>
                                      <span className="text-blue-600">Teléfono:</span>
                                      <p className="font-medium text-blue-800">{quote.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {quote.specialRequirements.length > 0 && (
                              <div>
                                <h3 className="font-semibold text-blue-800 mb-2">Requerimientos Especiales</h3>
                                <div className="space-y-1">
                                  {quote.specialRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                      {req}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {quote.status === 'Respondida' && (
                                <>
                                  <Button 
                                    onClick={() => handleQuoteAction(quote.raw.id, 'accept', quote)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Aceptar Cotización
                                  </Button>
                                  <Button 
                                    onClick={() => handleQuoteAction(quote.raw.id, 'reject', quote)}
                                    variant="outline" 
                                    className="border-red-200 text-red-700 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Rechazar
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar PDF
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

      {/* Quote Action Confirmation Dialog */}
      <Dialog open={isQuoteActionDialogOpen} onOpenChange={setIsQuoteActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQuoteAction?.action === 'accept' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Aceptar Cotización
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Rechazar Cotización
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedQuoteAction?.action === 'accept' 
                ? '¿Estás seguro de que quieres aceptar esta cotización? Esta acción no se puede deshacer.'
                : '¿Estás seguro de que quieres rechazar esta cotización?'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuoteAction && (
            <div className="space-y-4">
              {/* Quote Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-gray-900">{selectedQuoteAction.quote.cargoType || 'Sin tipo'}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Transportista:</span>
                    <p className="font-medium">{selectedQuoteAction.quote.transporter || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Monto:</span>
                    <p className="font-medium text-green-600">
                      {selectedQuoteAction.quote.quote}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ruta:</span>
                    <p className="font-medium">{selectedQuoteAction.quote.origin} → {selectedQuoteAction.quote.destination}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Peso:</span>
                    <p className="font-medium">{selectedQuoteAction.quote.weight}</p>
                  </div>
                </div>
                {selectedQuoteAction.quote.description && (
                  <div>
                    <span className="text-gray-500 text-sm">Descripción:</span>
                    <p className="text-sm">{selectedQuoteAction.quote.description}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsQuoteActionDialogOpen(false);
                    setSelectedQuoteAction(null);
                  }}
                  disabled={isQuoteActionLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  className={selectedQuoteAction.action === 'accept' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                  }
                  onClick={executeQuoteAction}
                  disabled={isQuoteActionLoading}
                >
                  {isQuoteActionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      {selectedQuoteAction.action === 'accept' ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aceptar
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 