import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Bell, Shield, CreditCard, MapPin, Phone, Mail, Building, Calendar, Star, Edit, Save, Camera, Trash2, Download, Upload, Key, Lock, Eye, EyeOff, CheckCircle, Info, AlertCircle, Circle } from 'lucide-react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userProfile = {
    name: 'Carlos Méndez',
    email: 'carlos.mendez@empresa.com',
    phone: '+502 1234-5678',
    company: 'Tech Solutions Guatemala',
    position: 'Gerente de Logística',
    address: 'Zona 10, Ciudad de Guatemala',
    joinDate: 'Enero 2023',
    avatar: '/placeholder.svg',
    rating: 4.8,
    totalShipments: 45,
    totalSpent: 'Q 125,000',
    memberSince: '1 año 3 meses',
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      },
      language: 'Español',
      currency: 'Quetzales (GTQ)',
      timezone: 'America/Guatemala',
      theme: 'Claro'
    },
    paymentMethods: [
      {
        id: 1,
        type: 'Tarjeta de Crédito',
        last4: '1234',
        expiry: '12/25',
        isDefault: true
      },
      {
        id: 2,
        type: 'Transferencia Bancaria',
        bank: 'Banco Industrial',
        account: '****5678',
        isDefault: false
      }
    ],
    recentActivity: [
      {
        id: 1,
        action: 'Envío completado',
        description: 'Envío #S001 entregado exitosamente',
        date: '2024-01-15 14:30',
        type: 'success'
      },
      {
        id: 2,
        action: 'Cotización aceptada',
        description: 'Cotización #Q002 aceptada por Q 1,650',
        date: '2024-01-14 16:20',
        type: 'info'
      },
      {
        id: 3,
        action: 'Perfil actualizado',
        description: 'Información de contacto actualizada',
        date: '2024-01-13 10:15',
        type: 'warning'
      }
    ]
  };

  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    company: userProfile.company,
    position: userProfile.position,
    address: userProfile.address
  });

  const [preferences, setPreferences] = useState(userProfile.preferences);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Mi Perfil</h1>
        <p className="text-blue-600">Gestiona tu información personal y preferencias de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto border-4 border-blue-200">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-bold">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-blue-800">{userProfile.name}</h2>
                  <p className="text-blue-600">{userProfile.position}</p>
                  <p className="text-sm text-blue-500">{userProfile.company}</p>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-blue-800">{userProfile.rating}</span>
                  <span className="text-sm text-blue-600">({userProfile.totalShipments} envíos)</span>
                </div>

                <Separator />

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">{userProfile.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">Miembro desde {userProfile.memberSince}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-800">{userProfile.totalShipments}</p>
                    <p className="text-sm text-blue-600">Envíos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-800">{userProfile.totalSpent}</p>
                    <p className="text-sm text-blue-600">Total Gastado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
              <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Personal</TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Preferencias</TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Pagos</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Actividad</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Información Personal
                    </CardTitle>
                    <Button 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                    >
                      {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Guardar' : 'Editar'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-800 font-medium">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-800 font-medium">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-800 font-medium">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-blue-800 font-medium">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-blue-800 font-medium">Cargo</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-blue-800 font-medium">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Preferencias de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-4">Notificaciones</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-800">Notificaciones por Email</p>
                          <p className="text-sm text-blue-600">Recibe actualizaciones importantes por correo</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, email: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-800">Notificaciones SMS</p>
                          <p className="text-sm text-blue-600">Recibe alertas por mensaje de texto</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.sms}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, sms: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-800">Notificaciones Push</p>
                          <p className="text-sm text-blue-600">Recibe notificaciones en tiempo real</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, push: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-800">Marketing</p>
                          <p className="text-sm text-blue-600">Recibe ofertas y promociones</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.marketing}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, marketing: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-blue-800 font-medium">Idioma</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Español">Español</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-800 font-medium">Moneda</Label>
                      <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quetzales (GTQ)">Quetzales (GTQ)</SelectItem>
                          <SelectItem value="Dólares (USD)">Dólares (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-800 font-medium">Zona Horaria</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Guatemala">Guatemala (GMT-6)</SelectItem>
                          <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-800 font-medium">Tema</Label>
                      <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Claro">Claro</SelectItem>
                          <SelectItem value="Oscuro">Oscuro</SelectItem>
                          <SelectItem value="Automático">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Preferencias
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Métodos de Pago
                    </CardTitle>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Agregar Método
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800">{method.type}</p>
                          <p className="text-sm text-blue-600">
                            {method.last4 ? `****${method.last4}` : method.account}
                            {method.expiry && ` • Expira ${method.expiry}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Predeterminado</Badge>
                        )}
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium text-blue-800">{activity.action}</p>
                        <p className="text-sm text-blue-600">{activity.description}</p>
                        <p className="text-xs text-blue-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 