'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const ParentProfile = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const result = await response.json();
      if (result.success) {
        const user = result.data.user;
        setFormData({
          prenom: user.firstName || '',
          nom: user.lastName || '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'تم الحفظ',
          description: 'تم تحديث معلومات الملف الشخصي',
        });
      } else {
        toast({
          title: 'خطأ',
          description: result.error || 'فشل حفظ التغييرات',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الحفظ',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = `${formData.prenom} ${formData.nom}`;
  const userInitial = formData.prenom.charAt(0) || 'P';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user?.image || ''} alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <Button variant="outline">تغيير الصورة</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent-prenom">الاسم الأول</Label>
              <Input 
                id="parent-prenom" 
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-nom">الاسم الأخير</Label>
              <Input 
                id="parent-nom" 
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent-email">البريد الإلكتروني</Label>
            <Input 
              id="parent-email" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              <Save className="ml-2 h-4 w-4" />
              <span>حفظ التغييرات</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentProfile;
