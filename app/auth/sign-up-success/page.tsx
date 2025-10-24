import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-found/10">
              <Mail className="h-8 w-8 text-green-found" />
            </div>
            <CardTitle className="text-center text-2xl">Verifique seu email!</CardTitle>
            <CardDescription className="text-center">Enviamos um link de confirmação para seu email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Clique no link que enviamos para confirmar sua conta e começar a usar o Farejei.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Voltar para o início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
