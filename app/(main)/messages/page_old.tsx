'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Send, Loader2, MessageSquare, Inbox } from "lucide-react";
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

type Partner = {
  id: string;
  name: string;
  image: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const recipientIdFromQuery = searchParams.get('recipient');
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (recipientIdFromQuery && messages.length > 0) {
      setSelectedPartnerId(recipientIdFromQuery);
    }
  }, [recipientIdFromQuery, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversation]);
  }, [recipientIdFromQuery, allPartners.length, selectedPartnerId]);

  const selectedPartner = Array.isArray(users) ? users.find(u => u.id === selectedPartnerId) : undefined;
  
  const conversationMessages = Array.isArray(messages) ? messages.filter(m => {
    return (
      (m.senderId === currentUserId && m.recipientId === selectedPartnerId) ||
      (m.senderId === selectedPartnerId && m.recipientId === currentUserId)
    );
  }).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()) : [];

  // Mark unread messages as read
  useEffect(() => {
    conversationMessages
      .filter(m => m.recipientId === currentUserId && !m.isRead)
      .forEach(m => markAsRead(m.id));
  }, [conversationMessages, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedPartnerId) return;

    setIsSending(true);
    const result = await sendMessage({
      recipientId: selectedPartnerId,
      subject: 'رسالة جديدة',
      body: messageText,
    });

    if (result.success) {
      setMessageText('');
    } else {
      toast({
        title: 'خطأ',
        description: result.error || 'فشل إرسال الرسالة',
        variant: 'destructive',
      });
    }
    setIsSending(false);
  };

  const roleName = (role?: string) => {
    if (!role) return '';
    const roles: Record<string, string> = {
      teacher: 'معلم',
      student: 'طالب',
      parent: 'ولي أمر',
      directeur: 'مدير',
      supervisor_specific: 'مشرف مادة',
    };
    return roles[role] || 'مستخدم';
  };

  if (messagesLoading) {
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

  if (allPartners.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center h-[calc(100vh-5rem)]">
        <div className="grid gap-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight">الرسائل</h1>
          <p className="text-muted-foreground">
            لا توجد لديك أي محادثات حالياً.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
        <div className="flex items-center px-4 py-3 border-b">
            <h1 className="text-xl font-bold">الرسائل</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] h-full overflow-hidden">
            <div className="border-l flex flex-col">
                <div className="p-4">
                     <Input placeholder="البحث في الرسائل..."/>
                </div>
                <Separator />
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-0 p-2">
                        {allPartners.map((partner) => {
                            const partnerMessages = messages.filter(m =>
                              m.senderId === partner!.id || m.recipientId === partner!.id
                            );
                            const lastMessage = partnerMessages[0];
                            const unreadCount = partnerMessages.filter(
                              m => m.recipientId === currentUserId && !m.isRead
                            ).length;
                            
                            return (
                                <button
                                    key={partner!.id}
                                    onClick={() => setSelectedPartnerId(partner!.id)}
                                    className={cn(
                                        "flex flex-col items-start gap-2 rounded-lg border border-transparent p-3 text-left text-sm transition-all hover:bg-accent",
                                        partner!.id === selectedPartnerId && "bg-accent border-border"
                                    )}
                                >
                                    <div className="flex w-full items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={partner!.image || undefined} alt={partner!.name} />
                                            <AvatarFallback>{partner!.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 truncate">
                                            <div className="font-semibold">{partner!.name}</div>
                                            {lastMessage && (
                                              <div className="text-xs text-muted-foreground truncate">
                                                {lastMessage.body}
                                              </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {lastMessage && (
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(lastMessage.sentAt), { 
                                                      addSuffix: true, 
                                                      locale: ar 
                                                    })}
                                                </div>
                                            )}
                                            {unreadCount > 0 && (
                                                <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
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

            {selectedPartner ? (
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 p-4 border-b">
                        <Avatar>
                            <AvatarImage src={selectedPartner.image || undefined} alt={selectedPartner.name} />
                            <AvatarFallback>{selectedPartner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{selectedPartner.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {roleName(selectedPartner.role)}
                            </div>
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                            {conversationMessages.map(message => {
                                const isMe = message.senderId === currentUserId;
                                const author = isMe 
                                  ? users.find(u => u.id === currentUserId) 
                                  : selectedPartner;
                                return (
                                    <div 
                                      key={message.id} 
                                      className={cn(
                                        "flex items-end gap-3", 
                                        isMe ? "justify-end" : "justify-start"
                                      )}
                                    >
                                        {!isMe && 
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={author?.image || undefined} />
                                                <AvatarFallback>
                                                  {author?.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        }
                                        <div className={cn(
                                          "max-w-lg rounded-lg p-3", 
                                          isMe 
                                            ? "bg-primary text-primary-foreground" 
                                            : "bg-muted"
                                        )}>
                                            <p className="leading-relaxed">{message.body}</p>
                                            <p className={cn(
                                              "text-xs mt-2 text-right", 
                                              isMe 
                                                ? "text-primary-foreground/70" 
                                                : "text-muted-foreground"
                                            )}>
                                                {formatDistanceToNow(
                                                  new Date(message.sentAt), 
                                                  { addSuffix: true, locale: ar }
                                                )}
                                            </p>
                                        </div>
                                        {isMe && 
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={author?.image || undefined} />
                                                <AvatarFallback>
                                                  {author?.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        }
                                    </div>
                                )
                            })}
                            {conversationMessages.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    <p>ابدأ محادثة مع {selectedPartner.name}.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background">
                        <form onSubmit={handleSendMessage}>
                            <div className="relative">
                                <Textarea 
                                  placeholder="اكتب رسالتك..." 
                                  className="pr-16" 
                                  rows={1}
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                  disabled={isSending}
                                />
                                <Button 
                                  type="submit" 
                                  size="icon" 
                                  className="absolute left-3 top-1/2 -translate-y-1/2"
                                  disabled={isSending || !messageText.trim()}
                                >
                                    {isSending ? (
                                      <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                      <Send className="h-5 w-5" />
                                    )}
                                    <span className="sr-only">إرسال</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <p>اختر محادثة لعرض الرسائل.</p>
                </div>
            )}
        </div>
    </div>
  );
}

    