interface MercadoPagoPaymentRequest {
  transaction_amount: number;
  description: string;
  payment_method_id: 'pix';
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  notification_url?: string;
  external_reference?: string;
  date_of_expiration?: string;
}

interface MercadoPagoPaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  description: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
  date_created: string;
  date_approved?: string;
  date_of_expiration?: string;
}

interface MercadoPagoError {
  message: string;
  error: string;
  status: number;
  cause?: Array<{
    code: string;
    description: string;
  }>;
}

export class MercadoPagoClient {
  private accessToken: string;
  private baseUrl = 'https://api.mercadopago.com';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.validateAccessToken();
  }

  private validateAccessToken() {
    if (!this.accessToken || this.accessToken.trim() === '') {
      throw new Error('Access Token do Mercado Pago é obrigatório');
    }

    // Verifica se não está usando token de teste em produção
    if (process.env.NODE_ENV === 'production' && this.accessToken.startsWith('TEST-')) {
      console.warn('⚠️ AVISO: Usando Access Token de TESTE em produção!');
    }
  }

  async createPixPayment(
    amount: number,
    description: string,
    payerEmail: string,
    payerName?: string,
    externalReference?: string
  ): Promise<MercadoPagoPaymentResponse> {
    // Validações básicas
    if (amount <= 0) {
      throw new Error('O valor deve ser maior que zero');
    }

    if (!payerEmail || !this.isValidEmail(payerEmail)) {
      throw new Error('Email do pagador inválido');
    }

    if (!description || description.trim() === '') {
      throw new Error('Descrição é obrigatória');
    }

    // Generate unique idempotency key to prevent duplicate payments
    const idempotencyKey = `pix-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Data de expiração: 30 minutos a partir de agora
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    const payload: MercadoPagoPaymentRequest = {
      transaction_amount: Number(amount.toFixed(2)),
      description: description.substring(0, 255),
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
        first_name: payerName || 'Cliente',
      },
      date_of_expiration: expirationDate.toISOString(),
    };

    // Adicionar referência externa se fornecida
    if (externalReference) {
      payload.external_reference = externalReference;
    }

    // Add notification URL if available
    if (process.env.NEXT_PUBLIC_APP_URL) {
      payload.notification_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`;
    }

    console.log('🔵 Criando pagamento PIX no Mercado Pago:', {
      amount: payload.transaction_amount,
      description: payload.description,
      email: payerEmail,
      expiration: payload.date_of_expiration,
    });

    try {
      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data as MercadoPagoError;
        console.error('❌ Erro Mercado Pago API:', {
          status: response.status,
          message: error.message,
          cause: error.cause,
          fullError: data,
        });

        // Mensagens de erro específicas
        if (response.status === 401) {
          throw new Error('Access Token inválido ou expirado. Verifique suas credenciais no painel do Mercado Pago.');
        }

        if (response.status === 400) {
          const causes = error.cause?.map((c) => c.description).join(', ') || error.message;

          // Erro específico de chave PIX não encontrada
          if (causes.includes('pix') || causes.includes('key') || causes.includes('chave')) {
            throw new Error(
              '⚠️ CHAVE PIX NÃO CONFIGURADA: Acesse sua conta Mercado Pago → ' +
                'Configurações → Chaves PIX e cadastre uma chave PIX. ' +
                'Sem isso, o QR Code não pode ser gerado.'
            );
          }

          throw new Error(`Dados inválidos: ${causes}`);
        }

        if (response.status === 403) {
          throw new Error('Acesso negado. Verifique se o Access Token tem permissões para criar pagamentos PIX.');
        }

        throw new Error(`Erro Mercado Pago (${response.status}): ${error.message || response.statusText}`);
      }

      const payment = data as MercadoPagoPaymentResponse;

      // Validar se o QR Code foi gerado
      if (!payment.point_of_interaction?.transaction_data?.qr_code) {
        console.error('❌ QR Code não foi gerado na resposta:', payment);
        throw new Error(
          'QR Code PIX não foi gerado. Possíveis causas:\n' +
            '1. Chave PIX não cadastrada na conta Mercado Pago\n' +
            '2. Conta sem permissão para receber PIX\n' +
            '3. Problema temporário na API'
        );
      }

      // Validar formato do QR Code
      const qrCode = payment.point_of_interaction.transaction_data.qr_code;
      if (qrCode.length < 50) {
        console.error('❌ QR Code com formato suspeito (muito curto):', qrCode.length);
        throw new Error('QR Code gerado está incompleto ou inválido');
      }

      console.log('✅ Pagamento PIX criado com sucesso:', {
        id: payment.id,
        status: payment.status,
        qr_code_length: qrCode.length,
        qr_code_preview: qrCode.substring(0, 50) + '...',
        has_qr_code_base64: !!payment.point_of_interaction.transaction_data.qr_code_base64,
        expiration: payment.date_of_expiration,
      });

      return payment;
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Erro ao criar pagamento:', error.message);
        throw error;
      }
      throw new Error('Erro desconhecido ao criar pagamento PIX');
    }
  }

  async getPayment(paymentId: string): Promise<MercadoPagoPaymentResponse> {
    if (!paymentId) {
      throw new Error('ID do pagamento é obrigatório');
    }

    console.log('🔍 Consultando pagamento:', paymentId);

    const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro ao consultar pagamento:', error);
      throw new Error(`Falha ao consultar pagamento: ${response.statusText}`);
    }

    const payment = await response.json();
    console.log('✅ Pagamento consultado:', {
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    });

    return payment;
  }

  // Verifica se o pagamento ainda está válido (não expirou)
  isPaymentValid(payment: MercadoPagoPaymentResponse): boolean {
    if (payment.status !== 'pending') {
      return false;
    }

    if (payment.date_of_expiration) {
      const expirationDate = new Date(payment.date_of_expiration);
      const now = new Date();
      return now < expirationDate;
    }

    // Se não tem data de expiração, verifica se foi criado há menos de 30 minutos
    const createdDate = new Date(payment.date_created);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return createdDate > thirtyMinutesAgo;
  }

  // Testa se a configuração do Mercado Pago está correta
  async testConfiguration(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🧪 Testando configuração do Mercado Pago...');

      // Tenta criar um pagamento de teste com valor mínimo
      const testPayment = await this.createPixPayment(
        0.01, // R$ 0,01
        'Teste de configuração',
        'test@example.com',
        'Teste'
      );

      return {
        success: true,
        message: 'Configuração OK! Chave PIX está funcionando.',
        details: {
          paymentId: testPayment.id,
          qrCodeGenerated: !!testPayment.point_of_interaction?.transaction_data?.qr_code,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export function getMercadoPagoClient(): MercadoPagoClient {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      '❌ MERCADOPAGO_ACCESS_TOKEN não configurado!\n\n' +
        '1. Acesse: https://www.mercadopago.com.br/developers/panel/app\n' +
        '2. Crie ou selecione uma aplicação\n' +
        '3. Copie o Access Token de PRODUÇÃO\n' +
        '4. Adicione no arquivo .env.local:\n' +
        '   MERCADOPAGO_ACCESS_TOKEN=APP-xxxxxxxx'
    );
  }

  return new MercadoPagoClient(accessToken);
}

// Função auxiliar para formatar o QR Code para exibição
export function formatPixQrCode(qrCode: string): string {
  // Remove espaços e quebras de linha que podem causar problemas
  return qrCode.trim().replace(/\s+/g, '');
}

// Função para validar se o QR Code tem formato PIX válido
export function isValidPixQrCode(qrCode: string): boolean {
  // QR Code PIX deve começar com identificadores específicos
  const cleanQrCode = formatPixQrCode(qrCode);

  // Validações básicas
  if (cleanQrCode.length < 50) return false;

  // QR Code PIX geralmente começa com esses padrões
  const pixPatterns = [
    /^00020126/, // Padrão EMV QR Code
    /^00020101/, // Outro padrão comum
  ];

  return pixPatterns.some((pattern) => pattern.test(cleanQrCode));
}
