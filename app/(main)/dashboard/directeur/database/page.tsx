
'use client';

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Download } from "lucide-react";

type TableName = 'users' | 'lessons' | 'subjects' | 'exercises' | 'submissions' | 'stages' | 'levels' | 'messages';

const tableTranslations: Record<TableName, string> = {
    users: 'المستخدمون',
    lessons: 'الدروس',
    subjects: 'المواد',
    exercises: 'التمارين',
    submissions: 'الإجابات',
    stages: 'المراحل',
    levels: 'المستويات',
    messages: 'الرسائل',
};

const apiEndpoints: Record<TableName, string> = {
    users: '/api/users',
    lessons: '/api/lessons',
    subjects: '/api/subjects',
    exercises: '/api/exercises',
    submissions: '/api/submissions',
    stages: '/api/stages',
    levels: '/api/levels',
    messages: '/api/messages',
};

export default function DatabasePage() {
    const [selectedTable, setSelectedTable] = useState<TableName>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableCounts, setTableCounts] = useState<Record<TableName, number>>({
        users: 0,
        lessons: 0,
        subjects: 0,
        exercises: 0,
        submissions: 0,
        stages: 0,
        levels: 0,
        messages: 0,
    });

    // Fetch counts for all tables
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // استخدام API الجديد للحصول على جميع الإحصائيات
                const res = await fetch('/api/database/inspect');
                if (res.ok) {
                    const result = await res.json();
                    if (result.success && result.data) {
                        setTableCounts({
                            users: result.data.users || 0,
                            lessons: result.data.lessons || 0,
                            subjects: result.data.subjects || 0,
                            exercises: result.data.exercises || 0,
                            submissions: result.data.submissions || 0,
                            stages: result.data.stages || 0,
                            levels: result.data.levels || 0,
                            messages: result.data.messages || 0,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching database stats:', error);
            }
        };
        fetchCounts();
    }, []);

    // Fetch data for selected table
    useEffect(() => {
        const fetchTableData = async () => {
            setLoading(true);
            try {
                const res = await fetch(apiEndpoints[selectedTable]);
                if (res.ok) {
                    const result = await res.json();
                    
                    // Handle different API response formats
                    let parsedData: any[] = [];
                    
                    if (Array.isArray(result)) {
                        parsedData = result;
                    } else if (result.success && result.data) {
                        // Check nested structures
                        if (Array.isArray(result.data)) {
                            parsedData = result.data;
                        } else if (result.data.data && Array.isArray(result.data.data)) {
                            parsedData = result.data.data;
                        } else if (result.data.stages) {
                            parsedData = result.data.stages;
                        } else if (result.data.levels) {
                            parsedData = result.data.levels;
                        } else if (result.data.subjects) {
                            parsedData = result.data.subjects;
                        } else if (result.data.messages) {
                            parsedData = result.data.messages;
                        }
                    } else if (result.data) {
                        if (Array.isArray(result.data)) {
                            parsedData = result.data;
                        } else if (result.data.stages) {
                            parsedData = result.data.stages;
                        } else if (result.data.levels) {
                            parsedData = result.data.levels;
                        } else if (result.data.subjects) {
                            parsedData = result.data.subjects;
                        }
                    }
                    
                    setTableData(parsedData);
                } else {
                    setTableData([]);
                }
            } catch (error) {
                console.error(`Error fetching ${selectedTable}:`, error);
                setTableData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTableData();
    }, [selectedTable]);
    
    const filteredData = tableData.filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    const renderCell = (value: any) => {
        if (typeof value === 'boolean') {
            return value ? 'نعم' : 'لا';
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        const strValue = String(value);
        return strValue.length > 50 ? `${strValue.substring(0, 50)}...` : strValue;
    };

    const exportToCSV = () => {
        if (filteredData.length === 0) return;

        // Create CSV header
        const csvHeaders = headers.join(',');
        
        // Create CSV rows
        const csvRows = filteredData.map(row => {
            return headers.map(header => {
                let value = row[header];
                
                // Handle different data types
                if (value === null || value === undefined) {
                    return '';
                }
                if (typeof value === 'boolean') {
                    return value ? 'نعم' : 'لا';
                }
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                
                // Convert to string and escape quotes
                const stringValue = String(value).replace(/"/g, '""');
                
                // Wrap in quotes if contains comma, newline, or quote
                if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                    return `"${stringValue}"`;
                }
                
                return stringValue;
            }).join(',');
        }).join('\n');

        // Combine header and rows
        const csvContent = '\ufeff' + csvHeaders + '\n' + csvRows; // \ufeff is BOM for UTF-8
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${tableTranslations[selectedTable]}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">فحص قاعدة البيانات</h1>
                    <p className="text-muted-foreground">
                        عرض مباشر لجداول البيانات في المنصة.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>مستعرض الجداول</CardTitle>
                    <CardDescription>اختر جدولاً لعرض محتوياته.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <Select 
                                value={selectedTable} 
                                onValueChange={(value) => setSelectedTable(value as TableName)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر جدول" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.keys(apiEndpoints) as TableName[]).map(tableName => (
                                        <SelectItem key={tableName} value={tableName}>
                                            {tableTranslations[tableName]} ({tableCounts[tableName]})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                             <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder={`ابحث في جدول ${tableTranslations[selectedTable]}...`}
                                    className="pl-10" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="outline"
                                onClick={exportToCSV}
                                disabled={filteredData.length === 0}
                            >
                                <Download className="ml-2 h-4 w-4" />
                                <span>تصدير CSV</span>
                            </Button>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        عرض {filteredData.length} من أصل {tableData.length} سجل في جدول "{tableTranslations[selectedTable]}".
                    </p>
                    
                    <div className="border rounded-md">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {headers.map(header => (
                                            <TableHead key={header}>{header}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.length > 0 ? (
                                        filteredData.slice(0, 100).map((row, rowIndex) => ( // Limit to 100 rows for performance
                                            <TableRow key={rowIndex}>
                                                {headers.map(header => (
                                                    <TableCell key={`${rowIndex}-${header}`} className="font-mono text-xs max-w-xs truncate">
                                                        {renderCell(row[header])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={headers.length} className="h-24 text-center">
                                                لا توجد بيانات لعرضها.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                    {filteredData.length > 100 && (
                        <p className="text-sm text-muted-foreground text-center">
                            يتم عرض أول 100 سجل فقط. استخدم البحث لتصفية النتائج.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
