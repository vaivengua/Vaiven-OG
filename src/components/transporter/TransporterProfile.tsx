import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Truck, Star, Phone, Mail, MapPin, Calendar, Award, Building, Route, Shield, FileText, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTransporterProfile } from '@/hooks/useTransporterProfile';

export default function TransporterProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    profile: transporterProfile,
    updateProfilePicture,
    removeProfilePicture
  } = useTransporterProfile();
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    bio: '',
    dpi_number: '',
    birth_date: '',
    birth_place: '',
    license_number: '',
    insurance_provider: '',
    insurance_number: '',
    years_experience: '',
    fleet_size: '',
    service_areas: '',
    operating_hours: '',
    preferred_routes: '',
    capacity_kg: '',
    vehicle_types: '',

  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    if (transporterProfile) {
      setProfileData({
        full_name: transporterProfile.full_name || '',
        email: user?.email || '',
        phone: transporterProfile.phone || '',
        company: transporterProfile.company || '',
        address: transporterProfile.address || '',
        bio: transporterProfile.bio || '',
        dpi_number: transporterProfile.dpi_number || '',
        birth_date: transporterProfile.birth_date || '',
        birth_place: transporterProfile.birth_place || '',
        license_number: transporterProfile.license_number || '',
        insurance_provider: transporterProfile.insurance_provider || '',
        insurance_number: transporterProfile.insurance_number || '',
        years_experience: transporterProfile.years_experience ? String(transporterProfile.years_experience) : '',
        fleet_size: transporterProfile.fleet_size ? String(transporterProfile.fleet_size) : '',
        service_areas: transporterProfile.service_areas || '',
        operating_hours: transporterProfile.operating_hours || '',
        preferred_routes: transporterProfile.preferred_routes || '',
        capacity_kg: transporterProfile.capacity_kg ? String(transporterProfile.capacity_kg) : '',
        vehicle_types: transporterProfile.vehicle_types || '',

      });
    }
  }, [transporterProfile, user?.email]);

  const saveProfile = async () => {
    if (!user?.id) return;
    
    // Validate required fields
    if (!profileData.full_name?.trim()) {
      toast({ 
        title: 'Campo requerido', 
        description: 'El nombre completo es obligatorio', 
        variant: 'destructive' 
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Clean up data - convert empty strings to null for optional fields
      const cleanData = {
        user_id: user.id,
        full_name: profileData.full_name.trim(),
        email: profileData.email?.trim() || null,
        phone: profileData.phone?.trim() || null,
        company: profileData.company?.trim() || null,
        address: profileData.address?.trim() || null,
        bio: profileData.bio?.trim() || null,
        dpi_number: profileData.dpi_number?.trim() || null,
        birth_date: profileData.birth_date || null,
        birth_place: profileData.birth_place?.trim() || null,
        license_number: profileData.license_number?.trim() || null,
        insurance_provider: profileData.insurance_provider?.trim() || null,
        insurance_number: profileData.insurance_number?.trim() || null,
        years_experience: profileData.years_experience ? parseInt(profileData.years_experience) : null,
        fleet_size: profileData.fleet_size ? parseInt(profileData.fleet_size) : null,
        service_areas: profileData.service_areas?.trim() || null,
        operating_hours: profileData.operating_hours || null,
        preferred_routes: profileData.preferred_routes?.trim() || null,
        capacity_kg: profileData.capacity_kg ? parseFloat(profileData.capacity_kg) : null,
        vehicle_types: profileData.vehicle_types?.trim() || null,
        updated_at: new Date().toISOString()
      };
      
      console.log('Sending data to database:', cleanData);
      
      let result;
      if (transporterProfile?.id) {
        // Update existing profile
        console.log('Updating existing profile with ID:', transporterProfile.id);
        result = await supabase
          .from('transporter_profiles')
          .update(cleanData)
          .eq('id', transporterProfile.id);
      } else {
        // Create new profile
        console.log('Creating new profile');
        result = await supabase
          .from('transporter_profiles')
          .insert(cleanData);
      }
      
      const { error } = result;
      
      if (error) throw error;
      
      toast({ 
        title: 'Perfil actualizado', 
        description: 'Tu perfil se ha guardado correctamente' 
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      toast({ 
        title: 'Error al guardar', 
        description: `Error: ${err?.message || 'No se pudo guardar el perfil'}`, 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Archivo inválido', description: 'Solo se permiten imágenes', variant: 'destructive' });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Imagen muy grande', description: 'La imagen debe ser menor a 5MB', variant: 'destructive' });
      return;
    }
    
    try {
      const res = await updateProfilePicture(file);
      if (res.success) {
        toast({ title: 'Foto actualizada', description: 'Tu foto de perfil se ha actualizado correctamente' });
      } else {
        toast({ title: 'Error', description: res.error || 'No se pudo actualizar la foto', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al actualizar la foto', variant: 'destructive' });
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const res = await removeProfilePicture();
      if (res.success) {
        toast({ title: 'Foto eliminada', description: 'Tu foto de perfil se ha eliminado' });
      } else {
        toast({ title: 'Error', description: res.error || 'No se pudo eliminar la foto', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error al eliminar la foto', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Mi Perfil de Transportista
          </CardTitle>
          <CardDescription>Gestiona tu información, áreas de servicio y credenciales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
              {transporterProfile?.profile_picture_url ? (
                <img 
                  src={transporterProfile.profile_picture_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                {transporterProfile?.profile_picture_url ? 'Cambiar Foto' : 'Subir Foto'}
              </Button>
              {transporterProfile?.profile_picture_url && (
                <Button variant="outline" size="sm" className="text-red-600" onClick={handleRemoveProfilePicture}>
                  Eliminar Foto
                </Button>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleProfilePictureUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="professional">Información Profesional</TabsTrigger>
              <TabsTrigger value="business">Información de Negocio</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+502 1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      <Building className="inline h-4 w-4 mr-1" />
                      Empresa
                    </Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dpi_number" className="text-sm font-medium">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Número de DPI *
                    </Label>
                    <Input
                      id="dpi_number"
                      value={profileData.dpi_number}
                      onChange={(e) => setProfileData({...profileData, dpi_number: e.target.value})}
                      placeholder="1234 56789 0101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_number" className="text-sm font-medium">
                      <Award className="inline h-4 w-4 mr-1" />
                      Licencia de Conducir *
                    </Label>
                    <Input
                      id="license_number"
                      value={profileData.license_number}
                      onChange={(e) => setProfileData({...profileData, license_number: e.target.value})}
                      placeholder="Número de licencia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="text-sm font-medium">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={profileData.birth_date}
                      onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_place" className="text-sm font-medium">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Lugar de Nacimiento
                    </Label>
                    <Input
                      id="birth_place"
                      value={profileData.birth_place}
                      onChange={(e) => setProfileData({...profileData, birth_place: e.target.value})}
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Tu dirección completa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Biografía
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
                  />
                </div>
              </div>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="years_experience" className="text-sm font-medium">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Años de Experiencia *
                    </Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={profileData.years_experience}
                      onChange={(e) => setProfileData({...profileData, years_experience: e.target.value})}
                      placeholder="5"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fleet_size" className="text-sm font-medium">
                      <Truck className="inline h-4 w-4 mr-1" />
                      Tamaño de Flota
                    </Label>
                    <Input
                      id="fleet_size"
                      type="number"
                      value={profileData.fleet_size}
                      onChange={(e) => setProfileData({...profileData, fleet_size: e.target.value})}
                      placeholder="3"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity_kg" className="text-sm font-medium">
                      <Truck className="inline h-4 w-4 mr-1" />
                      Capacidad Máxima (kg)
                    </Label>
                    <Input
                      id="capacity_kg"
                      type="number"
                      value={profileData.capacity_kg}
                      onChange={(e) => setProfileData({...profileData, capacity_kg: e.target.value})}
                      placeholder="10000"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_types" className="text-sm font-medium">
                      <Truck className="inline h-4 w-4 mr-1" />
                      Tipos de Vehículos
                    </Label>
                    <Input
                      id="vehicle_types"
                      value={profileData.vehicle_types}
                      onChange={(e) => setProfileData({...profileData, vehicle_types: e.target.value})}
                      placeholder="Camión, Furgoneta, Trailer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance_provider" className="text-sm font-medium">
                      <Shield className="inline h-4 w-4 mr-1" />
                      Proveedor de Seguro
                    </Label>
                    <Input
                      id="insurance_provider"
                      value={profileData.insurance_provider}
                      onChange={(e) => setProfileData({...profileData, insurance_provider: e.target.value})}
                      placeholder="Nombre de la aseguradora"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance_number" className="text-sm font-medium">
                      <Shield className="inline h-4 w-4 mr-1" />
                      Número de Póliza
                    </Label>
                    <Input
                      id="insurance_number"
                      value={profileData.insurance_number}
                      onChange={(e) => setProfileData({...profileData, insurance_number: e.target.value})}
                      placeholder="Número de póliza de seguro"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Business Information Tab */}
            <TabsContent value="business" className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service_areas" className="text-sm font-medium">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Áreas de Servicio *
                  </Label>
                  <Input
                    id="service_areas"
                    value={profileData.service_areas}
                    onChange={(e) => setProfileData({...profileData, service_areas: e.target.value})}
                    placeholder="Guatemala, Quetzaltenango, Escuintla"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_routes" className="text-sm font-medium">
                    <Route className="inline h-4 w-4 mr-1" />
                    Rutas Preferidas
                  </Label>
                  <Input
                    id="preferred_routes"
                    value={profileData.preferred_routes}
                    onChange={(e) => setProfileData({...profileData, preferred_routes: e.target.value})}
                    placeholder="Guatemala → Quetzaltenango, Antigua → Escuintla"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Descartar Cambios
        </Button>
        <Button 
          onClick={saveProfile} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? 'Guardando...' : 'Guardar Perfil'}
        </Button>
      </div>
    </div>
  );
}