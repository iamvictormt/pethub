export interface ContributionTier {
  id: string;
  name: string;
  description: string;
  amountInCents: number;
  popular?: boolean;
}

// Contribution tiers for the platform
export const CONTRIBUTION_TIERS: ContributionTier[] = [
  {
    id: 'supporter',
    name: 'Apoiador',
    description: 'Ajude a manter o Farejei funcionando',
    amountInCents: 1000, // R$ 10,00
  },
  {
    id: 'friend',
    name: 'Amigo dos Pets',
    description: 'Contribua para reunir mais pets com suas famílias',
    amountInCents: 2500, // R$ 25,00
    popular: true,
  },
  {
    id: 'hero',
    name: 'Herói Pet',
    description: 'Seja um herói na causa animal',
    amountInCents: 5000, // R$ 50,00
  },
  {
    id: 'champion',
    name: 'Campeão',
    description: 'Faça a diferença na vida de muitos pets',
    amountInCents: 10000, // R$ 100,00
  },
];

export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}
