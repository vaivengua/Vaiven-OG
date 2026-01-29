import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Truck, 
  ArrowLeft,
  Package,
  MapPin,
  Calendar as CalendarIcon,
  Calculator,
  XCircle,
  Navigation,
  Crosshair
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const pickupIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function ShipmentForm() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originAddress: '',
    destinationAddress: '',
    weight: '',
    volume: '',
    cargoType: 'general',
    pickupDate: undefined as Date | undefined,
    deliveryDate: undefined as Date | undefined,
    // Additional cargo details
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    pieces: '',
    packaging: 'standard',
    specialRequirements: '',
    insuranceValue: '',
    // Pickup and delivery details
    pickupTime: '',
    deliveryTime: '',
    pickupInstructions: '',
    deliveryInstructions: '',
    contactPerson: '',
    contactPhone: '',
    // Additional shipment details
    priority: 'normal',
    temperature: 'ambient',
    humidity: 'standard',
    customs: false,
    documents: [],
    // Map coordinates
    pickupCoordinates: {
      lat: 14.6349, // Default to Guatemala City
      lng: -90.5069
    },
    deliveryCoordinates: {
      lat: 14.6349,
      lng: -90.5069
    }
  });

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Map state
  const [showPickupMap, setShowPickupMap] = useState(true);
  const [showDeliveryMap, setShowDeliveryMap] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 14.6349, lng: -90.5069 });
  const pickupMapRef = useRef<HTMLDivElement>(null);
  const deliveryMapRef = useRef<HTMLDivElement>(null);

  // Effect to handle map initialization
  useEffect(() => {
    // Force map re-render when coordinates change
    if (pickupMapRef.current || deliveryMapRef.current) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [formData.pickupCoordinates, formData.deliveryCoordinates]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset price estimation when relevant fields change
    if (['originAddress', 'destinationAddress', 'weight', 'cargoType'].includes(field)) {
      setEstimatedPrice(null);
    }
  };

  // Auto-calculate price when coordinates change
  useEffect(() => {
    if (formData.pickupCoordinates && formData.deliveryCoordinates && formData.weight && estimatedPrice !== null) {
      console.log('🔄 Recalculating price due to coordinate change');
      console.log('📍 Pickup:', formData.pickupCoordinates);
      console.log('📍 Delivery:', formData.deliveryCoordinates);
      
      // Recalculate price when coordinates change
      const calculateRealDistance = () => {
        const R = 6371; // Earth's radius in km
        const dLat = (formData.deliveryCoordinates.lat - formData.pickupCoordinates.lat) * Math.PI / 180;
        const dLng = (formData.deliveryCoordinates.lng - formData.pickupCoordinates.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(formData.pickupCoordinates.lat * Math.PI / 180) * Math.cos(formData.deliveryCoordinates.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      const realDistance = calculateRealDistance();
      const weight = parseFloat(formData.weight);
      const pieces = parseFloat(formData.pieces) || 1; // Default to 1 piece if not specified
      
      // Base price calculation: weight + pieces factor
      const weightPrice = weight * 2.5; // Q2.50 per kg
      const piecesPrice = pieces * 5; // Q5.00 per piece
      const basePrice = weightPrice + piecesPrice;
      
      const distanceMultiplier = Math.max(1, realDistance / 50); // Minimum 1x, increases with distance
      const cargoTypeMultiplier = formData.cargoType === 'fragile' ? 1.3 : 
                                 formData.cargoType === 'perishable' ? 1.2 : 
                                 formData.cargoType === 'hazardous' ? 1.5 : 1.0;
      
      const newEstimatedPrice = Math.round(basePrice * distanceMultiplier * cargoTypeMultiplier);
      
      console.log('💰 Price calculation:', {
        realDistance,
        weight,
        basePrice,
        distanceMultiplier,
        cargoTypeMultiplier,
        newEstimatedPrice
      });
      
      setEstimatedPrice(newEstimatedPrice);
    }
  }, [formData.pickupCoordinates, formData.deliveryCoordinates, formData.weight, formData.pieces, formData.cargoType]);

  const handleEstimatePrice = () => {
    console.log('🔴 CALCULATE PRICE BUTTON CLICKED!');
    console.log('📋 Form data:', {
      originAddress: formData.originAddress,
      destinationAddress: formData.destinationAddress,
      weight: formData.weight,
      pickupCoordinates: formData.pickupCoordinates,
      deliveryCoordinates: formData.deliveryCoordinates
    });

    if (!formData.originAddress || !formData.destinationAddress || !formData.weight) {
      alert("Completa origen, destino y peso para calcular el precio");
      return;
    }

    setIsCalculating(true);
    
    // Calculate real distance using Haversine formula
    const calculateRealDistance = () => {
      const R = 6371; // Earth's radius in km
      const dLat = (formData.deliveryCoordinates.lat - formData.pickupCoordinates.lat) * Math.PI / 180;
      const dLng = (formData.deliveryCoordinates.lng - formData.pickupCoordinates.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(formData.pickupCoordinates.lat * Math.PI / 180) * Math.cos(formData.deliveryCoordinates.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Real price calculation using actual distance
    setTimeout(() => {
      const realDistance = calculateRealDistance();
      const weight = parseFloat(formData.weight);
      const pieces = parseFloat(formData.pieces) || 1; // Default to 1 piece if not specified
      
      // Base price calculation: weight + pieces factor
      const weightPrice = weight * 2.5; // Q2.50 per kg
      const piecesPrice = pieces * 5; // Q5.00 per piece
      const basePrice = weightPrice + piecesPrice;
      
      const distanceMultiplier = Math.max(1, realDistance / 50); // Minimum 1x, increases with distance
      const cargoTypeMultiplier = formData.cargoType === 'fragile' ? 1.3 : 
                                 formData.cargoType === 'perishable' ? 1.2 : 
                                 formData.cargoType === 'hazardous' ? 1.5 : 1.0;
      
      const estimatedPrice = Math.round(basePrice * distanceMultiplier * cargoTypeMultiplier);
      
      console.log('💰 PRICE CALCULATION RESULT:', {
        realDistance,
        weight,
        pieces,
        weightPrice,
        piecesPrice,
        basePrice,
        distanceMultiplier,
        cargoTypeMultiplier,
        estimatedPrice
      });
      
      setEstimatedPrice(estimatedPrice);
      setIsCalculating(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.originAddress || !formData.destinationAddress || 
        !formData.weight || !formData.pickupDate) {
      toast({ title: "Faltan campos", description: "Completa título, origen, destino, peso y fecha de recogida.", variant: "destructive" });
      return;
    }

    if (!user?.id) {
      toast({ title: "No autenticado", description: "Inicia sesión para crear un envío.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Map form fields to DB columns
      const payload = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        origin_address: formData.originAddress,
        destination_address: formData.destinationAddress,
        pickup_date: formData.pickupDate?.toISOString(),
        delivery_date: formData.deliveryDate ? formData.deliveryDate.toISOString() : null,
        pickup_time: formData.pickupTime || null,
        delivery_time: formData.deliveryTime || null,
        weight: parseFloat(String(formData.weight)),
        volume: formData.volume ? parseFloat(String(formData.volume)) : null,
        cargo_type: formData.cargoType,
        dimensions_length: formData.dimensions.length ? parseFloat(String(formData.dimensions.length)) : null,
        dimensions_width: formData.dimensions.width ? parseFloat(String(formData.dimensions.width)) : null,
        dimensions_height: formData.dimensions.height ? parseFloat(String(formData.dimensions.height)) : null,
        pieces: formData.pieces ? parseInt(String(formData.pieces)) : null,
        packaging: formData.packaging,
        special_requirements: formData.specialRequirements || null,
        insurance_value: formData.insuranceValue ? parseFloat(String(formData.insuranceValue)) : null,
        pickup_instructions: formData.pickupInstructions || null,
        delivery_instructions: formData.deliveryInstructions || null,
        contact_person: formData.contactPerson || null,
        contact_phone: formData.contactPhone || null,
        priority: formData.priority,
        temperature: formData.temperature,
        humidity: formData.humidity,
        customs: !!formData.customs,
        documents: formData.documents && formData.documents.length ? formData.documents : [],
        pickup_lat: formData.pickupCoordinates?.lat ?? null,
        pickup_lng: formData.pickupCoordinates?.lng ?? null,
        delivery_lat: formData.deliveryCoordinates?.lat ?? null,
        delivery_lng: formData.deliveryCoordinates?.lng ?? null,
        estimated_price: estimatedPrice ?? null,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('shipments')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Envío creado", description: "Tu envío fue creado correctamente." });
      navigate('/client-dashboard');
    } catch (err: any) {
      toast({ title: "Error al crear envío", description: err?.message || 'Intenta nuevamente.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  // Map functions
  const handlePickupLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      pickupCoordinates: { lat, lng }
    }));
    // Keep map open for better UX
  };

  const handleDeliveryLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      deliveryCoordinates: { lat, lng }
    }));
    // Keep map open for better UX
  };

  const getCurrentLocation = (type: 'pickup' | 'delivery') => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (type === 'pickup') {
            setFormData(prev => ({
              ...prev,
              pickupCoordinates: { lat: latitude, lng: longitude }
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              deliveryCoordinates: { lat: latitude, lng: longitude }
            }));
          }
        },
        (error) => {
          alert('No se pudo obtener tu ubicación actual. Error: ' + error.message);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  const openGoogleMaps = (type: 'pickup' | 'delivery') => {
    const coords = type === 'pickup' ? formData.pickupCoordinates : formData.deliveryCoordinates;
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/client-dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <img 
                src="/Logos%20Vaiven/Logos%20en%20PNG/web%20logo%20oficial%20A.png" 
                alt="CargoConnect Logo" 
                className="h-24 w-auto object-contain mr-3 ml-4"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-500">
                {user?.user_metadata?.name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Crear Nuevo Envío</h1>
          <p className="text-neutral-500">
            Completa la información de tu carga para recibir cotizaciones de transportistas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Título del Envío *</Label>
                <Input
                  id="title"
                  placeholder="ej. Envío de productos textiles"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el contenido de la carga, instrucciones especiales, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Información de Ruta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="origin">Dirección de Origen *</Label>
                  <Input
                    id="origin"
                    placeholder="ej. Zona 10, Ciudad de Guatemala"
                    value={formData.originAddress}
                    onChange={(e) => handleInputChange('originAddress', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="destination">Dirección de Destino *</Label>
                  <Input
                    id="destination"
                    placeholder="ej. Antigua Guatemala, Sacatepéquez"
                    value={formData.destinationAddress}
                    onChange={(e) => handleInputChange('destinationAddress', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pickupDate">Fecha de Recogida *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.pickupDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.pickupDate ? format(formData.pickupDate, "PPP") : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.pickupDate}
                        onSelect={(date) => handleInputChange('pickupDate', date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="deliveryDate">Fecha de Entrega (Opcional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.deliveryDate}
                        onSelect={(date) => handleInputChange('deliveryDate', date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Maps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Ubicaciones Exactas en el Mapa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup Location Map */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Ubicación de Recogida</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPickupMap(!showPickupMap)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {showPickupMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => getCurrentLocation('pickup')}
                    >
                      <Crosshair className="w-4 h-4 mr-2" />
                      Mi Ubicación
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openGoogleMaps('pickup')}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Abrir en Google Maps
                    </Button>
                  </div>
                  
                  {showPickupMap && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="text-center text-sm text-gray-600 mb-3">
                        Haz clic en el mapa para seleccionar la ubicación exacta de recogida
                      </div>
                      <div 
                        ref={pickupMapRef}
                        className="w-full h-64 border rounded-lg relative"
                        style={{ zIndex: 1 }}
                      >
                        <MapContainer
                          center={[formData.pickupCoordinates.lat, formData.pickupCoordinates.lng]}
                          zoom={13}
                          style={{ height: '100%', width: '100%' }}
                          className="rounded-lg"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker 
                            position={[formData.pickupCoordinates.lat, formData.pickupCoordinates.lng]}
                            icon={pickupIcon}
                          />
                          <MapClickHandler onMapClick={handlePickupLocationSelect} />
                        </MapContainer>
                        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow">
                          Coordenadas: {formData.pickupCoordinates.lat.toFixed(6)}, {formData.pickupCoordinates.lng.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Location Map */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Ubicación de Entrega</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeliveryMap(!showDeliveryMap)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {showDeliveryMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => getCurrentLocation('delivery')}
                    >
                      <Crosshair className="w-4 h-4 mr-2" />
                      Mi Ubicación
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openGoogleMaps('delivery')}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Abrir en Google Maps
                    </Button>
                  </div>
                  
                  {showDeliveryMap && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="text-center text-sm text-gray-600 mb-3">
                        Haz clic en el mapa para seleccionar la ubicación exacta de entrega
                      </div>
                      <div 
                        ref={deliveryMapRef}
                        className="w-full h-64 border rounded-lg relative"
                        style={{ zIndex: 1 }}
                      >
                        <MapContainer
                          center={[formData.deliveryCoordinates.lat, formData.deliveryCoordinates.lng]}
                          zoom={13}
                          style={{ height: '100%', width: '100%' }}
                          className="rounded-lg"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker 
                            position={[formData.deliveryCoordinates.lat, formData.deliveryCoordinates.lng]}
                            icon={deliveryIcon}
                          />
                          <MapClickHandler onMapClick={handleDeliveryLocationSelect} />
                        </MapContainer>
                        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs text-gray-600 shadow">
                          Coordenadas: {formData.deliveryCoordinates.lat.toFixed(6)}, {formData.deliveryCoordinates.lng.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Distance and Route Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Información de Ruta</h4>
                    <p className="text-sm text-blue-700">
                      Distancia estimada: {(() => {
                        const R = 6371; // Earth's radius in km
                        const dLat = (formData.deliveryCoordinates.lat - formData.pickupCoordinates.lat) * Math.PI / 180;
                        const dLng = (formData.deliveryCoordinates.lng - formData.pickupCoordinates.lng) * Math.PI / 180;
                        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                  Math.cos(formData.pickupCoordinates.lat * Math.PI / 180) * Math.cos(formData.deliveryCoordinates.lat * Math.PI / 180) *
                                  Math.sin(dLng/2) * Math.sin(dLng/2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        const distance = R * c;
                        return `${distance.toFixed(1)} km`;
                      })()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/${formData.pickupCoordinates.lat},${formData.pickupCoordinates.lng}/${formData.deliveryCoordinates.lat},${formData.deliveryCoordinates.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver Ruta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup and Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Detalles de Recogida y Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pickupTime">Hora de Recogida</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryTime">Hora de Entrega</Label>
                  <Input
                    id="deliveryTime"
                    type="time"
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactPerson">Persona de Contacto</Label>
                  <Input
                    id="contactPerson"
                    placeholder="ej. Juan Pérez"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="ej. +502 1234 5678"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pickupInstructions">Instrucciones de Recogida</Label>
                <Textarea
                  id="pickupInstructions"
                  placeholder="Instrucciones específicas para la recogida (código de acceso, punto de encuentro, etc.)"
                  value={formData.pickupInstructions}
                  onChange={(e) => handleInputChange('pickupInstructions', e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="deliveryInstructions">Instrucciones de Entrega</Label>
                <Textarea
                  id="deliveryInstructions"
                  placeholder="Instrucciones específicas para la entrega (código de acceso, punto de encuentro, etc.)"
                  value={formData.deliveryInstructions}
                  onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cargo Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Carga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="ej. 1500"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="volume">Volumen (m³)</Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.1"
                    placeholder="ej. 5.5"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cargoType">Tipo de Carga *</Label>
                  <Select value={formData.cargoType} onValueChange={(value) => handleInputChange('cargoType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="fragile">Frágil</SelectItem>
                      <SelectItem value="perishable">Perecedero</SelectItem>
                      <SelectItem value="hazardous">Peligroso</SelectItem>
                      <SelectItem value="electronics">Electrónicos</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="machinery">Maquinaria</SelectItem>
                      <SelectItem value="automotive">Automotriz</SelectItem>
                      <SelectItem value="construction">Construcción</SelectItem>
                      <SelectItem value="agricultural">Agrícola</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <Label className="text-sm font-medium">Dimensiones (cm)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="length" className="text-xs">Largo</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="ej. 200"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, length: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="text-xs">Ancho</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="ej. 150"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, width: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Alto</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="ej. 100"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('dimensions', { ...formData.dimensions, height: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Additional cargo details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pieces">Número de Piezas</Label>
                  <Input
                    id="pieces"
                    type="number"
                    placeholder="ej. 50"
                    value={formData.pieces}
                    onChange={(e) => handleInputChange('pieces', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="packaging">Tipo de Empaque</Label>
                  <Select value={formData.packaging} onValueChange={(value) => handleInputChange('packaging', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar</SelectItem>
                      <SelectItem value="wooden">Cajas de Madera</SelectItem>
                      <SelectItem value="plastic">Contenedores Plásticos</SelectItem>
                      <SelectItem value="metal">Contenedores Metálicos</SelectItem>
                      <SelectItem value="pallets">Pallets</SelectItem>
                      <SelectItem value="crates">Jaulas</SelectItem>
                      <SelectItem value="bags">Bolsas</SelectItem>
                      <SelectItem value="rolls">Rollos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequirements">Requerimientos Especiales</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Instrucciones especiales de manejo, apilamiento, orientación, etc."
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="insuranceValue">Valor del Seguro (Q)</Label>
                <Input
                  id="insuranceValue"
                  type="number"
                  placeholder="ej. 50000"
                  value={formData.insuranceValue}
                  onChange={(e) => handleInputChange('insuranceValue', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipment Preferences and Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Preferencias y Requisitos del Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="priority">Prioridad del Envío</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temperature">Control de Temperatura</Label>
                  <Select value={formData.temperature} onValueChange={(value) => handleInputChange('temperature', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambient">Ambiente</SelectItem>
                      <SelectItem value="refrigerated">Refrigerado (2-8°C)</SelectItem>
                      <SelectItem value="frozen">Congelado (-18°C)</SelectItem>
                      <SelectItem value="controlled">Controlado (15-25°C)</SelectItem>
                      <SelectItem value="dry">Seco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="humidity">Control de Humedad</Label>
                  <Select value={formData.humidity} onValueChange={(value) => handleInputChange('humidity', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="controlled">Controlada</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="customs"
                    checked={formData.customs}
                    onChange={(e) => handleInputChange('customs', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="customs">Requiere Trámites de Aduana</Label>
                </div>

                <div>
                  <Label htmlFor="documents">Documentos Requeridos</Label>
                  <Select value="" onValueChange={(value) => {
                    if (!formData.documents.includes(value)) {
                      handleInputChange('documents', [...formData.documents, value]);
                    }
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Agregar documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Factura Comercial</SelectItem>
                      <SelectItem value="packing">Lista de Empaque</SelectItem>
                      <SelectItem value="certificate">Certificado de Origen</SelectItem>
                      <SelectItem value="permit">Permiso de Importación</SelectItem>
                      <SelectItem value="msds">Hoja de Seguridad (MSDS)</SelectItem>
                      <SelectItem value="insurance">Póliza de Seguro</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.documents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">
                            {doc === 'invoice' && 'Factura Comercial'}
                            {doc === 'packing' && 'Lista de Empaque'}
                            {doc === 'certificate' && 'Certificado de Origen'}
                            {doc === 'permit' && 'Permiso de Importación'}
                            {doc === 'msds' && 'Hoja de Seguridad (MSDS)'}
                            {doc === 'insurance' && 'Póliza de Seguro'}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInputChange('documents', formData.documents.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Estimation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Estimación de Precio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-2">
                    Calcula una estimación del costo basado en la distancia y tipo de carga
                  </p>
                  {estimatedPrice && (
                    <div className="text-2xl font-bold text-primary">
                      Q {estimatedPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEstimatePrice}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular Precio
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" type="button" onClick={() => navigate('/client-dashboard')}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                'Crear Envío'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
