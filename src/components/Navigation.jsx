import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  RiHome4Line,
  RiInformationLine,
  RiMapPin2Line,
  RiStackLine,
  RiUserLine,
} from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navigation({ isLoggedIn, onLoginClick, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [geo, setGeo] = useState("Detecting...");
  const [openProfile, setOpenProfile] = useState(false);

  const scrollTimer = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const routerLocation = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setIsVisible(true);

      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        if (!openProfile) setIsVisible(false);
      }, 1500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [openProfile]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeo("Pusad, MH");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setGeo(data.address.city || data.address.town || "Nearby");
        } catch {
          setGeo("Pusad, MH");
        }
      },
      () => setGeo("Pusad, MH")
    );
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: <RiHome4Line size={18} /> },
    { name: "Services", path: "/service", icon: <RiStackLine size={18} /> },
    { name: "About", path: "/about", icon: <RiInformationLine size={18} /> },
    { name: "Track Service", path: "/trackservice", icon: <RiMapPin2Line size={18} /> , authRequired: true},
    {name: "Service History", path: "/customerhistory", icon: <RiMapPin2Line size={18} />, authRequired: true}
  ];

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${scrolled
                ? "py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100"
                : "py-5 bg-transparent"
              }`}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
              {/* Logo + Location */}
              <div className="flex items-center gap-3 md:gap-6">
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                  <div className="bg-slate-900 text-white px-3 py-1 rounded-lg shadow-lg">
                    <span className="text-lg font-black tracking-tighter italic">
                      FixOn<span className="text-blue-500 not-italic">Go</span>
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/50 border border-slate-100 rounded-full">
                  <RiMapPin2Line className="text-blue-600" size={12} />
                  <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">
                    {geo}
                  </span>
                </div>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center bg-slate-100/50 backdrop-blur-md border border-slate-200/40 rounded-full p-1 relative">
                {navLinks.map((link) => {
                  const isActive = routerLocation.pathname === link.path;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="relative px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest z-10 group"
                    >
                      <div className="relative overflow-hidden h-4 flex items-center justify-center">
                        <motion.div
                          whileHover={{ y: -20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex flex-col items-center"
                        >
                          <span
                            className={`block h-4 ${isActive
                                ? "text-blue-600"
                                : "text-slate-400 group-hover:text-slate-900"
                              }`}
                          >
                            {link.name}
                          </span>
                          <span className="block h-4 absolute top-5 text-blue-500">
                            {link.name}
                          </span>
                        </motion.div>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="desktop-pill"
                          className="absolute inset-0 bg-white shadow-sm z-[-1] rounded-full"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {!isLoggedIn ? (
                  <button
                    onClick={onLoginClick}
                    className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md active:scale-95 transition-all hover:bg-blue-600"
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setOpenProfile(!openProfile)}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-900 shadow-sm"
                    >
                      <RiUserLine size={20} />
                    </button>

                    <AnimatePresence>
                      {openProfile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2"
                        >
                          <button
                            onClick={() => {
                              setOpenProfile(false);
                              navigate("/customerprofile");
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg"
                          >
                            Profile
                          </button>
                          <button
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 rounded-lg uppercase tracking-tighter"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav (UNCHANGED DESIGN) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 100, x: "-50%" }}
            className="md:hidden fixed bottom-6 left-1/2 w-[85%] max-w-[360px] z-[1000]"
          >
            <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.3)] rounded-[24px] flex items-center justify-around p-1.5">
              {navLinks.map((link) => {
                const isActive = routerLocation.pathname === link.path;

                return (
                  <Link key={link.name} to={link.path} className="relative flex-1">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-1 py-2 rounded-[18px] relative z-10 ${isActive ? "text-white" : "text-slate-500"
                        }`}
                    >
                      {link.icon}
                      <span className="text-[8px] font-black uppercase tracking-wider">
                        {link.name}
                      </span>
                    </motion.div>

                    {isActive && (
                      <motion.div
                        layoutId="mobile-active-pill"
                        className="absolute inset-0 bg-blue-600 rounded-[18px]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
