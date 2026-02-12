'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Level } from "@/lib/types";
import { useState, useEffect } from "react";

interface AddEditLevelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (level: Omit<Level, 'id' | 'stage_id'> | Level) => void;
  levelToEdit?: Level | null;
}

export default function AddEditLevelDialog({
  isOpen,
  onClose,
  onSave,
  levelToEdit,
}: AddEditLevelDialogProps) {
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (levelToEdit) {
      setName(levelToEdit.name);
      setOrder(levelToEdit.order);
    } else {
      setName("");
      setOrder(0);
    }
  }, [levelToEdit, isOpen]);

  const handleSave = () => {
    if (name && order > 0) {
      if (levelToEdit) {
        onSave({ ...levelToEdit, name, order });
      } else {
        onSave({ name, order });
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{levelToEdit ? 'تعديل المستوى' : 'إضافة مستوى جديد'}</DialogTitle>
          <DialogDescription>
            {levelToEdit ? 'قم بتحديث تفاصيل المستوى.' : 'أدخل تفاصيل المستوى الجديد.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="level-name">اسم المستوى</Label>
            <Input
              id="level-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الصف الأول الابتدائي"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level-order">الترتيب</Label>
            <Input
              id="level-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="مثال: 1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
