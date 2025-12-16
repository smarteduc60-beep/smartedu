
'use client';

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BookCopy, PlusCircle, FilePenLine, Trash2, GraduationCap, Layers, Loader2 } from "lucide-react";
import type { Subject } from "@/lib/types";
import { useStages, useLevels, useSubjects } from "@/hooks";
import { useToast } from "@/hooks/use-toast";

import AddEditStageDialog from "./_components/AddEditStageDialog";
import AddEditLevelDialog from "./_components/AddEditLevelDialog";
import AddEditSubjectDialog from "./_components/AddEditSubjectDialog";
import DeleteConfirmationDialog from "./_components/DeleteConfirmationDialog";

export default function ContentManagementPage() {
    const { toast } = useToast();
    
    const { stages, isLoading: stagesLoading, createStage, updateStage, deleteStage } = useStages();
    const { levels, isLoading: levelsLoading, createLevel, updateLevel, deleteLevel } = useLevels();
    const { subjects, isLoading: subjectsLoading, createSubject, updateSubject, deleteSubject } = useSubjects();
    
    // Memoize accordion default value
    const defaultAccordionValue = useMemo(() => {
        if (!Array.isArray(stages) || stages.length === 0) return [];
        return stages
            .filter(s => s && typeof s.id !== 'undefined')
            .map(s => `stage-${s.id}`);
    }, [stages]);

    const [isStageDialogOpen, setStageDialogOpen] = useState(false);
    const [stageToEdit, setStageToEdit] = useState<Stage | null>(null);

    const [isLevelDialogOpen, setLevelDialogOpen] = useState(false);
    const [levelToEdit, setLevelToEdit] = useState<Level | null>(null);
    const [currentStageId, setCurrentStageId] = useState<number | null>(null);
    
    const [isSubjectDialogOpen, setSubjectDialogOpen] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);

    const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string; type: 'stage' | 'level' | 'subject' } | null>(null);


    const handleOpenAddStage = () => {
        setStageToEdit(null);
        setStageDialogOpen(true);
    };

    const handleOpenEditStage = (stage: any) => {
        // Convert displayOrder to order for dialog
        setStageToEdit({ ...stage, order: stage.displayOrder });
        setStageDialogOpen(true);
    };

    const handleSaveStage = async (stageData: any) => {
        if ('id' in stageData) {
            const result = await updateStage({
                id: stageData.id,
                name: stageData.name,
                displayOrder: stageData.order
            });
            if (result.success) {
                toast({ title: "تم تحديث المرحلة بنجاح" });
            } else {
                toast({ title: "فشل تحديث المرحلة", variant: "destructive" });
            }
        } else {
            const result = await createStage({
                name: stageData.name,
                displayOrder: stageData.order
            });
            if (result.success) {
                toast({ title: "تم إضافة المرحلة بنجاح" });
            } else {
                toast({ title: "فشل إضافة المرحلة", variant: "destructive" });
            }
        }
    };

    const handleOpenAddLevel = (stageId: number) => {
        setLevelToEdit(null);
        setCurrentStageId(stageId);
        setLevelDialogOpen(true);
    };

    const handleOpenEditLevel = (level: any) => {
        // Convert displayOrder to order and stageId to stage_id for dialog
        setLevelToEdit({ ...level, order: level.displayOrder, stage_id: level.stageId });
        setCurrentStageId(level.stageId);
        setLevelDialogOpen(true);
    }
    
    const handleSaveLevel = async (levelData: any) => {
        if ('id' in levelData) {
            const result = await updateLevel({
                id: levelData.id,
                name: levelData.name,
                stageId: levelData.stageId || currentStageId!,
                displayOrder: levelData.order
            });
            if (result.success) {
                toast({ title: "تم تحديث المستوى بنجاح" });
            } else {
                toast({ title: "فشل تحديث المستوى", variant: "destructive" });
            }
        } else {
            if (currentStageId) {
                const result = await createLevel({
                    name: levelData.name,
                    stageId: currentStageId,
                    displayOrder: levelData.order
                });
                if (result.success) {
                    toast({ title: "تم إضافة المستوى بنجاح" });
                } else {
                    toast({ title: "فشل إضافة المستوى", variant: "destructive" });
                }
            }
        }
    };
    
    const handleOpenAddSubject = () => {
        setSubjectToEdit(null);
        setSubjectDialogOpen(true);
    };

    const handleOpenEditSubject = (subject: Subject) => {
        setSubjectToEdit(subject);
        setSubjectDialogOpen(true);
    };

    const handleSaveSubject = async (subjectData: any) => {
        if ('id' in subjectData) {
            const result = await updateSubject(subjectData);
            if (result.success) {
                toast({ title: "تم تحديث المادة بنجاح" });
            } else {
                toast({ title: "فشل تحديث المادة", variant: "destructive" });
            }
        } else {
            const result = await createSubject(subjectData);
            if (result.success) {
                toast({ title: "تم إضافة المادة بنجاح" });
            } else {
                toast({ title: "فشل إضافة المادة", variant: "destructive" });
            }
        }
    };

    const handleDeleteClick = (item: { id: number; name: string; type: 'stage' | 'level' | 'subject' }) => {
        setItemToDelete(item);
    };
    
    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            switch (itemToDelete.type) {
                case 'stage':
                    const stageResult = await deleteStage(itemToDelete.id);
                    if (stageResult.success) {
                        toast({ title: "تم حذف المرحلة بنجاح" });
                    } else {
                        toast({ title: "فشل حذف المرحلة", variant: "destructive" });
                    }
                    break;
                case 'level':
                    const levelResult = await deleteLevel(itemToDelete.id);
                    if (levelResult.success) {
                        toast({ title: "تم حذف المستوى بنجاح" });
                    } else {
                        toast({ title: "فشل حذف المستوى", variant: "destructive" });
                    }
                    break;
                case 'subject':
                    const subjectResult = await deleteSubject(itemToDelete.id);
                    if (subjectResult.success) {
                        toast({ title: "تم حذف المادة بنجاح" });
                    } else {
                        toast({ title: "فشل حذف المادة", variant: "destructive" });
                    }
                    break;
            }
            setItemToDelete(null);
        }
    };

    // Show loading state
    if (stagesLoading || levelsLoading || subjectsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Ensure data is loaded
    if (!stages || !levels || !subjects) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <AddEditStageDialog
                isOpen={isStageDialogOpen}
                onClose={() => setStageDialogOpen(false)}
                onSave={handleSaveStage}
                stageToEdit={stageToEdit}
            />
            <AddEditLevelDialog
                isOpen={isLevelDialogOpen}
                onClose={() => setLevelDialogOpen(false)}
                onSave={handleSaveLevel}
                levelToEdit={levelToEdit}
            />
             <AddEditSubjectDialog
                isOpen={isSubjectDialogOpen}
                onClose={() => setSubjectDialogOpen(false)}
                onSave={handleSaveSubject}
                subjectToEdit={subjectToEdit}
                stages={stages}
                levels={levels}
            />
            {itemToDelete && (
                <DeleteConfirmationDialog
                    isOpen={!!itemToDelete}
                    onClose={() => setItemToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    itemName={itemToDelete.name}
                    itemType={
                        itemToDelete.type === 'stage' ? 'المرحلة' :
                        itemToDelete.type === 'level' ? 'المستوى' : 'المادة'
                    }
                />
            )}

            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">إدارة المحتوى</h1>
                    <p className="text-muted-foreground">
                        إدارة المراحل والمستويات والمواد الدراسية للمنصة.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="stages">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stages">المراحل والمستويات</TabsTrigger>
                    <TabsTrigger value="subjects">المواد الدراسية</TabsTrigger>
                </TabsList>

                <TabsContent value="stages">
                    <Card>
                        <CardHeader>
                            <CardTitle>هيكل المراحل والمستويات</CardTitle>
                            <CardDescription>
                                عرض وتعديل المراحل التعليمية والمستويات المرتبطة بها.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="multiple" defaultValue={defaultAccordionValue} className="w-full">
                                {Array.isArray(stages) && stages.filter(s => s && s.id).sort((a,b) => a.displayOrder - b.displayOrder).map(stage => {
                                    const stageLevels = Array.isArray(levels) ? levels.filter(l => l && l.stageId === stage.id).sort((a,b) => a.displayOrder - b.displayOrder) : [];
                                    return (
                                        <AccordionItem key={stage.id} value={`stage-${stage.id}`}>
                                            <div className="flex items-center gap-4 justify-between w-full">
                                                <AccordionTrigger className="text-lg font-semibold hover:no-underline flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-5 w-5 text-primary"/>
                                                        {stage.name}
                                                    </div>
                                                </AccordionTrigger>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" title="تعديل المرحلة" onClick={() => handleOpenEditStage(stage)}>
                                                        <FilePenLine className="h-4 w-4"/>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="حذف المرحلة" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick({ id: stage.id, name: stage.name, type: 'stage' })}>
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            </div>
                                            <AccordionContent>
                                                <div className="space-y-3 pl-8">
                                                    {stageLevels.map(level => (
                                                         <div key={level.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                                            <div className="flex items-center gap-3">
                                                                <Layers className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium">{level.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button variant="ghost" size="icon" title="تعديل المستوى" onClick={() => handleOpenEditLevel(level)}>
                                                                    <FilePenLine className="h-4 w-4"/>
                                                                </Button>
                                                                 <Button variant="ghost" size="icon" title="حذف المستوى" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick({ id: level.id, name: level.name, type: 'level' })}>
                                                                    <Trash2 className="h-4 w-4"/>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {stageLevels.length === 0 && <p className="text-muted-foreground text-center py-4">لا توجد مستويات في هذه المرحلة.</p>}
                                                     <Button variant="outline" size="sm" className="mt-4" onClick={() => handleOpenAddLevel(stage.id)}>
                                                        <PlusCircle className="ml-2 h-4 w-4" />
                                                        إضافة مستوى جديد
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                            <Button variant="secondary" className="mt-6" onClick={handleOpenAddStage}>
                                <PlusCircle className="ml-2 h-4 w-4" />
                                إضافة مرحلة جديدة
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subjects">
                     <Card>
                         <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>قائمة المواد الدراسية</CardTitle>
                                    <CardDescription>
                                        جميع المواد الدراسية المسجلة في المنصة.
                                    </CardDescription>
                                </div>
                                <Button onClick={handleOpenAddSubject}><PlusCircle className="ml-2 h-4 w-4"/> إضافة مادة جديدة</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>المادة</TableHead>
                                        <TableHead>الوصف</TableHead>
                                        <TableHead className="text-center">الإجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(subjects) && subjects.map(subject => (
                                        <TableRow key={subject.id}>
                                            <TableCell className="font-medium">{subject.name}</TableCell>
                                            <TableCell>{subject.description}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button variant="ghost" size="icon" title="تعديل المادة" onClick={() => handleOpenEditSubject(subject)}>
                                                        <FilePenLine className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="حذف المادة" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick({ id: subject.id, name: subject.name, type: 'subject' })}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                     {subjects.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">لا توجد مواد دراسية.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    )
}