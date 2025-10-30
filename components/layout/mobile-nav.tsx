'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Bell, User, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/database';

export function MobileNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

  const isPetshop = profile?.role === 'PETSHOP';

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Início',
    },
    {
      href: '/pets',
      icon: Search,
      label: 'Pets',
    },
    isPetshop
      ? {
          href: '/anunciar',
          icon: Store,
          label: 'Anunciar',
          highlight: true,
        }
      : {
          href: '/reportar',
          icon: PlusCircle,
          label: 'Reportar',
          highlight: true,
        },
    {
      href: user ? '/perfil' : '/auth/login',
      icon: User,
      label: 'Perfil',
    },
  ];

  if (!user) {
    return;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors',
                isActive ? 'text-orange-alert' : 'text-muted-foreground hover:text-foreground',
                item.highlight && 'text-orange-alert'
              )}
            >
              <Icon className={cn('h-6 w-6', item.highlight && 'h-7 w-7')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
