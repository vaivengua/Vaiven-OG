import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Route, 
  Package, 
  FileText, 
  MapPin, 
  History, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface TransporterSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routes', label: 'Publicar Ruta', icon: Route },
  { id: 'cargo', label: 'Ver Cargas', icon: Package },
  { id: 'offers', label: 'Gestión de Ofertas', icon: FileText },
  { id: 'tracking', label: 'Seguimiento', icon: MapPin },
  { id: 'history', label: 'Historial', icon: History },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function TransporterSidebar({ activeTab, onTabChange }: TransporterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-to-b from-blue-50 to-blue-100 border-r border-blue-200 h-full shadow-sm transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border-2 border-blue-200 rounded-full p-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-blue-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-blue-600" />
        )}
      </Button>

      {/* Header */}
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "p-2" : "p-6"
      )}>
        <h2 className={cn(
          "font-bold text-blue-900 transition-all duration-300",
          isCollapsed ? "text-lg" : "text-xl"
        )}>
          {isCollapsed ? "PT" : "Panel Transportista"}
        </h2>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "mt-6 space-y-2 transition-all duration-300 ease-in-out",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start transition-all duration-200 relative group",
                isCollapsed ? "px-2 py-3 rounded-lg" : "px-4 py-3 rounded-lg",
                isActive 
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                  : "text-blue-700 hover:bg-blue-200/60 hover:text-blue-900"
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
                <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
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