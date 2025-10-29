'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, DollarSign, AlertCircle, Coins } from 'lucide-react';
import PixCheckout from './pix-checkout';

const MINIMUM_AMOUNT = 500; // R$ 5.00 in cents
const SUGGESTED_AMOUNTS = [1000, 2500, 5000, 10000]; // R$ 10, 25, 50, 100

interface ContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContributionDialog({ open, onOpenChange }: ContributionDialogProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [contributorName, setContributorName] = useState<string>('');
  const [contributorEmail, setContributorEmail] = useState<string>('');
  const [amountInCents, setAmountInCents] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    setCustomAmount('');
    setContributorName('');
    setContributorEmail('');
    setAmountInCents(null);
    setError('');
    onOpenChange(false);
  };

  const handleAmountChange = (value: string) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, '');

    // Converte para número e divide por 100 para inserir vírgula
    const floatValue = Number.parseFloat(numericValue) / 100;

    // Se não tiver valor, reseta
    if (!numericValue) {
      setCustomAmount('');
      return;
    }

    // Formata em formato brasileiro de moeda
    const formatted = floatValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setCustomAmount(formatted);

    // Validação simples
    if (floatValue < 5) {
      setError('O valor mínimo é R$ 5,00');
    } else {
      setError('');
    }
  };

  const handleSuggestedAmount = (cents: number) => {
    const reais = (cents / 100).toFixed(2).replace('.', ',');
    setCustomAmount(reais);
    setError('');
  };

  const handleContinue = () => {
    // Convert to cents
    const valueStr = customAmount.replace(',', '.');
    const valueInReais = Number.parseFloat(valueStr);

    if (isNaN(valueInReais) || valueInReais <= 0) {
      setError('Por favor, insira um valor válido');
      return;
    }

    const cents = Math.round(valueInReais * 100);

    if (cents < MINIMUM_AMOUNT) {
      setError(`O valor mínimo é R$ ${(MINIMUM_AMOUNT / 100).toFixed(2).replace('.', ',')}`);
      return;
    }

    console.log('[v0] Amount in cents:', cents);
    setAmountInCents(cents);
  };

  const formatCurrency = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-2xl">
        {!amountInCents ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold sm:text-2xl">Quanto você gostaria de contribuir?</DialogTitle>
              <DialogDescription className="text-sm">
                Escolha um valor sugerido ou insira o valor que desejar. Mínimo: {formatCurrency(MINIMUM_AMOUNT)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 sm:space-y-6 sm:py-4">
              {/* Suggested Amounts */}
              <div>
                <Label className="mb-2 block text-sm font-medium sm:mb-3">Valores sugeridos</Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                  {SUGGESTED_AMOUNTS.map((cents) => (
                    <Button
                      key={cents}
                      variant="outline"
                      onClick={() => handleSuggestedAmount(cents)}
                      className="h-12 text-base font-semibold hover:border-orange-alert hover:bg-orange-alert/5 sm:h-16 sm:text-lg"
                    >
                      {formatCurrency(cents)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <Label htmlFor="custom-amount" className="mb-2 block text-sm font-medium">
                  Ou insira um valor personalizado
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-3 sm:h-5 sm:w-5" />
                  <Input
                    id="custom-amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    value={customAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="h-12 pl-8 pr-12 text-base font-semibold sm:h-14 sm:pl-10 sm:text-lg"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground sm:right-3 sm:text-sm">
                    BRL
                  </span>
                </div>
                {error && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-red-600 sm:text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="contributor-name" className="mb-2 block text-sm font-medium">
                    Seu nome (opcional)
                  </Label>
                  <Input
                    id="contributor-name"
                    type="text"
                    placeholder="Como você gostaria de aparecer na lista de contribuintes"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="contributor-email" className="mb-2 block text-sm font-medium">
                    Seu e-mail (opcional)
                  </Label>
                  <Input
                    id="contributor-email"
                    type="email"
                    placeholder="Para receber atualizações sobre o projeto"
                    value={contributorEmail}
                    onChange={(e) => setContributorEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Não é necessário estar logado para contribuir. Se preferir, pode doar anonimamente.
                </p>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border bg-muted/50 p-3 sm:p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-orange-alert sm:h-5 sm:w-5" fill="currentColor" />
                  <span className="text-sm font-semibold sm:text-base">Sua contribuição ajuda a:</span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                  <li>• Manter a plataforma gratuita para todos</li>
                  <li>• Reunir mais pets com suas famílias</li>
                  <li>• Desenvolver novos recursos</li>
                </ul>
              </div>

              <div className="rounded-lg bg-green-50 p-3 text-xs sm:p-4 sm:text-sm">
                <p className="mb-1 font-medium text-green-900">💚 Forma de pagamento</p>
                <p className="text-green-700">
                  Pagamento via PIX - instantâneo e seguro. Após confirmar, você receberá um QR Code para escanear com o
                  app do seu banco.
                </p>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!customAmount}
              className="h-12 w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90 sm:h-auto"
            >
              <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
              Continuar para Pagamento
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold sm:text-2xl">Finalize sua contribuição via PIX</DialogTitle>
              <DialogDescription className="text-sm">
                Valor: <span className="font-semibold text-orange-alert">{formatCurrency(amountInCents)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 sm:py-4">
              <PixCheckout
                amountInCents={amountInCents}
                contributorName={contributorName || undefined}
                contributorEmail={contributorEmail || undefined}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                console.log('[v0] Going back to amount selection');
                setAmountInCents(null);
              }}
              className="h-12 w-full sm:h-auto"
            >
              ← Voltar para seleção de valor
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
