"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Pet } from "@/lib/types/database"
import { PetMarkerPopup } from "./pet-marker-popup"

interface PetMapProps {
  pets: Pet[]
  userLocation?: { lat: number; lng: number } | null
}

export function PetMap({ pets, userLocation }: PetMapProps) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 }) // São Paulo
  const [zoom, setZoom] = useState(13)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userLocation) {
      console.log("Centering map on user location:", userLocation)
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng })
      setZoom(14)
    }
  }, [userLocation])

  const getTilesToDisplay = () => {
    const tileSize = 256
    const scale = Math.pow(2, zoom)

    // Convert center to tile coordinates
    const centerTileX = ((mapCenter.lng + 180) / 360) * scale
    const centerTileY =
      ((1 -
        Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) /
        2) *
      scale

    const tilesX = Math.ceil((mapRef.current?.clientWidth || 800) / tileSize) + 2
    const tilesY = Math.ceil((mapRef.current?.clientHeight || 600) / tileSize) + 2

    const tiles = []
    const startX = Math.floor(centerTileX - tilesX / 2)
    const startY = Math.floor(centerTileY - tilesY / 2)

    for (let x = startX; x < startX + tilesX; x++) {
      for (let y = startY; y < startY + tilesY; y++) {
        if (x >= 0 && y >= 0 && x < scale && y < scale) {
          tiles.push({ x, y, z: zoom })
        }
      }
    }

    return { tiles, centerTileX, centerTileY }
  }

  const latLngToPixel = (lat: number, lng: number) => {
    const tileSize = 256
    const scale = Math.pow(2, zoom)
    const worldCoordX = ((lng + 180) / 360) * tileSize * scale
    const worldCoordY =
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      tileSize *
      scale

    const centerWorldX = ((mapCenter.lng + 180) / 360) * tileSize * scale
    const centerWorldY =
      ((1 -
        Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) /
        2) *
      tileSize *
      scale

    return {
      x: worldCoordX - centerWorldX,
      y: worldCoordY - centerWorldY,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    const tileSize = 256
    const scale = Math.pow(2, zoom)
    const metersPerPixel = (40075016.686 * Math.cos((mapCenter.lat * Math.PI) / 180)) / (tileSize * scale)

    const newLng = mapCenter.lng - (dx * metersPerPixel) / 111320
    const newLat = mapCenter.lat + (dy * metersPerPixel) / 110540

    setMapCenter({ lat: newLat, lng: newLng })
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return

    e.preventDefault() // Prevent scrolling while dragging

    const dx = e.touches[0].clientX - dragStart.x
    const dy = e.touches[0].clientY - dragStart.y

    const tileSize = 256
    const scale = Math.pow(2, zoom)
    const metersPerPixel = (40075016.686 * Math.cos((mapCenter.lat * Math.PI) / 180)) / (tileSize * scale)

    const newLng = mapCenter.lng - (dx * metersPerPixel) / 111320
    const newLat = mapCenter.lat + (dy * metersPerPixel) / 110540

    setMapCenter({ lat: newLat, lng: newLng })
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const { tiles, centerTileX, centerTileY } = getTilesToDisplay()

  return (
    <div
      ref={mapRef}
      className="relative h-full w-full overflow-hidden bg-gray-200"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      <div className="absolute inset-0">
        {tiles.map(({ x, y, z }) => {
          const offsetX = (x - centerTileX) * 256
          const offsetY = (y - centerTileY) * 256

          return (
            <img
              key={`${z}-${x}-${y}`}
              src={`https://tile.openstreetmap.org/${z}/${x}/${y}.png`}
              alt=""
              className="absolute pointer-events-none"
              style={{
                width: "256px",
                height: "256px",
                left: `calc(50% + ${offsetX}px)`,
                top: `calc(50% + ${offsetY}px)`,
              }}
              draggable={false}
            />
          )
        })}
      </div>

      {/* Pet Markers */}
      {pets.map((pet) => {
        const pos = latLngToPixel(pet.latitude, pet.longitude)
        const isSelected = selectedPet?.id === pet.id

        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, pet.latitude, pet.longitude)
          : undefined

        const markerColor = pet.status === "LOST" ? "#F97316" : pet.status === "ADOPTION" ? "#22C55E" : "#3B82F6"

        return (
          <button
            key={pet.id}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPet(isSelected ? null : pet)
            }}
            className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 z-10 cursor-pointer"
            style={{
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              zIndex: isSelected ? 20 : 10,
            }}
          >
            {/* Pin Icon */}
            <svg
              width="40"
              height="48"
              viewBox="0 0 40 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <path d="M20 0C9 0 0 9 0 20c0 15 20 28 20 28s20-13 20-28c0-11-9-20-20-20z" fill={markerColor} />
              <circle cx="20" cy="20" r="8" fill="white" />
            </svg>

            {/* Popup */}
            {isSelected && (
              <div className="absolute left-1/2 top-0 z-20 w-64 -translate-x-1/2 -translate-y-full pointer-events-auto">
                <div className="mb-2 rounded-lg bg-white p-3 shadow-xl">
                  <PetMarkerPopup pet={pet} distance={distance} />
                </div>
              </div>
            )}
          </button>
        )
      })}

      {/* User Location Marker */}
      {userLocation && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-[5]"
          style={{
            left: `calc(50% + ${latLngToPixel(userLocation.lat, userLocation.lng).x}px)`,
            top: `calc(50% + ${latLngToPixel(userLocation.lat, userLocation.lng).y}px)`,
          }}
        >
          {/* Pulsing outer circle */}
          <div className="absolute inset-0 -m-2 animate-ping rounded-full bg-purple-500 opacity-75" />
          {/* Inner circle */}
          <div className="relative h-4 w-4 rounded-full border-2 border-white bg-purple-500 shadow-lg" />
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 1, 18))}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-50"
          aria-label="Zoom in"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 1, 3))}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-50"
          aria-label="Zoom out"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {userLocation && (
          <button
            onClick={() => {
              setMapCenter({ lat: userLocation.lat, lng: userLocation.lng })
              setZoom(14)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-50"
            aria-label="Centralizar na minha localização"
            title="Centralizar na minha localização"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="absolute left-4 top-4 rounded-lg bg-white p-3 shadow-lg z-10">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span>Pet Perdido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Pet Encontrado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Para Adoção</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span>Você está aqui</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded z-10">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </div>
    </div>
  )
}
