import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useLiveKitStore = create((set, get) => {
  return {
    token: "",
    serverUrl: "wss://chat-app-s7ne1b3v.livekit.cloud",
    callType: false,
    videoType: false,

    getToken: async () => {
      try {
        const newToken = await axiosInstance.get("/livekit/getToken");
        console.log("newToken:", newToken);

        set({ token: newToken });
      } catch (error) {
        console.log("获取语音视频token失败:", error);
      }
    },

    getCall: () => {
      set({ callType: true });
      get().getToken();
      // 然后向服务器发起电话
    },

    getVideo: () => {
      set({ videoType: true });
      // 然后向服务器发起电话
    },

    cancleCall: () => {
      set({ callType: false });
    },

    cancleVideo: () => {
      set({ videoType: false });
    },
  };
});
