"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaXmark } from "react-icons/fa6";
import Logo from "../../public/images/logo.png";
import { cn } from "../utils/cn";
import ProfileDropDown from "./drop down/PrfofileDropDown";
import CartDrawer from "./shopping cart/CartDrawer";
import { useAuth } from "../context/AuthContext";
import { API_CONFIG } from "../lib/api-config";
import { getSystemUserByCompanyId } from "../lib/api-services";

const RESELLER_PERMISSION = "RESELLER";

const Header = () => {
  const { userSession } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const router = useRouter();



  const companyId = useMemo(
    () => userSession?.companyId || API_CONFIG.companyId,
    [userSession?.companyId],
  );

  useEffect(() => {
    let mounted = true;
    const loadLogo = async () => {
      if (!companyId) return;
      try {
        const user = await getSystemUserByCompanyId(companyId);
        if (mounted && user?.companyLogo) {
          setLogoSrc(user.companyLogo);
        }
      } catch (error) {
        console.error("Failed to load company logo for header:", error);
      }
    };
    loadLogo();
    return () => {
      mounted = false;
    };
  }, [companyId]);

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    const params = new URLSearchParams();
    params.set("search", query);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <nav className=" bg-gray-100/70 shadow backdrop-blur sticky top-0 z-40">
      <div className=" max-w-7xl px-5 mx-auto flex items-center justify-between gap-5 py-2">
        <Link href="/" className=" cursor-pointer">
          <div>
            {logoSrc ? (
              <Image src={logoSrc} alt="logo" width={100} height={40} unoptimized />
            ) : (
              <Image src={Logo} alt="logo" width={100} />
            )}
          </div>
        </Link>

        {/* search by category and products name  */}

        <div className=" rounded-full border-[.1rem] border-primary flex items-center pr-1 sm:pr-2 pl-2">
          <span className=" text-lg">
            <CiSearch />
          </span>
          <input
            type="text"
            id="Search"
            placeholder="Search for..."
            className="w-full border-none outline-none bg-transparent  sm:py-2.5 py-1.5  pl-3 sm:text-sm text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <span
            onClick={handleSearch}
            className=" bg-primary text-white sm:px-3 px-2 sm:py-1 py-[2px] sm:text-base text-sm rounded-full cursor-pointer"
          >
            Search
          </span>
        </div>

        <div className="flex  gap-5 items-center">
          <div className="min-[950px]:flex hidden">
            <ul className=" flex gap-2">
              <Link
                href="/"
                className=" text-lg font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                হোম
              </Link>
              <Link
                href="/products"
                className=" text-lg font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                শপ
              </Link>
              <Link
                href="/order-tracking"
                className=" text-lg font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                অর্ডার ট্র্যাকিং
              </Link>
              <Link
                href="/contact-us"
                className=" text-lg font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                যোগাযোগ
              </Link>
              <Link
                href="/flashSell"
                className=" text-lg font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                ফ্ল্যাশ সেল
              </Link>
              {/* <Link
                href="/reseller"
                className=" text-lg font-medium px-3 py-2 hover:text-primary transition-all ease-linear duration-200"
              >
                রিসেলার
              </Link> */}
            </ul>
          </div>
          <div className=" flex gap-4 items-center  ">
            {/* <div className=" md:block  hidden text-2xl cursor-pointer">
              <TbCategoryPlus />
            </div> */}
            <div className="md:block hidden">
              <CartDrawer />
            </div>
            <div className=" md:block hidden cursor-pointer">
              <ProfileDropDown />
            </div>
            <div
              onClick={() => setToggle(!toggle)}
              className=" py-2 pl-2 min-[950px]:hidden flex text-2xl cursor-pointer"
            >
              {toggle ? <FaXmark /> : <FaBars />}
            </div>
          </div>
        </div>
      </div>
      {/* small device menu bar  */}

      <div
        className={`bg-white shadow-md absolute backdrop-blur-xl min-[950px]:hidden block transition-all ease-linear duration-200 ${cn(
          toggle ? "left-0" : "-left-80",
          toggle && "right-0",
        )}`}
      >
        <ul className=" flex flex-col bg gap-2">
          <Link
            onClick={() => setToggle(!toggle)}
            href="/"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200  hover:bg-primary/5"
          >
            হোম
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/products"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            শপ
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/order-tracking"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            অর্ডার ট্র্যাকিং
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/contact-us"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            যোগাযোগ
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/flashSell"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            ফ্ল্যাশ সেল
          </Link>
          <Link
            onClick={() => setToggle(!toggle)}
            href="/reseller"
            className=" text-lg font-medium px-5 py-2 hover:text-primary transition-all ease-linear duration-200 hover:bg-primary/5"
          >
            রিসেলার
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
