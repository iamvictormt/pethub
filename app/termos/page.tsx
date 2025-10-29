import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Termos de Uso | Farejei',
  description: 'Termos de uso da plataforma Farejei',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">Termos de Uso</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="mb-3 text-xl font-semibold">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground">
                Ao acessar e usar a plataforma Farejei, você concorda com estes Termos de Uso. Se você não concordar com
                qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground">
                O Farejei é uma plataforma gratuita que conecta pessoas que perderam ou encontraram animais de
                estimação. Oferecemos:
              </p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Cadastro e busca de pets perdidos e encontrados</li>
                <li>Visualização de pets em mapa interativo</li>
                <li>Sistema de contribuições voluntárias</li>
                <li>Perfis de usuários e pets</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. Cadastro e Conta de Usuário</h2>
              <p className="text-muted-foreground">
                Para usar determinadas funcionalidades, você deve criar uma conta fornecendo informações verdadeiras e
                atualizadas. Você é responsável por:
              </p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Todas as atividades realizadas em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Uso Aceitável</h2>
              <p className="text-muted-foreground mb-2">Você concorda em NÃO:</p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Publicar informações falsas ou enganosas sobre pets</li>
                <li>Usar a plataforma para fins comerciais não autorizados</li>
                <li>Assediar, ameaçar ou prejudicar outros usuários</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Tentar acessar áreas restritas do sistema</li>
                <li>Usar a plataforma para atividades ilegais</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Conteúdo do Usuário</h2>
              <p className="text-muted-foreground">
                Ao publicar fotos, descrições ou qualquer conteúdo na plataforma, você:
              </p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Garante que possui os direitos sobre o conteúdo</li>
                <li>Concede ao Farejei licença para exibir e distribuir o conteúdo na plataforma</li>
                <li>É responsável pela veracidade das informações publicadas</li>
                <li>Concorda que podemos remover conteúdo inadequado sem aviso prévio</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Recompensas</h2>
              <p className="text-muted-foreground">Usuários podem oferecer recompensas por pets perdidos. O Farejei:</p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Não é responsável pelo pagamento de recompensas</li>
                <li>Não medeia disputas sobre recompensas</li>
                <li>Apenas facilita a comunicação entre as partes</li>
                <li>Recomenda acordos claros e documentados entre as partes</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Contribuições Financeiras</h2>
              <p className="text-muted-foreground">
                Contribuições voluntárias são processadas através do Mercado Pago. Os valores arrecadados são destinados
                a:
              </p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Manutenção e melhorias da plataforma</li>
                <li>Distribuição para organizações de proteção animal</li>
                <li>Todas as destinações são divulgadas no Instagram @farejeiapp</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Contribuições não são reembolsáveis, exceto em casos de erro comprovado no processamento.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Isenção de Responsabilidade</h2>
              <p className="text-muted-foreground">O Farejei é fornecido "como está". Não garantimos:</p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Que você encontrará seu pet através da plataforma</li>
                <li>A veracidade das informações publicadas por outros usuários</li>
                <li>Disponibilidade ininterrupta do serviço</li>
                <li>Ausência de erros ou falhas técnicas</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">O Farejei não se responsabiliza por:</p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Danos diretos ou indiretos decorrentes do uso da plataforma</li>
                <li>Interações entre usuários fora da plataforma</li>
                <li>Perda de dados ou informações</li>
                <li>Ações de terceiros</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Modificações dos Termos</h2>
              <p className="text-muted-foreground">
                Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão
                notificadas através da plataforma. O uso continuado após as alterações constitui aceitação dos novos
                termos.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">11. Encerramento</h2>
              <p className="text-muted-foreground">
                Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode encerrar sua conta a
                qualquer momento através das configurações da plataforma.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">12. Lei Aplicável</h2>
              <p className="text-muted-foreground">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas serão
                resolvidas nos tribunais brasileiros.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">13. Contato</h2>
              <p className="text-muted-foreground">
                Para dúvidas sobre estes termos, entre em contato através do Instagram{' '}
                <a
                  href="https://instagram.com/farejeiapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @farejeiapp
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
