import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useLiveKitStore = create((set, get) => {
  return {
    token: "",
    serverUrl: "wss://chat-app-s7ne1b3v.livekit.cloud",
    callType: "",
    roomId: "",

    setCallType: (type) => {
      set({ callType: type });
    },

    getToken: async (room, fullName) => {
      try {
        // 获取token之前，先判断数据库中是否有关于自身id的room
        const user = useAuthStore.getState().authUser;

        const roomRes = await axiosInstance.get(`/room/${user._id}`);
        console.log("roomRes:", roomRes);
        if (roomRes.data.length > 0) {
          // 如果不为空，则说明有对应的roomId，则设置room为查找出来的roomId
          // 否则就用之前传来的room
          room = roomRes.data.roomId;
        }
        console.log("room:", room);

        set({ roomId: room });
        const res = await axiosInstance.get(
          `/livekit/getToken/?room=${room}&fullName=${fullName} (${Math.floor(
            Math.random() * 2000
          )})`
        );
        const status = res.status;
        if (status !== 200) return "";

        const newToken = res.data.accessToken;
        return newToken;
      } catch (error) {
        toast.error("暂时无法进行通话");
        console.log("获取语音视频token失败:", error);
      }
    },

    removeRoomId: async () => {
      try {
        if (get().roomId)
          await axiosInstance.removeRoomId(`/room/${get().roomId}`);
        toast.success("通话结束");
      } catch (error) {
        console.log("错误发生在removeRoomId", error);
        toast.error("退出失败");
      }
    },
  };
});
