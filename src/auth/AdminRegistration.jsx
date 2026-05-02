import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Eye, EyeOff,
  Loader2,
  Lock, Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/admin-service";

const AdminSignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    admin_name: "",
    admin_phoneno: "",
    admin_gender: "",
    admin_age: "",
    email: "",
    street_address: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
    password: "",
    confirmPassword: ""
  });

  const passwordsMatch =
    formData.password === formData.confirmPassword ||
    formData.confirmPassword === "";

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setIsLoading(true);

    const payload = {
      admin_name: formData.admin_name,
      admin_phoneno: formData.admin_phoneno,
      admin_gender: formData.admin_gender,
      admin_age: Number(formData.admin_age),
      email: formData.email,
      password: formData.password,
      street_address: formData.street_address,
      state: formData.state,
      district: formData.district,
      city: formData.city,
      pincode: formData.pinCode     
    };

    try {
      await signUp(payload);
      alert("Admin Account Created Successfully!");
      navigate("/adminlogin");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputClass = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-12 text-sm font-bold outline-none transition-all duration-300 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Brand Gradient Blobs (Matching User Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 blur-[120px] rounded-full opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 blur-[120px] rounded-full opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10 py-10"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-xl shadow-indigo-200 mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-semibold mt-2">Join the internal management team</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSignUp} className="space-y-6">

            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.admin_name}
                    onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    required
                    placeholder="+91 12345 67890"
                    value={formData.admin_phoneno}
                    onChange={(e) => setFormData({ ...formData, admin_phoneno: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Gender & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={formData.admin_gender}
                    onChange={(e) => setFormData({ ...formData, admin_gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 appearance-none outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium shadow-sm cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    required
                    placeholder="More than 18"
                    value={formData.admin_age}
                    onChange={(e) => setFormData({ ...formData, admin_age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Office Address */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 text-slate-400" size={18} />
                <textarea
                  rows="2"
                  placeholder="Building No/Street Address"
                  value={formData.street_address}
                  onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm resize-none"
                ></textarea>

                <div className="grid grid-cols-2 gap-4 mt-4">

                  <input name="state" placeholder="State" className={inputClass} value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                    
                  <input name="district" placeholder="District" className={inputClass} value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })} />

                  <input name="city" placeholder="City" className={inputClass} value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })} />

                  <input name="pinCode" placeholder="Pin Code" className={inputClass} value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} />
                </div>
              </div>

            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full bg-slate-50 border ${!passwordsMatch ? 'border-red-400 bg-red-50' : 'border-slate-100'} rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium shadow-sm`}
                  />
                </div>
              </div>
            </div>

            {!passwordsMatch && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-500 font-black uppercase flex items-center gap-1.5 ml-1">
                <AlertCircle size={14} /> Passwords do not match
              </motion.p>
            )}

            {/* Action Button */}
            <button
              disabled={isLoading || !passwordsMatch || formData.password === ""}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-100"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Create Admin Account <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Login Bridge */}
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
              Existing Member?
            </p>
            <Link to="/adminlogin" className="text-indigo-600 font-black text-sm hover:text-indigo-700 transition-colors">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignUp;
