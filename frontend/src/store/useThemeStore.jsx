import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: typeof window !== "undefined" && localStorage.getItem("talksy-theme") || "coffee",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("talksy-theme", theme);
    }
    set({ theme });
  },
}));
