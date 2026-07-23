import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { items, orderId } = await request.json();

    if (!items || !orderId) {
      return NextResponse.json(
        { error: 'Items and orderId required' },
        { status: 400 }
      );
    }

    // Create reservations for all items
    const reservations = items.map((item: any) => ({
      product_variant_id: item.variantId,
      order_id: orderId,
      quantity: item.quantity,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
      status: 'reserved',
    }));

    const { error: reservationError } = await supabase
      .from('stock_reservations')
      .insert(reservations);

    if (reservationError) {
      throw reservationError;
    }

    // Attempt to decrement stock
    for (const item of items) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', item.variantId)
        .single();

      if (variant && variant.stock_quantity >= item.quantity) {
        await supabase
          .from('product_variants')
          .update({ stock_quantity: variant.stock_quantity - item.quantity })
          .eq('id', item.variantId);
      } else {
        // Release reservation if stock unavailable
        await supabase
          .from('stock_reservations')
          .update({ status: 'released' })
          .eq('order_id', orderId);

        return NextResponse.json(
          { error: 'Insufficient stock for one or more items' },
          { status: 409 }
        );
      }
    }

    // Confirm reservations
    const { error: confirmError } = await supabase
      .from('stock_reservations')
      .update({ status: 'confirmed' })
      .eq('order_id', orderId);

    if (confirmError) {
      throw confirmError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stock reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to reserve stock' },
      { status: 500 }
    );
  }
}
