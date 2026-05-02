import { motion } from "framer-motion";
import {
  RiArrowRightSLine,
  RiCalendarCheckLine,
  RiFocus2Line,
  RiPulseLine,
  RiSearchLine,
  RiShieldStarLine,
  RiStarFill,
  RiTeamLine
} from "react-icons/ri";


function AboutPage() {
  const stats = [
    { label: "Service Providers", value: "500+" },
    { label: "Happy Customers", value: "10k+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Response Time", value: "<30 min" },
  ];

  const values = [
    {
      icon: <RiFocus2Line size={32} className="text-blue-600" />,
      title: "Unmatched Precision",
      desc: "We don't just fix things; we restore them to perfection with verified experts."
    },
    {
      icon: <RiTeamLine size={32} className="text-blue-600" />,
      title: "Community First",
      desc: "Empowering local professionals by connecting them with neighbors in need."
    },
    {
      icon: <RiPulseLine size={32} className="text-blue-600" />,
      title: "Real-Time Speed",
      desc: "The 'Go' in FixOnGo stands for our commitment to immediate assistance."
    }
  ];

  const processSteps = [
    {
      icon: <RiSearchLine size={28} />,
      title: "Smart Matching",
      desc: "Our AI finds the best-rated expert near you in seconds."
    },
    {
      icon: <RiCalendarCheckLine size={28} />,
      title: "Instant Booking",
      desc: "No back-and-forth calls. Pick a time, and it's confirmed."
    },
    {
      icon: <RiShieldStarLine size={28} />,
      title: "Quality Guaranteed",
      desc: "Every service is insured and backed by our FixOnGo seal."
    }
  ];

  const team = [
    { name: "Alex Rivera", role: "Founder & CEO", img: "https://i.pravatar.cc/300?img=11" },
    { name: "Sarah Chen", role: "Head of Operations", img: "https://i.pravatar.cc/300?img=32" },
    { name: "Marcus Thorne", role: "Tech Lead", img: "https://i.pravatar.cc/300?img=12" }
  ];

  return (
    <div className="pt-24 pb-20 overflow-hidden bg-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-6 mb-32">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="inline-flex bg-slate-950 text-white px-5 py-2 rounded-xl rotate-[-2deg] mb-8 shadow-xl">
              <span className="text-sm font-black tracking-tighter italic uppercase">
                FixOn<span className="text-blue-500 not-italic">Go</span> Story
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
              We fix the <br /> 
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-blue-600 italic">Unfixable.</span>
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-blue-100 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
              Finding a professional shouldn't be a full-time job. We built a platform where craftsmanship meets the speed of light.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="group">
                  <h4 className="text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{stat.value}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-5 relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative z-10">
              <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800" alt="Pro" className="w-full h-[550px] object-cover" />
              </div>
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-12 bottom-12 bg-white p-6 rounded-3xl shadow-2xl z-20 max-w-[200px] border border-slate-50 hidden md:block">
                <div className="flex gap-1 text-yellow-400 mb-2"><RiStarFill size={14} /> <RiStarFill size={14} /> <RiStarFill size={14} /> <RiStarFill size={14} /> <RiStarFill size={14} /></div>
                <p className="text-xs font-bold text-slate-700 leading-tight">"The fastest service I've ever used!"</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 2. PROCESS SECTION --- */}
{/* --- 2. PROCESS SECTION --- */}
<section className="py-24 max-w-7xl mx-auto px-6 mb-20 relative">
  {/* Section Header (Optional but recommended for clarity) */}
<div className="text-center mb-20">
  {/* 🔥 BRANDED WORKFLOW TAG */}
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="inline-flex bg-slate-950 text-white px-5 py-2 rounded-xl rotate-[-2deg] mb-6 shadow-xl shadow-slate-200"
  >
    <span className="text-sm font-black tracking-tighter italic uppercase">
      FixOn<span className="text-blue-500 not-italic">Go</span> Flow
    </span>
  </motion.div>

  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
    How it works <br /> 
    <span className="text-blue-600">Step by Step.</span>
  </h2>
  
  <p className="mt-4 text-slate-500 font-medium max-w-md mx-auto">
    We've streamlined the process to get an expert to your door in minutes, not days.
  </p>
</div>

  <div className="grid md:grid-cols-3 gap-12 relative">
    {/* Animated Connection Line (Desktop) */}
    <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-slate-100 -z-10">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
      />
    </div>
    
    {processSteps.map((step, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.2 }}
        className="relative flex flex-col items-center text-center group"
      >
        {/* Step Number Badge */}
        <div className="absolute -top-4 -right-2 md:right-1/3 bg-white border-2 border-slate-50 text-slate-300 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
          0{i + 1}
        </div>

        {/* Icon Container */}
        <div className="w-20 h-20 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl group-hover:bg-blue-600 group-hover:rotate-[10deg] transition-all duration-500">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="transition-transform"
          >
            {step.icon}
          </motion.div>
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
          {step.title}
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px]">
          {step.desc}
        </p>
      </motion.div>
    ))}
  </div>
</section>

      {/* --- 3. CORE VALUES --- */}
      <section className="bg-slate-50 py-24 rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Why FixOnGo?</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Intersection of technology and human craftsmanship.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-transparent hover:border-blue-100 transition-all">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">{val.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. TEAM SECTION --- */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    {/* 🔥 Branded Badge */}
    <div className="inline-flex bg-slate-950 text-white px-4 py-1.5 rounded-xl rotate-[-2deg] mb-6 shadow-xl">
      <span className="text-xs font-black tracking-tighter italic uppercase">
        FixOn<span className="text-blue-500 not-italic">Go</span> Team
      </span>
    </div>
    
    {/* Smaller Heading */}
    <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
      Driven by passion, <br/>powered by excellence.
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {team.map((member, i) => (
        <div key={i} className="relative">
          {/* Static Image - Animation and Grayscale Removed */}
          <div className="aspect-[5/5] overflow-hidden rounded-[2rem] mb-4 shadow-lg">
            <img 
              src={member.img} 
              alt={member.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h4 className="text-xl font-black text-slate-900">{member.name}</h4>
          <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mt-1">{member.role}</p>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* --- 5. IMPACT SECTION --- */}
      <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-6">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 leading-tight">Beyond just fixing homes, <br/> we build <span className="text-blue-500 italic">futures.</span></h2>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">Every booking supports local independent contractors. We provide them with insurance and a steady stream of work to help local economies thrive.</p>
            <div className="flex items-center gap-6">
              <div><p className="text-3xl font-black text-blue-500">$2M+</p><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Paid to Pros</p></div>
              <div className="w-[1px] h-10 bg-slate-800" />
              <div><p className="text-3xl font-black text-blue-500">100%</p><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Verified Work</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12"><img src="https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D" className="rounded-3xl shadow-2xl" alt="1"/><img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400" className="rounded-3xl shadow-2xl" alt="2"/></div>
            <div className="space-y-4"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400" className="rounded-3xl shadow-2xl" alt="3"/><img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400" className="rounded-3xl shadow-2xl" alt="4"/></div>
          </div>
        </div>
      </section>

      {/* --- 6. FINAL CTA --- */}
      <section className="max-w-5xl mx-auto px-6 mt-32">
        <div className="bg-slate-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">Ready to experience the <br /> <span className="text-blue-500 italic">premium difference?</span></h2>
          <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-slate-950 transition-all active:scale-95 shadow-xl shadow-blue-900/20">
            Book a Service Now <RiArrowRightSLine size={20} className="inline ml-1" />
          </button>
        </div>
      </section>
   
    </div>
  );
}

export default AboutPage;