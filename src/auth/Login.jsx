import { motion } from "framer-motion";
import { useState } from "react";
import { RiArrowRightLine, RiCloseLine, RiLockPasswordLine, RiMailLine } from "react-icons/ri";
import { logIn } from "../services/customer-service";

function Login({ onLogin, onClose, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const user = await logIn({ email, password });

    console.log("LOGIN RESPONSE:", user);

    if (!user || !user.token) {
      alert("Login failed");
      return;
    }

    localStorage.setItem(
      "fixongo_auth",
      JSON.stringify({
        id: user.id,
        token: user.token,
        role: user.role,
        email: user.email,
        city: user.city,
      })
    );

    onLogin();

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Invalid email or password";

    alert(msg);
  }
};


  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Login Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
        >
          <RiCloseLine size={24} />
        </button>

        <form className="p-10" onSubmit={submit}>
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-block bg-slate-950 text-white px-4 py-1.5 rounded-xl rotate-[-2deg] mb-4">
              <span className="text-xl font-black tracking-tighter italic">
                FixOn<span className="text-blue-500 not-italic">Go</span>
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm font-medium mt-2">Enter your details to access your account</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="relative group">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="email"
                placeholder="Email Address" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="relative group">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-950 shadow-xl shadow-blue-200 hover:shadow-slate-300 transition-all active:scale-[0.98]"
          >
            Login to Account <RiArrowRightLine size={18} />
          </button>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              New to FixOnGo?{" "}
              <span 
                onClick={onSignup}
                className="text-blue-600 cursor-pointer hover:underline underline-offset-4 decoration-2"
              >
                Create an account
              </span>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;