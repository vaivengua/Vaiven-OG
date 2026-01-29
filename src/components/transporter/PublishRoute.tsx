import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  MapPin, 
  Truck, 
  Package, 
  Coins, 
  Route,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Save,
  Eye,
  TrendingUp,
  Star,
  Users,
  Zap,
  Info,
  Shield,
  Thermometer,
  Repeat,
  CalendarDays,
  ArrowLeft
} from 'lucide-react';

export default function PublishRoute() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    vehicleType: '',
    vehicleId: '',
    maxWeight: '',
    maxVolume: '',
    price: '',
    description: '',
    isRecurring: false,
    frequency: '',
    specialRequirements: '',
    insurance: false,
    temperatureControl: false
  });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to translate vehicle types to Spanish
  const translateVehicleType = (vehicleType: string): string => {
    const vehicleTypeMap: { [key: string]: string } = {
      'small_truck': 'Camión Pequeño',
      'medium_truck': 'Camión Mediano',
      'large_truck': 'Camión Grande',
      'trailer': 'Tráiler',
      'pickup': 'Camioneta',
      'van': 'Furgoneta',
      'motorcycle': 'Motocicleta'
    };
    return vehicleTypeMap[vehicleType.toLowerCase()] || vehicleType;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({ title: 'Debes iniciar sesión', variant: 'destructive' });
      return;
    }
    try {
      setIsSubmitting(true);
      const chosen = vehicles.find(v => String(v.id) === String(formData.vehicleId)) || null;
      const payload = {
        user_id: user.id,
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        departure_date: formData.departureDate || null,
        arrival_date: formData.arrivalDate || null,
        vehicle_type: chosen?.vehicle_type || formData.vehicleType,
        vehicle_id: chosen ? chosen.id : null,
        max_weight_kg: formData.maxWeight ? Number(formData.maxWeight) : null,
        max_volume_m3: formData.maxVolume ? Number(formData.maxVolume) : null,
        price_q: formData.price ? Number(formData.price) : null,
        description: formData.description || null,
        is_recurring: formData.isRecurring,
        frequency: formData.frequency || null,
        special_requirements: formData.specialRequirements || null,
        insurance: formData.insurance,
        temperature_control: formData.temperatureControl,
      };
      let error;
      if (editingRoute?.id) {
        ({ error } = await supabase
          .from('transporter_routes')
          .update(payload)
          .eq('id', editingRoute.id));
      } else {
        ({ error } = await supabase.from('transporter_routes').insert(payload));
      }
      if (error) throw error;
      toast({ title: 'Ruta publicada', description: 'Tu ruta ha sido publicada exitosamente.' });
      navigate('/transporter-dashboard?tab=my-routes');
    } catch (err) {
      toast({ title: 'Error al publicar', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Values aligned with DB check constraint
  const vehicleTypes = [
    { value: 'pickup', label: 'Pickup', capacity: 'Hasta 800 kg', icon: Truck, price: 'Q800-1,500' },
    { value: 'van', label: 'Van', capacity: 'Hasta 1,500 kg', icon: Truck, price: 'Q1,200-2,400' },
    { value: 'small_truck', label: 'Camión Pequeño', capacity: 'Hasta 5,000 kg', icon: Truck, price: 'Q2,000-4,000' },
    { value: 'medium_truck', label: 'Camión Mediano', capacity: 'Hasta 10,000 kg', icon: Truck, price: 'Q3,500-6,500' },
    { value: 'large_truck', label: 'Camión Grande', capacity: 'Hasta 20,000 kg', icon: Truck, price: 'Q5,000-9,000' },
    { value: 'trailer', label: 'Tráiler', capacity: 'Hasta 24,000 kg', icon: Truck, price: 'Q6,000-12,000' },
    { value: 'flatbed', label: 'Plataforma', capacity: 'Hasta 24,000 kg', icon: Truck, price: 'Q6,000-12,000' },
    { value: 'reefer', label: 'Refrigerado', capacity: 'Hasta 20,000 kg', icon: Truck, price: 'Q7,000-14,000' },
  ];

  const recentRoutes = [
    { id: '1', origin: 'Ciudad de Guatemala', destination: 'Quetzaltenango', date: '2024-01-15', status: 'active', price: 'Q2,500', bookings: 3 },
    { id: '2', origin: 'Escuintla', destination: 'Retalhuleu', date: '2024-01-18', status: 'completed', price: 'Q1,800', bookings: 1 },
    { id: '3', origin: 'Cobán', destination: 'Puerto Barrios', date: '2024-01-20', status: 'active', price: 'Q3,200', bookings: 2 },
  ];

  const marketInsights = [
    { route: 'Ciudad de Guatemala → Quetzaltenango', avgPrice: 'Q2,400', demand: 'Alta', trend: 'up' },
    { route: 'Escuintla → Retalhuleu', avgPrice: 'Q1,700', demand: 'Media', trend: 'stable' },
    { route: 'Cobán → Puerto Barrios', avgPrice: 'Q3,000', demand: 'Baja', trend: 'down' },
  ];

  // no progress bar

  const isValid = useMemo(() => !!(formData.origin && formData.destination && formData.departureDate && formData.arrivalDate && formData.vehicleId), [formData]);

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user?.id) return;
      try {
        setVehiclesLoading(true);
        const { data, error } = await supabase
          .from('transporter_vehicles')
          .select('id, name, plate, vehicle_type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setVehicles(data || []);
      } catch {
        setVehicles([]);
      } finally {
        setVehiclesLoading(false);
      }
    };
    loadVehicles();
  }, [user?.id]);

  // If there's an edit param, load the route and prefill
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    const loadRoute = async () => {
      if (!editId) return;
      const { data, error } = await supabase
        .from('transporter_routes')
        .select('*')
        .eq('id', editId)
        .single();
      if (!error && data) {
        setEditingRoute(data);
        setFormData(prev => ({
          ...prev,
          origin: data.origin || '',
          destination: data.destination || '',
          departureDate: data.departure_date || '',
          arrivalDate: data.arrival_date || '',
          vehicleType: data.vehicle_type || '',
          vehicleId: data.vehicle_id || '',
          maxWeight: data.max_weight_kg ? String(data.max_weight_kg) : '',
          maxVolume: data.max_volume_m3 ? String(data.max_volume_m3) : '',
          price: data.price_q ? String(data.price_q) : '',
          description: data.description || '',
          isRecurring: !!data.is_recurring,
          frequency: data.frequency || '',
          specialRequirements: data.special_requirements || '',
          insurance: !!data.insurance,
          temperatureControl: !!data.temperature_control,
        }));
      }
    };
    loadRoute();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Publicar Nueva Ruta</h1>
          <p className="text-gray-600 mt-1">Comparte tu ruta disponible para cargas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/transporter-dashboard?tab=my-routes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Rutas
          </Button>
          <Button onClick={() => formRef.current?.requestSubmit()} disabled={!isValid || isSubmitting} className="bg-blue-500 hover:bg-blue-600">
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Ruta'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Form */}
        <div>
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-500" />
                Detalles de la Ruta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                  <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Route Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="origin" className="text-gray-700 font-medium">
                          <MapPin className="inline h-4 w-4 mr-1 text-blue-500" />
                          Ciudad de Origen
                        </Label>
                        <Input
                          id="origin"
                          value={formData.origin}
                          onChange={(e) => setFormData({...formData, origin: e.target.value})}
                          placeholder="ej. Ciudad de Guatemala"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination" className="text-gray-700 font-medium">
                          <MapPin className="inline h-4 w-4 mr-1 text-blue-500" />
                          Ciudad de Destino
                        </Label>
                        <Input
                          id="destination"
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          placeholder="ej. Quetzaltenango"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="departureDate" className="text-gray-700 font-medium">
                          <Calendar className="inline h-4 w-4 mr-1 text-blue-500" />
                          Fecha de Salida
                        </Label>
                        <Input
                          id="departureDate"
                          type="date"
                          value={formData.departureDate}
                          onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arrivalDate" className="text-gray-700 font-medium">
                          <Calendar className="inline h-4 w-4 mr-1 text-blue-500" />
                          Fecha de Llegada
                        </Label>
                        <Input
                          id="arrivalDate"
                          type="date"
                          value={formData.arrivalDate}
                          onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleId" className="text-gray-700 font-medium">
                          <Truck className="inline h-4 w-4 mr-1 text-blue-500" />
                          Selecciona tu Vehículo
                        </Label>
                        <Select value={formData.vehicleId} onValueChange={(value) => {
                          const v = vehicles.find(v => String(v.id) === String(value));
                          setFormData({...formData, vehicleId: value, vehicleType: v?.vehicle_type || ''});
                        }}>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder={vehiclesLoading ? 'Cargando...' : 'Seleccionar vehículo'} />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map((v) => (
                              <SelectItem key={v.id} value={String(v.id)}>
                                {(v.name || v.plate || 'Vehículo')} • {translateVehicleType(v.vehicle_type) || 'Tipo no especificado'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="maxWeight" className="text-gray-700 font-medium">
                          <Package className="inline h-4 w-4 mr-1 text-blue-500" />
                          Peso Máximo (kg)
                        </Label>
                        <Input
                          id="maxWeight"
                          type="number"
                          value={formData.maxWeight}
                          onChange={(e) => setFormData({...formData, maxWeight: e.target.value})}
                          placeholder="1000"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxVolume" className="text-gray-700 font-medium">
                          <Package className="inline h-4 w-4 mr-1 text-blue-500" />
                          Volumen Máximo (m³)
                        </Label>
                        <Input
                          id="maxVolume"
                          type="number"
                          value={formData.maxVolume}
                          onChange={(e) => setFormData({...formData, maxVolume: e.target.value})}
                          placeholder="50"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-700 font-medium">
                          <Coins className="inline h-4 w-4 mr-1 text-blue-500" />
                          Precio (Q.)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="500"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700 font-medium">
                        Descripción Adicional
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Información adicional sobre la ruta, condiciones especiales, etc..."
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={!isValid || isSubmitting}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Publicando...' : 'Publicar Ruta'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Repeat className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label htmlFor="recurring" className="text-gray-700 font-medium">
                          Ruta Recurrente
                        </Label>
                        <p className="text-sm text-gray-600">Establece una ruta que se repita regularmente</p>
                      </div>
                      <Switch
                        id="recurring"
                        checked={formData.isRecurring}
                        onCheckedChange={(checked) => setFormData({...formData, isRecurring: checked})}
                      />
                    </div>

                    {formData.isRecurring && (
                      <div className="space-y-2">
                        <Label htmlFor="frequency" className="text-gray-700 font-medium">
                          <CalendarDays className="inline h-4 w-4 mr-1 text-blue-500" />
                          Frecuencia
                        </Label>
                        <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Seleccionar frecuencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diaria</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="biweekly">Quincenal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements" className="text-gray-700 font-medium">
                        Requisitos Especiales
                      </Label>
                      <Textarea
                        id="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                        placeholder="Especifica requisitos especiales para la carga..."
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <Label htmlFor="insurance" className="text-gray-700 font-medium">
                          Seguro de Carga Incluido
                        </Label>
                        <p className="text-sm text-gray-600">Ofrece mayor seguridad a tus clientes</p>
                      </div>
                      <Switch
                        id="insurance"
                        checked={formData.insurance}
                        onCheckedChange={(checked) => setFormData({...formData, insurance: checked})}
                      />
                    </div>

                    <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Thermometer className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label htmlFor="temperatureControl" className="text-gray-700 font-medium">
                          Control de Temperatura
                        </Label>
                        <p className="text-sm text-gray-600">Ideal para productos sensibles a la temperatura</p>
                      </div>
                      <Switch
                        id="temperatureControl"
                        checked={formData.temperatureControl}
                        onCheckedChange={(checked) => setFormData({...formData, temperatureControl: checked})}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Información Importante</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Asegúrate de que toda la información sea precisa. Las rutas publicadas serán visibles para todos los clientes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

      </div>
      </div>
    </div>
  );
}
