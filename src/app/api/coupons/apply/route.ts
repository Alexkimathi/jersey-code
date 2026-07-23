import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { couponId } = await request.json();

    if (!couponId) {
      return NextResponse.json(
        { error: 'Coupon ID required' },
        { status: 400 }
      );
    }

    // Increment usage count
    const { data, error } = await supabase
      .from('discount_coupons')
      .update({ current_uses: supabase.rpc('increment_coupon_usage', { coupon_id: couponId }) })
      .eq('id', couponId);

    if (error) {
      // Fallback: fetch coupon and manually increment
      const { data: coupon } = await supabase
        .from('discount_coupons')
        .select('current_uses')
        .eq('id', couponId)
        .single();

      if (coupon) {
        await supabase
          .from('discount_coupons')
          .update({ current_uses: coupon.current_uses + 1 })
          .eq('id', couponId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Apply coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}
