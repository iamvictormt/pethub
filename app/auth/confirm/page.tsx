'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AuthConfirmPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const confirmTimer = setTimeout(() => setConfirmed(true), 1200);
    const redirectTimer = setTimeout(() => {
      router.push('/');
      toast({
        title: 'Conta confirmada!',
        description: 'Sua conta foi confirmada com sucesso. Bem-vindo ao PetHub!',
      });
    }, 2500);

    return () => {
      clearTimeout(confirmTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50">
              <AnimatePresence mode="wait">
                {!confirmed ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-orange-alert" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CardTitle className="text-center text-xl md:text-2xl">
              {confirmed ? 'Conta confirmada!' : 'Confirmando sua conta...'}
            </CardTitle>

            <CardDescription className="text-center text-sm md:text-base">
              {confirmed
                ? 'Tudo pronto! Você será redirecionado em instantes.'
                : 'Você será redirecionado em instantes'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              {confirmed
                ? 'Bem-vindo ao PetHub! Sua conta foi confirmada com sucesso.'
                : 'Estamos validando suas informações...'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
