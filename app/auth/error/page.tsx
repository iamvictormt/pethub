import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-center text-2xl">Ops! Algo deu errado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-center text-sm text-muted-foreground">Erro: {params.error}</p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Ocorreu um erro não especificado.</p>
            )}
            <Button asChild className="w-full">
              <Link href="/auth/login">Tentar novamente</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
