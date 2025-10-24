'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Edit, MapPin, Calendar, Phone, Mail, Camera, Plus, ExternalLink, Eye, EyeOff } from 'lucide-react';
import type { Profile, Advertisement } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateImageFile } from '@/lib/image-validation';
import { formatPhoneBR } from '@/lib/utils';

interface PetshopProfileProps {
  profile: Profile | null;
  advertisements: Advertisement[];
}

export function PetshopProfile({ profile, advertisements }: PetshopProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [state, setState] = useState(profile?.state || '');
  const [city, setCity] = useState(profile?.city || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((s: any) => ({
          value: s.sigla,
          label: s.nome,
        }));
        setStates(formatted);
      })
      .catch((err) => console.error('Erro ao carregar estados:', err));
  }, []);

  useEffect(() => {
    if (!state) return;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((c: any) => ({
          value: c.nome,
          label: c.nome,
        }));
        setCities(formatted);
      })
      .catch((err) => console.error('Erro ao carregar cidades:', err));
  }, [state]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('profile-avatars').upload(fileName, file, {
        upsert: true,
      });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('profile-avatars').getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      router.refresh();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    console.log('[v0] Saving petshop profile:', { name, phone, state, city, bio });

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        phone,
        state,
        city,
        bio,
      })
      .eq('id', profile.id);

    if (error) {
      console.error('[v0] Error saving petshop profile:', error);
      alert('Erro ao salvar perfil: ' + error.message);
      return;
    }

    console.log('[v0] Petshop profile saved successfully');
    setIsEditing(false);
    router.refresh();
  };

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    await supabase.from('advertisements').update({ is_active: !currentStatus }).eq('id', adId);
    router.refresh();
  };

  const activeAds = advertisements.filter((ad) => ad.is_active);
  const inactiveAds = advertisements.filter((ad) => !ad.is_active);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Left Sidebar - Business Stats */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Estatísticas</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-blue-farejei/10 p-3">
                  <span className="text-sm font-medium">Anúncios Ativos</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-farejei text-xs font-bold text-white">
                    {activeAds.length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm font-medium">Anúncios Inativos</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground text-xs font-bold text-white">
                    {inactiveAds.length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-green-found/10 p-3">
                  <span className="text-sm font-medium">Total</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-found text-xs font-bold text-white">
                    {advertisements.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button asChild className="w-full bg-blue-farejei hover:bg-blue-farejei/90">
                  <Link href="/anunciar">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Anúncio
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Logo */}
                <div className="relative mx-auto shrink-0 md:mx-0">
                  <div className="h-32 w-32 overflow-hidden rounded-2xl md:h-40 md:w-40">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl || '/placeholder.svg'}
                        alt={profile?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl md:text-5xl">🏪</div>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute -bottom-2 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl bg-blue-farejei text-white shadow-lg hover:bg-blue-farejei/90 disabled:opacity-50 md:bottom-1 md:right-1 md:h-10 md:w-10 md:translate-x-0 md:left-auto opacity-80 cursor-pointer md:bottom-19"
                      >
                        {isUploadingAvatar ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent md:h-4 md:w-4" />
                        ) : (
                          <Camera className="h-5 w-5 md:h-4 md:w-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Business Info */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-balance text-xl font-bold md:text-2xl">{profile?.name}</h1>
                          <span className="rounded-full bg-blue-farejei/10 px-2 py-1 text-xs font-medium text-blue-farejei">
                            PETSHOP
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{city && state ? `${city}, ${state}` : 'Brasil'}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span className="text-balance">
                            Membro desde {new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:shrink-0">
                        {isEditing ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                              Cancelar
                            </Button>
                            <Button size="sm" className="bg-blue-farejei hover:bg-blue-farejei/90" onClick={handleSave}>
                              Salvar
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 bg-transparent"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Business Description */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h3 className="mb-2 text-sm font-semibold">Sobre o Negócio</h3>
                      {isEditing ? (
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background p-2 text-sm"
                          rows={3}
                          placeholder="Descreva seu petshop, serviços oferecidos, diferenciais..."
                        />
                      ) : (
                        <p className="text-pretty text-sm text-muted-foreground">
                          {bio || 'Petshop dedicado ao bem-estar e felicidade dos seus pets.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Informações de Contato</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  {isEditing ? (
                    <TextInput
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                      onBlur={() => {
                        if (phone.length < 14) setPhone('');
                      }}
                      placeholder="(00) 00000-0000"
                      icon={<Phone className="h-4 w-4" />}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{phone || 'Não informado'}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  {isEditing ? (
                    <SelectDropdown
                      value={state}
                      onChange={(value) => {
                        setState(value);
                        setCity(''); // reseta cidade ao mudar estado
                      }}
                      options={states}
                      placeholder="Selecione o estado"
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{state || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                {/* Cidade */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                  {isEditing ? (
                    <SelectDropdown
                      value={city}
                      onChange={setCity}
                      options={cities}
                      placeholder={state ? 'Selecione a cidade' : 'Selecione o estado primeiro'}
                      disabled={!state}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{city || 'Não informado'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advertisements Grid */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Meus Anúncios ({advertisements.length})</h2>
                <Button asChild size="sm" className="bg-blue-farejei hover:bg-blue-farejei/90">
                  <Link href="/anunciar">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Anúncio
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {advertisements.map((ad) => (
                  <div
                    key={ad.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                  >
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src={ad.image_url || '/placeholder.svg'}
                        alt={ad.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold">{ad.title}</h3>
                        <button
                          onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {ad.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                      {ad.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{ad.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            ad.is_active
                              ? 'bg-green-found/10 text-green-found'
                              : 'bg-muted-foreground/10 text-muted-foreground'
                          }`}
                        >
                          {ad.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                        {ad.link_url && (
                          <a
                            href={ad.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-farejei hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {advertisements.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mb-4 text-6xl">📢</div>
                  <h3 className="mb-2 text-lg font-semibold">Nenhum anúncio ainda</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Crie seu primeiro anúncio para promover seus produtos e serviços
                  </p>
                  <Button asChild className="bg-blue-farejei hover:bg-blue-farejei/90">
                    <Link href="/anunciar">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Anúncio
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
