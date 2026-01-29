import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Route, 
  Package, 
  Euro, 
  Star, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Truck,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  BarChart3,
  Activity,
  Target,
  Award,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';
import PublishRoute from './PublishRoute';
import ViewCargo from './ViewCargo';
import ManageOffers from './ManageOffers';
import TransporterTracking from './TransporterTracking';
import TransporterHistory from './TransporterHistory';
import TransporterProfile from './TransporterProfile';

interface TransporterDashboardContentProps {
  activeTab: string;
}

export default function TransporterDashboardContent({ activeTab }: TransporterDashboardContentProps) {
  if (activeTab === 'routes') {
    return <PublishRoute />;
  }

  if (activeTab === 'cargo') {
    return <ViewCargo />;
  }

  if (activeTab === 'offers') {
    return <ManageOffers />;
  }

  if (activeTab === 'tracking') {
    return <TransporterTracking />;
  }

  if (activeTab === 'history') {
    return <TransporterHistory />;
  }

  if (activeTab === 'profile') {
    return <TransporterProfile />;
  }

  const stats = [
    { 
      title: 'Rutas Activas', 
      value: '5', 
      change: '+2', 
      changeType: 'positive',
      icon: Route, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up',
      description: 'Rutas en curso'
    },
    { 
      title: 'Cargas Asignadas', 
      value: '8', 
      change: '+3', 
      changeType: 'positive',
      icon: Package, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'up',
      description: 'Cargas activas'
    },
    { 
      title: 'Ingresos del Mes', 
      value: 'Q2,450', 
      change: '+12%', 
      changeType: 'positive',
      icon: Euro, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: 'up',
      description: 'Ingresos totales'
    },
    { 
      title: 'Calificación', 
      value: '4.8', 
      change: '+0.2', 
      changeType: 'positive',
      icon: Star, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      trend: 'up',
      description: 'Puntuación promedio'
    },
  ];

  const recentActivity = [
    { 
      id: '001', 
      type: 'Carga asignada', 
      description: 'Ciudad de Guatemala → Quetzaltenango', 
      time: '2 horas', 
      status: 'nuevo',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      priority: 'high'
    },
    { 
      id: '002', 
      type: 'Entrega completada', 
      description: 'Escuintla → Retalhuleu', 
      time: '1 día', 
      status: 'completado',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      priority: 'normal'
    },
    { 
      id: '003', 
      type: 'Nueva oferta', 
      description: 'Cobán → Puerto Barrios', 
      time: '3 horas', 
      status: 'pendiente',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      priority: 'medium'
    },
    { 
      id: '004', 
      type: 'Ruta publicada', 
      description: 'Petén → Alta Verapaz', 
      time: '5 horas', 
      status: 'activo',
      icon: Route,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      priority: 'normal'
    },
  ];

  const upcomingDeliveries = [
    {
      id: '001',
      cargo: 'Carga #001',
      route: 'Ciudad de Guatemala → Quetzaltenango',
      time: 'Mañana 14:30',
      status: 'Programada',
      progress: 75,
      weight: '500 kg',
      price: 'Q1,250',
      priority: 'high',
      client: 'Distribuidora Maya'
    },
    {
      id: '002',
      cargo: 'Carga #002',
      route: 'Escuintla → Retalhuleu',
      time: '17 Ene 10:00',
      status: 'En preparación',
      progress: 25,
      weight: '300 kg',
      price: 'Q750',
      priority: 'normal',
      client: 'Alimentos del Norte'
    },
    {
      id: '003',
      cargo: 'Carga #003',
      route: 'Cobán → Puerto Barrios',
      time: '18 Ene 16:00',
      status: 'Confirmada',
      progress: 10,
      weight: '800 kg',
      price: 'Q1,100',
      priority: 'medium',
      client: 'IT Solutions GT'
    }
  ];

  const performanceMetrics = [
    { 
      label: 'Tiempo promedio de entrega', 
      value: '2.3 días', 
      target: '2.0 días', 
      status: 'warning',
      icon: Clock,
      progress: 87
    },
    { 
      label: 'Tasa de satisfacción', 
      value: '96%', 
      target: '95%', 
      status: 'success',
      icon: Star,
      progress: 96
    },
    { 
      label: 'Cargas completadas', 
      value: '142', 
      target: '150', 
      status: 'warning',
      icon: CheckCircle,
      progress: 95
    },
    { 
      label: 'Ingresos mensuales', 
      value: '€2,450', 
      target: '€2,500', 
      status: 'success',
      icon: Euro,
      progress: 98
    }
  ];

  const quickActions = [
    { label: 'Publicar Ruta', icon: Route, color: 'bg-blue-500', href: '#routes' },
    { label: 'Ver Cargas', icon: Package, color: 'bg-blue-500', href: '#cargo' },
    { label: 'Gestionar Ofertas', icon: FileText, color: 'bg-purple-500', href: '#offers' },
    { label: 'Seguimiento', icon: MapPin, color: 'bg-orange-500', href: '#tracking' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Transportista</h1>
          <p className="text-gray-600 mt-1">Resumen de tu actividad y rendimiento</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Calendario
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Truck className="h-4 w-4 mr-2" />
            Nueva Ruta
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`${stat.borderColor} ${stat.bgColor} hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
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
                  <span className={`text-xs ${stat.changeType === 'positive' ? 'text-blue-600' : 'text-red-600'}`}>
                    {stat.change} este mes
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Actividad Reciente
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Ver todo
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group">
                        <div className={`p-2 rounded-lg ${activity.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.type}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            activity.status === 'completado' ? 'default' :
                            activity.status === 'nuevo' ? 'secondary' :
                            activity.status === 'activo' ? 'outline' :
                            'outline'
                          } className={
                            activity.status === 'completado' ? 'bg-blue-100 text-blue-800' :
                            activity.status === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                            activity.status === 'activo' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {activity.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">hace {activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deliveries */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    Próximas Entregas
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Ver todas
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeliveries.map((delivery) => (
                    <div key={delivery.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{delivery.cargo}</p>
                          <p className="text-sm text-gray-600">{delivery.route}</p>
                          <p className="text-xs text-gray-500">{delivery.client}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-500">
                            {delivery.status}
                          </Badge>
                          {delivery.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progreso:</span>
                          <span className="text-gray-900">{delivery.progress}%</span>
                        </div>
                        <Progress value={delivery.progress} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{delivery.weight}</span>
                          <span className="font-medium text-gray-900">{delivery.price}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {delivery.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                Métricas de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        </div>
                        <Badge variant={
                          metric.status === 'success' ? 'default' : 'secondary'
                        } className={
                          metric.status === 'success' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }>
                          {metric.status === 'success' ? '✓' : '⚠'}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                      <div className="text-sm text-gray-500 mb-3">Meta: {metric.target}</div>
                      <Progress value={metric.progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Análisis de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Los gráficos de analytics estarán disponibles próximamente</p>
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                    Configurar Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-500" />
                  Logros y Reconocimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Transportista Destacado</p>
                      <p className="text-sm text-yellow-700">Completaste 100+ entregas exitosas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Excelente Calificación</p>
                      <p className="text-sm text-blue-700">Mantienes 4.8+ estrellas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Cliente Fiel</p>
                      <p className="text-sm text-blue-700">5 clientes recurrentes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}