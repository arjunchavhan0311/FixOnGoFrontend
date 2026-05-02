import { motion } from "framer-motion";
import { RiArrowRightUpLine, RiMoneyDollarCircleLine, RiTimeLine, RiVerifiedBadgeLine } from "react-icons/ri";
import { Link } from "react-router-dom"; // Import Link for navigation

const WorkerHomeCTA = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="relative bg-slate-950 rounded-[3.5rem] overflow-hidden p-8 md:p-16 lg:p-20">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-20" />

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left: Content */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex bg-blue-600 text-white px-5 py-2 rounded-xl rotate-[-2deg] mb-8 shadow-xl"
            >
              <span className="text-sm font-black tracking-tighter italic uppercase">
                Work on FixOn<span className="text-slate-900 not-italic">Go</span>
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter mb-8">
              Got Skills? <br />
              <span className="text-blue-500 italic">We’ve got the jobs.</span>
            </h2>

            <p className="text-slate-400 text-lg font-medium mb-10 max-w-md leading-relaxed">
              Join thousands of experts who have ditched the wait. Set your own hours, manage your bookings, and get paid instantly.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* --- UPDATED BUTTON WITH LINK --- */}
              <Link to="/workerregistration"> 
                <button className="group bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl">
                  Become a Partner 
                  <RiArrowRightUpLine size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </Link>

              <Link to="/workerlogin">
                <button className="bg-slate-900 text-slate-400 border border-slate-800 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:text-white transition-all">
                  Worker Login
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Benefit Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { 
                icon: <RiMoneyDollarCircleLine size={32} />, 
                title: "Daily Payouts", 
                desc: "Get your earnings directly in your bank daily." 
              },
              { 
                icon: <RiTimeLine size={32} />, 
                title: "Flexible Shift", 
                desc: "Work whenever you want. You are the boss." 
              },
              { 
                icon: <RiVerifiedBadgeLine size={32} />, 
                title: "Free Insurance", 
                desc: "We cover you and your work on every job." 
              },
              { 
                icon: <RiTimeLine size={32} className="opacity-40" />, 
                title: "10k+ Monthly Jobs", 
                desc: "Constant flow of work in your neighborhood." 
              }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${i === 3 ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-900 text-slate-300'} p-8 rounded-[2.5rem] border border-slate-800 transition-all hover:border-blue-500`}
              >
                <div className={`${i === 3 ? 'text-white' : 'text-blue-500'} mb-4`}>
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                  {benefit.title}
                </h4>
                <p className={`text-xs font-medium leading-relaxed ${i === 3 ? 'text-blue-100' : 'text-slate-500'}`}>
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Big "GO" Background Text */}
        <div className="absolute -bottom-10 left-10 pointer-events-none opacity-[0.03] select-none">
          <h2 className="text-[250px] font-black text-white leading-none">GO</h2>
        </div>
      </div>
    </section>
  );
};

export default WorkerHomeCTA;