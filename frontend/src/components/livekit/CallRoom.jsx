import { useEffect } from "react";
import { LiveKitRoom, useLiveKitRoom } from "@livekit/components-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useLiveKitStore } from "../../store/useLiveKitStore";

const CallRoom = () => {
  const { serverUrl, token, callType, videoType, getCall, getVideo } =
    useLiveKitRoom();
  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();

  // 当点击语音or视频按钮，就获取这个组件，这个组件一加载，就向后端发送 请求语音or视频的信息
  useEffect(() => {
    if (!authUser?.fullName) return;
    //发送视频的请求
    if (!callType) {
      getVideo(roomId, authUser.fullName);
    }
    getCall();
  });
  return (
    <LiveKitRoom serverUrl={serverUrl} token={token} connect={true}>
      CallRoom
    </LiveKitRoom>
  );
};

export default CallRoom;
