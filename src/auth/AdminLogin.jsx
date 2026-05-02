import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logIn } from "../services/admin-service";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ================= LOGIN HANDLER (FIXED) ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await logIn({
        email: formData.email,
        password: formData.password,
      });

      // ✅ STORE TOKEN IN EXPECTED FORMAT
      localStorage.setItem(
        "fixongo_auth",
        JSON.stringify({
          token: response.token,
          role: response.role || "ADMIN",
          email: response.email || formData.email,
          city: response.city || "Unknown",
        })
      );

      alert(response.message || "Login successful");

      navigate("/adminpage");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Invalid email or password");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-100 blur-[120px] rounded-full opacity-70" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-indigo-100 blur-[120px] rounded-full opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 bg-indigo-600 rounded-3xl items-center justify-center shadow-2xl shadow-indigo-200 mb-6">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-semibold mt-2">
            Sign in to your admin dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[48px] shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Work Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@fixit.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-100"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In to Terminal
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Signup */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
              Create New Account
            </p>
            <Link
              to="/adminsignup"
              className="text-indigo-600 font-black text-sm hover:text-indigo-700 transition-colors"
            >
              Admin Registration
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          Secure System Access • 2026 FixOnGo Ops
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
