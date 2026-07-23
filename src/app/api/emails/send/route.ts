import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Email templates
const emailTemplates: Record<string, (data: any) => { subject: string; body: string }> = {
  order_confirmation: (data) => ({
    subject: `Order Confirmation #${data.orderId.slice(0, 8)}`,
    body: `
Hello ${data.customerName},

Thank you for your order! Here's your order summary:

Order ID: ${data.orderId}
Total: KES ${data.total.toLocaleString()}
Items: ${data.items}
Delivery Method: ${data.fulfillmentMethod}
Estimated Delivery: ${data.estimatedDelivery}

Track your order at: https://jerseystore.co.ke/orders

Best regards,
Jersey Code Team
    `,
  }),
  payment_received: (data) => ({
    subject: 'Payment Received',
    body: `
Hello ${data.customerName},

We've received your payment of KES ${data.amount.toLocaleString()}.

Order ID: ${data.orderId}
Payment Status: Confirmed
Date: ${new Date().toLocaleDateString()}

Your order is being prepared for shipment.

Track your order: https://jerseystore.co.ke/orders

Best regards,
Jersey Code Team
    `,
  }),
  order_shipped: (data) => ({
    subject: 'Your Order Has Been Shipped',
    body: `
Hello ${data.customerName},

Great news! Your order has been shipped.

Order ID: ${data.orderId}
Tracking Info: ${data.trackingNumber || 'Available at order page'}
Expected Delivery: ${data.expectedDelivery}

Track your order: https://jerseystore.co.ke/orders

Best regards,
Jersey Code Team
    `,
  }),
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, emailType, customerEmail, customerName, data } = await request.json();

    if (!orderId || !emailType || !customerEmail) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Get email template
    const template = emailTemplates[emailType];
    if (!template) {
      return NextResponse.json(
        { error: 'Unknown email type' },
        { status: 400 }
      );
    }

    const emailContent = template({ customerName, orderId, ...data });

    // Log email to database
    const { error: logError } = await supabase.from('email_logs').insert([
      {
        order_id: orderId,
        customer_email: customerEmail,
        email_type: emailType,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (logError) {
      console.error('Error logging email:', logError);
    }

    // TODO: Integrate with Resend, SendGrid, or your email service here
    // For now, just log to console
    console.log('📧 Email to send:', {
      to: customerEmail,
      subject: emailContent.subject,
      body: emailContent.body,
    });

    // Mark as sent (in production, update after actual email is sent)
    await supabase
      .from('email_logs')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('order_id', orderId)
      .eq('email_type', emailType);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email service error:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}
