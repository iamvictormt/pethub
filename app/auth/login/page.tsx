'use client';

import type React from 'react';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput } from '@/components/ui/text-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Email not confirmed') {
          toast({
            title: 'Email não confirmado',
            description: 'Por favor, verifique seu email e confirme sua conta antes de entrar.',
            variant: 'destructive',
          });
          return;
        } else if (error.message === 'Invalid login credentials') {
          toast({
            title: 'Credenciais inválidas',
            description: 'O email ou a senha estão incorretos. Tente novamente.',
            variant: 'destructive',
          });
          return;
        } else {
          toast({
            title: 'Erro ao entrar',
            description: error.message || 'Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.',
            variant: 'destructive',
          });
          return;
        }
      }
    } finally {
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo!',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex md:h-36 md:w-36 h-20 w-20 items-center justify-center ">
              <img src="/farejei-icon.png" alt="Farejei Logo" className="object-contain" />
            </div>
            <CardTitle className="text-center text-2xl">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-center">Entre com sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <TextInput
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextInput
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/auth/sign-up" className="font-medium text-orange-alert hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
