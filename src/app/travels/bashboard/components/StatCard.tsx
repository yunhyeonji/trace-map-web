import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardType {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}
export default function StatCard({ title, value, description, icon }: StatCardType) {
  return (
    <Card className="border-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-primary text-3xl font-bold">{value}</p>
          {icon}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
