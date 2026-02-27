import localFont from "next/font/local";

// Font paths relative to this file (src/app/) so next/font resolves them reliably
export const hindSiliguriFonts = localFont({
  src: [
    {
      path: "./fonts/Hind_Siliguri/HindSiliguri-Light.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "./fonts/Hind_Siliguri/HindSiliguri-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Hind_Siliguri/HindSiliguri-Medium.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "./fonts/Hind_Siliguri/HindSiliguri-SemiBold.ttf",
      weight: "600",
      style: "semiBold",
    },
    {
      path: "./fonts/Hind_Siliguri/HindSiliguri-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-hindSiliguri",
});
