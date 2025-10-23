"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, Store, AlertTriangle, Search, Heart, Users, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types/database"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isPetshop = profile?.role === "PETSHOP"

  const navLinks = [
    { href: "/pets", label: "Buscar Pets", icon: Search },
    { href: "/contribuir", label: "Contribuir", icon: Heart },
    { href: "/contribuintes", label: "Contribuintes", icon: Users },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src="/logo-pethub.png" alt="PetHub Logo" className="h-12 w-12" />
          <span className="text-xl font-bold tracking-tight">PetHub</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-orange-alert/10 text-orange-alert"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isPetshop ? (
                <Button asChild size="sm" className="bg-blue-pethub hover:bg-blue-pethub/90">
                  <Link href="/anunciar">
                    <Store className="mr-2 h-4 w-4" />
                    Anunciar
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm" className="bg-orange-alert hover:bg-orange-alert/90">
                  <Link href="/reportar">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reportar
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  {isPetshop ? (
                    <DropdownMenuItem asChild>
                      <Link href="/meus-anuncios" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        Meus Anúncios
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/meus-pets" className="cursor-pointer">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Meus Pets
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/auth/login" className="cursor-pointer">
                    Entrar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/sign-up" className="cursor-pointer">
                    Cadastrar
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container mx-auto space-y-1 p-4">
            {/* Mobile Nav Links */}
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-alert/10 text-orange-alert"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}

            <div className="my-3 border-t" />

            {/* Mobile User Actions */}
            {user ? (
              <>
                {isPetshop ? (
                  <Button
                    asChild
                    className="w-full justify-start bg-blue-pethub hover:bg-blue-pethub/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/anunciar">
                      <Store className="mr-2 h-4 w-4" />
                      Anunciar
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full justify-start bg-orange-alert hover:bg-orange-alert/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/reportar">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Reportar Pet
                    </Link>
                  </Button>
                )}

                <Link
                  href="/perfil"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Meu Perfil
                </Link>

                {isPetshop ? (
                  <Link
                    href="/meus-anuncios"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Store className="h-4 w-4" />
                    Meus Anúncios
                  </Link>
                ) : (
                  <Link
                    href="/meus-pets"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Meus Pets
                  </Link>
                )}

                <button
                  onClick={async () => {
                    await handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 "
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Entrar
                </Link>
                <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/auth/sign-up">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
