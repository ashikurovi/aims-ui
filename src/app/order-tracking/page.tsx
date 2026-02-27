/* Public order tracking page */
"use client";

import { Suspense } from "react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/api-config";
import { useSearchParams } from "next/navigation";

interface StatusHistoryEntry {
  id: number;
  orderId: number;
  previousStatus?: string | null;
  newStatus: string;
  comment?: string | null;
  createdAt: string;
}

interface TrackedOrder {
  id: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  shippingTrackingId?: string;
  shippingProvider?: string;
  createdAt: string;
  message?: string;
  statusHistory?: StatusHistoryEntry[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-sky-100 text-sky-800";
    case "paid":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusMessage = (status: string) => {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    pending: "Your order has been received and is awaiting confirmation.",
    processing: "Your order is being prepared for shipment.",
    paid: "Payment received. Your order is being processed.",
    shipped: "Your order has been shipped and is on its way.",
    delivered: "Your order has been delivered successfully.",
    cancelled: "This order has been cancelled.",
    refunded: "This order has been refunded.",
  };
  return map[s] ?? "Your order status is being updated.";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const fetchOrder = useCallback(
    async (rawId: string) => {
      const trimmed = rawId.trim();
      if (!trimmed) return;

      try {
        setLoading(true);
        setError(null);
        setOrder(null);

        const res = await axios.get(
          getApiUrl(`/orders/track/${encodeURIComponent(trimmed)}`),
        );

        const apiData = res.data?.data;
        if (apiData) {
          setOrder({
            id: apiData.orderId,
            status: apiData.status,
            totalAmount: apiData.totalAmount ?? 0,
            paymentMethod: apiData.paymentMethod ?? "DIRECT",
            customerName: apiData.customerName,
            customerPhone: apiData.customerPhone,
            customerAddress: apiData.customerAddress,
            shippingTrackingId:
              apiData.trackingId ?? apiData.shippingTrackingId ?? trimmed,
            shippingProvider: apiData.shippingProvider,
            createdAt: apiData.createdAt,
            message: apiData.message,
            statusHistory: apiData.statusHistory ?? [],
          });
        } else {
          setError("অর্ডার খুঁজে পাওয়া যায়নি। ট্র্যাকিং আইডি আবার চেক করুন।");
        }
      } catch (err: unknown) {
        const axiosError = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        const message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "অর্ডার খুঁজে পাওয়া যায়নি। ট্র্যাকিং আইডি আবার চেক করুন।";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const fromQuery = searchParams.get("trackingId");
    if (fromQuery) {
      setTrackingId(fromQuery);
      fetchOrder(fromQuery);
    }
  }, [searchParams, fetchOrder]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetchOrder(trackingId);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-400 text-white shadow-md px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-100/90">
            Order tracking
          </p>
          <h1 className="text-xl md:text-2xl font-semibold">
            আপনার অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50/95 max-w-xl">
            ইনভয়েসে দেওয়া ট্র্যাকিং আইডি লিখে আপনার অর্ডারের বর্তমান স্ট্যাটাস,
            ডেলিভারি তথ্য এবং পেমেন্ট স্ট্যাটাস দেখে নিন।
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 sm:grid-cols-[minmax(0,_2fr)_auto] gap-2 items-center"
        >
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="ট্র্যাকিং আইডি লিখুন"
            className="w-full rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !trackingId.trim()}
            className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-700 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "ট্র্যাক করা হচ্ছে..." : "অর্ডার ট্র্যাক করুন"}
          </button>
        </form>

        {error && (
          <p className="mt-2 text-[11px] sm:text-xs text-red-100">{error}</p>
        )}
      </div>

      {order && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-pink-50 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wide text-gray-500">
                Order ID #{order.id}
              </p>
              <p className="text-sm text-gray-700">
                তারিখ: {formatDate(order.createdAt)}
              </p>
              {order.customerName && (
                <p className="text-sm text-gray-700">
                  কাস্টমার: {order.customerName}
                  {order.customerPhone && ` (${order.customerPhone})`}
                </p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status,
              )}`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          {order.message && (
            <p className="text-xs text-gray-600">{order.message}</p>
          )}

          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <p className="flex justify-between text-gray-700">
              <span>ট্র্যাকিং আইডি</span>
              <span className="font-semibold">
                {order.shippingTrackingId || trackingId}
              </span>
            </p>
            {order.shippingProvider && (
              <p className="flex justify-between text-gray-700">
                <span>কুরিয়ার</span>
                <span className="font-semibold">{order.shippingProvider}</span>
              </p>
            )}
            <p className="flex justify-between text-gray-700">
              <span>পেমেন্ট মেথড</span>
              <span className="font-semibold">{order.paymentMethod}</span>
            </p>
            <p className="flex justify-between text-gray-900">
              <span>মোট পরিমাণ</span>
              <span className="font-semibold">{order.totalAmount}</span>
            </p>
            {order.customerAddress && (
              <p className="text-xs text-gray-600 mt-2">
                ডেলিভারি ঠিকানা: {order.customerAddress}
              </p>
            )}
          </div>

          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                স্ট্যাটাস হিস্টোরি
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                {order.statusHistory.map((entry) => (
                  <li key={entry.id} className="flex flex-col">
                    <span className="font-medium">
                      {formatDate(entry.createdAt)} —{" "}
                      {entry.newStatus.toUpperCase()}
                    </span>
                    <span className="text-gray-500">
                      {entry.comment || getStatusMessage(entry.newStatus)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8">লোড হচ্ছে...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
