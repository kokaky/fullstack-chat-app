import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, Phone, Video } from "lucide-react";
import { useLiveKitStore } from "../store/useLiveKitStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { getCall } = useLiveKitStore();

  const call = () => {
    getCall();
    return;
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 头像 */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "defaultAvatar.webp"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* 用户信息 */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "在线" : "离线"}
            </p>
          </div>
        </div>

        <div className="flex gap-5">
          {/* 视频和语音选项 */}
          <button onClick={() => call()}>
            <Phone />
          </button>
          <button>
            <Video />
          </button>
          {/* 关闭按钮 */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
