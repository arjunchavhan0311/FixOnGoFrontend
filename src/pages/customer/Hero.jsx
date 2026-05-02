import { motion } from "framer-motion";
import { Home, ShieldCheck, Sparkles, Star, UserCheck } from "lucide-react";

function Hero() {

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/30 to-slate-950" />
      </div>

      {/* Floating Card */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[10%] hidden lg:block z-20"
      >
        <div className="bg-white/5 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 flex items-center gap-4 shadow-2xl">
          <div className="bg-green-500/20 p-2.5 rounded-full">
            <UserCheck className="text-green-400" size={20}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Professional
            </p>
            <p className="text-sm font-bold text-white">Verified Expert</p>
          </div>
        </div>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">

        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-6 font-bold text-[9px] uppercase">
          <Sparkles size={12}/> Personalized Hiring
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
          Fix Anything{" "}
          <span className="text-blue-500 italic">Professionally.</span>
        </h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-300 text-lg md:text-xl max-w-2xl font-light leading-relaxed"
        >
          Elite professionals for your essential needs.
          Experience the{" "}
          <span className="text-white font-medium border-b-2 border-blue-500/50">
            Gold Standard
          </span>{" "}
          in home care.
        </motion.p>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mt-10"
        >
          <Sparkles size={14} className="text-blue-400 animate-pulse"/>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">
            Trusted by 10k+ Households
          </span>
        </motion.div>

        {/* Hero Typography */}
        <div className="mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.05]"
          >
            Make Your Home, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic font-serif">
              Perfect.
            </span>
          </motion.h1>
        </div>

        {/* Trust Ecosystem */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-10 mt-20"
        >
          {[
            { label: "Verified Pros", icon: <ShieldCheck className="text-blue-400" size={20}/> },
            { label: "5-Star Service", icon: <Star className="text-amber-400 fill-amber-400" size={20}/> },
            { label: "Local Help", icon: <Home className="text-indigo-400" size={20}/> }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                {item.icon}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;