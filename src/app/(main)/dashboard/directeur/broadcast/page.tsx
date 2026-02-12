'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, ArrowRight } from "lucide-react";
import { useUsers } from "@/hooks";
import { Checkbox } from "@/components/ui/checkbox";

export default function BroadcastMessagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'role' | 'specific'>('role');
  const [selectedRole, setSelectedRole] = useState('student');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const { users } = useUsers();

  // Redirect if not directeur
  if (session?.user?.role !== 'directeur') {
    router.push('/messages');
    return null;
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: 'خطأ',
        description: 'الموضوع والمحتوى مطلوبان',
        variant: 'destructive',
      });
      return;
    }

    if (recipientType === 'specific' && selectedUserIds.length === 0) {
      toast({
        title: 'خطأ',
        description: 'يجب اختيار مستخدم واحد على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/messages/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          recipientRole: recipientType === 'role' ? selectedRole : recipientType === 'all' ? 'all' : undefined,
          recipientIds: recipientType === 'specific' ? selectedUserIds : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'نجح الإرسال',
          description: result.message || 'تم إرسال الرسائل بنجاح',
        });
        router.push('/messages');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل إرسال الرسائل',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight">رسالة جماعية</h1>
          <p className="text-muted-foreground">
            إرسال رسالة لمجموعة من المستخدمين أو للجميع
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/messages')}>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للرسائل
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الرسالة</CardTitle>
          <CardDescription>املأ تفاصيل الرسالة وحدد المستلمين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">الموضوع</Label>
            <Input
              id="subject"
              placeholder="موضوع الرسالة"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">المحتوى</Label>
            <Textarea
              id="content"
              placeholder="محتوى الرسالة..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label>المستلمون</Label>
            <Select
              value={recipientType}
              onValueChange={(value: any) => setRecipientType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المستلمين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستخدمين</SelectItem>
                <SelectItem value="role">مستخدمو دور معين</SelectItem>
                <SelectItem value="specific">مستخدمون محددون</SelectItem>
              </SelectContent>
            </Select>

            {recipientType === 'role' && (
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">الطلاب</SelectItem>
                  <SelectItem value="teacher">المعلمون</SelectItem>
                  <SelectItem value="parent">أولياء الأمور</SelectItem>
                  <SelectItem value="supervisor_specific">مشرفو المواد</SelectItem>
                  <SelectItem value="supervisor_general">المشرفون العامون</SelectItem>
                </SelectContent>
              </Select>
            )}

            {recipientType === 'specific' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">اختر المستخدمين</CardTitle>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={user.id}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <label
                        htmlFor={user.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {user.name} ({user.email})
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <Button
            onClick={handleSend}
            disabled={isSending}
            className="w-full"
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="ml-2 h-4 w-4" />
                إرسال الرسالة
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
