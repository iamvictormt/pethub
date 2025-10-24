'use client';

import { Card } from '@/components/ui/card';
import { ExternalLink, Info } from 'lucide-react';
import Image from 'next/image';
import type { Advertisement } from '@/lib/types/database';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NativeAdCardProps {
  ad: Advertisement;
}

export function NativeAdCard({ ad }: NativeAdCardProps) {
  const handleClick = () => {
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      {/* Ad Badge */}
      <div className="absolute left-2 top-8 z-10 flex items-center gap-1">
        <span className="rounded-full bg-purple-500 px-3 py-1 text-xs font-semibold text-white">Anúncio</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="rounded-full bg-black/70 p-1 backdrop-blur" onClick={(e) => e.stopPropagation()}>
                <Info className="h-3 w-3 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-xs">Anúncios ajudam a manter o Farejei gratuito e acessível para todos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Ad Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {ad.image_url ? (
          <Image
            src={ad.image_url || '/placeholder.svg'}
            alt={ad.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-4xl">📢</span>
          </div>
        )}
      </div>

      {/* Ad Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold line-clamp-2">{ad.title}</h3>
          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </div>

        {ad.description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{ad.description}</p>}

        <div className="mt-3 text-xs text-muted-foreground">Patrocinado</div>
      </div>
    </Card>
  );
}
