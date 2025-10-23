'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TextInput } from '@/components/ui/text-input';
import { RadioGroup } from '@/components/ui/radio-group';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Upload, MapPin, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LocationPicker } from './location-picker';
import type { Pet, PetStatus, PetType } from '@/lib/types/database';
import Link from 'next/link';
import { formatPhoneBR } from '@/lib/utils';
import { validateImageFile } from '@/lib/image-validation';
import { toast } from '@/hooks/use-toast';

interface PetEditFormProps {
  pet: Pet;
}

export function PetEditForm({ pet }: PetEditFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(pet.photo_url || null);

  const [status, setStatus] = useState<PetStatus>(pet.status);
  const [name, setName] = useState(pet.name);
  const [type, setType] = useState<PetType>(pet.type);
  const [breed, setBreed] = useState(pet.breed || '');
  const [color, setColor] = useState(pet.color || '');
  const [age, setAge] = useState(pet.age?.toString() || '');
  const [description, setDescription] = useState(pet.description || '');
  const [latitude, setLatitude] = useState(pet.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(pet.longitude?.toString() || '');
  const [locationDescription, setLocationDescription] = useState(pet.location_description || '');
  const [contactName, setContactName] = useState(pet.contact_name);
  const [contactPhone, setContactPhone] = useState(pet.contact_phone);
  const [contactEmail, setContactEmail] = useState(pet.contact_email || '');
  const [lastSeenDate, setLastSeenDate] = useState(new Date(pet.last_seen_date || '').toISOString().split('T')[0]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!name || !contactName || !contactPhone || !latitude || !longitude) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      let photoUrl = pet.photo_url;

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${pet.user_id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('pet-photos').getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('pets')
        .update({
          name,
          type,
          breed: breed || null,
          color: color || null,
          age: age ? Number.parseInt(age) : null,
          description: description || null,
          photo_url: photoUrl,
          status,
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
          location_description: locationDescription || null,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail || null,
          last_seen_date: lastSeenDate || null,
        })
        .eq('id', pet.id);

      if (updateError) throw updateError;

      router.push('/meus-pets');
      router.refresh();
    } catch (err) {
      toast({
        title: 'Erro ao salvar pet!',
        description: '' + (err instanceof Error ? err.message : 'Ocorreu um erro ao salvar o pet'),
        variant: 'destructive',
      });
    } finally {
      toast({
        title: 'Pet salvo com sucesso!',
        description: 'As informações do pet foram atualizadas.',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Selection */}
      <Card>
        <CardContent className="pt-6">
          <RadioGroup
            label="Status do Pet"
            options={[
              { id: 'LOST', label: 'Perdido - Estou procurando meu pet' },
              { id: 'FOUND', label: 'Encontrado - Encontrei um pet' },
              { id: 'ADOPTION', label: 'Adoção - Disponível para adoção' },
            ]}
            value={status}
            onChange={(value) => setStatus(value as PetStatus)}
          />
        </CardContent>
      </Card>

      {/* Pet Information */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações do Pet</h2>

          <TextInput
            label={`Nome do Pet ${status === 'FOUND' ? '(se souber)' : ''}`}
            placeholder="Ex: Rex, Mimi..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={status !== 'FOUND'}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectDropdown
              label="Tipo de Animal"
              options={[
                { value: 'DOG', label: 'Cachorro' },
                { value: 'CAT', label: 'Gato' },
                { value: 'BIRD', label: 'Pássaro' },
                { value: 'OTHER', label: 'Outro' },
              ]}
              value={type}
              onChange={(value) => setType(value as PetType)}
            />

            <TextInput
              label="Raça (se souber)"
              placeholder="Ex: Labrador, Siamês..."
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <TextInput
              label="Cor predominante"
              placeholder="Ex: Marrom, Preto..."
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Idade (anos)"
              type="number"
              placeholder="Ex: 3"
              value={age}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');

                let numberValue = Number(value);

                if (numberValue < 0) numberValue = 0;
                if (numberValue > 25) numberValue = 25;

                setAge(numberValue.toString());
              }}
              helperText="Aproximada, se não souber exatamente"
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Visto pela última vez</label>
              <input
                type="date"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors focus:border-ring focus:ring-2"
                value={lastSeenDate}
                onChange={(e) => setLastSeenDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
              placeholder="Descreva características marcantes, comportamento, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto do Pet</label>
            <div className="flex flex-col gap-4">
              {photoPreview && (
                <div className="relative h-[50vh] w-full overflow-hidden rounded-xl">
                  <img src={photoPreview || '/placeholder.svg'} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 transition-colors hover:bg-muted/50">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {photoPreview ? 'Clique para alterar a foto' : 'Clique para fazer upload da foto'}
                </span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
            locationDescription={locationDescription}
            onDescriptionChange={setLocationDescription}
          />
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações de Contato</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Nome para contato"
              placeholder="Seu nome"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />

            <TextInput
              label="Telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={contactPhone}
              onChange={(e) => setContactPhone(formatPhoneBR(e.target.value))}
              onBlur={() => {
                if (contactPhone.length < 14) setContactPhone('');
              }}
              required
            />
          </div>

          <TextInput
            label="Email (opcional)"
            type="email"
            placeholder="seu@email.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {/* Submit Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="outline" size="lg" asChild className="flex-1 bg-transparent">
          <Link href="/meus-pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Link>
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1 bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
