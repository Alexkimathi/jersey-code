'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface OrderWithItems {
  id: string;
  customer_phone: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  order_items: any[];
}

const statusColors: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async (phone: string) => {
    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(
          `
          id,
          customer_phone,
          customer_name,
          customer_email,
          total_amount,
          order_status,
          payment_status,
          created_at,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            custom_name,
            custom_number,
            products (
              name,
              image_url
            )
          )
        `
        )
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Failed to fetch orders');
        setOrders([]);
      } else if (!data || data.length === 0) {
        setError('No orders found for this phone number');
        setOrders([]);
      } else {
        setOrders(data as OrderWithItems[]);
        setShowForm(false);
      }
    } catch (err) {
      setError('Error fetching orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

        {showForm ? (
          <div className="bg-white p-8 rounded-lg shadow max-w-md">
            <p className="text-gray-600 mb-6">
              Enter your phone number to track your orders
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number (e.g., +254712345678)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Orders'}
              </button>
            </form>
            {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                setShowForm(true);
                setPhoneNumber('');
                setOrders([]);
              }}
              className="mb-6 text-blue-600 hover:underline text-sm"
            >
              ← Search Different Number
            </button>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700">
                No orders found
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 sm:mt-0">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[order.order_status] || 'bg-gray-100'
                          }`}
                        >
                          {order.order_status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            paymentStatusColors[order.payment_status] || 'bg-gray-100'
                          }`}
                        >
                          {order.payment_status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6 border-t border-gray-200 pt-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 py-3">
                          {item.products?.image_url && (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.products?.name}</h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × KES {item.unit_price}
                            </p>
                            {item.custom_name && (
                              <p className="text-sm text-gray-600">
                                Custom: {item.custom_name}
                                {item.custom_number && ` #${item.custom_number}`}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">KES {(item.quantity * item.unit_price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded mb-4 text-sm">
                      <p>
                        <strong>Name:</strong> {order.customer_name}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.customer_phone}
                      </p>
                      {order.customer_email && (
                        <p>
                          <strong>Email:</strong> {order.customer_email}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <div className="text-right">
                        <p className="text-gray-600">Total</p>
                        <p className="text-2xl font-bold">KES {order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Help Link */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-gray-700 mb-4">
            Can't find your order? Contact us at{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              support page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
