import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Clock, CheckCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function ClientDashboardContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { title: 'Cargas Activas', value: '3', icon: Package, color: 'bg-primary/10 text-primary' },
    { title: 'En Tránsito', value: '2', icon: Truck, color: 'bg-accent/10 text-accent' },
    { title: 'Pendientes', value: '1', icon: Clock, color: 'bg-yellow-500/10 text-yellow-600' },
    { title: 'Completadas', value: '15', icon: CheckCircle, color: 'bg-green-500/10 text-green-600' },
  ];

  const recentShipments = [
    { id: '001', origin: 'Ciudad de Guatemala', destination: 'Quetzaltenango', status: 'En tránsito', date: '2024-02-15' },
    { id: '002', origin: 'Antigua Guatemala', destination: 'Escuintla', status: 'Completado', date: '2024-02-14' },
    { id: '003', origin: 'Cobán', destination: 'Puerto Barrios', status: 'Pendiente', date: '2024-02-13' },
  ];

  // Mock data for charts
  const monthlyShipments = [
    { month: 'Ene', envios: 2 },
    { month: 'Feb', envios: 3 },
    { month: 'Mar', envios: 1 },
    { month: 'Abr', envios: 4 },
    { month: 'May', envios: 2 },
    { month: 'Jun', envios: 3 },
    { month: 'Jul', envios: 5 },
    { month: 'Ago', envios: 4 },
  ];
  const cargoTypes = [
    { type: 'Electrónicos', value: 5, color: '#3B82F6' },
    { type: 'Agrícolas', value: 3, color: '#10B981' },
    { type: 'Textiles', value: 2, color: '#F59E0B' },
    { type: 'Otros', value: 1, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Hola, {user?.name || 'Cliente'} 👋</h1>
          <p className="text-neutral-500">Este es tu panel principal. Aquí puedes ver el resumen de tus envíos y actividad en Guatemala.</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors"
          onClick={() => navigate('/client-dashboard?tab=publish')}
        >
          <PlusCircle className="h-5 w-5" /> Publicar Nueva Carga
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card className="group border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                      <p className="text-sm text-neutral-500">{stat.title}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-neutral-900">Envíos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyShipments} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis allowDecimals={false} stroke="#666" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="envios" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} name="Envíos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-neutral-900">Tipos de Carga</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={cargoTypes} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={70} label>
                  {cargoTypes.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments */}
      <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-900">Envíos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {recentShipments.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-neutral-400 py-8"
              >
                <p className="text-lg">No tienes envíos recientes.</p>
                <Button
                  variant="outline"
                  className="mt-4 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  onClick={() => navigate('/client-dashboard?tab=publish')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Publicar tu primer envío
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {recentShipments.map((shipment, idx) => (
                  <motion.div
                    key={shipment.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="font-semibold text-neutral-900">#{shipment.id}</p>
                      <p className="text-sm text-neutral-600">{shipment.origin} → {shipment.destination}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-colors duration-300 ${
                        shipment.status === 'Completado' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'En tránsito' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.status}
                      </span>
                      <p className="text-sm text-neutral-500 mt-1">{shipment.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}