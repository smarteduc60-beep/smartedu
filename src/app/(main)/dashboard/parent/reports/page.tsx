'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

type Child = {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  stats: {
    averageScore: number;
  };
};

export default function ReportsPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/parents/children');
      const result = await response.json();
      if (result.success) {
        setChildren(result.data.children);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const childrenAverageScores = children.map(child => ({
    name: child.firstName,
    averageScore: child.stats.averageScore,
  }));

  const getScoreDistribution = (child: Child) => {
    const score = child.stats.averageScore;
    // Simplified distribution based on average
    if (score >= 8) {
      return [
        { name: 'ممتاز (8-10)', value: 70, color: 'hsl(var(--chart-2))' },
        { name: 'جيد (5-7)', value: 25, color: 'hsl(var(--chart-4))' },
        { name: 'ضعيف (0-4)', value: 5, color: 'hsl(var(--destructive))' },
      ];
    } else if (score >= 5) {
      return [
        { name: 'ممتاز (8-10)', value: 30, color: 'hsl(var(--chart-2))' },
        { name: 'جيد (5-7)', value: 60, color: 'hsl(var(--chart-4))' },
        { name: 'ضعيف (0-4)', value: 10, color: 'hsl(var(--destructive))' },
      ];
    } else {
      return [
        { name: 'ممتاز (8-10)', value: 10, color: 'hsl(var(--chart-2))' },
        { name: 'جيد (5-7)', value: 30, color: 'hsl(var(--chart-4))' },
        { name: 'ضعيف (0-4)', value: 60, color: 'hsl(var(--destructive))' },
      ];
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تقارير الأداء</h1>
        <p className="text-muted-foreground">
          نظرة مقارنة على أداء أبنائك الدراسي.
        </p>
      </div>

      {childrenAverageScores.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>مقارنة متوسط الدرجات</CardTitle>
              <CardDescription>
                مقارنة بين متوسط الدرجات الكلي لكل ابن.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={childrenAverageScores}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}/10`} domain={[0, 10]} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="font-bold">{label}</p>
                            <p className="text-sm text-primary">{`متوسط الدرجات: ${payload[0].value}/10`}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {children.map(child => {
              const scoreDistribution = getScoreDistribution(child);
              return (
                <Card key={child.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.image || ''} alt={child.firstName} />
                      <AvatarFallback>{child.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>توزيع درجات {child.firstName}</CardTitle>
                      <CardDescription>نظرة على توزيع درجاته.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {child.stats.averageScore > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={scoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <p className="text-sm">{`${payload[0].name}: ${payload[0].value}%`}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground text-center py-10">
                        لم يقم {child.firstName} بحل أي تمارين بعد.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">لا يوجد أبناء مرتبطون لعرض التقارير</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
