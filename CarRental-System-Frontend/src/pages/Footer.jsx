import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Our Fleet", "Careers", "News & Blog"]
    },
    {
      title: "Support",
      links: ["Help Center", "Safety Information", "Terms of Service", "Privacy Policy"]
    },
    {
      title: "Solutions",
      links: ["Corporate Travel", "Airport Transfer", "Wedding Events", "Long-term Rental"]
    }
  ];

  return (
    <footer className="bg-[#090a0c] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="text-black" size={24} />
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter">
                Afghan<span className="text-emerald-500">Rental</span>
              </span>
            </motion.div>
            
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Redefining mobility in Nangarhar. Experience the fusion of luxury, 
              security, and local expertise in every journey.
            </p>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, backgroundColor: '#10b981', color: '#000' }}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 transition-colors text-slate-400"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 uppercase italic">Join the Inner Circle</h3>
                <p className="text-slate-400 mb-8">Get exclusive offers and first access to our premium fleet additions.</p>
                
                <form className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      className="w-full bg-[#0f1115] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <button className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-white transition-all group">
                    Subscribe <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
              {/* Abstract Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: LINKS & CONTACT --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-16">
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-2 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Global Headquarters</h4>
            <div className="space-y-4 text-slate-400">
              <div className="flex items-start gap-4">
                <MapPin className="text-emerald-500 mt-1" size={20} />
                <p>Main Market Road, District 1, <br />Jalalabad City, Nangarhar, Afghanistan</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <Phone size={18} />
                </div>
                <span className="font-bold">+93 780 37 4285</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: LEGAL --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © {currentYear} <span className="text-white font-bold">Afghan Rental Car Group</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Status: <span className="text-white font-bold uppercase text-[10px]">Operational</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-emerald-500 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden opacity-[0.02] flex justify-center translate-y-1/2">
        <h1 className="text-[20vw] font-black uppercase italic leading-none whitespace-nowrap">
          NANGARHAR PRIDE
        </h1>
      </div>
    </footer>
  );
};

export default Footer;