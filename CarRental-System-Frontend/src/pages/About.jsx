import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, ShieldCheck, Clock, Users, Compass, Globe, Award } from 'lucide-react';
import { carApi, customerApi } from '../services/api';

const About = () => {
  const [car, setCar] = useState([])
  const [customer, setCustomer] = useState([])

  const fetchCars = async () =>{
    try {
      const res = await carApi.getAll()
      const data = res.data?.data
      setCar(data)
    }catch(err){
      console.error(err)
    }
  }
  const fetchCustomer = async () =>{
    try {
      const res = await customerApi.getAll()
      setCustomer(res.data.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    fetchCars()
    fetchCustomer()
  },[])
  const stats = [
    { label: 'Elite Fleet', value: `${car.length}+`, icon: <Car />, color: "from-emerald-400 to-cyan-500" },
    { label: 'Verified Travelers', value: `${customer.length}+`, icon: <Users />, color: "from-blue-400 to-indigo-500" },
    { label: 'Local Support', value: '24/7', icon: <Clock />, color: "from-amber-400 to-orange-500" },
  ];

  const features = [
    {
      title: "Strategic Local Network",
      description: "Based in the heart of Jalalabad, we optimize logistics for Nangarhar's unique terrain and business demands.",
      icon: <Compass className="w-8 h-8 text-emerald-400" />
    },
    {
      title: "Ironclad Security",
      description: "Our proprietary verification engine authenticates Tazkira and documentation in real-time for total peace of mind.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />
    },
    {
      title: "Global Standards",
      description: "Bringing international hospitality and transparent digital pricing to the Afghan rental market.",
      icon: <Globe className="w-8 h-8 text-emerald-400" />
    }
  ];

  return (
    <div className="bg-[#0f1115] text-white overflow-hidden">
      
      {/* --- HERO SECTION WITH OVERLAY --- */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070" 
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" 
            alt="Driving"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115] via-transparent to-[#0f1115]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-sm mb-4 block">
              Redefining Mobility
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
              Nangarhar’s <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Premier</span> Hub
            </h1>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              We are not just a rental service; we are a digital bridge connecting car owners 
              with elite travelers through a secure, luxury-focused booking ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION (Bento Style) --- */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-center gap-6 group hover:border-emerald-500/50 transition-all"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-black shadow-lg`}>
                  {React.cloneElement(stat.icon, { size: 28 })}
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                  <p className="text-slate-500 uppercase text-xs font-bold tracking-widest group-hover:text-emerald-400 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISSION & CONTENT SECTION --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-emerald-500"></div>
                <span className="uppercase font-bold tracking-widest text-emerald-500">The Excellence Standard</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">
              A COMMITMENT TO <br />
              <span className="italic text-slate-500">UNCOMPROMISED</span> RELIABILITY
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              In the heart of Jalalabad, we’ve built more than a platform. We’ve built a circle of trust. 
              Whether it's a high-stakes business summit or a cross-province family journey, our fleet undergoes 
              rigorous 50-point safety inspections to ensure every mile is perfect.
            </p>
            
            <div className="space-y-6">
              {[
                "Instant AI-driven identity verification",
                "Tiered pricing structure: Hourly, Daily, and Corporate",
                "Full-coverage protection on all elite bookings"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:text-black" />
                  </div>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-[#16191e] rounded-3xl border border-white/5 hover:bg-[#1c2027] transition-all group relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                
                <div className="mb-6 inline-block p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- CALL TO ACTION BAR --- */}
      <section className="pb-32 px-6">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-[3rem] p-12 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-black text-black mb-6 uppercase italic tracking-tighter">
              Ready to Drive the Future?
            </h3>
            <button onClick={() => {window.location = '#car-list'}} className="bg-black text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl">
              Start Your Journey
            </button>
          </div>
          {/* Abstract circle decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </motion.div>
      </section>

    </div>
  );
};

export default About;