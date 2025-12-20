'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PointsNotification } from './PointsNotification';

interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    points: number;
  };
  onSignOut?: () => void;
  onSettings?: () => void;
}

export function UserMenu({ user, onSignOut, onSettings }: UserMenuProps) {
  // Simulate real-time points update
  useEffect(() => {
    if (!user) return;
    
    // Listen for points updates (you can replace this with your actual points update logic)
    const handlePointsUpdate = (event: CustomEvent) => {
      // Points are handled by the PointsNotification component
      console.log('Points updated:', event.detail.newPoints);
    };

    window.addEventListener('pointsUpdated', handlePointsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate as EventListener);
    };
  }, [user]);

  if (!user) {
    return (
      <Button variant="outline" size="sm">
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <PointsNotification />
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onSignOut} 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook for managing points updates
export function usePoints(initialPoints: number = 0) {
  const [points, setPoints] = useState(initialPoints);

  const addPoints = (amount: number) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    
    // Dispatch event for real-time updates across components
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, addedAmount: amount } 
    }));
    
    return newPoints;
  };

  const subtractPoints = (amount: number) => {
    const newPoints = Math.max(0, points - amount);
    setPoints(newPoints);
    
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, subtractedAmount: amount } 
    }));
    
    return newPoints;
  };

  const setPointsDirectly = (amount: number) => {
    setPoints(amount);
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints: amount } 
    }));
  };

  return {
    points,
    addPoints,
    subtractPoints,
    setPoints: setPointsDirectly,
  };
}