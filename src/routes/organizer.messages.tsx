import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Send, Loader2, ArrowLeft, Inbox, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organizer/messages")({
  component: OrganizerMessages,
});

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  event_id?: string | null;
}

interface CompanyPartner {
  id: string;
  company_name: string;
  email: string;
  industry?: string | null;
}

function OrganizerMessages() {
  const queryClient = useQueryClient();
  const searchParams = useSearch({ from: "/organizer/messages" }) as any;
  const initialPartnerId = searchParams?.partnerId || null;
  const initialEventId = searchParams?.eventId || null;

  const [activePartnerId, setActivePartnerId] = useState<string | null>(initialPartnerId);
  const [activeEventId, setActiveEventId] = useState<string | null>(initialEventId);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  // Fetch all direct messages for the organizer
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ["direct-messages", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as DirectMessage[];
    }
  });

  // Unique partner IDs from messages
  const partnerIds = Array.from(new Set(
    messages.map(m => m.sender_id === user?.id ? m.receiver_id : m.sender_id)
  ));

  // If a partnerId was passed via query param and isn't in history yet, add it
  if (initialPartnerId && !partnerIds.includes(initialPartnerId)) {
    partnerIds.push(initialPartnerId);
  }

  // Fetch company profiles and fallback emails of all partners
  const { data: partners = [], isLoading: loadingPartners } = useQuery({
    queryKey: ["company-partners", partnerIds],
    enabled: partnerIds.length > 0,
    queryFn: async () => {
      // Get company profiles
      const { data: companies, error: compErr } = await supabase
        .from("company_profiles")
        .select("user_id, company_name, industry")
        .in("user_id", partnerIds);
      if (compErr) throw compErr;

      // Get standard profiles for email fallback
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("user_id, email")
        .in("user_id", partnerIds);
      if (profErr) throw profErr;

      return partnerIds.map(id => {
        const company = companies?.find(c => c.user_id === id);
        const profile = profiles?.find(p => p.user_id === id);
        return {
          id,
          company_name: company?.company_name || "Sponsor Partner",
          email: profile?.email || "",
          industry: company?.industry || ""
        } as CompanyPartner;
      });
    }
  });

  // Setup Supabase Realtime Subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-organizer-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `sender_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["direct-messages", user.id] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["direct-messages", user.id] });
          queryClient.invalidateQueries({ queryKey: ["organizer-unread-alerts-count"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activePartnerId]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id || !activePartnerId) return;
      const { data, error } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: user.id,
          receiver_id: activePartnerId,
          message: messageText,
          event_id: activeEventId
        })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["direct-messages", user?.id] });
    },
    onError: (err: any) => {
      toast.error("Failed to send message: " + err.message);
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  if (loadingUser || (partnerIds.length > 0 && loadingPartners)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePartner = partners.find(p => p.id === activePartnerId);
  const activeChatMessages = messages.filter(
    m => (m.sender_id === user?.id && m.receiver_id === activePartnerId) || 
         (m.sender_id === activePartnerId && m.receiver_id === user?.id)
  );

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      <div className="flex w-full flex-row">
        
        {/* Conversations Sidebar */}
        <div className={cn(
          "flex w-full flex-col border-r border-border/40 bg-card/20 md:w-[320px] shrink-0",
          activePartnerId && "hidden md:flex"
        )}>
          <div className="p-4 border-b border-border/40">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Direct Chats
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {partners.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <Inbox className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No direct messages</p>
                  <p className="text-[10px] opacity-75 mt-1">Companies on premium plans will contact you directly from dashboard inquiries.</p>
                </div>
              ) : (
                partners.map(partner => {
                  const lastMsg = [...messages]
                    .reverse()
                    .find(m => (m.sender_id === partner.id) || (m.receiver_id === partner.id));
                  const unreadCount = messages.filter(
                    m => m.sender_id === partner.id && m.receiver_id === user?.id && !m.is_read
                  ).length;

                  return (
                    <button
                      key={partner.id}
                      onClick={() => {
                        setActivePartnerId(partner.id);
                        // Mark as read
                        supabase
                          .from("direct_messages")
                          .update({ is_read: true })
                          .eq("sender_id", partner.id)
                          .eq("receiver_id", user!.id)
                          .then(() => {
                            queryClient.invalidateQueries({ queryKey: ["direct-messages", user!.id] });
                          });
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200",
                        activePartnerId === partner.id 
                          ? "bg-primary/10 border border-primary/20 text-foreground" 
                          : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {partner.company_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm truncate text-foreground">{partner.company_name}</span>
                          {unreadCount > 0 && (
                            <span className="h-4 min-w-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center px-1">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs truncate opacity-75 mt-0.5">
                          {lastMsg ? lastMsg.message : "Start chatting..."}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col bg-background",
          !activePartnerId && "hidden md:flex"
        )}>
          {activePartner ? (
            <>
              {/* Active Chat Header */}
              <div className="flex h-16 items-center gap-3 border-b border-border/40 px-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden rounded-lg"
                  onClick={() => setActivePartnerId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activePartner.company_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold truncate flex items-center gap-1.5">
                    {activePartner.company_name}
                    {activePartner.industry && (
                      <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                        {activePartner.industry}
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate">{activePartner.email}</p>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeChatMessages.map(msg => {
                    const isSelf = msg.sender_id === user?.id;
                    return (
                      <div 
                        key={msg.id}
                        className={cn(
                          "flex w-full items-end gap-2",
                          isSelf ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isSelf && (
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-black">
                              {activePartner.company_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-md",
                          isSelf 
                            ? "bg-gradient-to-tr from-primary to-fuchsia-500 text-white rounded-br-none" 
                            : "bg-card border border-border/40 text-foreground rounded-bl-none"
                        )}>
                          <p className="leading-relaxed break-words">{msg.message}</p>
                          <span className="block text-[8px] opacity-75 text-right mt-1.5 font-medium">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-border/40 bg-card/10 flex items-center gap-2">
                <Input 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-xl bg-brand-gradient hover:opacity-95 shadow-glow"
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <MessageSquare className="h-16 w-16 mb-4 text-primary/20 animate-pulse" />
              <h3 className="text-lg font-bold text-foreground mb-1">Select a Sponsor</h3>
              <p className="text-sm max-w-sm">Choose a company from the sidebar to view thread history and message them.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
