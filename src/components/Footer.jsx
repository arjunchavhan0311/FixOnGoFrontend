import {
  ArrowUpRight,
  Instagram,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Youtube
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 pt-20 pb-10 overflow-hidden">
      
      {/* Subtle Background Glow to match Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Newsletter / Call to Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-white/5 mb-16 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Join the Gold Standard.</h3>
            <p className="text-slate-400">Get maintenance tips and exclusive offers delivered to your inbox.</p>
          </div>
          <div className="relative max-w-md lg:ml-auto w-full">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white outline-none focus:ring-2 ring-blue-500/50 transition-all"
            />
            <button className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full transition-colors group">
              <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group">
              <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <ShieldCheck className="text-white" size={22} />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tighter">FixOnGo</h4>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience perfection in every repair. Our verified experts ensure your home stays in elite condition.
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">Our Expertise</h4>
            <ul className="space-y-4">
              {[
                { name: "Plumbing", path: "/search?q=plumbing" },
                { name: "Electrical", path: "/search?q=electrical" },
                { name: "Appliance Repair", path: "/search?q=appliances" },
                { name: "Home Cleaning", path: "/search?q=cleaning" }
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.path} 
                    onClick={scrollToTop}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-1 group"
                  >
                    {service.name} 
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">Reliability</h4>
            <ul className="space-y-4">
              {[
                { name: "Help Center", path: "/help" },
                { name: "Partner With Us", path: "/partner" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Safety Standards", path: "/safety" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    onClick={scrollToTop}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact Section */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">Contact & Social</h4>
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Social Icons */}
              {[
                { icon: <Instagram size={18} />, color: "hover:bg-pink-600", url: "#" },
                { icon: <MessageCircle size={18} />, color: "hover:bg-green-600", url: "#" },
                { icon: <Youtube size={18} />, color: "hover:bg-red-600", url: "#" },
                { icon: <Mail size={18} />, color: "hover:bg-blue-600", url: "mailto:support@fixongo.com" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url}
                  className={`h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:-translate-y-1 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Emergency Helpline</p>
                <a href="tel:18005550199" className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                  1-800-FIX-ONGO
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-500 text-[11px] font-medium tracking-wide">
              © {currentYear} FIXONGO. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 opacity-30 grayscale hover:grayscale-0 transition-all" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-30 grayscale hover:grayscale-0 transition-all" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-30 grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-600 font-bold flex items-center gap-2 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Server Status: HQ-North
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;