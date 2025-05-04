
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 p-6 rounded-xl neumorphic",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                change.isPositive 
                  ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
                  : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
