import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Upload, Package, Truck, DollarSign, Clock, Search, Filter, MapPin, Weight, Ruler, FileText, MessageSquare, Phone, Star, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
const MotionTableRow = motion(TableRow);

// Mock data for published cargo
const mockPublishedCargo = [
  {
    id: 1,
    origin: 'Ciudad de Guatemala',
    destination: 'Antigua Guatemala',
    cargoType: 'General',
    weight: '500 kg',
    dimensions: '120 x 80 x 60 cm',
    budget: 'Q 2,500',
    status: 'Activo',
    date: '2024-01-15',
    offers: 3,
    description: 'Carga de productos electrónicos que requiere manejo cuidadoso. Incluye computadoras, monitores y accesorios. Necesita transporte refrigerado.',
    pickupDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    specialRequirements: 'Transporte refrigerado, manejo cuidadoso',
    contactPhone: '+502 1234-5678',
    contactEmail: 'cliente@ejemplo.com'
  },
  {
    id: 2,
    origin: 'Quetzaltenango',
    destination: 'Huehuetenango',
    cargoType: 'Frágil',
    weight: '200 kg',
    dimensions: '80 x 60 x 40 cm',
    budget: 'Q 1,800',
    status: 'En Proceso',
    date: '2024-01-14',
    offers: 5,
    description: 'Carga de cristalería y porcelana fina. Requiere embalaje especial y transporte sin vibraciones.',
    pickupDate: '2024-01-18',
    deliveryDate: '2024-01-19',
    specialRequirements: 'Sin vibraciones, embalaje especial',
    contactPhone: '+502 2345-6789',
    contactEmail: 'cliente2@ejemplo.com'
  },
  {
    id: 3,
    origin: 'Escuintla',
    destination: 'Retalhuleu',
    cargoType: 'Perecedero',
    weight: '1,000 kg',
    dimensions: '200 x 150 x 100 cm',
    budget: 'Q 4,200',
    status: 'Completado',
    date: '2024-01-13',
    offers: 2,
    description: 'Carga de productos agrícolas frescos. Incluye frutas y verduras que requieren refrigeración.',
    pickupDate: '2024-01-16',
    deliveryDate: '2024-01-17',
    specialRequirements: 'Refrigeración constante',
    contactPhone: '+502 3456-7890',
    contactEmail: 'cliente3@ejemplo.com'
  },
  {
    id: 4,
    origin: 'Chimaltenango',
    destination: 'Sacatepéquez',
    cargoType: 'General',
    weight: '750 kg',
    dimensions: '150 x 100 x 80 cm',
    budget: 'Q 3,100',
    status: 'Activo',
    date: '2024-01-12',
    offers: 4,
    description: 'Carga de muebles y electrodomésticos. Incluye sofás, mesas y refrigeradores.',
    pickupDate: '2024-01-19',
    deliveryDate: '2024-01-21',
    specialRequirements: 'Manejo cuidadoso, no apilar',
    contactPhone: '+502 4567-8901',
    contactEmail: 'cliente4@ejemplo.com'
  },
  {
    id: 5,
    origin: 'Petén',
    destination: 'Alta Verapaz',
    cargoType: 'Peligroso',
    weight: '300 kg',
    dimensions: '100 x 80 x 60 cm',
    budget: 'Q 5,500',
    status: 'Pendiente',
    date: '2024-01-11',
    offers: 1,
    description: 'Carga de productos químicos industriales. Requiere certificaciones especiales y transporte autorizado.',
    pickupDate: '2024-01-25',
    deliveryDate: '2024-01-27',
    specialRequirements: 'Certificaciones especiales, transporte autorizado',
    contactPhone: '+502 5678-9012',
    contactEmail: 'cliente5@ejemplo.com'
  }
];

// Mock offers data
const mockOffers = [
  {
    id: 1,
    transporterName: 'Transportes Rápidos GT',
    price: 'Q 2,300',
    rating: 4.8,
    reviews: 127,
    estimatedTime: '2 días',
    vehicle: 'Camión Refrigerado',
    experience: '5 años',
    phone: '+502 1111-1111',
    status: 'Pendiente'
  },
  {
    id: 2,
    transporterName: 'Logística Express',
    price: 'Q 2,600',
    rating: 4.5,
    reviews: 89,
    estimatedTime: '1.5 días',
    vehicle: 'Furgón Cerrado',
    experience: '3 años',
    phone: '+502 2222-2222',
    status: 'Aceptada'
  },
  {
    id: 3,
    transporterName: 'Cargo Seguro',
    price: 'Q 2,400',
    rating: 4.9,
    reviews: 203,
    estimatedTime: '2.5 días',
    vehicle: 'Camión Plataforma',
    experience: '8 años',
    phone: '+502 3333-3333',
    status: 'Pendiente'
  }
];

const guatemalaCities = [
  'Ciudad de Guatemala',
  'Antigua Guatemala',
  'Quetzaltenango',
  'Escuintla',
  'Puerto Barrios',
  'Cobán',
  'Chimaltenango',
  'Sacatepéquez',
  'Retalhuleu',
  'Huehuetenango',
  'Petén',
  'Alta Verapaz',
  'Jalapa',
  'Jutiapa',
  'Zacapa',
  'Izabal',
  'Santa Rosa',
  'Suchitepéquez',
  'Sololá',
  'Totonicapán',
  'San Marcos',
];

export default function PublishCargo() {
  const [date, setDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('publish');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoType: '',
    weight: '',
    dimensions: '',
    description: '',
    budget: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cargo published:', { ...formData, date });
    toast({
      title: '¡Carga publicada!',
      description: 'Tu carga ha sido publicada exitosamente y está disponible para transportistas en Guatemala.',
      variant: 'default',
    });
    // Reset form
    setFormData({
      origin: '',
      destination: '',
      cargoType: '',
      weight: '',
      dimensions: '',
      description: '',
      budget: ''
    });
    setDate(undefined);
  };

  // Filter cargo based on search and status
  const filteredCargo = mockPublishedCargo.filter(cargo => {
    const matchesSearch = cargo.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.cargoType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cargo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalCargo = mockPublishedCargo.length;
  const activeCargo = mockPublishedCargo.filter(c => c.status === 'Activo').length;
  const totalBudget = mockPublishedCargo.reduce((sum, cargo) => sum + parseInt(cargo.budget.replace('Q ', '').replace(',', '')), 0);
  const avgOffers = mockPublishedCargo.reduce((sum, cargo) => sum + cargo.offers, 0) / mockPublishedCargo.length;

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Activo': 'bg-blue-100 text-blue-800 border-blue-200',
      'En Proceso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completado': 'bg-green-100 text-green-800 border-green-200',
      'Pendiente': 'bg-gray-100 text-gray-800 border-gray-200',
      'Rechazada': 'bg-red-100 text-red-800 border-red-200'
    };
    return `${statusStyles[status as keyof typeof statusStyles]} font-semibold`;
  };

  const getOfferStatusBadge = (status: string) => {
    const statusStyles = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Aceptada': 'bg-green-100 text-green-800 border-green-200',
      'Rechazada': 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]} font-semibold`}>
        {status}
      </Badge>
    );
  };

  const handleViewCargo = (cargo: any) => {
    setSelectedCargo(cargo);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">Publicar Nueva Carga</h1>
          <p className="text-blue-600">Completa el formulario para publicar un envío en Guatemala.</p>
        </div>
      </div>
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Datos de la Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Origen</Label>
             <Select
               value={formData.origin}
               onValueChange={value => setFormData({ ...formData, origin: value })}
               required
             >
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona ciudad de origen" />
               </SelectTrigger>
               <SelectContent>
                 {guatemalaCities.map(city => (
                   <SelectItem key={city} value={city}>{city}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
            </div>
            <div>
              <Label>Destino</Label>
             <Select
               value={formData.destination}
               onValueChange={value => setFormData({ ...formData, destination: value })}
               required
             >
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona ciudad de destino" />
               </SelectTrigger>
               <SelectContent>
                 {guatemalaCities.map(city => (
                   <SelectItem key={city} value={city}>{city}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
            </div>
            <div>
              <Label>Tipo de Carga</Label>
              <Input
                value={formData.cargoType}
                onChange={e => setFormData({ ...formData, cargoType: e.target.value })}
                placeholder="Ej: General, Frágil, Perecedero, Peligroso"
                required
              />
            </div>
            <div>
              <Label>Peso (kg)</Label>
              <Input
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Ej: 500"
                required
              />
            </div>
            <div>
              <Label>Dimensiones (cm)</Label>
              <Input
                value={formData.dimensions}
                onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="Ej: 120 x 80 x 60"
                required
              />
            </div>
            <div>
              <Label>Presupuesto (Q)</Label>
              <Input
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                placeholder="Ej: 2500"
                required
                type="number"
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los detalles y requisitos especiales de la carga"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 px-8 py-2"
              >
                Publicar Carga
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Listado de cargas publicadas */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Tus Cargas Publicadas</CardTitle>
        </CardHeader>
        <CardContent>
         <AnimatePresence>
            {filteredCargo.length === 0 ? (
             <motion.div
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-center text-blue-400 py-8"
             >
               <p className="text-lg">No tienes cargas publicadas.</p>
               <Button
                 variant="outline"
                 className="mt-4 border-blue-300 text-blue-700"
                 onClick={() => setActiveTab('publish')}
               >
                 Publicar tu primera carga
               </Button>
             </motion.div>
            ) : (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="overflow-x-auto"
             >
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Origen</TableHead>
                     <TableHead>Destino</TableHead>
                     <TableHead>Tipo</TableHead>
                     <TableHead>Peso</TableHead>
                     <TableHead>Dimensiones</TableHead>
                     <TableHead>Presupuesto (Q)</TableHead>
                     <TableHead>Estado</TableHead>
                     <TableHead>Ofertas</TableHead>
                     <TableHead>Acciones</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredCargo.map((cargo, idx) => (
                     <MotionTableRow
                       key={cargo.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.05 }}
                       className="hover:bg-blue-50 transition-all"
                     >
                       <TableCell>{cargo.origin}</TableCell>
                       <TableCell>{cargo.destination}</TableCell>
                       <TableCell>{cargo.cargoType}</TableCell>
                       <TableCell>{cargo.weight}</TableCell>
                       <TableCell>{cargo.dimensions}</TableCell>
                       <TableCell>{cargo.budget}</TableCell>
                       <TableCell>
                         <Badge className={getStatusBadge(cargo.status)}>{cargo.status}</Badge>
                       </TableCell>
                       <TableCell>{cargo.offers}</TableCell>
                       <TableCell>
                         <Button size="sm" variant="outline" onClick={() => setSelectedCargo(cargo)}>
                           Ver Detalles
                         </Button>
                       </TableCell>
                     </MotionTableRow>
                   ))}
                 </TableBody>
               </Table>
             </motion.div>
            )}
         </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}