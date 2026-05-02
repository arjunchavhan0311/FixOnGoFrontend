import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  CircleCheck,
  Clock,
  Loader2,
  MapPin,
  MoreVertical,
  Navigation,
  ShieldCheck,
  Star,
  Wrench
} from "lucide-react";
import { useEffect, useState } from "react";

import { getServiceHistory } from "../../services/customer-bookservices";

// ─── STATUS CONFIG ──────────────────────────────────────────────────────────
const STATUS_STEPS = [
  {
    key: "PENDING",
    label: "Booking Confirmed",
    subLabel: "Your request has been received",
    icon: CheckCircle2,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBg: "bg-blue-500",
    trackColor: "bg-blue-500",
  },
  {
    key: "ACCEPTED",
    label: "Request Accepted",
    subLabel: "Expert is heading to your location",
    icon: Navigation,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    activeBg: "bg-indigo-500",
    trackColor: "bg-indigo-500",
  },
  {
    key: "IN_PROGRESS",
    label: "Work in Progress",
    subLabel: "Expert is working on your issue",
    icon: Wrench,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBg: "bg-amber-500",
    trackColor: "bg-amber-500",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    subLabel: "Service has been completed",
    icon: CircleCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBg: "bg-emerald-500",
    trackColor: "bg-emerald-500",
  },
];

const STATUS_ORDER = ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED"];

const getStepIndex = (status) => {
  const idx = STATUS_ORDER.indexOf(status?.toUpperCase());
  return idx === -1 ? 0 : idx;
};

// ─── PULSE DOT ──────────────────────────────────────────────────────────────
const PulseDot = ({ color }) => (
  <span className="relative flex h-3 w-3">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-60`} />
    <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
  </span>
);

// ─── STATUS TRACKER ─────────────────────────────────────────────────────────
const StatusTracker = ({ status }) => {
  const currentIndex = getStepIndex(status);

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-slate-900">Live Status</h3>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <PulseDot color="bg-emerald-500" />
          Live
        </span>
      </div>

      <div className="space-y-0">
        {STATUS_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;
          const StepIcon = step.icon;
          const isLast = index === STATUS_STEPS.length - 1;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 transition-all duration-500
                    ${isDone
                      ? `bg-slate-800 border-slate-800`
                      : isActive
                      ? `${step.bg} ${step.border} shadow-md`
                      : `bg-slate-50 border-slate-200`
                    }
                  `}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} className="text-white" />
                  ) : isActive ? (
                    <>
                      <StepIcon size={18} className={step.color} />
                      {/* pulse ring for active */}
                      <span className={`absolute inset-0 rounded-full animate-ping ${step.bg} opacity-60`} />
                    </>
                  ) : (
                    <StepIcon size={18} className="text-slate-300" />
                  )}
                </div>

                {/* connector line */}
                {!isLast && (
                  <div className="w-0.5 flex-1 my-1 min-h-[24px]">
                    <div
                      className={`w-full h-full rounded-full transition-all duration-700 ${
                        isDone ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className={`pb-5 ${isLast ? "pb-0" : ""} pt-1.5`}>
                <p
                  className={`text-sm font-black leading-tight transition-colors duration-300 ${
                    isDone
                      ? "text-slate-500 line-through decoration-slate-300"
                      : isActive
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-semibold mt-0.5 ${step.color}`}
                  >
                    {step.subLabel}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── STATUS BADGE ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: {
      label: "Pending",
      cls: "bg-blue-50 text-blue-600 border border-blue-200",
      dot: "bg-blue-500",
    },
    ACCEPTED: {
      label: "On the Way",
      cls: "bg-indigo-50 text-indigo-600 border border-indigo-200",
      dot: "bg-indigo-500",
    },
    IN_PROGRESS: {
      label: "In Progress",
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      dot: "bg-amber-500",
    },
    COMPLETED: {
      label: "Completed",
      cls: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      label: "Rejected",
      cls: "bg-red-50 text-red-600 border border-red-200",
      dot: "bg-red-500",
    },
    CANCELLED: {
      label: "Cancelled",
      cls: "bg-red-50 text-red-600 border border-red-200",
      dot: "bg-red-400",
    },
  };

  const cfg = map[status?.toUpperCase()] || {
    label: status,
    cls: "bg-slate-50 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  };

  const isLive = ["ACCEPTED", "IN_PROGRESS"].includes(status?.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${cfg.cls}`}
    >
      {isLive ? <PulseDot color={cfg.dot} /> : <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
      {cfg.label}
    </span>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const ExpertTrackingPage = ({ onBack }) => {
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [eta, setEta] = useState(12);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const getCustomerId = () => {
    const auth = localStorage.getItem("fixongo_auth");
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return (
        parsed.customer_Id ||
        parsed.customerId ||
        parsed.id ||
        parsed.user?.customer_Id ||
        null
      );
    } catch (err) {
      return null;
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const loadBooking = async () => {
    try {
      const customerId = getCustomerId();
      if (!customerId) return;
      const data = await getServiceHistory(customerId);
      if (data && data.length > 0) {
        const latest = data[data.length - 1];
        setBooking(latest);
        setStatus(latest.serviceStatus?.toUpperCase() || "PENDING");
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error loading tracking data", error);
    }
  };

  useEffect(() => {
    loadBooking();
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(loadBooking, 30000);
    return () => clearInterval(interval);
  }, []);

  // ETA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="text-sm font-semibold">Loading tracking info...</p>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_STEPS[getStepIndex(status)];
  const StepIcon = currentStep?.icon || Navigation;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* HEADER */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-900" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Job ID: #{booking.historyId}
          </p>
          <h1 className="text-sm font-black text-slate-900">
            {booking.services?.service_Title}
          </h1>
        </div>

        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <MoreVertical size={24} className="text-slate-900" />
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Status hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`h-12 w-12 ${currentStep?.bg || "bg-blue-50"} rounded-2xl flex items-center justify-center`}
              >
                <StepIcon
                  size={24}
                  className={`${currentStep?.color || "text-blue-500"} ${
                    status === "ACCEPTED" || status === "IN_PROGRESS"
                      ? "animate-pulse"
                      : ""
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900">
                    {status === "PENDING"
                      ? "Booking Confirmed"
                      : status === "ACCEPTED"
                      ? "Expert is on the Way"
                      : status === "IN_PROGRESS"
                      ? "Work in Progress"
                      : "Service Completed"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StatusBadge status={status} />
                  {status === "ACCEPTED" && (
                    <span className="text-slate-400 text-xs font-bold">
                      ETA {eta} mins
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Last updated */}
            <p className="text-[11px] text-slate-400 font-semibold mt-2">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </motion.div>

          
          {/* STATUS TRACKER */}
          <StatusTracker status={status} />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* EXPERT CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative"
          >
            <div className="relative z-10 flex items-center gap-5">
              {booking.worker?.profile_Image ? (
                <img
                  src={booking.worker.profile_Image}
                  className="h-20 w-20 rounded-[24px] object-cover border-2 border-blue-500 shadow-2xl"
                  alt="Expert"
                />
              ) : (
                <div className="h-20 w-20 rounded-[24px] bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-2 border-blue-500 shadow-2xl">
                  {getInitials(booking.worker?.worker_name)}
                </div>
              )}

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black">
                    {booking.worker?.worker_name}
                  </h3>
                  <div className="bg-blue-500 p-1 rounded-full">
                    <ShieldCheck size={12} />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {booking.worker?.rating || "4.8"}
                  </span>
                  <span>•</span>
                  <span>{booking.services?.service_Title}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* JOB DETAILS */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-lg font-black text-slate-900">Job Details</h4>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Service Description
                </p>
                <p className="text-sm font-bold text-slate-700 leading-snug">
                  {booking.customer_Issues}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Service Address
                  </p>
                  <p className="text-sm font-bold text-slate-700 leading-snug">
                    {booking.service_location}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Scheduled Time
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {booking.available_date} • {booking.available_time}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Completion Time
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {booking.completion_date} • {booking.completion_time}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Bill Amount
                </p>
                <p className="text-2xl font-black text-slate-900">
                  ₹{booking.services?.service_price}
                </p>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Payment Method
                </p>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <CheckCircle2 size={14} className="text-green-500" />
                  CASH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertTrackingPage;