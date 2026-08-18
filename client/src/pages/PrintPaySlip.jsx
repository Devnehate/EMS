/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import { format } from "date-fns";

const PrintPaySlip = () => {

  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPayslip(dummyPayslipData.find((slip) => slip._id === id));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) return <Loading />
  if(!payslip) return <p className="text-center py-12 text-slate-400">Payslip not found</p>

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white animate-fade-in">
      <div className="text-center border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PAYSLIP</h1>
        <p className="text-slate-500 text-sm mt-1">{format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}</p>
      </div>
    </div>
  )
}

export default PrintPaySlip