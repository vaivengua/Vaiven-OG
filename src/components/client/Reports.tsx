import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  FileText, 
  Download, 
  Filter, 
  RefreshCw, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Activity,
  Target,
  Award,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  Route,
  Fuel,
  Gauge,
  Thermometer,
  Shield,
  Globe,
  Building,
  Car
} from 'lucide-react';

// Helper to parse 'Q 425,000' to 425000
function parseQuetzal(qstr: string): number {
  return Number(qstr.replace(/[^\d.-]/g, ''));
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock data for analytics
  const analyticsData = {
    overview: {
      totalShipments: 156,
      totalRevenue: 'Q 425,000',
      averageRating: 4.7,
      totalDistance: '8,450 km',
      completionRate: 98.5,
      onTimeDelivery: 94.2,
      costSavings: 'Q 32,500',
      carbonFootprint: '2.3 tons CO2 saved'
    },
    monthlyTrends: [
      { month: 'Ene', shipments: 12, revenue: 32000, rating: 4.6, deliveries: 11, delays: 1 },
      { month: 'Feb', shipments: 15, revenue: 38000, rating: 4.7, deliveries: 14, delays: 1 },
      { month: 'Mar', shipments: 18, revenue: 45000, rating: 4.8, deliveries: 17, delays: 1 },
      { month: 'Abr', shipments: 14, revenue: 36000, rating: 4.5, deliveries: 13, delays: 1 },
      { month: 'May', shipments: 22, revenue: 55000, rating: 4.9, deliveries: 21, delays: 1 },
      { month: 'Jun', shipments: 19, revenue: 48000, rating: 4.7, deliveries: 18, delays: 1 },
      { month: 'Jul', shipments: 25, revenue: 62000, rating: 4.8, deliveries: 24, delays: 1 },
      { month: 'Ago', shipments: 21, revenue: 52000, rating: 4.6, deliveries: 20, delays: 1 }
    ],
    weeklyData: [
      { week: 'Sem 1', shipments: 8, revenue: 22000, onTime: 7, delayed: 1 },
      { week: 'Sem 2', shipments: 12, revenue: 32000, onTime: 11, delayed: 1 },
      { week: 'Sem 3', shipments: 15, revenue: 41000, onTime: 14, delayed: 1 },
      { week: 'Sem 4', shipments: 18, revenue: 48000, onTime: 17, delayed: 1 },
      { week: 'Sem 5', shipments: 14, revenue: 38000, onTime: 13, delayed: 1 },
      { week: 'Sem 6', shipments: 16, revenue: 42000, onTime: 15, delayed: 1 },
      { week: 'Sem 7', shipments: 20, revenue: 54000, onTime: 19, delayed: 1 },
      { week: 'Sem 8', shipments: 22, revenue: 58000, onTime: 21, delayed: 1 }
    ],
    cargoTypes: [
      { type: 'Electrónicos', shipments: 45, revenue: 125000, percentage: 28.8, color: '#3B82F6' },
      { type: 'Productos Agrícolas', shipments: 38, revenue: 98000, percentage: 23.1, color: '#10B981' },
      { type: 'Textiles', shipments: 32, revenue: 85000, percentage: 20.0, color: '#F59E0B' },
      { type: 'Cristalería', shipments: 25, revenue: 67000, percentage: 15.8, color: '#EF4444' },
      { type: 'Maquinaria', shipments: 16, revenue: 50000, percentage: 11.8, color: '#8B5CF6' }
    ],
    routes: [
      { route: 'Guatemala → Antigua', shipments: 28, revenue: 75000, avgTime: '2.5h', color: '#3B82F6' },
      { route: 'Quetzaltenango → Huehuetenango', shipments: 22, revenue: 58000, avgTime: '3.2h', color: '#10B981' },
      { route: 'Escuintla → Retalhuleu', shipments: 19, revenue: 52000, avgTime: '4.1h', color: '#F59E0B' },
      { route: 'Chimaltenango → Sacatepéquez', shipments: 15, revenue: 42000, avgTime: '1.8h', color: '#EF4444' },
      { route: 'Petén → Izabal', shipments: 12, revenue: 35000, avgTime: '8.5h', color: '#8B5CF6' }
    ],
    transporters: [
      { name: 'Transportes Rápidos GT', shipments: 35, rating: 4.8, revenue: 95000, color: '#3B82F6' },
      { name: 'Logística Maya', shipments: 28, rating: 4.9, revenue: 78000, color: '#10B981' },
      { name: 'Cargo Express', shipments: 25, rating: 4.6, revenue: 68000, color: '#F59E0B' },
      { name: 'Transportes Unidos', shipments: 22, rating: 4.7, revenue: 62000, color: '#EF4444' },
      { name: 'Logística Nacional', shipments: 18, rating: 4.5, revenue: 48000, color: '#8B5CF6' }
    ],
    performance: {
      onTimeDeliveries: 147,
      delayedDeliveries: 9,
      totalDeliveries: 156,
      averageDeliveryTime: '3.2 horas',
      fastestDelivery: '1.2 horas',
      slowestDelivery: '12.5 horas',
      customerSatisfaction: 94.2,
      repeatCustomers: 78,
      newCustomers: 23
    },
    financial: {
      totalRevenue: 425000,
      totalCosts: 392500,
      netProfit: 32500,
      profitMargin: 7.6,
      averageOrderValue: 2724,
      monthlyGrowth: 12.5,
      costPerKm: 46.5,
      revenuePerShipment: 2724
    },
    sustainability: {
      carbonFootprint: 2.3,
      fuelEfficiency: 8.2,
      routeOptimization: 15.3,
      greenVehicles: 12,
      totalDistance: 8450,
      emissionsSaved: 1.8
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
          <p className="font-semibold text-blue-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
          <p className="font-semibold text-blue-800">{payload[0].name}</p>
          <p className="text-sm text-blue-600">
            Envíos: {payload[0].value}
          </p>
          <p className="text-sm text-blue-600">
            Porcentaje: {((payload[0].value / analyticsData.overview.totalShipments) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Reportes</h1>
        <p className="text-blue-600">Análisis completo de tu actividad logística y métricas de rendimiento</p>
      </div>

      {/* Controls */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                  <SelectItem value="1y">Último año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <FileText className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart - Monthly Trends */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <LineChartIcon className="h-5 w-5" />
              Tendencias Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="shipments" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Envíos"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Gastos (Q)"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart - Weekly Performance */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              <Activity className="h-5 w-5" />
              Rendimiento Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="onTime" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="A Tiempo"
                />
                <Area 
                  type="monotone" 
                  dataKey="delayed" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Retrasados"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Cargo Types Distribution */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              <PieChartIcon className="h-5 w-5" />
              Distribución por Tipo de Carga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.cargoTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="shipments"
                >
                  {analyticsData.cargoTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Route Performance */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              <Route className="h-5 w-5" />
              Rendimiento por Ruta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.routes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="route" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="shipments" fill="#3B82F6" name="Envíos" />
                <Bar dataKey="revenue" fill="#10B981" name="Gastos (Q)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">General</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Tendencias</TabsTrigger>
          <TabsTrigger value="cargo" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Tipos de Carga</TabsTrigger>
          <TabsTrigger value="routes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Rutas</TabsTrigger>
          <TabsTrigger value="transporters" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Transportistas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="w-full">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl w-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Resumen Ejecutivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-blue-800">{analyticsData.overview.totalShipments}</div>
                    <div className="text-sm text-blue-600">Envíos Totales</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-green-800">Q {analyticsData.overview.totalRevenue}</div>
                    <div className="text-sm text-green-600">Gastos Totales</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-orange-800">Q {(
                      parseQuetzal(analyticsData.overview.totalRevenue) / analyticsData.overview.totalShipments
                    ).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div className="text-sm text-orange-600">Costo Promedio por Envío</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-purple-800">{analyticsData.overview.totalDistance}</div>
                    <div className="text-sm text-purple-600">Distancia Total</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-2 border-t border-blue-100 mt-2 text-sm">
                  <div className="flex-1 text-blue-600">Entregas a Tiempo: <span className="font-semibold text-blue-800">{analyticsData.performance.onTimeDeliveries}</span></div>
                  <div className="flex-1 text-blue-600">Rutas Más Usadas: <span className="font-semibold text-blue-800">Guatemala → Antigua, Quetzaltenango → Huehuetenango</span></div>
                  <div className="flex-1 text-blue-600">Huella de Carbono: <span className="font-semibold text-blue-800">{analyticsData.overview.carbonFootprint}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tendencias Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.monthlyTrends.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-800">{month.month}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">{month.shipments} envíos</p>
                        <p className="text-sm text-blue-600">Q {month.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-blue-800">{month.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cargo" className="mt-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Análisis por Tipo de Carga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.cargoTypes.map((cargo) => (
                  <div key={cargo.type} className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">{cargo.type}</p>
                        <p className="text-sm text-blue-600">{cargo.shipments} envíos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-800">{cargo.revenue}</p>
                      <p className="text-sm text-blue-600">{cargo.percentage}% del total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="mt-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Análisis de Rutas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.routes.map((route) => (
                  <div key={route.route} className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Route className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">{route.route}</p>
                        <p className="text-sm text-blue-600">{route.shipments} envíos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-800">{route.revenue}</p>
                      <p className="text-sm text-blue-600">Promedio: {route.avgTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transporters" className="mt-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rendimiento de Transportistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.transporters.map((transporter) => (
                  <div key={transporter.name} className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">{transporter.name}</p>
                        <p className="text-sm text-blue-600">{transporter.shipments} envíos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-blue-800">{transporter.rating}</span>
                      </div>
                      <p className="text-sm text-blue-600">{transporter.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights and Recommendations */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Insights y Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50/50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Excelente Control de Gastos</p>
                  <p className="text-sm text-green-700">Has mantenido tus gastos logísticos bajo control este mes en comparación con el promedio de tus últimos meses.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800">Entregas Puntuales</p>
                  <p className="text-sm text-blue-700">El 94.2% de tus envíos llegaron a tiempo, superando el promedio nacional.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-yellow-50/50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">Oportunidad de Ahorro</p>
                  <p className="text-sm text-yellow-700">Considera consolidar envíos o elegir rutas alternativas para reducir tus costos logísticos.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50/50 rounded-lg border border-purple-200">
                <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-800">Recomendación Personalizada</p>
                  <p className="text-sm text-purple-700">Tus rutas más frecuentes son Guatemala → Antigua y Quetzaltenango → Huehuetenango. Revisa opciones de optimización para estas rutas.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 