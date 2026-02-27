'use client';

import { API_CONFIG } from '@/lib/api-config';
import { getSystemUserByCompanyId } from '@/lib/api-services';
import type { SystemUser } from '@/types/system-user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ResellerRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    resellerCommissionRate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [company, setCompany] = useState<SystemUser | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await getSystemUserByCompanyId(API_CONFIG.companyId);
        setCompany(data);
      } catch (error) {
        console.error('Failed to load company info for reseller page', error);
      }
    };
    loadCompany();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${API_CONFIG.baseURL}/systemuser`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            companyName: company?.companyName,
            companyId: API_CONFIG.companyId,
            phone: form.phone || undefined,
            role: 'RESELLER',
            isActive: false,
        
         
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || 'Failed to register reseller');
      } else {
        // Clear form and redirect to success page with message
        setForm({
          name: '',
          email: '',
          password: '',
          companyName: '',
          phone: '',
          resellerCommissionRate: '',
        });
        router.push('/reseller/success');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100/70 px-4 sm:px-5 py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Left: marketing / info */}
          <div className="space-y-6">
            <div>
              <p className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold tracking-wide shadow-sm">
                {company?.companyName || 'রিসেলার প্রোগ্রাম'}
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                রিসেলার হন{' '}
                <span className="bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                  {company?.companyName || 'SquadCart'}
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl">
                আমাদের সাথে পার্টনার হয়ে আপনার মাধ্যমে হওয়া প্রতিটি বিক্রিতে কমিশন আয় করুন। কিছু
                তথ্য দিয়ে আবেদন করুন, আর দোকান মালিক খুব দ্রুত আপনার আবেদন রিভিউ করবে।
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="rounded-xl border border-primary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ধাপ ১
                </p>
                <p className="mt-1 font-medium text-gray-900">আপনার তথ্য দিন</p>
                <p className="mt-1 text-xs text-gray-500">
                  আপনি কে এবং কীভাবে আপনাকে কন্ট্যাক্ট করবো তা জানান।
                </p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ধাপ ২
                </p>
                <p className="mt-1 font-medium text-gray-900">মালিকের রিভিউ</p>
                <p className="mt-1 text-xs text-gray-500">
                  দোকান মালিক আপনার আবেদন দেখে অনুমোদন দেবেন।
                </p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ধাপ ৩
                </p>
                <p className="mt-1 font-medium text-gray-900">বিক্রি শুরু করুন</p>
                <p className="mt-1 text-xs text-gray-500">
                  অনুমোদন হয়ে গেলে আপনার রিসেলার একাউন্টে লগইন করতে পারবেন।
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    পূর্ণ নাম
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ইমেইল
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    পাসওয়ার্ড
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="একটি সিকিউর পাসওয়ার্ড তৈরি করুন"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    মোবাইল নাম্বার <span className="text-slate-400 text-xs">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="সম্ভব হলে কান্ট্রি কোডসহ লিখুন"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'আপনার রিসেলার রিকোয়েস্ট পাঠানো হচ্ছে...'
                  : 'রিসেলার হওয়ার জন্য রিকোয়েস্ট পাঠান'}
              </button>

              {message && (
                <p
                  className={`text-sm mt-3 ${
                    message.toLowerCase().includes('created') ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </p>
              )}
            </form>

            <p className="mt-4 text-[11px] text-slate-400 text-center">
              এই ফর্ম সাবমিট করে আপনি আমাদের রিসেলার টার্মস ও প্রাইভেসি পলিসিতে সম্মতি দিচ্ছেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}