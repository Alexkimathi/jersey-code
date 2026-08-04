import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    // Get all reserved items for this order
    const { data: reservations } = await supabase
      .from('stock_reservations')
      .select('product_variant_id, quantity')
      .eq('order_id', orderId)
      .eq('status', 'confirmed');

    if (reservations && reservations.length > 0) {
      // Restore stock for each item
      for (const reservation of reservations) {
        const { data: variant } = await supabase
          .from('product_variants')
          .select('stock_quantity')
          .eq('id', reservation.product_variant_id)
          .single();

        if (variant) {
          await supabase
            .from('product_variants')
            .update({
              stock_quantity: variant.stock_quantity + reservation.quantity,
            })
            .eq('id', reservation.product_variant_id);
        }
      }
    }

    // Mark reservations as released
    await supabase
      .from('stock_reservations')
      .update({ status: 'released' })
      .eq('order_id', orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stock release error:', error);
    return NextResponse.json(
      { error: 'Failed to release stock' },
      { status: 500 }
    );
  }
}
