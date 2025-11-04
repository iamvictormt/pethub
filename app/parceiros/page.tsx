import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Instagram,
  Shield,
  Users,
  Zap,
  TrendingUp,
  ArrowRight,
  HeartHandshake,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ngos = [
  {
    id: 1,
    name: 'Associação Anjos da Rua GO',
    description: 'ONG MÃE Pioneira de Goiânia desde 2018',
    logo: '/associacao-anjos-da-rua.webp?height=120&width=120',
    website: 'https://example.com',
    instagram: '@anjosdaruago',
  },
  {
    id: 2,
    name: 'Adoção Goiânia',
    description: 'Divulgação de pets para adoção em Goiânia e região.',
    logo: '/adotapetsgyn.webp?height=120&width=120',
    website: 'https://example.com',
    instagram: '@adotapetsgyn',
  },
];

export default function ParceirosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-alert/20 bg-orange-alert/10 px-4 py-2 text-sm font-medium text-orange-alert backdrop-blur">
              <HeartHandshake className="h-4 w-4" />
              Nossos parceiros
            </div>
          </div>

          {/* Hero Content */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Juntos por uma{' '}
              <span className="bg-gradient-to-r from-orange-alert via-orange-500 to-blue-farejei bg-clip-text text-transparent">
                causa animal
              </span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Estas organizações compartilham nossa missão de proteger e cuidar dos animais, oferecendo suporte
              essencial ao projeto Farejei e ajudando a reunir pets com suas famílias.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group bg-orange-alert hover:bg-orange-alert/90">
                <Link href="https://instagram.com/farejeiapp" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Seja um Parceiro
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
                <Link href="/contribuir">
                  <Heart className="mr-2 h-5 w-5" />
                  Apoiar o Projeto
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-orange-alert">{ngos.length}+</div>
                <div className="text-sm text-muted-foreground">Parceiros na causa animal</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-farejei">100%</div>
                <div className="text-sm text-muted-foreground">Comprometidas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-500">1000+</div>
                <div className="text-sm text-muted-foreground">Pets Ajudados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Por que as parcerias importam</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Juntos, criamos uma rede de apoio que multiplica o impacto na proteção animal.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-farejei/10">
                <Users className="h-6 w-6 text-blue-farejei" />
              </div>
              <h3 className="mb-2 font-semibold">Alcance Ampliado</h3>
              <p className="text-sm text-muted-foreground">
                Cada parceiro expande nossa rede, alcançando mais pessoas e aumentando as chances de reunir pets com
                suas famílias
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-alert/10">
                <Shield className="h-6 w-6 text-orange-alert" />
              </div>
              <h3 className="mb-2 font-semibold">Credibilidade</h3>
              <p className="text-sm text-muted-foreground">
                Parcerias com ONGs estabelecidas fortalecem a confiança da comunidade no Farejei
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/10">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-2 font-semibold">Recursos Compartilhados</h3>
              <p className="text-sm text-muted-foreground">
                Compartilhamos conhecimento, experiências e recursos para melhorar o bem-estar animal
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/10">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 font-semibold">Impacto Multiplicado</h3>
              <p className="text-sm text-muted-foreground">
                Juntos, conseguimos ajudar mais animais e criar campanhas de conscientização mais efetivas
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Conheça nossos parceiros</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Organizações dedicadas que trabalham incansavelmente pela causa animal.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {ngos.map((ong) => (
              <div
                key={ong.id}
                className="group relative flex flex-col items-center rounded-3xl border-2 border-border bg-background p-8 shadow-sm transition-all hover:border-orange-alert/30 hover:shadow-xl"
              >
                {/* Logo */}
                <div className="relative mb-6 h-48 w-48 shrink-0 overflow-hidden rounded-2xl border-4 border-orange-alert/20 bg-white shadow-md transition-all group-hover:scale-110 group-hover:border-orange-alert/40 group-hover:shadow-lg">
                  <Image
                    src={ong.logo || '/placeholder.svg'}
                    alt={`Logo ${ong.name}`}
                    fill
                    className="object-cover p-2"
                  />
                </div>

                {/* Name */}
                <h3 className="mb-3 text-center text-xl font-bold leading-tight">{ong.name}</h3>

                {/* Description */}
                <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {ong.description}
                </p>

                {/* Instagram - Prominent */}
                <Link
                  href={`https://instagram.com/${ong.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <Instagram className="h-5 w-5" />
                  {ong.instagram}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-gradient-to-br from-orange-alert via-orange-alert/90 to-orange-alert/80 px-4 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <Handshake className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Seja uma ONG parceira do Farejei</h2>
          <p className="mb-8 text-lg text-orange-50 md:text-xl">
            Nosso propósito é unir forças com ONGs e protetores que acreditam no poder da comunidade. Ao se tornar
            parceira, sua ONG ajuda a divulgar o Farejei e ganha destaque aqui no site como parte da nossa rede de apoio
            à causa animal.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-orange-alert hover:bg-white/90">
              <Link href="https://instagram.com/farejeiapp" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 h-5 w-5" />
                Fale Conosco
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contribuir">
                <Heart className="mr-2 h-5 w-5" />
                Apoiar o Projeto
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
