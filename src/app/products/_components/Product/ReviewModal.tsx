"use client";
import { useAuth } from "../../../../context/AuthContext";
import { createReview } from "../../../../lib/api-services";
import { API_CONFIG } from "../../../../lib/api-config";
import { Review } from "@/types/review";
import { Button, Modal, Rate } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ReviewModalProps {
  productId: number;
  companyId?: string;
  onSubmitted?: (review: Review) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ productId, companyId, onSubmitted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userSession } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const showModal = () => {
    if (userSession) {
      setIsModalOpen(true);
      return;
    }
    toast("রিভিউ লিখতে আগে অনুগ্রহ করে লগইন করুন", { icon: "🔒" });
  };

  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      toast.error("অনুগ্রহ করে রেটিং এবং রিভিউ দুটোই প্রদান করুন।");
      return;
    }

    if (!userSession?.accessToken) {
      toast.error("রিভিউ সাবমিট করতে হলে আপনাকে লগইন থাকতে হবে।");
      return;
    }

    try {
      setSubmitting(true);
      const created = await createReview(
        { productId, rating, comment: review },
        userSession.accessToken,
        companyId || userSession.companyId || API_CONFIG.companyId
      );
      onSubmitted?.(created);
      toast.success("রিভিউ সফলভাবে সাবমিট হয়েছে!");
      setIsModalOpen(false);
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("রিভিউ সাবমিট করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={showModal}
        className="max-w-max border border-primary hover:bg-primary hover:text-white transition-all duration-200 ease-linear px-2.5 py-1.5 rounded-full sm:text-sm text-xs"
      >
        রিভিউ লিখুন
      </button>
      <Modal
        title="পণ্যের রিভিউ লিখুন"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            disabled={!rating || !review.trim()}
            loading={submitting}
          >
            সাবমিট
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold">আপনার রেটিং</h2>
            <Rate
              style={{ fontSize: "1.2rem" }}
              allowHalf={false}
              value={rating}
              onChange={setRating}
            />
          </div>
          <div>
            <textarea
              className="border-[1.5px] outline-none border-gray-400 rounded w-full p-2"
              name="review"
              id="review"
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="এখানে আপনার রিভিউ লিখুন..."
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReviewModal;
