import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { TbCategoryPlus } from "react-icons/tb";
import { IoFlash } from "react-icons/io5";
import CartDrawer from "./shopping cart/CartDrawer";

const BottomNav = () => {
  return (
    <div className=" md:hidden block sticky bg-gray-200/70 backdrop-blur left-0 right-0 bottom-0 border-t border-gray-400">
      <div className="w-full  grid grid-cols-5 gap-4 justify-between items-center px-5  ">
        <Link
          href="/"
          className=" py-3 flex items-center justify-center hover:text-primary transition-all duration-150 ease-linear  text-2xl cursor-pointer "
        >
          <GoHome />
        </Link>
        <Link
          href="/flashSell"
          className=" py-3 flex items-center justify-center hover:text-primary transition-all duration-150 ease-linear text-2xl cursor-pointer "
        >
          <IoFlash />
        </Link>
        <div className=" py-3 flex items-center justify-center hover:text-primary transition-all duration-150 ease-linear text-2xl cursor-pointer ">
          <TbCategoryPlus />
        </div>
        <>
          <CartDrawer />
        </>
        <Link
          href="/my-account"
          className="py-3 flex items-center justify-center hover:text-primary transition-all duration-150 ease-linear text-[1.3rem] cursor-pointer"
        >
          <FaRegUser />
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
