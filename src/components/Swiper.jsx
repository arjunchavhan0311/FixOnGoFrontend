import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllFeedback } from "../services/feedback-service";

const TestimonialSwiper = () => {

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {

      const data = await getAllFeedback();

      const formatted = data.map((f) => ({
        id: f.feedback_id,
        name: f.customer?.customer_name || "Customer",
        role: f.services?.service_Title || "User",
        text: f.description,
        rating: f.rating,
        avatar: f.customer?.profile_Image || null
      }));

      setTestimonials(formatted);

    } catch (error) {
      console.error("Error loading feedback", error);
    }
  };

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.split(" ");
    const initials = words.map(word => word[0]).join("");
    return initials.toUpperCase().slice(0, 2);
  };

  return (
    <div className="py-16 bg-[#F8FAFC] overflow-hidden border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
             <div className="h-1 w-8 bg-blue-600 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Wall of Love</span>
          </div>

          <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
            What our community says.
          </h4>
        </div>
        
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>

          <span className="text-slate-900 font-black text-sm">
            Rated 4.9/5 by users
          </span>
        </div>
      </div>

      <div className="relative">

        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >

          {duplicatedTestimonials.map((t, i) => (
            <div 
              key={i} 
              className="w-[300px] md:w-[380px] shrink-0 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 group"
            >

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">

                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      className="h-12 w-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt=""
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(t.name)}
                    </div>
                  )}

                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg">
                      <Quote size={8} fill="currentColor" />
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-black text-slate-900 leading-none">
                    {t.name}
                  </h5>

                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-tighter">
                    {t.role}
                  </p>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                "{t.text}"
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">

                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>

                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Verified User
                </div>

              </div>

            </div>
          ))}

        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialSwiper;