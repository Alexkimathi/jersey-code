import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const sport = searchParams.get('sport');
    const team = searchParams.get('team');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const sort = searchParams.get('sort') || 'newest';

    let dbQuery = supabase
      .from('products')
      .select(
        `
        id,
        name,
        sport,
        team,
        description,
        price,
        image_url,
        is_featured,
        created_at,
        product_variants (
          id,
          size,
          stock_quantity
        )
      `,
        { count: 'exact' }
      )
      .eq('is_hidden', false)
      .not('image_url', 'is', null);

    // Text search
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,team.ilike.%${query}%`
      );
    }

    // Filters
    if (sport) {
      dbQuery = dbQuery.eq('sport', sport);
    }
    if (team) {
      dbQuery = dbQuery.ilike('team', `%${team}%`);
    }
    if (minPrice) {
      dbQuery = dbQuery.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      dbQuery = dbQuery.lte('price', parseFloat(maxPrice));
    }

    // Size filter (need to join with variants)
    // This is handled in post-processing since we need variant data

    // Sorting
    if (sort === 'price-low') {
      dbQuery = dbQuery.order('price', { ascending: true });
    } else if (sort === 'price-high') {
      dbQuery = dbQuery.order('price', { ascending: false });
    } else if (sort === 'rating') {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }

    const { data, error, count } = await dbQuery.limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Post-process: filter by size
    let products = (data || [])
      .filter((p: any) => {
        if (size) {
          return p.product_variants?.some((v: any) => v.size === size);
        }
        return true;
      });

    return NextResponse.json({
      products,
      total: count,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
