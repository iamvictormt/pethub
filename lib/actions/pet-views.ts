'use server';

import { createClient } from '@/lib/supabase/server';

export async function incrementPetView(petId: string) {
  try {
    const supabase = await createClient();

    // Increment the view count
    const { error } = await supabase.rpc('increment_pet_view', { pet_id: petId });

    if (error) {
      console.error('[v0] Error incrementing pet view:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[v0] Error in incrementPetView:', error);
    return { success: false, error: 'Failed to increment view' };
  }
}
