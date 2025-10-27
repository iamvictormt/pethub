'use client';

import type React from 'react';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput } from '@/components/ui/text-input';
import { RadioGroup } from '@/components/ui/radio-group';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { formatPhoneBR } from '@/lib/utils';
import { validateImageFile } from '@/lib/image-validation';
import { toast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Arquivo inválido');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Verificar se o email já existe ANTES de tentar criar
      const { data: existingUser } = await supabase.from('profiles').select('id').eq('email', email).single();

      if (existingUser) {
        toast({
          title: 'Erro ao criar conta!',
          description: 'Este email já está cadastrado. Por favor, faça login ou use outro email.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/confirm`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            phone,
            role,
          },
        },
      });

      if (authError) throw authError;

      // Verificar se o usuário foi realmente criado
      if (!authData.user) {
        throw new Error('Não foi possível criar a conta. O email pode já estar em uso.');
      }

      let avatarUrl = null;
      if (avatarFile && authData.user) {
        setIsUploadingAvatar(true);
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${authData.user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('profile-avatars').getPublicUrl(fileName);
          avatarUrl = publicUrl;

          await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', authData.user.id);
        }
        setIsUploadingAvatar(false);
      }

      // 2. Toast de sucesso APENAS aqui, dentro do try
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Faça login para continuar.',
      });

      router.push('/auth/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message.includes('already registered') ||
          error.message.includes('User already registered') ||
          error.message.includes('duplicate') ||
          error.message.includes('já estar em uso')
        ) {
          toast({
            title: 'Erro ao criar conta!',
            description: 'Este email já está cadastrado. Por favor, faça login ou use outro email.',
            variant: 'destructive',
          });
        } else if (error.message.includes('Invalid email')) {
          toast({
            title: 'Erro ao criar conta!',
            description: 'Email inválido. Por favor, verifique o endereço de email.',
            variant: 'destructive',
          });
        } else if (error.message.includes('Password')) {
          toast({
            title: 'Erro ao criar conta!',
            description: 'A senha deve ter pelo menos 6 caracteres.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro ao criar conta!',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Erro ao criar conta!',
          description: 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
          variant: 'destructive',
        });
      }
    } finally {
      // 3. No finally, apenas resetar o loading
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Crie sua conta</CardTitle>
            <CardDescription className="text-center">Junte-se à comunidade Farejei</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview || '/placeholder.svg'}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">👤</div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-alert text-white shadow-lg hover:bg-orange-alert/90 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Foto de perfil (opcional)</p>
              </div>

              <TextInput
                label="Nome completo"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <TextInput
                  label="Telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                  onBlur={() => {
                    if (phone.length < 14) setPhone('');
                  }}
                  required
                />
              </div>

              {/* <RadioGroup
                label="Tipo de conta"
                options={[
                  { id: 'USER', label: 'Tutor de Pet' },
                  { id: 'PETSHOP', label: 'Petshop / Prestador de Serviço' },
                ]}
                value={role}
                onChange={setRole}
              /> */}

              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  helperText="Mínimo de 6 caracteres"
                />

                <TextInput
                  label="Confirmar senha"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
                disabled={isLoading || isUploadingAvatar}
              >
                {isLoading || isUploadingAvatar ? (
                  <span className="flex items-center gap-2">
                    {isUploadingAvatar ? 'Enviando foto...' : 'Criando conta...'}
                  </span>
                ) : (
                  'Criar conta'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="font-medium text-orange-alert hover:underline">
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
