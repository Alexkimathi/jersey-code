'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const infoCards = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0L12 13.5 2.25 6.75" />
      </svg>
    ),
    title: "Email",
    lines: ["support@jerseystore.co.ke", "Response within 24 hours"],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: "Phone",
    lines: ["+254 712 345 678", "Mon–Fri 9AM–6PM EAT"],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Location",
    lines: ["New Generation Exhibition", "Tom Mboya St, Nairobi"],
  },
];

const quickLinks = [
  { label: "Track Orders", href: "/orders", detail: "Check your order status" },
  { label: "FAQ", href: "/faq", detail: "Answers to common questions" },
  { label: "Shipping Info", href: "/shipping", detail: "Delivery times & costs" },
  { label: "Returns Policy", href: "/returns", detail: "30-day hassle-free returns" },
];

const inputClass =
  "w-full rounded-xl bg-slate-100 border-0 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-shadow";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            status: 'new',
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        setError('Failed to send message. Please try again.');
        console.error(dbError);
      } else {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-transparent to-transparent pointer-events-none rounded-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-4">We&apos;re here to help</p>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Get in touch.
            </h1>
            <p className="text-base text-slate-400 max-w-lg leading-relaxed">
              A question about your order, a product, or just want to say hi — our team is standing by.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {infoCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
                {card.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">{card.title}</h3>
              {card.lines.map((line) => (
                <p key={line} className="text-sm text-slate-500">{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-2">Message us</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-7">Send us a message</h2>

          {submitted && (
            <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6">
              <span className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center flex-none mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="text-sm text-sky-800 font-medium">
                Message received — we&apos;ll get back to you shortly.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                  Full Name <span className="text-sky-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email <span className="text-sky-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254712345678"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">
                  Subject <span className="text-sky-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping Issue</option>
                  <option value="return">Return / Refund</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700">
                Message <span className="text-sky-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us how we can help..."
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-2">Self-serve</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-5">Quick answers</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickLinks.map((ql) => (
              <Link
                key={ql.href}
                href={ql.href}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{ql.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ql.detail}</p>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Store location map */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-2">Find us</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Our store</h2>
          <p className="text-sm text-slate-500 mb-5">
            Jersey Code · New Generation Exhibition, Tom Mboya St, Nairobi
          </p>
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=Jersey+Code,+New+Generation+Exhibition,+Tom+Mboya+St,+Nairobi,+Kenya&output=embed&z=17"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jersey Code store location"
            />
          </div>
          <a
            href="https://maps.app.goo.gl/i8RcoaucfxFfboaK9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Open in Google Maps
          </a>
        </div>

      </div>
    </div>
  );
}
