"use client";

import { IoCartOutline } from "react-icons/io5";

interface CustomerInfoProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  district?: string;
  setDistrict?: (v: string) => void;
  deliveryType?: "inside" | "outside";
  setDeliveryType?: (v: "inside" | "outside") => void;
  paymentMethod?: "cod" | "prepaid";
  setPaymentMethod?: (v: "cod" | "prepaid") => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const CustomerInfo = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  district,
  setDistrict,
  deliveryType,
  setDeliveryType,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  submitting,
}: CustomerInfoProps) => {
  return (
    <section>
      <form
        className="flex flex-col gap-5 md:gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* customer info start */}
        <div className="flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white/90 shadow-sm p-5 md:p-6">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            কাস্টমার তথ্য
          </h1>
          <div className="flex flex-col gap-5">
            <div className="grid min-[550px]:grid-cols-2 grid-cols-1 gap-5">
              <input
                className="border-[1.5px] border-gray-300 outline-none rounded-[5px] py-[10px] px-2 text-sm focus:border-[#6d198a] placeholder:text-gray-500"
                type="email"
                placeholder="ইমেইল (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!email}
              />
              <input
                className="border-[1.5px] border-gray-300 outline-none rounded-[5px] py-[10px] px-2 text-sm focus:border-[#6d198a] placeholder:text-gray-500"
                type="text"
                placeholder="সম্পূর্ণ নাম *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid min-[550px]:grid-cols-2 grid-cols-1 gap-5">
              <input
                className="border-[1.5px] border-gray-300 outline-none rounded-[5px] py-[10px] px-2 text-sm focus:border-[#6d198a] placeholder:text-gray-500"
                type="text"
                placeholder="এলাকা / সিটি"
                value={district || ""}
                onChange={(e) => setDistrict?.(e.target.value)}
              />
              <input
                className="border-[1.5px] border-gray-300 outline-none rounded-[5px] py-[10px] px-2 text-sm focus:border-[#6d198a] placeholder:text-gray-500"
                type="text"
                placeholder="সম্পূর্ণ ঠিকানা *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1">
              <input
                className="border-[1.5px] border-gray-300 outline-none rounded-[5px] py-[10px] px-2 text-sm focus:border-[#6d198a] placeholder:text-gray-500"
                type="text"
                placeholder="ফোন নম্বর *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        {/* customer info end  */}

        {/* delivery type */}
        <div className="flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white/90 shadow-sm p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            ডেলিভারি টাইপ
          </h2>
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="deliveryType"
                value="inside"
                checked={deliveryType === "inside"}
                onChange={() => setDeliveryType?.("inside")}
                className="accent-primary"
              />
              <span>ঢাকার ভিতরে (60৳)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="deliveryType"
                value="outside"
                checked={deliveryType === "outside"}
                onChange={() => setDeliveryType?.("outside")}
                className="accent-primary"
              />
              <span>ঢাকার বাইরে (120৳)</span>
            </label>
          </div>
        </div>

        {/* payment method */}
        <div className="flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white/90 shadow-sm p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            পেমেন্ট পদ্ধতি
          </h2>
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod?.("cod")}
                className="accent-primary"
              />
              <span>ক্যাশ অন ডেলিভারি</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary hover:bg-primary/90 transition-colors text-white text-base md:text-lg py-3.5 font-medium rounded-full flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <IoCartOutline size={24} />
          {submitting ? "অর্ডার হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
        </button>
      </form>
    </section>
  );
};

export default CustomerInfo;
