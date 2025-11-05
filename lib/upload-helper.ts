import { createClient } from '@/lib/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_TIMEOUT = 5000; // Reduced to 5 seconds to fail faster
const MAX_RETRIES = 3;

interface UploadResult {
  success: boolean;
  url: string | null;
  error?: string;
}

/**
 * Upload a file to Supabase storage with timeout and retry logic
 */
export async function uploadFileWithRetry(
  file: File,
  userId: string,
  index: number,
  retryCount = 0
): Promise<UploadResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('User not authenticated:', authError);
    return {
      success: false,
      url: null,
      error: 'Você precisa estar autenticado para fazer upload de fotos. Por favor, faça login novamente.',
    };
  }

  console.log(`User authenticated: ${user.id}`);

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      url: null,
      error: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 5MB`,
    };
  }

  console.log(`Starting upload for file ${index}, attempt ${retryCount + 1}/${MAX_RETRIES}`);
  console.log(`File size: ${(file.size / 1024).toFixed(1)}KB, type: ${file.type}`);

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`; // Added userId folder for RLS policies

    let uploadData: any;
    let uploadError: any;

    try {
      // Create upload promise with timeout
      const uploadPromise = supabase.storage.from('pet-photos').upload(fileName, file, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout - verifique sua conexão')), UPLOAD_TIMEOUT);
      });

      // Race between upload and timeout
      const result = await Promise.race([uploadPromise, timeoutPromise]);
      uploadData = result.data;
      uploadError = result.error;
    } catch (err: any) {
      console.error(`Upload failed:`, err);

      if (err.message?.includes('timeout')) {
        uploadError = {
          message: 'Timeout no upload. Verifique sua conexão com a internet.',
        };
      } else if (err.message?.includes('policy')) {
        uploadError = {
          message: 'Erro de permissão. Faça login novamente.',
        };
      } else {
        uploadError = {
          message: err.message || 'Erro desconhecido no upload',
        };
      }
    }

    if (uploadError) {
      console.error(`Supabase upload error:`, uploadError);

      // Retry on specific errors
      if (retryCount < MAX_RETRIES - 1 && isRetryableError(uploadError)) {
        const delay = (retryCount + 1) * 1000;
        console.log(`Retrying upload after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return uploadFileWithRetry(file, userId, index, retryCount + 1);
      }

      return {
        success: false,
        url: null,
        error: uploadError.message || 'Erro no upload',
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('pet-photos').getPublicUrl(fileName);

    console.log(`Upload successful for file ${index}: ${publicUrl}`);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (err) {
    console.error(`Unexpected upload error:`, err);

    // Retry on timeout or network errors
    if (retryCount < MAX_RETRIES - 1) {
      const delay = (retryCount + 1) * 1000;
      console.log(`Retrying upload after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return uploadFileWithRetry(file, userId, index, retryCount + 1);
    }

    return {
      success: false,
      url: null,
      error: err instanceof Error ? err.message : 'Erro inesperado no upload',
    };
  }
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: any): boolean {
  const retryableMessages = ['timeout', 'network', 'connection', 'ECONNRESET', 'ETIMEDOUT'];
  const errorMessage = error?.message?.toLowerCase() || '';
  return retryableMessages.some((msg) => errorMessage.includes(msg));
}

/**
 * Compress image if needed (optional enhancement)
 */
export async function compressImageIfNeeded(file: File): Promise<File> {
  // If file is already small enough, return as is
  if (file.size <= MAX_FILE_SIZE) {
    return file;
  }

  // TODO: Implement image compression using canvas or a library
  // For now, just return the original file
  return file;
}
