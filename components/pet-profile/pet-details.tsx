'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Phone, Mail, User, Eye, Clock, ExternalLink, DollarSign, Bone } from 'lucide-react';
import type { Pet } from '@/lib/types/database';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { statusConfig } from '@/utils/configPet';

interface PetDetailsProps {
  pet: Pet & {
    profiles: {
      id: string;
      name: string;
      avatar_url?: string;
    };
  };
}

export function PetDetails({ pet }: PetDetailsProps) {
  const config = statusConfig[pet.status as keyof typeof statusConfig] || statusConfig.LOST;

  const photos = [pet.photo_url, pet.photo_url_2, pet.photo_url_3, pet.photo_url_4].filter(Boolean) as string[];

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  console.log(pet);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl py-0">
        <div className="relative">
          {photos.length > 0 ? (
            <div className="relative w-full min-h-[50vh] md:min-h-[80vh] overflow-hidden bg-muted group">
              <div className="relative w-full h-[50vh] md:h-[80vh]">
                <Image
                  src={photos[selectedPhotoIndex] || '/placeholder.svg'}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-blue-100 lg:aspect-[21/9]">
              <span className="text-9xl opacity-30">🐾</span>
            </div>
          )}

          <div className="absolute right-6 top-6">
            <div
              className={`flex items-center gap-2 rounded-full bg-gradient-to-r px-5 py-2.5 text-sm font-bold text-white shadow-2xl backdrop-blur-sm ${config.color}`}
            >
              <span className="text-lg">{config.emoji}</span>
              {config.label}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
            <h1 className="mb-2 text-4xl font-bold drop-shadow-lg lg:text-5xl">{pet.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-lg mb-4">
              <span className="font-medium">
                {pet.type === 'DOG'
                  ? '🐕 Cachorro'
                  : pet.type === 'CAT'
                  ? '🐈 Gato'
                  : pet.type === 'BIRD'
                  ? '🐦 Pássaro'
                  : '🐾 Outro'}
              </span>
            </div>

            {photos.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 shadow-lg transition-all hover:scale-110 ${
                      selectedPhotoIndex === index
                        ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-black/20 scale-110'
                        : 'border-white/50'
                    }`}
                  >
                    <Image
                      src={photo || '/placeholder.svg'}
                      alt={`${pet.name} - Foto ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-6">
            {pet.has_reward && pet.reward_amount && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        Recompensa Oferecida
                      </p>
                      <p className="text-3xl font-bold text-green-700">
                        R$ {pet.reward_amount.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Valor oferecido por informações que levem ao encontro
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="sticky top-6 border-0 shadow-xl">
              <CardContent className="space-y-8 p-8">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">Entre em Contato</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Tem informações sobre este pet? Entre em contato!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-xl bg-muted/50 p-5">
                    <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nome</p>
                      <p className="text-base font-semibold">{pet.contact_name}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${pet.contact_phone}`}
                    className="flex items-start gap-4 rounded-xl bg-green-50 p-5 transition-all hover:bg-green-100 hover:shadow-md"
                  >
                    <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Telefone</p>
                      <p className="text-base font-semibold text-green-700">{pet.contact_phone}</p>
                    </div>
                  </a>

                  {pet.contact_email && (
                    <a
                      href={`mailto:${pet.contact_email}`}
                      className="flex items-start gap-4 rounded-xl bg-blue-50 p-5 transition-all hover:bg-blue-100 hover:shadow-md"
                    >
                      <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                        <p className="break-all text-base font-semibold text-blue-700">{pet.contact_email}</p>
                      </div>
                    </a>
                  )}
                </div>

                <div className="space-y-3 pt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reportado por</p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-blue-100">
                      {pet.profiles.avatar_url ? (
                        <Image
                          src={pet.profiles.avatar_url || '/placeholder.svg'}
                          alt={pet.profiles.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-base font-semibold">{pet.profiles.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pet.color && (
              <Card className="border-0 shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <div
                      className="h-6 w-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: pet.color }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Cor</p>
                    <p className="text-lg font-bold">{pet.color}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {pet.breed && (
              <Card className="border-0 shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                    <Bone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Raça</p>
                    <p className="text-lg font-bold">{pet.breed}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-red-100">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Visualizações</p>
                  <p className="text-lg font-bold">{pet.view_count || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Publicado</p>
                  <p className="text-sm font-bold">
                    {new Date(pet.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {pet.description && (
            <Card className="border-0 shadow-md">
              <CardContent className="space-y-3 p-6">
                <h2 className="text-xl font-bold">Descrição</h2>
                <p className="leading-relaxed text-muted-foreground">{pet.description}</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-md">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold">Localização aproximada</h2>
              <div className="space-y-4">
                {pet.location_description && (
                  <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-foreground">{pet.location_description}</p>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden rounded-xl border-2 border-orange-100">
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${pet.latitude},${pet.longitude}&zoom=15`}
                  />
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                >
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${pet.latitude},${pet.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Abrir no Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {pet.last_seen_date && (
            <Card className="border-0 shadow-md">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-bold">Última vez visto</h2>
                <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <p className="font-medium">
                    {new Date(pet.last_seen_date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
