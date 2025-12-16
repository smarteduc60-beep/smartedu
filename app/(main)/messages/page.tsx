'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Send, Loader2, Inbox, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: number;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const recipientIdFromQuery = searchParams.get('recipient');
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/messages');
      const result = await response.json();
      if (result.success) {
        setMessages(result.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique partners
  const partners = Array.from(
    new Map(
      messages.map((m) => {
        const partnerId = m.senderId === currentUserId ? m.recipientId : m.senderId;
        const partner = m.senderId === currentUserId ? m.recipient : m.sender;
        return [partnerId, partner];
      })
    ).values()
  ).map((partner) => ({
    id: partner.id,
    name: `${partner.firstName} ${partner.lastName}`,
    image: partner.image,
  }));

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId);

  const selectedConversation = messages
    .filter(
      (m) =>
        (m.senderId === currentUserId && m.recipientId === selectedPartnerId) ||
        (m.senderId === selectedPartnerId && m.recipientId === currentUserId)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Mark unread messages as read when viewing conversation
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessages = selectedConversation.filter(
        (m) => m.recipientId === currentUserId && !m.isRead
      );
      
      if (unreadMessages.length > 0) {
        try {
          await Promise.all(
            unreadMessages.map((m) =>
              fetch(`/api/messages/${m.id}/read`, { method: 'POST' })
            )
          );
          // Update local state immediately
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              unreadMessages.find(um => um.id === msg.id)
                ? { ...msg, isRead: true }
                : msg
            )
          );
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    if (selectedPartnerId && selectedConversation.length > 0) {
      markMessagesAsRead();
    }
  }, [selectedPartnerId, selectedConversation.length]);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (recipientIdFromQuery) {
      setSelectedPartnerId(recipientIdFromQuery);
    } else if (partners.length > 0 && !selectedPartnerId) {
      setSelectedPartnerId(partners[0].id);
    }
  }, [recipientIdFromQuery, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversation.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedPartnerId) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedPartnerId,
          subject: 'رسالة جديدة',
          content: messageText,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessageText('');
        await fetchMessages(); // Refresh messages
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إرسال الرسالة',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <p className="text-muted-foreground">الرجاء تسجيل الدخول</p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center h-[calc(100vh-5rem)]">
        <Inbox className="h-16 w-16 text-muted-foreground" />
        <div className="grid gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">لا توجد رسائل</h1>
          <p className="text-muted-foreground">
            لا توجد لديك أي محادثات حالياً
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <h1 className="text-xl font-bold">الرسائل</h1>
        {session?.user?.role === 'directeur' && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              window.location.href = '/dashboard/directeur/broadcast';
            }}
          >
            <MessageSquare className="ml-2 h-4 w-4" />
            رسالة جماعية
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] flex-1 min-h-0 overflow-hidden">
        {/* Partners List */}
        <div className="border-l flex flex-col bg-muted/30">
          <div className="p-3">
            <Input placeholder="البحث في الرسائل..." className="bg-background" />
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-0 p-2">
              {partners.map((partner) => {
                const partnerMessages = messages.filter(
                  (m) => m.senderId === partner.id || m.recipientId === partner.id
                );
                const lastMessage = partnerMessages[partnerMessages.length - 1];
                const unreadCount = partnerMessages.filter(
                  (m) => m.recipientId === currentUserId && !m.isRead
                ).length;

                return (
                  <button
                    key={partner.id}
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border border-transparent p-3 text-right transition-all hover:bg-accent",
                      partner.id === selectedPartnerId && "bg-accent border-border"
                    )}
                  >
                    <div className="flex w-full items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={partner.image || undefined} alt={partner.name} />
                        <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate text-right">
                        <div className="font-semibold">{partner.name}</div>
                        {lastMessage && (
                          <div className="text-xs text-muted-foreground truncate">
                            {lastMessage.content}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {lastMessage && (
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(lastMessage.createdAt), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </div>
                        )}
                        {unreadCount > 0 && (
                          <div className="bg-destructive text-destructive-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                            {unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Conversation */}
        {selectedPartner ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedPartner.image || undefined} alt={selectedPartner.name} />
                <AvatarFallback>{selectedPartner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{selectedPartner.name}</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
              <div className="space-y-4 min-h-full">
                {selectedConversation.map((message) => {
                  const isMe = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-end gap-2",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isMe && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={selectedPartner.image || undefined} />
                          <AvatarFallback>{selectedPartner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            isMe
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </p>
                      </div>
                      {isMe && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={session?.user?.image || undefined} />
                          <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                {selectedConversation.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <p>ابدأ محادثة مع {selectedPartner.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                <Textarea
                  placeholder="اكتب رسالتك..."
                  className="resize-none flex-1"
                  rows={2}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button type="submit" size="icon" className="h-10 w-10" disabled={isSending || !messageText.trim()}>
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>اختر محادثة للبدء</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
