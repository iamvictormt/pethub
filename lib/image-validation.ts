export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato inválido. Use apenas JPG, PNG, GIF ou WEBP',
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Arquivo muito grande (${sizeMB}MB). Tamanho máximo: 2MB`,
    };
  }

  return { valid: true };
}
