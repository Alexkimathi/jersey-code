'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fake-key'
);

interface Address {
  id: string;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  postal_code: string | null;
  is_default: boolean;
}

export default function CustomerAddressBook({
  customerId,
  onSelectAddress,
}: {
  customerId: string;
  onSelectAddress?: (address: Address) => void;
}) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    street_address: '',
    city: '',
    postal_code: '',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('customer_addresses')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('customer_addresses')
          .insert([{ ...formData, customer_id: customerId }]);

        if (error) throw error;
      }

      setFormData({
        full_name: '',
        phone: '',
        street_address: '',
        city: '',
        postal_code: '',
        is_default: false,
      });
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      street_address: address.street_address,
      city: address.city,
      postal_code: address.postal_code || '',
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;

    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  if (loading) return <div>Loading addresses...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) setEditingId(null);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={formData.street_address}
              onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
              placeholder="Street Address"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              placeholder="Postal Code (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="rounded"
              />
              Set as default address
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Save'} Address
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-gray-600 text-sm">No saved addresses yet</p>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress?.(address)}
              className="border border-gray-200 p-4 rounded-lg hover:border-blue-400 cursor-pointer transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{address.full_name}</h4>
                  <p className="text-sm text-gray-600">{address.street_address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city} {address.postal_code && `- ${address.postal_code}`}
                  </p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
                <div className="flex gap-2">
                  {address.is_default && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(address);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address.id);
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
