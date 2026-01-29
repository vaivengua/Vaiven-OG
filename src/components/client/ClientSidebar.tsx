import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  FileText, 
  MapPin, 
  History, 
  User,
  ChevronLeft,
  ChevronRight,
  Receipt,
  BarChart3
} from 'lucide-react';

interface ClientSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'publish', label: 'Publicar Carga', icon: Package },
  { id: 'search', label: 'Buscar Transportistas', icon: Search },
  { id: 'quotes', label: 'Cotizaciones', icon: FileText },
  { id: 'tracking', label: 'Seguimiento', icon: MapPin },
  { id: 'history', label: 'Historial', icon: History },
  { id: 'facturas', label: 'Facturas', icon: Receipt },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function ClientSidebar({ activeTab, onTabChange }: ClientSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white border-r border-neutral-200 h-full shadow-lg transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border-2 border-neutral-200 rounded-full p-1 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 z-10 shadow-md"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-neutral-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-neutral-600" />
        )}
      </Button>

      {/* Header */}
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "p-2" : "p-8"
      )}>
        <h2 className={cn(
          "font-bold text-primary transition-all duration-300",
          isCollapsed ? "text-lg" : "text-2xl"
        )}>
          {isCollapsed ? "PC" : "Panel Cliente"}
        </h2>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "mt-6 space-y-2 transition-all duration-300 ease-in-out",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start font-medium transition-all duration-200 relative group",
                isCollapsed ? "px-2 py-3 rounded-lg" : "px-5 py-3 rounded-lg",
                isActive 
                  ? "bg-primary text-white shadow-md hover:bg-primary/90" 
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn(
                "transition-all duration-200",
                isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"
              )} />
              {!isCollapsed && (
                <span className="transition-all duration-200">{item.label}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                  {item.label}
                </div>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}