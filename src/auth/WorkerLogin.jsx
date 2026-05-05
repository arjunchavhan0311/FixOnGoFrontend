import { motion } from "framer-motion";
import { useState } from "react";
import {
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiHammerFill,
  RiLockPasswordLine,
  RiMailLine
} from "react-icons/ri";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../services/worker-service";

function WorkerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await logIn(formData);

      if (!response.token) {
        alert("Login failed");
        setLoading(false);
        return;
      }

      // Save auth
      localStorage.setItem(
        "fixongo_auth",
        JSON.stringify({
          id: response.id,
          token: response.token,
          role: response.role,
          email: formData.email,
          city: response.city,
        })
      );

      setLoading(false);

      // ✅ Navigate to dashboard
      navigate("/workerdashboard");

    } catch (error) {
      setLoading(false);
      setShowForgot(true); // ✅ show forgot option
      alert(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans pt-20 lg:pt-0">

      {/* LEFT BRANDING */}
      <div className="w-full lg:w-5/12 bg-slate-900 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] border-[40px] border-blue-600 rounded-full" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex bg-blue-600 text-white px-5 py-2 rounded-xl rotate-[-2deg] mb-8 shadow-xl"
          >
            <span className="text-sm font-black italic uppercase">
              FixOn<span className="text-slate-900 not-italic">Go</span> Pro
            </span>
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Turn your skills <br /> into <span className="text-blue-500 italic">Earnings.</span>
          </h1>
        </div>

        <div className="space-y-4 hidden sm:block relative z-10">
          {[
            "Access high-paying local jobs",
            "Manage your pro dashboard",
            "Track weekly service payouts"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <RiCheckboxCircleFill className="text-blue-500" size={20} />
              <p className="text-slate-300 font-medium text-sm">{text}</p>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          Secure Partner Portal • 2026
        </p>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 lg:bg-white">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900">Pro Login</h2>
            <p className="text-slate-500 mt-1">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@provider.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white font-bold"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Password
              </label>
              <div className="relative group">
                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white font-medium"
                />
                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                </button>
              </div>
            </div>

            {/* ACTION */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-950 shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {loading ? "Logging in..." : <>Go Online <RiArrowRightLine size={20} /></>}
            </button>
            {showForgot && (
              <div className="text-right -mt-3">
                <span
                  onClick={() => {
                    navigate("/forgot-password/worker");
                  }}
                  className="text-sm text-red-500 font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>
            )}
          </form>

          {/* REGISTER */}
          <div className="mt-10 p-5 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600">
              <RiHammerFill size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase">New to the platform?</p>
              <Link to="/workerregistration" className="text-sm font-bold text-blue-600 hover:underline">
                Register as a Pro Partner
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default WorkerLogin;
