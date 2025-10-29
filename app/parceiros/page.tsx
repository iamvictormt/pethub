"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ExternalLink,
  Heart,
  Instagram,
  Shield,
  Users,
  Zap,
  TrendingUp,
  ArrowRight,
  HeartHandshake,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const parceiros = [
  {
    id: 1,
    name: "Associação Anjos da Rua GO",
    description: "Pioneira em Goiânia desde 2018, dedicada à castração e cuidado responsável com os animais.",
    logo: "/placeholder.svg?height=120&width=120",
    website: "https://www.vakinha.com.br/5772910?utm_campaign=whatsapp&utm_medium=webs",
    instagram: "@anjosdaruago",
    extraInfo: [
      "ONG MÃE Pioneira de Goiânia desde 2018",
      "Mais de 3000 animais castrados",
      "Não resgatamos animais",
      "Doações: PIX CNPJ 41.515.904/0001-37",
    ],
  },
  {
    id: 2,
    name: "Associação Anjos da Rua GO",
    description:
      "Dedicada ao resgate e proteção de animais abandonados, promovendo adoção responsável e conscientização sobre bem-estar animal.",
    logo: "/placeholder.svg?height=120&width=120",
    website: "https://example.com",
    instagram: "@amigosanimais",
  },
  {
    id: 3,
    name: "Instituto Proteção Pet",
    description:
      "Trabalha na proteção e defesa dos direitos dos animais, oferecendo abrigo temporário e cuidados veterinários para pets em situação de risco.",
    logo: "/placeholder.svg?height=120&width=120",
    website: "https://example.com",
    instagram: "@protecaopet",
  },
  {
    id: 4,
    name: "Lar dos Bichos",
    description:
      "Mantém um abrigo para animais resgatados, promovendo campanhas de castração e educação sobre posse responsável de pets.",
    logo: "/placeholder.svg?height=120&width=120",
    website: "https://example.com",
    instagram: "@lardosbichos",
  },
  {
    id: 5,
    name: "Patinhas Solidárias",
    description:
      "Focada em resgatar animais de rua e encontrar lares amorosos, além de oferecer suporte médico e alimentação para pets carentes.",
    logo: "/placeholder.svg?height=120&width=120",
    website: "https://example.com",
    instagram: "@patinhassolidarias",
  },
]

export default function ParceirosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-alert/20 bg-orange-alert/10 px-4 py-2 text-sm font-medium text-orange-alert backdrop-blur">
              <Heart className="h-4 w-4" fill="currentColor" />
              Nossos parceiros
            </div>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Juntos por uma{" "}
            <span className="bg-gradient-to-r from-orange-alert via-orange-500 to-blue-farejei bg-clip-text text-transparent">
              causa animal
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Estas organizações compartilham nossa missão de proteger e cuidar dos animais, oferecendo suporte essencial
            ao projeto Farejei e ajudando a reunir pets com suas famílias.
          </p>

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

          <div className="mt-12 grid grid-cols-3 gap-6 pt-8">
            <div>
              <div className="text-3xl font-bold text-orange-alert">{parceiros.length}+</div>
              <div className="text-sm text-muted-foreground">ONGs Parceiras</div>
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
      </section>

      {/* PARCEIROS */}
      <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Conheça nossos parceiros</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Organizações dedicadas que trabalham incansavelmente pela causa animal.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {parceiros.map((ong) => (
              <div
                key={ong.id}
                className="group rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-6 flex items-start gap-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-orange-alert/20 bg-white shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src={ong.logo || "/placeholder.svg"}
                      alt={`Logo ${ong.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold">{ong.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{ong.description}</p>
                    {ong.extraInfo && (
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {ong.extraInfo.map((info, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{info}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={ong.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-orange-alert/20 bg-orange-alert/5 px-4 py-2 text-sm font-medium text-orange-alert transition-all hover:bg-orange-alert hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visitar Site
                  </Link>

                  <Link
                    href={`https://instagram.com/${ong.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-farejei/20 bg-blue-farejei/5 px-4 py-2 text-sm font-medium text-blue-farejei transition-all hover:bg-blue-farejei hover:text-white"
                  >
                    <Instagram className="h-4 w-4" />
                    {ong.instagram}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="border-t bg-gradient-to-br from-orange-alert via-orange-alert/90 to-orange-alert/80 px-4 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <HeartHandshake className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Quer fazer parte dessa rede?</h2>
          <p className="mb-8 text-lg text-orange-50 md:text-xl">
            Se sua ONG trabalha com proteção animal e gostaria de apoiar o Farejei, entre em contato conosco. Juntos,
            podemos fazer ainda mais pela causa animal.
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
  )
}
