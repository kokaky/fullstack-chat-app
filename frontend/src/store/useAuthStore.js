import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// create中的对象则为初始状态
export const useAuthStore = create((set) => {
  return {
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true, // 当刷新页面时，检查此用户是否经过身份验证

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
      } catch (error) {
        console.log("错误发生在checkAuth:", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (data) => {
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("账号创建成功，请登陆");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isSigningUp: false });
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("退出成功");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  };
});
