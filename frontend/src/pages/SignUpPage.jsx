/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Mail,
  MessageSquare,
  User,
  Lock,
  EyeOff,
  Eye,
  Loader2,
} from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("昵称不能为空！");
    if (!formData.email.trim()) return toast.error("邮箱不能为空！");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("邮箱格式无效！");
    if (!formData.password.trim()) return toast.error("密码不能为空！");
    if (formData.password.length < 6)
      return toast.error("密码长度必须不小于6！");
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      signup(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">创建账号</h1>
              <p className="text-base-content/600">开始创建一个你的免费账号</p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">昵称:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="请输入昵称"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">邮箱:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">密码:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="请输入密码,不少于6位"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* 当isSigningUp为true时，表示此时正在注册，不能点击按钮，显示Loding状态；当为false状态时，则可以点击，显示“创建账户” 
                点击创建账户，会去调用后端的注册方法，并将isSigningUp改为true；注册方法执行完毕后再改回为false
                点击之后提交，会触发form 的submit方法
            */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  注册中...
                </>
              ) : (
                "创建账户"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              已有账号?
              <Link to="/login" className="link link-primary">
                请登陆
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern title="加入社区" subtitle="与朋友联系、分享时刻" />
    </div>
  );
};

export default SignUpPage;
