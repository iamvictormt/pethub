export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface ImageValidationResult {
  valid: boolean;
  title?: string;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      title: 'Formato inválido',
      error: 'Use apenas JPG, PNG ou WEBP',
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      title: `Arquivo muito grande (${sizeMB}MB).`,
      error: `Tamanho máximo: 2MB`,
    };
  }

  return { valid: true };
}
