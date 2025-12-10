
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Brush, UserPlus, Info, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// Helper function to convert hex to HSL string
const hexToHsl = (hex: string): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export default function SettingsPage() {
    const { toast } = useToast();

    const [theme, setTheme] = useState({
        primary: '#3F51B5', // Deep blue
        background: '#E8EAF6', // Very light blue
        accent: '#7E57C2', // Purple
        font: 'Amiri',
    });

    useEffect(() => {
        // This effect runs on the client-side
        const root = document.documentElement;
        const body = document.body;

        try {
            const primaryHsl = hexToHsl(theme.primary);
            const backgroundHsl = hexToHsl(theme.background);
            const accentHsl = hexToHsl(theme.accent);

            root.style.setProperty('--primary', primaryHsl);
            root.style.setProperty('--background', backgroundHsl);
            root.style.setProperty('--accent', accentHsl);
            
            // For the font, we need to make sure the variable is set on the body
            // and that tailwind.config.ts is configured to use it.
            body.style.fontFamily = `var(--font-body), sans-serif`;
            root.style.setProperty('--font-body', theme.font);

        } catch (error) {
            console.error("Error applying theme:", error);
        }

    }, [theme]);


    const handleColorChange = (key: 'primary' | 'background' | 'accent', value: string) => {
        setTheme(prev => ({...prev, [key]: value}))
    }
    
    const handleFontChange = (value: string) => {
        setTheme(prev => ({ ...prev, font: value }));
    };

    const handleSave = (section: string) => {
        toast({
            title: "تم الحفظ بنجاح!",
            description: `تم حفظ إعدادات ${section}.`,
        });
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="grid gap-1">
                <h1 className="text-3xl font-bold tracking-tight">إعدادات المنصة</h1>
                <p className="text-muted-foreground">
                    إدارة الإعدادات العامة للمنصة، المظهر، والتسجيل.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        <span>إعدادات عامة</span>
                    </CardTitle>
                    <CardDescription>
                        إدارة المعلومات الأساسية وحالة المنصة.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="platform-name">اسم المنصة</Label>
                        <Input id="platform-name" defaultValue="SmartEdu" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="platform-description">وصف المنصة</Label>
                        <Input id="platform-description" defaultValue="منصة تعليمية ذكية" />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="maintenance-mode" className="font-semibold">وضع الصيانة</Label>
                            <p className="text-sm text-muted-foreground">
                                عند التفعيل، لن يتمكن سوى المديرين من الوصول للمنصة.
                            </p>
                        </div>
                        <Switch id="maintenance-mode" />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => handleSave('الإعدادات العامة')}><Save className="ml-2 h-4 w-4" /> حفظ الإعدادات العامة</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Brush className="h-5 w-5 text-primary" />
                        <span>إعدادات المظهر</span>
                    </CardTitle>
                    <CardDescription>
                        تخصيص الألوان والخطوط لتناسب هوية المنصة.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="font-select">نوع الخط</Label>
                         <Select onValueChange={handleFontChange} defaultValue={theme.font}>
                            <SelectTrigger id="font-select">
                                <SelectValue placeholder="اختر نوع الخط" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Tajawal">Tajawal</SelectItem>
                                <SelectItem value="Cairo">Cairo</SelectItem>
                                <SelectItem value="Amiri">Amiri</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="color-primary" className="flex items-center gap-2"><Palette size={16}/> اللون الأساسي</Label>
                            <Input id="color-primary" type="color" value={theme.primary} onChange={(e) => handleColorChange('primary', e.target.value)} className="p-1 h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color-background" className="flex items-center gap-2"><Palette size={16}/> لون الخلفية</Label>
                            <Input id="color-background" type="color" value={theme.background} onChange={(e) => handleColorChange('background', e.target.value)} className="p-1 h-10" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="color-accent" className="flex items-center gap-2"><Palette size={16}/> اللون الثانوي</Label>
                            <Input id="color-accent" type="color" value={theme.accent} onChange={(e) => handleColorChange('accent', e.target.value)} className="p-1 h-10" />
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <Button onClick={() => handleSave('المظهر')}><Save className="ml-2 h-4 w-4" /> حفظ إعدادات المظهر</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        <span>إعدادات التسجيل</span>
                    </CardTitle>
                    <CardDescription>
                       التحكم في كيفية انضمام المستخدمين الجدد إلى المنصة.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="allow-registration" className="font-semibold">السماح بتسجيل جديد</Label>
                            <p className="text-sm text-muted-foreground">
                                هل يمكن للزوار إنشاء حسابات جديدة بأنفسهم؟
                            </p>
                        </div>
                        <Switch id="allow-registration" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="require-verification" className="font-semibold">تطلب التحقق من البريد الإلكتروني</Label>
                             <p className="text-sm text-muted-foreground">
                                هل يجب على المستخدمين الجدد التحقق من بريدهم الإلكتروني قبل تسجيل الدخول؟
                            </p>
                        </div>
                        <Switch id="require-verification" defaultChecked />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => handleSave('التسجيل')}><Save className="ml-2 h-4 w-4" /> حفظ إعدادات التسجيل</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
