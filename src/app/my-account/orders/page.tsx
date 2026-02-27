"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState, useCallback, FormEvent } from "react";
import axios from "axios";
import { getApiUrl, getApiHeaders } from "../../../lib/api-config";
import { TbCurrencyTaka } from "react-icons/tb";
import { FiPackage, FiTruck } from "react-icons/fi";
import Link from "next/link";
import ThemeLoader from "../../../components/shared/ThemeLoader";

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    image?: string;
    sku?: string;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  customerAddress?: string;
  createdAt: string;
  items: OrderItem[];
   shippingTrackingId?: string;
   shippingProvider?: string;
}

interface TrackingStatusHistoryEntry {
  id: number;
  orderId: number;
  previousStatus?: string | null;
  newStatus: string;
  comment?: string | null;
  createdAt: string;
}

interface TrackingOrderStatus {
  orderId: number;
  status: string;
  message?: string;
  trackingId?: string;
  shippingProvider?: string;
  statusHistory?: TrackingStatusHistoryEntry[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "paid":
      return "bg-purple-100 text-purple-800";
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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Orders = () => {
  const { userSession } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(
    null,
  );
  const [trackingId, setTrackingId] = useState("");
  const [trackingResult, setTrackingResult] =
    useState<TrackingOrderStatus | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl("/orders/my-orders"), {
        headers: getApiHeaders(userSession?.accessToken),
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [userSession?.accessToken]);

  useEffect(() => {
    if (userSession?.accessToken) {
      fetchOrders();
    }
  }, [userSession, fetchOrders]);

  const isOrderCancellable = (order: Order): boolean => {
    if (order.status.toLowerCase() === "cancelled") return false;
    if (order.status.toLowerCase() === "delivered") return false;

    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await axios.patch(
        getApiUrl(`/orders/${orderId}/cancel`),
        {},
        {
          headers: getApiHeaders(userSession?.accessToken),
        },
      );
      alert("Order cancelled successfully!");
      fetchOrders(); // Refresh orders list
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Failed to cancel order. Please try again.";
      alert(errorMessage);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleTrackOrder = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedId = trackingId.trim();
    if (!trimmedId) return;

    try {
      setTrackingLoading(true);
      setTrackingError(null);
      setTrackingResult(null);

      const response = await axios.get(
        getApiUrl(`/orders/track/${encodeURIComponent(trimmedId)}`),
      );

      const apiData = response.data?.data;
      if (apiData) {
        setTrackingResult({
          orderId: apiData.orderId,
          status: apiData.status,
          message: apiData.message,
          trackingId: apiData.trackingId,
          shippingProvider: apiData.shippingProvider,
          statusHistory: apiData.statusHistory ?? [],
        });
      } else {
        setTrackingError(
          "অর্ডার খুঁজে পাওয়া যায়নি। ট্র্যাকিং আইডি আবার চেক করুন।",
        );
      }
    } catch (error: unknown) {
      console.error("Error tracking order:", error);
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "অর্ডার খুঁজে পাওয়া যায়নি। ট্র্যাকিং আইডি আবার চেক করুন।";
      setTrackingError(errorMessage);
    } finally {
      setTrackingLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemeLoader
        message="আপনার সাম্প্রতিক অর্ডারগুলো লোড হচ্ছে, একটু অপেক্ষা করুন।"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full flex flex-col gap-5">
        <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white shadow-md px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-pink-100/90">
                My account
              </p>
              <h2 className="text-xl md:text-2xl font-semibold">My orders</h2>
              <p className="text-xs sm:text-sm text-pink-50/95 max-w-md">
                আপনি এখনও কোনো অর্ডার করেননি। প্রথম অর্ডারের সাথে প্রিমিয়াম
                অভিজ্ঞতা শুরু করুন।
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs sm:text-sm">
              <FiPackage className="text-pink-100" />
              <span>অর্ডার হিস্টোরি এখানে দেখা যাবে</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[220px]">
          <div className="max-w-md w-full text-center space-y-4 rounded-2xl border border-dashed border-pink-200 bg-white/70 px-6 py-8">
            <p className="text-sm font-semibold text-gray-900">
              বর্তমানে কোনো অর্ডার পাওয়া যায়নি
            </p>
            <p className="text-sm text-gray-600">
              শপ থেকে আপনার পছন্দের পণ্য নির্বাচন করে এখনই প্রথম অর্ডার করে
              ফেলুন।
            </p>
            <div className="flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                শপে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white shadow-md px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-pink-100/90">
              My account
            </p>
            <h2 className="text-xl md:text-2xl font-semibold">My orders</h2>
            <p className="text-xs sm:text-sm text-pink-50/95 max-w-md">
              আপনার সব অর্ডারের স্ট্যাটাস, পেমেন্ট এবং পণ্য তালিকা প্রিমিয়াম
              ভিউতে দেখুন।
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <div className="rounded-xl bg-white/10 px-3 py-2 flex items-center gap-2">
              <FiPackage className="text-pink-50" />
              <span className="text-[11px] font-medium">
                মোট অর্ডার {orders.length}
              </span>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 flex items-center gap-2">
              <FiTruck className="text-pink-50" />
              <span className="text-[11px] font-medium">
                ট্র্যাক করুন ডেলিভারি স্ট্যাটাস
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleTrackOrder}
          className="mt-4 grid grid-cols-1 sm:grid-cols-[minmax(0,_2fr)_auto] gap-2 items-center"
        >
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="ট্র্যাকিং আইডি লিখুন"
            className="w-full rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={trackingLoading || !trackingId.trim()}
            className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-2 text-xs sm:text-sm font-semibold text-pink-600 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {trackingLoading ? "ট্র্যাক করা হচ্ছে..." : "অর্ডার ট্র্যাক করুন"}
          </button>
        </form>

        {trackingError && (
          <p className="mt-2 text-[11px] sm:text-xs text-red-100">
            {trackingError}
          </p>
        )}

        {trackingResult && (
          <div className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-[11px] sm:text-xs space-y-1">
            <p>
              <span className="text-pink-100/80">Tracking ID:</span>{" "}
              <span className="font-semibold">
                {trackingResult.trackingId || trackingId}
              </span>
            </p>
            <p>
              <span className="text-pink-100/80">Status:</span>{" "}
              <span className="font-semibold">
                {trackingResult.status?.toUpperCase()}
              </span>
            </p>
            {trackingResult.message && (
              <p className="text-pink-100">{trackingResult.message}</p>
            )}
            {trackingResult.shippingProvider && (
              <p>
                <span className="text-pink-100/80">Provider:</span>{" "}
                <span className="font-semibold">
                  {trackingResult.shippingProvider}
                </span>
              </p>
            )}
            <p>
              <span className="text-pink-100/80">Order ID:</span>{" "}
              <span className="font-semibold">#{trackingResult.orderId}</span>
            </p>

            {trackingResult.statusHistory &&
              trackingResult.statusHistory.length > 0 && (
                <div className="mt-2 border-t border-pink-100/30 pt-2">
                  <p className="text-[10px] font-semibold text-pink-50 mb-1">
                    স্ট্যাটাস হিস্টোরি
                  </p>
                  <ul className="space-y-1">
                    {trackingResult.statusHistory.map((entry) => (
                      <li key={entry.id} className="flex flex-col">
                        <span className="font-medium">
                          {formatDate(entry.createdAt)} —{" "}
                          {entry.newStatus.toUpperCase()}
                        </span>
                                <span className="text-pink-100/80">
                                  {entry.comment ||
                                    getStatusMessage(entry.newStatus)}
                                </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white/95 p-4 sm:p-5 rounded-2xl shadow-sm border border-pink-50"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wide text-gray-500">
                  Order ID #{order.id}
                </p>
                <p className="text-sm text-gray-700">
                  Date: {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Quantity: {item.quantity} ×{" "}
                        <span className="inline-flex items-center">
                          <TbCurrencyTaka size={12} />
                          {item.unitPrice}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                      <TbCurrencyTaka size={18} />
                      <span>{item.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment: {order.paymentMethod}
                  </p>
                  {order.customerAddress && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      Address: {order.customerAddress}
                    </p>
                  )}
                </div>
                <div className="inline-flex items-center rounded-full bg-pink-50 px-4 py-2 text-primary text-base sm:text-lg font-semibold">
                  <TbCurrencyTaka size={24} />
                  <span>{order.totalAmount}</span>
                </div>
              </div>
              {isOrderCancellable(order) && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrderId === order.id}
                    className="px-4 py-2 rounded-full bg-red-500 text-white text-xs sm:text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {cancellingOrderId === order.id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
