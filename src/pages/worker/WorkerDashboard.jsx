import { useEffect, useState } from "react";
import { getWorkerServices, updateServiceStatus } from "../../services/worker-service";
import { sendOtp, verifyOtp } from "../../services/otp-service";
/* ─── DESIGN TOKENS — Light SaaS theme ── */
const C = {
  bg: "#F5F6FA",
  bgCard: "#FFFFFF",
  bgElevated: "#F0F1F8",
  bgGlass: "rgba(0,0,0,0.03)",
  bgHover: "rgba(0,0,0,0.05)",
  border: "rgba(0,0,0,0.08)",
  borderHover: "rgba(0,0,0,0.16)",
  borderAccent: "rgba(99,102,241,0.35)",
  text: "#0F0F1A",
  textSub: "#52526E",
  textMuted: "#A0A0BC",
  accent: "#6366F1",
  accentLight: "#4F46E5",
  accentGlow: "rgba(99,102,241,0.12)",
  violet: "#8B5CF6",
  green: "#16A34A", greenBg: "rgba(22,163,74,0.08)", greenBorder: "rgba(22,163,74,0.2)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)", amberBorder: "rgba(217,119,6,0.2)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)", blueBorder: "rgba(37,99,235,0.2)",
  purple: "#7C3AED", purpleBg: "rgba(124,58,237,0.08)", purpleBorder: "rgba(124,58,237,0.2)",
  red: "#DC2626", redBg: "rgba(220,38,38,0.07)", redBorder: "rgba(220,38,38,0.2)",
  gray: "#64748B", grayBg: "rgba(100,116,139,0.07)", grayBorder: "rgba(100,116,139,0.15)",
  shadow: "0 1px 4px rgba(0,0,0,0.07)",
  shadowMd: "0 4px 24px rgba(0,0,0,0.1)",
  shadowLg: "0 12px 40px rgba(0,0,0,0.13)",
};

const STATUS = {
  NEW: { label: "New", color: "#15803D", bg: "rgba(22,163,74,0.1)", ring: "rgba(22,163,74,0.25)", dot: "#16A34A" },
  ACCEPTED: { label: "Accepted", color: "#1D4ED8", bg: "rgba(37,99,235,0.1)", ring: "rgba(37,99,235,0.25)", dot: "#2563EB" },
  IN_PROGRESS: { label: "In Progress", color: "#B45309", bg: "rgba(217,119,6,0.1)", ring: "rgba(217,119,6,0.25)", dot: "#D97706" },
  COMPLETED: { label: "Completed", color: "#6D28D9", bg: "rgba(124,58,237,0.1)", ring: "rgba(124,58,237,0.25)", dot: "#7C3AED" },
  REJECTED: { label: "Rejected", color: "#B91C1C", bg: "rgba(220,38,38,0.1)", ring: "rgba(220,38,38,0.25)", dot: "#DC2626" },
  PENDING: { label: "Pending", color: "#64748B", bg: "rgba(100,116,139,0.08)", ring: "rgba(100,116,139,0.2)", dot: "#94A3B8" },
  REGISTERED: { label: "Registered", color: "#0369A1", bg: "rgba(3,105,161,0.1)", ring: "rgba(3,105,161,0.25)", dot: "#0EA5E9" },
  REOPEN: { label: "Reopen", color: "#C2410C", bg: "rgba(194,65,12,0.1)", ring: "rgba(194,65,12,0.25)", dot: "#F97316" },
  RESOLVED: { label: "Resolved", color: "#15803D", bg: "rgba(22,163,74,0.1)", ring: "rgba(22,163,74,0.25)", dot: "#16A34A" },
};

const BASE_URL = "http://localhost:8080";

function resolveImageUrl(imgPath) {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  return `${BASE_URL}/uploads/${imgPath}`;
}

function mapServiceToJob(s) {
  const rawStatus = s.serviceStatus || "PENDING";
  const normalizedStatus = rawStatus === "IN_PROGESS" ? "IN_PROGRESS" : rawStatus;
  const imgUrl = resolveImageUrl(s.issue_evidence_img);
  return {
    id: s.historyId,
    customer: s.customer?.customer_name || s.customer?.customer_phoneno || "Customer",
    mobile: s.customer_available_phoneno ? String(s.customer_available_phoneno) : "N/A",
    address: s.service_location || "N/A",
    date: s.available_date || s.booking_date || "N/A",
    time: s.available_time || s.booking_time || "N/A",
    issue: s.customer_Issues || "N/A",
    category: s.services?.serviceName || s.services?.category || "Service",
    catIcon: "🔧",
    amount: s.services?.price || 0,
    img: imgUrl,
    hasImg: !!imgUrl,
    status: normalizedStatus,
    rawStatus,
  };
}

/* ── Real-time greeting helper ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: "Good morning", emoji: "🌅" };
  if (h >= 12 && h < 17) return { text: "Good afternoon", emoji: "☀️" };
  if (h >= 17 && h < 21) return { text: "Good evening", emoji: "🌇" };
  return { text: "Good night", emoji: "🌙" };
}

/* ── Formatted date ── */
function getTodayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "short",
  });
}

/* ── Pill badge ── */
function Pill({ status }) {
  const s = STATUS[status] || STATUS.PENDING;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700,
      border: `1px solid ${s.ring}`,
      whiteSpace: "nowrap", letterSpacing: "0.02em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ── Stat Cards ── */
function StatStrip({ counts }) {
  const items = [
    { key: "total", label: "Total", val: counts.total, accent: C.text, glow: "rgba(15,15,26,0.04)", border: C.border },
    { key: "NEW", label: "New", val: counts.NEW, accent: C.green, glow: C.greenBg, border: C.greenBorder },
    { key: "PENDING", label: "Pending", val: counts.PENDING, accent: C.gray, glow: C.grayBg, border: C.grayBorder },
    { key: "ACCEPTED", label: "Accepted", val: counts.ACCEPTED, accent: C.blue, glow: C.blueBg, border: C.blueBorder },
    { key: "IN_PROGRESS", label: "In Progress", val: counts.IN_PROGRESS, accent: C.amber, glow: C.amberBg, border: C.amberBorder },
    { key: "COMPLETED", label: "Completed", val: counts.COMPLETED, accent: C.purple, glow: C.purpleBg, border: C.purpleBorder },
    { key: "REJECTED", label: "Rejected", val: counts.REJECTED, accent: C.red, glow: C.redBg, border: C.redBorder },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px,1fr))", gap: 10 }}>
      {items.map(it => (
        <div key={it.key} style={{
          background: C.bgCard, border: `1px solid ${it.border}`,
          borderRadius: 16, padding: "16px 18px", boxShadow: C.shadow,
          position: "relative", overflow: "hidden",
          transition: "border-color .2s, transform .2s, box-shadow .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = it.accent + "55"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = C.shadowMd; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = it.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = C.shadow; }}
        >
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: it.glow, pointerEvents: "none" }} />
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: it.accent, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75 }}>{it.label}</p>
          <p style={{ margin: 0, fontSize: 30, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: it.accent, lineHeight: 1, letterSpacing: "-1px" }}>{it.val}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Info cell ── */
function InfoCell({ icon, label, value, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: C.bgElevated, border: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        {label && <p style={{ margin: "0 0 1px", fontSize: 9, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>}
        <p style={{ margin: 0, fontSize: 12, color: accent || C.textSub, fontWeight: accent ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
      </div>
    </div>
  );
}

/* ── Evidence Image ── */
function EvidenceImage({ src, hasImg, onImg }) {
  const [imgError, setImgError] = useState(false);
  if (!hasImg || imgError) {
    return (
      <div style={{ width: 68, height: 52, borderRadius: 10, border: `1px dashed ${C.border}`, background: C.bgElevated, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>🖼️</div>
    );
  }
  return (
    <img src={src} alt="evidence" onClick={() => onImg(src)} onError={() => setImgError(true)}
      style={{ width: 68, height: 52, objectFit: "cover", borderRadius: 10, border: `1px solid ${C.border}`, cursor: "zoom-in", flexShrink: 0, transition: "opacity .15s, transform .15s" }}
      onMouseEnter={e => { e.target.style.opacity = ".8"; e.target.style.transform = "scale(1.05)"; }}
      onMouseLeave={e => { e.target.style.opacity = "1"; e.target.style.transform = ""; }}
    />
  );
}

/* ── Action button ── */
function ActionBtn({ label, bg, color, border, onClick, icon, outline }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "9px 0", borderRadius: 10,
      border: border || (outline ? `1.5px solid ${bg}` : "none"),
      cursor: "pointer",
      background: outline ? "transparent" : bg,
      color: outline ? bg : color,
      fontSize: 12, fontWeight: 700, width: "100%",
      letterSpacing: "0.02em", transition: "all .15s",
      boxShadow: !outline ? `0 2px 8px ${bg}30` : "none",
    }}
      onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(.97)"}
      onMouseUp={e => e.currentTarget.style.transform = "translateY(-1px)"}
    >
      {icon} {label}
    </button>
  );
}

/* ── Job Card ── */
function JobCard({ job, onStatus, onImg, isMobile, otpState, setOtpState, handleSendOtp, handleVerifyOtp, formatTime }) {
  const st = STATUS[job.status] || STATUS.PENDING;
  const CheckIcon = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
  const XIcon = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
  const PlayIcon = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>;

  const actionArea = () => {
    if (job.status === "NEW" || job.status === "REGISTERED") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ActionBtn label="Accept" bg={C.green} color="#fff" onClick={() => onStatus(job.id, "ACCEPTED")} icon={CheckIcon} />
        <ActionBtn label="Reject" bg={C.red} color="#fff" onClick={() => onStatus(job.id, "REJECTED")} icon={XIcon} outline />
      </div>
    );
    // OTP flow for ACCEPTED status
    if (job.status === "ACCEPTED") {
      const otp = otpState[job.id];

      // Step 1: Show Start Job button
      if (!otp?.show) {
        return (
          <ActionBtn
            label="Start Job"
            bg={C.amber}
            color="#fff"
            onClick={() => handleSendOtp(job.id)}
            icon={PlayIcon}
          />
        );
      }

      // Step 2: Show OTP UI
      const remainingTime = otp?.expiresAt - Date.now();

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* OTP Input */}
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp.value}
            onChange={(e) => {
              const val = e.target.value;
              setOtpState(prev => ({
                ...prev,
                [job.id]: { ...prev[job.id], value: val }
              }));
            }}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "12px"
            }}
          />

          {/* TIMER */}
          <span style={{
            fontSize: "11px",
            color: remainingTime > 0 ? "#16a34a" : "#dc2626",
            fontWeight: 600
          }}>
            ⏱ {formatTime(remainingTime)}
          </span>

          {/* VERIFY BUTTON */}
          <ActionBtn
            label="Verify OTP"
            bg={C.green}
            color="#fff"
            onClick={() => handleVerifyOtp(job.id)}
          />

          {/* RESEND BUTTON */}
          <button
            disabled={otp.resendCooldown > 0}
            onClick={() => handleSendOtp(job.id)}
            style={{
              fontSize: "11px",
              background: "transparent",
              border: "none",
              cursor: otp.resendCooldown > 0 ? "not-allowed" : "pointer",
              color: otp.resendCooldown > 0 ? "#999" : C.accent,
              fontWeight: 600
            }}
          >
            {otp.resendCooldown > 0
              ? `Resend OTP in ${otp.resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      );
    }

    if (job.status === "IN_PROGRESS") return <ActionBtn label="Mark Done" bg={C.accent} color="#fff" onClick={() => onStatus(job.id, "COMPLETED")} icon={CheckIcon} />;
    if (job.status === "PENDING") return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ActionBtn label="Accept" bg={C.green} color="#fff" onClick={() => onStatus(job.id, "ACCEPTED")} icon={CheckIcon} />
        <ActionBtn label="Reject" bg={C.red} color="#fff" onClick={() => onStatus(job.id, "REJECTED")} icon={XIcon} outline />
      </div>
    );
    if (job.status === "REOPEN") return <ActionBtn label="Accept" bg={C.accent} color="#fff" onClick={() => onStatus(job.id, "ACCEPTED")} icon={CheckIcon} />;
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <span style={{ fontSize: 11, color: C.textMuted, background: C.bgElevated, border: `1px solid ${C.border}`, borderRadius: 99, padding: "4px 14px", fontWeight: 600 }}>Closed</span>
      </div>
    );
  };

  return (
    <div style={{
      background: C.bgCard, borderRadius: 18, border: `1px solid ${C.border}`,
      overflow: "hidden", display: "flex",
      flexDirection: isMobile ? "column" : "row",
      transition: "border-color .2s, box-shadow .2s, transform .2s",
      position: "relative", boxShadow: C.shadow,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.boxShadow = C.shadowMd; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = ""; }}
    >
      {/* Status accent strip */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${st.dot}, ${st.dot}30)`, borderRadius: "18px 0 0 18px" }} />

      {/* LEFT */}
      <div style={{ flex: 1, padding: isMobile ? "16px 16px 16px 20px" : "20px 24px 20px 28px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "-0.2px" }}>{job.customer}</p>
              <Pill status={job.status} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textSub }}>
                <span style={{ fontSize: 13 }}>{job.catIcon}</span>{job.category}
              </span>
              <span style={{ color: C.textMuted }}>·</span>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: C.accent, letterSpacing: "-0.3px" }}>₹{job.amount.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <EvidenceImage src={job.img} hasImg={job.hasImg} onImg={onImg} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: "10px 12px", paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          <InfoCell icon="📞" label="Mobile" value={job.mobile} accent={C.accent} />
          <InfoCell icon="📍" label="Address" value={job.address} />
          <InfoCell icon="📅" label="Visit Date" value={job.date} />
          <InfoCell icon="🕐" label="Visit Time" value={job.time} />
          {!isMobile && <div style={{ gridColumn: "1 / -1" }}><InfoCell icon="🔧" label="Issue" value={job.issue} /></div>}
        </div>
        {isMobile && <div style={{ marginTop: 10 }}><InfoCell icon="🔧" label="Issue" value={job.issue} /></div>}
      </div>

      {/* Divider */}
      <div style={{ width: isMobile ? "100%" : 1, height: isMobile ? 1 : "auto", background: C.border, flexShrink: 0 }} />

      {/* RIGHT: actions */}
      <div style={{
        width: isMobile ? "100%" : 148, padding: isMobile ? "12px 16px" : "20px 16px",
        display: "flex", flexDirection: isMobile ? "row" : "column",
        gap: 8, justifyContent: "center", flexShrink: 0, background: C.bgElevated,
      }}>
        {isMobile ? (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            {(job.status === "NEW" || job.status === "REGISTERED" || job.status === "PENDING") && <>
              <button onClick={() => onStatus(job.id, "ACCEPTED")} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", background: C.green, color: "#fff", fontSize: 12, fontWeight: 700 }}>✓ Accept</button>
              <button onClick={() => onStatus(job.id, "REJECTED")} style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${C.red}`, cursor: "pointer", background: "transparent", color: C.red, fontSize: 12, fontWeight: 700 }}>✕ Reject</button>
            </>}
            {job.status === "IN_PROGRESS" && <button onClick={() => onStatus(job.id, "COMPLETED")} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", background: C.accent, color: "#fff", fontSize: 12, fontWeight: 700 }}>✓ Mark Done</button>}
            {job.status === "REOPEN" && <button onClick={() => onStatus(job.id, "ACCEPTED")} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", background: C.accent, color: "#fff", fontSize: 12, fontWeight: 700 }}>Accept</button>}
            {["COMPLETED", "REJECTED", "RESOLVED"].includes(job.status) && <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, padding: "9px 14px", background: C.bgElevated, borderRadius: 9, border: `1px solid ${C.border}` }}>Closed</span>}
          </div>
        ) : actionArea()}
      </div>
    </div>
  );
}

/* ── Earnings Panel ── */
function EarningsPanel({ counts }) {
  const bars = [
    { label: "Today", val: 1850, pct: 12, color: C.green },
    { label: "This Week", val: 8200, pct: 42, color: C.accent },
    { label: "This Month", val: 18750, pct: 72, color: C.blue },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 14 }}>
      {/* Hero card */}
      <div style={{
        background: "linear-gradient(135deg, #3730A3 0%, #4F46E5 55%, #7C3AED 100%)",
        borderRadius: 20, padding: "24px 26px",
        display: "flex", flexDirection: "column", gap: 14,
        boxShadow: "0 8px 32px rgba(99,102,241,0.28)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, left: 10, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Total Earnings</p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>All time · 124 jobs</p>
          </div>
          <span style={{ fontSize: 10, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", padding: "4px 10px", borderRadius: 99, fontWeight: 700, color: "#fff" }}>↑ 18% MoM</span>
        </div>
        <p style={{ margin: 0, fontSize: 42, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: "-2px", color: "#fff", lineHeight: 1, position: "relative" }}>₹52,400</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, position: "relative" }}>
          {[["4.8⭐", "Rating"], ["124", "Reviews"], ["92%", "Satisfaction"]].map(([v, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#fff" }}>{v}</p>
              <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Period breakdown */}
      <div style={{ background: C.bgCard, borderRadius: 20, padding: "22px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 800, color: C.text, letterSpacing: "-0.2px" }}>Period Breakdown</p>
        {bars.map(b => (
          <div key={b.label} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}>{b.label}</span>
              <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.text }}>₹{b.val.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ height: 6, background: C.bgElevated, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Performance */}
      <div style={{ background: C.bgCard, borderRadius: 20, padding: "22px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 800, color: C.text, letterSpacing: "-0.2px" }}>Performance</p>
        {[
          { label: "Acceptance Rate", pct: Math.round((counts.ACCEPTED + counts.IN_PROGRESS + counts.COMPLETED) / Math.max(counts.total, 1) * 100), color: C.green },
          { label: "Completion Rate", pct: 84, color: C.accent },
          { label: "Satisfaction Score", pct: 92, color: C.blue },
        ].map(m => (
          <div key={m.label} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.textSub, fontWeight: 500 }}>{m.label}</span>
              <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: m.color }}>{m.pct}%</span>
            </div>
            <div style={{ height: 6, background: C.bgElevated, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
          {[["4m 32s", "Response"], ["4.8 ⭐", "Rating"], ["124", "Reviews"]].map(([v, l]) => (
            <div key={l} style={{ background: C.bgElevated, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.text }}>{v}</p>
              <p style={{ margin: 0, fontSize: 9, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function WorkerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [toast, setToast] = useState(null);
  const [online, setOnline] = useState(true);
  const [tab, setTab] = useState("all");
  const [modal, setModal] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [notif, setNotif] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // OTP state
  const [otpState, setOtpState] = useState({});

  /* ── Read worker info from localStorage ── */
  const user = JSON.parse(localStorage.getItem("fixongo_auth") || "null");
  const workerId = user?.id || user?.worker_Id || user?.workerId;
  const workerName = user?.worker_name || user?.name || user?.username || "Worker";
  const firstName = workerName.trim().split(" ")[0];
  const initials = workerName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  /* ── Real-time greeting — updates every minute ── */
  const [greetingObj, setGreetingObj] = useState(getGreeting());
  useEffect(() => {
    setGreetingObj(getGreeting());
    const tick = setInterval(() => setGreetingObj(getGreeting()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOtpState(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(jobId => {
          const otp = updated[jobId];
          if (!otp) return;

          // decrease resend cooldown
          if (otp.resendCooldown > 0) {
            otp.resendCooldown -= 1;
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!workerId) { setError("Worker ID not found. Please log in again."); setLoading(false); return; }
    setLoading(true);
    getWorkerServices(workerId)
      .then(data => { setJobs(data.map(mapServiceToJob)); setLoading(false); })
      .catch(err => { console.error(err); setError("Failed to load services. Please try again."); setLoading(false); });
  }, [workerId]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ⏱ Helper for OTP countdown
  const formatTime = (ms) => {
    if (ms <= 0) return "Expired";

    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const setStatus = (id, newStatus) => {
    updateServiceStatus(newStatus, id)
      .then(updated => {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: updated.serviceStatus } : j));
        showToast(`Updated → ${STATUS[updated.serviceStatus]?.label}`);
      })
      .catch(err => { console.error(err); showToast("Failed to update status."); });
  };

  // ✅ SEND OTP
  const handleSendOtp = async (jobId) => {
    try {
      await sendOtp(jobId);

      setOtpState(prev => ({
        ...prev,
        [jobId]: {
          show: true, value: "",
          expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
          resendCooldown: 30 // seconds
        }
      }));

      showToast("OTP sent to customer");
    } catch (err) {
      console.error(err);
      showToast("Failed to send OTP");
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async (jobId) => {
    try {
      const otpData = otpState[jobId];

      // 🚨 BLOCK EXPIRED OTP
      if (Date.now() > otpData.expiresAt) {
        showToast("OTP expired. Please resend.");
        return;
      }

      await verifyOtp({
        serviceId: jobId,
        otp: otpData.value
      });

      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, status: "IN_PROGRESS" } : j)
      );

      setOtpState(prev => ({
        ...prev,
        [jobId]: { show: false, value: "" }
      }));

      showToast("OTP verified. Job started!");
    } catch (err) {
      console.error(err);
      showToast("Invalid OTP");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fixongo_auth");
    window.location.href = "/workerlogin";
  };

  const counts = {
    total: jobs.length,
    NEW: jobs.filter(j => j.status === "NEW" || j.status === "REGISTERED").length,
    ACCEPTED: jobs.filter(j => j.status === "ACCEPTED").length,
    IN_PROGRESS: jobs.filter(j => j.status === "IN_PROGRESS").length,
    COMPLETED: jobs.filter(j => j.status === "COMPLETED" || j.status === "RESOLVED").length,
    REJECTED: jobs.filter(j => j.status === "REJECTED").length,
    PENDING: jobs.filter(j => j.status === "PENDING").length,
  };

  const FILTER_TABS = [
    { key: "all", label: "All", n: counts.total },
    { key: "NEW", label: "New", n: counts.NEW },
    { key: "PENDING", label: "Pending", n: counts.PENDING },
    { key: "ACCEPTED", label: "Accepted", n: counts.ACCEPTED },
    { key: "IN_PROGRESS", label: "In Progress", n: counts.IN_PROGRESS },
    { key: "COMPLETED", label: "Completed", n: counts.COMPLETED },
    { key: "REJECTED", label: "Rejected", n: counts.REJECTED },
  ];

  const statusOrder = ["NEW", "REGISTERED", "PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "RESOLVED", "REJECTED"];
  const shown = jobs
    .filter(j => {
      if (tab === "all") return true;
      if (tab === "NEW") return j.status === "NEW" || j.status === "REGISTERED";
      if (tab === "COMPLETED") return j.status === "COMPLETED" || j.status === "RESOLVED";
      return j.status === tab;
    })
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
    .slice(0, 10);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; }
        body { background:#F5F6FA; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#D1D5E8; border-radius:99px; }
        ::-webkit-scrollbar-track { background:transparent; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(14px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "11px 24px", borderRadius: 12,
          background: "#0F0F1A", color: "#F0F0FA",
          fontSize: 13, fontWeight: 600, boxShadow: C.shadowLg,
          animation: "toastIn .25s ease", whiteSpace: "nowrap",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}>✓&nbsp; {toast}</div>
      )}

      {/* ── IMAGE MODAL ── */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.3)", border: `1px solid ${C.border}` }}>
            <img src={modal} alt="evidence" style={{ maxWidth: "min(88vw,640px)", maxHeight: "80vh", objectFit: "contain", display: "block" }} />
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: `1px solid ${C.border}`, cursor: "pointer", fontWeight: 800, fontSize: 14, color: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header style={{
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`, height: 60, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 200,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.accent}, ${C.violet})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 15, color: "#fff",
            boxShadow: `0 2px 12px ${C.accentGlow}`,
          }}>F</div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.1, letterSpacing: "-0.3px" }}>FixAndGo</p>
            {!mobile && <p style={{ margin: 0, fontSize: 10, color: C.textMuted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Worker Portal</p>}
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 6 : 10 }}>

          {/* Online toggle */}
          <div onClick={() => setOnline(p => !p)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 99, cursor: "pointer",
            background: online ? C.greenBg : C.bgGlass,
            border: `1px solid ${online ? C.greenBorder : C.border}`,
            transition: "all .2s",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: online ? C.green : C.textMuted, animation: online ? "pulseDot 1.8s infinite" : "none" }} />
            {!mobile && <span style={{ fontSize: 11, fontWeight: 700, color: online ? C.green : C.textMuted }}>{online ? "Online" : "Offline"}</span>}
          </div>

          {/* Rating */}
          {!mobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 99 }}>
              <span style={{ fontSize: 13 }}>⭐</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.amber, fontFamily: "'JetBrains Mono',monospace" }}>4.8</span>
              <span style={{ fontSize: 10, color: "#92400E" }}>(124)</span>
            </div>
          )}

          {/* Bell */}
          <button onClick={() => setNotif(0)} style={{
            position: "relative", width: 38, height: 38, borderRadius: 10,
            border: `1px solid ${C.border}`, background: C.bgCard,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, transition: "background .15s", boxShadow: C.shadow,
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.bgElevated}
            onMouseLeave={e => e.currentTarget.style.background = C.bgCard}
          >
            🔔
            {notif > 0 && <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: C.red, border: "2px solid #fff" }} />}
          </button>

          {/* Avatar — shows worker initials */}
          <div title={workerName} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}22, ${C.violet}22)`,
            border: `1.5px solid ${C.accent}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: C.accent, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}>{initials}</div>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 10,
            border: `1px solid ${C.redBorder}`, background: C.redBg,
            cursor: "pointer", color: C.red,
            fontSize: 12, fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.14)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(220,38,38,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.redBg; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!mobile && "Logout"}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        padding: mobile ? "28px 16px 0" : "40px 32px 0",
        maxWidth: 1280, margin: "0 auto",
      }}>
        {/* Aurora blobs */}
        <div style={{ position: "absolute", top: -80, left: -100, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: -60, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Live chip with date */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 99, padding: "5px 14px 5px 8px", marginBottom: 16, boxShadow: C.shadow }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulseDot 1.8s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textSub, letterSpacing: "0.03em" }}>
              Live Dashboard · {getTodayLabel()}
            </span>
          </div>

          {/* ── GREETING with real worker name ── */}
          <h1 style={{ margin: "0 0 6px", fontSize: mobile ? 24 : 34, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, color: C.text, letterSpacing: "-0.8px", lineHeight: 1.15 }}>
            {greetingObj.text},{" "}
            <span style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.violet})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {firstName}
            </span>
            {" "}{greetingObj.emoji}
          </h1>

          {/* Subtitle */}
          <p style={{ margin: "0 0 28px", fontSize: 14, color: C.textSub, fontWeight: 500 }}>
            <span style={{ color: C.green, fontWeight: 700 }}>{counts.NEW} new request{counts.NEW !== 1 ? "s" : ""}</span>
            {counts.PENDING > 0 && <> · <span style={{ fontWeight: 600 }}>{counts.PENDING} pending</span></>}
            {counts.IN_PROGRESS > 0 && <> · <span style={{ color: C.amber, fontWeight: 600 }}>{counts.IN_PROGRESS} in progress</span></>}
          </p>

          <StatStrip counts={counts} />
        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "20px 16px 40px" : "24px 32px 56px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

        {/* Jobs section */}
        <div style={{
          background: C.bgCard, borderRadius: 22, border: `1px solid ${C.border}`,
          boxShadow: C.shadow, marginBottom: 24, overflow: "hidden",
          animation: "fadeUp .4s ease",
        }}>
          <div style={{ padding: mobile ? "18px 18px 14px" : "22px 26px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: "0 0 3px", fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-0.4px" }}>Job Requests</h2>
                <p style={{ margin: 0, fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Latest 10 · sorted by priority</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 99, padding: "5px 12px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulseDot 1.8s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>Live</span>
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
              {FILTER_TABS.map(t => {
                const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)} style={{
                    padding: "5px 14px", borderRadius: 9,
                    border: active ? "none" : `1px solid ${C.border}`,
                    cursor: "pointer",
                    background: active ? `linear-gradient(135deg, ${C.accent}, ${C.violet})` : C.bgElevated,
                    color: active ? "#fff" : C.textSub,
                    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    transition: "all .15s", flexShrink: 0,
                    boxShadow: active ? `0 2px 12px ${C.accentGlow}` : "none",
                  }}>
                    {t.label}
                    <span style={{
                      marginLeft: 5, fontSize: 10,
                      background: active ? "rgba(255,255,255,0.22)" : C.border,
                      borderRadius: 99, padding: "1px 6px", fontWeight: 700,
                      color: active ? "#fff" : C.textMuted,
                    }}>{t.n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: mobile ? "14px" : "18px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {loading ? (
              <div style={{ padding: "52px", textAlign: "center", color: C.textMuted }}>
                <div style={{ width: 28, height: 28, border: `2px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 12px" }} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Loading jobs...</p>
              </div>
            ) : error ? (
              <div style={{ padding: "52px", textAlign: "center", color: C.red }}>
                <p style={{ margin: "0 0 8px", fontSize: 32 }}>⚠️</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{error}</p>
              </div>
            ) : shown.length === 0 ? (
              <div style={{ padding: "52px", textAlign: "center", color: C.textMuted }}>
                <p style={{ margin: "0 0 8px", fontSize: 32 }}>📭</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>No jobs in this category</p>
              </div>
            ) : (
              shown.map((job, i) => (
                <div key={job.id} style={{ animation: `fadeUp ${.08 + i * .04}s ease` }}>
                  <JobCard
                    job={job}
                    onStatus={setStatus}
                    onImg={setModal}
                    isMobile={mobile}
                    otpState={otpState}
                    setOtpState={setOtpState}
                    handleSendOtp={handleSendOtp}
                    handleVerifyOtp={handleVerifyOtp}
                    formatTime={formatTime}   // ✅ ADD THIS
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Earnings & Performance */}
        <div style={{ animation: "fadeUp .5s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-0.4px" }}>Earnings &amp; Performance</h2>
            <span style={{ fontSize: 11, color: C.green, fontWeight: 700, background: C.greenBg, padding: "4px 12px", borderRadius: 99, border: `1px solid ${C.greenBorder}` }}>↑ 18% vs last month</span>
          </div>
          <EarningsPanel counts={counts} />
        </div>
      </main>
    </div>
  );
}