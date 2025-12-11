'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Package, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Subscription } from '@/types/subscription';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
} from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const progress =
    (subscription.usedSessions / subscription.totalSessions) * 100;

  return (
    <Card className="py-0 transition-shadow hover:shadow-md">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Package className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                {subscription.packageName}
              </CardTitle>
              <CardDescription className="text-xs">
                {subscription.totalSessions} buổi học
              </CardDescription>
            </div>
          </div>
          <Badge
            className={`text-xs ${getSubscriptionStatusColor(subscription.status)}`}
          >
            {getSubscriptionStatusLabel(subscription.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-medium">
              {subscription.usedSessions}/{subscription.totalSessions} buổi
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>Còn lại: {subscription.remainingSessions} buổi</span>
          </div>
        </div>

        <div className="space-y-1 border-t pt-2">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3" />
            <span>
              {format(new Date(subscription.startDate), 'dd/MM/yyyy', {
                locale: vi,
              })}{' '}
              -{' '}
              {format(new Date(subscription.endDate), 'dd/MM/yyyy', {
                locale: vi,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SubscriptionCardSkeleton() {
  return (
    <Card className="py-0">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="border-t pt-2">
          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
