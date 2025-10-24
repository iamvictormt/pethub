'use client';

import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AdSupportBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 md:bottom-4">
      <div className="rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-500/10 p-2">
            <Info className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Apoie o Farejei</p>
            <p className="text-xs text-muted-foreground">
              Os anúncios ajudam a manter nossa plataforma gratuita para ajudar pets perdidos
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
