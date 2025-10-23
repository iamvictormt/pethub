'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Store, Search, AlertTriangle, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/database';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        setProfile(profileData);
      } else {
        setProfile(null);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();

        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isPetshop = profile?.role === 'PETSHOP';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 py-8 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">PetHub</span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild className="bg-purple-500 text-white hover:bg-purple-500/90">
            <Link href="/pets">
              <Search className="h-4 w-4" />
              Buscar Pets
            </Link>
          </Button>
          {user ? (
            <>
              {isPetshop ? (
                <Button asChild className="bg-blue-pethub text-blue-pethub-foreground hover:bg-blue-pethub/90">
                  <Link href="/anunciar">
                    <Store className="mr-2 h-4 w-4" />
                    Anunciar
                  </Link>
                </Button>
              ) : (
                <Button asChild className="bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90">
                  <Link href="/reportar">
                    <AlertTriangle className="h-4 w-4" />
                    Reportar Pet
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">Meu Perfil</Link>
                  </DropdownMenuItem>
                  {isPetshop ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/meus-anuncios">Meus Anúncios</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/meus-pets">Meus Pets</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-2 p-4">
            {user ? (
              <>
                {isPetshop ? (
                  <Button
                    asChild
                    className="w-full bg-blue-pethub text-blue-pethub-foreground hover:bg-blue-pethub/90"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Link href="/anunciar">
                      <Store className="mr-2 h-4 w-4" />
                      Anunciar
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Link href="/reportar">
                      <AlertTriangle className="h-4 w-4" />
                      Reportar Pet
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Link href="/perfil">Meu Perfil</Link>
                </Button>
                {isPetshop ? (
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Link href="/meus-anuncios">Meus Anúncios</Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Link href="/meus-pets">Meus Pets</Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="bg-green-500 text-white hover:bg-green-500/90">
                  <Link href="/pets">Buscar Pets</Link>
                </Button>

                <Button variant="ghost" asChild className="w-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Link href="/auth/login">Entrar</Link>
                </Button>
                <Button asChild className="w-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Link href="/auth/sign-up">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
