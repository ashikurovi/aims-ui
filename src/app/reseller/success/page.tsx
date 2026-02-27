import Link from 'next/link';

export default function ResellerSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl bg-white shadow-lg shadow-slate-200/70 border border-slate-100 p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            রিসেলার রিকোয়েস্ট পাঠানো হয়েছে
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            আপনার রিকোয়েস্ট দোকান মালিকের কাছে পাঠানো হয়েছে। তিনি আপনার তথ্য দেখে সব ঠিক থাকলে
            একাউন্ট অনুমোদন করবেন।
          </p>
          <p className="mt-2 text-xs text-slate-500">
            আপনার রিসেলার একাউন্ট অনুমোদন হলে আপনাকে ইমেইল করে জানানো হবে। অনুমোদন না হওয়া পর্যন্ত
            আপনি লগইন করতে পারবেন না।
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
            >
              হোম পেইজে ফিরে যান
            </Link>
            <Link
              href="/reseller"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
            >
              আরেকটি রিকোয়েস্ট পাঠান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

