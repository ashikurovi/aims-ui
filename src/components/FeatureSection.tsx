import {
  FaAward,
  FaCertificate,
  FaGift,
  FaHandshake,
  FaTruckFast,
} from "react-icons/fa6";
import { RiShieldCheckFill } from "react-icons/ri";

const items = [
  {
    id: 1,
    title: "অনলাইন সাপোর্ট",
    icon: <FaHandshake />,
  },
  {
    id: 2,
    title: "অফিসিয়াল পণ্য",
    icon: <FaGift />,
  },
  {
    id: 3,
    title: "দ্রুততম ডেলিভারি",
    icon: <FaTruckFast />,
  },
  {
    id: 4,
    title: "নিরাপদ অর্থপ্রদান",
    icon: <RiShieldCheckFill />,
  },
  {
    id: 5,
    title: "প্রকৃত পণ্য",
    icon: <FaCertificate />,
  },
  {
    id: 6,
    title: "ISO সার্টিফাইড",
    icon: <FaAward />,
  },
];

const FeatureSection = () => {
  return (
    <section className=" mt-8 bg-gray-100 ">
      <div className=" max-w-7xl mx-auto px-5 py-5 grid grid-cols-[repeat(auto-fit,_minmax(90px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] gap-3">
        {items.map((item) => (
          <div key={item.id} className=" flex flex-col items-center gap-1 ">
            <span className=" bg-primary text-white sm:text-4xl text-2xl sm:p-3 p-2 rounded-full">
              {item.icon}
            </span>
            <h3 className=" sm:text-base text-sm">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
