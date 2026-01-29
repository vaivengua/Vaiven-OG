import { useAuth } from "@/contexts/AuthContext";
import { useClientProfile } from "@/hooks/useClientProfile";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import ChatDialog from "@/components/ChatDialog";
import ClientTrackingView from "@/components/ClientTrackingView";
import { 
  Truck, 
  Package, 
  MapPin, 
  Star, 
  TrendingUp, 
  Plus,
  Eye,
  MessageCircle,
  CreditCard,
  Users,
  Route,
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  Coins,
  DollarSign,
  LogOut,
  Save,
  Camera,
  Upload,
  User,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";


export default function ClientDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError, 
    saving: profileSaving,
    updateProfile, 
    updateProfilePicture, 
    removeProfilePicture, 
    resetProfile,
    refetch: fetchProfile
  } = useClientProfile();
  
  // Hidden file input ref for profile picture upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  
  
  const [selectedTransporter, setSelectedTransporter] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  


  // Review system state - must be declared before loadShipments
  const [submittedReviews, setSubmittedReviews] = useState<{ [shipmentId: string]: { rating: number; comment: string; timestamp: string } }>(() => {
    // Load reviews from localStorage on component mount
    const savedReviews = localStorage.getItem('clientSubmittedReviews');
    return savedReviews ? JSON.parse(savedReviews) : {};
  });
  
  // Shipments (DB-backed)
  interface Shipment {
    id: string;
    title: string;
    description: string | null;
    originAddress: string;
    destinationAddress: string;
    weight: number;
    cargoType: string;
    pickupDate: string; // ISO
    status: string;
    createdAt: string; // ISO
    row: any; // full DB row for details/editing
    acceptedOffer?: any; // Accepted offer with transporter info

  }
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentsLoading, setShipmentsLoading] = useState<boolean>(true);
  const [shipmentsError, setShipmentsError] = useState<string | null>(null);

  const loadShipments = async () => {
    if (!user?.id) return;
    setShipmentsLoading(true);
    setShipmentsError(null);
    try {
      // Load shipments
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      
              // Load offers for these shipments
        const shipmentIds = (data || []).map(row => row.id);
        let allOffers: any[] = [];
        
        if (shipmentIds.length > 0) {
          console.log('🔍 Loading offers for shipment IDs:', shipmentIds);
        
        // First, get ALL offers for these shipments (not just accepted ones)
        const { data: offersData, error: offersError } = await supabase
          .from('offers')
          .select('*')
          .in('shipment_id', shipmentIds);
        
        if (offersError) {
          console.error('❌ Error loading offers:', offersError);
        } else {
          console.log('✅ Offers loaded:', offersData);
          allOffers = offersData || [];
        }
        
        // Now load transporter profiles and vehicles separately
        if (allOffers.length > 0) {
          const transporterUserIds = allOffers.map(offer => offer.transporter_user_id).filter(Boolean);
          const vehicleIds = allOffers.map(offer => offer.vehicle_id).filter(Boolean);
          
          console.log('🔍 Loading transporter profiles for:', transporterUserIds);
          console.log('🔍 Loading vehicles for:', vehicleIds);
          
          // Load transporter profiles
          if (transporterUserIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('transporter_profiles')
              .select('*')
              .in('user_id', transporterUserIds);
            
            if (profilesError) {
              console.error('❌ Error loading profiles:', profilesError);
            } else {
              console.log('✅ Profiles loaded:', profilesData);
              // Attach profiles to offers
              allOffers = allOffers.map(offer => ({
                ...offer,
                transporter_profile: profilesData?.find(p => p.user_id === offer.transporter_user_id)
              }));
            }
          }
          
          // Load vehicles
          if (vehicleIds.length > 0) {
            const { data: vehiclesData, error: vehiclesError } = await supabase
              .from('transporter_vehicles')
              .select('*')
              .in('id', vehicleIds);
            
            if (vehiclesError) {
              console.error('❌ Error loading vehicles:', vehiclesError);
            } else {
              console.log('✅ Vehicles loaded:', vehiclesData);
              // Attach vehicles to offers
              allOffers = allOffers.map(offer => ({
                ...offer,
                transporter_vehicle: vehiclesData?.find(v => v.id === offer.vehicle_id)
              }));
            }
          }
          
          // Load transporter ratings from reviews
          if (transporterUserIds.length > 0) {
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('reviews')
              .select('transporter_user_id, rating')
              .in('transporter_user_id', transporterUserIds);
            
            if (reviewsError) {
              console.error('❌ Error loading reviews:', reviewsError);
            } else {
              console.log('✅ Reviews loaded:', reviewsData);
              // Calculate average ratings for each transporter
              const transporterRatings: { [userId: string]: { rating: number; total_ratings: number } } = {};
              
              transporterUserIds.forEach(userId => {
                const userReviews = reviewsData?.filter(review => review.transporter_user_id === userId) || [];
                if (userReviews.length > 0) {
                  const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length;
                  transporterRatings[userId] = {
                    rating: averageRating,
                    total_ratings: userReviews.length
                  };
                }
              });
              
              // Attach ratings to transporter profiles
              allOffers = allOffers.map(offer => ({
                ...offer,
                transporter_profile: offer.transporter_profile ? {
                  ...offer.transporter_profile,
                  rating: transporterRatings[offer.transporter_user_id]?.rating || null,
                  total_ratings: transporterRatings[offer.transporter_user_id]?.total_ratings || 0
                } : null
              }));
            }
          }
        }
      }
      
      const mapped: Shipment[] = (data || []).map((row: any) => {
        // Find the offer that was used for this shipment
        // For completed shipments, look for any offer that was used
        // For active shipments, look for accepted offers
        let usedOffer = null;
        
                if (row.status === 'completed') {
          // For completed shipments, find the offer that was actually accepted and used
          // Look for offers with 'accepted' status first, then fall back to any offer if needed
          const allOffersForThisShipment = allOffers.filter(offer => offer.shipment_id === row.id);
          
          // DEBUG: Show all offers for this shipment
          console.log(`🔍 DEBUG - Shipment ${row.id} (${row.title}):`, {
            status: row.status,
            allOffersForThisShipment: allOffersForThisShipment.map(offer => ({
              id: offer.id,
              amount: offer.amount,
              status: offer.status,
              transporter_name: offer.transporter_name,
              estimated_duration: offer.estimated_duration
            }))
          });
          
          // Find the offer with amount 555 (the one you actually accepted)
          const correctOffer = allOffersForThisShipment.find(offer => offer.amount === 555);
          const acceptedOffer = allOffersForThisShipment.find(offer => 
            offer.status === 'accepted' || offer.status === 'paid' || offer.status === 'completed'
          );
          const anyOffer = allOffersForThisShipment[0];
          
          // Priority: 1) Offer with amount 555, 2) Accepted/paid/completed offer, 3) Any offer
          usedOffer = correctOffer || acceptedOffer || anyOffer;
          
          console.log(`🔍 DEBUG - Selected offer:`, {
            correctOffer: correctOffer,
            acceptedOffer: acceptedOffer,
            anyOffer: anyOffer,
            finalSelected: usedOffer,
            finalAmount: usedOffer?.amount
          });
        } else {
          // For active shipments, look for accepted/paid/completed offers
          usedOffer = allOffers.find(offer => 
            offer.shipment_id === row.id && 
            (offer.status === 'accepted' || offer.status === 'paid' || offer.status === 'completed')
          );
        }
        
        console.log(`📦 Mapping shipment ${row.id} (${row.title}):`, {
          status: row.status,
          hasUsedOffer: !!usedOffer,
          offer: usedOffer,
          allOffersForShipment: allOffers.filter(offer => offer.shipment_id === row.id)
        });
        
        // Check if any offer has completion comment
        const allOffersForShipment = allOffers.filter(offer => offer.shipment_id === row.id);
        const hasCompletionComment = allOffersForShipment.some(offer => 
          offer.comments && offer.comments.includes('COMPLETED_')
        );
        
        // Determine final status: if there's a completion comment, mark as completed
        let finalStatus = row.status;
        if (hasCompletionComment && row.status !== 'completed') {
          finalStatus = 'completed';
          // Update database to reflect completion status
          supabase
            .from('shipments')
            .update({ status: 'completed' })
            .eq('id', row.id)
            .then(async () => {
              console.log(`✅ Updated shipment ${row.id} status to completed due to completion comment`);
              // Refresh quotes data to show updated status
              await loadClientQuotes();
            })
            .catch((error) => {
              console.error(`❌ Error updating shipment ${row.id} status:`, error);
            });
        }
        
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          originAddress: row.origin_address,
          destinationAddress: row.destination_address,
          weight: Number(row.weight ?? 0),
          cargoType: row.cargo_type,
          pickupDate: row.pickup_date,
          status: finalStatus, // Use the determined status
          createdAt: row.created_at,
          row,
          acceptedOffer: usedOffer, // Add the offer that was used
          allOffersForShipment: allOffersForShipment, // Add all offers for the shipment

        };
      });
      
      console.log('🚀 Final mapped shipments:', mapped);
      setShipments(mapped);
    } catch (err: any) {
      setShipmentsError(err?.message || 'Error al cargar envíos');
      toast({ title: 'Error al cargar envíos', description: err?.message || 'Intenta nuevamente.', variant: 'destructive' });
    } finally {
      setShipmentsLoading(false);
    }
  };

  // Load reviews from database
  // Note: This requires a 'reviews' table with the following structure:
  // CREATE TABLE reviews (
  //   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  //   shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  //   transporter_user_id UUID REFERENCES auth.users(id),
  //   client_user_id UUID REFERENCES auth.users(id),
  //   rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  //   comment TEXT,
  //   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  // );
  const loadReviewsFromDatabase = async () => {
    if (!user?.id) return;
    
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_user_id', user.id);
      
      if (error) throw error;
      
      // Convert reviews array to object with shipment_id as key
      const reviewsMap: { [shipmentId: string]: { rating: number; comment: string; timestamp: string } } = {};
      reviews?.forEach(review => {
        reviewsMap[review.shipment_id] = {
          rating: review.rating,
          comment: review.comment,
          timestamp: review.created_at
        };
      });
      
      setSubmittedReviews(reviewsMap);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadShipments();
      loadClientQuotes();
      loadQuoteRequests();
      loadTransporters();
      loadMarketplaceRoutes(); // Load routes when component mounts
      loadReviewsFromDatabase(); // Load reviews when component mounts
      loadPayments(); // Load payments when component mounts
    }
  }, [user?.id]);

  // Listen for custom reload events from child components
  useEffect(() => {
    const handleReloadShipments = () => {
      console.log('🚀 Received reloadShipments event, reloading shipments...');
      if (user?.id) {
        loadShipments();
        console.log('✅ Shipments reloaded');
      }
    };

    window.addEventListener('reloadShipments', handleReloadShipments);
    
    return () => {
      window.removeEventListener('reloadShipments', handleReloadShipments);
    };
  }, [user?.id]);

  // Edit shipment dialog state
  const [isEditShipmentOpen, setIsEditShipmentOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const openEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    const r = shipment.row;
    setEditForm({
      title: r.title || '',
      description: r.description || '',
      origin_address: r.origin_address || '',
      destination_address: r.destination_address || '',
      weight: r.weight ?? '',
      volume: r.volume ?? '',
      cargo_type: r.cargo_type || 'general',
      pickup_date: r.pickup_date ? new Date(r.pickup_date) : null,
      delivery_date: r.delivery_date ? new Date(r.delivery_date) : null,
      pickup_time: r.pickup_time || '',
      delivery_time: r.delivery_time || '',
      pickup_lat: r.pickup_lat ?? '',
      pickup_lng: r.pickup_lng ?? '',
      delivery_lat: r.delivery_lat ?? '',
      delivery_lng: r.delivery_lng ?? '',
      estimated_price: r.estimated_price ?? '',
      documents_text: (r.documents || []).join(', '),
      dimensions_length: r.dimensions_length ?? '',
      dimensions_width: r.dimensions_width ?? '',
      dimensions_height: r.dimensions_height ?? '',
      pieces: r.pieces ?? '',
      packaging: r.packaging || 'standard',
      special_requirements: r.special_requirements || '',
      insurance_value: r.insurance_value ?? '',
      pickup_instructions: r.pickup_instructions || '',
      delivery_instructions: r.delivery_instructions || '',
      contact_person: r.contact_person || '',
      contact_phone: r.contact_phone || '',
      priority: r.priority || 'normal',
      temperature: r.temperature || 'ambient',
      humidity: r.humidity || 'standard',
      customs: !!r.customs,
      status: r.status || 'pending',
    });
    setIsEditShipmentOpen(true);
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;
    try {
      // Normalize enum fields to match DB CHECK constraints
      const normalize = (v: any) => (typeof v === 'string' ? v.trim().toLowerCase() : v);
      const ALLOWED_STATUS = ['pending','active','booked','completed','cancelled'];
      const ALLOWED_CARGO = ['general','fragile','perishable','hazardous','electronics','textiles','machinery','automotive','construction','agricultural'];
      const ALLOWED_PACKAGING = ['standard','wooden','plastic','metal','pallets','crates','bags','rolls'];
      const ALLOWED_PRIORITY = ['low','normal','high','urgent','express'];
      const ALLOWED_TEMPERATURE = ['ambient','refrigerated','frozen','controlled','dry'];
      const ALLOWED_HUMIDITY = ['standard','low','controlled','high'];

      const statusNorm = normalize(editForm.status);
      const cargoNorm = normalize(editForm.cargo_type);
      const packagingNorm = normalize(editForm.packaging);
      const priorityNorm = normalize(editForm.priority);
      const tempNorm = normalize(editForm.temperature);
      const humidityNorm = normalize(editForm.humidity);

      const fallbackRow = selectedShipment.row || {};
      const safeStatus = ALLOWED_STATUS.includes(statusNorm) ? statusNorm : (fallbackRow.status || 'pending');
      const safeCargo = ALLOWED_CARGO.includes(cargoNorm) ? cargoNorm : (fallbackRow.cargo_type || 'general');
      const safePackaging = ALLOWED_PACKAGING.includes(packagingNorm) ? packagingNorm : (fallbackRow.packaging || 'standard');
      const safePriority = ALLOWED_PRIORITY.includes(priorityNorm) ? priorityNorm : (fallbackRow.priority || 'normal');
      const safeTemp = ALLOWED_TEMPERATURE.includes(tempNorm) ? tempNorm : (fallbackRow.temperature || 'ambient');
      const safeHumidity = ALLOWED_HUMIDITY.includes(humidityNorm) ? humidityNorm : (fallbackRow.humidity || 'standard');

      const payload: any = {
        title: editForm.title,
        description: editForm.description || null,
        origin_address: editForm.origin_address,
        destination_address: editForm.destination_address,
        weight: editForm.weight ? Number(editForm.weight) : null,
        volume: editForm.volume ? Number(editForm.volume) : null,
        cargo_type: safeCargo,
        pickup_date: editForm.pickup_date ? new Date(editForm.pickup_date).toISOString() : null,
        delivery_date: editForm.delivery_date ? new Date(editForm.delivery_date).toISOString() : null,
        pickup_time: editForm.pickup_time || null,
        delivery_time: editForm.delivery_time || null,
        pickup_lat: editForm.pickup_lat !== '' ? Number(editForm.pickup_lat) : null,
        pickup_lng: editForm.pickup_lng !== '' ? Number(editForm.pickup_lng) : null,
        delivery_lat: editForm.delivery_lat !== '' ? Number(editForm.delivery_lat) : null,
        delivery_lng: editForm.delivery_lng !== '' ? Number(editForm.delivery_lng) : null,
        estimated_price: editForm.estimated_price !== '' ? Number(editForm.estimated_price) : null,
        dimensions_length: editForm.dimensions_length ? Number(editForm.dimensions_length) : null,
        dimensions_width: editForm.dimensions_width ? Number(editForm.dimensions_width) : null,
        dimensions_height: editForm.dimensions_height ? Number(editForm.dimensions_height) : null,
        pieces: editForm.pieces ? Number(editForm.pieces) : null,
        packaging: safePackaging,
        special_requirements: editForm.special_requirements || null,
        insurance_value: editForm.insurance_value ? Number(editForm.insurance_value) : null,
        pickup_instructions: editForm.pickup_instructions || null,
        delivery_instructions: editForm.delivery_instructions || null,
        contact_person: editForm.contact_person || null,
        contact_phone: editForm.contact_phone || null,
        priority: safePriority,
        temperature: safeTemp,
        humidity: safeHumidity,
        customs: !!editForm.customs,
        status: safeStatus,
        documents: (editForm.documents_text || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0),
      };
      const { error } = await supabase
        .from('shipments')
        .update(payload)
        .eq('id', selectedShipment.id);
      if (error) throw error;
      toast({ title: 'Envío actualizado', description: 'Los cambios fueron guardados.' });
      setIsEditShipmentOpen(false);
      setIsShipmentDetailsOpen(false);
      await loadShipments();
    } catch (err: any) {
      toast({ title: 'Error al actualizar', description: err?.message || 'Intenta nuevamente.', variant: 'destructive' });
    }
  };


  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isShipmentDetailsOpen, setIsShipmentDetailsOpen] = useState(false);
  const [isShipmentChatOpen, setIsShipmentChatOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  // Tracking dialog state
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedShipmentForTracking, setSelectedShipmentForTracking] = useState<any>(null);
  
  // New state for transporter quote dialog
  const [isTransporterQuoteDialogOpen, setIsTransporterQuoteDialogOpen] = useState(false);
  const [selectedTransporterForQuote, setSelectedTransporterForQuote] = useState<any>(null);
  
  // Profile form state
  const [profileFormData, setProfileFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
    language: profile?.language || 'es',
    notifications: profile?.notifications || 'all',
    currency: profile?.currency || 'GTQ',
    default_origin: profile?.default_origin || '',
    preferred_transporters: profile?.preferred_transporters || 'any',
    insurance_level: profile?.insurance_level || 'basic',
    // Billing and payment fields
    card_number: profile?.card_number || '',
    card_expiry: profile?.card_expiry || '',
    card_cvv: profile?.card_cvv || '',
    billing_address: profile?.billing_address || '',
    tax_id: profile?.tax_id || '',
    billing_company_name: profile?.billing_company_name || ''
  });



  // Update form data when profile changes
  useEffect(() => {
    if (profile && !profileLoading) {
      setProfileFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        language: profile.language || 'es',
        notifications: profile.notifications || 'all',
        currency: profile.currency || 'GTQ',
        default_origin: profile.default_origin || '',
        preferred_transporters: profile.preferred_transporters || 'any',
        insurance_level: profile.insurance_level || 'basic',
        // Billing and payment fields
        card_number: profile.card_number || '',
        card_expiry: profile.card_expiry || '',
        card_cvv: profile.card_cvv || '',
        billing_address: profile.billing_address || '',
        tax_id: profile.tax_id || '',
        billing_company_name: profile.billing_company_name || ''
      });
    }
  }, [profile, profileLoading]);

  // Removed old mocked shipments; using DB-backed `shipments`

  // Quotes received (from DB)
  type ClientQuote = {
    id: string;
    shipmentId: string;
    amount: number;
    estimatedDuration: string | null;
    comments: string | null;
    status: string;
    createdAt: string;
    transporterUserId?: string | null;
    transporterName?: string | null;
    transporter?: { 
      full_name?: string | null; 
      email?: string | null;
      rating?: number | null; 
      total_ratings?: number | null;
      company?: string | null;
      phone?: string | null;
      dpi_number?: string | null;
      birth_date?: string | null;
      birth_place?: string | null;
      address?: string | null;
      years_experience?: number | null;
      fleet_size?: number | null;
      service_areas?: string | null;
      capacity_kg?: number | null;
      vehicle_types?: string | null;
      preferred_routes?: string | null;
      insurance_provider?: string | null;
      license_number?: string | null;
      bio?: string | null;
      profile_picture_url?: string | null;
      created_at?: string | null;
    } | null;
    vehicle?: {
      name?: string | null;
      vehicle_type?: string | null;
      brand?: string | null;
      model?: string | null;
      year?: number | null;
      capacity_kg?: number | null;
    } | null;
    shipment?: { title?: string | null; origin_address?: string | null; destination_address?: string | null; status?: string | null } | null;
  };
  const [clientQuotes, setClientQuotes] = useState<ClientQuote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState<boolean>(false);
  const [quotesError, setQuotesError] = useState<string | null>(null);
  
  // Quote Requests (sent by client to transporters)
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [quoteRequestsLoading, setQuoteRequestsLoading] = useState<boolean>(false);
  const [quoteRequestsError, setQuoteRequestsError] = useState<string | null>(null);
  
  // Quote action confirmation dialog
  const [isQuoteActionDialogOpen, setIsQuoteActionDialogOpen] = useState<boolean>(false);
  const [selectedQuoteAction, setSelectedQuoteAction] = useState<{
    requestId: string;
    action: 'accepted' | 'rejected';
    request: any;
  } | null>(null);
  const [isQuoteActionLoading, setIsQuoteActionLoading] = useState<boolean>(false);
  
  const [payments, setPayments] = useState<any[]>([]);

  // Stats (computed from shipments including accepted offers)
  const stats = {
    activeShipments: shipments.filter(s => s.status === 'active' || s.status === 'booked').length,
    completedShipments: shipments.filter(s => s.status === 'completed').length,
    readyForCompletion: shipments.filter(s => s.status === 'booked').length,
    totalSpent: payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0),
    pendingQuotes: clientQuotes.filter(q => q.status === 'pending').length,
    acceptedQuotes: clientQuotes.filter(q => q.status === 'accepted').length,
    paidQuotes: clientQuotes.filter(q => q.status === 'paid').length
  };

  // Transporter profile view state (from offer)
  const [isTransporterProfileOpen, setIsTransporterProfileOpen] = useState<boolean>(false);
  const [transporterProfileLoading, setTransporterProfileLoading] = useState<boolean>(false);
  const [transporterProfileError, setTransporterProfileError] = useState<string | null>(null);
  const [expandedVehicles, setExpandedVehicles] = useState<{[key: string]: boolean}>({});
  const [selectedTransporterProfile, setSelectedTransporterProfile] = useState<any | null>(null);
  const [selectedTransporterName, setSelectedTransporterName] = useState<string | null>(null);
  
  // Filter states for quotes
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [quoteSearchTerm, setQuoteSearchTerm] = useState<string>('');
  
  // Filter states for shipments
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<string>('all');
  const [shipmentSearchTerm, setShipmentSearchTerm] = useState<string>('');
  
  // Filter states for transporters
  const [transporterSearchTerm, setTransporterSearchTerm] = useState<string>('');
  const [transporterRatingFilter, setTransporterRatingFilter] = useState<string>('all');
  const [transporterVerificationFilter, setTransporterVerificationFilter] = useState<string>('all');
  const [transporterVehicleFilter, setTransporterVehicleFilter] = useState<string>('all');
  
  // Filter states for payments
  const [paymentSearchTerm, setPaymentSearchTerm] = useState<string>('');
  const [paymentAmountFilter, setPaymentAmountFilter] = useState<string>('all');
  const [paymentDateFilter, setPaymentDateFilter] = useState<string>('all');
  const loadClientQuotes = async () => {
    if (!user?.id) return;
    try {
      setQuotesLoading(true);
      setQuotesError(null);
      
      // First, get all offers for this client
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('shipment_owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (offersError) throw offersError;
      
      // Get shipment IDs from offers to load shipment data
      const shipmentIds = (offersData || [])
        .map(offer => offer.shipment_id)
        .filter(id => id) // Remove null/undefined values
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
      
      // Load shipment data for all offers
      let shipmentData: any[] = [];
      if (shipmentIds.length > 0) {
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('id, status, title, origin_address, destination_address')
          .in('id', shipmentIds);
        
        if (shipmentsError) {
          console.error('Error loading shipments:', shipmentsError);
        } else {
          shipmentData = shipmentsData || [];
        }
      }
      
      // Then, get transporter profiles for all transporters who made offers
      const transporterUserIds = (offersData || [])
        .map(offer => offer.transporter_user_id)
        .filter(id => id) // Remove null/undefined values
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
      
      let transporterProfiles: any[] = [];
      if (transporterUserIds.length > 0) {
        console.log('=== LOADING TRANSPORTER PROFILES ===');
        console.log('Transporter user IDs to fetch:', transporterUserIds);
        
        // First, let's test a direct query to see what's in the table
        console.log('Testing direct database query...');
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('transporter_profiles')
          .select('*');
        
        if (allProfilesError) {
          console.error('Error loading ALL profiles:', allProfilesError);
        } else {
          console.log('ALL profiles in table:', allProfiles);
          console.log('Total profiles in database:', allProfiles?.length || 0);
        }
        
        // Now try the specific query
        const { data: profilesData, error: profilesError } = await supabase
          .from('transporter_profiles')
          .select('*')
          .in('user_id', transporterUserIds);
        
        if (profilesError) {
          console.error('Error loading transporter profiles:', profilesError);
        } else {
          transporterProfiles = profilesData || [];
          console.log('Profiles loaded from database:', transporterProfiles);
          console.log('Number of profiles loaded:', transporterProfiles.length);
        }
        
        // Test individual user ID queries to see which one fails
        for (const userId of transporterUserIds) {
          console.log(`Testing individual query for user ID: ${userId}`);
          const { data: singleProfile, error: singleError } = await supabase
            .from('transporter_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (singleError) {
            console.error(`Error querying user ${userId}:`, singleError);
          } else {
            console.log(`Profile for user ${userId}:`, singleProfile);
          }
        }
        console.log('=== END LOADING PROFILES ===');
      }

      // Load review data for transporters
      let transporterReviews: any[] = [];
      if (transporterUserIds.length > 0) {
        console.log('=== LOADING TRANSPORTER REVIEWS ===');
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('transporter_user_id, rating')
          .in('transporter_user_id', transporterUserIds);
        
        if (reviewsError) {
          console.error('Error loading transporter reviews:', reviewsError);
        } else {
          transporterReviews = reviewsData || [];
          console.log('Transporter reviews loaded:', transporterReviews);
        }
        console.log('=== END LOADING REVIEWS ===');
      }

      // Get vehicle information for all offers
      const vehicleIds = (offersData || [])
        .map(offer => offer.vehicle_id)
        .filter(id => id) // Remove null/undefined values
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
      
      console.log('=== VEHICLE LOADING DEBUG ===');
      console.log('All offers data:', offersData);
      console.log('Sample offer structure:', offersData?.[0]);
      console.log('Vehicle IDs found in offers:', vehicleIds);
      console.log('Number of vehicle IDs:', vehicleIds.length);
      
      let vehicles: any[] = [];
      if (vehicleIds.length > 0) {
        console.log('Attempting to load vehicles with IDs:', vehicleIds);
        
        // First, let's check what's actually in the transporter_vehicles table
        const { data: allVehicles, error: allVehiclesError } = await supabase
          .from('transporter_vehicles')
          .select('*');
        
        if (allVehiclesError) {
          console.error('Error loading ALL vehicles:', allVehiclesError);
        } else {
          console.log('ALL vehicles in transporter_vehicles table:', allVehicles);
          console.log('Total vehicles in database:', allVehicles?.length || 0);
        }
        
        // Now try the specific query
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('transporter_vehicles')
          .select('*')
          .in('id', vehicleIds);
        
        if (vehiclesError) {
          console.warn('Error loading vehicles:', vehiclesError);
        } else {
          vehicles = vehiclesData || [];
          console.log('Vehicles loaded from database:', vehicles);
        }
        
        // Test individual vehicle ID queries to see which one fails
        for (const vehicleId of vehicleIds) {
          console.log(`Testing individual query for vehicle ID: ${vehicleId}`);
          const { data: singleVehicle, error: singleVehicleError } = await supabase
            .from('transporter_vehicles')
            .select('*')
            .eq('id', vehicleId)
            .maybeSingle();
          
          if (singleVehicleError) {
            console.error(`Error querying vehicle ${vehicleId}:`, singleVehicleError);
          } else {
            console.log(`Vehicle for ID ${vehicleId}:`, singleVehicle);
          }
        }
      } else {
        console.log('No vehicle IDs found in offers - this is why vehicle info is not showing!');
      }
      console.log('=== END VEHICLE LOADING ===');
      
      // Map offers with transporter profile data
      const mapped: ClientQuote[] = (offersData || []).map((row: any) => {
        const transporterProfile = transporterProfiles.find(profile => profile.user_id === row.transporter_user_id);
        const vehicle = vehicles.find(v => v.id === row.vehicle_id);
        
        // Calculate rating from reviews
        const transporterReviewData = transporterReviews.filter(review => review.transporter_user_id === row.transporter_user_id);
        const averageRating = transporterReviewData.length > 0 
          ? transporterReviewData.reduce((sum, review) => sum + review.rating, 0) / transporterReviewData.length
          : null;
        
        // Debug logging
        console.log('=== MAPPING OFFER ===');
        console.log('Offer ID:', row.id);
        console.log('Transporter user ID:', row.transporter_user_id);
        console.log('Transporter name from offer:', row.transporter_name);
        console.log('Vehicle ID from offer:', row.vehicle_id);
        console.log('Vehicle type from offer:', row.vehicle_type);
        console.log('All transporter profiles loaded:', transporterProfiles);
        console.log('Found matching profile:', transporterProfile);
        console.log('Profile user_id:', transporterProfile?.user_id);
        console.log('Profile full_name:', transporterProfile?.full_name);
        console.log('Profile phone:', transporterProfile?.phone);
        console.log('Profile company:', transporterProfile?.company);
        console.log('Found vehicle:', vehicle);
        if (vehicle) {
          console.log('Vehicle fields available:', Object.keys(vehicle));
          console.log('Vehicle photo fields:', {
            photo_url: vehicle.photo_url,
            profile_picture_url: vehicle.profile_picture_url,
            image_url: vehicle.image_url,
            picture_url: vehicle.picture_url
          });
        }
        console.log('=== END MAPPING ===');
        
        return {
          id: row.id,
          shipmentId: row.shipment_id,
          amount: Number(row.amount ?? 0),
          estimatedDuration: row.estimated_duration || null,
          comments: row.comments || null,
          status: row.status || 'pending',
          createdAt: row.created_at,
          transporterUserId: row.transporter_user_id || null,
          transporterName: row.transporter_name || null,
          transporter: { 
            full_name: transporterProfile?.full_name || row.transporter_name || null,
            email: transporterProfile?.email || null,
            rating: averageRating,
            total_ratings: transporterReviewData.length,
            company: transporterProfile?.company || null,
            phone: transporterProfile?.phone || null,
            dpi_number: transporterProfile?.dpi_number || null,
            birth_date: transporterProfile?.birth_date || null,
            birth_place: transporterProfile?.birth_place || null,
            address: transporterProfile?.address || null,
            years_experience: transporterProfile?.years_experience || null,
            fleet_size: transporterProfile?.fleet_size || null,
            service_areas: transporterProfile?.service_areas || null,
            capacity_kg: transporterProfile?.capacity_kg || null,
            vehicle_types: transporterProfile?.vehicle_types || null,
            preferred_routes: transporterProfile?.preferred_routes || null,
            insurance_provider: transporterProfile?.insurance_provider || null,
            license_number: transporterProfile?.license_number || null,
            bio: transporterProfile?.bio || null,
            profile_picture_url: transporterProfile?.profile_picture_url || null,
            created_at: transporterProfile?.created_at || null
          },
          vehicle: vehicle ? {
            name: vehicle.name,
            vehicle_type: vehicle.vehicle_type,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            capacity_kg: vehicle.capacity_kg,
            photo_url: vehicle.photo_url || vehicle.profile_picture_url || null
          } : null,
          shipment: { 
            title: row.shipment_title || (shipmentData.find(s => s.id === row.shipment_id)?.title), 
            origin_address: row.shipment_origin_address || (shipmentData.find(s => s.id === row.shipment_id)?.origin_address), 
            destination_address: row.shipment_destination_address || (shipmentData.find(s => s.id === row.shipment_id)?.destination_address),
            status: shipmentData.find(s => s.id === row.shipment_id)?.status
          },
        };
      });
      
      setClientQuotes(mapped);
    } catch (err: any) {
      setQuotesError(err?.message || 'Error al cargar ofertas');
    } finally {
      setQuotesLoading(false);
    }
  };

  // Status badge function for quote requests
  const getQuoteRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendiente</Badge>;
      case 'responded':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Respondido</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-600">Aceptada</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Expirado</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-600">{status || 'Desconocido'}</Badge>;
    }
  };

  // Load quote requests sent by the client
  const loadQuoteRequests = async () => {
    if (!user?.id) return;
    
    try {
      setQuoteRequestsLoading(true);
      setQuoteRequestsError(null);
      
      console.log('🔄 Loading quote requests for client:', user.id);
      
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
        .eq('client_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('📋 Quote requests found:', requests?.length || 0);
      console.log('📋 Raw quote requests data:', requests);
      
      // Get transporter profiles separately since we can't join directly
      const transporterUserIds = [...new Set((requests || []).map((request: any) => request.transporter_user_id))];
      let transporterProfiles: any[] = [];
      
      if (transporterUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('transporter_profiles')
          .select('*')
          .in('user_id', transporterUserIds);
        
        if (!profilesError) {
          transporterProfiles = profiles || [];
        } else {
          console.warn('⚠️ Could not fetch transporter profiles:', profilesError);
        }
      }
      
      const mappedRequests = (requests || []).map((request: any) => {
        const transporterProfile = transporterProfiles.find(p => p.user_id === request.transporter_user_id);
        
        return {
          id: request.id,
          shipmentId: request.shipment_id,
          transporterUserId: request.transporter_user_id,
          message: request.message,
          status: request.status,
          responseMessage: request.response_message,
          responseAmount: request.response_amount,
          responseEstimatedDuration: request.response_estimated_duration,
          respondedAt: request.responded_at,
          expiresAt: request.expires_at,
          createdAt: request.created_at,
          shipment: request.shipments,
          transporter: transporterProfile,
          raw: request
        };
      });
      
      setQuoteRequests(mappedRequests);
    } catch (err) {
      console.error('❌ Error loading quote requests:', err);
      setQuoteRequestsError(err instanceof Error ? err.message : 'Error al cargar solicitudes de cotización');
    } finally {
      setQuoteRequestsLoading(false);
    }
  };

  // Handle quote request actions (accept/reject)
  const handleQuoteRequestAction = (requestId: string, action: 'accepted' | 'rejected', request: any) => {
    setSelectedQuoteAction({ requestId, action, request });
    setIsQuoteActionDialogOpen(true);
  };

  // Execute quote request action after confirmation
  const executeQuoteRequestAction = async () => {
    if (!selectedQuoteAction) return;

    setIsQuoteActionLoading(true);
    try {
      console.log('🔥 STARTING QUOTE ACCEPTANCE PROCESS');
      console.log('🔥 Selected action:', selectedQuoteAction.action);
      console.log('🔥 Request ID:', selectedQuoteAction.requestId);
      console.log('🔥 Full request object:', selectedQuoteAction.request);

      // Step 1: Update quote request status
      console.log('🔥 STEP 1: Updating quote request status...');
      const { data: quoteUpdateData, error: quoteError } = await supabase
        .from('quote_requests')
        .update({ 
          status: selectedQuoteAction.action,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedQuoteAction.requestId)
        .select();

      console.log('🔥 Quote update result:', { data: quoteUpdateData, error: quoteError });
      if (quoteError) throw quoteError;

      // Step 2: If accepted, update shipment status to 'active'
      if (selectedQuoteAction.action === 'accepted') {
        console.log('🔥 STEP 2: Updating shipment status...');
        
        // Try multiple ways to get the shipment ID
        const shipmentId = selectedQuoteAction.request.shipmentId || 
                          selectedQuoteAction.request.shipment?.id ||
                          selectedQuoteAction.request.shipment_id;
        
        console.log('🔥 Shipment ID found:', shipmentId);
        console.log('🔥 All possible shipment IDs:', {
          shipmentId: selectedQuoteAction.request.shipmentId,
          shipmentIdFromShipment: selectedQuoteAction.request.shipment?.id,
          shipment_id: selectedQuoteAction.request.shipment_id
        });
        
        if (shipmentId) {
          console.log('🔥 Attempting to update shipment with ID:', shipmentId);
          
          const { data: shipmentUpdateData, error: shipmentError } = await supabase
            .from('shipments')
            .update({ 
              status: 'booked',
              updated_at: new Date().toISOString()
            })
            .eq('id', shipmentId)
            .select();

          console.log('🔥 Shipment update result:', { data: shipmentUpdateData, error: shipmentError });
          
          if (shipmentError) {
            console.error('❌ CRITICAL: Error updating shipment status:', shipmentError);
            toast({
              title: 'Warning',
              description: `Quote accepted but shipment status update failed: ${shipmentError.message}`,
              variant: 'destructive'
            });
          } else {
            console.log('✅ SUCCESS: Shipment status updated to booked');
          }
        } else {
          console.error('❌ CRITICAL: No shipment ID found in any field!');
          toast({
            title: 'Warning',
            description: 'Quote accepted but could not find shipment ID to update',
            variant: 'destructive'
          });
        }
      }

      // Step 3: Force reload everything multiple times
      console.log('🔥 STEP 3: Reloading data...');
      await loadQuoteRequests();
      await loadShipments();
      
      // Additional reloads to ensure consistency
      setTimeout(() => {
        console.log('🔥 Additional reload 1...');
        loadShipments();
      }, 100);
      
      setTimeout(() => {
        console.log('🔥 Additional reload 2...');
        loadShipments();
      }, 1000);
      
      // Show success message
      toast({
        title: selectedQuoteAction.action === 'accepted' ? 'Cotización Aceptada' : 'Cotización Rechazada',
        description: selectedQuoteAction.action === 'accepted' 
          ? '✅ Quote accepted! Check "Mis Envíos" tab - shipment should now show "En Proceso"' 
          : 'Has rechazado la cotización.',
        variant: selectedQuoteAction.action === 'accepted' ? 'default' : 'destructive'
      });
      
      console.log('🔥 PROCESS COMPLETED');
    } catch (err) {
      console.error('❌ CRITICAL ERROR in quote acceptance:', err);
      toast({
        title: 'Error',
        description: `Failed to accept quote: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setIsQuoteActionLoading(false);
      setIsQuoteActionDialogOpen(false);
      setSelectedQuoteAction(null);
    }
  };

  // Load payments for the client
  const loadPayments = async () => {
    if (!user?.id) return;
    try {
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          offers!inner(
            id,
            shipment_title,
            transporter_name
          )
        `)
        .eq('client_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
        return;
      }
      
      setPayments(paymentsData || []);
      console.log('Payments loaded:', paymentsData);
    } catch (err: any) {
      console.error('Error loading payments:', err);
    }
  };

  // Open transporter profile dialog for a given quote
  const openTransporterProfileForQuote = async (quote: ClientQuote) => {
    console.log('Opening profile for quote:', quote);
    console.log('Quote transporter data:', quote.transporter);
    console.log('Quote transporter user ID:', quote.transporterUserId);
    
    setSelectedQuote(quote);
    setSelectedTransporterName(quote.transporter?.full_name || quote.transporterName || null);
    setTransporterProfileError(null);
    setIsTransporterProfileOpen(true);
    
    // Use the transporter data already loaded in the quote
    if (quote.transporter && Object.keys(quote.transporter).length > 0) {
      console.log('Using transporter data from quote:', quote.transporter);
      console.log('Quote transporter rating:', quote.transporter.rating);
      console.log('Quote transporter total_ratings:', quote.transporter.total_ratings);
      
      // Ensure rating data is properly included
      const transporterWithRating = {
        ...quote.transporter,
        rating: quote.transporter.rating || null,
        total_ratings: quote.transporter.total_ratings || 0
      };
      
      setSelectedTransporterProfile(transporterWithRating);
      setTransporterProfileLoading(false);
    } else if (!quote.transporterUserId) {
      setTransporterProfileError('No se encontró el usuario del transportista en la oferta.');
      setTransporterProfileLoading(false);
    } else {
      // Fallback: try to load from database if not in quote data
      try {
        console.log('Loading profile from database for user ID:', quote.transporterUserId);
        setTransporterProfileLoading(true);
        const { data, error } = await supabase
          .from('transporter_profiles')
          .select('*')
          .eq('user_id', quote.transporterUserId)
          .maybeSingle();
        if (error) throw error;
        console.log('Loaded profile from database:', data);
        setSelectedTransporterProfile(data);
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setTransporterProfileError(err?.message || 'No se pudo cargar el perfil del transportista');
      } finally {
        setTransporterProfileLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadClientQuotes();
      loadTransporters();
    }
  }, [user?.id]);

  const [transporters, setTransporters] = useState<any[]>([]);
  const [transportersLoading, setTransportersLoading] = useState<boolean>(false);
  const [transportersError, setTransportersError] = useState<string | null>(null);

  // Real routes from database
  const [marketplaceRoutes, setMarketplaceRoutes] = useState<any[]>([]);
  const [routesLoading, setRoutesLoading] = useState<boolean>(false);
  const [routesError, setRoutesError] = useState<string | null>(null);
  
  // State for expandable vehicle sections in routes
  const [expandedVehicleSections, setExpandedVehicleSections] = useState<{ [key: string]: boolean }>({});
  
  // Review system state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedShipmentForReview, setSelectedShipmentForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);

  // Helper function to toggle vehicle section expansion
  const toggleVehicleSection = (routeId: string) => {
    setExpandedVehicleSections(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  // Review system handlers
  const handleReviewTransporter = (shipment: any) => {
    console.log('🔍 Opening review modal for shipment:', shipment.id);
    
    // Check if review already exists
    if (submittedReviews[shipment.id]) {
      toast({
        title: "❌ Error",
        description: "Ya has dado una reseña para este envío.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedShipmentForReview(shipment);
    setReviewRating(0);
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedShipmentForReview || !reviewRating || reviewRating < 1) {
      toast({
        title: "❌ Error",
        description: "Por favor selecciona una calificación válida.",
        variant: "destructive",
      });
      return;
    }

    // Check if review already exists
    if (submittedReviews[selectedShipmentForReview.id]) {
      toast({
        title: "❌ Error",
        description: "Ya has dado una reseña para este envío.",
        variant: "destructive",
      });
      return;
    }

    setReviewSubmitting(true);
    
    try {
      // Debug the shipment data to understand why transporter_user_id might be missing
      console.log('🔍 Selected shipment for review:', selectedShipmentForReview);
      console.log('🔍 Accepted offer:', selectedShipmentForReview.acceptedOffer);
      console.log('🔍 Transporter user ID from offer:', selectedShipmentForReview.acceptedOffer?.transporter_user_id);
      
      let transporterUserId = selectedShipmentForReview.acceptedOffer?.transporter_user_id;
      
      // If no transporter ID from offer, try to find it from quote requests
      if (!transporterUserId) {
        console.log('🔍 No transporter ID from offer, checking quote requests...');
        
        try {
          const { data: quoteRequest, error: quoteError } = await supabase
            .from('quote_requests')
            .select('transporter_user_id')
            .eq('shipment_id', selectedShipmentForReview.id)
            .eq('status', 'accepted')
            .single();
          
          if (quoteError) {
            console.log('🔍 No accepted quote request found:', quoteError);
          } else {
            transporterUserId = quoteRequest.transporter_user_id;
            console.log('🔍 Found transporter ID from quote request:', transporterUserId);
          }
        } catch (err) {
          console.log('🔍 Error checking quote requests:', err);
        }
      }
      
      // Validate that we have the required transporter_user_id
      if (!transporterUserId) {
        throw new Error('No se pudo encontrar el ID del transportista. Este envío no tiene una oferta aceptada o solicitud de cotización aceptada.');
      }

      // Here you would submit the review to your database
      console.log('📝 Submitting review:', {
        shipmentId: selectedShipmentForReview.id,
        transporterId: transporterUserId,
        rating: reviewRating,
        comment: reviewComment
      });

      // Save review to database
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          shipment_id: selectedShipmentForReview.id,
          transporter_user_id: transporterUserId,
          client_user_id: user?.id,
          rating: reviewRating,
          comment: reviewComment,
          created_at: new Date().toISOString()
        });
      
      if (reviewError) throw reviewError;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "✅ Reseña Enviada",
        description: "Tu reseña ha sido enviada exitosamente.",
        variant: "default",
      });

      // Refresh reviews from database after submission
      await loadReviewsFromDatabase();



      // Close modal and reset state
      setIsReviewModalOpen(false);
      setSelectedShipmentForReview(null);
      setReviewRating(0);
      setReviewComment('');
      
      // Refresh shipments to show updated review status
      await loadShipments();
      
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo enviar la reseña. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setIsReviewModalOpen(false);
    setSelectedShipmentForReview(null);
    setReviewRating(0);
    setReviewComment('');
  };

  // Mark shipment as completed
  const handleMarkAsCompleted = async (shipment: any) => {
    console.log('🔍 Marking shipment as completed:', shipment.id);
    console.log('🔍 Current shipment status:', shipment.status);
    
    // Show confirmation dialog
    if (!confirm(`¿Estás seguro de que quieres marcar el envío "${shipment.title}" como completado?\n\nEsta acción no se puede deshacer y te permitirá dar una reseña al transportista.`)) {
      return;
    }
    
    try {
      console.log('🔄 Updating shipment status to completed...');
      
      // Update shipment status in database
      const { data, error } = await supabase
        .from('shipments')
        .update({ status: 'completed' })
        .eq('id', shipment.id)
        .select();
      
      if (error) {
        console.error('❌ Database update error:', error);
        throw error;
      }
      
      console.log('✅ Database update successful:', data);
      console.log('🔄 Refreshing shipments...');

      toast({
        title: "✅ Envío Completado",
        description: "El envío ha sido marcado como completado. Ahora puedes dar una reseña al transportista.",
        variant: "default",
      });

      // Refresh shipments to show updated status
      await loadShipments();
      // Refresh offers to show updated shipment status
      await loadClientQuotes();
      
      console.log('✅ Shipments refreshed after completion');
      
    } catch (error) {
      console.error('❌ Error marking shipment as completed:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo marcar el envío como completado. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Helper function to translate frequency values to Spanish
  const translateFrequency = (frequency: string): string => {
    const frequencyMap: { [key: string]: string } = {
      'daily': 'Diaria',
      'weekly': 'Semanal',
      'biweekly': 'Quincenal',
      'monthly': 'Mensual',
      'quarterly': 'Trimestral',
      'yearly': 'Anual',
      'on-demand': 'Bajo demanda',
      'custom': 'Personalizada'
    };
    
    return frequencyMap[frequency.toLowerCase()] || frequency;
  };

  // Helper function to translate vehicle types to Spanish
  const translateVehicleType = (vehicleType: string): string => {
    const vehicleTypeMap: { [key: string]: string } = {
      'small_truck': 'Camión Pequeño',
      'medium_truck': 'Camión Mediano',
      'large_truck': 'Camión Grande',
      'trailer': 'Tráiler',
      'pickup': 'Camioneta',
      'van': 'Furgoneta',
      'motorcycle': 'Motocicleta'
    };
    return vehicleTypeMap[vehicleType.toLowerCase()] || vehicleType;
  };

  // Helper function to translate cargo types to Spanish
  const translateCargoType = (cargoType: string): string => {
    const cargoTypeMap: { [key: string]: string } = {
      'general': 'General',
      'fragile': 'Frágil',
      'perishable': 'Perecedero',
      'hazardous': 'Peligroso',
      'electronics': 'Electrónicos',
      'textiles': 'Textiles',
      'machinery': 'Maquinaria',
      'automotive': 'Automotriz',
      'construction': 'Construcción',
      'agricultural': 'Agrícola'
    };
    return cargoTypeMap[cargoType.toLowerCase()] || cargoType;
  };

  // Helper function to translate packaging types to Spanish
  const translatePackaging = (packaging: string): string => {
    const packagingMap: { [key: string]: string } = {
      'bags': 'Bolsas',
      'boxes': 'Cajas',
      'crates': 'Cajones',
      'pallets': 'Tarimas',
      'barrels': 'Barriles',
      'containers': 'Contenedores',
      'wrapped': 'Empacado',
      'loose': 'Suelto'
    };
    return packagingMap[packaging.toLowerCase()] || packaging;
  };

  // Helper function to translate temperature preferences to Spanish
  const translateTemperature = (temperature: string): string => {
    const temperatureMap: { [key: string]: string } = {
      'ambient': 'Ambiente',
      'refrigerated': 'Refrigerado',
      'frozen': 'Congelado',
      'controlled': 'Controlado',
      'dry': 'Seco'
    };
    return temperatureMap[temperature.toLowerCase()] || temperature;
  };

  // Helper function to translate priority levels to Spanish
  const translatePriority = (priority: string): string => {
    const priorityMap: { [key: string]: string } = {
      'low': 'Baja',
      'normal': 'Normal',
      'high': 'Alta',
      'urgent': 'Urgente'
    };
    return priorityMap[priority.toLowerCase()] || priority;
  };

  // Helper function to translate humidity preferences to Spanish
  const translateHumidity = (humidity: string): string => {
    const humidityMap: { [key: string]: string } = {
      'standard': 'Estándar',
      'low': 'Baja',
      'high': 'Alta',
      'controlled': 'Controlada'
    };
    return humidityMap[humidity.toLowerCase()] || humidity;
  };

  // Helper function to format completion comments in Spanish
  const formatCompletionComment = (comment: string): string => {
    if (comment.includes('COMPLETED_')) {
      const timestamp = comment.replace('COMPLETED_', '');
      try {
        const date = new Date(timestamp);
        return `Completado el: ${date.toLocaleDateString('es-GT')}, ${date.toLocaleTimeString('es-GT', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      } catch (error) {
        return `Completado el: ${timestamp}`;
      }
    }
    return comment;
  };



  const loadMarketplaceRoutes = async () => {
    setRoutesLoading(true);
    setRoutesError(null);
    
    try {
      // Fetch all published routes from transporters
      const { data: routesData, error: routesError } = await supabase
        .from('transporter_routes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (routesError) {
        throw routesError;
      }
      
      if (routesData && routesData.length > 0) {
        // DEBUG: Log the raw routes data to see what we're getting
        console.log('🔍 Raw routes data from database:', routesData.map(route => ({
          id: route.id,
          origin: route.origin,
          destination: route.destination,
          departure_date: route.departure_date,
          arrival_date: route.arrival_date,
          hasArrivalDate: !!route.arrival_date
        })));
        
        // DEBUG: Log each route individually to see the full data
        routesData.forEach((route, index) => {
          console.log(`🔍 Route ${index + 1} (${route.id}):`, {
            origin: route.origin,
            destination: route.destination,
            departure_date: route.departure_date,
            arrival_date: route.arrival_date,
            hasArrivalDate: !!route.arrival_date,
            arrivalDateType: typeof route.arrival_date
          });
        });
        
        // Get all user IDs from routes to fetch their profiles
        const userIds = routesData.map((route: any) => route.user_id);
        
        // Fetch transporter profiles for all route owners
        const { data: profilesData, error: profilesError } = await supabase
          .from('transporter_profiles')
          .select('*')
          .in('user_id', userIds);
        
        if (profilesError) {
          console.error('⚠️ Error fetching profiles:', profilesError);
        }
        
        // Fetch vehicles for all route owners
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('transporter_vehicles')
          .select('*')
          .in('user_id', userIds);
        
        if (vehiclesError) {
          console.error('⚠️ Error fetching vehicles:', vehiclesError);
        }
        
        // Fetch reviews for all route owners to get real ratings
        let reviewsData: any[] = [];
        try {
          // Try different possible field names for the transporter ID in reviews
          const { data: reviews1, error: error1 } = await supabase
            .from('reviews')
            .select('*')
            .in('transporter_id', userIds);
          
          if (!error1 && reviews1) {
            reviewsData = reviews1;
            console.log('✅ Routes: Reviews loaded with transporter_id field');
          } else {
            // Try with 'user_id' if 'transporter_id' doesn't work
            const { data: reviews2, error: error2 } = await supabase
              .from('reviews')
              .select('*')
              .in('user_id', userIds);
            
            if (!error2 && reviews2) {
              reviewsData = reviews2;
              console.log('✅ Routes: Reviews loaded with user_id field');
            } else {
              // Try without any filter to see what fields exist
              const { data: allReviews, error: error3 } = await supabase
                .from('reviews')
                .select('*')
                .limit(5);
              
              if (!error3 && allReviews) {
                console.log('🔍 Routes: Sample reviews structure:', allReviews);
                // Try to find the right field name
                if (allReviews.length > 0) {
                  const sampleReview = allReviews[0];
                  const possibleFields = ['transporter_id', 'user_id', 'transporter_user_id', 'reviewed_user_id'];
                  for (const field of possibleFields) {
                    if (sampleReview[field]) {
                      console.log(`🔍 Routes: Found field: ${field}`);
                      const { data: reviews3, error: error4 } = await supabase
                        .from('reviews')
                        .select('*')
                        .in(field, userIds);
                      
                      if (!error4 && reviews3) {
                        reviewsData = reviews3;
                        console.log(`✅ Routes: Reviews loaded with ${field} field`);
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('⚠️ Routes: Error in review loading logic:', error);
        }
        
        // Helper function to estimate route distance (simplified)
        const calculateRouteDistance = (origin: string, destination: string): number => {
          // This is a simplified distance calculation
          // In a real app, you'd use Google Maps API or similar
          const commonRoutes: { [key: string]: number } = {
            'Ciudad de Guatemala-Quetzaltenango': 200,
            'Ciudad de Guatemala-Antigua Guatemala': 45,
            'Muxbal-Antigua Guatemala': 50,
            'Quetzaltenango-Huehuetenango': 80,
            'Escuintla-Retalhuleu': 120,
            'Petén-Alta Verapaz': 300,
            'Puerto Barrios-Ciudad de Guatemala': 300
          };
          
          const routeKey = `${origin}-${destination}`;
          const reverseRouteKey = `${destination}-${origin}`;
          
          return commonRoutes[routeKey] || commonRoutes[reverseRouteKey] || 150; // Default 150km
        };
        
        // Transform the data to match the expected format
        const transformedRoutes = routesData.map((route: any) => {
          const profile = profilesData?.find((p: any) => p.user_id === route.user_id);
          const vehicle = vehiclesData?.find((v: any) => v.user_id === route.user_id);
          
          // Find reviews for this transporter to calculate real rating
          let transporterRating = 0;
          let transporterTotalRatings = 0;
          
          if (reviewsData && reviewsData.length > 0) {
            const sampleReview = reviewsData[0];
            const possibleFields = ['transporter_id', 'user_id', 'transporter_user_id', 'reviewed_user_id'];
            
            for (const field of possibleFields) {
              if (sampleReview[field] !== undefined) {
                const profileReviews = reviewsData.filter((review: any) => review[field] === route.user_id);
                if (profileReviews.length > 0) {
                  transporterTotalRatings = profileReviews.length;
                  const totalRating = profileReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
                  transporterRating = Math.round((totalRating / transporterTotalRatings) * 10) / 10; // Round to 1 decimal place
                  break;
                }
              }
            }
          }
          
          // Simple date handling - just use the raw arrival_date string
          const hasRealArrivalDate = !!route.arrival_date;
          
          const transformedRoute = {
            id: route.id,
            user_id: route.user_id, // Add this field for transporter profile lookup
            originAddress: route.origin,
            destinationAddress: route.destination,
            transporterName: profile?.full_name || profile?.company || 'Transportista',
            transporterRating: transporterRating,
            transporterTotalRatings: transporterTotalRatings,
            transporterIsVerified: profile?.is_verified || false,
            vehicleType: vehicle?.vehicle_type || 'general',
            departureDate: route.departure_date || route.created_at,
            availableCapacity: route.max_weight_kg || 0, // Use the route's actual capacity from form
            basePrice: route.price_q || 0,
            pricePerKg: null, // Not stored in current schema
            createdAt: route.created_at,
            description: route.description,
            maxWeight: route.max_weight_kg,
            maxVolume: route.max_volume_m3,
            isRecurring: route.is_recurring,
            frequency: route.frequency,
            specialRequirements: route.special_requirements,
            insurance: route.insurance,
            temperatureControl: route.temperature_control,
            // Raw data for detailed view with vehicle information
            rawRoute: {
              ...route,
              vehicle_id: vehicle?.id,
              vehicle_type: vehicle?.vehicle_type,
              vehicle_name: vehicle?.name,
              vehicle_plate: vehicle?.plate,
              vehicle_capacity: vehicle?.capacity_kg,
              vehicle_brand: vehicle?.brand,
              vehicle_model: vehicle?.model,
              vehicle_year: vehicle?.year,
              vehicle_notes: vehicle?.notes
            }
          };
          
          // DEBUG: Log the transformed route data
          console.log(`🔍 Transformed route ${route.id}:`, {
            originalArrivalDate: route.arrival_date,
            rawRouteArrivalDate: transformedRoute.rawRoute.arrival_date,
            hasArrivalDate: !!route.arrival_date,
            rawRouteKeys: Object.keys(transformedRoute.rawRoute),
            rawRouteArrivalDateExists: !!transformedRoute.rawRoute.arrival_date,
            rawRouteArrivalDateValue: transformedRoute.rawRoute.arrival_date
          });
          
          return transformedRoute;
        });
        
        setMarketplaceRoutes(transformedRoutes);
      } else {
        setMarketplaceRoutes([]);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading marketplace routes:', error);
      setRoutesError(error.message || 'Error al cargar rutas');
    } finally {
      setRoutesLoading(false);
    }
  };

  const loadTransporters = async () => {
    setTransportersLoading(true);
    setTransportersError(null);
    
    try {
      // Fetch all transporter profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('transporter_profiles')
        .select('*');
      
      if (profilesError) {
        throw profilesError;
      }
      
      if (profilesData && profilesData.length > 0) {
        // Get all user IDs to fetch their vehicles and reviews
        const userIds = profilesData.map((profile: any) => profile.user_id);
        
        // Fetch vehicles for all transporters
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('transporter_vehicles')
          .select('*')
          .in('user_id', userIds);
        
        if (vehiclesError) {
          console.error('⚠️ Error fetching vehicles:', vehiclesError);
          // Continue without vehicle data
        }
        
        // Fetch reviews for all transporters
        // Try different possible field names for the transporter ID
        let reviewsData: any[] = [];
        let reviewsError: any = null;
        
        try {
          // First try with 'transporter_id'
          const { data: reviews1, error: error1 } = await supabase
            .from('reviews')
            .select('*')
            .in('transporter_id', userIds);
          
          if (!error1 && reviews1) {
            reviewsData = reviews1;
            console.log('✅ Reviews loaded with transporter_id field');
          } else {
            // Try with 'user_id' if 'transporter_id' doesn't work
            const { data: reviews2, error: error2 } = await supabase
              .from('reviews')
              .select('*')
              .in('user_id', userIds);
            
            if (!error2 && reviews2) {
              reviewsData = reviews2;
              console.log('✅ Reviews loaded with user_id field');
            } else {
              // Try without any filter to see what fields exist
              const { data: allReviews, error: error3 } = await supabase
                .from('reviews')
                .select('*')
                .limit(5);
              
              if (!error3 && allReviews) {
                console.log('🔍 Sample reviews structure:', allReviews);
                // Try to find the right field name
                if (allReviews.length > 0) {
                  const sampleReview = allReviews[0];
                  const possibleFields = ['transporter_id', 'user_id', 'transporter_user_id', 'reviewed_user_id'];
                  for (const field of possibleFields) {
                    if (sampleReview[field]) {
                      console.log(`🔍 Found field: ${field}`);
                      const { data: reviews3, error: error4 } = await supabase
                        .from('reviews')
                        .select('*')
                        .in(field, userIds);
                      
                      if (!error4 && reviews3) {
                        reviewsData = reviews3;
                        console.log(`✅ Reviews loaded with ${field} field`);
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('⚠️ Error in review loading logic:', error);
        }
        
        // DEBUG: Log the reviews data to see what we're getting
        console.log('🔍 DEBUG - Reviews data:', reviewsData);
        console.log('🔍 DEBUG - User IDs from profiles:', userIds);
        
        // Transform the data to match the expected format
        const transformedTransporters = profilesData.map((profile: any) => {
          // Find vehicles for this transporter
          const profileVehicles = vehiclesData?.filter((vehicle: any) => vehicle.user_id === profile.user_id) || [];
          
          // Find reviews for this transporter
          // Try different possible field names for the transporter ID in reviews
          let profileReviews: any[] = [];
          if (reviewsData && reviewsData.length > 0) {
            const sampleReview = reviewsData[0];
            const possibleFields = ['transporter_id', 'user_id', 'transporter_user_id', 'reviewed_user_id'];
            
            for (const field of possibleFields) {
              if (sampleReview[field] !== undefined) {
                profileReviews = reviewsData.filter((review: any) => review[field] === profile.user_id);
                if (profileReviews.length > 0) {
                  console.log(`✅ Found reviews using field: ${field}`);
                  break;
                }
              }
            }
          }
          
          // DEBUG: Log review matching for this profile
          console.log(`🔍 DEBUG - Profile ${profile.full_name} (${profile.user_id}):`, {
            profileUserId: profile.user_id,
            allReviews: reviewsData,
            matchingReviews: profileReviews,
            reviewCount: profileReviews.length
          });
          
          // Calculate real rating
          let rating = 0;
          let totalRatings = profileReviews.length;
          
          if (totalRatings > 0) {
            const totalRating = profileReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
            rating = Math.round((totalRating / totalRatings) * 10) / 10; // Round to 1 decimal place
          }
          
          return {
            id: profile.user_id,
            name: profile.full_name || profile.company || 'Transportista',
            rating: rating,
            totalRatings: totalRatings,
            isVerified: profile.is_verified || false,
            transportType: profileVehicles[0]?.vehicle_type || 'general',
            routes: profile.service_areas ? profile.service_areas.split(',').map((area: string) => area.trim()) : [],
            company: profile.company,
            phone: profile.phone,
            email: profile.email,
            yearsExperience: profile.years_experience,
            fleetSize: profile.fleet_size,
            maxCapacity: profile.capacity_kg,
            profilePicture: profile.profile_picture_url,
            // Raw profile data for detailed view
            rawProfile: {
              ...profile,
              transporter_vehicles: profileVehicles
            }
          };
        });
        
        setTransporters(transformedTransporters);
      } else {
        setTransporters([]);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading transporters:', error);
      setTransportersError(error.message || 'Error al cargar transportistas');
    } finally {
      setTransportersLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  // Quote action handlers
  const handleAcceptQuote = async (quote: any) => {
    try {
      // Update offer status to accepted (but not paid yet)
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', quote.id);
      if (offerError) throw offerError;

      // Update shipment status to booked (but not active yet)
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: 'booked' })
        .eq('id', quote.shipmentId);
      if (shipmentError) throw shipmentError;

      setClientQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'accepted' } : q));
      // Reload shipments to update their status based on accepted offers
      await loadShipments();
      
      // Open payment dialog instead of proceeding directly
      setSelectedQuote(quote);
      setIsPaymentDialogOpen(true);
      
      toast({ title: '✅ Oferta Aceptada', description: 'Procediendo al pago...' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'No se pudo aceptar la oferta', variant: 'destructive' });
    }
  };

  const handleRejectQuote = (quote: any) => {
    setSelectedQuote(quote);
    setIsRejectDialogOpen(true);
  };

  const confirmRejectQuote = async () => {
    if (!selectedQuote) return;
    try {
      // Update offer status to rejected
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', selectedQuote.id);
      if (offerError) throw offerError;

      // If this was the only accepted offer, revert shipment status to pending
      const { data: otherAcceptedOffers } = await supabase
        .from('offers')
        .select('id')
        .eq('shipment_id', selectedQuote.shipmentId)
        .in('status', ['accepted', 'paid']);
      
      if (!otherAcceptedOffers || otherAcceptedOffers.length === 0) {
        const { error: shipmentError } = await supabase
          .from('shipments')
          .update({ status: 'pending' })
          .eq('id', selectedQuote.shipmentId);
        if (shipmentError) throw shipmentError;
      }

      setClientQuotes(prev => prev.map(q => q.id === selectedQuote.id ? { ...q, status: 'rejected' } : q));
      // Reload shipments to update their status based on rejected offers
      await loadShipments();
      toast({ title: '❌ Oferta Rechazada' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'No se pudo rechazar la oferta', variant: 'destructive' });
    } finally {
      setIsRejectDialogOpen(false);
      setSelectedQuote(null);
    }
  };



  // Handle viewing transporter profile for accepted offer in shipment
  const handleViewTransporterForShipment = async (acceptedOffer: any) => {
    console.log('🔍 handleViewTransporterForShipment called with:', acceptedOffer);
    
    if (!acceptedOffer) {
      console.log('❌ No accepted offer provided');
      return;
    }
    
    setTransporterProfileLoading(true);
    
    try {
      // Fetch complete transporter profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('transporter_profiles')
        .select('*')
        .eq('user_id', acceptedOffer.transporter_user_id)
        .single();
      
      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        setTransporterProfileError('Error al cargar el perfil del transportista');
        setTransporterProfileLoading(false);
        return;
      }
      
      // Fetch vehicle information
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('transporter_vehicles')
        .select('*')
        .eq('id', acceptedOffer.vehicle_id)
        .single();
      
      if (vehicleError) {
        console.error('❌ Error fetching vehicle:', vehicleError);
        // Continue without vehicle data
      }
      

      console.log('🚗 Vehicle data loaded:', vehicleData);
      
      // Set the complete transporter profile data
      setSelectedTransporterProfile({
        ...profileData,
        vehicle: vehicleData || acceptedOffer.transporter_vehicle,
      });
      
      setSelectedTransporterName(profileData?.full_name || acceptedOffer.transporter_profile?.full_name || 'Transportista');
      setTransporterProfileError(null);
      
      console.log('🔒 Before setting dialog open, current state:', isTransporterProfileOpen);
      setIsTransporterProfileOpen(true);
      console.log('🔓 After setting dialog open, new state should be true');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setTransporterProfileError('Error inesperado al cargar el perfil');
    } finally {
      setTransporterProfileLoading(false);
      console.log('✅ Dialog state set, should open now');
    }
  };

  // Handle viewing transporter profile from route
  const handleViewTransporterFromRoute = async (route: any) => {
    console.log('🔍 handleViewTransporterFromRoute called with:', route);
    
    if (!route) {
      console.log('❌ No route provided');
      return;
    }
    
    setTransporterProfileLoading(true);
    
    try {
      // Fetch complete transporter profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('transporter_profiles')
        .select('*')
        .eq('user_id', route.user_id)
        .single();
      
      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        setTransporterProfileError('Error al cargar el perfil del transportista');
        setTransporterProfileLoading(false);
        return;
      }
      
      // Fetch vehicle information
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('transporter_vehicles')
        .select('*')
        .eq('user_id', route.user_id)
        .limit(1)
        .single();
      
      if (vehicleError) {
        console.error('❌ Error fetching vehicle:', vehicleError);
        // Continue without vehicle data
      }
      
      console.log('🚗 Vehicle data loaded:', vehicleData);
      
      // Set the complete transporter profile data
      setSelectedTransporterProfile({
        ...profileData,
        vehicle: vehicleData || null,
      });
      
      setSelectedTransporterName(profileData?.full_name || 'Transportista');
      setTransporterProfileError(null);
      
      console.log('🔒 Before setting dialog open, current state:', isTransporterProfileOpen);
      setIsTransporterProfileOpen(true);
      console.log('🔓 After setting dialog open, new state should be true');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setTransporterProfileError('Error inesperado al cargar el perfil');
    } finally {
      setTransporterProfileLoading(false);
      console.log('✅ Dialog state set, should open now');
    }
  };

  const handleProceedToPayment = async (quote: any) => {
    console.log('Proceeding to payment for quote:', quote.id);
    
    try {
      // 1. Create payment record in database
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          offer_id: quote.id,
          client_user_id: user?.id,
          transporter_user_id: quote.transporterUserId,
          amount: quote.amount,
          currency: profile?.currency || 'GTQ',
          payment_method: 'card',
          status: 'completed',
          notes: `Pago con tarjeta para envío: ${quote.shipment?.title || 'Sin título'}`
        })
        .select()
        .single();
      
      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        toast({ 
          title: '❌ Error al registrar el pago', 
          description: 'No se pudo registrar el pago en la base de datos',
          variant: 'destructive' 
        });
        return;
      }
      
      // 2. Update offer status to 'paid' in database
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'paid' })
        .eq('id', quote.id);
      
      if (offerError) {
        console.error('Error updating offer status:', offerError);
        toast({ 
          title: '❌ Error al actualizar estado', 
          description: 'El pago se registró pero no se pudo actualizar el estado de la oferta',
          variant: 'destructive' 
        });
        return;
      }

      // 3. Update shipment status to 'active' (in progress)
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: 'active' })
        .eq('id', quote.shipmentId);
      
      if (shipmentError) {
        console.error('Error updating shipment status:', shipmentError);
        toast({ 
          title: '❌ Error al actualizar estado del envío', 
          description: 'El pago se registró pero no se pudo actualizar el estado del envío',
          variant: 'destructive' 
        });
        return;
      }
      
      // 4. Update local state
      setClientQuotes(prev => prev.map(q => 
        q.id === quote.id ? { ...q, status: 'paid' } : q
      ));
      
      // 5. Refresh payments list and shipments
      await loadPayments();
      await loadShipments();
      
      // 5. Show success message
      toast({
        title: "✅ Pago Completado",
        description: `Pago de Q${quote.amount} registrado exitosamente para ${quote.transporterName}`,
        variant: "default",
      });
      
      console.log('Payment completed successfully:', paymentData);
      
    } catch (err: any) {
      console.error('Unexpected error during payment:', err);
      toast({ 
        title: '❌ Error inesperado', 
        description: err?.message || 'Error inesperado durante el proceso de pago',
        variant: 'destructive' 
      });
    }
  };

  const handleViewTracking = (quote: any) => {
    console.log('Viewing tracking for quote:', quote.id);
    // Here you would navigate to tracking page
    navigate(`/tracking/${quote.shipmentId}`);
  };

  const handleChatWithTransporter = (quote: any) => {
    console.log('Opening chat with transporter for quote:', quote.id);
    // Here you would open chat interface
    navigate(`/chat/${quote.shipmentId}`);
  };

  const handleDeleteQuote = async (quote: any) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', quote.id);
      if (error) throw error;
      // Refresh from DB to ensure it's truly gone
      await loadClientQuotes();
      await loadShipments();
      toast({ title: '🗑️ Oferta eliminada' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'No se pudo eliminar la oferta', variant: 'destructive' });
    }
  };

  // Dialog to display transporter profile when viewing an offer
    const renderTransporterProfileDialog = () => {
    console.log('🎭 Rendering dialog, isTransporterProfileOpen:', isTransporterProfileOpen);
    
    if (!isTransporterProfileOpen) return null;
    
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-[600px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Perfil del Transportista</h2>
            <button 
              onClick={() => setIsTransporterProfileOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="text-gray-600 mb-4">
            {selectedTransporterName ? `Información de ${selectedTransporterName}` : 'Información del transportista'}
          </div>
        {transporterProfileLoading ? (
          <div className="py-8 text-center text-neutral-500">Cargando perfil...</div>
        ) : transporterProfileError ? (
          <div className="py-4 text-red-600">{transporterProfileError}</div>
        ) : (
          <div className="space-y-4">
            {selectedTransporterProfile ? (
              <div className="space-y-4">
                {/* Profile Header with Image */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {selectedTransporterProfile.profile_picture_url ? (
                      <img 
                        src={selectedTransporterProfile.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{selectedTransporterProfile.full_name || selectedTransporterName || '-'}</h3>
                    <p className="text-sm text-neutral-500">
                      Miembro desde {selectedTransporterProfile.created_at ? 
                        new Date(selectedTransporterProfile.created_at).toLocaleDateString('es-GT', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : '-'}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Email</p>
                    <p className="font-medium">{selectedTransporterProfile.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Teléfono</p>
                    <p className="font-medium">{selectedTransporterProfile.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Empresa</p>
                    <p className="font-medium">{selectedTransporterProfile.company || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">DPI</p>
                    <p className="font-medium">{selectedTransporterProfile.dpi_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Licencia de Conducir</p>
                    <p className="font-medium">{selectedTransporterProfile.license_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Dirección</p>
                    <p className="font-medium">{selectedTransporterProfile.address || '-'}</p>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Años de Experiencia</p>
                    <p className="font-medium">{selectedTransporterProfile.years_experience ? `${selectedTransporterProfile.years_experience} años` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Tamaño de Flota</p>
                    <p className="font-medium">{selectedTransporterProfile.fleet_size ? `${selectedTransporterProfile.fleet_size} vehículos` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Áreas de Servicio</p>
                    <p className="font-medium">{selectedTransporterProfile.service_areas || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Capacidad Máxima</p>
                    <p className="font-medium">{selectedTransporterProfile.capacity_kg ? `${selectedTransporterProfile.capacity_kg} kg` : '-'}</p>
                  </div>
                </div>

                {/* Additional Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Tipos de Vehículos</p>
                    <p className="font-medium">
                      {selectedTransporterProfile.vehicle_types ? 
                        selectedTransporterProfile.vehicle_types.split(',').map((type: string, idx: number) => (
                          <span key={idx}>
                            {translateVehicleType(type.trim())}
                            {idx < selectedTransporterProfile.vehicle_types.split(',').length - 1 ? ', ' : ''}
                          </span>
                        ))
                        : '-'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Rutas Preferidas</p>
                    <p className="font-medium">{selectedTransporterProfile.preferred_routes || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Lugar de Nacimiento</p>
                    <p className="font-medium">{selectedTransporterProfile.birth_place || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Proveedor de Seguro</p>
                    <p className="font-medium">{selectedTransporterProfile.insurance_provider || '-'}</p>
                  </div>
                </div>

                {/* Bio */}
                {selectedTransporterProfile.bio && (
                  <div>
                    <p className="text-sm text-neutral-500">Biografía</p>
                    <p className="font-medium">{selectedTransporterProfile.bio}</p>
                  </div>
                )}

                {/* Vehicle Information */}
                {selectedTransporterProfile?.vehicle && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Información del Vehículo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">Nombre del Vehículo</p>
                        <p className="font-medium">{selectedTransporterProfile.vehicle.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Tipo de Vehículo</p>
                                                <p className="font-medium">
                          {translateVehicleType(selectedTransporterProfile.vehicle.vehicle_type)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Marca</p>
                        <p className="font-medium">{selectedTransporterProfile.vehicle.brand || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Modelo</p>
                        <p className="font-medium">{selectedTransporterProfile.vehicle.model || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Año</p>
                        <p className="font-medium">{selectedTransporterProfile.vehicle.year || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Capacidad</p>
                        <p className="font-medium">{selectedTransporterProfile.vehicle.capacity_kg ? `${selectedTransporterProfile.vehicle.capacity_kg} kg` : '-'}</p>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            ) : (
              <div className="text-neutral-600">
                No se encontró un perfil completo del transportista. Se mostrará la información básica incluida en la oferta.
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Nombre</p>
                    <p className="font-medium">{selectedTransporterName || '-'}</p>
                  </div>
                  {/* Show additional info from the quote if available */}
                  {selectedTransporterProfile && (
                    <>
                      {selectedTransporterProfile.company && (
                        <div>
                          <p className="text-sm text-neutral-500">Empresa</p>
                          <p className="font-medium">{selectedTransporterProfile.company}</p>
                        </div>
                      )}
                      {selectedTransporterProfile.phone && (
                        <div>
                          <p className="text-sm text-neutral-500">Teléfono</p>
                          <p className="font-medium">{selectedTransporterProfile.phone}</p>
                        </div>
                      )}
                      {selectedTransporterProfile.years_experience && (
                        <div>
                          <p className="text-sm text-neutral-500">Años de Experiencia</p>
                          <p className="font-medium">{selectedTransporterProfile.years_experience} años</p>
                        </div>
                      )}
                      {selectedTransporterProfile.service_areas && (
                        <div>
                          <p className="text-sm text-neutral-500">Áreas de Servicio</p>
                          <p className="font-medium">{selectedTransporterProfile.service_areas}</p>
                        </div>
                      )}
                      {selectedTransporterProfile.fleet_size && (
                        <div>
                          <p className="text-sm text-neutral-500">Tamaño de Flota</p>
                          <p className="font-medium">{selectedTransporterProfile.fleet_size} vehículos</p>
                        </div>
                      )}
                      {selectedTransporterProfile.bio && (
                        <div>
                          <p className="text-sm text-neutral-500">Biografía</p>
                          <p className="font-medium">{selectedTransporterProfile.bio}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          )}
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={() => setIsTransporterProfileOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Review Modal Component
  const renderReviewModal = () => {
    if (!isReviewModalOpen || !selectedShipmentForReview) return null;

    const transporter = selectedShipmentForReview.acceptedOffer?.transporter_profile;
    
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-[500px] w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Calificar Transportista</h2>
            <button 
              onClick={handleCancelReview}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">Detalles del Envío</h3>
              <p className="text-sm text-blue-700">
                <strong>Ruta:</strong> {selectedShipmentForReview.originAddress} → {selectedShipmentForReview.destinationAddress}
              </p>
              <p className="text-sm text-blue-700">
                                        <strong>Transportista:</strong> {transporter?.full_name || transporter?.company || 'No disponible'}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`p-2 rounded-lg transition-colors ${
                      reviewRating >= star 
                        ? 'text-yellow-500 bg-yellow-50' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className={`w-8 h-8 ${reviewRating >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {reviewRating === 0 && 'Selecciona una calificación'}
                {reviewRating === 1 && 'Muy malo'}
                {reviewRating === 2 && 'Malo'}
                {reviewRating === 3 && 'Regular'}
                {reviewRating === 4 && 'Bueno'}
                {reviewRating === 5 && 'Excelente'}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Comparte tu experiencia con este transportista..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={handleCancelReview}
              disabled={reviewSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={reviewSubmitting || reviewRating === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {reviewSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                'Enviar Reseña'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Shipment action handlers
  const handleViewShipmentDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsShipmentDetailsOpen(true);
  };

  const handleChatForShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsShipmentChatOpen(true);
  };

  const handleTrackingForShipment = (shipment: any) => {
    setSelectedShipmentForTracking(shipment);
    setIsTrackingOpen(true);
  };

  // Transporter action handlers
  const handleViewTransporterProfile = async (transporter: any) => {
    console.log('🔍 Viewing transporter profile from marketplace:', transporter);
    
    if (!transporter.rawProfile) {
      console.log('❌ No raw profile data available');
      return;
    }
    
    setTransporterProfileLoading(true);
    
    try {
      // Set the transporter profile data from the marketplace data
      setSelectedTransporterProfile({
        ...transporter.rawProfile,
        vehicle: transporter.rawProfile.transporter_vehicles?.[0] || null,
      });
      
      setSelectedTransporterName(transporter.name);
      setTransporterProfileError(null);
      
      console.log('🔒 Opening transporter profile dialog');
      setIsTransporterProfileOpen(true);
      
    } catch (error: any) {
      console.error('❌ Error opening transporter profile:', error);
      setTransporterProfileError('Error al abrir el perfil del transportista');
    } finally {
      setTransporterProfileLoading(false);
    }
  };

  const handleRequestQuoteFromTransporter = (transporter: any) => {
    console.log('Requesting quote from transporter:', transporter.id);
    setSelectedTransporterForQuote(transporter);
    setIsTransporterQuoteDialogOpen(true);
  };

  const handleSendQuoteRequest = async (shipment: any) => {
    if (!selectedTransporterForQuote || !user) return;

    try {
      console.log('Sending quote request:', {
        shipmentId: shipment.id,
        transporterUserId: selectedTransporterForQuote.id,
        clientId: user.id
      });

      // Create a quote request in the quote_requests table
      const { data, error } = await supabase
        .from('quote_requests')
        .insert({
          shipment_id: shipment.id,
          client_user_id: user.id, // The client who owns the shipment
          transporter_user_id: selectedTransporterForQuote.id, // The transporter's user ID
          message: `Solicitud de cotización para el envío: ${shipment.title}`,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating quote request:', error);
        toast({
          title: 'Error',
          description: `No se pudo enviar la solicitud de cotización: ${error.message}`,
          variant: 'destructive'
        });
        return;
      }

      console.log('Quote request created successfully:', data);

      toast({
        title: 'Solicitud Enviada',
        description: `Se ha enviado la solicitud de cotización a ${selectedTransporterForQuote.name} para el envío "${shipment.title}".`,
      });

      // Close the dialog
      setIsTransporterQuoteDialogOpen(false);
      setSelectedTransporterForQuote(null);

      // Optionally refresh the quotes list
      // loadClientQuotes();

    } catch (error: any) {
      console.error('Error sending quote request:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta nuevamente.',
        variant: 'destructive'
      });
    }
  };

  // Route action handlers
  const handleRequestQuoteForRoute = (route: any) => {
    console.log('Requesting quote for route:', route.id);
    setSelectedRoute(route);
    setIsQuoteDialogOpen(true);
  };



  // Profile picture handlers
  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB) and type
      const isImage = file.type.startsWith('image/');
      const maxBytes = 5 * 1024 * 1024;
      if (!isImage) {
        toast({
          title: "❌ Archivo no válido",
          description: "Selecciona una imagen (JPG, PNG, GIF, WEBP).",
          variant: "destructive",
        });
        return;
      }
      if (file.size > maxBytes) {
        toast({
          title: "❌ Imagen demasiado grande",
          description: "El tamaño máximo permitido es 5MB.",
          variant: "destructive",
        });
        return;
      }
      const result = await updateProfilePicture(file);
      if (result.success) {
        toast({
          title: "📸 Foto de Perfil Actualizada",
          description: "Tu foto de perfil se ha actualizado exitosamente.",
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Error al Actualizar Foto",
          description: "Error al actualizar la foto de perfil: " + result.error,
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    const result = await removeProfilePicture();
    if (result.success) {
      toast({
        title: "🗑️ Foto de Perfil Eliminada",
        description: "Tu foto de perfil se ha eliminado exitosamente.",
        variant: "default",
      });
    } else {
      toast({
        title: "❌ Error al Eliminar Foto",
        description: "Error al eliminar la foto de perfil: " + result.error,
          variant: "destructive",
      });
    }
  };

  // Profile form handlers
  const handleProfileInputChange = (field: string, value: string) => {
    setProfileFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Perfil no cargado. Por favor espera un momento e intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }
    
    const result = await updateProfile(profileFormData);
    if (result?.success) {
      toast({
        title: "✅ Perfil Actualizado",
        description: "Tu perfil se ha guardado exitosamente. Los cambios están ahora activos.",
        variant: "default",
      });
    } else {
      toast({
        title: "❌ Error al Actualizar",
        description: "Error al actualizar el perfil: " + (result?.error || 'Error desconocido'),
        variant: "destructive",
      });
    }
  };

  const handleResetProfile = async () => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Perfil no cargado. Por favor espera un momento e intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }
    
    const result = await resetProfile();
    if (result?.success) {
      toast({
        title: "🔄 Perfil Restablecido",
        description: "Tu perfil se ha restablecido a los valores predeterminados exitosamente.",
        variant: "default",
      });
    } else {
      toast({
        title: "❌ Error al Restablecer",
        description: "Error al restablecer el perfil: " + (result?.error || 'Error desconocido'),
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'booked': return 'default';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'booked': return 'En Proceso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Status color classes for badges
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white hover:opacity-90';
      case 'active':
        return 'bg-blue-600 text-white hover:opacity-90';
      case 'booked':
        return 'bg-orange-500 text-white hover:opacity-90';
      case 'completed':
        return 'bg-green-600 text-white hover:opacity-90';
      case 'cancelled':
        return 'bg-red-600 text-white hover:opacity-90';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-neutral-200">
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
                <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>





      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Dashboard del Cliente</h1>
            <p className="text-sm md:text-base text-neutral-500">Gestiona tus envíos y ofertas de transportistas</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => navigate('/shipment-form')} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Envío
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">
                    {stats.activeShipments}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Envíos Activos</p>
                  <p className="text-xs text-blue-500 font-medium">{stats.pendingQuotes} ofertas pendientes</p>
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
                    {stats.completedShipments}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Envíos Completados</p>
                  <p className="text-xs text-green-500 font-medium">{stats.readyForCompletion} listos para completar</p>
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-orange-600">
                    Q {stats.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Total Gastado</p>
                  <p className="text-xs text-orange-500 font-medium">{stats.paidQuotes} pagos realizados</p>
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
                    {stats.acceptedQuotes}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500">Ofertas Aceptadas</p>
                  <p className="text-xs text-purple-500 font-medium">Esperando pago</p>
                </div>
                <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="quotes" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
            <TabsTrigger value="quotes" className="text-xs md:text-sm p-2 md:p-3">Ofertas</TabsTrigger>
            <TabsTrigger value="cotizaciones" className="text-xs md:text-sm p-2 md:p-3 hidden">Cotizaciones</TabsTrigger>
            <TabsTrigger value="shipments" className="text-xs md:text-sm p-2 md:p-3">Envíos</TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs md:text-sm p-2 md:p-3 hidden">Marketplace</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs md:text-sm p-2 md:p-3">Pagos</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm p-2 md:p-3">Perfil</TabsTrigger>
          </TabsList>

          {/* Quotes Management Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Ofertas de Transportistas
                </CardTitle>
                <CardDescription>
                  Gestiona las ofertas que han recibido tus envíos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="text-center py-12 text-neutral-500">Cargando ofertas...</div>
                ) : quotesError ? (
                  <div className="text-center py-12 text-red-600">{quotesError}</div>
                ) : clientQuotes.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin ofertas aún</h3>
                    <p className="text-gray-500 mb-4">
                      Los transportistas podrán enviar ofertas para tus envíos pendientes
                    </p>
                    <Button onClick={() => navigate('/shipment-form')}>
                      Crear Nuevo Envío
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por transportista, envío o ruta..."
                            value={quoteSearchTerm}
                            onChange={(e) => setQuoteSearchTerm(e.target.value)}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>
                      <Select value={quoteStatusFilter} onValueChange={setQuoteStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="accepted">Aceptada</SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                          <SelectItem value="completed">Envío Completado</SelectItem>
                          <SelectItem value="rejected">Rechazada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Quotes */}
                    {(() => {
                      const filteredQuotes = clientQuotes.filter(quote => {
                        // Search filter
                        const matchesSearch = !quoteSearchTerm || 
                          quote.transporter?.full_name?.toLowerCase().includes(quoteSearchTerm.toLowerCase()) ||
                          quote.shipment?.title?.toLowerCase().includes(quoteSearchTerm.toLowerCase()) ||
                          quote.shipment?.origin_address?.toLowerCase().includes(quoteSearchTerm.toLowerCase()) ||
                          quote.shipment?.destination_address?.toLowerCase().includes(quoteSearchTerm.toLowerCase());
                        
                        // Status filter
                        const matchesStatus = quoteStatusFilter === 'all' || 
                          (quoteStatusFilter === 'pending' && quote.status === 'pending') ||
                          (quoteStatusFilter === 'accepted' && quote.status === 'accepted') ||
                          (quoteStatusFilter === 'paid' && quote.status === 'paid' && quote.shipment?.status !== 'completed') ||
                          (quoteStatusFilter === 'completed' && quote.status === 'paid' && quote.shipment?.status === 'completed') ||
                          (quoteStatusFilter === 'rejected' && quote.status === 'rejected');
                        
                        return matchesSearch && matchesStatus;
                      });

                      if (filteredQuotes.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ofertas</h3>
                            <p className="text-gray-500">
                              {quoteSearchTerm || quoteStatusFilter !== 'all' 
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay ofertas que coincidan con los criterios seleccionados'
                              }
                            </p>
                          </div>
                        );
                      }

                      return filteredQuotes.map((quote) => (
                      <Card key={quote.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-base md:text-lg text-gray-900">{quote.shipment?.title || 'Oferta de Envío'}</h4>
                              <p className="text-xs md:text-sm text-gray-600">{quote.shipment?.origin_address} → {quote.shipment?.destination_address}</p>
                            </div>
                            <Badge 
                              className={
                                quote.status === 'pending' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                                quote.status === 'accepted' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                quote.status === 'paid' ? (
                                  quote.shipment?.status === 'completed' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-green-600 text-white hover:bg-green-700'
                                ) : 'bg-red-600 text-white hover:bg-red-700'
                              }
                            >
                              {quote.status === 'pending' ? 'Pendiente' : 
                               quote.status === 'accepted' ? 'Aceptada' : 
                               quote.status === 'paid' ? (
                                 quote.shipment?.status === 'completed' ? 'Completado' : 'Pagado'
                               ) : 'Rechazada'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-500">Transportista</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                <p className="text-sm md:text-lg font-semibold">{quote.transporter?.full_name || 'Transportista'}</p>
                                {/* Enhanced Rating Display */}
                                {quote.transporter?.rating ? (
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={star} 
                                          className={`h-3 w-3 ${star <= Math.round(quote.transporter.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">
                                      {quote.transporter.rating.toFixed(1)}
                                      {quote.transporter.total_ratings && (
                                        <span className="text-xs text-gray-500"> ({quote.transporter.total_ratings})</span>
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <Star className="h-3 w-3" />
                                    <span className="text-xs">Sin calificaciones</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-500">Precio Ofertado</p>
                              <p className="text-lg md:text-2xl font-bold text-green-600">Q {parseFloat(quote.amount.toString()).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-500">Tiempo Estimado</p>
                              <p className="text-sm md:text-lg font-medium">{quote.estimatedDuration || '-'}</p>
                            </div>
                            <div className="flex items-end justify-start sm:justify-end">
                              <Button variant="outline" size="sm" onClick={() => openTransporterProfileForQuote(quote)} className="text-xs md:text-sm">
                                <Eye className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> 
                                <span className="hidden sm:inline">Ver Perfil del Transportista</span>
                                <span className="sm:hidden">Ver Perfil</span>
                              </Button>
                            </div>
                          </div>

                          {/* Enhanced Vehicle Information */}
                          {quote.vehicle ? (
                            <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                                <Truck className="h-3 w-3 md:h-4 md:w-4" />
                                Información del Vehículo
                              </h5>
                              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                                {/* Vehicle Details */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                  <div>
                                    <p className="text-xs text-blue-700 font-medium">Vehículo</p>
                                    <p className="text-xs md:text-sm font-semibold text-blue-900">{quote.vehicle.name || '-'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-blue-700 font-medium">Tipo</p>
                                    <p className="text-xs md:text-sm font-semibold text-blue-900">{translateVehicleType(quote.vehicle.vehicle_type) || '-'}</p>
                                  </div>
                                  {quote.vehicle.brand && quote.vehicle.model && (
                                    <div>
                                      <p className="text-xs text-blue-700 font-medium">Marca/Modelo</p>
                                      <p className="text-xs md:text-sm font-semibold text-blue-900">{quote.vehicle.brand} {quote.vehicle.model}</p>
                                    </div>
                                  )}
                                  {quote.vehicle.year && (
                                    <div>
                                      <p className="text-xs text-blue-700 font-medium">Año</p>
                                      <p className="text-sm font-semibold text-blue-900">{quote.vehicle.year}</p>
                                    </div>
                                  )}
                                  {quote.vehicle.capacity_kg && (
                                    <div>
                                      <p className="text-xs text-blue-700 font-medium">Capacidad</p>
                                      <p className="text-sm font-semibold text-blue-900">{quote.vehicle.capacity_kg} kg</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Truck className="h-4 w-4" />
                                <span className="text-sm">Información del vehículo no disponible</span>
                              </div>
                            </div>
                          )}
                          
                          {quote.comments && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-500 mb-1">Comentarios del Transportista</p>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded">{formatCompletionComment(quote.comments)}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="text-xs md:text-sm text-gray-500">
                              Enviada el {new Date(quote.createdAt).toLocaleDateString('es-GT')}
                            </div>
                            {quote.status === 'pending' && (
                              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button variant="outline" size="sm" onClick={() => handleRejectQuote(quote)} className="w-full sm:w-auto text-xs md:text-sm">
                                  Rechazar
                                </Button>
                                <Button size="sm" onClick={() => handleAcceptQuote(quote)} className="w-full sm:w-auto text-xs md:text-sm">
                                  Aceptar y Proceder al Pago
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteQuote(quote)} className="w-full sm:w-auto text-xs md:text-sm">
                                  Eliminar
                                </Button>
                              </div>
                            )}
                            {quote.status === 'accepted' && (
                              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button size="sm" onClick={() => {
                                  setSelectedQuote(quote);
                                  setIsPaymentDialogOpen(true);
                                }} className="w-full sm:w-auto text-xs md:text-sm">
                                  <CreditCard className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                                  Proceder al Pago
                                </Button>
                                <Button size="sm" variant="secondary" disabled className="w-full sm:w-auto text-xs md:text-sm">
                                  <MessageCircle className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                                  Chat (Pagar primero)
                                </Button>
                              </div>
                            )}

                          </div>
                        </CardContent>
                      </Card>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quote Requests Tab */}
          <TabsContent value="cotizaciones">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cotizaciones Enviadas
                </CardTitle>
                <CardDescription>
                  Solicitudes de cotización que has enviado a transportistas
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={loadQuoteRequests} disabled={quoteRequestsLoading}>
                    {quoteRequestsLoading ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quoteRequestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Cargando cotizaciones...</span>
                  </div>
                ) : quoteRequestsError ? (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar cotizaciones</h3>
                    <p className="text-gray-500 mb-4">{quoteRequestsError}</p>
                    <Button variant="outline" onClick={loadQuoteRequests}>Reintentar</Button>
                  </div>
                ) : quoteRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cotizaciones enviadas</h3>
                    <p className="text-gray-500">
                      Las solicitudes de cotización que envíes a transportistas aparecerán aquí
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
                                {getQuoteRequestStatusBadge(request.status)}
                                <span className="text-sm text-gray-500">
                                  {new Date(request.createdAt).toLocaleDateString('es-GT')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Transporter Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Transportista</p>
                              <p className="text-sm text-gray-900">
                                {request.transporter?.full_name || 'Transportista no especificado'}
                                {request.transporter?.company && ` (${request.transporter.company})`}
                              </p>
                              {request.transporter?.phone && (
                                <p className="text-xs text-gray-500 mt-1">📞 {request.transporter.phone}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Mensaje Enviado</p>
                              <p className="text-sm text-gray-900">{request.message || 'Sin mensaje'}</p>
                            </div>
                          </div>

                          {/* Shipment Details */}
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
                                  : 'No especificada'
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
                              <p className="font-medium">{request.shipment?.cargo_type || 'No especificado'}</p>
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

                          {/* Transporter Response */}
                          {request.status === 'responded' && (
                            <div className="border-t pt-4">
                              <h5 className="font-medium text-gray-900 mb-2">Respuesta del Transportista:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Monto</p>
                                  <p className="font-medium text-green-600">Q {request.responseAmount?.toLocaleString() || 'No especificado'}</p>
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
                              
                                  {/* Accept/Reject Buttons - Only show for responded status */}
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleQuoteRequestAction(request.id, 'accepted', request)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Aceptar Cotización
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                  onClick={() => handleQuoteRequestAction(request.id, 'rejected', request)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Rechazar
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Accepted/Rejected Status */}
                          {(request.status === 'accepted' || request.status === 'rejected') && (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2">
                                {request.status === 'accepted' ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <p className="text-sm font-medium text-green-800">
                                      ✅ Cotización aceptada - El transportista ha sido notificado
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <p className="text-sm font-medium text-red-800">
                                      ❌ Cotización rechazada
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Expiration Info */}
                          {request.status === 'pending' && request.expiresAt && (
                            <div className="border-t pt-4">
                              <p className="text-sm text-gray-500">
                                ⏰ Expira: {new Date(request.expiresAt).toLocaleDateString('es-GT')}
                              </p>
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

          {/* My Shipments Tab */}
          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Mis Envíos
                </CardTitle>
                <CardDescription>
                  Gestiona todos tus envíos creados
                </CardDescription>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={loadShipments} disabled={shipmentsLoading} className="text-xs md:text-sm">
                      {shipmentsLoading ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                  </div>
                  <Button size="sm" onClick={() => navigate('/shipment-form')} className="w-full sm:w-auto text-xs md:text-sm">
                    <Plus className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Nuevo Envío
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {shipmentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Cargando envíos...</span>
                  </div>
                ) : shipmentsError ? (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar envíos</h3>
                    <p className="text-gray-500 mb-4">{shipmentsError}</p>
                    <Button variant="outline" onClick={loadShipments}>Reintentar</Button>
                  </div>
                ) : shipments.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin envíos aún</h3>
                    <p className="text-gray-500 mb-4">
                      Crea tu primer envío para comenzar a recibir ofertas de transportistas
                    </p>
                    <Button onClick={() => navigate('/shipment-form')}>
                      Crear Primer Envío
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por título, ruta o descripción..."
                            value={shipmentSearchTerm}
                            onChange={(e) => setShipmentSearchTerm(e.target.value)}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>
                      <Select value={shipmentStatusFilter} onValueChange={setShipmentStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="booked">En Proceso</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Shipments */}
                    {(() => {
                      const filteredShipments = shipments.filter(shipment => {
                        // Search filter
                        const matchesSearch = !shipmentSearchTerm || 
                          shipment.title?.toLowerCase().includes(shipmentSearchTerm.toLowerCase()) ||
                          shipment.description?.toLowerCase().includes(shipmentSearchTerm.toLowerCase()) ||
                          shipment.originAddress?.toLowerCase().includes(shipmentSearchTerm.toLowerCase()) ||
                          shipment.destinationAddress?.toLowerCase().includes(shipmentSearchTerm.toLowerCase()) ||
                          translateCargoType(shipment.cargoType)?.toLowerCase().includes(shipmentSearchTerm.toLowerCase());
                        
                        // Status filter
                        const matchesStatus = shipmentStatusFilter === 'all' || 
                          shipment.status === shipmentStatusFilter;
                        
                        return matchesSearch && matchesStatus;
                      });

                      if (filteredShipments.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron envíos</h3>
                            <p className="text-gray-500">
                              {shipmentSearchTerm || shipmentStatusFilter !== 'all' 
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay envíos que coincidan con los criterios seleccionados'
                              }
                            </p>
                          </div>
                        );
                      }

                      return filteredShipments.map((shipment) => {
                      console.log('🔍 Rendering shipment:', shipment);
                      console.log('🔍 Shipment acceptedOffer:', shipment.acceptedOffer);
                      console.log('🔍 Shipment status:', shipment.status);
                      
                      return (
                        <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-base md:text-lg text-gray-900">{shipment.title}</h4>
                              <p className="text-sm md:text-base text-gray-600">{shipment.description}</p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-2">
                              <Badge className={getStatusClass(shipment.status)}>
                                {getStatusText(shipment.status)}
                              </Badge>
                              {shipment.status === 'booked' && (
                                <p className="text-xs text-green-600 font-medium">
                                  ✅ Listo para marcar como completado
                                </p>
                              )}
                              {shipment.status === 'completed' && shipment.allOffersForShipment?.some(offer => 
                                offer.comments && offer.comments.includes('COMPLETED_')
                              ) && (
                                <p className="text-xs text-green-600 font-medium">
                                  ✅ Completado por el Transportista
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-500">Ruta</p>
                              <p className="text-xs md:text-sm">{shipment.originAddress} → {shipment.destinationAddress}</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-500">Peso</p>
                              <p className="text-xs md:text-sm">{shipment.weight}kg - {translateCargoType(shipment.cargoType)}</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-500">Fecha de Recogida</p>
                              <p className="text-xs md:text-sm">{shipment.pickupDate ? new Date(shipment.pickupDate).toLocaleDateString('es-GT') : '-'}</p>
                            </div>
                          </div>
                          
                          {/* Show transporter info if offer is accepted OR if shipment is completed */}
                          {(shipment.acceptedOffer || shipment.status === 'completed') && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                  <Truck className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                  <h5 className="font-semibold text-blue-800 text-sm md:text-base">
                                    {shipment.acceptedOffer ? 'Transportista Asignado' : 'Transportista del Envío'}
                                  </h5>
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                  {shipment.acceptedOffer ? 'Oferta Aceptada' : 'Envío Completado'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                                <div>
                                  <p className="text-xs md:text-sm text-blue-600">Transportista</p>
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                    <p className="text-sm md:text-lg font-semibold text-blue-800">
                                      {shipment.acceptedOffer?.transporter_profile?.full_name || 
                                       (shipment.allOffersForShipment?.[0]?.transporter_name) || 
                                       'No disponible'}
                                    </p>
                                    {/* Enhanced Rating Display */}
                                    {shipment.acceptedOffer?.transporter_profile?.rating ? (
                                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                              key={star} 
                                              className={`h-3 w-3 ${star <= Math.round(shipment.acceptedOffer?.transporter_profile?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">
                                          {shipment.acceptedOffer?.transporter_profile?.rating?.toFixed(1) || '0.0'}
                                          {shipment.acceptedOffer?.transporter_profile?.total_ratings && (
                                            <span className="text-xs text-gray-500"> ({shipment.acceptedOffer?.transporter_profile?.total_ratings})</span>
                                          )}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-gray-400">
                                        <Star className="h-3 w-3" />
                                        <span className="text-xs">Sin calificaciones</span>
                                      </div>
                                    )}
                                  </div>
                                                                     {shipment.acceptedOffer?.transporter_profile?.company && (
                                     <p className="text-sm text-blue-600">{shipment.acceptedOffer?.transporter_profile?.company}</p>
                                   )}
                                </div>
                                
                                <div>
                                  <p className="text-sm text-blue-600">Precio Ofertado</p>
                                  <p className="text-2xl font-bold text-green-600">
                                    Q {Number(shipment.acceptedOffer?.amount || 0).toLocaleString()}
                                  </p>
                                  {shipment.acceptedOffer?.amount && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      Precio original: Q {Number(shipment.row?.estimated_price || 0).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                                
                                <div>
                                  <p className="text-sm text-blue-600">Tiempo Estimado</p>
                                  <p className="text-lg font-medium">{shipment.acceptedOffer?.estimated_duration || '-'}</p>
                                </div>
                                
                                <div className="flex items-end justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                    onClick={() => {
                                      console.log('🖱️ Button clicked!');
                                      console.log('📦 Shipment acceptedOffer:', shipment.acceptedOffer);
                                      if (shipment.acceptedOffer) {
                                        handleViewTransporterForShipment(shipment.acceptedOffer);
                                      } else if (shipment.allOffersForShipment?.[0]) {
                                        // If no accepted offer but we have offers, use the first one
                                        handleViewTransporterForShipment(shipment.allOffersForShipment[0]);
                                      }
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Perfil del Transportista
                                  </Button>
                                </div>
                              </div>

                              {/* Enhanced Vehicle Information */}
                              {shipment.acceptedOffer?.transporter_vehicle ? (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Información del Vehículo
                                  </h5>
                                  <div className="flex gap-4">
                                    {/* Vehicle Details */}
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-xs text-blue-700 font-medium">Vehículo</p>
                                        <p className="text-sm font-semibold text-blue-900">{shipment.acceptedOffer?.transporter_vehicle?.name || '-'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-700 font-medium">Tipo</p>
                                        <p className="text-sm font-semibold text-blue-900">{translateVehicleType(shipment.acceptedOffer?.transporter_vehicle?.vehicle_type) || '-'}</p>
                                      </div>
                                                                              {shipment.acceptedOffer?.transporter_vehicle?.brand && shipment.acceptedOffer?.transporter_vehicle?.model && (
                                        <div>
                                          <p className="text-xs text-blue-700 font-medium">Marca/Modelo</p>
                                          <p className="text-sm font-semibold text-blue-900">{shipment.acceptedOffer?.transporter_vehicle?.brand} {shipment.acceptedOffer?.transporter_vehicle?.model}</p>
                                        </div>
                                      )}
                                                                              {shipment.acceptedOffer?.transporter_vehicle?.year && (
                                        <div>
                                          <p className="text-xs text-blue-700 font-medium">Año</p>
                                          <p className="text-sm font-semibold text-blue-900">{shipment.acceptedOffer?.transporter_vehicle?.year}</p>
                                        </div>
                                      )}
                                                                              {shipment.acceptedOffer?.transporter_vehicle?.capacity_kg && (
                                        <div>
                                          <p className="text-xs text-blue-700 font-medium">Capacidad</p>
                                          <p className="text-sm font-semibold text-blue-900">{shipment.acceptedOffer?.transporter_vehicle?.capacity_kg} kg</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <Truck className="h-4 w-4" />
                                    <span className="text-sm">Información del vehículo no disponible</span>
                                  </div>
                                </div>
                              )}
                              
                              {shipment.acceptedOffer?.comments && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-500 mb-1">Comentarios del Transportista</p>
                                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{formatCompletionComment(shipment.acceptedOffer?.comments)}</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Creado el {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('es-GT') : '-'}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewShipmentDetails(shipment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </Button>
                              
                              {/* Edit button - only show when no transporter has accepted the shipment */}
                              {!shipment.acceptedOffer && (
                                <Button variant="outline" size="sm" onClick={() => openEditShipment(shipment)}>
                                  Editar
                                </Button>
                              )}
                              {shipment.status === 'booked' && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleTrackingForShipment(shipment)}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Ver Seguimiento
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleChatForShipment(shipment)}
                                    className="bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700"
                                  >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Chatear con Transportista
                                  </Button>
                                  
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleMarkAsCompleted(shipment)}
                                    className="text-green-600 border-green-300 hover:bg-green-50"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marcar como Completado
                                  </Button>
                                </div>
                              )}
                              
                              {/* Buttons for active shipments */}
                              {shipment.status === 'active' && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleTrackingForShipment(shipment)}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Ver Seguimiento
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleChatForShipment(shipment)}
                                    className="bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700"
                                  >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Chatear con Transportista
                                  </Button>
                                </div>
                              )}
                              
                              {/* Review button for completed shipments */}
                              {shipment.status === 'completed' && (
                                <div className="flex items-center gap-2">
                                  {/* Review status indicator */}
                                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-300">
                                    {submittedReviews[shipment.id] ? '✅ Reseñado' : '⭐ Pendiente de Reseña'}
                                  </Badge>
                                  
                                  {/* Show review data if exists */}
                                  {submittedReviews[shipment.id] && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            className={`w-3 h-3 ${i < submittedReviews[shipment.id].rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                          />
                                        ))}
                                        <span className="ml-1">({submittedReviews[shipment.id].rating}/5)</span>
                                      </div>
                                      {submittedReviews[shipment.id].comment && (
                                        <p className="text-gray-500 italic mt-1">"{submittedReviews[shipment.id].comment}"</p>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Review button */}
                                  {!submittedReviews[shipment.id] && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleReviewTransporter(shipment)}
                                      className="text-green-600 border-green-300 hover:bg-green-50"
                                    >
                                      <Star className="mr-2 h-4 w-4" />
                                      Dar Reseña
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
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
            
            {/* Review Modal - must be rendered at tab level */}
            {renderReviewModal()}
          </TabsContent>

          {/* Marketplace Transportistas Tab */}
          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Marketplace de Transportistas
                </CardTitle>
                <CardDescription>
                  Encuentra y cotiza con transportistas verificados
                </CardDescription>
                

                
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={loadTransporters} disabled={transportersLoading}>
                    {transportersLoading ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>

                
                {transportersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Cargando transportistas...</span>
                  </div>
                ) : transportersError ? (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar transportistas</h3>
                    <p className="text-gray-500 mb-4">{transportersError}</p>
                    <Button variant="outline" onClick={loadTransporters}>Reintentar</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="lg:col-span-2">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por nombre de transportista..."
                            value={transporterSearchTerm}
                            onChange={(e) => setTransporterSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={transporterRatingFilter} onValueChange={setTransporterRatingFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por calificación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las calificaciones</SelectItem>
                          <SelectItem value="5">5 estrellas</SelectItem>
                          <SelectItem value="4">4+ estrellas</SelectItem>
                          <SelectItem value="3">3+ estrellas</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={transporterVerificationFilter} onValueChange={setTransporterVerificationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Verificación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="verified">Solo verificados</SelectItem>
                          <SelectItem value="unverified">No verificados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mb-6">
                      <Select value={transporterVehicleFilter} onValueChange={setTransporterVehicleFilter}>
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue placeholder="Filtrar por tipo de vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los vehículos</SelectItem>
                          <SelectItem value="small_truck">Camión Pequeño</SelectItem>
                          <SelectItem value="medium_truck">Camión Mediano</SelectItem>
                          <SelectItem value="large_truck">Camión Grande</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="trailer">Remolque</SelectItem>
                          <SelectItem value="van">Furgón</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Transporters */}
                    {(() => {
                      const filteredTransporters = transporters.filter(transporter => {
                        // Search filter
                        const matchesSearch = !transporterSearchTerm || 
                          transporter.name?.toLowerCase().includes(transporterSearchTerm.toLowerCase());
                        
                        // Rating filter
                        const matchesRating = transporterRatingFilter === 'all' || 
                          (transporterRatingFilter === '5' && transporter.rating >= 5) ||
                          (transporterRatingFilter === '4' && transporter.rating >= 4) ||
                          (transporterRatingFilter === '3' && transporter.rating >= 3);
                        
                        // Verification filter
                        const matchesVerification = transporterVerificationFilter === 'all' || 
                          (transporterVerificationFilter === 'verified' && transporter.isVerified) ||
                          (transporterVerificationFilter === 'unverified' && !transporter.isVerified);
                        
                        // Vehicle type filter
                        const matchesVehicle = transporterVehicleFilter === 'all' || 
                          (transporter.rawProfile?.transporter_vehicles && 
                           transporter.rawProfile.transporter_vehicles.some((vehicle: any) => 
                             vehicle.vehicle_type === transporterVehicleFilter));
                        
                        return matchesSearch && matchesRating && matchesVerification && matchesVehicle;
                      });

                      if (filteredTransporters.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron transportistas</h3>
                            <p className="text-gray-500">
                              {transporterSearchTerm || transporterRatingFilter !== 'all' || transporterVerificationFilter !== 'all' || transporterVehicleFilter !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay transportistas que coincidan con los criterios seleccionados'
                              }
                            </p>
                          </div>
                        );
                      }

                      return filteredTransporters.map((transporter) => (
                      <Card key={transporter.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{transporter.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">{transporter.rating}</span>
                                  <span className="text-sm text-gray-500">({transporter.totalRatings} reseñas)</span>
                                </div>
                                {transporter.isVerified && (
                                  <Badge className="bg-emerald-600 text-white border-emerald-700 font-medium">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verificado
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {transporter.rawProfile?.transporter_vehicles && transporter.rawProfile.transporter_vehicles.length > 0 ? (
                                transporter.rawProfile.transporter_vehicles.map((vehicle: any, idx: number) => {
                                  const getBadgeStyle = (vehicleType: string) => {
                                    switch (vehicleType) {
                                      case 'small_truck': return 'bg-blue-100 text-blue-800 border-blue-200';
                                      case 'medium_truck': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
                                      case 'large_truck': return 'bg-purple-100 text-purple-800 border-purple-200';
                                      case 'pickup': return 'bg-green-100 text-green-800 border-green-200';
                                      case 'trailer': return 'bg-orange-100 text-orange-800 border-orange-200';
                                      case 'van': return 'bg-teal-100 text-teal-800 border-teal-200';
                                      default: return 'bg-gray-100 text-gray-800 border-gray-200';
                                    }
                                  };
                                  
                                  const getVehicleLabel = (vehicleType: string) => {
                                    return translateVehicleType(vehicleType) || 'General';
                                  };
                                  
                                  return (
                                    <Badge 
                                      key={idx} 
                                      className={`text-xs font-medium border ${getBadgeStyle(vehicle.vehicle_type)}`}
                                    >
                                      {getVehicleLabel(vehicle.vehicle_type)}
                                    </Badge>
                                  );
                                })
                              ) : (
                                <Badge variant="outline" className="text-xs">Sin vehículos</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Áreas de Servicio</p>
                              <div className="space-y-1">
                                {transporter.routes && transporter.routes.length > 0 ? (
                                  transporter.routes.map((route, idx) => (
                                    <p key={idx} className="text-sm text-gray-600">{route}</p>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-400 italic">No especificado</p>
                                )}
                              </div>
                            </div>

                          </div>
                          
                          {/* Additional Information */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-gray-500">Empresa</p>
                              <p className="font-medium">{transporter.company || 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Experiencia</p>
                              <p className="font-medium">{transporter.yearsExperience ? `${transporter.yearsExperience} años` : 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Capacidad Máx</p>
                              <p className="font-medium">{transporter.maxCapacity ? `${transporter.maxCapacity} kg` : 'No especificado'}</p>
                            </div>
                          </div>
                          
                          {/* Vehicles Information - Expandable/Collapsible */}
                          {transporter.rawProfile?.transporter_vehicles && transporter.rawProfile.transporter_vehicles.length > 0 && (
                            <div className="border-t pt-4 mb-4">
                              <button
                                onClick={() => {
                                  const transporterId = transporter.id;
                                  setExpandedVehicles(prev => ({
                                    ...prev,
                                    [transporterId]: !prev[transporterId]
                                  }));
                                }}
                                className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                              >
                                <h5 className="text-sm font-medium text-gray-700">
                                  Vehículos Disponibles ({transporter.rawProfile.transporter_vehicles.length})
                                </h5>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {expandedVehicles[transporter.id] ? 'Ocultar' : 'Mostrar'}
                                  </span>
                                  <ChevronDown 
                                    className={`h-4 w-4 text-gray-500 transition-transform ${
                                      expandedVehicles[transporter.id] ? 'rotate-180' : ''
                                    }`}
                                  />
                                </div>
                              </button>
                              
                              {/* Collapsible Vehicle Details */}
                              <div className={`space-y-3 transition-all duration-200 overflow-hidden ${
                                expandedVehicles[transporter.id] 
                                  ? 'max-h-96 opacity-100' 
                                  : 'max-h-0 opacity-0'
                              }`}>
                                
                                {/* Summary View when collapsed */}
                                {!expandedVehicles[transporter.id] && (
                                  <div className="text-sm text-gray-600 italic">
                                    Haz clic en "Mostrar" para ver detalles completos de los vehículos
                                  </div>
                                )}
                                
                                {/* Full Vehicle Details when expanded */}
                                {expandedVehicles[transporter.id] && (
                                  <>
                                    {transporter.rawProfile.transporter_vehicles.map((vehicle: any, idx: number) => (
                                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                          <h6 className="font-medium text-gray-900">{vehicle.name || `Vehículo ${idx + 1}`}</h6>
                                          <Badge className={`text-xs font-medium border ${
                                            vehicle.vehicle_type === 'small_truck' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                            vehicle.vehicle_type === 'medium_truck' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                                            vehicle.vehicle_type === 'large_truck' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                            vehicle.vehicle_type === 'pickup' ? 'bg-green-100 text-green-800 border-green-200' :
                                            vehicle.vehicle_type === 'trailer' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                            vehicle.vehicle_type === 'van' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                                            'bg-gray-100 text-gray-800 border-gray-200'
                                          }`}>
                                                                                      {translateVehicleType(vehicle.vehicle_type)}
                                          </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          {vehicle.brand && vehicle.model && (
                                            <div>
                                              <span className="font-medium">Marca/Modelo:</span> {vehicle.brand} {vehicle.model}
                                            </div>
                                          )}
                                          {vehicle.year && (
                                            <div>
                                              <span className="font-medium">Año:</span> {vehicle.year}
                                            </div>
                                          )}
                                          {vehicle.capacity_kg && (
                                            <div>
                                              <span className="font-medium">Capacidad:</span> {vehicle.capacity_kg} kg
                                            </div>
                                          )}
                                          {vehicle.plate && (
                                            <div>
                                              <span className="font-medium">Placa:</span> {vehicle.plate}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Transportista registrado
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewTransporterProfile(transporter)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Perfil
                              </Button>
                              <Button size="sm" onClick={() => handleRequestQuoteFromTransporter(transporter)}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Cotizar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transporter Profile Dialog - must be rendered at tab level */}
          {renderTransporterProfileDialog()}
          
          {/* Review Modal - must be rendered at tab level */}
          {renderReviewModal()}

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Historial de Pagos
                </CardTitle>
                <CardDescription>
                  Revisa todos los pagos realizados a transportistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin pagos aún</h3>
                    <p className="text-gray-500">
                      Los pagos aparecerán aquí después de que completes transacciones con transportistas
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
                            placeholder="Buscar por transportista o envío..."
                            value={paymentSearchTerm}
                            onChange={(e) => setPaymentSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={paymentAmountFilter} onValueChange={setPaymentAmountFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por monto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los montos</SelectItem>
                          <SelectItem value="high">Q 5,000+</SelectItem>
                          <SelectItem value="medium">Q 2,000 - Q 5,000</SelectItem>
                          <SelectItem value="low">Menos de Q 2,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={paymentDateFilter} onValueChange={setPaymentDateFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por fecha" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las fechas</SelectItem>
                          <SelectItem value="today">Hoy</SelectItem>
                          <SelectItem value="week">Esta semana</SelectItem>
                          <SelectItem value="month">Este mes</SelectItem>
                          <SelectItem value="year">Este año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtered Payments */}
                    {(() => {
                      const filteredPayments = payments.filter(payment => {
                        // Search filter
                        const matchesSearch = !paymentSearchTerm || 
                          payment.offers?.shipment_title?.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
                          payment.offers?.transporter_name?.toLowerCase().includes(paymentSearchTerm.toLowerCase());
                        
                        // Amount filter
                        const paymentAmount = parseFloat(payment.amount.toString());
                        const matchesAmount = paymentAmountFilter === 'all' || 
                          (paymentAmountFilter === 'high' && paymentAmount >= 5000) ||
                          (paymentAmountFilter === 'medium' && paymentAmount >= 2000 && paymentAmount < 5000) ||
                          (paymentAmountFilter === 'low' && paymentAmount < 2000);
                        
                        // Date filter
                        const paymentDate = new Date(payment.created_at);
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                        
                        const matchesDate = paymentDateFilter === 'all' || 
                          (paymentDateFilter === 'today' && paymentDate >= today) ||
                          (paymentDateFilter === 'week' && paymentDate >= weekAgo) ||
                          (paymentDateFilter === 'month' && paymentDate >= monthAgo) ||
                          (paymentDateFilter === 'year' && paymentDate >= yearAgo);
                        
                        return matchesSearch && matchesAmount && matchesDate;
                      });

                      if (filteredPayments.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pagos</h3>
                            <p className="text-gray-500">
                              {paymentSearchTerm || paymentAmountFilter !== 'all' || paymentDateFilter !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay pagos que coincidan con los criterios seleccionados'
                              }
                            </p>
                          </div>
                        );
                      }

                      return filteredPayments.map((payment) => (
                      <Card key={payment.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {payment.offers?.shipment_title || 'Envío'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Transportista: {payment.offers?.transporter_name || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                Q{parseFloat(payment.amount.toString()).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(payment.created_at).toLocaleDateString('es-GT')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Método de Pago</p>
                              <p className="font-medium">Tarjeta</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Estado</p>
                              <Badge variant="default" className="bg-green-600">
                                {payment.status === 'completed' ? 'Completado' : payment.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-gray-500">Moneda</p>
                              <p className="font-medium">{payment.currency}</p>
                            </div>
                          </div>
                          
                          {payment.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <strong>Notas:</strong> {payment.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Mi Perfil
                </CardTitle>
                <CardDescription>
                  Gestiona tu información personal y preferencias de la cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {profileLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Cargando perfil...</span>
                  </div>
                )}

                {/* No Profile State */}
                {!profileLoading && !profileError && !profile && (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil no encontrado</h3>
                    <p className="text-gray-600 mb-4">No se pudo cargar tu perfil. Intenta recargar la página.</p>
                    <Button onClick={() => window.location.reload()}>
                      Recargar Página
                    </Button>
                  </div>
                )}

                {/* Error State */}
                {profileError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700">Error: {profileError}</span>
                    </div>
                    
                    {/* Special handling for UUID validation errors */}
                    {profileError.includes('Invalid user ID format') && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-sm mb-2">
                          <strong>⚠️ Problema detectado:</strong> Tu ID de usuario no tiene el formato correcto.
                        </p>
                        <p className="text-yellow-700 text-sm mb-3">
                          Esto sucede cuando se usan IDs antiguos. La solución es limpiar los datos y volver a iniciar sesión.
                        </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                          className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                          onClick={() => {
                            toast({
                              title: "🧹 Datos Limpiados",
                              description: "Datos de usuario inválidos eliminados. Por favor, inicia sesión nuevamente.",
                              variant: "default",
                            });
                            window.location.href = '/';
                          }}
                        >
                          🧹 Limpiar Datos y Reiniciar Sesión
                      </Button>
                  </div>
                )}

                    {/* Special handling for database structure errors */}
                    {profileError.includes('Database structure issue') && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-800 text-sm mb-2">
                          <strong>🚨 Problema de base de datos:</strong> La estructura de la tabla no es correcta.
                        </p>
                        <p className="text-red-700 text-sm mb-3">
                          Esto indica un problema con la configuración de Supabase. Usa el botón "📋 Ver Estructura de Tabla" para ver qué se espera.
                        </p>
                        <div className="flex gap-2">
                                          <Button 
                        variant="outline"
                            size="sm"
                            className="bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
                            onClick={() => {
                              toast({
                                title: "📋 Estructura de Tabla",
                                description: "Para ver la estructura de la tabla, revisa la consola del navegador.",
                                variant: "default",
                              });
                            }}
                          >
                            📋 Ver Estructura Esperada
                      </Button>
                      <Button 
                        variant="outline"
                            size="sm"
                            className="bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
                            onClick={() => {
                              const sqlScript = `-- SQL script to create the client_profiles table in Supabase
-- Run this in your Supabase SQL Editor

-- Create the client_profiles table
CREATE TABLE IF NOT EXISTS client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    language TEXT NOT NULL DEFAULT 'es',
    notifications TEXT NOT NULL DEFAULT 'all',
    currency TEXT NOT NULL DEFAULT 'GTQ',
    default_origin TEXT,
    preferred_transporters TEXT NOT NULL DEFAULT 'any',
    insurance_level TEXT NOT NULL DEFAULT 'basic',
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own profile" ON client_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile" ON client_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON client_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Grant permissions
GRANT ALL ON client_profiles TO authenticated;`;
                              
                        
                              toast({
                                title: "🔧 Script SQL Disponible",
                                description: "Para resolver este problema: 1. Ve a tu dashboard de Supabase 2. Abre el SQL Editor 3. Copia y pega el script de la consola 4. Ejecuta el script 5. Recarga esta página. El script completo está en la consola del navegador.",
                                variant: "default",
                              });
                            }}
                          >
                            🔧 Ver Script SQL
                      </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                                          <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => window.location.reload()} 
                      >
                        Reintentar
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => {
                          toast({
                            title: "🧪 Función No Disponible",
                            description: "Función de prueba de conexión no disponible.",
                            variant: "default",
                          });
                        }}
                      >
                        🧪 Probar Conexión
                      </Button>
                  </div>
                </div>
                )}



                {/* Profile Content */}
                {!profileLoading && !profileError && profile && (
                  <>
                    {/* Profile Picture Section */}
                    <div className="flex justify-center mb-8">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                                            {profile?.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <Users className="w-16 h-16 text-white" />
                          </div>
                        )}
                        
                        {/* Upload Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Upload Progress Indicator */}
                                        {profileSaving && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                          <Upload className="w-4 h-4 mr-2" />
                          {profile?.profile_picture_url ? 'Cambiar Foto' : 'Subir Foto'}
                        </Button>
                        {profile?.profile_picture_url && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleRemoveProfilePicture}
                            className="text-red-600 hover:text-red-700 hover:border-red-200"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Eliminar
                          </Button>
                        )}
                      </div>
                      <input
                          ref={fileInputRef}
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500">
                          JPG, PNG, GIF o WEBP. Máximo 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información Personal</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="fullName">Nombre Completo</Label>
                        <Input
                          id="fullName"
                          value={profileFormData.full_name}
                          onChange={(e) => handleProfileInputChange('full_name', e.target.value)}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          placeholder="tu@email.com"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileFormData.phone}
                          onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                          placeholder="+502 1234 5678"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="company">Empresa (Opcional)</Label>
                        <Input
                          id="company"
                          value={profileFormData.company}
                          onChange={(e) => handleProfileInputChange('company', e.target.value)}
                          placeholder="Nombre de tu empresa"
                        />
                      </div>
                    </div>
                  </div>


                </div>

                {/* Additional Profile Sections */}
                <Separator className="my-6" />
                




                {/* Billing Information Section */}
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Información de Facturación y Pagos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Guarda tus datos de facturación para agilizar el proceso de checkout
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Details */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">Detalles de Tarjeta</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                          <Input
                            id="cardNumber"
                            value={profileFormData.card_number || ''}
                            onChange={(e) => handleProfileInputChange('card_number', e.target.value)}
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="cardExpiry">Vencimiento *</Label>
                            <Input
                              id="cardExpiry"
                              value={profileFormData.card_expiry || ''}
                              onChange={(e) => handleProfileInputChange('card_expiry', e.target.value)}
                              placeholder="MM/AA"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv">CVV *</Label>
                            <Input
                              id="cardCvv"
                              value={profileFormData.card_cvv || ''}
                              onChange={(e) => handleProfileInputChange('card_cvv', e.target.value)}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">Información de Facturación</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="billingAddress">Dirección Completa *</Label>
                          <Textarea
                            id="billingAddress"
                            value={profileFormData.billing_address || ''}
                            onChange={(e) => handleProfileInputChange('billing_address', e.target.value)}
                            placeholder="Calle, número, ciudad, departamento"
                            rows={3}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="taxId">NIT/DPI *</Label>
                          <Input
                            id="taxId"
                            value={profileFormData.tax_id || ''}
                            onChange={(e) => handleProfileInputChange('tax_id', e.target.value)}
                            placeholder="Número de identificación fiscal"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="companyName">Nombre de Empresa para Facturación *</Label>
                          <Input
                            id="companyName"
                            value={profileFormData.billing_company_name || ''}
                            onChange={(e) => handleProfileInputChange('billing_company_name', e.target.value)}
                            placeholder="Nombre de tu empresa o razón social"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <Separator className="my-6" />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Última actualización: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('es-GT') : new Date().toLocaleDateString('es-GT')}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetProfile} disabled={profileSaving}>
                      Restablecer Cambios
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={profileSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {profileSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </div>
                </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Shipment Details Dialog */}
        <Dialog open={isShipmentDetailsOpen} onOpenChange={setIsShipmentDetailsOpen}>
          <DialogContent className="sm:max-w-[520px] md:max-w-[720px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Envío</DialogTitle>
              <DialogDescription>
                Información de tu envío seleccionado
              </DialogDescription>
            </DialogHeader>
            {selectedShipment && (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm"><strong>Título:</strong> {selectedShipment.row.title}</p>
                  <p className="text-sm"><strong>Descripción:</strong> {selectedShipment.row.description || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Ruta</p>
                    <p className="text-sm">{selectedShipment.row.origin_address} → {selectedShipment.row.destination_address}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Peso / Tipo</p>
                    <p className="text-sm">{selectedShipment.row.weight ?? '-'} kg - {translateCargoType(selectedShipment.row.cargo_type)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Recogida</p>
                    <p className="text-sm">{selectedShipment.row.pickup_date ? new Date(selectedShipment.row.pickup_date).toLocaleDateString('es-GT') : '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Entrega</p>
                    <p className="text-sm">{selectedShipment.row.delivery_date ? new Date(selectedShipment.row.delivery_date).toLocaleDateString('es-GT') : '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Horarios</p>
                    <p className="text-sm">{selectedShipment.row.pickup_time || '-'} / {selectedShipment.row.delivery_time || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <Badge className={getStatusClass(selectedShipment.row.status)}>{getStatusText(selectedShipment.row.status)}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Dimensiones (cm)</p>
                    <p className="text-sm">{selectedShipment.row.dimensions_length ?? '-'} × {selectedShipment.row.dimensions_width ?? '-'} × {selectedShipment.row.dimensions_height ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Piezas</p>
                    <p className="text-sm">{selectedShipment.row.pieces ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Empaque</p>
                    <p className="text-sm">{selectedShipment.row.packaging ? translatePackaging(selectedShipment.row.packaging) : '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Seguro (Q)</p>
                    <p className="text-sm">{selectedShipment.row.insurance_value ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Preferencias</p>
                    <p className="text-sm">Prioridad: {translatePriority(selectedShipment.row.priority)} | Temp: {translateTemperature(selectedShipment.row.temperature)} | Humedad: {translateHumidity(selectedShipment.row.humidity)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500">Aduana</p>
                    <p className="text-sm">{selectedShipment.row.customs ? 'Sí' : 'No'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded col-span-2">
                    <p className="text-sm font-medium text-gray-500">Documentos</p>
                    <p className="text-sm">{(selectedShipment.row.documents || []).join(', ') || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded col-span-2">
                    <p className="text-sm font-medium text-gray-500">Instrucciones</p>
                    <p className="text-sm">Recogida: {selectedShipment.row.pickup_instructions || '-'} / Entrega: {selectedShipment.row.delivery_instructions || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded col-span-2">
                    <p className="text-sm font-medium text-gray-500">Contacto</p>
                    <p className="text-sm">{selectedShipment.row.contact_person || '-'} · {selectedShipment.row.contact_phone || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded col-span-2">
                    <p className="text-sm font-medium text-gray-500">Coordenadas</p>
                    <p className="text-sm">Pickup: {selectedShipment.row.pickup_lat ?? '-'}, {selectedShipment.row.pickup_lng ?? '-'} | Entrega: {selectedShipment.row.delivery_lat ?? '-'}, {selectedShipment.row.delivery_lng ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded col-span-2">
                    <p className="text-sm font-medium text-gray-500">Precio Estimado (Q)</p>
                    <p className="text-sm">{selectedShipment.row.estimated_price ?? '-'}</p>
                  </div>
                </div>
                
                {/* Offers Section */}
                {selectedShipment.allOffersForShipment && selectedShipment.allOffersForShipment.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Ofertas Recibidas</h3>
                    {selectedShipment.allOffersForShipment.map((offer, index) => (
                      <div key={offer.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-blue-900">
                              {offer.transporter_name || 'Transportista'}
                            </p>
                            <p className="text-sm text-blue-700">
                              Vehículo: {offer.vehicle_type || 'N/A'} | Placa: {offer.transporter_vehicle?.plate || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-900">Q {offer.amount || 0}</p>
                            <p className="text-xs text-blue-600">
                              {offer.estimated_duration || 'Sin especificar'}
                            </p>
                          </div>
                        </div>
                        {offer.comments && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-sm text-gray-700">
                              <strong>Comentarios:</strong> {formatCompletionComment(offer.comments)}
                            </p>
                            {offer.comments.includes('COMPLETED_') && (
                              <div className="mt-2 p-2 bg-green-100 rounded border border-green-300">
                                <p className="text-sm font-medium text-green-800">
                                  ✅ Envío Completado por el Transportista
                                </p>
                                <p className="text-xs text-green-600">
                                  {formatCompletionComment(offer.comments)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-blue-600">
                            ID: {offer.id}
                          </span>
                          <span className="text-xs text-blue-600">
                            {new Date(offer.created_at).toLocaleDateString('es-GT')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  {/* Edit button - only show when no transporter has accepted the shipment */}
                  {!selectedShipment.acceptedOffer && (
                    <Button variant="outline" onClick={() => openEditShipment(selectedShipment)}>Editar</Button>
                  )}
                  <Button onClick={() => setIsShipmentDetailsOpen(false)}>Cerrar</Button>
                </div>
              </div>
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
        {/* Edit Shipment Dialog */}
        <Dialog open={isEditShipmentOpen} onOpenChange={setIsEditShipmentOpen}>
          <DialogContent className="sm:max-w-[780px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Envío</DialogTitle>
              <DialogDescription>Actualiza los datos principales del envío.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Título</label>
                  <Input value={editForm.title || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Tipo de Carga</label>
                  <Select value={editForm.cargo_type || 'general'} onValueChange={(value) => setEditForm((p: any) => ({ ...p, cargo_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>
                <div>
                  <label className="text-sm">Origen</label>
                  <Input value={editForm.origin_address || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, origin_address: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Destino</label>
                  <Input value={editForm.destination_address || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, destination_address: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Peso (kg)</label>
                  <Input type="number" value={editForm.weight || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, weight: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Volumen (m³)</label>
                  <Input type="number" step="0.01" value={editForm.volume || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, volume: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Estado</label>
                  <Select value={editForm.status || 'pending'} onValueChange={(value) => setEditForm((p: any) => ({ ...p, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="booked">Reservado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Precio Estimado (Q)</label>
                  <Input type="number" value={editForm.estimated_price || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, estimated_price: e.target.value }))} />
                </div>
              </div>

              {/* Dates & Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Fecha de Recogida</label>
                  <Input type="date" value={editForm.pickup_date ? new Date(editForm.pickup_date).toISOString().slice(0,10) : ''}
                         onChange={(e) => setEditForm((p: any) => ({ ...p, pickup_date: e.target.value ? new Date(e.target.value) : null }))} />
                </div>
                <div>
                  <label className="text-sm">Fecha de Entrega</label>
                  <Input type="date" value={editForm.delivery_date ? new Date(editForm.delivery_date).toISOString().slice(0,10) : ''}
                         onChange={(e) => setEditForm((p: any) => ({ ...p, delivery_date: e.target.value ? new Date(e.target.value) : null }))} />
                </div>
                <div>
                  <label className="text-sm">Hora de Recogida</label>
                  <Input type="time" value={editForm.pickup_time || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, pickup_time: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Hora de Entrega</label>
                  <Input type="time" value={editForm.delivery_time || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, delivery_time: e.target.value }))} />
                </div>
              </div>

              {/* Dimensions & Pieces */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm">Largo (cm)</label>
                  <Input type="number" value={editForm.dimensions_length || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, dimensions_length: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Ancho (cm)</label>
                  <Input type="number" value={editForm.dimensions_width || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, dimensions_width: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Alto (cm)</label>
                  <Input type="number" value={editForm.dimensions_height || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, dimensions_height: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Piezas</label>
                  <Input type="number" value={editForm.pieces || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, pieces: e.target.value }))} />
                </div>
              </div>

              {/* Packaging & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm">Empaque</label>
                  <Select value={editForm.packaging || 'standard'} onValueChange={(value) => setEditForm((p: any) => ({ ...p, packaging: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona empaque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar</SelectItem>
                      <SelectItem value="wooden">Cajas de Madera</SelectItem>
                      <SelectItem value="plastic">Plástico</SelectItem>
                      <SelectItem value="metal">Metálico</SelectItem>
                      <SelectItem value="pallets">Pallets</SelectItem>
                      <SelectItem value="crates">Jaulas</SelectItem>
                      <SelectItem value="bags">Bolsas</SelectItem>
                      <SelectItem value="rolls">Rollos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Seguro (Q)</label>
                  <Input type="number" value={editForm.insurance_value || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, insurance_value: e.target.value }))} />
                </div>
                <div className="flex items-end gap-2">
                  <input id="customs" type="checkbox" checked={!!editForm.customs} onChange={(e) => setEditForm((p:any)=>({...p, customs: e.target.checked}))} className="h-4 w-4" />
                  <label htmlFor="customs" className="text-sm">Requiere Aduana</label>
                </div>
              </div>
              <div>
                <label className="text-sm">Requerimientos Especiales</label>
                <Textarea value={editForm.special_requirements || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, special_requirements: e.target.value }))} />
              </div>

              {/* Instructions & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Instrucciones de Recogida</label>
                  <Input value={editForm.pickup_instructions || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, pickup_instructions: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Instrucciones de Entrega</label>
                  <Input value={editForm.delivery_instructions || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, delivery_instructions: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Persona de Contacto</label>
                  <Input value={editForm.contact_person || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, contact_person: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Teléfono</label>
                  <Input value={editForm.contact_phone || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, contact_phone: e.target.value }))} />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm">Prioridad</label>
                  <Select value={editForm.priority || 'normal'} onValueChange={(value) => setEditForm((p: any) => ({ ...p, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Temperatura</label>
                  <Select value={editForm.temperature || 'ambient'} onValueChange={(value) => setEditForm((p: any) => ({ ...p, temperature: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona temperatura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambient">Ambiente</SelectItem>
                      <SelectItem value="refrigerated">Refrigerado</SelectItem>
                      <SelectItem value="frozen">Congelado</SelectItem>
                      <SelectItem value="controlled">Controlado</SelectItem>
                      <SelectItem value="dry">Seco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Humedad</label>
                  <Select value={editForm.humidity || 'standard'} onValueChange={(value) => setEditForm((p: any) => ({ ...p, humidity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona humedad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="controlled">Controlada</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm">Pickup Lat</label>
                  <Input type="number" step="0.000001" value={editForm.pickup_lat || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, pickup_lat: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Pickup Lng</label>
                  <Input type="number" step="0.000001" value={editForm.pickup_lng || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, pickup_lng: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Delivery Lat</label>
                  <Input type="number" step="0.000001" value={editForm.delivery_lat || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, delivery_lat: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm">Delivery Lng</label>
                  <Input type="number" step="0.000001" value={editForm.delivery_lng || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, delivery_lng: e.target.value }))} />
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="text-sm">Documentos (separados por coma)</label>
                <Input value={editForm.documents_text || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, documents_text: e.target.value }))} />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm">Descripción</label>
                <Textarea value={editForm.description || ''} onChange={(e) => setEditForm((p: any) => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditShipmentOpen(false)}>Cancelar</Button>
                <Button onClick={handleUpdateShipment}>Guardar Cambios</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reject Quote Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rechazar Oferta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres rechazar esta oferta? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Oferta a rechazar:</h4>
              <p className="text-sm text-gray-600">
                <strong>Transportista:</strong> {selectedQuote.transporterName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Precio:</strong> Q{selectedQuote.amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Ruta:</strong> {selectedQuote.originAddress} → {selectedQuote.destinationAddress}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmRejectQuote}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rechazar Oferta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres proceder con el pago? Esta acción marcará la oferta como pagada.
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2 text-blue-900">Detalles del Pago:</h4>
              <p className="text-sm text-blue-800">
                <strong>Transportista:</strong> {selectedQuote.transporterName}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Monto:</strong> Q{selectedQuote.amount}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Envió:</strong> {selectedQuote.shipment?.title || 'Sin título'}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Ruta:</strong> {selectedQuote.shipment?.origin_address || 'N/A'} → {selectedQuote.shipment?.destination_address || 'N/A'}
              </p>
              
              {/* Billing Information */}
              {profile && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h5 className="font-medium mb-2 text-blue-900">Información de Facturación:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p className="text-blue-800">
                      <strong>Método:</strong> Tarjeta
                    </p>
                    {profile.billing_company_name && (
                      <p className="text-blue-800">
                        <strong>Empresa:</strong> {profile.billing_company_name}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={async () => {
                if (selectedQuote) {
                  await handleProceedToPayment(selectedQuote);
                  setIsPaymentDialogOpen(false);
                }
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Confirmar Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Request Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Solicitar Cotización</DialogTitle>
            <DialogDescription>
              Solicita una cotización para esta ruta específica
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Detalles de la Ruta:</h5>
                <p className="text-sm"><strong>Ruta:</strong> {selectedRoute.originAddress} → {selectedRoute.destinationAddress}</p>
                <p className="text-sm"><strong>Transportista:</strong> {selectedRoute.transporterName}</p>
                <p className="text-sm"><strong>Salida:</strong> {new Date(selectedRoute.departureDate).toLocaleDateString('es-GT')}</p>
                <p className="text-sm"><strong>Capacidad:</strong> {selectedRoute.availableCapacity} kg</p>
              </div>
              <p className="text-sm text-gray-600">
                Para solicitar una cotización en esta ruta, crea un envío que coincida con estos detalles.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => navigate('/shipment-form')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Envío
                </Button>
                <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transporter Quote Request Dialog */}
      <Dialog open={isTransporterQuoteDialogOpen} onOpenChange={setIsTransporterQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Solicitar Cotización a Transportista</DialogTitle>
            <DialogDescription>
              Selecciona uno de tus envíos pendientes para solicitar una cotización a este transportista
            </DialogDescription>
          </DialogHeader>
          {selectedTransporterForQuote && (
            <div className="space-y-4">
              {/* Transporter Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2 text-blue-800">Transportista Seleccionado:</h5>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{selectedTransporterForQuote.rating}</span>
                    <span className="text-sm text-gray-500">({selectedTransporterForQuote.totalRatings} reseñas)</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">{selectedTransporterForQuote.name}</p>
                    <p className="text-sm text-blue-600">{selectedTransporterForQuote.company || 'Transportista independiente'}</p>
                  </div>
                </div>
              </div>

              {/* Available Shipments */}
              <div>
                <h5 className="font-medium mb-3">Selecciona un Envío:</h5>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {shipments.filter(shipment => shipment.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No tienes envíos pendientes</p>
                      <p className="text-sm">Crea un envío primero para solicitar cotizaciones</p>
                      <Button 
                        className="mt-3" 
                        onClick={() => {
                          setIsTransporterQuoteDialogOpen(false);
                          navigate('/shipment-form');
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Envío
                      </Button>
                    </div>
                  ) : (
                    shipments
                      .filter(shipment => shipment.status === 'pending')
                      .map((shipment) => (
                        <div 
                          key={shipment.id} 
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleSendQuoteRequest(shipment)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{shipment.title}</h6>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {shipment.originAddress} → {shipment.destinationAddress}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {shipment.weight} kg
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(shipment.pickupDate).toLocaleDateString('es-GT')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Tipo: {shipment.cargoType} • Precio estimado: Q {shipment.estimatedPrice?.toLocaleString() || 'No especificado'}
                              </p>
                            </div>
                            <Button size="sm" className="ml-3">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Cotizar
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsTransporterQuoteDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Quote Action Confirmation Dialog */}
      <Dialog open={isQuoteActionDialogOpen} onOpenChange={setIsQuoteActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQuoteAction?.action === 'accepted' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Aceptar Cotización
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Rechazar Cotización
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedQuoteAction?.action === 'accepted' 
                ? '¿Estás seguro de que quieres aceptar esta cotización? Esta acción no se puede deshacer.'
                : '¿Estás seguro de que quieres rechazar esta cotización?'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuoteAction && (
            <div className="space-y-4">
              {/* Quote Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-gray-900">{selectedQuoteAction.request.shipment?.title || 'Sin título'}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Transportista:</span>
                    <p className="font-medium">{selectedQuoteAction.request.transporter?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Monto:</span>
                    <p className="font-medium text-green-600">
                      Q {selectedQuoteAction.request.responseAmount?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
                {selectedQuoteAction.request.responseMessage && (
                  <div>
                    <span className="text-gray-500 text-sm">Mensaje:</span>
                    <p className="text-sm">{selectedQuoteAction.request.responseMessage}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsQuoteActionDialogOpen(false);
                    setSelectedQuoteAction(null);
                  }}
                  disabled={isQuoteActionLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  className={selectedQuoteAction.action === 'accepted' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                  }
                  onClick={executeQuoteRequestAction}
                  disabled={isQuoteActionLoading}
                >
                  {isQuoteActionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      {selectedQuoteAction.action === 'accepted' ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aceptar
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transporter Profile Dialog - Available in all tabs */}
      {renderTransporterProfileDialog()}

      {/* Tracking Dialog */}
      {selectedShipmentForTracking && (
        <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Seguimiento en Tiempo Real - {selectedShipmentForTracking.title}
              </DialogTitle>
              <DialogDescription>
                Visualiza la ubicación en tiempo real de tu envío
              </DialogDescription>
            </DialogHeader>
            <ClientTrackingView shipmentId={selectedShipmentForTracking.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}