// PIX QR Code generation utilities
// Based on the PIX EMV standard (BR Code)

export interface PixData {
  key: string; // PIX key (email, phone, CPF, or random key)
  name: string; // Recipient name
  city: string; // Recipient city
  amount?: number; // Amount in BRL (reais)
  description?: string; // Transaction description
  txid?: string; // Transaction ID (optional)
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toUpperCase()
    .trim();
}

// Convert reais to cents
function reaisToCents(reais: number): number {
  return Math.round(reais * 100);
}

// Generate PIX payload string (EMV format)
export function generatePixPayload(data: PixData): string {
  const { key, name, city, amount, description, txid } = data;

  // Convert amount from reais to cents if provided
  const amountInCents = amount ? reaisToCents(amount) : undefined;

  // Helper function to format EMV fields
  const formatEMV = (id: string, value: string): string => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };

  // Start building the payload
  let payload = '';

  // 00: Payload Format Indicator (fixed value "01")
  payload += formatEMV('00', '01');

  // 01: Point of Initiation Method
  if (amountInCents && amountInCents > 0) {
    payload += formatEMV('01', '12'); // 12 for both static and dynamic with amount
  } else {
    payload += formatEMV('01', '12'); // Static - reusable without fixed amount
  }

  // 26: Merchant Account Information (PIX)
  let merchantAccount = '';
  merchantAccount += formatEMV('00', 'br.gov.bcb.pix');
  merchantAccount += formatEMV('01', key);

  // Add description as part of merchant account if provided
  if (description) {
    const normalizedDesc = normalizeText(description).substring(0, 25);
    merchantAccount += formatEMV('02', normalizedDesc);
  }

  payload += formatEMV('26', merchantAccount);

  // 52: Merchant Category Code (0000 = not specified)
  payload += formatEMV('52', '0000');

  // 53: Transaction Currency (986 = BRL)
  payload += formatEMV('53', '986');

  // 54: Transaction Amount (if specified)
  if (amountInCents && amountInCents > 0) {
    const amountInReais = (amountInCents / 100).toFixed(2);
    payload += formatEMV('54', amountInReais);
  }

  // 58: Country Code (BR)
  payload += formatEMV('58', 'BR');

  // 59: Merchant Name (max 25 characters)
  const merchantName = normalizeText(name).substring(0, 25);
  payload += formatEMV('59', merchantName);

  // 60: Merchant City (max 15 characters)
  const merchantCity = normalizeText(city).substring(0, 15);
  payload += formatEMV('60', merchantCity);

  // 62: Additional Data Field Template (optional - for txid)
  if (txid) {
    const normalizedTxid = txid.substring(0, 25);
    const additionalData = formatEMV('05', normalizedTxid);
    payload += formatEMV('62', additionalData);
  }

  // 63: CRC16 (will be calculated and appended)
  payload += '6304';

  // Calculate and append CRC16
  const crc = calculateCRC16(payload);
  payload += crc;

  return payload;
}

// CRC16-CCITT calculation for PIX (polynomial 0x1021)
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Generate PIX QR Code data URL using a QR code generation service
export function generatePixQRCodeUrl(pixPayload: string): string {
  // Using QR Server API (free service)
  const encodedPayload = encodeURIComponent(pixPayload);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedPayload}`;
}

// Format amount for display
export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

// Debug function to validate the payload
export function debugPixPayload(payload: string): void {
  console.log('=== PIX Payload Debug ===');
  console.log('Full payload:', payload);
  console.log('Length:', payload.length);
  console.log('\nParsed fields:');

  let index = 0;
  while (index < payload.length - 4) {
    // -4 for CRC at the end
    const id = payload.substring(index, index + 2);
    const length = parseInt(payload.substring(index + 2, index + 4), 10);
    const value = payload.substring(index + 4, index + 4 + length);

    console.log(`ID ${id}: (length ${length}) ${value}`);

    // If it's field 26 (Merchant Account), parse nested fields
    if (id === '26') {
      let subIndex = 0;
      console.log('  Nested fields in 26:');
      while (subIndex < value.length) {
        const subId = value.substring(subIndex, subIndex + 2);
        const subLength = parseInt(value.substring(subIndex + 2, subIndex + 4), 10);
        const subValue = value.substring(subIndex + 4, subIndex + 4 + subLength);
        console.log(`    ID ${subId}: (length ${subLength}) ${subValue}`);
        subIndex += 4 + subLength;
      }
    }

    index += 4 + length;
  }

  console.log('\nCRC:', payload.substring(payload.length - 4));
  console.log('======================');
}
