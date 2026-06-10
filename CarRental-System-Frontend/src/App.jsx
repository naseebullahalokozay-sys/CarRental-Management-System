import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import React, { useEffect } from "react";
import { useLanguage } from "./context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components & Pages
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin"; // Make sure you import your Login page!
import AdminRegister from "./pages/AdminRegister";
import CarOwners from "./pages/CarOwners";
import Cars from "./pages/Cars";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import Rentals from "./pages/Rentals";
import Payments from "./pages/Payments";
import Guarantees from "./pages/Guarantees";
import OwnerPayments from "./pages/OwnerPayments";
import Home from "./pages/Home";
import InvoiceReport from "./pages/InvoiceReport";


function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#090a0c] text-slate-300 overflow-hidden flex flex-col font-sans">
      <header className="h-20 flex-shrink-0 border-b border-white/5 bg-[#090a0c]/80 backdrop-blur-md z-30">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 border-r border-white/5 bg-[#111317]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#090a0c]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[1600px] mx-auto">
              {children}
            </motion.div>

            
            <footer className="mt-20 py-6 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Vehicle Management System v1.0 • Secure Session</p>
            </footer>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-35 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // FIXED: If NO token, go to login.
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/*  1. Public Routes (No Sidebar) */}
          <Route path="/" element={<Home />} />
          {/*  2. Auth Routes (No Sidebar) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/*  3. Protected Admin Routes (With Sidebar/Layout) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="owners" element={<CarOwners />} />
                    <Route path="cars" element={<Cars />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="rentals" element={<Rentals />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="guarantees" element={<Guarantees />} />
                    <Route path="owner-payments" element={<OwnerPayments />} />
                    <Route path="register" element={<AdminRegister />} />
                    <Route path="invoice/:id" element={<InvoiceReport />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown admin path to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
