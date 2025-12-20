'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Coins, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsNotificationProps {
  className?: string;
}

interface PointsUpdate {
  newPoints: number;
  addedAmount?: number;
  subtractedAmount?: number;
}

export function PointsNotification({ className }: PointsNotificationProps) {
  const [points, setPoints] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<PointsUpdate | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const handlePointsUpdate = (event: CustomEvent<PointsUpdate>) => {
      const { newPoints } = event.detail;
      
      setPoints(newPoints);
      setLastUpdate(event.detail);
      setShowAnimation(true);

      // Hide animation after 2 seconds
      setTimeout(() => {
        setShowAnimation(false);
        setLastUpdate(null);
      }, 2000);
    };

    window.addEventListener('pointsUpdated', handlePointsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate as EventListener);
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Badge variant="secondary" className="relative overflow-hidden">
        <Coins className="w-3 h-3 mr-1" />
        <span className="font-mono">{points.toLocaleString()}</span>
        
        {/* Animation overlay */}
        {showAnimation && lastUpdate && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/90 text-primary-foreground animate-in fade-in-0 zoom-in-95 duration-300">
            {lastUpdate.addedAmount && (
              <div className="flex items-center gap-1">
                <Plus className="w-3 h-3" />
                <span className="text-xs font-mono">+{lastUpdate.addedAmount}</span>
              </div>
            )}
            {lastUpdate.subtractedAmount && (
              <div className="flex items-center gap-1">
                <Minus className="w-3 h-3" />
                <span className="text-xs font-mono">-{lastUpdate.subtractedAmount}</span>
              </div>
            )}
          </div>
        )}
      </Badge>
    </div>
  );
}

// Example usage component for testing points updates
export function PointsTestControls() {
  const [currentPoints, setCurrentPoints] = useState(1250);

  const addPoints = (amount: number) => {
    const newPoints = currentPoints + amount;
    setCurrentPoints(newPoints);
    
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, addedAmount: amount } 
    }));
  };

  const subtractPoints = (amount: number) => {
    const newPoints = Math.max(0, currentPoints - amount);
    setCurrentPoints(newPoints);
    
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, subtractedAmount: amount } 
    }));
  };

  return (
    <div className="flex items-center gap-2 p-4 border rounded-lg">
      <span className="text-sm font-medium">Test Points:</span>
      <button 
        onClick={() => addPoints(10)}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
      >
        +10
      </button>
      <button 
        onClick={() => addPoints(50)}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
      >
        +50
      </button>
      <button 
        onClick={() => subtractPoints(25)}
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
      >
        -25
      </button>
      <PointsNotification />
    </div>
  );
}