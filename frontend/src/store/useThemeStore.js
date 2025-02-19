// 当每次刷新页面时，将主题保存到本地存储

import { create } from "zustand";

export const useThemeStore = create((set) => {
  return {
    theme: localStorage.getItem("chat-theme") || "light",
    setTheme: (theme) => {
      localStorage.setItem("chat-theme", theme);
      set({ theme });
    },
  };
});
