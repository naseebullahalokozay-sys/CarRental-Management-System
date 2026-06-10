import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { ArrowUp, ChevronRight, ShieldCheck, Zap, MapPin, Settings, Menu, X } from "lucide-react";
import { customerApi } from "../services/api";

// Assets (Replace with your paths)
import carPhoto from "../assets/images/Car.png";
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import CarList from "./CarList";
import About from "./About";
import Team from "./Team";
import Footer from "./Footer";

export default function Home() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { setLanguage } = useLanguage();
  const [customers, setCustomers] = useState([])

  const fetchCustomers = async () =>{
    try{
      const res = await customerApi.getAll()
      const data = res.data.data
      setCustomers(data)

    }catch(err){
      console.error("Faild to fetch customers", err.response?.message)
    }
  }
  useEffect(() => {
    setLanguage("en");
    fetchCustomers()
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileMenu(false);
  };

  return (
    <div className="bg-[#0f1115] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      {/* --- PREMIUM NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? "bg-[#0f1115]/90 backdrop-blur-xl py-4 shadow-2xl" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
              <Zap className="text-black fill-current" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Afghan<span className="text-emerald-500">Drive</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/10">
            {["About", "Vehicle Models", "Team"].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))} className="text-sm font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors">
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminLoginOpen(true)}
              className="
                hidden sm:flex items-center gap-2 
                px-6 py-2.5 
                bg-white/5 backdrop-blur-md 
                border border-white/10 rounded-xl 
                text-xs font-black uppercase tracking-[0.15em] text-white 
                transition-all duration-300 
                hover:bg-emerald-500 hover:text-black hover:border-emerald-500 
                hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] 
                active:scale-95 
                group
              "
            >
              {/* The Login Text */}
              <span className="relative">
                Login
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </button>

            <button className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (SPLIT STRUCTURE) --- */}
      <section className="relative min-h-screen flex items-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (6 Columns) */}
          <div className="lg:col-span-6 z-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <span className="flex items-center gap-2 text-emerald-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">
                <span className="w-12 h-[2px] bg-emerald-400"></span>
                Premium Rental Service
              </span>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 uppercase italic">
                Experience <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pure Luxury</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-md mb-10 leading-relaxed">
                Skip the paperwork. Rent the finest vehicles in Afghanistan with 24/7 VIP support and doorstep delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection("car-list")}
                  className="group bg-white text-black px-10 py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all"
                >
                  Book Your Ride <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="flex items-center gap-4 px-4 py-2 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
                  <div className="flex -space-x-3">
                    {customers.slice(0, 3).map((c,i) => (
                      <img key={i} src={`http://localhost:8000/storage/${c.photo}`} className="w-10 h-10 rounded-full border-2 border-[#0f1115] bg-slate-700" />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{customers.length}+ Happy Clients</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - The Car (6 Columns) */}
          <div className="lg:col-span-6 relative">
            <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative z-10">
              <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full"></div>
              <img src={carPhoto} alt="Luxury Car" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] object-contain" />
            </motion.div>

            {/* Floating Info Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-10 left-0 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl z-20 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-2xl text-black">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Insurance</p>
                  <p className="text-lg font-bold">Fully Protected</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURE BENTO GRID --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#16191e] p-8 rounded-[2rem] border border-white/5 hover:border-emerald-500/50 transition-all">
            <MapPin className="text-emerald-500 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Anywhere Delivery</h3>
            <p className="text-slate-400">We bring the car to your office, hotel, or home at no extra cost.</p>
          </div>
          <div className="bg-emerald-500 p-8 rounded-[2rem] text-black">
            <Settings className="mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Smart Booking</h3>
            <p className="font-medium">Instant approval and paperless check-in via our secure online system.</p>
          </div>
          <div className="bg-[#16191e] p-8 rounded-[2rem] border border-white/5 hover:border-emerald-500/50 transition-all">
            <Zap className="text-emerald-500 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Unlimited Miles</h3>
            <p className="text-slate-400">Drive across the country without worrying about distance limits.</p>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT SECTIONS --- */}
      <div className="space-y-32 pb-32">
        <section id="vehicle-models" className="scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <CarList />
          </div>
        </section>

        <section id="about" className="scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <About />
          </div>
        </section>

        <section id="team" className="scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <Team />
          </div>
        </section>

        <section id="team" className="scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <Footer />
          </div>
        </section>
      </div>

      {/* Modals */}
      <AdminLogin isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-[#0f1115] flex flex-col items-center justify-center gap-8 p-6"
          >
            <button className="absolute top-8 right-8" onClick={() => setMobileMenu(false)}>
              <X size={40} />
            </button>
            {["About", "Vehicle Models", "Team"].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))} className="text-4xl font-black uppercase italic  tracking-tighter">
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
