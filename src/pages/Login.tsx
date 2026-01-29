import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, User, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login: React.FC = () => {
  const { signIn, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');

  // Set initial auth type based on current route
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'client' | 'transporter'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Auto-switch to register tab if on /register route
  useEffect(() => {
    if (location.pathname === '/register') {
      setAuthType('register');
    } else {
      setAuthType('login');
    }
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (authType === 'register') {
        // Handle registration
        const { error } = await signUp(formData.email, formData.password, {
          name: formData.name,
          userType,
          phone: formData.phone,
          company: formData.company,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
          // Don't redirect yet - user needs to confirm email
        }
      } else {
        // Handle login
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          setError(error.message);
        } else {
          // Read the actual role from the authenticated user to avoid relying on UI selection
          //const { data: userData } = await import('@/lib/supabase').then(m => m.supabase.auth.getUser());
          const { data: userData } = await supabase.auth.getUser();
          const actualRole = (userData?.user?.user_metadata as any)?.userType as 'client' | 'transporter' | undefined;

          // Success - redirect based on explicit redirect query or actual role
          if (redirect === 'client-dashboard') {
            navigate('/client-dashboard');
          } else if (redirect === 'transporter-dashboard') {
            navigate('/transporter-dashboard');
          } else if (actualRole === 'transporter') {
            navigate('/transporter-dashboard');
          } else if (actualRole === 'client') {
            navigate('/client-dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="p-8">
          <div className="mb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar a inicio
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold text-center mb-6 text-neutral-900">Bienvenido a VAIVEN</CardTitle>
          
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={authType} onValueChange={(v) => setAuthType(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="border border-neutral-200 focus:border-primary"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="border border-neutral-200 focus:border-primary pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="border border-neutral-200 focus:border-primary"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="border border-neutral-200 focus:border-primary"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength={6}
                      className="border border-neutral-200 focus:border-primary pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="border border-neutral-200 focus:border-primary"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa (opcional)</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="border border-neutral-200 focus:border-primary"
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={userType === 'client' ? 'default' : 'outline'}
                    onClick={() => setUserType('client')}
                    className="flex-1 flex items-center gap-2"
                    disabled={loading}
                  >
                    <User className="h-4 w-4" />
                    Cliente
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'transporter' ? 'default' : 'outline'}
                    onClick={() => setUserType('transporter')}
                    className="flex-1 flex items-center gap-2"
                    disabled={loading}
                  >
                    <Truck className="h-4 w-4" />
                    Transportista
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Registrando...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 
