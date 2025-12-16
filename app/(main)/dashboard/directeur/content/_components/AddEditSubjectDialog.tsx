
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subject, Stage, Level } from "@/lib/types";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface AddEditSubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Omit<Subject, 'id'> | Subject) => void;
  subjectToEdit?: Subject | null;
  stages: Stage[];
  levels: Level[];
}

export default function AddEditSubjectDialog({
  isOpen,
  onClose,
  onSave,
  subjectToEdit,
  stages,
  levels,
}: AddEditSubjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stageId, setStageId] = useState<string | undefined>(undefined);
  const [levelId, setLevelId] = useState<string | undefined>(undefined);

  // Filter levels by selected stage (stageId in camelCase from API)
  const filteredLevels = Array.isArray(levels) ? levels.filter(l => l && l.id && String(l.stageId) === stageId) : [];

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setDescription(subjectToEdit.description);
      // Support both camelCase and snake_case
      const subjectStageId = subjectToEdit.stageId || subjectToEdit.stage_id;
      const subjectLevelId = subjectToEdit.levelId || subjectToEdit.level_id;
      setStageId(subjectStageId ? String(subjectStageId) : undefined);
      setLevelId(subjectLevelId ? String(subjectLevelId) : undefined);
    } else {
      setName("");
      setDescription("");
      setStageId(undefined);
      setLevelId(undefined);
    }
  }, [subjectToEdit, isOpen]);

  const handleSave = () => {
    const subjectData = {
      name,
      description,
      stageId: stageId ? Number(stageId) : undefined,
      levelId: levelId ? Number(levelId) : undefined,
    };
    if (name) {
      if (subjectToEdit) {
        onSave({ ...subjectToEdit, ...subjectData });
      } else {
        onSave(subjectData);
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subjectToEdit ? 'تعديل المادة' : 'إضافة مادة جديدة'}</DialogTitle>
          <DialogDescription>
            {subjectToEdit ? 'قم بتحديث تفاصيل المادة.' : 'أدخل تفاصيل المادة الجديدة.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">اسم المادة</Label>
            <Input
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الرياضيات"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="subject-description">وصف المادة</Label>
            <Textarea
              id="subject-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: مادة الرياضيات للمرحلة الابتدائية"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="stage-select">المرحلة</Label>
                <Select value={stageId} onValueChange={setStageId}>
                    <SelectTrigger id="stage-select">
                        <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(stages) && stages.filter(s => s && s.id).map(stage => (
                            <SelectItem key={stage.id} value={String(stage.id)}>{stage.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="level-select">المستوى (اختياري)</Label>
                <Select value={levelId} onValueChange={setLevelId} disabled={!stageId}>
                    <SelectTrigger id="level-select">
                        <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(filteredLevels) && filteredLevels.filter(l => l && l.id).map(level => (
                            <SelectItem key={level.id} value={String(level.id)}>{level.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
