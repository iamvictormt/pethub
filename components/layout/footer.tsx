import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Sobre o PetHub</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma comunitária para reunir pets perdidos com seus donos e conectar tutores aos melhores serviços
              pet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/como-funciona" className="text-muted-foreground hover:text-foreground">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/dicas" className="text-muted-foreground hover:text-foreground">
                  Dicas de Segurança
                </Link>
              </li>
              <li>
                <Link href="/historias" className="text-muted-foreground hover:text-foreground">
                  Histórias de Sucesso
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-foreground">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-muted-foreground hover:text-foreground">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@pethub.com.br</li>
              <li>(11) 9999-9999</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PetHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
