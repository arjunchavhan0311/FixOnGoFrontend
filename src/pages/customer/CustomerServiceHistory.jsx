import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerServiceHistory } from "../../services/customer-service";

// ─── Enums matching your backend ───────────────────────────────────────────
const SERVICE_STATUS_LABELS = {
  REGISTERED: "Registered",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  REOPEN: "Reopen",
  RESOLVED: "Resolved",
};

const STATUS_STYLES = {
  REGISTERED: { bg: "#f0f9ff", text: "#0369a1", dot: "#38bdf8" },
  PENDING: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  ACCEPTED: { bg: "#d1fae5", text: "#065f46", dot: "#34d399" },
  REJECTED: { bg: "#fee2e2", text: "#991b1b", dot: "#f87171" },
  IN_PROGRESS: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  COMPLETED: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
  REOPEN: { bg: "#fef9c3", text: "#a16207", dot: "#eab308" },
  RESOLVED: { bg: "#f3e8ff", text: "#6b21a8", dot: "#a855f7" },
};

const PAYMENT_STATUS_STYLES = {
  PAID: { bg: "#dcfce7", text: "#166534" },
  UNPAID: { bg: "#fee2e2", text: "#991b1b" },
  PENDING: { bg: "#fef3c7", text: "#92400e" },
};

const CATEGORY_COLORS = {
  CLEANING: "#8b5cf6",
  PLUMBING: "#06b6d4",
  ELECTRICAL: "#f97316",
  CARPENTRY: "#a16207",
  APPLIANCE_REPAIR: "#0ea5e9",
  PEST_CONTROL: "#10b981",
  PAINTING: "#ec4899",
};

const AVATAR_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
  "#14b8a6", "#f43f5e", "#a855f7", "#84cc16",
];

const BASE_URL = "http://localhost:8080";

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  // timeStr could be "HH:MM:SS" from LocalTime
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Sub-Components ────────────────────────────────────────────────────────
function Avatar({ name, color }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: color || "#6366f1",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["PENDING"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {SERVICE_STATUS_LABELS[status] || status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const s = PAYMENT_STATUS_STYLES[status] || PAYMENT_STATUS_STYLES["PENDING"];
  return (
    <span style={{
      background: s.bg, color: s.text,
      borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
    }}>
      {status}
    </span>
  );
}

function EvidenceChip({ fileName }) {
  if (!fileName) return null;
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  return (
    <a href={`${BASE_URL}/uploads/${fileName}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: isImage ? "#ede9fe" : "#fee2e2",
        color: isImage ? "#6d28d9" : "#dc2626",
        borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600,
        cursor: "pointer", marginRight: 4, marginBottom: 4,
        border: `1px solid ${isImage ? "#c4b5fd" : "#fca5a5"}`,
        textDecoration: "none", whiteSpace: "nowrap",
      }}
    >
      {isImage ? "🖼" : "📄"} {fileName.split("/").pop()}
    </a>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────
function DetailModal({ record, onClose }) {
  if (!record) return null;

  const customerName = record.customer?.customer_name || "—";
  const workerName = record.worker?.worker_name || "—";
  const serviceName = record.services?.service_Title || "—";
  const category = record.worker?.serviceCategory || record.services?.serviceCategory || "—";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, maxWidth: 620, width: "100%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: "linear-gradient(135deg,#1e1b4b 0%,#4f46e5 100%)",
          padding: "20px 24px", color: "#fff", borderRadius: "20px 20px 0 0",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Service History ID</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>#{record.historyId}</div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none",
                color: "#fff", borderRadius: 10, width: 34, height: 34,
                cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <StatusBadge status={record.serviceStatus} />
            <PaymentBadge status={record.paymentStatus} />
            {record.paymentType && (
              <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                💳 {record.paymentType}
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* People Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "👤 Customer", value: customerName },
              { label: "🔧 Worker", value: workerName },
              { label: "⚙️ Service", value: serviceName },
              { label: "📁 Category", value: category },
              { label: "📍 Location", value: record.service_location || "—" },
              { label: "📞 Phone", value: record.customer_available_phoneno || "—" },
            ].map(f => (
              <div key={f.label} style={{
                background: "#f8fafc", borderRadius: 10, padding: "10px 14px",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{f.value}</div>
              </div>
            ))}
          </div>

          {/* Issue Description */}
          {record.customer_Issues && (
            <div style={{ background: "#fff7ed", borderRadius: 10, padding: "12px 14px", border: "1px solid #fed7aa", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#c2410c", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>🗒 Issue Description</div>
              <div style={{ fontSize: 13, color: "#431407", fontWeight: 500 }}>{record.customer_Issues}</div>
            </div>
          )}

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginBottom: 4 }}>📅 BOOKING</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>{formatDate(record.booking_date)}</div>
              <div style={{ fontSize: 11, color: "#4ade80" }}>{formatTime(record.booking_time)}</div>
            </div>
            <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 14px", border: "1px solid #bfdbfe" }}>
              <div style={{ fontSize: 10, color: "#1d4ed8", fontWeight: 700, marginBottom: 4 }}>🕐 AVAILABLE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>{formatDate(record.available_date)}</div>
              <div style={{ fontSize: 11, color: "#60a5fa" }}>{formatTime(record.available_time)}</div>
            </div>
            <div style={{ background: record.completion_date ? "#f0fdf4" : "#f8fafc", borderRadius: 10, padding: "12px 14px", border: `1px solid ${record.completion_date ? "#bbf7d0" : "#e2e8f0"}` }}>
              <div style={{ fontSize: 10, color: record.completion_date ? "#16a34a" : "#94a3b8", fontWeight: 700, marginBottom: 4 }}>✅ COMPLETION</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{formatDate(record.completion_date)}</div>
              <div style={{ fontSize: 11, color: "#4ade80" }}>{formatTime(record.completion_time)}</div>
            </div>
          </div>

          {/* Evidence */}
          {record.issue_evidence_img && (
            <div style={{ background: "#fafafa", borderRadius: 10, padding: "12px 16px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>📎 EVIDENCE</div>
              <EvidenceChip fileName={record.issue_evidence_img} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function ServiceHistoryDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("historyId");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const PER_PAGE = 8;

  // ── Fetch from backend ────────────────────────────────────────────────
  const storedUser = localStorage.getItem("fixongo_auth");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const customer_Id = user?.id;


  useEffect(() => {

    if (!customer_Id) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    setLoading(true);

    getCustomerServiceHistory(customer_Id)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load service history.");
        setLoading(false);
      });

  }, [customer_Id]);

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: data.length,
    completed: data.filter(d => d.serviceStatus === "COMPLETED").length,
    inProgress: data.filter(d => d.serviceStatus === "IN_PROGRESS").length,
    pending: data.filter(d => d.serviceStatus === "PENDING").length,
    cancelled: data.filter(d => d.serviceStatus === "REJECTED").length,
  }), [data]);

  // ── Filter + Sort ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let d = data.filter(r => {
      const q = search.toLowerCase();
      const ms = !search || [
        String(r.historyId),
        r.customer?.customer_name,
        r.worker?.worker_name,
        r.services?.service_Title,
        r.service_location,
      ].some(v => v?.toLowerCase().includes(q));
      return ms && (statusFilter === "All" || r.serviceStatus === statusFilter);
    });
    return [...d].sort((a, b) => {
      let va = a[sortBy] ?? "", vb = b[sortBy] ?? "";
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [data, search, statusFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSort(col) {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
    setPage(1);
  }

  const SortIcon = ({ col }) =>
    sortBy === col
      ? <span style={{ marginLeft: 3, color: "#6366f1" }}>{sortDir === "asc" ? "↑" : "↓"}</span>
      : <span style={{ marginLeft: 3, opacity: 0.25 }}>↕</span>;

  const ALL_STATUSES = ["All", "REGISTERED", "PENDING", "ACCEPTED", "REJECTED", "IN_PROGRESS", "COMPLETED", "REOPEN", "RESOLVED"];

  // ── Table columns ─────────────────────────────────────────────────────
  const TABLE_COLS = [
    { label: "ID", col: "historyId" },
    { label: "Customer", col: "customer" },
    { label: "Service", col: "services" },
    { label: "Worker", col: "worker" },
    { label: "Location", col: "service_location" },
    { label: "Booking Date", col: "booking_date" },
    { label: "Completion", col: "completion_date" },
    { label: "Payment", col: "paymentStatus" },
    { label: "Status", col: "serviceStatus" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 60%,#4f46e5 100%)", color: "#fff", padding: "22px 20px 28px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 12px", fontSize: 22 }}>🛠️</div>
              <div>
                <h1 style={{ margin: 0, fontSize: "clamp(16px,3vw,22px)", fontWeight: 800 }}>Service History</h1>
                <p style={{ margin: "3px 0 0", fontSize: 12, opacity: 0.65 }}>Customer Dashboard · All Records</p>
              </div>
            </div>
            <button
              onClick={() => { setLoading(true); getCustomerServiceHistory(customer_Id).then(r => { setData(r); setLoading(false); }).catch(() => setLoading(false)); }}
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10 }}>
            {[
              { label: "Total", value: stats.total, icon: "📋", color: "#a5b4fc" },
              { label: "Completed", value: stats.completed, icon: "✅", color: "#4ade80" },
              { label: "In Progress", value: stats.inProgress, icon: "⚙️", color: "#fbbf24" },
              { label: "Pending", value: stats.pending, icon: "⏳", color: "#60a5fa" },
              { label: "Rejected", value: stats.cancelled, icon: "❌", color: "#f87171" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(20px,3.5vw,26px)", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 14px 40px" }}>

        {/* ── FILTERS ── */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔍</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID, customer, worker, location..."
              style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
            />
          </div>

          {/* Status filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700,
                background: statusFilter === s ? "#4f46e5" : "#f1f5f9",
                color: statusFilter === s ? "#fff" : "#475569",
              }}>
                {s === "All" ? "All" : SERVICE_STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {(search || statusFilter !== "All") && (
            <button onClick={() => { setSearch(""); setStatusFilter("All"); setPage(1); }}
              style={{ padding: "7px 12px", borderRadius: 10, border: "1.5px solid #fca5a5", background: "#fff1f2", color: "#b91c1c", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              ✕ Clear
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── LOADING / ERROR ── */}
        {loading && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 60, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <div style={{ fontWeight: 700, color: "#64748b", fontSize: 15 }}>Loading service history...</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ background: "#fff1f2", borderRadius: 16, padding: 32, textAlign: "center", border: "1.5px solid #fca5a5" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontWeight: 700, color: "#b91c1c", fontSize: 15, marginBottom: 8 }}>{error}</div>
            <button onClick={() => window.location.reload()}
              style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* ── DESKTOP TABLE ── */}
        {!loading && !error && (
          <div className="dt-wrap" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    {TABLE_COLS.map(h => (
                      <th key={h.col} onClick={() => handleSort(h.col)}
                        style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#475569", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {h.label}<SortIcon col={h.col} />
                      </th>
                    ))}
                    <th style={{ padding: "11px 14px", fontSize: 11, textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, i) => {
                    const catColor = CATEGORY_COLORS[row.worker?.serviceCategory] || CATEGORY_COLORS[row.services?.serviceCategory] || "#6366f1";
                    return (
                      <tr key={row.historyId}
                        onClick={() => setSelected(row)}
                        style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer", transition: "background 0.12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                      >
                        {/* ID */}
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", background: "#ede9fe", borderRadius: 6, padding: "3px 7px" }}>
                            #{row.historyId}
                          </span>
                        </td>

                        {/* Customer */}
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar name={row.customer?.customer_name} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                            <div>
                              <div style={{ fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", fontSize: 13 }}>{row.customer?.customer_name || "—"}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>{row.customer_available_phoneno || ""}</div>
                            </div>
                          </div>
                        </td>

                        {/* Service */}
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap" }}>{row.services?.service_Title || "—"}</div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: catColor, borderRadius: 4, padding: "2px 6px", marginTop: 3, display: "inline-block" }}>
                            {row.worker?.serviceCategory || row.services?.serviceCategory || "—"}
                          </span>
                        </td>

                        {/* Worker */}
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: "#334155", whiteSpace: "nowrap" }}>{row.worker?.worker_name || "—"}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748b", maxWidth: 140 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.service_location || "—"}</div>
                        </td>

                        {/* Booking Date */}
                        <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{formatDate(row.booking_date)}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{formatTime(row.booking_time)}</div>
                        </td>

                        {/* Completion */}
                        <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{formatDate(row.completion_date)}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{formatTime(row.completion_time)}</div>
                        </td>

                        {/* Payment */}
                        <td style={{ padding: "11px 14px" }}>
                          <PaymentBadge status={row.paymentStatus} />
                        </td>

                        {/* Status */}
                        <td style={{ padding: "11px 14px" }}>
                          <StatusBadge status={row.serviceStatus} />
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "11px 14px" }}>
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(row); }}
                            style={{
                              background: "#2c5af2",
                              color: "#fff",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: 8,
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 700,
                              marginLeft: 6
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ padding: 56, textAlign: "center", color: "#94a3b8" }}>
                        <div style={{ fontSize: 44 }}>🔍</div>
                        <div style={{ marginTop: 10, fontWeight: 700, fontSize: 15, color: "#64748b" }}>No records found</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your search or filters</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MOBILE CARDS ── */}
        {!loading && !error && (
          <div className="mob-wrap" style={{ display: "none" }}>
            {paged.map((row, i) => {
              const catColor = CATEGORY_COLORS[row.worker?.serviceCategory] || "#6366f1";
              return (
                <div key={row.historyId} onClick={() => setSelected(row)}
                  style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", cursor: "pointer", borderLeft: `4px solid ${STATUS_STYLES[row.serviceStatus]?.dot || "#6366f1"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <Avatar name={row.customer?.customer_name} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{row.customer?.customer_name || "—"}</div>
                        <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>#{row.historyId}</div>
                      </div>
                    </div>
                    <StatusBadge status={row.serviceStatus} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>{row.services?.service_name || "—"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>👷 {row.worker?.worker_name || "—"}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: catColor, borderRadius: 4, padding: "2px 6px" }}>
                      {row.worker?.serviceCategory || "—"}
                    </span>
                    <PaymentBadge status={row.paymentStatus} />
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>📍 {row.service_location || "—"}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>📅 {formatDate(row.booking_date)} {formatTime(row.booking_time)}</div>
                  {row.completion_date && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>✅ {formatDate(row.completion_date)}</div>}
                </div>
              );
            })}
            {paged.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: 44 }}>🔍</div>
                <div style={{ marginTop: 10, fontWeight: 700 }}>No records found</div>
              </div>
            )}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && !error && totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: "7px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: page === 1 ? "#f8fafc" : "#fff", cursor: page === 1 ? "default" : "pointer", color: "#475569", fontWeight: 600, opacity: page === 1 ? 0.45 : 1, fontSize: 13 }}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid", borderColor: p === page ? "#6366f1" : "#e2e8f0", background: p === page ? "#6366f1" : "#fff", color: p === page ? "#fff" : "#475569", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: "7px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: page === totalPages ? "#f8fafc" : "#fff", cursor: page === totalPages ? "default" : "pointer", color: "#475569", fontWeight: 600, opacity: page === totalPages ? 0.45 : 1, fontSize: 13 }}>
              Next →
            </button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
            Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} records
          </div>
        )}
      </div>

      <DetailModal record={selected} onClose={() => setSelected(null)} />

      <style>{`
        @media (max-width: 768px) {
          .dt-wrap  { display: none !important; }
          .mob-wrap { display: block !important; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}