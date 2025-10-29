import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Farejei',
  description: 'Política de privacidade da plataforma Farejei',
};

export default function PrivacidadePage() {
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
          <h1 className="mb-2 text-3xl font-bold">Política de Privacidade</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="mb-3 text-xl font-semibold">1. Introdução</h2>
              <p className="text-muted-foreground">
                O Farejei respeita sua privacidade e está comprometido em proteger seus dados pessoais. Esta política
                explica como coletamos, usamos, armazenamos e protegemos suas informações de acordo com a Lei Geral de
                Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Dados Coletados</h2>
              <p className="text-muted-foreground mb-2">Coletamos os seguintes tipos de dados:</p>

              <h3 className="mb-2 mt-4 font-semibold">2.1. Dados de Cadastro</h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Senha (armazenada de forma criptografada)</li>
                <li>Telefone (opcional)</li>
              </ul>

              <h3 className="mb-2 mt-4 font-semibold">2.2. Dados de Pets</h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Fotos do animal</li>
                <li>Nome, espécie, raça, cor e características</li>
                <li>Localização aproximada (coordenadas geográficas)</li>
                <li>Data e circunstâncias do desaparecimento/encontro</li>
                <li>Informações de recompensa (se aplicável)</li>
              </ul>

              <h3 className="mb-2 mt-4 font-semibold">2.3. Dados de Uso</h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de navegação</li>
                <li>Interações com a plataforma</li>
              </ul>

              <h3 className="mb-2 mt-4 font-semibold">2.4. Dados de Pagamento</h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Informações de contribuições (valor, data)</li>
                <li>Dados de pagamento processados pelo Mercado Pago (não armazenamos dados de cartão)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. Como Usamos Seus Dados</h2>
              <p className="text-muted-foreground mb-2">Utilizamos seus dados para:</p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Criar e gerenciar sua conta</li>
                <li>Publicar e exibir informações sobre pets perdidos/encontrados</li>
                <li>Facilitar a comunicação entre usuários</li>
                <li>Processar contribuições financeiras</li>
                <li>Melhorar a experiência e funcionalidades da plataforma</li>
                <li>Enviar notificações importantes sobre o serviço</li>
                <li>Cumprir obrigações legais</li>
                <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Base Legal para Processamento</h2>
              <p className="text-muted-foreground">Processamos seus dados com base em:</p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Consentimento:</strong> Ao criar uma conta e usar a plataforma
                </li>
                <li>
                  <strong>Execução de contrato:</strong> Para fornecer os serviços solicitados
                </li>
                <li>
                  <strong>Legítimo interesse:</strong> Para melhorar nossos serviços e prevenir fraudes
                </li>
                <li>
                  <strong>Obrigação legal:</strong> Quando exigido por lei
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Compartilhamento de Dados</h2>
              <p className="text-muted-foreground mb-2">Compartilhamos seus dados apenas quando necessário:</p>

              <h3 className="mb-2 mt-4 font-semibold">5.1. Informações Públicas</h3>
              <p className="text-muted-foreground">
                Informações sobre pets (fotos, localização, descrição) são públicas e visíveis para todos os usuários da
                plataforma.
              </p>

              <h3 className="mb-2 mt-4 font-semibold">5.2. Prestadores de Serviço</h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Supabase:</strong> Hospedagem de banco de dados e autenticação
                </li>
                <li>
                  <strong>Mercado Pago:</strong> Processamento de pagamentos
                </li>
                <li>
                  <strong>Vercel:</strong> Hospedagem da plataforma
                </li>
              </ul>

              <h3 className="mb-2 mt-4 font-semibold">5.3. Requisitos Legais</h3>
              <p className="text-muted-foreground">
                Podemos divulgar dados quando exigido por lei, ordem judicial ou autoridades competentes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Armazenamento e Segurança</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Criptografia de senhas</li>
                <li>Conexões HTTPS seguras</li>
                <li>Controles de acesso restritos</li>
                <li>Monitoramento de segurança</li>
                <li>Backups regulares</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Seus dados são armazenados em servidores seguros e mantidos pelo tempo necessário para cumprir as
                finalidades descritas nesta política ou conforme exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground mb-2">Você tem direito a:</p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Confirmação e acesso:</strong> Saber se processamos seus dados e acessá-los
                </li>
                <li>
                  <strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados
                </li>
                <li>
                  <strong>Anonimização ou exclusão:</strong> Solicitar a remoção de dados desnecessários
                </li>
                <li>
                  <strong>Portabilidade:</strong> Receber seus dados em formato estruturado
                </li>
                <li>
                  <strong>Revogação de consentimento:</strong> Retirar seu consentimento a qualquer momento
                </li>
                <li>
                  <strong>Oposição:</strong> Opor-se ao processamento de dados
                </li>
                <li>
                  <strong>Informação sobre compartilhamento:</strong> Saber com quem compartilhamos seus dados
                </li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Para exercer seus direitos, entre em contato através do Instagram @farejeiapp.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground">Utilizamos cookies e tecnologias similares para:</p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>Manter você conectado à sua conta</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso da plataforma</li>
                <li>Melhorar a experiência do usuário</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Dados de Menores</h2>
              <p className="text-muted-foreground">
                Nossa plataforma não é direcionada a menores de 18 anos. Se você é menor de idade, deve usar a
                plataforma apenas com supervisão de um responsável legal. Não coletamos intencionalmente dados de
                menores sem consentimento dos pais ou responsáveis.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Transferência Internacional de Dados</h2>
              <p className="text-muted-foreground">
                Alguns de nossos prestadores de serviço podem estar localizados fora do Brasil. Garantimos que essas
                transferências sejam realizadas com medidas de segurança adequadas e em conformidade com a LGPD.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">11. Alterações nesta Política</h2>
              <p className="text-muted-foreground">
                Podemos atualizar esta política periodicamente. Alterações significativas serão notificadas através da
                plataforma ou por e-mail. A data da última atualização está indicada no topo desta página.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">12. Encarregado de Dados (DPO)</h2>
              <p className="text-muted-foreground">
                Para questões relacionadas à proteção de dados pessoais, entre em contato com nosso encarregado:
              </p>
              <p className="mt-2 text-muted-foreground">
                <strong>Victor Monteiro Torres</strong>
                <br />
                Instagram:{' '}
                <a
                  href="https://instagram.com/farejeiapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @farejeiapp
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">13. Contato</h2>
              <p className="text-muted-foreground">
                Para dúvidas, solicitações ou reclamações sobre esta política de privacidade, entre em contato através
                do Instagram{' '}
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
