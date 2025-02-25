/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useLiveKitStore } from "../../store/useLiveKitStore.js";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const CallRoom = ({ audio, video, handleDisconnect }) => {
  const { serverUrl, getToken } = useLiveKitStore();
  const { authUser } = useAuthStore();
  const { selectedUser, sendMessages } = useChatStore();

  // token不能使用全局的
  const [token, setToken] = useState("");

  // 当点击语音or视频按钮，就获取这个组件，这个组件一加载，就向后端发送 请求语音or视频的访问token
  // 并且只要用户发生了改变 就获取新访问token
  useEffect(() => {
    if (!authUser?.fullName) return;

    //发送获取token
    (async () => {
      try {
        const res = await getToken(selectedUser._id, authUser.fullName);
        setToken(res);
      } catch (error) {
        toast.error("无法进行通话");
      }
    })();
  }, [authUser?.fullName, selectedUser._id]);

  if (token === "") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-foreground" />
        <p className="text-sm text-foreground">加入中...</p>
        <button className="mt-4" onClick={handleDisconnect}>
          取消
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={serverUrl}
        token={token}
        video={video}
        audio={audio}
        connect={true}
        onDisconnected={handleDisconnect}
        onConnected={() => {
          sendMessages({ text: "请加入通话", image: "" });
        }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};

export default CallRoom;
