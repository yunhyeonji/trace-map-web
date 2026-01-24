import { Calendar, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { formatDateRange } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Travel } from '@/service/travelsList/types';

import ImageCell from './ImageCell.client';

interface TravelCardProps {
  travel: Travel;
  isSelected?: boolean;
  onClick?: () => void;
}

export const TravelCard = ({ travel, isSelected = false, onClick }: TravelCardProps) => {
  const dateText = travel.date ? formatDateRange(travel.date.start, travel.date.end) : '';
  const companionsText = travel.companions.length > 0 ? travel.companions.join(', ') : '';

  return (
    <Card
      className={cn(
        'group bg-card/50 hover:border-primary/20 cursor-pointer overflow-hidden border py-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        isSelected && 'border-primary ring-primary/20 ring-2'
      )}
      onClick={onClick}
    >
      <ImageCell travel={travel} />

      <CardContent className="p-6">
        {travel.tags && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {travel.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-xl font-bold tracking-tight transition-colors">
          {travel.travelName}
        </h3>

        {travel.memo && (
          <p className="text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{travel.memo}</p>
        )}

        <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {dateText && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time>{dateText}</time>
            </div>
          )}
          {companionsText && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{companionsText}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
