import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MapPin, Package, Clock, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  shipment_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
  currentUser: any;
}

export default function ChatDialog({ isOpen, onClose, shipment, currentUser }: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && shipment) {
      loadMessages();
      loadOtherUser();
    }
  }, [isOpen, shipment]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!isOpen || !shipment) return;

    const channel = supabase
      .channel(`chat_${shipment.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `shipment_id=eq.${shipment.id}`,
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Get sender profile for the new message
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('full_name, profile_picture_url')
            .eq('user_id', newMessage.sender_id)
            .single();

          const { data: transporterProfile } = await supabase
            .from('transporter_profiles')
            .select('full_name, profile_picture_url')
            .eq('user_id', newMessage.sender_id)
            .single();

          const profile = clientProfile || transporterProfile;
          const messageWithProfile = {
            ...newMessage,
            sender_name: profile?.full_name || 'Usuario',
            sender_avatar: profile?.profile_picture_url || null,
          };

          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, messageWithProfile];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, shipment]);

  const loadMessages = async () => {
    if (!shipment) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender names from profiles
      const messagesWithNames = await Promise.all(
        data.map(async (msg) => {
          // Try client profile first
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('full_name, profile_picture_url')
            .eq('user_id', msg.sender_id)
            .single();

          // Try transporter profile if client profile not found
          const { data: transporterProfile } = await supabase
            .from('transporter_profiles')
            .select('full_name, profile_picture_url')
            .eq('user_id', msg.sender_id)
            .single();

          const profile = clientProfile || transporterProfile;

          return {
            ...msg,
            sender_name: profile?.full_name || 'Usuario',
            sender_avatar: profile?.profile_picture_url || null,
          };
        })
      );

      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOtherUser = async () => {
    if (!shipment || !user?.id) return;

    try {
      // Always use the acceptedOffer data since it contains both client and transporter info
      if (shipment.acceptedOffer && shipment.acceptedOffer.transporter_user_id) {
        // Determine who the other user is
        const isCurrentUserTransporter = user.id === shipment.acceptedOffer.transporter_user_id;
        
        if (isCurrentUserTransporter) {
          // Current user is transporter, so other user is the client
          if (shipment.user_id) {
            // Get client profile
            const { data: clientProfile } = await supabase
              .from('client_profiles')
              .select('full_name, profile_picture_url')
              .eq('user_id', shipment.user_id)
              .single();

            const otherUserData = {
              id: shipment.user_id,
              name: clientProfile?.full_name || 'Cliente',
              avatar: clientProfile?.profile_picture_url || null,
            };
            
            setOtherUser(otherUserData);
          }
        } else {
          // Current user is client, so other user is the transporter
          // Get transporter profile with error handling
          try {
            const { data: transporterProfile, error: profileError } = await supabase
              .from('transporter_profiles')
              .select('full_name, profile_picture_url')
              .eq('user_id', shipment.acceptedOffer.transporter_user_id)
              .single();

            if (profileError) {
              console.warn('Could not load transporter profile, using fallback data:', profileError);
            }

            const otherUserData = {
              id: shipment.acceptedOffer.transporter_user_id,
              name: transporterProfile?.full_name || shipment.acceptedOffer.transporter_name || 'Transportista',
              avatar: transporterProfile?.profile_picture_url || null,
            };
            
            setOtherUser(otherUserData);
          } catch (error) {
            console.warn('Error loading transporter profile, using fallback:', error);
            // Use fallback data from the offer
            const otherUserData = {
              id: shipment.acceptedOffer.transporter_user_id,
              name: shipment.acceptedOffer.transporter_name || 'Transportista',
              avatar: null,
            };
            
            setOtherUser(otherUserData);
          }
        }
      } else {
        // Fallback: if no acceptedOffer, try to determine from shipment data
        if (shipment.user_id) {
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('full_name, profile_picture_url')
            .eq('user_id', shipment.user_id)
            .single();

          const otherUserData = {
            id: shipment.user_id,
            name: clientProfile?.full_name || 'Usuario',
            avatar: clientProfile?.profile_picture_url || null,
          };
          
          setOtherUser(otherUserData);
        }
      }
    } catch (error) {
      console.error('Error loading other user:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !shipment || !user?.id) return;

    if (!otherUser) {
      await loadOtherUser();
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          shipment_id: shipment.id,
          sender_id: user.id,
          receiver_id: otherUser.id,
          message: newMessage.trim(),
          message_type: 'text',
        })
        .select()
        .single();

      if (error) throw error;

      // Add the message to the local state immediately for instant UI update
      if (data) {
        const newMessageWithProfile = {
          ...data,
          sender_name: 'Tú', // Current user's name
          sender_avatar: null,
        };
        setMessages(prev => [...prev, newMessageWithProfile]);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Chat del Envío</span>
            </div>
            {shipment && (
              <Badge variant="outline" className="text-xs">
                {shipment.title}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Comunicación en tiempo real con el transportista para coordinar el envío.
          </DialogDescription>
        </DialogHeader>

        {/* Shipment Info */}
        {shipment && (
          <div className="flex-shrink-0 bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={otherUser?.avatar} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {otherUser?.name || 'Cargando usuario...'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {shipment.origin_address} → {shipment.destination_address}
                  </p>
                  {!otherUser && (
                    <p className="text-xs text-orange-600">
                      ⚠️ No se pudo cargar la información del usuario
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay mensajes aún. ¡Inicia la conversación!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isOwn && (
                        <Avatar className="w-6 h-6 flex-shrink-0">
                          <AvatarImage src={message.sender_avatar} />
                          <AvatarFallback className="text-xs">
                            {message.sender_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(message.created_at)}
                          </span>
                          {isOwn && message.is_read && (
                            <span className="text-xs text-blue-600">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex-shrink-0 flex gap-2 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={!otherUser ? "Cargando información del usuario..." : "Escribe tu mensaje..."}
            disabled={sending || !otherUser}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending || !otherUser}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
