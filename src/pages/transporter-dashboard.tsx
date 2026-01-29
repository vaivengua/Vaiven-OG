import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatDialog from "@/components/ChatDialog";
import TrackingMap from "@/components/TrackingMap";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { 
  Truck, 
  Package, 
  MapPin, 
  Star, 
  TrendingUp, 
  Plus,
  Eye,
  MessageCircle,
  Coins,
  Calendar,
  Check,
  CheckCircle,
  X,
  Navigation,
  Clock,
  FileText,
  Zap,
  Users,
  Target,
  Award,
  AlertTriangle,
  Edit,
  Trash2,
  Camera,
  XCircle,
  DollarSign,
  CreditCard,
  Filter
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTransporterProfile } from "@/hooks/useTransporterProfile";
import TransporterProfile from "@/components/transporter/TransporterProfile";
import { supabase } from "@/lib/supabase";

export default function TransporterDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const {
    profile: transporterProfile,
    loading: transporterLoading,
    error: transporterError,
    saving: transporterSaving,
    updateProfile: updateTransporterProfile,
    updateProfilePicture: updateTransporterProfilePicture,
    removeProfilePicture: removeTransporterProfilePicture,
  } = useTransporterProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docFileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [isViewShipmentOpen, setIsViewShipmentOpen] = useState(false);
  const [isShipmentChatOpen, setIsShipmentChatOpen] = useState(false);
  const [isTrackingMapOpen, setIsTrackingMapOpen] = useState(false);
  const [selectedShipmentForTracking, setSelectedShipmentForTracking] = useState<any>(null);
  const [gpsTracking, setGpsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  

  const [currentTab, setCurrentTab] = useState<string>('marketplace');
  
  // Filter states for marketplace
  const [marketplaceSearchTerm, setMarketplaceSearchTerm] = useState<string>('');
  const [marketplaceCargoFilter, setMarketplaceCargoFilter] = useState<string>('all');
  const [marketplacePriceFilter, setMarketplacePriceFilter] = useState<string>('all');
  const [marketplaceLocationFilter, setMarketplaceLocationFilter] = useState<string>('all');
  
  // Filter states for my bids
  const [myBidsSearchTerm, setMyBidsSearchTerm] = useState<string>('');
  const [myBidsStatusFilter, setMyBidsStatusFilter] = useState<string>('all');
  const [myBidsAmountFilter, setMyBidsAmountFilter] = useState<string>('all');

  // Filter states for active shipments
  const [activeShipmentsSearchTerm, setActiveShipmentsSearchTerm] = useState<string>('');
  const [activeShipmentsStatusFilter, setActiveShipmentsStatusFilter] = useState<string>('all');
  const [activeShipmentsPriceFilter, setActiveShipmentsPriceFilter] = useState<string>('all');
  const [activeShipmentsCargoFilter, setActiveShipmentsCargoFilter] = useState<string>('all');


  // Vehicle type translation function
  const translateVehicleType = (vehicleType: string | null): string => {
    if (!vehicleType) return '-';
    
    const translations: { [key: string]: string } = {
      'small_truck': 'Camión Pequeño',
      'medium_truck': 'Camión Mediano', 
      'large_truck': 'Camión Grande',
      'trailer': 'Trailer',
      'flatbed': 'Plataforma',
      'reefer': 'Refrigerado',
      'pickup': 'Pickup',
      'van': 'Furgoneta',
      'motorcycle': 'Motocicleta',
      'bicycle': 'Bicicleta'
    };
    
    return translations[vehicleType] || vehicleType;
  };

  // Translation function for common English terms to Spanish
  const translateToSpanish = (text: string | null | undefined): string => {
    if (!text) return 'No especificado';
    
    const translations: { [key: string]: string } = {
      // Temperature terms
      'ambient': 'Ambiente',
      'room temperature': 'Temperatura ambiente',
      'cold': 'Frío',
      'frozen': 'Congelado',
      'refrigerated': 'Refrigerado',
      
      // Humidity terms
      'standard': 'Estándar',
      'normal': 'Normal',
      'low': 'Bajo',
      'high': 'Alto',
      'controlled': 'Controlado',
      
      // Packaging terms
      'box': 'Caja',
      'pallet': 'Pallet',
      'crate': 'Cajón',
      'bag': 'Bolsa',
      'container': 'Contenedor',
      'loose': 'Suelto',
      'wrapped': 'Empacado',
      
      // Cargo types
      'general': 'General',
      'fragile': 'Frágil',
      'hazardous': 'Peligroso',
      'perishable': 'Perecedero',
      'electronics': 'Electrónicos',
      'furniture': 'Muebles',
      'clothing': 'Ropa',
      'food': 'Alimentos',
      'machinery': 'Maquinaria',
      'documents': 'Documentos',
      
      // Status terms
      'pending': 'Pendiente',
      'in_transit': 'En tránsito',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
      'completed': 'Completado'
    };
    
    const lowerText = text.toLowerCase().trim();
    return translations[lowerText] || text;
  };

  // Cargo type translation function
  const translateCargoType = (cargoType: string | null): string => {
    if (!cargoType) return 'No especificado';
    
    const translations: { [key: string]: string } = {
      'general': 'General',
      'fragile': 'Frágil',
      'perishable': 'Perecedero',
      'hazardous': 'Peligroso',
      'electronics': 'Electrónicos',
      'textiles': 'Textiles',
      'machinery': 'Maquinaria',
      'automotive': 'Automotriz',
      'construction': 'Construcción',
      'agricultural': 'Agrícola',
      'furniture': 'Muebles',
      'clothing': 'Ropa',
      'food': 'Alimentos',
      'medical': 'Médico',
      'industrial': 'Industrial',
      'retail': 'Comercial',
      'pharmaceutical': 'Farmacéutico',
      'chemicals': 'Químicos',
      'paper': 'Papel',
      'plastic': 'Plástico',
      'metal': 'Metal',
      'wood': 'Madera',
      'glass': 'Vidrio',
      'ceramics': 'Cerámica',
      'books': 'Libros',
      'documents': 'Documentos',
      'art': 'Arte',
      'antiques': 'Antigüedades',
      'jewelry': 'Joyería',
      'cosmetics': 'Cosméticos',
      'toys': 'Juguetes',
      'sports': 'Deportes',
      'musical': 'Instrumentos Musicales',
      'tools': 'Herramientas',
      'appliances': 'Electrodomésticos'
    };
    
    return translations[cargoType] || cargoType;
  };

  // Completion comment formatting function
  const formatCompletionComment = (comment: string | null): string => {
    if (!comment || !comment.startsWith('COMPLETED_')) {
      return comment || '';
    }
    const dateString = comment.replace('COMPLETED_', '');
    try {
      const date = new Date(dateString);
      // Format to 'DD/MM/YYYY HH:MM'
      const formattedDate = date.toLocaleDateString('es-GT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return `Completado el: ${formattedDate}`;
    } catch (e) {
      console.error('Error parsing completion date:', e);
      return `Completado (Fecha inválida: ${dateString})`;
    }
  };

  // Marketplace (Shipments from clients)
  type MarketShipment = {
    id: string;
    title: string;
    weight: number | null;
    cargoType: string | null;
    estimatedPrice: number | null;
    originAddress: string;
    destinationAddress: string;
    pickupDate: string | null;
    clientName: string | null;
    clientCompany: string | null;
    clientPhone: string | null;
    raw?: any;
  };
  const [marketShipments, setMarketShipments] = useState<MarketShipment[]>([]);
  const [marketLoading, setMarketLoading] = useState<boolean>(false);
  const [marketError, setMarketError] = useState<string | null>(null);



  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setCurrentTab(tab);
  }, [location.search]);



  const refreshMarket = async () => {
    try {
      setMarketLoading(true);
      setMarketError(null);
      
      console.log('🔄 Refreshing marketplace - fetching available shipments...');
      
      // First, get all shipments with pending status
      const { data: shipments, error: shipmentsError } = await supabase
        .from('shipments')
        .select('id,title,weight,cargo_type,estimated_price,origin_address,destination_address,pickup_date,created_at,status,user_id')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (shipmentsError) throw shipmentsError;
      
      console.log('📦 Pending shipments found:', shipments?.length || 0);
      
      // Get client profiles for all shipment owners
      const clientUserIds = [...new Set((shipments || []).map(s => s.user_id))];
      console.log('👥 Client user IDs:', clientUserIds);
      
      let clientProfiles: any[] = [];
      if (clientUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('client_profiles')
          .select('user_id,full_name,company,phone')
          .in('user_id', clientUserIds);
        
        if (profilesError) {
          console.warn('⚠️ Could not fetch client profiles:', profilesError);
        } else {
          clientProfiles = profiles || [];
          console.log('👤 Client profiles loaded:', clientProfiles.length);
          console.log('👤 Client profiles data:', clientProfiles);
        }
      }
      
      // Now get all offers to check which shipments have accepted offers
      const { data: allOffers, error: offersError } = await supabase
        .from('offers')
        .select('shipment_id,status')
        .in('status', ['accepted', 'paid', 'completed']);
      
      if (offersError) throw offersError;
      
      console.log('📋 Accepted/paid/completed offers found:', allOffers?.length || 0);
      
      // Get shipment IDs that have accepted offers
      const acceptedShipmentIds = new Set(allOffers?.map(offer => offer.shipment_id) || []);
      console.log('🚫 Shipments with accepted offers:', Array.from(acceptedShipmentIds));
      
      // Filter out shipments that have accepted offers
      const availableShipments = (shipments || []).filter(shipment => 
        !acceptedShipmentIds.has(shipment.id)
      );
      
      console.log('✅ Actually available shipments:', availableShipments.length);
      
      const mapped = availableShipments.map((row: any) => {
        // Find the client profile for this shipment
        const clientProfile = clientProfiles.find(profile => profile.user_id === row.user_id);
        
        console.log(`🔍 Mapping shipment ${row.id}:`, {
          shipmentUserId: row.user_id,
          clientProfileFound: !!clientProfile,
          clientProfile: clientProfile,
          clientName: clientProfile?.full_name || 'Cliente'
        });
        
        return {
          id: row.id,
          title: row.title || 'Envío',
          weight: row.weight ?? null,
          cargoType: row.cargo_type ?? null,
          estimatedPrice: row.estimated_price ?? null,
          originAddress: row.origin_address,
          destinationAddress: row.destination_address,
          pickupDate: row.pickup_date,
          clientName: clientProfile?.full_name || row.user_id?.slice(0, 8) + '...' || null,
          clientCompany: clientProfile?.company ?? null,
          clientPhone: clientProfile?.phone ?? null,
          raw: row,
        };
      }) as MarketShipment[];
      
      setMarketShipments(mapped);
    } catch (err) {
      console.error('❌ Error refreshing marketplace:', err);
      setMarketError(err instanceof Error ? err.message : 'Error al cargar envíos');
    } finally {
      setMarketLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshMarket();
      refreshActiveShipments();
      refreshMyBids();
      refreshQuoteRequests();
    }
  }, [user?.id]);

  // Periodically refresh tracking status
  useEffect(() => {
    const interval = setInterval(() => {
      // Use a function to get current activeShipments state
      setActiveShipments(currentShipments => {
        if (currentShipments.length > 0) {
          // Refresh tracking status for all shipments
          const refreshTrackingStatus = async () => {
            try {
              console.log('🔄 Refreshing tracking status for all shipments...');
              
              const updatedShipments = await Promise.all(
                currentShipments.map(async (shipment) => {
                  try {
                    const { data: trackingData, error } = await supabase
                      .from('shipments')
                      .select('tracking_enabled, tracking_started_at')
                      .eq('id', shipment.id)
                      .single();

                    if (error) {
                      console.error(`Error fetching tracking status for shipment ${shipment.id}:`, error);
                      return shipment;
                    }

                    return {
                      ...shipment,
                      tracking_enabled: trackingData.tracking_enabled || false,
                      tracking_started_at: trackingData.tracking_started_at
                    };
                  } catch (err) {
                    console.error(`Error in tracking status refresh for shipment ${shipment.id}:`, err);
                    return shipment;
                  }
                })
              );

              setActiveShipments(updatedShipments);
              console.log('✅ Tracking status refreshed for all shipments');
            } catch (err) {
              console.error('❌ Error refreshing tracking status:', err);
            }
          };
          
          refreshTrackingStatus();
        }
        return currentShipments; // Return unchanged if no shipments
      });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array

  useEffect(() => {
    if (currentTab === 'marketplace') refreshMarket();
    if (currentTab === 'active-shipments') refreshActiveShipments();
    if (currentTab === 'my-bids') refreshMyBids();
    if (currentTab === 'received-quotes') refreshQuoteRequests();
  }, [currentTab]);

  // Fetch accepted offers for the transportista
  const refreshActiveShipments = async () => {
    if (!user?.id) return;
    try {
      setActiveShipmentsLoading(true);
      setActiveShipmentsError(null);
      
      console.log('🔄 Refreshing active shipments for user:', user.id);
      
      // Debug: Check all offers to understand the data structure
      const { data: allOffers, error: allOffersError } = await supabase
        .from('offers')
        .select('*')
        .eq('transporter_user_id', user.id)
        .order('created_at', { ascending: false });

      if (allOffersError) {
        console.error('❌ Error fetching all offers:', allOffersError);
      } else {
        console.log('🔍 All offers for transporter:', allOffers?.length || 0);
        console.log('🔍 Offer statuses found:', [...new Set((allOffers || []).map(o => o.status))]);
      }

      // Now fetch accepted, paid and completed offers (these are the active and completed shipments)
      const { data: acceptedOffers, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('transporter_user_id', user.id)
        .in('status', ['accepted', 'paid', 'completed']) // Include accepted, paid and completed offers
        .order('created_at', { ascending: false });
      
      if (offersError) throw offersError;
      
      console.log('🔍 Found accepted/paid/completed offers:', acceptedOffers?.length || 0);
      console.log('🔍 Accepted offers details:', acceptedOffers);
      
      // Get shipment IDs to fetch additional shipment details
      const shipmentIds = (acceptedOffers || []).map(offer => offer.shipment_id);
      console.log('📦 Shipment IDs to fetch:', shipmentIds);
      
      // Fetch shipment details for cargo type and other information
      let shipmentDetails: any[] = [];
      if (shipmentIds.length > 0) {
        const { data: shipments, error: shipmentsError } = await supabase
          .from('shipments')
          .select('id,title,weight,cargo_type,pickup_date,delivery_date,status,user_id')
          .in('id', shipmentIds);
        
        if (shipmentsError) {
          console.warn('⚠️ Could not fetch shipment details:', shipmentsError);
        } else {
          shipmentDetails = shipments || [];
          console.log('📦 Shipment details loaded:', shipmentDetails.length);
        }
      }
      
      // Load client profiles for these shipments
      let clientProfiles: any[] = [];
      if (shipmentDetails.length > 0) {
        const clientUserIds = [...new Set(shipmentDetails.map(shipment => shipment.user_id))];
        console.log('🔍 Loading client profiles for user IDs:', clientUserIds);
        
        if (clientUserIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('client_profiles')
            .select('user_id, full_name, company, phone')
            .in('user_id', clientUserIds);
          
          if (profilesError) {
            console.warn('⚠️ Could not fetch client profiles:', profilesError);
          } else {
            clientProfiles = profilesData || [];
            console.log('👤 Client profiles loaded:', clientProfiles.length);
            console.log('👤 Client profiles data:', clientProfiles);
          }
        }
      }
      
      // Fetch reviews for these shipments
      let reviews: any[] = [];
      if (shipmentIds.length > 0) {
        console.log('🔍 Fetching reviews for shipment IDs:', shipmentIds);
        console.log('🔍 Current user ID:', user.id);
        
        // First, let's get ALL reviews in the database to see what exists
        const { data: allReviews, error: allReviewsError } = await supabase
          .from('reviews')
          .select('*');
        
        console.log('🔍 ALL reviews in database:', allReviews);
        
        // Now get reviews for this specific transporter (including NULL transporter_user_id)
        const { data: allTransporterReviews, error: transporterReviewsError } = await supabase
          .from('reviews')
          .select('*')
          .or(`transporter_user_id.eq.${user.id},transporter_user_id.is.null`);
        
        console.log('🔍 All reviews for this transporter (including NULL):', allTransporterReviews);
        
        // Now get reviews for specific shipments (including NULL transporter_user_id)
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .in('shipment_id', shipmentIds)
          .or(`transporter_user_id.eq.${user.id},transporter_user_id.is.null`);
        
        console.log('📊 Reviews query result:', { reviewsData, reviewsError });
        
        if (reviewsError) {
          console.warn('⚠️ Could not fetch reviews:', reviewsError);
        } else {
          reviews = reviewsData || [];
          console.log('⭐ Reviews loaded:', reviews.length);
          console.log('⭐ Reviews data:', reviews);
        }
      }

      console.log('📊 Database query result:', { acceptedOffers, offersError });
      console.log('📋 Sample offer data:', acceptedOffers?.[0]);

      if (offersError) throw offersError;

      // Transform the data for display
      const transformedShipments = (acceptedOffers || []).map((offer: any) => {
        // Find the corresponding shipment details
        const shipmentDetail = shipmentDetails.find(shipment => shipment.id === offer.shipment_id);
        
        // Find the corresponding client profile
        const clientProfile = clientProfiles.find(profile => profile.user_id === shipmentDetail?.user_id);
        
        // Find the corresponding review
        const review = reviews.find(review => review.shipment_id === offer.shipment_id);
        
        console.log(`🔍 Mapping shipment ${offer.shipment_id}:`, {
          shipmentDetail: shipmentDetail,
          shipmentUserId: shipmentDetail?.user_id,
          clientProfile: clientProfile,
          clientProfileUserId: clientProfile?.user_id,
          allClientProfiles: clientProfiles,
          hasReview: !!review,
          reviewData: review,
          reviewRating: review?.rating,
          reviewComment: review?.comment
        });
        
        return {
          id: offer.shipment_id,
          offerId: offer.id,
          title: offer.shipment_title || shipmentDetail?.title || 'Sin título',
          clientName: clientProfile?.full_name || shipmentDetail?.user_id?.slice(0, 8) + '...' || 'Cliente',
          clientPhone: clientProfile?.phone || null,
          clientCompany: clientProfile?.company || null,
          finalPrice: offer.amount,
          originAddress: offer.shipment_origin_address,
          destinationAddress: offer.shipment_destination_address,
          weight: shipmentDetail?.weight || null,
          cargoType: shipmentDetail?.cargo_type || null,
          pickupDate: shipmentDetail?.pickup_date || null,
          deliveryDate: shipmentDetail?.delivery_date || null,
          status: offer.status,
          shipmentStatus: shipmentDetail?.status || 'pending',
          estimatedDuration: offer.estimated_duration,
          comments: offer.comments,
          review: review || null, // Add review information
          rawOffer: offer,
          // Add user_id for chat functionality
          user_id: shipmentDetail?.user_id,
          // Add acceptedOffer for chat functionality
          acceptedOffer: {
            id: offer.id,
            shipment_id: offer.shipment_id,
            transporter_user_id: offer.transporter_user_id,
            transporter_name: offer.transporter_name,
            amount: offer.amount,
            status: offer.status,
            comments: offer.comments
          },
          // Add properties needed for stats calculation
          amount: offer.amount,
          hasReview: !!review,
          reviewRating: review?.rating,
          reviewComment: review?.comment,
          raw: offer // Add raw offer data for stats calculation
        };
      });

      console.log('🔄 Transformed shipments:', transformedShipments);
      
      // Refresh tracking status for all shipments
      const shipmentsWithTrackingStatus = await Promise.all(
        transformedShipments.map(async (shipment) => {
          try {
            const { data: trackingData, error } = await supabase
              .from('shipments')
              .select('tracking_enabled, tracking_started_at')
              .eq('id', shipment.id)
              .single();

            if (error) {
              console.error(`Error fetching tracking status for shipment ${shipment.id}:`, error);
              return shipment;
            }

            return {
              ...shipment,
              tracking_enabled: trackingData.tracking_enabled || false,
              tracking_started_at: trackingData.tracking_started_at
            };
          } catch (err) {
            console.error(`Error in tracking status refresh for shipment ${shipment.id}:`, err);
            return shipment;
          }
        })
      );

      setActiveShipments(shipmentsWithTrackingStatus);
    } catch (err) {
      console.error('❌ Error in refreshActiveShipments:', err);
      setActiveShipmentsError(err instanceof Error ? err.message : 'Error al cargar envíos activos');
    } finally {
      setActiveShipmentsLoading(false);
    }
  };

  // Documents state
  type TransporterDocument = {
    id: string;
    user_id: string;
    doc_type: string;
    file_name: string;
    file_path: string;
    public_url: string | null;
    status: string;
    notes: string | null;
    uploaded_at: string;
    reviewed_at: string | null;
    display_url?: string | null;
    vehicle_id?: string | null;
  };
  const DOCUMENT_TYPES: { key: string; label: string }[] = [
    { key: 'dpi', label: 'DPI' },
    { key: 'driver_license', label: 'Licencia de Conducir' },
    { key: 'insurance', label: 'Póliza de Seguro' },
    { key: 'vehicle_plate', label: 'Placas del Vehículo' },
    { key: 'vehicle_photo', label: 'Fotos del Vehículo' },
  ];
  const [documents, setDocuments] = useState<TransporterDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [docAccept, setDocAccept] = useState<string | undefined>(undefined);
  const [isDeleteDocDialogOpen, setIsDeleteDocDialogOpen] = useState<boolean>(false);
  const [docToDelete, setDocToDelete] = useState<TransporterDocument | null>(null);
  // Vehicles state
  type TransporterVehicle = {
    id: string;
    user_id: string;
    name: string | null;
    vehicle_type: string | null;
    plate: string | null;
    capacity_kg: number | null;
    year: number | null;
    color: string | null;
    brand?: string | null;
    model?: string | null;
    axle_count?: number | null;
    length_m?: number | null;
    width_m?: number | null;
    height_m?: number | null;
    fuel_type?: string | null;
    emission_standard?: string | null;
    gps_tracking?: boolean | null;
    owner_type?: string | null;
    photo_url?: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  const [vehicles, setVehicles] = useState<TransporterVehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState<boolean>(false);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
  const [newVehicle, setNewVehicle] = useState<{ 
    name: string; 
    plate: string; 
    vehicle_type: string; 
    brand: string; 
    model: string; 
    year: string; 
    color: string; 
    capacity_kg: string; 
    axle_count: string; 
    length_m: string; 
    width_m: string; 
    height_m: string; 
    fuel_type: string; 
    emission_standard: string; 
    gps_tracking: boolean; 
    owner_type: string; 
    photo_url: string; 
  }>({ 
    name: '', 
    plate: '', 
    vehicle_type: '', 
    brand: '', 
    model: '', 
    year: '', 
    color: '', 
    capacity_kg: '', 
    axle_count: '', 
    length_m: '', 
    width_m: '', 
    height_m: '', 
    fuel_type: '', 
    emission_standard: '', 
    gps_tracking: false, 
    owner_type: '', 
    photo_url: '' 
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<TransporterVehicle | null>(null);
  const [editVehicle, setEditVehicle] = useState<{ 
    name: string; plate: string; vehicle_type: string; brand?: string; model?: string; year?: string; color?: string; capacity_kg?: string; axle_count?: string; length_m?: string; width_m?: string; height_m?: string; fuel_type?: string; emission_standard?: string; gps_tracking?: boolean; owner_type?: string; photo_url?: string;
  }>({ name: '', plate: '', vehicle_type: '', brand: '', model: '', year: '', color: '', capacity_kg: '', axle_count: '', length_m: '', width_m: '', height_m: '', fuel_type: '', emission_standard: '', gps_tracking: false, owner_type: '', photo_url: '' });
  const [isDeleteVehicleOpen, setIsDeleteVehicleOpen] = useState<boolean>(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<TransporterVehicle | null>(null);

  const refreshDocuments = async () => {
    if (!user?.id) return;
    try {
      setDocsLoading(true);
      setDocsError(null);
      const { data, error } = await supabase
        .from('transporter_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      const rows = (data || []) as TransporterDocument[];
      // Generate signed URLs for private bucket so previews work
      const withSigned = await Promise.all(rows.map(async (d) => {
        try {
          const { data: signed } = await supabase.storage
            .from('transporter-docs')
            .createSignedUrl(d.file_path, 60 * 60); // 1h
          return { ...d, display_url: signed?.signedUrl || d.public_url } as TransporterDocument;
        } catch {
          return { ...d, display_url: d.public_url } as TransporterDocument;
        }
      }));
      setDocuments(withSigned);
    } catch (err) {
      setDocsError(err instanceof Error ? err.message : 'Error al cargar documentos');
    } finally {
      setDocsLoading(false);
    }
  };

  const refreshVehicles = async () => {
    if (!user?.id) return;
    try {
      setVehiclesLoading(true);
      setVehiclesError(null);
      const { data, error } = await supabase
        .from('transporter_vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVehicles((data || []) as TransporterVehicle[]);
      // Ensure selection
      if (!selectedVehicleId && (data || []).length) setSelectedVehicleId((data as any[])[0].id);
    } catch (err) {
      setVehiclesError(err instanceof Error ? err.message : 'Error al cargar vehículos');
    } finally {
      setVehiclesLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) refreshDocuments();
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) refreshVehicles();
  }, [user?.id]);

  const handleUploadDocumentClick = (docType: string) => {
    setUploadingDocType(docType);
    // Set accept based on type
    if (docType === 'vehicle_photo') setDocAccept('image/*');
    else if (docType === 'vehicle_plate') setDocAccept('image/*');
    else setDocAccept('image/*,.pdf');
    // Defer click to allow state to apply
    setTimeout(() => docFileInputRef.current?.click(), 0);
  };

  const handleDocumentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.currentTarget.value = '';
    if (!files.length || !user?.id || !uploadingDocType) return;
    // All documents are vehicle-scoped now
    if (!selectedVehicleId) {
      toast({ title: 'Selecciona un vehículo', description: 'Elige un vehículo para subir sus documentos.', variant: 'destructive' });
      return;
    }
    try {
      setDocsLoading(true);
      for (const file of files) {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const filePath = `${user.id}/${uploadingDocType}-${timestamp}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from('transporter-docs')
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: pub } = supabase.storage
          .from('transporter-docs')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from('transporter_documents')
          .insert({
            user_id: user.id,
            doc_type: uploadingDocType,
            file_name: file.name,
            file_path: filePath,
            public_url: pub?.publicUrl ?? null,
            status: 'pending',
            uploaded_at: new Date().toISOString(),
            vehicle_id: selectedVehicleId,
          });
        if (insertError) throw insertError;
      }
      toast({ title: 'Documento(s) subido(s)', description: 'Se enviaron para revisión.' });
      setUploadingDocType(null);
      refreshDocuments();
    } catch (err) {
      toast({ title: 'Error al subir', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    } finally {
      setDocsLoading(false);
    }
  };

  const openDeleteDocument = (doc: TransporterDocument) => {
    setDocToDelete(doc);
    setIsDeleteDocDialogOpen(true);
  };

  const confirmDeleteDocument = async () => {
    if (!docToDelete) return;
    try {
      setDocsLoading(true);
      await supabase.storage.from('transporter-docs').remove([docToDelete.file_path]);
      const { error } = await supabase
        .from('transporter_documents')
        .delete()
        .eq('id', docToDelete.id);
      if (error) throw error;
      toast({ title: 'Documento eliminado' });
      setIsDeleteDocDialogOpen(false);
      setDocToDelete(null);
      refreshDocuments();
    } catch (err) {
      toast({ title: 'Error al eliminar', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    } finally {
      setDocsLoading(false);
    }
  };

  const viewDocument = async (doc: TransporterDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('transporter-docs')
        .createSignedUrl(doc.file_path, 60 * 5);
      if (error) throw error;
      const url = data?.signedUrl || doc.public_url;
      if (url) window.open(url, '_blank');
      else toast({ title: 'No se pudo abrir el documento', variant: 'destructive' });
    } catch (err) {
      toast({ title: 'Error al abrir', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };

  const addVehicle = async () => {
    if (!user?.id) return;
    if (!newVehicle.name || !newVehicle.vehicle_type) {
      toast({ title: 'Datos faltantes', description: 'Ingresa nombre y tipo de vehículo', variant: 'destructive' });
      return;
    }
    try {
              const { data, error } = await supabase
          .from('transporter_vehicles')
          .insert({
            user_id: user.id,
            name: newVehicle.name,
            vehicle_type: newVehicle.vehicle_type,
            plate: newVehicle.plate || null,
            brand: newVehicle.brand || null,
            model: newVehicle.model || null,
            year: newVehicle.year ? parseInt(newVehicle.year) : null,
            color: newVehicle.color || null,
            capacity_kg: newVehicle.capacity_kg ? parseFloat(newVehicle.capacity_kg) : null,
            axle_count: newVehicle.axle_count ? parseInt(newVehicle.axle_count) : null,
            length_m: newVehicle.length_m ? parseFloat(newVehicle.length_m) : null,
            width_m: newVehicle.width_m ? parseFloat(newVehicle.width_m) : null,
            height_m: newVehicle.height_m ? parseFloat(newVehicle.height_m) : null,
            fuel_type: newVehicle.fuel_type || null,
            emission_standard: newVehicle.emission_standard || null,
            gps_tracking: newVehicle.gps_tracking,
            owner_type: newVehicle.owner_type || null,
            photo_url: newVehicle.photo_url || null,
          })
        .select()
        .single();
      if (error) throw error;
      toast({ title: 'Vehículo agregado' });
      setIsAddVehicleOpen(false);
      setNewVehicle({ 
        name: '', 
        plate: '', 
        vehicle_type: '', 
        brand: '', 
        model: '', 
        year: '', 
        color: '', 
        capacity_kg: '', 
        axle_count: '', 
        length_m: '', 
        width_m: '', 
        height_m: '', 
        fuel_type: '', 
        emission_standard: '', 
        gps_tracking: false, 
        owner_type: '', 
        photo_url: '' 
      });
      refreshVehicles();
      setSelectedVehicleId((data as any).id);
    } catch (err) {
      toast({ title: 'Error al agregar', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };

  const getVehicleStatus = (vehicleId: string): 'approved' | 'rejected' | 'pending' => {
    const vdocs = documents.filter(d => d.vehicle_id === vehicleId);
    if (vdocs.some(d => d.status === 'rejected')) return 'rejected';
    const requiredTypes = ['dpi','driver_license','vehicle_plate','insurance','vehicle_photo'];
    const hasAllApproved = requiredTypes.every((t) => {
      if (t === 'vehicle_photo') return vdocs.some(d => d.doc_type === t && d.status === 'approved');
      return vdocs.some(d => d.doc_type === t && d.status === 'approved');
    });
    return hasAllApproved ? 'approved' : 'pending';
  };

  const getStatusBadgeClass = (status: string) => status === 'approved' ? 'text-green-600 border-green-600' : status === 'rejected' ? 'text-red-600 border-red-600' : 'text-yellow-600 border-yellow-600';

  const openEditVehicle = (v: TransporterVehicle) => {
    setEditingVehicle(v);
    setEditVehicle({
      name: v.name || '',
      plate: v.plate || '',
      vehicle_type: v.vehicle_type || '',
      brand: v.brand || '',
      model: v.model || '',
      year: v.year ? String(v.year) : '',
      color: v.color || '',
      capacity_kg: v.capacity_kg ? String(v.capacity_kg) : '',
      axle_count: v.axle_count ? String(v.axle_count) : '',
      length_m: v.length_m ? String(v.length_m) : '',
      width_m: v.width_m ? String(v.width_m) : '',
      height_m: v.height_m ? String(v.height_m) : '',
      fuel_type: v.fuel_type || '',
      emission_standard: v.emission_standard || '',
      gps_tracking: !!v.gps_tracking,
      owner_type: v.owner_type || '',
      photo_url: v.photo_url || '',
    });
    setIsEditVehicleOpen(true);
  };

  const isPlateAvailable = async (plate: string, excludeId?: string) => {
    const { data, error } = await supabase
      .from('transporter_vehicles')
      .select('id')
      .eq('user_id', user!.id)
      .eq('plate', plate)
      .neq('id', excludeId || '');
    if (error) return false;
    return (data || []).length === 0;
  };

  // Handle vehicle photo upload
  const handleVehiclePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, mode: 'new' | 'edit') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Tipo de archivo inválido', description: 'Solo se permiten imágenes', variant: 'destructive' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Archivo muy grande', description: 'El archivo debe ser menor a 5MB', variant: 'destructive' });
      return;
    }

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // Remove the vehicle-photos/ prefix to avoid duplication

      console.log('Attempting to upload to bucket: transporter-docs (existing bucket)');
      console.log('File path:', filePath);
      console.log('File size:', file.size, 'bytes');

      // Upload to the existing transporter-docs bucket (which already works)
      const bucketName = 'transporter-docs';
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Update the appropriate state
      if (mode === 'new') {
        setNewVehicle(prev => ({ ...prev, photo_url: publicUrl }));
      } else {
        setEditVehicle(prev => ({ ...prev, photo_url: publicUrl }));
      }

      toast({ title: 'Foto subida exitosamente' });
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast({ 
        title: 'Error al subir foto', 
        description: err instanceof Error ? err.message : 'Error desconocido', 
        variant: 'destructive' 
      });
    }
  }, [user?.id, toast]);

  const saveEditVehicle = async () => {
    if (!user?.id || !editingVehicle) return;
    if (!editVehicle.vehicle_type || !editVehicle.name) {
      toast({ title: 'Datos faltantes', description: 'Nombre y tipo son requeridos', variant: 'destructive' });
      return;
    }
    if (editVehicle.plate) {
      const ok = await isPlateAvailable(editVehicle.plate, editingVehicle.id);
      if (!ok) {
        toast({ title: 'Placa duplicada', description: 'Ya existe un vehículo con esa placa.', variant: 'destructive' });
        return;
      }
    }
    try {
      const { error } = await supabase
        .from('transporter_vehicles')
        .update({ 
          name: editVehicle.name || null,
          vehicle_type: editVehicle.vehicle_type || null,
          plate: editVehicle.plate || null,
          brand: editVehicle.brand || null,
          model: editVehicle.model || null,
          year: editVehicle.year ? Number(editVehicle.year) : null,
          color: editVehicle.color || null,
          capacity_kg: editVehicle.capacity_kg ? Number(editVehicle.capacity_kg) : null,
          axle_count: editVehicle.axle_count ? Number(editVehicle.axle_count) : null,
          length_m: editVehicle.length_m ? Number(editVehicle.length_m) : null,
          width_m: editVehicle.width_m ? Number(editVehicle.width_m) : null,
          height_m: editVehicle.height_m ? Number(editVehicle.height_m) : null,
          fuel_type: editVehicle.fuel_type || null,
          emission_standard: editVehicle.emission_standard || null,
          gps_tracking: editVehicle.gps_tracking ?? null,
          owner_type: editVehicle.owner_type || null,
          photo_url: editVehicle.photo_url || null,
        })
        .eq('id', editingVehicle.id);
      if (error) throw error;
      toast({ title: 'Vehículo actualizado' });
      setIsEditVehicleOpen(false);
      setEditingVehicle(null);
      refreshVehicles();
    } catch (err) {
      toast({ title: 'Error al actualizar', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };

  const openDeleteVehicle = (v: TransporterVehicle) => {
    setVehicleToDelete(v);
    setIsDeleteVehicleOpen(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      const { error } = await supabase
        .from('transporter_vehicles')
        .delete()
        .eq('id', vehicleToDelete.id);
      if (error) throw error;
      toast({ title: 'Vehículo eliminado' });
      setIsDeleteVehicleOpen(false);
      setVehicleToDelete(null);
      if (selectedVehicleId === vehicleToDelete.id) setSelectedVehicleId(null);
      refreshVehicles();
      refreshDocuments();
    } catch (err) {
      toast({ title: 'Error al eliminar', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };

  const availableShipments: MarketShipment[] = marketShipments;

  // Active Shipments (Accepted Offers)
  const [activeShipments, setActiveShipments] = useState<any[]>([]);
  const [activeShipmentsLoading, setActiveShipmentsLoading] = useState<boolean>(false);
  const [activeShipmentsError, setActiveShipmentsError] = useState<string | null>(null);

  const [myBids, setMyBids] = useState<any[]>([]);
  const [myBidsLoading, setMyBidsLoading] = useState<boolean>(false);
  const [myBidsError, setMyBidsError] = useState<string | null>(null);

  // Quote Requests (received from clients)
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [quoteRequestsLoading, setQuoteRequestsLoading] = useState<boolean>(false);
  const [quoteRequestsError, setQuoteRequestsError] = useState<string | null>(null);
  const [selectedQuoteRequest, setSelectedQuoteRequest] = useState<any>(null);
  const [isQuoteResponseDialogOpen, setIsQuoteResponseDialogOpen] = useState(false);

  // Calculate real stats from data using useMemo to update when activeShipments changes
  const stats = useMemo(() => {
    console.log('📊 Calculating stats with activeShipments:', activeShipments.length, activeShipments);
    
    // Debug: Check the structure of the first shipment
    if (activeShipments.length > 0) {
      console.log('🔍 First shipment structure:', activeShipments[0]);
      console.log('🔍 First shipment amount:', activeShipments[0].amount);
      console.log('🔍 First shipment hasReview:', activeShipments[0].hasReview);
      console.log('🔍 First shipment reviewRating:', activeShipments[0].reviewRating);
      console.log('🔍 First shipment status:', activeShipments[0].status);
    }
    
    // Filter completed shipments (using the same logic as the display)
    const completedShipments = activeShipments.filter(shipment => {
      const isCompleted = shipment.status === 'completed' || 
                         shipment.shipmentStatus === 'completed' || 
                         (shipment.comments && shipment.comments.includes('COMPLETED_'));
      return isCompleted;
    });
    
    // Filter ongoing shipments (those that are not completed)
    const ongoingShipments = activeShipments.filter(shipment => {
      const isCompleted = shipment.status === 'completed' || 
                         shipment.shipmentStatus === 'completed' || 
                         (shipment.comments && shipment.comments.includes('COMPLETED_'));
      return !isCompleted;
    });
    
    const result = {
      completedShipments: completedShipments.length,
      ongoingShipments: ongoingShipments.length,
      totalEarnings: activeShipments.reduce((total, shipment) => {
        // The amount is in the offer data
        const amount = parseFloat(shipment.finalPrice?.toString() || '0') || 
                      parseFloat(shipment.amount?.toString() || '0') || 
                      parseFloat(shipment.raw?.amount?.toString() || '0') || 0;
        console.log(`💰 Shipment ${shipment.id} amount:`, amount, 'from finalPrice:', shipment.finalPrice, 'amount:', shipment.amount, 'raw.amount:', shipment.raw?.amount);
        return total + amount;
      }, 0),
      avgRating: (() => {
        const reviews = activeShipments
          .filter(shipment => shipment.hasReview && shipment.reviewRating)
          .map(shipment => shipment.reviewRating);
        
        console.log('⭐ Reviews found:', reviews);
        
        if (reviews.length === 0) return 0;
        const avg = reviews.reduce((sum, rating) => sum + rating, 0) / reviews.length;
        return Math.round(avg * 10) / 10;
      })(),
      totalRatings: activeShipments.filter(shipment => shipment.hasReview).length
    };
    
    console.log('📊 Calculated stats:', result);
    console.log('📊 Completed shipments:', completedShipments.map(s => ({ 
      id: s.id, 
      status: s.status, 
      shipmentStatus: s.shipmentStatus,
      hasReview: s.hasReview,
      comments: s.comments,
      isCompleted: s.status === 'completed' || s.shipmentStatus === 'completed' || (s.comments && s.comments.includes('COMPLETED_'))
    })));
    console.log('📊 Ongoing shipments:', ongoingShipments.map(s => ({ 
      id: s.id, 
      status: s.status, 
      shipmentStatus: s.shipmentStatus,
      hasReview: s.hasReview,
      comments: s.comments,
      isCompleted: s.status === 'completed' || s.shipmentStatus === 'completed' || (s.comments && s.comments.includes('COMPLETED_'))
    })));
    return result;
  }, [activeShipments]);

  // Handle logout
  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  // Fetch transporter's offers
  const refreshMyBids = async () => {
    if (!user?.id) return;
    
    try {
      setMyBidsLoading(true);
      setMyBidsError(null);
      
      console.log('🔄 Refreshing my bids for user:', user.id);
      
      const { data: offers, error } = await supabase
        .from('offers')
        .select('*')
        .eq('transporter_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('📋 My offers found:', offers?.length || 0);
      console.log('📋 Raw offers data:', offers);
      
      // Get shipment data to check completion status
      const shipmentIds = [...new Set((offers || []).map((offer: any) => offer.shipment_id))];
      let shipmentData: any[] = [];
      
      if (shipmentIds.length > 0) {
        const { data: shipments, error: shipmentsError } = await supabase
          .from('shipments')
          .select('id, status')
          .in('id', shipmentIds);
        
        if (!shipmentsError) {
          shipmentData = shipments || [];
          console.log('📦 Shipment data loaded:', shipmentData);
        } else {
          console.error('❌ Error loading shipment data:', shipmentsError);
        }
      }
      
      const mappedBids = (offers || []).map((offer: any) => {
        // Find the associated shipment
        const shipment = shipmentData.find(s => s.id === offer.shipment_id);
        
        // Determine the actual status
        let actualStatus = offer.status || 'pending';
        
        // Debug logging
        console.log(`🔍 Offer ${offer.id}: original status = ${offer.status}, shipment status = ${shipment?.status}`);
        
        // Check if offer is completed (either through shipment status or offer comments)
        if (actualStatus === 'paid' && shipment) {
          const isCompleted = shipment.status === 'completed';
          if (isCompleted) {
            actualStatus = 'completed';
            console.log(`✅ Offer ${offer.id} marked as completed via shipment status`);
          }
        }
        
        // Also check if the offer itself has completion marker
        if (offer.comments?.includes('COMPLETED_')) {
          actualStatus = 'completed';
          console.log(`✅ Offer ${offer.id} marked as completed via offer comments`);
        }
        
        console.log(`📊 Final status for offer ${offer.id}: ${actualStatus}`);
        
        return {
          id: offer.id,
          shipmentTitle: offer.shipment_title || 'Sin título',
          originAddress: offer.shipment_origin_address || 'Sin origen',
          destinationAddress: offer.shipment_destination_address || 'Sin destino',
          amount: offer.amount || 0,
          estimatedDuration: offer.estimated_duration || 'No especificado',
          status: actualStatus,
          createdAt: offer.created_at,
          raw: offer
        };
      });
      
      setMyBids(mappedBids);
    } catch (err) {
      console.error('❌ Error refreshing my bids:', err);
      setMyBidsError(err instanceof Error ? err.message : 'Error al cargar ofertas');
    } finally {
      setMyBidsLoading(false);
    }
  };

  // Fetch quote requests received from clients
  const refreshQuoteRequests = async () => {
    if (!user?.id) return;
    
    try {
      setQuoteRequestsLoading(true);
      setQuoteRequestsError(null);
      
      console.log('🔄 Refreshing quote requests for transporter:', user.id);
      
      const { data: requests, error } = await supabase
        .from('quote_requests')
        .select(`
          *,
          shipments (
            id,
            title,
            description,
            weight,
            volume,
            cargo_type,
            estimated_price,
            origin_address,
            destination_address,
            pickup_date,
            delivery_date,
            pickup_time,
            delivery_time,
            pieces,
            packaging,
            dimensions_length,
            dimensions_width,
            dimensions_height,
            special_requirements,
            insurance_value,
            pickup_instructions,
            delivery_instructions,
            contact_person,
            contact_phone,
            temperature,
            humidity,
            customs,
            status
          )
        `)
        .eq('transporter_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('📋 Quote requests found:', requests?.length || 0);
      console.log('📋 Raw quote requests data:', requests);
      
      // Get client profiles separately since we can't join directly
      const clientUserIds = [...new Set((requests || []).map((request: any) => request.client_user_id))];
      let clientProfiles: any[] = [];
      
      if (clientUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('client_profiles')
          .select('user_id, full_name, company, phone')
          .in('user_id', clientUserIds);
        
        if (!profilesError) {
          clientProfiles = profiles || [];
          console.log('👤 Client profiles loaded for quote requests:', clientProfiles);
        } else {
          console.error('❌ Error loading client profiles for quote requests:', profilesError);
        }
      }

      const mappedRequests = (requests || []).map((request: any) => {
        const clientProfile = clientProfiles.find(profile => profile.user_id === request.client_user_id);
        
        return {
          id: request.id,
          shipmentId: request.shipment_id,
          clientUserId: request.client_user_id,
          message: request.message,
          status: request.status,
          responseMessage: request.response_message,
          responseAmount: request.response_amount,
          responseEstimatedDuration: request.response_estimated_duration,
          respondedAt: request.responded_at,
          expiresAt: request.expires_at,
          createdAt: request.created_at,
          shipment: request.shipments,
          client: clientProfile,
          raw: request
        };
      });
      
      setQuoteRequests(mappedRequests);
    } catch (err) {
      console.error('❌ Error refreshing quote requests:', err);
      setQuoteRequestsError(err instanceof Error ? err.message : 'Error al cargar solicitudes de cotización');
    } finally {
      setQuoteRequestsLoading(false);
    }
  };

  // Handle responding to a quote request
  const handleRespondToQuoteRequest = async (requestId: string, responseData: any) => {
    try {
      console.log('📝 Responding to quote request:', requestId, responseData);

      const { error } = await supabase
        .from('quote_requests')
        .update({
          status: 'responded',
          response_message: responseData.message,
          response_amount: responseData.amount,
          response_estimated_duration: responseData.estimatedDuration,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Respuesta Enviada',
        description: 'Tu respuesta a la solicitud de cotización ha sido enviada.',
      });

      // Refresh the quote requests list
      refreshQuoteRequests();
      setIsQuoteResponseDialogOpen(false);
      setSelectedQuoteRequest(null);

    } catch (err) {
      console.error('❌ Error responding to quote request:', err);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la respuesta. Intenta nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendiente</Badge>;
      case 'responded':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Respondido</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-600">Aceptada</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Pagado</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">Completado</Badge>;
      case 'declined':
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rechazada</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Cancelada</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Expirado</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-600">{status || 'Desconocido'}</Badge>;
    }
  };

  const handleBidSubmit = async (data: any) => {
    if (!user?.id || !selectedShipment?.id) return;
    const amountNumber = Number(data.amount);
    if (!isFinite(amountNumber) || amountNumber <= 0) {
      toast({ title: 'Monto inválido', description: 'Ingresa un monto mayor a 0.', variant: 'destructive' });
      return;
    }
    const vehicleId = String(data.vehicleId || '').trim();
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    if (!selectedVehicle) {
      toast({ title: 'Selecciona un vehículo', description: 'Debes seleccionar un vehículo para esta oferta.', variant: 'destructive' });
      return;
    }
    try {
      // Ensure we have the shipment owner id
      let ownerId = selectedShipment.user_id as string | undefined;
      if (!ownerId) {
        const { data: ship, error: shipErr } = await supabase
          .from('shipments')
          .select('id, user_id, title, origin_address, destination_address')
          .eq('id', selectedShipment.id)
          .single();
        if (shipErr) throw shipErr;
        ownerId = ship?.user_id;
        setSelectedShipment((prev: any) => ({ ...(prev || {}), ...ship }));
      }
      const transporterName = (user as any)?.user_metadata?.name || user.email || null;
      const { error } = await supabase
        .from('offers')
        .insert({
          shipment_id: selectedShipment.id,
          shipment_owner_id: ownerId!,
          transporter_user_id: user.id,
          transporter_name: transporterName,
          vehicle_id: selectedVehicle.id,
          vehicle_type: selectedVehicle.vehicle_type || null,
          amount: amountNumber,
          estimated_duration: data.estimatedDuration ? String(data.estimatedDuration) : null,
          comments: data.comments || null,
          status: 'pending',
          shipment_title: selectedShipment.title || null,
          shipment_origin_address: selectedShipment.origin_address || null,
          shipment_destination_address: selectedShipment.destination_address || null,
        });
      if (error) throw error;
      toast({ title: 'Oferta enviada', description: 'Tu oferta fue enviada correctamente.' });
      setIsBidDialogOpen(false);
      refreshMyBids(); // Refresh the offers list
    } catch (err) {
      toast({ title: 'Error al enviar oferta', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };

  // Mark shipment as completed
  const handleMarkAsCompleted = async (shipment: any) => {
    console.log('🚀 Marking shipment as completed:', shipment);
    
    if (!user?.id || !shipment?.offerId) {
      console.error('❌ Missing user ID or offer ID:', { userId: user?.id, offerId: shipment?.offerId });
      toast({ title: 'Error', description: 'No se puede marcar como completado', variant: 'destructive' });
      return;
    }

    try {
      console.log('📝 Updating offer status to completed for offer ID:', shipment.offerId);
      console.log('👤 Current user ID:', user.id);
      
      // First, let's check what the current offer looks like
      const { data: currentOffer, error: checkError } = await supabase
        .from('offers')
        .select('*')
        .eq('id', shipment.offerId)
        .single();
      
      console.log('🔍 Current offer data:', currentOffer);
      console.log('🔍 Check error:', checkError);
      
      if (checkError) {
        console.error('❌ Error checking current offer:', checkError);
        throw checkError;
      }
      
      // Update the offer status to 'completed' - let's try without the user check first
      console.log('🔧 Attempting update...');
      
      // Use comments field as completion marker since it CAN be updated
      console.log('✅ Using comments field as completion marker...');
      
      const { data, error } = await supabase
        .from('offers')
        .update({ 
          comments: 'COMPLETED_' + new Date().toISOString()
        })
        .eq('id', shipment.offerId)
        .select();
      
      console.log('📝 Comments update result:', { data, error });
      
      if (error) throw error;
      
      // Also try to update the shipment status to completed
      console.log('🚀 Attempting to update shipment status...');
      try {
        const { data: shipmentUpdate, error: shipmentError } = await supabase
          .from('shipments')
          .update({ status: 'completed' })
          .eq('id', shipment.id)
          .select();
        
        console.log('📦 Shipment status update result:', { shipmentUpdate, shipmentError });
        
        if (shipmentError) {
          console.warn('⚠️ Could not update shipment status:', shipmentError);
          // Continue anyway since offer comments were updated
        }
      } catch (shipmentErr) {
        console.warn('⚠️ Shipment status update failed:', shipmentErr);
        // Continue anyway since offer comments were updated
      }
      
      toast({ 
        title: '✅ Envío Completado', 
        description: 'El envío ha sido marcado como completado exitosamente.' 
      });
      
      console.log('🔄 Refreshing active shipments...');
      refreshActiveShipments();
    } catch (err) {
      console.error('❌ Error marking shipment as completed:', err);
      toast({ 
        title: 'Error', 
        description: err instanceof Error ? err.message : 'No se pudo marcar como completado', 
        variant: 'destructive' 
      });
    }
  };

  // Handle chat for shipment
  const handleChatForShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsShipmentChatOpen(true);
  };

  // Handle tracking for shipment
  const handleStartTracking = async (shipment: any) => {
    try {
      // Get fresh tracking status from database
      const { data: shipmentData, error } = await supabase
        .from('shipments')
        .select('tracking_enabled, tracking_started_at, current_latitude, current_longitude, last_location_update')
        .eq('id', shipment.id)
        .single();

      if (error) {
        console.error('Error fetching shipment tracking status:', error);
        // Fallback to original shipment data
        setSelectedShipmentForTracking(shipment);
      } else {
        // Merge fresh tracking data with shipment data
        const updatedShipment = {
          ...shipment,
          tracking_enabled: shipmentData.tracking_enabled,
          tracking_started_at: shipmentData.tracking_started_at,
          current_latitude: shipmentData.current_latitude,
          current_longitude: shipmentData.current_longitude,
          last_location_update: shipmentData.last_location_update
        };
        console.log('🔍 Transporter - Fresh tracking status:', updatedShipment);
        console.log('🔍 Transporter - tracking_enabled:', updatedShipment.tracking_enabled);
        setSelectedShipmentForTracking(updatedShipment);
      }
    } catch (err) {
      console.error('Error in handleStartTracking:', err);
      setSelectedShipmentForTracking(shipment);
    }

    setIsTrackingMapOpen(true);
  };


  // Ensure full shipment data before bidding
  const openBidForShipment = async (shipment: any) => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', shipment.id)
        .single();
      if (error) throw error;
      setSelectedShipment(data);
      setIsBidDialogOpen(true);
    } catch (err) {
      toast({ title: 'No se pudo cargar el envío', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };

  const openViewShipment = async (shipmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', shipmentId)
        .single();
      if (error) throw error;
      setSelectedShipment(data);
      setIsViewShipmentOpen(true);
    } catch (err) {
      toast({ title: 'No se pudo cargar el envío', description: err instanceof Error ? err.message : 'Error desconocido', variant: 'destructive' });
    }
  };



  const toggleGPSTracking = () => {
    setGpsTracking(!gpsTracking);
    alert(gpsTracking ? "GPS Desactivado" : "GPS Activado");
  };

  const userType = (user as any)?.user_metadata?.userType;
  if (userType && userType !== 'transporter') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>Este dashboard es solo para transportistas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-4">Has iniciado sesión como <strong>{userType || 'cliente'}</strong>. Para acceder aquí, inicia sesión como transportista.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>Ir al inicio</Button>
              <Button onClick={() => navigate('/login')}>Cambiar de cuenta</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2 md:space-x-4">
              <img 
                src="/Logos%20Vaiven/Logos%20en%20PNG/web%20logo%20oficial%20A.png" 
                alt="CargoConnect Logo" 
                className="h-16 md:h-24 w-auto object-contain ml-4 md:ml-16"
              />
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-xs md:text-sm text-neutral-600 hidden sm:block">
                Bienvenido, <span className="font-medium text-neutral-900">{user?.user_metadata?.name || user?.email}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Dashboard del Transportista</h1>
              <p className="text-sm md:text-base text-neutral-600 mt-2">Gestiona tus envíos y ofertas de clientes</p>
            </div>
          </div>
        </div>
        


        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">
                    {stats.completedShipments}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Mis Envíos</p>
                  <p className="text-xs text-blue-500 font-medium">Completados</p>
                </div>
                <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-green-600">
                    {stats.ongoingShipments}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Envíos Activos</p>
                  <p className="text-xs text-green-500 font-medium">En proceso</p>
                </div>
                <Truck className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-orange-600">
                    Q.{stats.totalEarnings}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Total Ganado</p>
                  <p className="text-xs text-orange-500 font-medium">Este mes</p>
                </div>
                <Coins className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-purple-600">
                    {stats.avgRating}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Calificación</p>
                  <p className="text-xs text-purple-500 font-medium">Promedio de {stats.totalRatings} reseñas</p>
                </div>
                <Star className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GPS Status */}
        {gpsTracking && (
          <Alert className="mb-6">
            <Navigation className="h-4 w-4" />
            <AlertDescription>
              GPS Activo - Tu ubicación se está compartiendo en tiempo real con los clientes.
              {currentLocation && (
                <span className="ml-2">
                  Ubicación actual: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={currentTab} onValueChange={(v)=>{ setCurrentTab(v); navigate(`?tab=${v}`, { replace: true }); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="marketplace" className="text-xs md:text-sm p-2 md:p-3">Marketplace</TabsTrigger>
            <TabsTrigger value="received-quotes" className="text-xs md:text-sm p-2 md:p-3 hidden">Ofertas Recibidas</TabsTrigger>
            <TabsTrigger value="my-bids" className="text-xs md:text-sm p-2 md:p-3">Ofertas Enviadas</TabsTrigger>
            <TabsTrigger value="active-shipments" className="text-xs md:text-sm p-2 md:p-3">Mis Envíos</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs md:text-sm p-2 md:p-3">Mis Vehículos</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm p-2 md:p-3">Mi Perfil</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace de Envíos</CardTitle>
                <CardDescription>
                  Envíos disponibles para ofertar • Solo se muestran envíos pendientes de aceptación
                </CardDescription>
              </CardHeader>
              <CardContent>
                {marketLoading ? (
                  <div className="text-center py-8 text-neutral-500">Cargando envíos...</div>
                ) : marketError ? (
                  <div className="text-center py-8 text-red-600">{marketError}</div>
                ) : availableShipments.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No hay envíos disponibles
                    </h3>
                    <p className="text-neutral-500">
                      No hay nuevos envíos disponibles para ofertar en este momento
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por título, origen, destino o cliente..."
                            value={marketplaceSearchTerm}
                            onChange={(e) => setMarketplaceSearchTerm(e.target.value)}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>
                      <Select value={marketplaceCargoFilter} onValueChange={setMarketplaceCargoFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de carga" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
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
                      <Select value={marketplacePriceFilter} onValueChange={setMarketplacePriceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Rango de precio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los precios</SelectItem>
                          <SelectItem value="high">Q 5,000+</SelectItem>
                          <SelectItem value="medium">Q 2,000 - Q 5,000</SelectItem>
                          <SelectItem value="low">Menos de Q 2,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mb-6">
                      <Select value={marketplaceLocationFilter} onValueChange={setMarketplaceLocationFilter}>
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue placeholder="Filtrar por ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las ubicaciones</SelectItem>
                          <SelectItem value="guatemala">Ciudad de Guatemala</SelectItem>
                          <SelectItem value="antigua">Antigua Guatemala</SelectItem>
                          <SelectItem value="quetzaltenango">Quetzaltenango</SelectItem>
                          <SelectItem value="peten">Petén</SelectItem>
                          <SelectItem value="escuintla">Escuintla</SelectItem>
                          <SelectItem value="huehuetenango">Huehuetenango</SelectItem>
                          <SelectItem value="chimaltenango">Chimaltenango</SelectItem>
                          <SelectItem value="sacatepequez">Sacatepéquez</SelectItem>
                          <SelectItem value="retalhuleu">Retalhuleu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Shipments */}
                    {(() => {
                      const filteredShipments = availableShipments.filter((shipment: any) => {
                        // Search filter
                        const matchesSearch = !marketplaceSearchTerm || 
                          shipment.title?.toLowerCase().includes(marketplaceSearchTerm.toLowerCase()) ||
                          shipment.originAddress?.toLowerCase().includes(marketplaceSearchTerm.toLowerCase()) ||
                          shipment.destinationAddress?.toLowerCase().includes(marketplaceSearchTerm.toLowerCase()) ||
                          shipment.clientName?.toLowerCase().includes(marketplaceSearchTerm.toLowerCase()) ||
                          shipment.clientCompany?.toLowerCase().includes(marketplaceSearchTerm.toLowerCase());
                        
                        // Cargo type filter
                        const matchesCargo = marketplaceCargoFilter === 'all' || 
                          shipment.cargoType === marketplaceCargoFilter;
                        
                        // Price filter
                        const shipmentPrice = parseFloat(shipment.estimatedPrice?.toString() || '0');
                        const matchesPrice = marketplacePriceFilter === 'all' || 
                          (marketplacePriceFilter === 'high' && shipmentPrice >= 5000) ||
                          (marketplacePriceFilter === 'medium' && shipmentPrice >= 2000 && shipmentPrice < 5000) ||
                          (marketplacePriceFilter === 'low' && shipmentPrice < 2000);
                        
                        // Location filter
                        const matchesLocation = marketplaceLocationFilter === 'all' || 
                          shipment.originAddress?.toLowerCase().includes(marketplaceLocationFilter.toLowerCase()) ||
                          shipment.destinationAddress?.toLowerCase().includes(marketplaceLocationFilter.toLowerCase());
                        
                        return matchesSearch && matchesCargo && matchesPrice && matchesLocation;
                      });

                      if (filteredShipments.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron envíos</h3>
                            <p className="text-gray-500">
                              {marketplaceSearchTerm || marketplaceCargoFilter !== 'all' || marketplacePriceFilter !== 'all' || marketplaceLocationFilter !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay envíos que coincidan con los criterios seleccionados'
                              }
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {filteredShipments.map((shipment: any) => (
                      <Card key={shipment.id} className="border">
                        <CardContent className="p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-base md:text-lg">{shipment.title}</h4>
                              <p className="text-xs md:text-sm text-neutral-500">
                                Peso: {shipment.weight}kg • {translateCargoType(shipment.cargoType)}
                              </p>
                              {/* Client Information */}
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Users className="w-3 h-3 text-blue-600" />
                                  <span className="text-xs font-medium text-blue-800">Cliente:</span>
                                </div>
                                <p className="text-xs md:text-sm font-semibold text-blue-900">
                                  {shipment.clientName || `Cliente (${shipment.raw?.user_id?.slice(0, 8)}...)`}
                                </p>
                                {shipment.clientCompany && (
                                  <p className="text-xs text-blue-700">
                                    {shipment.clientCompany}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-1">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                Disponible
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Q{shipment.estimatedPrice}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-xs md:text-sm">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-2" />
                              <span className="text-green-600">Origen:</span>
                              <span className="ml-1">{shipment.originAddress}</span>
                            </div>
                            <div className="flex items-center text-xs md:text-sm">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-600 mr-2" />
                              <span className="text-red-600">Destino:</span>
                              <span className="ml-1">{shipment.destinationAddress}</span>
                            </div>
                            <div className="flex items-center text-xs md:text-sm">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-600 mr-2" />
                              <span>Fecha: {new Date(shipment.pickupDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => openBidForShipment(shipment)}
                              className="w-full sm:w-auto text-xs md:text-sm"
                            >
                              <Coins className="w-3 h-3 mr-1" />
                              Hacer Oferta
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openViewShipment(shipment.id)} className="w-full sm:w-auto text-xs md:text-sm">
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Detalles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Received Quotes Tab */}
          <TabsContent value="received-quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Cotización Recibidas</CardTitle>
                <CardDescription>
                  Cotizaciones solicitadas por clientes que puedes responder
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={refreshQuoteRequests} disabled={quoteRequestsLoading}>
                    {quoteRequestsLoading ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quoteRequestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Cargando solicitudes...</span>
                  </div>
                ) : quoteRequestsError ? (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar solicitudes</h3>
                    <p className="text-gray-500 mb-4">{quoteRequestsError}</p>
                    <Button variant="outline" onClick={refreshQuoteRequests}>Reintentar</Button>
                  </div>
                ) : quoteRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes de cotización</h3>
                    <p className="text-gray-500">
                      Las solicitudes de cotización de clientes aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quoteRequests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{request.shipment?.title || 'Sin título'}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(request.status)}
                                <span className="text-sm text-gray-500">
                                  {new Date(request.createdAt).toLocaleDateString('es-GT')}
                                </span>
                              </div>
                            </div>
                            {request.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  setSelectedQuoteRequest(request);
                                  setIsQuoteResponseDialogOpen(true);
                                }}
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Responder
                              </Button>
                            )}
                          </div>
                          
                          {/* Client and Request Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Cliente</p>
                              <p className="text-sm text-gray-900">
                                {request.client?.full_name || 'Cliente no especificado'}
                                {request.client?.company && ` (${request.client.company})`}
                              </p>
                              {request.client?.phone && (
                                <p className="text-xs text-gray-500 mt-1">📞 {request.client.phone}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Mensaje de Solicitud</p>
                              <p className="text-sm text-gray-900">{request.message || 'Sin mensaje'}</p>
                            </div>
                          </div>

                          {/* Route and Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-gray-500">📍 Origen</p>
                              <p className="font-medium">{request.shipment?.origin_address || 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">🎯 Destino</p>
                              <p className="font-medium">{request.shipment?.destination_address || 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">📅 Fecha de Recogida</p>
                              <p className="font-medium">
                                {request.shipment?.pickup_date 
                                  ? new Date(request.shipment.pickup_date).toLocaleDateString('es-GT')
                                  : 'No especificado'
                                }
                                {request.shipment?.pickup_time && (
                                  <span className="text-xs text-gray-500 block">{request.shipment.pickup_time}</span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Cargo Details */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-gray-500">⚖️ Peso</p>
                              <p className="font-medium">{request.shipment?.weight ? `${request.shipment.weight} kg` : 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">📦 Tipo de Carga</p>
                              <p className="font-medium">{translateToSpanish(request.shipment?.cargo_type)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">📏 Dimensiones</p>
                              <p className="font-medium">
                                {request.shipment?.dimensions_length && request.shipment?.dimensions_width && request.shipment?.dimensions_height
                                  ? `${request.shipment.dimensions_length} × ${request.shipment.dimensions_width} × ${request.shipment.dimensions_height} cm`
                                  : 'No especificado'
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">🔢 Piezas</p>
                              <p className="font-medium">{request.shipment?.pieces || 'No especificado'}</p>
                            </div>
                          </div>

                          {/* Additional Details */}
                          {(request.shipment?.volume || request.shipment?.packaging || request.shipment?.estimated_price) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                              {request.shipment?.volume && (
                                <div>
                                  <p className="text-gray-500">📊 Volumen</p>
                                  <p className="font-medium">{request.shipment.volume} m³</p>
                                </div>
                              )}
                              {request.shipment?.packaging && (
                                <div>
                                  <p className="text-gray-500">📦 Empaque</p>
                                  <p className="font-medium">{translateToSpanish(request.shipment.packaging)}</p>
                                </div>
                              )}
                              {request.shipment?.estimated_price && (
                                <div>
                                  <p className="text-gray-500">💰 Precio Estimado</p>
                                  <p className="font-medium text-green-600">Q {request.shipment.estimated_price.toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Special Requirements */}
                          {(request.shipment?.special_requirements || request.shipment?.temperature || request.shipment?.humidity || request.shipment?.customs) && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                              <h6 className="font-medium text-yellow-800 mb-2">⚠️ Requisitos Especiales</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {request.shipment?.special_requirements && (
                                  <div>
                                    <p className="text-yellow-700 font-medium">Requisitos:</p>
                                    <p className="text-yellow-600">{request.shipment.special_requirements}</p>
                                  </div>
                                )}
                                {request.shipment?.temperature && (
                                  <div>
                                    <p className="text-yellow-700 font-medium">🌡️ Temperatura:</p>
                                    <p className="text-yellow-600">{translateToSpanish(request.shipment.temperature)}</p>
                                  </div>
                                )}
                                {request.shipment?.humidity && (
                                  <div>
                                    <p className="text-yellow-700 font-medium">💧 Humedad:</p>
                                    <p className="text-yellow-600">{translateToSpanish(request.shipment.humidity)}</p>
                                  </div>
                                )}
                                {request.shipment?.customs && (
                                  <div>
                                    <p className="text-yellow-700 font-medium">🛃 Aduana:</p>
                                    <p className="text-yellow-600">Requerida</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Contact Information */}
                          {(request.shipment?.contact_person || request.shipment?.contact_phone) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <h6 className="font-medium text-blue-800 mb-2">📞 Información de Contacto</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {request.shipment?.contact_person && (
                                  <div>
                                    <p className="text-blue-700 font-medium">Contacto:</p>
                                    <p className="text-blue-600">{request.shipment.contact_person}</p>
                                  </div>
                                )}
                                {request.shipment?.contact_phone && (
                                  <div>
                                    <p className="text-blue-700 font-medium">Teléfono:</p>
                                    <p className="text-blue-600">{request.shipment.contact_phone}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Instructions */}
                          {(request.shipment?.pickup_instructions || request.shipment?.delivery_instructions) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                              <h6 className="font-medium text-gray-800 mb-2">📋 Instrucciones</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {request.shipment?.pickup_instructions && (
                                  <div>
                                    <p className="text-gray-700 font-medium">Recogida:</p>
                                    <p className="text-gray-600 whitespace-pre-wrap">{request.shipment.pickup_instructions}</p>
                                  </div>
                                )}
                                {request.shipment?.delivery_instructions && (
                                  <div>
                                    <p className="text-gray-700 font-medium">Entrega:</p>
                                    <p className="text-gray-600 whitespace-pre-wrap">{request.shipment.delivery_instructions}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Insurance */}
                          {request.shipment?.insurance_value && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <h6 className="font-medium text-green-800 mb-2">🛡️ Seguro</h6>
                              <p className="text-green-600 text-sm">
                                Valor asegurado: <span className="font-medium">Q {request.shipment.insurance_value.toLocaleString()}</span>
                              </p>
                            </div>
                          )}

                          {request.status === 'responded' && (
                            <div className="border-t pt-4">
                              <h5 className="font-medium text-gray-900 mb-2">Tu Respuesta:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Monto</p>
                                  <p className="font-medium">Q {request.responseAmount?.toLocaleString() || 'No especificado'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Duración Estimada</p>
                                  <p className="font-medium">{request.responseEstimatedDuration || 'No especificado'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Respondido</p>
                                  <p className="font-medium">
                                    {request.respondedAt ? new Date(request.respondedAt).toLocaleDateString('es-GT') : 'No especificado'}
                                  </p>
                                </div>
                              </div>
                              {request.responseMessage && (
                                <div className="mt-2">
                                  <p className="text-gray-500 text-sm">Mensaje</p>
                                  <p className="text-sm text-gray-900">{request.responseMessage}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="my-bids" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ofertas Enviadas</CardTitle>
                <CardDescription>
                  Seguimiento de todas las ofertas que has enviado
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={refreshMyBids} disabled={myBidsLoading}>
                    {myBidsLoading ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {myBidsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-neutral-500">Cargando ofertas...</p>
                  </div>
                ) : myBidsError ? (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar ofertas</h3>
                    <p className="text-red-500 mb-4">{myBidsError}</p>
                    <Button variant="outline" onClick={refreshMyBids}>Reintentar</Button>
                  </div>
                ) : myBids.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No has enviado ofertas aún
                    </h3>
                    <p className="text-neutral-500">
                      Explora el marketplace para encontrar envíos disponibles
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="lg:col-span-1">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por envío, origen o destino..."
                            value={myBidsSearchTerm}
                            onChange={(e) => setMyBidsSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={myBidsStatusFilter} onValueChange={setMyBidsStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado de la oferta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="accepted">Aceptada</SelectItem>
                          <SelectItem value="rejected">Rechazada</SelectItem>
                          <SelectItem value="paid">Pagada</SelectItem>
                          <SelectItem value="completed">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={myBidsAmountFilter} onValueChange={setMyBidsAmountFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Rango de oferta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los montos</SelectItem>
                          <SelectItem value="high">Q 5,000+</SelectItem>
                          <SelectItem value="medium">Q 2,000 - Q 5,000</SelectItem>
                          <SelectItem value="low">Menos de Q 2,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Bids Table */}
                    {(() => {
                      console.log('🔍 Filtering bids with:', {
                        totalBids: myBids.length,
                        statusFilter: myBidsStatusFilter,
                        searchTerm: myBidsSearchTerm,
                        amountFilter: myBidsAmountFilter
                      });
                      
                      // Log all bid statuses
                      myBids.forEach((bid: any, index: number) => {
                        console.log(`📋 Bid ${index + 1}: status = "${bid.status}", title = "${bid.shipmentTitle}"`);
                      });
                      
                      const filteredBids = myBids.filter((bid: any) => {
                        // Search filter
                        const matchesSearch = !myBidsSearchTerm || 
                          bid.shipmentTitle?.toLowerCase().includes(myBidsSearchTerm.toLowerCase()) ||
                          bid.originAddress?.toLowerCase().includes(myBidsSearchTerm.toLowerCase()) ||
                          bid.destinationAddress?.toLowerCase().includes(myBidsSearchTerm.toLowerCase());
                        
                        // Status filter
                        const matchesStatus = myBidsStatusFilter === 'all' || 
                          bid.status === myBidsStatusFilter;
                        
                        // Amount filter
                        const bidAmount = parseFloat(bid.amount?.toString() || '0');
                        const matchesAmount = myBidsAmountFilter === 'all' || 
                          (myBidsAmountFilter === 'high' && bidAmount >= 5000) ||
                          (myBidsAmountFilter === 'medium' && bidAmount >= 2000 && bidAmount < 5000) ||
                          (myBidsAmountFilter === 'low' && bidAmount < 2000);
                        
                        const matches = matchesSearch && matchesStatus && matchesAmount;
                        
                        if (myBidsStatusFilter === 'completed') {
                          console.log(`🔍 Bid "${bid.shipmentTitle}": status="${bid.status}", matchesStatus=${matchesStatus}, matches=${matches}`);
                        }
                        
                        return matches;
                      });
                      
                      console.log(`📊 Filtered results: ${filteredBids.length} bids match the filters`);

                      if (filteredBids.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ofertas</h3>
                            <p className="text-gray-500">
                              {myBidsSearchTerm || myBidsStatusFilter !== 'all' || myBidsAmountFilter !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay ofertas que coincidan con los criterios seleccionados'
                              }
                            </p>
                          </div>
                        );
                      }

                      return (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Envío</TableHead>
                              <TableHead>Mi Oferta</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Fecha</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredBids.map((bid: any) => (
                        <TableRow key={bid.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{bid.shipmentTitle}</div>
                              <div className="text-sm text-neutral-500">
                                {bid.originAddress} → {bid.destinationAddress}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">Q{bid.amount}</div>
                            <div className="text-sm text-neutral-500">
                              {bid.estimatedDuration}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(bid.status)}</TableCell>
                          <TableCell>
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Shipments Tab */}
          <TabsContent value="active-shipments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Envíos</CardTitle>
                <CardDescription>
                  Envíos activos y completados
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={refreshActiveShipments} disabled={activeShipmentsLoading}>
                    {activeShipmentsLoading ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeShipmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-neutral-500">Cargando envíos...</p>
                  </div>
                ) : activeShipmentsError ? (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar envíos</h3>
                    <p className="text-red-500 mb-4">{activeShipmentsError}</p>
                    <Button variant="outline" onClick={refreshActiveShipments}>Reintentar</Button>
                  </div>
                ) : activeShipments.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No tienes envíos activos
                    </h3>
                    <p className="text-neutral-500">
                      Una vez que acepten tus ofertas, aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="lg:col-span-1">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por envío, cliente, origen o destino..."
                            value={activeShipmentsSearchTerm}
                            onChange={(e) => setActiveShipmentsSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={activeShipmentsStatusFilter} onValueChange={setActiveShipmentsStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado del envío" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="active">En Tránsito</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={activeShipmentsPriceFilter} onValueChange={setActiveShipmentsPriceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Rango de precio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los precios</SelectItem>
                          <SelectItem value="high">Q 5,000 o más</SelectItem>
                          <SelectItem value="medium">Q 2,000 - Q 4,999</SelectItem>
                          <SelectItem value="low">Menos de Q 2,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={activeShipmentsCargoFilter} onValueChange={setActiveShipmentsCargoFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de carga" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          <SelectItem value="general">Carga General</SelectItem>
                          <SelectItem value="fragile">Carga Frágil</SelectItem>
                          <SelectItem value="hazardous">Carga Peligrosa</SelectItem>
                          <SelectItem value="refrigerated">Carga Refrigerada</SelectItem>
                          <SelectItem value="bulk">Carga a Granel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Shipments */}
                    {(() => {
                      const filteredShipments = activeShipments.filter((shipment: any) => {
                        // Search filter
                        const matchesSearch = !activeShipmentsSearchTerm || 
                          shipment.title?.toLowerCase().includes(activeShipmentsSearchTerm.toLowerCase()) ||
                          shipment.clientName?.toLowerCase().includes(activeShipmentsSearchTerm.toLowerCase()) ||
                          shipment.originAddress?.toLowerCase().includes(activeShipmentsSearchTerm.toLowerCase()) ||
                          shipment.destinationAddress?.toLowerCase().includes(activeShipmentsSearchTerm.toLowerCase());
                        
                        // Status filter
                        const isCompleted = shipment.status === 'completed' || shipment.shipmentStatus === 'completed';
                        const matchesStatus = activeShipmentsStatusFilter === 'all' || 
                          (activeShipmentsStatusFilter === 'completed' && isCompleted) ||
                          (activeShipmentsStatusFilter === 'active' && !isCompleted);
                        
                        // Price filter
                        const shipmentPrice = parseFloat(shipment.finalPrice?.toString() || '0');
                        const matchesPrice = activeShipmentsPriceFilter === 'all' || 
                          (activeShipmentsPriceFilter === 'high' && shipmentPrice >= 5000) ||
                          (activeShipmentsPriceFilter === 'medium' && shipmentPrice >= 2000 && shipmentPrice < 5000) ||
                          (activeShipmentsPriceFilter === 'low' && shipmentPrice < 2000);
                        
                        // Cargo type filter
                        const matchesCargo = activeShipmentsCargoFilter === 'all' || 
                          shipment.cargoType === activeShipmentsCargoFilter;
                        
                        return matchesSearch && matchesStatus && matchesPrice && matchesCargo;
                      });

                      if (filteredShipments.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No se encontraron envíos
                            </h3>
                            <p className="text-gray-500">
                              No hay envíos que coincidan con los filtros seleccionados
                            </p>
                          </div>
                        );
                      }

                      return filteredShipments.map((shipment: any) => {
                        // Debug completion status
                        const isCompleted = shipment.status === 'completed' || 
                                          shipment.shipmentStatus === 'completed' || 
                                          (shipment.comments && shipment.comments.includes('COMPLETED_'));
                        console.log(`🔍 Shipment ${shipment.id} completion check:`, {
                          status: shipment.status,
                          shipmentStatus: shipment.shipmentStatus,
                          comments: shipment.comments,
                          hasCompletionComment: shipment.comments && shipment.comments.includes('COMPLETED_'),
                          isCompleted: isCompleted
                        });
                        
                        return (
                      <Card key={shipment.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{shipment.title}</h4>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                Q{shipment.finalPrice}
                              </div>
                              <Badge 
                                variant={isCompleted ? 'default' : 'outline'} 
                                className={
                                  isCompleted
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'text-blue-600 border-blue-600'
                                }
                              >
                                {isCompleted ? 'Completado' : 'En Tránsito'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-neutral-700">Origen</p>
                              <p className="text-sm text-neutral-500">{shipment.originAddress}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-700">Destino</p>
                              <p className="text-sm text-neutral-500">{shipment.destinationAddress}</p>
                            </div>
                          </div>
                          
                          {/* Additional Details */}
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-neutral-700">Tiempo Estimado</p>
                              <p className="text-sm text-neutral-500">
                                {shipment.estimatedDuration ? `${shipment.estimatedDuration} días` : 'No especificado'}
                              </p>
                            </div>
                          </div>
                          
                          {shipment.comments && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-neutral-700">Comentarios</p>
                              <p className="text-sm text-neutral-500 bg-neutral-100 p-2 rounded">
                                {formatCompletionComment(shipment.comments)}
                              </p>
                            </div>
                          )}

                          {/* Review Section */}
                          {shipment.review && (
                            <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-yellow-600 fill-current" />
                                <p className="text-sm font-medium text-yellow-800">Reseña del Cliente</p>
                              </div>
                              
                              {/* Rating Stars */}
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-4 h-4 ${star <= shipment.review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                                <span className="text-sm text-yellow-700 ml-2">
                                  {shipment.review.rating}/5
                                </span>
                              </div>
                              
                              {/* Review Comment */}
                              {shipment.review.comment && (
                                <div className="bg-white p-3 rounded border border-yellow-300">
                                  <p className="text-sm text-gray-700 italic">
                                    "{shipment.review.comment}"
                                  </p>
                                </div>
                              )}
                              
                              {/* Review Date */}
                              <p className="text-xs text-yellow-600 mt-2">
                                Reseña enviada el: {new Date(shipment.review.created_at).toLocaleDateString('es-GT')}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleStartTracking(shipment)}
                              disabled={isCompleted}
                              className={shipment.tracking_enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              {shipment.tracking_enabled ? "Ver Seguimiento" : "Ver Seguimiento"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleChatForShipment(shipment)}
                              disabled={isCompleted}
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat con Cliente
                            </Button>
                            {!(shipment.status === 'completed' || 
                               shipment.shipmentStatus === 'completed' || 
                               (shipment.comments && shipment.comments.includes('COMPLETED_'))) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMarkAsCompleted(shipment)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Marcar como Completado
                              </Button>
                            )}
                            
                            {/* Show completion indicator if completed */}
                            {isCompleted && (
                              <div className="mt-3 p-2 bg-green-100 rounded border border-green-300">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <p className="text-sm font-medium text-green-800">
                                    ✅ Envío Completado
                                  </p>
                                </div>
                                {shipment.comments && shipment.comments.includes('COMPLETED_') && (
                                  <p className="text-xs text-green-600 mt-1">
                                    {formatCompletionComment(shipment.comments)}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      );
                    });
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>



          {/* Vehicles Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Vehículos</CardTitle>
                <CardDescription>Administra tu flota y sube los documentos requeridos por vehículo</CardDescription>
              </CardHeader>
              <CardContent>
                <input ref={docFileInputRef} type="file" className="hidden" onChange={handleDocumentFileChange} accept={docAccept} multiple={uploadingDocType === 'vehicle_photo'} />
                {docsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700">{docsError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="space-y-4 md:col-span-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Documentos Requeridos</h3>
                      {vehicles.length > 0 && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-neutral-600">Vehículo</label>
                          <select
                            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                            value={selectedVehicleId || ''}
                            onChange={(e)=> setSelectedVehicleId(e.target.value)}
                          >
                            {vehicles.map(v => (
                              <option key={v.id} value={v.id}>{v.name || v.plate || v.vehicle_type || 'Vehículo'}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    {vehicles.length === 0 ? (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-700">Aún no has agregado vehículos</span>
                          <Button size="sm" variant="outline" onClick={()=>setIsAddVehicleOpen(true)}>Agregar Vehículo</Button>
                        </div>
                        <p className="text-xs text-neutral-500">Registra al menos un vehículo para subir documentos de Placas, Póliza y Fotos.</p>
                      </div>
                    ) : DOCUMENT_TYPES.map((dt) => {
                      const allForType = documents.filter(d => d.doc_type === dt.key && d.vehicle_id === selectedVehicleId);
                      const singleTypes = ['dpi', 'driver_license', 'insurance', 'vehicle_plate'];
                      if (singleTypes.includes(dt.key)) {
                        const existing = allForType[0];
                        const status = existing?.status || 'pending';
                        const statusBadge = status === 'approved'
                          ? 'text-green-600 border-green-600'
                          : status === 'rejected'
                          ? 'text-red-600 border-red-600'
                          : 'text-yellow-600 border-yellow-600';
                        return (
                          <div key={dt.key} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                                <span className="font-medium">{dt.label}</span>
                        </div>
                              <Badge variant="outline" className={statusBadge}>
                                {status === 'approved' ? 'Aprobado' : status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                        </Badge>
                      </div>
                            {existing ? (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => viewDocument(existing)}>Ver</Button>
                                <Button size="sm" variant="outline" onClick={() => handleUploadDocumentClick(dt.key)}>Reemplazar</Button>
                                <Button size="sm" variant="outline" className="text-red-600" onClick={() => openDeleteDocument(existing)}>Eliminar</Button>
                    </div>
                            ) : (
                              <Button size="sm" onClick={() => handleUploadDocumentClick(dt.key)} disabled={docsLoading}>Subir</Button>
                            )}
                            {existing && (
                              <p className="text-xs text-neutral-500 mt-2">Subido: {new Date(existing.uploaded_at).toLocaleDateString('es-GT')}</p>
                            )}
                          </div>
                        );
                      }
                      // vehicle_photo gallery
                      // Same card layout with status badge on the right, plus gallery preview
                      const status = allForType.length && allForType.every(d => d.status === 'approved') ? 'approved' : allForType.some(d => d.status === 'rejected') ? 'rejected' : 'pending';
                      const statusBadge = status === 'approved'
                        ? 'text-green-600 border-green-600'
                        : status === 'rejected'
                        ? 'text-red-600 border-red-600'
                        : 'text-yellow-600 border-yellow-600';
                      return (
                        <div key={dt.key} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                              <span className="font-medium">{dt.label}</span>
                        </div>
                            <Badge variant="outline" className={statusBadge}>
                              {status === 'approved' ? 'Aprobado' : status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                        </Badge>
                      </div>
                          {allForType.length === 0 ? (
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-neutral-500">Aún no has subido fotos del vehículo.</p>
                              <Button size="sm" onClick={() => handleUploadDocumentClick(dt.key)} disabled={docsLoading}>Subir</Button>
                    </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                {allForType.map((doc) => (
                                  <div key={doc.id} className="border rounded p-2">
                                    <div className="aspect-video rounded overflow-hidden bg-neutral-100 flex items-center justify-center mb-2">
                                    {(doc.display_url || doc.public_url)?.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i) ? (
                                        <img src={doc.display_url || doc.public_url || ''} className="w-full h-full object-cover" />
                                      ) : (
                                        <FileText className="w-6 h-6 text-neutral-400" />
                                      )}
                                    </div>
                                    <div className="flex justify-between gap-2">
                                      <Button size="sm" variant="outline" onClick={() => viewDocument(doc)}>Ver</Button>
                                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => openDeleteDocument(doc)}>Eliminar</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleUploadDocumentClick(dt.key)}>Añadir Foto</Button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold">Gestión de Vehículos</h3>
                    <div className="border rounded-lg p-4">
                      {vehiclesLoading ? (
                        <div className="text-sm text-neutral-500">Cargando vehículos...</div>
                      ) : vehiclesError ? (
                        <div className="text-sm text-red-600">{vehiclesError}</div>
                      ) : (
                        <div className="space-y-3">
                          {vehicles.length === 0 ? (
                            <div className="text-sm text-neutral-500">Aún no has agregado vehículos.</div>
                          ) : (
                            vehicles.map(v => {
                              const vdocs = documents.filter(d => d.vehicle_id === v.id);
                              const requiredTypes = ['dpi','driver_license','vehicle_plate','insurance','vehicle_photo'];
                              const done = requiredTypes.reduce((acc, t) => acc + (t==='vehicle_photo' ? (vdocs.some(d=>d.doc_type===t && d.status==='approved')?1:0) : (vdocs.some(d=>d.doc_type===t && d.status==='approved')?1:0)), 0);
                              const status = getVehicleStatus(v.id);
                              return (
                                <div key={v.id} className={`p-2 md:p-3 rounded border ${selectedVehicleId===v.id ? 'border-blue-300 bg-blue-50' : 'border-neutral-200'}`}>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                                    <div className="sm:col-span-2 min-w-0">
                                      <div className="text-sm truncate">
                                        <div className="font-medium flex items-center gap-2 truncate">
                                          <span className="truncate">{v.name || 'Vehículo'}</span>
                                          <Badge variant="outline" className={`text-[11px] py-0.5 px-2 ${getStatusBadgeClass(status)}`}>
                                            {status === 'approved' ? 'Aprobado' : status === 'rejected' ? 'Observ.' : 'Pendiente'}
                                          </Badge>
                                          <span className="text-[11px] text-neutral-500">{done}/5</span>
                                        </div>
                                        <div className="text-neutral-600 text-xs truncate">{translateVehicleType(v.vehicle_type)} • {v.plate || '-'}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:justify-end flex-wrap">
                                      <Button size="sm" variant="outline" className="h-8 px-2" onClick={()=>setSelectedVehicleId(v.id)}>Seleccionar</Button>
                                      <Button size="sm" variant="outline" className="h-8 px-2" onClick={()=>openEditVehicle(v)}>Editar</Button>
                                      <Button size="sm" variant="outline" className="h-8 px-2 text-red-600" onClick={()=>openDeleteVehicle(v)}>Eliminar</Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                          <Button size="sm" variant="outline" onClick={()=>setIsAddVehicleOpen(true)}>Agregar Vehículo</Button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold">Estado de Verificación</h3>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Estado de Cuenta</span>
                        <Badge variant="outline" className={documents.some(d => d.status === 'rejected') ? 'text-red-600 border-red-600' : documents.length && documents.every(d => d.status === 'approved') ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'}>
                          {documents.some(d => d.status === 'rejected') ? 'Con Observaciones' : documents.length && documents.every(d => d.status === 'approved') ? 'Aprobado' : 'En Revisión'}
                        </Badge>
                      </div>
                      <div className="text-sm text-neutral-500 mb-3">
                        Sube tus documentos requeridos. La verificación puede tomar 1-2 días hábiles.
                      </div>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Mientras tu cuenta está en verificación, puedes hacer ofertas pero no recibirás envíos confirmados.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delete Document Dialog */}
            <Dialog open={isDeleteDocDialogOpen} onOpenChange={setIsDeleteDocDialogOpen}>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Eliminar documento</DialogTitle>
                  <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                </DialogHeader>
                {docToDelete && (
                  <div className="bg-gray-50 p-3 rounded mb-3 text-sm">
                    <p className="mb-1"><strong>Tipo:</strong> {docToDelete.doc_type}</p>
                    <p className="break-all"><strong>Archivo:</strong> {docToDelete.file_name}</p>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDeleteDocDialogOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={confirmDeleteDocument}>Eliminar</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Vehicle Dialog */}
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Agregar Vehículo</DialogTitle>
                  <DialogDescription>Registra un nuevo vehículo para asociar sus documentos.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Nombre</Label>
                    <Input value={newVehicle.name} onChange={(e)=>setNewVehicle({...newVehicle, name: e.target.value})} placeholder="Mi Camión" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Placa</Label>
                      <Input value={newVehicle.plate} onChange={(e)=>setNewVehicle({...newVehicle, plate: e.target.value})} placeholder="P-123ABC" />
                    </div>
                    <div>
                      <Label>Tipo de Vehículo</Label>
                      <Select value={newVehicle.vehicle_type} onValueChange={(v)=>setNewVehicle({...newVehicle, vehicle_type: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="small_truck">Camión Pequeño</SelectItem>
                          <SelectItem value="medium_truck">Camión Mediano</SelectItem>
                          <SelectItem value="large_truck">Camión Grande</SelectItem>
                          <SelectItem value="trailer">Trailer</SelectItem>
                          <SelectItem value="flatbed">Plataforma</SelectItem>
                          <SelectItem value="reefer">Refrigerado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Marca</Label>
                      <Input 
                        value={newVehicle.brand} 
                        onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})} 
                        placeholder="Marca (ej. Volvo)" 
                      />
                    </div>
                    <div>
                      <Label>Modelo</Label>
                      <Input 
                        value={newVehicle.model} 
                        onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} 
                        placeholder="Modelo (ej. FH)" 
                      />
                    </div>
                  </div>
                  

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Año</Label>
                      <Input 
                        type="number" 
                        value={newVehicle.year} 
                        onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})} 
                        placeholder="2020" 
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input 
                        value={newVehicle.color} 
                        onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})} 
                        placeholder="Blanco" 
                      />
                    </div>
                    <div>
                      <Label>Capacidad (kg)</Label>
                      <Input 
                        type="number" 
                        value={newVehicle.capacity_kg} 
                        onChange={(e) => setNewVehicle({...newVehicle, capacity_kg: e.target.value})} 
                        placeholder="10000" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Ejes</Label>
                      <Input 
                        type="number" 
                        value={newVehicle.axle_count} 
                        onChange={(e) => setNewVehicle({...newVehicle, axle_count: e.target.value})} 
                        placeholder="2" 
                      />
                    </div>
                    <div>
                      <Label>Largo (m)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={newVehicle.length_m} 
                        onChange={(e) => setNewVehicle({...newVehicle, length_m: e.target.value})} 
                        placeholder="6.0" 
                      />
                    </div>
                    <div>
                      <Label>Ancho (m)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={newVehicle.width_m} 
                        onChange={(e) => setNewVehicle({...newVehicle, width_m: e.target.value})} 
                        placeholder="2.4" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Alto (m)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={newVehicle.height_m} 
                        onChange={(e) => setNewVehicle({...newVehicle, height_m: e.target.value})} 
                        placeholder="2.8" 
                      />
                    </div>
                    <div>
                      <Label>Combustible</Label>
                      <Input 
                        value={newVehicle.fuel_type} 
                        onChange={(e) => setNewVehicle({...newVehicle, fuel_type: e.target.value})} 
                        placeholder="Diésel" 
                      />
                    </div>
                    <div>
                      <Label>Norma Emisiones</Label>
                      <Input 
                        value={newVehicle.emission_standard} 
                        onChange={(e) => setNewVehicle({...newVehicle, emission_standard: e.target.value})} 
                        placeholder="Euro 5" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Propietario</Label>
                    <Select 
                      value={newVehicle.owner_type} 
                      onValueChange={(value) => setNewVehicle({...newVehicle, owner_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own">Propio</SelectItem>
                        <SelectItem value="leased">Arrendado</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>setIsAddVehicleOpen(false)}>Cancelar</Button>
                  <Button onClick={addVehicle}>Agregar</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Vehicle Dialog */}
            <Dialog open={isEditVehicleOpen} onOpenChange={setIsEditVehicleOpen}>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Editar Vehículo</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Nombre</Label>
                    <Input value={editVehicle.name} onChange={(e)=>setEditVehicle({...editVehicle, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Placa</Label>
                      <Input value={editVehicle.plate} onChange={(e)=>setEditVehicle({...editVehicle, plate: e.target.value})} />
                    </div>
                    <div>
                      <Label>Tipo de Vehículo</Label>
                      <Select value={editVehicle.vehicle_type} onValueChange={(v)=>setEditVehicle({...editVehicle, vehicle_type: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="small_truck">Camión Pequeño</SelectItem>
                          <SelectItem value="medium_truck">Camión Mediano</SelectItem>
                          <SelectItem value="large_truck">Camión Grande</SelectItem>
                          <SelectItem value="trailer">Trailer</SelectItem>
                          <SelectItem value="flatbed">Plataforma</SelectItem>
                          <SelectItem value="reefer">Refrigerado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Marca</Label>
                      <Input value={editVehicle.brand} onChange={(e)=>setEditVehicle({...editVehicle, brand: e.target.value})} />
                    </div>
                    <div>
                      <Label>Modelo</Label>
                      <Input value={editVehicle.model} onChange={(e)=>setEditVehicle({...editVehicle, model: e.target.value})} />
                    </div>
                  </div>
                  

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Año</Label>
                      <Input type="number" value={editVehicle.year} onChange={(e)=>setEditVehicle({...editVehicle, year: e.target.value})} />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input value={editVehicle.color} onChange={(e)=>setEditVehicle({...editVehicle, color: e.target.value})} />
                    </div>
                    <div>
                      <Label>Capacidad (kg)</Label>
                      <Input type="number" value={editVehicle.capacity_kg} onChange={(e)=>setEditVehicle({...editVehicle, capacity_kg: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Ejes</Label>
                      <Input type="number" value={editVehicle.axle_count} onChange={(e)=>setEditVehicle({...editVehicle, axle_count: e.target.value})} />
                    </div>
                    <div>
                      <Label>Largo (m)</Label>
                      <Input type="number" step="0.01" value={editVehicle.length_m} onChange={(e)=>setEditVehicle({...editVehicle, length_m: e.target.value})} />
                    </div>
                    <div>
                      <Label>Ancho (m)</Label>
                      <Input type="number" step="0.01" value={editVehicle.width_m} onChange={(e)=>setEditVehicle({...editVehicle, width_m: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label>Alto (m)</Label>
                      <Input type="number" step="0.01" value={editVehicle.height_m} onChange={(e)=>setEditVehicle({...editVehicle, height_m: e.target.value})} />
                    </div>
                    <div>
                      <Label>Combustible</Label>
                      <Input value={editVehicle.fuel_type} onChange={(e)=>setEditVehicle({...editVehicle, fuel_type: e.target.value})} />
                    </div>
                    <div>
                      <Label>Norma Emisiones</Label>
                      <Input value={editVehicle.emission_standard} onChange={(e)=>setEditVehicle({...editVehicle, emission_standard: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label>Propietario</Label>
                    <Select value={editVehicle.owner_type} onValueChange={(v)=>setEditVehicle({...editVehicle, owner_type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own">Propio</SelectItem>
                        <SelectItem value="leased">Arrendado</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>setIsEditVehicleOpen(false)}>Cancelar</Button>
                  <Button onClick={saveEditVehicle}>Guardar</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Vehicle Confirmation */}
            <Dialog open={isDeleteVehicleOpen} onOpenChange={setIsDeleteVehicleOpen}>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Eliminar Vehículo</DialogTitle>
                  <DialogDescription>Eliminará también los documentos asociados. ¿Deseas continuar?</DialogDescription>
                </DialogHeader>
                {vehicleToDelete && (
                  <div className="bg-gray-50 p-3 rounded mb-3 text-sm">
                    <div className="font-medium">{vehicleToDelete.name || 'Vehículo'}</div>
                    <div className="text-neutral-600">{translateVehicleType(vehicleToDelete.vehicle_type)} • {vehicleToDelete.plate || '-'}</div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>setIsDeleteVehicleOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={confirmDeleteVehicle}>Eliminar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <TransporterProfile />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bid Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar Oferta</DialogTitle>
            <DialogDescription>
              Envía una oferta competitiva para el envío: {selectedShipment?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleBidSubmit({
              amount: Number(formData.get('amount')),
              estimatedDuration: formData.get('estimatedDuration'),
              comments: formData.get('comments'),
              vehicleId: formData.get('vehicleId')
            });
          }} className="space-y-4">
            <div>
              <Label htmlFor="vehicleId">Vehículo para esta oferta</Label>
              <select
                id="vehicleId"
                name="vehicleId"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                defaultValue={selectedVehicleId || ''}
                required
              >
                <option value="" disabled>Selecciona un vehículo</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name || v.plate || translateVehicleType(v.vehicle_type) || 'Vehículo'}{v.vehicle_type ? ` • ${translateVehicleType(v.vehicle_type)}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="amount">Monto de la Oferta (Q.)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Ej: 150.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="estimatedDuration">Duración Estimada</Label>
              <Input
                id="estimatedDuration"
                name="estimatedDuration"
                placeholder="Ej: 2 días"
                required
              />
            </div>

            <div>
              <Label htmlFor="comments">Comentarios (Opcional)</Label>
              <Textarea
                id="comments"
                name="comments"
                placeholder="Describe tu experiencia, horarios disponibles, etc."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsBidDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Enviar Oferta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

  {/* View Shipment Dialog */}
  <Dialog open={isViewShipmentOpen} onOpenChange={setIsViewShipmentOpen}>
    <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Detalles del Envío</DialogTitle>
        <DialogDescription>Información completa del envío seleccionado</DialogDescription>
      </DialogHeader>
      {selectedShipment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-neutral-600">Título</Label>
              <div className="font-medium">{selectedShipment.title || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Estado</Label>
              <div>{selectedShipment.status || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Origen</Label>
              <div>{selectedShipment.origin_address || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Destino</Label>
              <div>{selectedShipment.destination_address || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Fecha de Recogida</Label>
              <div>{selectedShipment.pickup_date ? new Date(selectedShipment.pickup_date).toLocaleString('es-GT') : '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Fecha de Entrega</Label>
              <div>{selectedShipment.delivery_date ? new Date(selectedShipment.delivery_date).toLocaleString('es-GT') : '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Tipo de Carga</Label>
              <div>{selectedShipment.cargo_type || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Peso (kg)</Label>
              <div>{selectedShipment.weight ?? '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Volumen (m³)</Label>
              <div>{selectedShipment.volume ?? '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Precio Estimado</Label>
              <div>{selectedShipment.estimated_price ? `Q ${Number(selectedShipment.estimated_price).toLocaleString()}` : '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Prioridad</Label>
              <div>{selectedShipment.priority || '-'}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-neutral-600">Dimensiones (L×A×H cm)</Label>
              <div>
                {selectedShipment.dimensions_length ?? '-'} × {selectedShipment.dimensions_width ?? '-'} × {selectedShipment.dimensions_height ?? '-'}
              </div>
            </div>
            <div>
              <Label className="text-neutral-600">Piezas</Label>
              <div>{selectedShipment.pieces ?? '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Empaque</Label>
              <div>{selectedShipment.packaging || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Temperatura</Label>
              <div>{selectedShipment.temperature || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Humedad</Label>
              <div>{selectedShipment.humidity || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Aduana</Label>
              <div>{selectedShipment.customs ? 'Sí' : 'No'}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-neutral-600">Contacto</Label>
              <div>{selectedShipment.contact_person || '-'}</div>
            </div>
            <div>
              <Label className="text-neutral-600">Teléfono</Label>
              <div>{selectedShipment.contact_phone || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-neutral-600">Instrucciones de Recogida</Label>
              <div className="whitespace-pre-wrap text-sm">{selectedShipment.pickup_instructions || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-neutral-600">Instrucciones de Entrega</Label>
              <div className="whitespace-pre-wrap text-sm">{selectedShipment.delivery_instructions || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-neutral-600">Requisitos Especiales</Label>
              <div className="whitespace-pre-wrap text-sm">{selectedShipment.special_requirements || '-'}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewShipmentOpen(false)}>Cerrar</Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-neutral-500">Cargando...</div>
      )}
        </DialogContent>
      </Dialog>

      {/* Quote Response Dialog */}
      <Dialog open={isQuoteResponseDialogOpen} onOpenChange={setIsQuoteResponseDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Responder a Solicitud de Cotización</DialogTitle>
            <DialogDescription>
              Proporciona tu cotización para esta solicitud
            </DialogDescription>
          </DialogHeader>
          {selectedQuoteRequest && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const responseData = {
                amount: parseFloat(formData.get('amount') as string),
                estimatedDuration: formData.get('estimatedDuration') as string,
                message: formData.get('message') as string
              };
              handleRespondToQuoteRequest(selectedQuoteRequest.id, responseData);
            }} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h5 className="font-medium mb-3">📋 Detalles del Envío</h5>
                
                {/* Client Info */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p className="text-gray-600">
                    <strong>👤 Cliente:</strong> {selectedQuoteRequest.client?.full_name || 'Cliente no especificado'}
                    {selectedQuoteRequest.client?.company && ` (${selectedQuoteRequest.client.company})`}
                  </p>
                  {selectedQuoteRequest.client?.phone && (
                    <p className="text-gray-600">
                      <strong>📞 Teléfono:</strong> {selectedQuoteRequest.client.phone}
                    </p>
                  )}
                </div>

                {/* Shipment Basic Info */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p className="text-gray-600">
                    <strong>📦 Envío:</strong> {selectedQuoteRequest.shipment?.title || 'Sin título'}
                  </p>
                  <p className="text-gray-600">
                    <strong>📍 Ruta:</strong> {selectedQuoteRequest.shipment?.origin_address} → {selectedQuoteRequest.shipment?.destination_address}
                  </p>
                  <p className="text-gray-600">
                    <strong>📅 Fecha:</strong> {selectedQuoteRequest.shipment?.pickup_date 
                      ? new Date(selectedQuoteRequest.shipment.pickup_date).toLocaleDateString('es-GT')
                      : 'No especificada'
                    }
                    {selectedQuoteRequest.shipment?.pickup_time && (
                      <span className="text-gray-500"> a las {selectedQuoteRequest.shipment.pickup_time}</span>
                    )}
                  </p>
                </div>

                {/* Cargo Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">
                    <strong>⚖️ Peso:</strong> {selectedQuoteRequest.shipment?.weight ? `${selectedQuoteRequest.shipment.weight} kg` : 'No especificado'}
                  </p>
                  <p className="text-gray-600">
                    <strong>📦 Tipo:</strong> {translateToSpanish(selectedQuoteRequest.shipment?.cargo_type)}
                  </p>
                  {selectedQuoteRequest.shipment?.pieces && (
                    <p className="text-gray-600">
                      <strong>🔢 Piezas:</strong> {selectedQuoteRequest.shipment.pieces}
                    </p>
                  )}
                  {selectedQuoteRequest.shipment?.estimated_price && (
                    <p className="text-gray-600">
                      <strong>💰 Precio Estimado:</strong> Q {selectedQuoteRequest.shipment.estimated_price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Special Requirements */}
                {(selectedQuoteRequest.shipment?.special_requirements || selectedQuoteRequest.shipment?.temperature || selectedQuoteRequest.shipment?.customs) && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                    <p className="text-yellow-800 font-medium text-sm mb-1">⚠️ Requisitos Especiales:</p>
                    <div className="text-xs text-yellow-700 space-y-1">
                      {selectedQuoteRequest.shipment?.special_requirements && (
                        <p>• {selectedQuoteRequest.shipment.special_requirements}</p>
                      )}
                      {selectedQuoteRequest.shipment?.temperature && (
                        <p>• Temperatura: {translateToSpanish(selectedQuoteRequest.shipment.temperature)}</p>
                      )}
                      {selectedQuoteRequest.shipment?.customs && (
                        <p>• Requiere trámites aduaneros</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {(selectedQuoteRequest.shipment?.contact_person || selectedQuoteRequest.shipment?.contact_phone) && (
                  <div className="bg-blue-100 border border-blue-300 rounded p-3">
                    <p className="text-blue-800 font-medium text-sm mb-1">📞 Contacto Directo:</p>
                    <div className="text-xs text-blue-700 space-y-1">
                      {selectedQuoteRequest.shipment?.contact_person && (
                        <p>• {selectedQuoteRequest.shipment.contact_person}</p>
                      )}
                      {selectedQuoteRequest.shipment?.contact_phone && (
                        <p>• {selectedQuoteRequest.shipment.contact_phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Client Message */}
                {selectedQuoteRequest.message && (
                  <div className="bg-gray-100 border border-gray-300 rounded p-3">
                    <p className="text-gray-800 font-medium text-sm mb-1">💬 Mensaje del Cliente:</p>
                    <p className="text-xs text-gray-700">{selectedQuoteRequest.message}</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Monto (Q)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="estimatedDuration">Duración Estimada</Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  placeholder="ej. 2-3 días"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Mensaje (opcional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Información adicional sobre tu cotización..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => setIsQuoteResponseDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Enviar Cotización
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Shipment Chat Dialog */}
      <ChatDialog
        isOpen={isShipmentChatOpen}
        onClose={() => setIsShipmentChatOpen(false)}
        shipment={selectedShipment}
        currentUser={user}
      />

      {/* Tracking Dialog */}
      {selectedShipmentForTracking && (
        <Dialog open={isTrackingMapOpen} onOpenChange={setIsTrackingMapOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Seguimiento en Tiempo Real - {selectedShipmentForTracking.title}
              </DialogTitle>
              <DialogDescription>
                Inicia el seguimiento GPS para que el cliente pueda ver la ubicación en tiempo real
              </DialogDescription>
            </DialogHeader>
            <TrackingMap
              key={`${selectedShipmentForTracking.id}-${selectedShipmentForTracking.tracking_enabled}`}
              shipmentId={selectedShipmentForTracking.id}
              isTracking={selectedShipmentForTracking.tracking_enabled || false}
              onStartTracking={() => {
                // This will be handled by the TrackingMap component
              }}
              onStopTracking={() => {
                // This will be handled by the TrackingMap component
              }}
            />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
