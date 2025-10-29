import Link from 'next/link';
import { Instagram, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-br from-background via-orange-alert/5 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(251,146,60,0.03),transparent_50%)]" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Link href="/" className="group flex items-center gap-2">
                <img
                  src="/farejei.svg"
                  alt="Farejei Logo"
                  className="h-full w-30 transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">Conectando pets perdidos com seus tutores</p>
          </div>

          {/* Social */}
          <div className="flex items-center justify-center">
            <Link
              href="https://instagram.com/farejeiapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-alert/10 text-orange-alert px-6 py-3 text-sm font-semibold transition-all hover:scale-105"
            >
              <Instagram className="h-4 w-4" />
              @farejeiapp
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <Link href="/termos" className="text-sm text-muted-foreground transition-colors hover:text-orange-alert">
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-sm text-muted-foreground transition-colors hover:text-orange-alert"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Farejei. Feito com{' '}
            <Heart className="inline h-3.5 w-3.5 fill-orange-alert text-orange-alert" /> para os pets
          </p>
        </div>
      </div>
    </footer>
  );
}
