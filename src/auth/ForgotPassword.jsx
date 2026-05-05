import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { useEffect } from "react";

import {
    forgotPassword,
    resetPassword,
} from "../services/forgot-password-service";

const ForgotPassword = () => {
    const { role: paramRole } = useParams();
    const navigate = useNavigate();
    const role = paramRole || "admin"; // ✅ FIX: fallback role

    useEffect(() => {
        if (!paramRole) {
            navigate("/forgot-password/admin");
        }
    }, [paramRole, navigate]);
    
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const roleLabel = role.toUpperCase();

    // ================= SEND OTP =================
    const handleSendOtp = async () => {
        if (!form.email) {
            setMsg("Please enter email");
            return;
        }

        try {
            setLoading(true);
            setMsg("");

            await forgotPassword(role, form.email);

            setStep(2);
            setMsg("OTP sent to your email");
        } catch (err) {
            setMsg(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Email not found"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= RESET PASSWORD =================
    const handleResetPassword = async () => {
        if (!form.otp || form.otp.length !== 6) {
            setMsg("Enter valid 6-digit OTP");
            return;
        }

        if (!form.newPassword || !form.confirmPassword) {
            setMsg("Please fill all password fields");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setMsg("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setMsg("");

            await resetPassword(role, {
                email: form.email,
                resetToken: form.otp,
                newPassword: form.newPassword,
            });

            setMsg("Password reset successful ✅ Redirecting...");

            // ✅ FIX: correct navigation
            setTimeout(() => {
                if (role === "admin") navigate("/adminlogin");
                else if (role === "worker") navigate("/workerlogin");
                else navigate("/"); // customer
            }, 1500);

        } catch (err) {
            setMsg(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex h-14 w-14 bg-indigo-600 rounded-2xl items-center justify-center mb-4">
                        <Shield className="text-white" size={24} />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900">
                       Reset {roleLabel} Password 
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        {step === 1
                            ? "Enter your email to receive OTP"
                            : "Enter OTP and set new password"}
                    </p>
                </div>

                {/* MESSAGE */}
                {msg && (
                    <p className="text-center text-sm mb-4 text-red-500 font-semibold">
                        {msg}
                    </p>
                )}

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="email"
                                placeholder="Enter your email"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <div className="space-y-5">
                        {/* Email */}
                        <input
                            value={form.email}
                            readOnly
                            className="w-full py-3 px-4 rounded-2xl bg-slate-100 text-slate-500"
                        />

                        {/* OTP */}
                        <input
                            name="otp"
                            placeholder="Enter OTP"
                            className="w-full py-4 px-4 rounded-2xl bg-slate-50 border text-center tracking-widest font-bold"
                            value={form.otp}
                            onChange={handleChange}
                        />

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                className="w-full py-4 pl-12 pr-12 rounded-2xl bg-slate-50 border font-bold"
                                value={form.newPassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full py-4 px-4 rounded-2xl bg-slate-50 border font-bold"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-60"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="text-sm text-indigo-600 font-semibold w-full hover:underline"
                        >
                            Resend OTP
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;