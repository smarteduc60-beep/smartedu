
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
  onSave: (data: any) => void;
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
  const [selectedLevelIds, setSelectedLevelIds] = useState<string[]>([]);

  // Filter levels by selected stage (stageId in camelCase from API)
  const filteredLevels = Array.isArray(levels) ? levels.filter(l => l && l.id && String(l.stageId) === stageId) : [];

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setDescription(subjectToEdit.description);
      // Support both camelCase and snake_case
      const subjectStageId = subjectToEdit.stageId || (subjectToEdit as any).stage_id;
      setStageId(subjectStageId ? String(subjectStageId) : undefined);

      // Populate selected levels for edit mode
      let initialLevels: string[] = [];
      if (subjectToEdit.levels && Array.isArray(subjectToEdit.levels)) {
        initialLevels = subjectToEdit.levels.map((l: any) => String(l.id));
      } else if (subjectToEdit.levelIds && Array.isArray(subjectToEdit.levelIds)) {
        initialLevels = subjectToEdit.levelIds.map(String);
      } else {
        const subjectLevelId = subjectToEdit.levelId || (subjectToEdit as any).level_id;
        if (subjectLevelId) initialLevels.push(String(subjectLevelId));
      }
      setSelectedLevelIds(initialLevels);
    } else {
      setName("");
      setDescription("");
      setStageId(undefined);
      setSelectedLevelIds([]);
    }
  }, [subjectToEdit, isOpen]);

  const handleSave = () => {
    const subjectData = {
      name,
      description,
      stageId: stageId ? Number(stageId) : undefined,
      levelIds: selectedLevelIds.map(Number),
    };
    if (name) {
      let payload;
      if (subjectToEdit) {
        payload = {
          id: subjectToEdit.id,
          ...subjectData,
        };
      } else {
        payload = subjectData;
      }
      onSave(payload);
      onClose();
    }
  };

  const toggleLevel = (id: string) => {
    setSelectedLevelIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleAllLevels = () => {
    if (selectedLevelIds.length === filteredLevels.length) {
      setSelectedLevelIds([]);
    } else {
      setSelectedLevelIds(filteredLevels.map(l => String(l.id)));
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
                <Select value={stageId} onValueChange={(val) => { setStageId(val); setSelectedLevelIds([]); }}>
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
                <Label htmlFor="level-select">المستوى</Label>
                  <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto space-y-2 bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={filteredLevels.length > 0 && selectedLevelIds.length === filteredLevels.length}
                        onChange={toggleAllLevels}
                        disabled={!stageId || filteredLevels.length === 0}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label htmlFor="select-all" className="text-sm font-medium leading-none cursor-pointer">
                        تحديد الكل
                      </label>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    {filteredLevels.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">اختر مرحلة أولاً</p>
                    ) : (
                      filteredLevels.map((level) => (
                        <div key={level.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`level-${level.id}`}
                            checked={selectedLevelIds.includes(String(level.id))}
                            onChange={() => toggleLevel(String(level.id))}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                          <label
                            htmlFor={`level-${level.id}`}
                            className="text-sm leading-none cursor-pointer"
                          >
                            {level.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
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
