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
import type { Stage } from "@/lib/types";
import { useState, useEffect } from "react";

interface AddEditStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stage: Omit<Stage, 'id'> | Stage) => void;
  stageToEdit?: Stage | null;
}

export default function AddEditStageDialog({
  isOpen,
  onClose,
  onSave,
  stageToEdit,
}: AddEditStageDialogProps) {
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (stageToEdit) {
      setName(stageToEdit.name);
      setOrder(stageToEdit.order);
    } else {
      setName("");
      setOrder(0);
    }
  }, [stageToEdit, isOpen]);

  const handleSave = () => {
    if (name && order > 0) {
      if (stageToEdit) {
        onSave({ ...stageToEdit, name, order });
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
          <DialogTitle>{stageToEdit ? 'تعديل المرحلة' : 'إضافة مرحلة جديدة'}</DialogTitle>
          <DialogDescription>
            {stageToEdit ? 'قم بتحديث تفاصيل المرحلة.' : 'أدخل تفاصيل المرحلة الجديدة.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="stage-name">اسم المرحلة</Label>
            <Input
              id="stage-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: مرحلة التعليم الإبتدائي"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage-order">الترتيب</Label>
            <Input
              id="stage-order"
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
