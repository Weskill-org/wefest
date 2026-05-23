import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Send, ShieldAlert, Sparkles, Loader2, 
  ArrowLeft, Building2, User, ChevronRight, Inbox, Lock, ArrowUpRight, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CompanyMessages() {
  const queryClient = useQueryClient();
  const searchParams = useSearch({ from: "/company/messages" }) as any;
  const initialPartnerId = searchParams?.partnerId || null;
  const initialEventId = searchParams?.eventId || null;

  const [activePartnerId, setActivePartnerId] = useState<string | null>(initialPartnerId);
  const [activeEventId, setActiveEventId] = useState<string | null>(initialEventId);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMessaging, setIsMessaging] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Fetch current user
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  });

  // Fetch subscription status
  const { data: subscription, isLoading: loadingSub } = useQuery({
    queryKey: ["my-subscription", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    }
  });

  // Fetch active proposals (accepted sponsorships) to allow new direct messages
  const { data: proposals } = useQuery({
    queryKey: ["my-proposals", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_proposals")
        .select("*, event:event_id(*)")
        .eq("company_user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    }
  });

  const activeProposals = proposals?.filter(p => p.status === 'accepted') || [];

  useEffect(() => {
    if (activeProposals.length > 0 && !selectedEventId) {
      setSelectedEventId(activeProposals[0].id);
    }
  }, [activeProposals, selectedEventId]);

  // Fetch all direct messages
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

  // Fetch profiles of all partners
  const { data: partners = [], isLoading: loadingPartners } = useQuery({
    queryKey: ["chat-partners", partnerIds],
    enabled: partnerIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", partnerIds);
      if (error) throw error;
      return data.map(p => ({
        id: p.user_id,
        full_name: p.full_name || "Organizer",
        email: p.email || ""
      })) as ChatPartner[];
    }
  });

  // Setup Supabase Realtime Subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-direct-messages")
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
          // Invalidate layout notifications if needed
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

  // Determine user state
  const isFreePlan = !subscription || subscription.plan_type === "Free";

  if (loadingUser || loadingSub) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Paywall lock screen if user is on free plan
  if (isFreePlan) {
    return (
      <div className="flex min-h-[85vh] flex-col items-center justify-center p-4">
        <div className="relative max-w-lg w-full bg-card/45 backdrop-blur-xl border border-border/40 rounded-3xl p-8 md:p-10 shadow-2xl text-center overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 bg-fuchsia-500/10 rounded-full blur-3xl" />

          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-fuchsia-500 flex items-center justify-center shadow-glow mb-6">
            <Lock className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-4 text-foreground bg-gradient-to-r from-white via-white to-muted-foreground bg-clip-text text-transparent">
            Direct Messaging with Organizers
          </h1>
          <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
            Real-time chat is exclusive to paid partners. Upgrade to a <strong className="text-foreground">Growth</strong> or <strong className="text-foreground">Enterprise</strong> plan to connect directly with college festival organizers, clarify proposal terms, customize sponsor packages, and close sponsorship agreements instantly.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-xl font-bold bg-brand-gradient hover:opacity-90 shadow-glow" asChild>
              <Link to="/company/settings">
                Upgrade Plan <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl font-bold border-border/80" asChild>
              <Link to="/company">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render chat workspace
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
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Messages
            </h2>
            <Dialog open={isMessaging} onOpenChange={setIsMessaging}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-white/10 rounded-[28px] max-w-md bg-background/80 backdrop-blur-2xl text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
                    Message Organizer
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
                    Start a direct conversation with the event coordination team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-4">
                  {activeProposals.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Event</label>
                        <select 
                          value={selectedEventId}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                        >
                          {activeProposals.map((p: any) => (
                            <option key={p.id} value={p.id} className="bg-background text-foreground">
                              {p.event?.title || "Event"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</label>
                        <textarea 
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm min-h-[120px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all leading-relaxed" 
                          placeholder="Inquire about booth placement, extra passes, or marketing opportunities..."
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 border border-white/5 rounded-2xl bg-white/5 space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        You can chat directly with organizers of college festivals where you have an <strong className="text-foreground">accepted sponsorship proposal</strong>.
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/95 text-xs font-bold rounded-xl" asChild>
                        <Link to="/company/marketplace">Browse Festivals</Link>
                      </Button>
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-2 sm:gap-0 mt-2">
                  <Button variant="outline" onClick={() => {
                    setIsMessaging(false);
                    setMessageText("");
                  }} className="rounded-xl border-white/10 hover:bg-white/5 transition-all text-xs font-bold">
                    Cancel
                  </Button>
                  {activeProposals.length > 0 && (
                    <Button 
                      className="bg-brand-gradient text-white rounded-xl shadow-glow hover:shadow-glow-lg transition-all text-xs font-black" 
                      disabled={!messageText.trim() || isSending}
                      onClick={async () => {
                        if (!user?.id) {
                          toast.error("You must be logged in.");
                          return;
                        }
                        if (!selectedEventId) {
                          toast.error("Please select an event.");
                          return;
                        }
                        const selectedProposal = activeProposals.find(p => p.id === selectedEventId);
                        const organizerId = selectedProposal?.event?.organizer_user_id;
                        const eventId = selectedProposal?.event?.id;

                        if (!organizerId) {
                          toast.error("Could not find organizer for this event.");
                          return;
                        }

                        setIsSending(true);
                        const { error } = await supabase
                          .from("direct_messages")
                          .insert({
                            sender_id: user.id,
                            receiver_id: organizerId,
                            message: messageText,
                            event_id: eventId
                          });

                        setIsSending(true);
                        if (error) {
                          toast.error("Failed to send message: " + error.message);
                        } else {
                          toast.success("Message sent!");
                          setIsMessaging(false);
                          setMessageText("");
                          setActivePartnerId(organizerId);
                          setActiveEventId(eventId);
                          queryClient.invalidateQueries({ queryKey: ["direct-messages", user.id] });
                        }
                      }}
                    >
                      {isSending ? "Sending..." : "Send Inquiry"}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {partners.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <Inbox className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No messages yet</p>
                  <p className="text-[10px] opacity-75 mt-1">Click the "+" button at the top to initiate a chat with organizers of your accepted sponsorship proposals.</p>
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
                          {partner.full_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm truncate text-foreground">{partner.full_name}</span>
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
                    {activePartner.full_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold truncate">{activePartner.full_name}</h3>
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
                              {activePartner.full_name.substring(0, 2).toUpperCase()}
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
              <h3 className="text-lg font-bold text-foreground mb-1">Select a conversation</h3>
              <p className="text-sm max-w-sm">Choose an organizer from the sidebar to view thread history and start messaging.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export const Route = createFileRoute("/company/messages")({
  component: CompanyMessages,
});
