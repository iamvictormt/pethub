import { createClient } from '@/lib/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Parse filter parameters
    const statusParam = searchParams.get('status');
    const petTypesParam = searchParams.get('petTypes');
    const hasReward = searchParams.get('hasReward') === 'true';
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '12');
    const userLat = searchParams.get('userLat');
    const userLng = searchParams.get('userLng');
    const distance = Number.parseFloat(searchParams.get('distance') || '100');

    // Build query
    let query = supabase
      .from('pets')
      .select('*', { count: 'exact' })
      .in('status', ['LOST', 'SIGHTED', 'RESCUED', 'ADOPTION']);

    // Apply status filter
    if (statusParam) {
      const statusArray = statusParam.split(',').filter(Boolean);
      if (statusArray.length > 0) {
        query = query.in('status', statusArray);
      }
    }

    // Apply pet type filter
    if (petTypesParam) {
      const petTypesArray = petTypesParam.split(',').filter(Boolean);
      if (petTypesArray.length > 0) {
        query = query.in('type', petTypesArray);
      }
    }

    // Apply reward filter
    if (hasReward) {
      query = query.eq('has_reward', true).gt('reward_amount', 0);
    }

    // Apply text search filter (searches in name, description, color, breed)
    if (searchQuery.trim()) {
      query = query.or(
        `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,color.ilike.%${searchQuery}%,breed.ilike.%${searchQuery}%`
      );
    }

    // Apply sorting
    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    }

    // Execute query
    const { data: pets, error, count } = await query;

    if (error) {
      console.error('Error fetching pets:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Client-side distance filtering and sorting (if location provided)
    let filteredPets = pets || [];

    if (userLat && userLng) {
      const lat = Number.parseFloat(userLat);
      const lng = Number.parseFloat(userLng);

      // Calculate distances
      filteredPets = filteredPets.map((pet) => ({
        ...pet,
        distance: calculateDistance(lat, lng, pet.latitude, pet.longitude),
      }));

      // Filter by distance
      filteredPets = filteredPets.filter((pet) => (pet.distance || 0) <= distance);

      // Sort by distance if requested
      if (sortBy === 'distance') {
        filteredPets.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
    }

    // Apply pagination
    const total = filteredPets.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPets = filteredPets.slice(startIndex, endIndex);

    return NextResponse.json({
      pets: paginatedPets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error in pets API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
