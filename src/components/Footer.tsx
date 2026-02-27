"use client";

import Logo from "../../public/images/logo.png";
import PaymentGateway from "../../public/images/payment-gateway.webp";
import { useAuth } from "../context/AuthContext";
import { API_CONFIG } from "../lib/api-config";
import { getCategories, getSystemUserByCompanyId } from "../lib/api-services";
import { Category } from "../types/category";
import { SystemUser } from "../types/system-user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  const { userSession } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<SystemUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const companyId = useMemo(
    () => userSession?.companyId || API_CONFIG.companyId,
    [userSession?.companyId],
  );

  useEffect(() => {
    let mounted = true;
    const loadCompanyInfo = async () => {
      if (!companyId) return;
      const data = await getSystemUserByCompanyId(companyId);
      if (mounted && data) {
        setCompanyInfo(data);
      }
    };
    loadCompanyInfo();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      const data = await getCategories(companyId);
      if (mounted && Array.isArray(data) && data.length) {
        setCategories(data);
      }
    };
    loadCategories();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  const companyName = companyInfo?.companyName || "চিত্রকর্ম";
  const branchLocation =
    companyInfo?.branchLocation || "স্টেশন রোড, শাপলা চত্তর, রংপুর।";
  const phone = companyInfo?.phone || "(+৮৮) ০১৭৭৪৬১৭৪৫২";
  const email = companyInfo?.email || "skshobuj9988@gmail.com";
  const logoSrc = companyInfo?.companyLogo;
  const fallbackCategories = [
    { name: "ওয়ালবোর্ড", slug: "wallboard" },
    { name: "ক্যানভাস প্রিন্ট", slug: "canvas-print" },
    { name: "দোয়া কার্ড", slug: "dua-card" },
    { name: "দাওয়া ক্যানভাস", slug: "dawah-canvas" },
    { name: "ওয়াল হ্যাঙ্গিং", slug: "wall-hanging" },
    { name: "ইভেন্ট বোর্ড", slug: "event-board" },
    { name: "প্রচারমূলক জিনিসপত্র", slug: "promo-items" },
    { name: "উপহার সামগ্রী", slug: "gift-items" },
    { name: "আনুষাঙ্গিক", slug: "accessories" },
    { name: "কাস্টম পণ্য", slug: "custom-products" },
  ];
  const visibleCategories = categories.length ? categories : fallbackCategories;

  return (
    <footer className=" bg-[#212121]">
      <div className=" max-w-7xl mx-auto py-16 px-5 flex min-[910px]:flex-row flex-col gap-5">
        <div className=" flex flex-col gap-3 min-[910px]:flex-[0_0_30%] ">
          <Link href="/">
            {logoSrc ? (
              <Image src={logoSrc} alt="logo" width={120} height={60} unoptimized />
            ) : (
              <Image src={Logo} alt="logo" width={120} />
            )}
          </Link>
          <p className=" text-[#ffffffe6]">
            <strong>{companyName}</strong>– আপনার লাইফস্টাইলের জন্য নির্ভরযোগ্য
            ইকমার্স। আমরা সরবরাহ করি মানসম্পন্ন লাইফস্টাইল পণ্য, দ্রুত ডেলিভারি
            এবং সন্তুষ্টি নিশ্চিত সেবা।
          </p>
          <p className=" text-[#ffffffe6]">{branchLocation}</p>
          <p className=" text-[#ffffffe6]">{phone}</p>
          <div className=" flex gap-2 text-white">
            <Link
              href={`mailto:${email}`}
              className=" border rounded-full p-2 text-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            >
              <MdOutlineEmail />
            </Link>
            <Link
              href="/"
              className=" border rounded-full p-2 text-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="/"
              className=" border rounded-full p-2 text-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            >
              <FaXTwitter />
            </Link>
            <Link
              href="/"
              className=" border rounded-full p-2 text-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            >
              <FaInstagram />
            </Link>
            <Link
              href="/"
              className=" border rounded-full p-2 text-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            >
              <FaTiktok />
            </Link>
            <Link
              href="/"
              className=" border rounded-full p-2 text-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            >
              <FaPinterest />
            </Link>
          </div>
        </div>
        <div className=" grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] w-full gap-2">
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">ক্যাটাগরিসমূহ</h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              {visibleCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className=" hover:text-primary transition-all ease-linear duration-150"
                >
                  {category.name}
                </Link>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">দরকারী লিঙ্ক</h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                হোম
              </Link>
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                সংগ্রহ
              </Link>
              {/* <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                ব্লগ
              </Link> */}
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                অফার
              </Link>
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                অনুসন্ধান
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">সহায়তা কেন্দ্র</h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              <Link
                href="/my-account/dashboard"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                আমার অ্যাকাউন্ট
              </Link>
              <Link
                href="/my-account/orders"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                আমার অর্ডার
              </Link>
              <Link
                href="/view-cart"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                ইচ্ছার তালিকা
              </Link>
              {/* <Link
                href="/contact-us"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী
              </Link> */}
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                আমাদের সাথে যোগাযোগ করুন
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-8 ">
            <h2 className=" text-white font-medium text-lg">
              লিগ্যাল ইনফরমেশন
            </h2>
            <ul className=" text-[#ffffffe6] flex flex-col gap-1">
              <Link
                href="/terms"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                টার্মস এবং কন্ডিশন
              </Link>
              <Link
                href="/privacy-policy"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                প্রাইভেসি পলিসি
              </Link>
              <Link
                href="/refund-and-return-policy"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                রিফান্ড এবং রিটার্ন পলিসি
              </Link>
              {/* <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                ওয়ারেন্টি সার্ভিসেস
              </Link>
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                {" "}
                শিপিং মেথড
              </Link>
              <Link
                href="/"
                className=" hover:text-primary transition-all ease-linear duration-150"
              >
                পেমেন্ট মেথড
              </Link> */}
            </ul>
          </div>
        </div>
      </div>
      <div className=" border-t">
        <div className="max-w-7xl mx-auto px-5 sm:py-4 py-3 flex items-center justify-between gap-2 min-[700px]:flex-row flex-col">
          <div>
            <p className="text-[#ffffffe6] text-[15px]">
              কপিরাইট © 2024 চিত্রকর্ম সর্বস্বত্ব সংরক্ষিত
            </p>
          </div>
          <div>
            <Image
              src={PaymentGateway}
              alt="PaymentGateway"
              width={450}
              height={100}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
