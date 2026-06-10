import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AnimatedHeading from '../components/AnimatedHeading';
import wahid_rashidi from '../assets/members/wahid_rashidi.jpeg';
import wahid_ibrahimi from '../assets/members/wahid_ibrahimi.jpeg';
import abid from '../assets/members/abid_1.jpeg';
import naseeb from '../assets/members/naseeb_v2.png';
import Fazal_Hadi from '../assets/members/FazilHadi.png';
const teamMembers = [
  {
    id: 1,
    name: 'Wahidullah Rashedi',
    role: 'data anlyst',
    skills: ['Laravel', 'Python', 'MySql'],
    description: 'Backend architect with 2+ years experience in mission-critical systems.',
    image: wahid_rashidi,
  },
  {
    id: 2,
    name: 'Wahidullah Ibrahemi',
    role: 'Database Designer',
    skills: ['Laravel', 'SQL', 'MySQL'],
    description: 'Specialist in high-end Database Design and scalable API infrastructure.',
    image: wahid_ibrahimi,
  },
  {
    id: 3,
    name: 'Naseebullah Alokozay',
    role: 'Full Stack Developer',
    skills: ['React', 'Laravel', 'Flutter'],
    description: 'Expert in building scalable web applications using modern frontend and backend technologies.',
    image: naseeb,
  },
  {
    id: 4,
    name: 'Fazl Hadi Zaheen',
    role: 'Creative Director',
    skills: ['Figma', 'UI/UX', 'Branding'],
    description: 'Detail-oriented front-end developer with a strong focus on building skills in back-end development',
    image: Fazal_Hadi,
  },
  {
    id: 5,
    name: 'Abid Rasa',
    role: 'Frontend Developer',
    skills: ['Testing', 'Security', 'DevOps'],
    description: 'Ensuring zero-bug deployments and ironclad platform security.',
    image: abid,
  },
];

function TeamCard({ member, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-[#16191e] rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none"></div>

      {/* Full Width Image Container */}
      <div className="relative w-full h-64 overflow-hidden border-b border-white/5">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Status Overlay */}
        <div className="absolute top-6 right-6 px-3 py-1 bg-[#0f1115]/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-8 pt-6 flex-grow">
        {/* Identity */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            {member.name}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">
            {member.role}
          </span>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {member.skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              {skill}
            </span>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed text-center italic">
          "{member.description}"
        </p>

        {/* Social Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-white/5 w-full justify-center mt-auto">
          {[
            { Icon: Github, label: 'GitHub' },
            { Icon: Linkedin, label: 'LinkedIn' },
            { Icon: Mail, label: 'Email' }
          ].map((item, i) => (
            <a
              key={i}
              href="#"
              className="p-3 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-xl transition-all duration-300 text-slate-400"
              aria-label={item.label}
            >
              <item.Icon size={18} />
            </a>
          ))}
          <button className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all duration-300 text-slate-400">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#0f1115] min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={14} /> Certified Experts
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6">
            <AnimatedHeading text={t('team.title') || "The Core Team"} />
          </h1>
          <p className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed">
            {t('team.subtitle') || "Architecting the future of mobility in Nangarhar with modern tech and local heart."}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}