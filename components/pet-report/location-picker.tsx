'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
  locationDescription: string;
  onDescriptionChange: (description: string) => void;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  locationDescription,
  onDescriptionChange,
}: LocationPickerProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: latitude ? Number.parseFloat(latitude) : -23.5505,
    lng: longitude ? Number.parseFloat(longitude) : -46.6333,
  });
  const [zoom, setZoom] = useState(16);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [totalDragDistance, setTotalDragDistance] = useState(0);
  const [markerCoords, setMarkerCoords] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: Number.parseFloat(latitude), lng: Number.parseFloat(longitude) } : null
  );
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerCoords({ lat: Number.parseFloat(latitude), lng: Number.parseFloat(longitude) });
    }
  }, [latitude, longitude]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLocationChange(lat.toString(), lng.toString());
          setMapCenter({ lat, lng });
          setMarkerCoords({ lat, lng });
          setZoom(16);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  };

  const latLngToPixelOffset = (lat: number, lng: number): { x: number; y: number } => {
    const tileSize = 256;
    const scale = Math.pow(2, zoom);

    // Meters per pixel at this zoom level and latitude
    const metersPerPixel = (40075016.686 * Math.cos((mapCenter.lat * Math.PI) / 180)) / (tileSize * scale);

    // Calculate pixel offset from center
    const x = ((lng - mapCenter.lng) * 111320) / metersPerPixel;
    const y = -((lat - mapCenter.lat) * 110540) / metersPerPixel;

    return { x, y };
  };

  const pixelOffsetToLatLng = (x: number, y: number): { lat: number; lng: number } => {
    const tileSize = 256;
    const scale = Math.pow(2, zoom);
    const metersPerPixel = (40075016.686 * Math.cos((mapCenter.lat * Math.PI) / 180)) / (tileSize * scale);

    const lng = mapCenter.lng + (x * metersPerPixel) / 111320;
    const lat = mapCenter.lat - (y * metersPerPixel) / 110540;

    return { lat, lng };
  };

  const getTilesToDisplay = () => {
    const tileSize = 256;
    const scale = Math.pow(2, zoom);

    const centerTileX = ((mapCenter.lng + 180) / 360) * scale;
    const centerTileY =
      ((1 -
        Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) /
        2) *
      scale;

    const tilesX = Math.ceil((mapRef.current?.clientWidth || 800) / tileSize) + 2;
    const tilesY = Math.ceil((mapRef.current?.clientHeight || 600) / tileSize) + 2;

    const tiles = [];
    const startX = Math.floor(centerTileX - tilesX / 2);
    const startY = Math.floor(centerTileY - tilesY / 2);

    for (let x = startX; x < startX + tilesX; x++) {
      for (let y = startY; y < startY + tilesY; y++) {
        if (x >= 0 && y >= 0 && x < scale && y < scale) {
          tiles.push({ x, y, z: zoom });
        }
      }
    }

    return { tiles, centerTileX, centerTileY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setTotalDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setTotalDragDistance((prev) => prev + Math.abs(dx) + Math.abs(dy));

    const tileSize = 256;
    const scale = Math.pow(2, zoom);
    const metersPerPixel = (40075016.686 * Math.cos((mapCenter.lat * Math.PI) / 180)) / (tileSize * scale);

    const newLng = mapCenter.lng - (dx * metersPerPixel) / 111320;
    const newLat = mapCenter.lat + (dy * metersPerPixel) / 110540;

    setMapCenter({ lat: newLat, lng: newLng });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (totalDragDistance > 5) {
      return;
    }

    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const coords = pixelOffsetToLatLng(x, y);

    setMarkerCoords(coords);
    onLocationChange(coords.lat.toString(), coords.lng.toString());
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setTotalDragDistance(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;

    setTotalDragDistance((prev) => prev + Math.abs(dx) + Math.abs(dy));

    const tileSize = 256;
    const scale = Math.pow(2, zoom);
    const metersPerPixel = (40075016.686 * Math.cos((mapCenter.lat * Math.PI) / 180)) / (tileSize * scale);

    const newLng = mapCenter.lng - (dx * metersPerPixel) / 111320;
    const newLat = mapCenter.lat + (dy * metersPerPixel) / 110540;

    setMapCenter({ lat: newLat, lng: newLng });
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);

    if (totalDragDistance > 5) {
      return;
    }

    if (e.changedTouches.length === 1) {
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.changedTouches[0].clientX - rect.left - rect.width / 2;
      const y = e.changedTouches[0].clientY - rect.top - rect.height / 2;

      const coords = pixelOffsetToLatLng(x, y);

      setMarkerCoords(coords);
      onLocationChange(coords.lat.toString(), coords.lng.toString());
    }
  };

  const { tiles, centerTileX, centerTileY } = getTilesToDisplay();

  const markerPixelPosition = markerCoords ? latLngToPixelOffset(markerCoords.lat, markerCoords.lng) : null;

  const hasLocation = latitude && longitude;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex-1">
          <h3 className="text-sm font-medium">Localização no Mapa</h3>
          <p className="text-sm text-muted-foreground">
            {hasLocation ? 'Clique no mapa para ajustar a localização' : 'Clique no mapa ou use sua localização atual'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full sm:w-auto mt-2 sm:mt-0 bg-transparent"
        >
          {isLoadingLocation ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Obtendo...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Usar minha localização
            </>
          )}
        </Button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="relative h-120 w-full overflow-hidden rounded-xl border bg-gray-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleMapClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'crosshair',
          touchAction: 'none',
        }}
      >
        <div className="absolute inset-0">
          {tiles.map(({ x, y, z }) => {
            const offsetX = (x - centerTileX) * 256;
            const offsetY = (y - centerTileY) * 256;

            return (
              <img
                key={`${z}-${x}-${y}`}
                src={`https://tile.openstreetmap.org/${z}/${x}/${y}.png`}
                alt=""
                className="absolute pointer-events-none"
                style={{
                  width: '256px',
                  height: '256px',
                  left: `calc(50% + ${offsetX}px)`,
                  top: `calc(50% + ${offsetY}px)`,
                }}
                draggable={false}
              />
            );
          })}
        </div>

        {/* Selected Location Marker */}
        {hasLocation && markerPixelPosition && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: `calc(50% + ${markerPixelPosition.x}px)`,
              top: `calc(50% + ${markerPixelPosition.y}px)`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <svg
              width="40"
              height="48"
              viewBox="0 0 40 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <path d="M20 0C9 0 0 9 0 20c0 15 20 28 20 28s20-13 20-28c0-11-9-20-20-20z" fill="#F97316" />
              <circle cx="20" cy="20" r="8" fill="white" />
            </svg>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.min(z + 1, 18));
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-50"
            aria-label="Zoom in"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.max(z - 1, 3));
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-50"
            aria-label="Zoom out"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Attribution */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded z-10">
          ©{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            OpenStreetMap
          </a>
        </div>
      </div>

      {/* Location Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição do Local</label>
        <input
          type="text"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
          placeholder="Ex: Próximo ao parque, na Rua X, perto do mercado..."
          value={locationDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Ajude outras pessoas a identificar o local com uma descrição clara
        </p>
      </div>
    </div>
  );
}
