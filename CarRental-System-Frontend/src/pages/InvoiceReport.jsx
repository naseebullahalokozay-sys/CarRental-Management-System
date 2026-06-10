import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { paymentApi } from "../services/api"; // Adjust this path to your api file
import { Printer, ReceiptText, Car, User, Calendar, Hash, CheckCircle2, ShieldAlert, Tag, ArrowLeft } from "lucide-react";

const formatDisplayDate = (date) => {
  if (!date) return "-";
  const cleaned = date.replace(" ", "T").replace("Z:00", "Z");
  return new Date(cleaned).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const InvoiceReport = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  const navigate = useNavigate()

  // 1. Fetch data using your existing paymentApi helper
  const fetchInvoice = async () => {
      try {
        const response = await paymentApi.getById(id);
        // Assuming your backend returns { data: { ... } }
        setData(response.data.data);
      
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // 2. Printing Logic
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_#${id}`,
  });

  if (loading) return <div className="p-10 text-center font-sans">Loading...</div>;
  if (!data) return <div className="p-10 text-center text-red-500 font-sans">Invoice not found.</div>;

  //   object destructuring
  const { rental, amount_paid, remaining_balance, payment_date } = data;
  const customer = rental?.booking?.customer;
  const car = rental?.booking?.car;

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      {/* Action Bar (Hides automatically during print) */}
      <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <button onClick={() => navigate("/admin/payments")} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <ReceiptText className="text-blue-600" />
          <span className="font-bold">Billing Receipt</span>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-sm transition">
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      {/* PRINTABLE AREA */}
      <div ref={componentRef} className="bg-white p-12 border border-gray-100 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-10 mb-10">
          <div>
            <h1 className="text-3xl font-black text-blue-600 uppercase tracking-tighter mb-1">Amir Arsalan Car Rental</h1>
            <p className="text-sm text-gray-400">Transaction Receipt</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-gray-500 font-mono text-sm">
              <Hash size={14} /> <span>INV-{data.id.toString().padStart(5, "0")}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-gray-500 text-sm mt-1">
              <Calendar size={14} /> <span>{formatDisplayDate(payment_date)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Car Details */}
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <User size={12} /> Customer Information
            </h3>
            <p className="text-lg font-bold text-gray-900">{customer?.name}</p>
            <p className="text-gray-500">{customer?.phone}</p>
          </div>
          <div className="space-y-2 border-l pl-16">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Car size={12} /> Car Information
            </h3>
            <p className="text-lg font-bold text-gray-900">{car?.model}</p>
            <p className="text-gray-500 uppercase">Plate: {car?.plate_number}</p>
          </div>
        </div>

        {/* Financial Table */}
        <table className="w-full text-left mb-10 border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider border-y border-gray-200">
              <th className="py-4 px-2">Description</th>
              <th className="py-4 px-2 text-center">Duration</th>
              <th className="py-4 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-5 px-2">
                <span className="font-bold text-gray-800 block italic">Rental Fee</span>
                <span className="text-xs text-gray-400">
                  {formatDisplayDate(rental?.start_time)} to {formatDisplayDate(rental?.end_time)}
                </span>
              </td>
              <td className="py-5 px-2 text-center text-gray-600">{rental?.total_hours} hrs</td>
              <td className="py-5 px-2 text-right font-bold text-gray-900">${rental?.total_amount}</td>
            </tr>

            {parseFloat(rental?.fine_amount) > 0 && (
              <tr className="text-red-600">
                <td className="py-3 px-2 flex items-center gap-2">
                  <ShieldAlert size={14} /> <span className="text-sm">Fines / Late Fee</span>
                </td>
                <td></td>
                <td className="py-3 px-2 text-right font-medium">+${rental.fine_amount}</td>
              </tr>
            )}

            {parseFloat(rental?.discount) > 0 && (
              <tr className="text-green-600">
                <td className="py-3 px-2 flex items-center gap-2">
                  <Tag size={14} /> <span className="text-sm">Discount Applied</span>
                </td>
                <td></td>
                <td className="py-3 px-2 text-right font-medium">-${rental.discount}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end pt-6 border-t-2 border-gray-50">
          <div className="w-80 space-y-4">
            <div className="flex justify-between items-center text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="text-xs font-bold uppercase flex items-center gap-1">
                <CheckCircle2 size={14} /> Total Paid
              </span>
              <span className="text-xl font-black">${amount_paid}</span>
            </div>

            <div
              className={`flex justify-between items-center p-3 rounded-lg border ${parseFloat(remaining_balance) > 0 ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-100 text-gray-400 border-gray-200"}`}
            >
              <span className="text-xs font-bold uppercase">Balance Remaining</span>
              <span className="text-xl font-black">${remaining_balance}</span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-24 flex justify-end">
          <div className="text-center w-56">
            <div className="border-b-2 border-gray-300 w-full mb-2"></div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Finance Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReport;
