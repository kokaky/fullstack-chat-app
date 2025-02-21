import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => {
  return {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
      set({ isUsersLoading: true });
      try {
        const res = await axiosInstance.get("/messages/users");
        set({ users: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isUsersLoading: false });
      }
    },

    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    sendMessages: async (messageData) => {
      //通过get方法可以获取到该文件中定义的变量；set方法则可以在该文件中设置
      const { selectedUser, messages } = get();
      try {
        const res = await axiosInstance.post(
          `/messages/send/${selectedUser._id}`,
          messageData
        );
        set({ messages: [...messages, res.data] });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    // 接收实时消息
    subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      // 应该和 const {socket} = useAuthStore() 效果一致
      const socket = useAuthStore.getState().socket;

      socket.on("newMessage", (newMessage) => {
        // 如果没有这个判断条件，那么在getMessage（因为选择了用户时会调用getMessage）时，newMessage就会直接添加到messges当中，从而渲染；并且渲染的时候发现发送ID不是user自己，因此消息位置位于start
        if (newMessage.senderId !== selectedUser._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
    },

    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off();
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
  };
});
