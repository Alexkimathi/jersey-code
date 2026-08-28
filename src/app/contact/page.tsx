'use client';

import { useState } from 'react';
import Link from 'next/link';

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254743616717';

const WA_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.86L.057 23.269a.75.75 0 00.914.914l5.41-1.477A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 01-4.943-1.348l-.354-.21-3.667 1-.967-3.667-.21-.354A9.75 9.75 0 1112 21.75z" />
  </svg>
);

const CHEVRON = (
  <svg className="w-3.5 h-3.5 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to send message. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 6000);
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = [
    'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800',
    'placeholder:text-slate-400 transition-all duration-150',
    'focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10',
  ].join(' ');

  return (
    <>
      {/* ── Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .bc { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; text-transform: uppercase; line-height: 0.92; }
        .dm { font-family: 'DM Sans', sans-serif; }
        .ch-card { transition: background 0.18s ease, transform 0.18s ease; }
        .ch-card:hover { transform: translateY(-2px); }
        .ch-arrow { transition: transform 0.18s ease; }
        .ch-card:hover .ch-arrow { transform: translateX(3px); }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu   { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .d1   { animation-delay: 0.05s; }
        .d2   { animation-delay: 0.15s; }
        .d3   { animation-delay: 0.25s; }
        .d4   { animation-delay: 0.38s; }
      `}</style>

      <div className="dm min-h-screen bg-slate-50">

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="bg-slate-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 py-14 lg:py-20 items-center">

              {/* ── Left: Headline ── */}
              <div className="relative">
                <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />
                <p className="fu d1 text-[11px] font-bold uppercase tracking-[0.38em] text-sky-400 mb-5">
                  Jersey Code · Nairobi, Kenya
                </p>
                <h1 className="bc fu d2 text-[clamp(68px,9vw,120px)] text-white">
                  Let&rsquo;s<br />Talk.
                </h1>
                <p className="fu d3 mt-5 text-slate-400 text-[15px] leading-relaxed max-w-sm">
                  Questions, custom orders, sizing help — we&rsquo;re available across multiple channels. Pick what works for you.
                </p>
                <p className="fu d3 mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Mon – Sat &nbsp;·&nbsp; 9 AM – 7 PM EAT
                </p>
              </div>

              {/* ── Right: 2×2 channel cards ── */}
              <div className="fu d4 grid grid-cols-2 gap-3">

                {/* WhatsApp */}
                <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20I%20have%20a%20question%20about%20Jersey%20Code`}
                   target="_blank" rel="noopener noreferrer"
                   className="ch-card group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 hover:bg-green-500/10 hover:border-green-500/20">
                  <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400 group-hover:bg-green-500/30 transition-colors">
                    {WA_ICON}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-400 mb-1">WhatsApp</p>
                  <p className="text-white font-semibold text-sm leading-snug">+254 743 616 717</p>
                  <p className="text-slate-500 text-xs mt-1">Fastest response</p>
                  <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <span>Chat now</span>
                    <span className="ch-arrow">{CHEVRON}</span>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:jersey.code.ke@gmail.com"
                   className="ch-card group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 hover:bg-sky-500/10 hover:border-sky-500/20">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4 text-sky-400 group-hover:bg-sky-500/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0L12 13.5 2.25 6.75" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-1">Email</p>
                  <p className="text-white font-semibold text-sm leading-snug break-all">jersey.code.ke<br />@gmail.com</p>
                  <p className="text-slate-500 text-xs mt-1">Within 24 hours</p>
                  <div className="mt-4 flex items-center gap-1 text-sky-400 text-xs font-semibold">
                    <span>Send email</span>
                    <span className="ch-arrow">{CHEVRON}</span>
                  </div>
                </a>

                {/* Phone */}
                <a href="tel:+254743616717"
                   className="ch-card group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 hover:bg-slate-700/60 hover:border-slate-600/40">
                  <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center mb-4 text-slate-300 group-hover:bg-slate-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">Phone</p>
                  <p className="text-white font-semibold text-sm leading-snug">+254 743 616 717</p>
                  <p className="text-slate-500 text-xs mt-1">Mon–Sat 9AM–7PM</p>
                  <div className="mt-4 flex items-center gap-1 text-slate-400 text-xs font-semibold">
                    <span>Call us</span>
                    <span className="ch-arrow">{CHEVRON}</span>
                  </div>
                </a>

                {/* Visit */}
                <a href="https://maps.app.goo.gl/i8RcoaucfxFfboaK9"
                   target="_blank" rel="noopener noreferrer"
                   className="ch-card group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 hover:bg-amber-500/10 hover:border-amber-500/20">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400 group-hover:bg-amber-500/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 mb-1">Visit Us</p>
                  <p className="text-white font-semibold text-sm leading-snug">Tom Mboya St,<br />Shop C13 · 1st Floor</p>
                  <p className="text-slate-500 text-xs mt-1">Next to Platinum Plaza</p>
                  <div className="mt-4 flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <span>Get directions</span>
                    <span className="ch-arrow">{CHEVRON}</span>
                  </div>
                </a>

              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ BODY ══════════════════════ */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 lg:py-16">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ── Form ── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 pt-10 pb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-3">Send a message</p>
                <h2 className="bc text-[clamp(36px,5vw,54px)] text-slate-900">
                  We&rsquo;d love<br />to hear from you.
                </h2>
                <p className="text-slate-400 text-sm mt-3">
                  We read every message and get back to you within 24 hours on business days.
                </p>
              </div>

              {submitted && (
                <div className="mx-8 mb-2 flex items-center gap-3 bg-sky-50 border border-sky-100 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-none">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Message sent!</p>
                    <p className="text-xs text-slate-500 mt-0.5">We&rsquo;ll get back to you shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mx-8 mb-2 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Full name <span className="text-sky-500">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name}
                      onChange={handleChange} required placeholder="Your name"
                      className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Email <span className="text-sky-500">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email}
                      onChange={handleChange} required placeholder="your@email.com"
                      className={inputCls} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Phone
                    </label>
                    <input type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} placeholder="+254 712 345 678"
                      className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Topic <span className="text-sky-500">*</span>
                    </label>
                    <select name="subject" value={formData.subject}
                      onChange={handleChange} required className={inputCls}>
                      <option value="">Select a topic…</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="custom">Custom / Personalisation</option>
                      <option value="shipping">Shipping Issue</option>
                      <option value="return">Return / Refund</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    Message <span className="text-sky-500">*</span>
                  </label>
                  <textarea name="message" value={formData.message}
                    onChange={handleChange} required rows={6}
                    placeholder="Tell us how we can help…"
                    className={`${inputCls} resize-none`} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white tracking-wide transition-all hover:bg-sky-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4 lg:sticky lg:top-24">

              {/* Hours */}
              <div className="bg-slate-950 text-white rounded-3xl p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400 mb-5">Store hours</p>
                <div className="space-y-3">
                  {([
                    ['Monday – Friday', '9:00 AM – 7:00 PM', false],
                    ['Saturday',        '9:00 AM – 7:00 PM', false],
                    ['Sunday',          'Closed',             true],
                  ] as [string, string, boolean][]).map(([day, hours, closed]) => (
                    <div key={day} className="flex items-center justify-between text-sm border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                      <span className="text-slate-400">{day}</span>
                      <span className={`font-semibold ${closed ? 'text-slate-600' : 'text-white'}`}>{hours}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 mt-5 pt-4 border-t border-white/[0.06]">
                  All times East Africa Time (EAT · UTC+3)
                </p>
              </div>

              {/* Quick help */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-4">Quick help</p>
                <div className="space-y-1">
                  {([
                    ['📦', 'Track Your Order', '/orders',   'Real-time order status'],
                    ['💬', 'FAQ',              '/faq',      'Common questions answered'],
                    ['🚚', 'Shipping Info',    '/shipping', 'Delivery times & coverage'],
                    ['↩️', 'Returns',          '/returns',  'Return & refund policy'],
                  ] as [string, string, string, string][]).map(([icon, label, href, detail]) => (
                    <Link key={href} href={href}
                      className="flex items-center gap-3 rounded-xl p-3 -mx-1 hover:bg-slate-50 transition-colors group">
                      <span className="text-xl w-7 text-center flex-none">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{detail}</p>
                      </div>
                      <span className="text-slate-300 group-hover:text-sky-400 transition-colors">{CHEVRON}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20I%20have%20a%20question%20about%20Jersey%20Code`}
                 target="_blank" rel="noopener noreferrer"
                 className="ch-card flex items-center gap-4 bg-green-500 hover:bg-green-600 rounded-3xl p-6 text-white group">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-none text-white">
                  {WA_ICON}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">Prefer WhatsApp?</p>
                  <p className="text-green-100 text-xs mt-0.5 leading-snug">Tap to chat — fastest way to reach us</p>
                </div>
                <span className="text-white/70 ch-arrow">{CHEVRON}</span>
              </a>

            </div>
          </div>
        </div>

        {/* ══════════════════════ MAP ══════════════════════ */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-16">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-1">Find us</p>
                <h2 className="bc text-3xl text-slate-900">Our Store</h2>
                <p className="text-sm text-slate-400 mt-1">Tom Mboya St · Next to Platinum Plaza · 1st floor, shop C13</p>
              </div>
              <a href="https://maps.app.goo.gl/i8RcoaucfxFfboaK9"
                 target="_blank" rel="noopener noreferrer"
                 className="ch-card inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition-colors whitespace-nowrap self-start sm:self-auto">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Open in Google Maps
              </a>
            </div>
            <iframe
              src="https://www.google.com/maps?q=Jersey+Code,+New+Generation+Exhibition,+Tom+Mboya+St,+Nairobi,+Kenya&output=embed&z=17"
              width="100%" height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jersey Code store location"
            />
          </div>
        </div>

      </div>
    </>
  );
}
