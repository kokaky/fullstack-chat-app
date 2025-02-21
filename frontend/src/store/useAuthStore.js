import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// create中的对象则为初始状态
export const useAuthStore = create((set, get) => {
  return {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true, // 当刷新页面时，检查此用户是否经过身份验证

    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        get().connectSocket();
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
        get().connectSocket();
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
        get().disconnectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("登陆成功");

        //登陆成功后，连接为socket——使用get()方法获取本文件中定义的属性和方法。因此定义一个connectSocket()方法用于连接socket服务
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("头像上传成功！");
      } catch (error) {
        console.log("错误发生在头像上传:", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    connectSocket: () => {
      const { authUser } = get();
      // 如果未登陆 或者 已连接，则不进行socket连接
      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });
      socket.connect();
      set({ socket: socket });

      // 监听getOnlineUsers事件
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },
    disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
    },
  };
});
