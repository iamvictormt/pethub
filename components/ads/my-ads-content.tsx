'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import type { Advertisement, Profile } from '@/lib/types/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MyAdsContentProps {
  profile: Profile;
  ads: Advertisement[];
}

export function MyAdsContent({ profile, ads: initialAds }: MyAdsContentProps) {
  const [ads, setAds] = useState(initialAds);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const activeAds = ads.filter((ad) => ad.is_active).length;
  const inactiveAds = ads.filter((ad) => !ad.is_active).length;

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('advertisements').update({ is_active: !currentStatus }).eq('id', adId);

    if (!error) {
      setAds(ads.map((ad) => (ad.id === adId ? { ...ad, is_active: !currentStatus } : ad)));
    }
  };

  const deleteAd = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from('advertisements').delete().eq('id', deleteId);

    if (!error) {
      setAds(ads.filter((ad) => ad.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Anúncios</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus anúncios publicitários</p>
        </div>
        <Button asChild size="lg">
          <Link href="/anunciar">
            <Plus className="h-5 w-5" />
            Criar Anúncio
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Anúncios</p>
              <p className="text-3xl font-bold mt-1">{ads.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anúncios Ativos</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{activeAds}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anúncios Inativos</p>
              <p className="text-3xl font-bold mt-1 text-gray-500">{inactiveAds}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <EyeOff className="h-6 w-6 text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Ads Grid */}
      {ads.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum anúncio criado</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro anúncio para promover seus serviços
            </p>
            <Button asChild>
              <Link href="/anunciar">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Anúncio
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden group">
              <div className="relative aspect-video bg-muted">
                <Image src={ad.image_url || '/placeholder.svg'} alt={ad.title} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={ad.is_active ? 'default' : 'secondary'}
                    className={ad.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}
                  >
                    {ad.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{ad.title}</h3>
                {ad.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ad.description}</p>}

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleAdStatus(ad.id, ad.is_active)}>
                    {ad.is_active ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Ativar
                      </>
                    )}
                  </Button>

                  {ad.link_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Link
                      </a>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive bg-transparent"
                    onClick={() => setDeleteId(ad.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  Criado em {new Date(ad.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O anúncio será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAd} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
