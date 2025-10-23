"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl md:h-16 md:w-16 bg-gradient-to-br from-orange-50 to-blue-50">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-orange-alert" />
            </div>
            <CardTitle className="text-center text-xl md:text-2xl">Confirmando sua conta...</CardTitle>
            <CardDescription className="text-center text-sm md:text-base">
              Você será redirecionado em instantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Bem-vindo ao PetHub! Sua conta foi confirmada com sucesso.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
