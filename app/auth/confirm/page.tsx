'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AuthConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('[v0] Auth confirmation error:', error);
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        if (user) {
          console.log('[v0] User confirmed successfully:', user.id);
          setStatus('success');

          // Redirect to home after 2 seconds
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage('Não foi possível confirmar sua conta');
        }
      } catch (err) {
        console.error('[v0] Unexpected error during confirmation:', err);
        setStatus('error');
        setErrorMessage('Ocorreu um erro inesperado');
      }
    };

    handleEmailConfirmation();
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl md:h-16 md:w-16 bg-gradient-to-br from-orange-50 to-blue-50">
              {status === 'loading' && <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-orange-alert" />}
              {status === 'success' && <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-green-found" />}
              {status === 'error' && <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500" />}
            </div>
            <CardTitle className="text-center text-xl md:text-2xl">
              {status === 'loading' && 'Confirmando sua conta...'}
              {status === 'success' && 'Conta confirmada!'}
              {status === 'error' && 'Erro na confirmação'}
            </CardTitle>
            <CardDescription className="text-center text-sm md:text-base">
              {status === 'loading' && 'Aguarde enquanto confirmamos seu email'}
              {status === 'success' && 'Você será redirecionado em instantes'}
              {status === 'error' && errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'success' && (
              <p className="text-center text-sm text-muted-foreground">
                Bem-vindo ao PetHub! Sua conta foi confirmada com sucesso.
              </p>
            )}
            {status === 'error' && (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Tente fazer login novamente ou entre em contato com o suporte.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/login">Ir para Login</Link>
                </Button>
              </div>
            )}
            {status === 'loading' && (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
