import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Star, Gauge, Fuel, Users, ChevronDown, Sparkles, Clock1 } from "lucide-react";
import { carApi } from "../services/api";
import BookingModal from "../components/BookingModal";
import AnimatedHeading from "../components/AnimatedHeading";


const CarList = () => {
  const [cars, setCars] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 cars initially
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState(10000);

  useEffect(() => {
    carApi
      .getAll()
      .then((res) => {
        const data = res.data.data || res.data;
        setCars(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Connection Failed!", err));
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6); // Load 6 more each time
  };


  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = Number(car.rate_per_day) <= priceRange;

    return matchesSearch && matchesPrice;
  });

  return (
    <section className="py-24 bg-[#0f1115] text-white min-h-screen" id="car-list">
      <div className="container mx-auto px-6">
        {/* --- HEADER --- */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Exclusive Fleet</span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                <AnimatedHeading text={"Find Your Drive"} />
              </h2>
            </div>
            {/* Quick Summary Badge */}
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md hidden md:block">
              <p className="text-slate-400 text-sm">
                Showing <span className="text-emerald-500 font-bold">{Math.min(visibleCount, cars.length)}</span> of <span className="text-white font-bold">{cars.length}</span> Premium Vehicles
              </p>
            </div>
          </div>
        </div>

        {/* --- TOP BAR FILTER (More space-efficient than Sidebar for long lists) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search by model name..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Max Price</span>
            <span className="text-emerald-500 font-mono font-bold">{priceRange} AFG</span>
            <input type="range" min="100" max="5000" step="100" className="ml-4 accent-emerald-500 w-24" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
          </div>
          {/* <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-slate-400 focus:text-white transition-all appearance-none cursor-pointer"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option className="text-black">All Categories</option>
            {categories.map((c) => (
              <option key={c} className="text-black">
                {c}
              </option>
            ))}
          </select> */}
        </div>

        {/* --- MAIN GRID (Updated to 3 Columns) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCars.length > 0 ? (
              filteredCars.slice(0, visibleCount).map((car, index) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative bg-[#16191e] rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all overflow-hidden"
                >
                  {/* Image Wrap */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold">4.9</span>
                      </div>
                    </div>
                    <img src={`http://localhost:8000/storage/${car.image}`} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#16191e] to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">{car.model}</h3>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded font-bold">{car.status}</span>
                    </div>

                    <div className="flex justify-between gap-4 mb-6">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock1 size={14} /> <span className="text-[10px] font-bold uppercase">hourly rate {car.rate_per_hour} afg</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users size={14} /> <span className="text-[10px] font-bold uppercase">plate: {car.plate_number}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">Daily Rate</p>
                        <p className="text-xl font-black text-emerald-400">
                          {car.rate_per_day} <small className="text-[10px]">AFG</small>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setIsBookingOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-emerald-500 text-black px-4 py-3 rounded-xl font-black uppercase text-sm hover:bg-white hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all transform active:scale-95 group"
                        id="book"
                      >
                        <span className="  hover:text-emerald-600 hover:scale-105 transition-all">Booking request</span>
                        <Sparkles size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 italic">Car Not Found</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- SMART "SHOW MORE" TRIGGER --- */}
        {visibleCount < cars.length && (
          <div className="mt-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-px h-16 bg-gradient-to-b from-emerald-500 to-transparent"></div>
            <button
              onClick={handleShowMore}
              className="group relative px-12 py-5 bg-white/5 border border-white/10 rounded-full font-black uppercase text-sm tracking-[0.2em] hover:bg-emerald-500 hover:text-black transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore More Fleet <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </button>
          </div>
        )}
      </div>

      {isBookingOpen && <BookingModal car={selectedCar} onClose={() => setIsBookingOpen(false)} />}
    </section>
  );
};

export default CarList;
