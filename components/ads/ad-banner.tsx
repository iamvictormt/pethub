"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Advertisement } from "@/lib/types/database"

interface AdBannerProps {
  ads: Advertisement[]
  orientation?: "horizontal" | "vertical"
}

export function AdBanner({ ads, orientation = "vertical" }: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [ads.length])

  if (ads.length === 0) {
    return null
  }

  const currentAd = ads[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length)
  }

  const handleAdClick = () => {
    if (currentAd.link_url) {
      window.open(currentAd.link_url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div
          className={`relative ${orientation === "horizontal" ? "h-32" : "h-64"} cursor-pointer overflow-hidden`}
          onClick={handleAdClick}
        >
          <img
            src={currentAd.image_url || "/placeholder.svg"}
            alt={currentAd.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold">{currentAd.title}</h3>
            {currentAd.description && <p className="text-sm opacity-90">{currentAd.description}</p>}
          </div>
        </div>

        {ads.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {ads.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
