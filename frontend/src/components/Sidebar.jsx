import { useEffect } from "react";
import { Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">联系人</span>
        </div>
        {/* TODO: 仅展示在线的联系人 */}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              // 被选中的用户更改背景
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/defaultAvatar.webp"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {/* 如果是在线的用户，则在头像上有个绿色小圆点 （&&运算符：前面为true，返回后面的表达式） */}
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* 用户信息——仅在屏幕较大时可见 */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "在线" : "离线"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
