import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* 图标呈现 */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* 欢迎界面 */}
        <h2 className="text-2xl font-bold">开始聊天</h2>
        <p className="text-base-content/60">从聊天框中选择开始聊天</p>
      </div>
    </div>
  );
};

export default NoChatSelected;
