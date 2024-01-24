export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      width: {
        "1/9": "11.111111",
      },
      colors: {
        lightMode: {
          layoutColor: "#f9fafb",
          itemBackgroundColor: "#f3f4f6",
          sidebarColor: "#FFFFFF",
          sidebarItemIconColor: "#9d174d",
          sidebarItemColorHover: "#fdf2f8",
          sidebarItemTextColor: "#4b5563",
          sidebarItemGradientFrom: "#fbcfe8",
          sidebarItemGradientTo: "#fce7f3",
          sidebarBubbleColor: "#f472b6",
          topBarColor: "#FFFFFF",
        },
        lightMode2: {
          sidebarBubbleColor: "#c084fc",
        },
        darkMode: {
          backgroundColor: "#0A0A0A",
          itemBackgroundColor: "#0F0F0F",
          borderColor: "#202020",
          sidebarColor: "#111111",
          topBarColor: "#111111",
          layoutColor: "#0A0A0A",
          evenRowTable: "#0D0D0D",
          oddRowTable: "#111111",
          hoverRowTable: "#151515",
          tableHeaderTextColor: "#6b7280",
          borderRowColor: "#030712",
          textColor: "#9ca3af",
          itemSelectedSidebarColor: "#9d174d",
          itemHoverSidebarColor: "#831843",
          itemSelectedIndicatorSidebarColor: "#500724",
          selectedTableRow: "#1E1E1E",
        },
      },
    },
  },
  plugins: [],
};
