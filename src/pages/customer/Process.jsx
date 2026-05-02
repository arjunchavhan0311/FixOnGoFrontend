import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Zap
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: "01",
    title: "Find",
    icon: <Search />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Browse 50+ elite services tailored for your needs."
  },
  {
    id: "02",
    title: "Book",
    icon: <CalendarCheck />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    desc: "Confirm your preferred slot in just a few seconds."
  },
  {
    id: "03",
    title: "Arrive",
    icon: <ShieldCheck />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    desc: "A background-verified expert arrives at your door."
  },
  {
    id: "04",
    title: "Relax",
    icon: <Smile />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    desc: "Enjoy your perfected home with our guarantee."
  }
];

export default function HowItWorks() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("fixongo_auth") === "true";

  const handleRedirection = () => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">

        {/* --- 1. Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <Zap size={18} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">The FixOnGo Method</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Simple. Transparent. <br />
              <span className="italic font-serif text-blue-600 text-3xl md:text-5xl">Perfectly Seamless.</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium md:max-w-xs text-sm leading-relaxed">
            Experience a new standard of home maintenance where professional quality meets effortless technology.
          </p>
        </div>

        {/* --- 2. Steps Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {STEPS.map((step) => (
            <motion.div
              key={step.id}
              whileHover={{ y: -12 }}
              className="group p-10 rounded-[3rem] bg-slate-50 hover:bg-white hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 border border-transparent hover:border-slate-100"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                <span className="text-5xl font-black text-slate-200/60 group-hover:text-blue-100 transition-colors">
                  {step.id}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{step.desc}</p>
              <div className="h-1.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-700 rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* --- 3. RECTANGULAR CTA --- */}
         {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full bg-slate-950 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/10"
          >
            {/* Animated Background Layers */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
              <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"
              />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 md:p-16 lg:p-20 gap-12">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-blue-400 mb-4">
                  <Sparkles size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Premium Choice</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
                  Ready to <span className="text-blue-500 italic font-serif">Experience</span> <br />
                  the Difference?
                </h2>
                <p className="text-slate-400 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Join 10,000+ homeowners who trust FixOnGo for their premium home care needs. Elite quality, guaranteed.
                </p>
              </div>

              {/* Right Content / Action */}
              <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-6">
                <button
                  onClick={handleRedirection}
                  className="group/btn relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white min-w-[280px] py-6 px-10 rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95"
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    Get Start Now <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                  </span>
                </button>

                <div className="flex items-center gap-6 opacity-50 grayscale">
                  <span className="text-[10px] text-white uppercase tracking-[0.4em] font-black">Fast</span>
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <span className="text-[10px] text-white uppercase tracking-[0.4em] font-black">Reliable</span>
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <span className="text-[10px] text-white uppercase tracking-[0.4em] font-black">Secure</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}