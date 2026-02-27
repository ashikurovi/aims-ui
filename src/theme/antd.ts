import { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#008C45",
    borderRadius: 3,
    fontFamily: "var(--font-hindSiliguri)",
  },
  components: {
    Tabs: {
      // cardBg: "#10BBFA",
      // itemColor: "#fff",
      // itemHoverColor: "#fff",
    },
    Collapse: {
      contentBg: "#fff",
      headerBg: "#fff",
    },
    Checkbox: {
      colorBorder: "gray",
    },
    Rate: {
      starSize: 13,
      starColor: "#ffa534",
    },
  },
};

export { theme };
