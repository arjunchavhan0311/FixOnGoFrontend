import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCakeLine,
  RiCheckLine,
  RiCloseLine,
  RiLockPasswordLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiShieldUserLine,
  RiUserLine,
  RiUserSmileLine
} from "react-icons/ri";
import { signUp } from "../services/customer-service";


function Signup({ onClose, onLogin, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
    officeAddress: "",
  });

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genders = ["Male", "Female", "Other"];

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectGender = (val) => {
    setForm({ ...form, gender: val });
    setIsGenderOpen(false);
  };

  // 🔥 SIGNUP INTEGRATION LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      customer_name: form.name,
      email: form.email,
      password: form.password,
      customer_phoneno: form.phone,
      customer_age: Number(form.age),
      customer_gender: form.gender,
      street_address: form.address,
      state: form.state,
      district: form.district,
      city: form.city,
      pincode: form.pinCode,
      customer_office_address: form.officeAddress,
    };

    try {
      await signUp(payload);
      alert("Signup successful");
      onSwitchToLogin && onSwitchToLogin();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-12 text-sm font-bold outline-none transition-all duration-300 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300 z-10 pointer-events-none";

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl z-10 my-auto p-8 md:p-14 overflow-visible"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
          <RiCloseLine size={24} />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-10">
            <div className="inline-flex bg-slate-950 text-white px-4 py-2 rounded-xl rotate-[-2deg] mb-6 shadow-lg shadow-slate-200">
              <span className="text-lg font-black tracking-tighter italic">
                FixOn
              <span className="text-blue-500 not-italic">
                Go
              </span></span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Account
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative group">
             <RiUserLine className={iconClass} size={20} />
             <input name="name" placeholder="Full Name" className={inputClass} onChange={change} />
            </div>
            <div className="relative group">
              <RiMailLine className={iconClass} size={20} />
              <input name="email" placeholder="Email Address" className={inputClass} onChange={change} />
            </div>
            <div className="relative group">
              <RiPhoneLine className={iconClass} size={20} />
              <input name="phone" placeholder="Phone Number" className={inputClass} onChange={change} />
            </div>

            {/* Age & CUSTOM GENDER */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <RiCakeLine className={iconClass} size={20} />
                <input name="age" placeholder="Age" className={inputClass} onChange={change} />
              </div>

              {/* Custom Animated Gender Select */}
              <div className="relative group">
                <RiUserSmileLine className={iconClass} size={20} />
                <div
                  onClick={() => setIsGenderOpen(!isGenderOpen)}
                  className={`cursor-pointer ${inputClass} flex items-center justify-between ${form.gender ? 'text-slate-900' : 'text-slate-400'}`}
                >
                  {form.gender || "Gender"}
                  <RiArrowDownSLine className={`transition-transform duration-300 ${isGenderOpen ? 'rotate-180' : ''}`} size={20} />
                </div>

                <AnimatePresence>
                  {isGenderOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 5 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] overflow-hidden p-1"
                    >
                      {genders.map((g) => (
                        <div
                          key={g}
                          onClick={() => selectGender(g)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
                        >
                          {g}
                          {form.gender === g && <RiCheckLine className="text-blue-600" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative group md:col-span-2"><RiMapPinLine className={iconClass} size={20} /><input name="address" placeholder="Street Address / Area House No." className={inputClass} onChange={change} /></div>
             
             <div className="relative group md:col-span-"><RiMapPinLine className={iconClass} size={20} /><input name="state" placeholder="State" className={inputClass} onChange={change} /></div>
             
              <div className="relative group md:col-span-1"><RiMapPinLine className={iconClass} size={20} /><input name="district" placeholder="District" className={inputClass} onChange={change} /></div>
             
              <div className="relative group md:col-span-1"><RiMapPinLine className={iconClass} size={20} /><input name="city" placeholder="City" className={inputClass} onChange={change} /></div>
              
               <div className="relative group md:col-span-1"><RiMapPinLine className={iconClass} size={20} /><input name="pinCode" placeholder="Pin Code" className={inputClass} onChange={change} /></div>

            <div className="relative group md:col-span-2"><RiMapPinLine className={`${iconClass} opacity-30`} size={20} /><input name="officeAddress" placeholder="Office Address (Optional)" className={`${inputClass} border-dashed`} onChange={change} /></div>
            <div className="relative group"><RiLockPasswordLine className={iconClass} size={20} /><input name="password" type="password" placeholder="Password" className={inputClass} onChange={change} /></div>
            <div className="relative group"><RiShieldUserLine className={iconClass} size={20} /><input name="confirmPassword" type="password" placeholder="Confirm" className={inputClass} onChange={change} /></div>
          </div>

          <button className="w-full mt-10 bg-blue-600 text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]">
            Get Started <RiArrowRightSLine size={22} className="inline ml-1" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;