import {
  ArrowLeft,
  Award,
  Ban,
  Briefcase,
  Calendar,
  DollarSign,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
} from "lucide-react";

export default function WorkerDetailPage({
  selectedWorker,
  setIsWorkerDetailOpen,
  openEditWorker,
  suspendWorker,
  getAvailabilityBadge,
}) {

  // 🔒 Guard: Prevent undefined crash
  if (!selectedWorker) {
    return (
      <div className="p-6 text-center text-slate-500 font-semibold">
        Loading worker details...
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Back Button */}
      <button
        onClick={() => setIsWorkerDetailOpen(false)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Technicians
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= Profile Card ================= */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="text-center mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${selectedWorker.name}&background=4f46e5&color=fff&size=200`}
                alt={selectedWorker.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-slate-100"
              />

              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {selectedWorker.name}
              </h2>

              <p className="text-slate-500 font-semibold mb-3">
                {selectedWorker.service}
              </p>

              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${getAvailabilityBadge(
                  selectedWorker.availability
                )}`}
              >
                {selectedWorker.availability}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <InfoRow icon={<Mail size={16} />} value={selectedWorker.email} />
              <InfoRow icon={<Phone size={16} />} value={selectedWorker.phone} />
              <InfoRow icon={<MapPin size={16} />} value={selectedWorker.location} />
              <InfoRow
                icon={<DollarSign size={16} />}
                value={selectedWorker.worker_fees}
                bold
              />
              <InfoRow
                icon={<Calendar size={16} />}
                value={`Joined ${selectedWorker.joinDate}`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openEditWorker(selectedWorker)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>

              <button
                onClick={() => suspendWorker(selectedWorker.id)}
                className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
              >
                <Ban size={16} />
              </button>
            </div>
          </div>

          {/* ================= Stats Card ================= */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
            <h3 className="font-bold text-slate-900 mb-4">
              Performance Stats
            </h3>

            <StatRow
              label="Rating"
              value={
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  {selectedWorker.rating}
                </div>
              }
            />

            <StatRow label="Jobs Completed" value={selectedWorker.jobsCompleted} />
            <StatRow label="Experience" value={selectedWorker.experience} />

            <StatRow
              label="Emergency Service"
              value={
                <span
                  className={`font-bold ${selectedWorker.emergencyService
                      ? "text-emerald-600"
                      : "text-slate-400"
                    }`}
                >
                  {selectedWorker.emergencyService
                    ? "Available"
                    : "Not Available"}
                </span>
              }
            />
          </div>
        </div>

        {/* ================= Details Section ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Section title="About" icon={<User size={20} />}>
            <p className="text-slate-600 leading-relaxed">
              {selectedWorker.bio || "No bio available"}
            </p>
          </Section>
          {/* ================= Documents ================= */}
          <Section title="Verification Documents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Aadhaar */}
              <div className="border rounded-xl p-3">
                <p className="text-sm font-bold text-slate-700 mb-2">
                  Aadhaar Card
                </p>

                {selectedWorker.aadharImg ? (
                  <a
                    href={`http://localhost:8080${selectedWorker.aadharImg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:8080${selectedWorker.aadharImg}`}
                      alt="Aadhaar"
                      className="w-full h-40 object-cover rounded-lg border hover:opacity-90 transition"
                    />
                  </a>
                ) : (
                  <p className="text-xs text-slate-400">Not uploaded</p>
                )}
              </div>

              {/* PAN */}
              <div className="border rounded-xl p-3">
                <p className="text-sm font-bold text-slate-700 mb-2">
                  PAN Card
                </p>

                {selectedWorker.panImg ? (
                  <a
                    href={`http://localhost:8080${selectedWorker.panImg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:8080${selectedWorker.panImg}`}
                      alt="PAN"
                      className="w-full h-40 object-cover rounded-lg border hover:opacity-90 transition"
                    />
                  </a>
                ) : (
                  <p className="text-xs text-slate-400">Not uploaded</p>
                )}
              </div>

            </div>
          </Section>

          {/* Certifications */}
          <Section title="Certifications & Licenses" icon={<Award size={20} />}>
            <div className="flex flex-wrap gap-2">
              {selectedWorker.certifications?.length > 0 ? (
                selectedWorker.certifications.map((cert, index) => (
                  <Badge key={index} color="emerald">
                    {cert}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-400 text-sm">
                  No certifications available
                </span>
              )}
            </div>
          </Section>

          {/* Languages */}
          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {selectedWorker.languages?.length > 0 ? (
                selectedWorker.languages.map((lang, index) => (
                  <Badge key={index} color="blue">
                    {lang}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-400 text-sm">
                  No languages specified
                </span>
              )}
            </div>
          </Section>

          {/* Recent Jobs */}
          <Section title="Recent Jobs" icon={<Briefcase size={20} />}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    Kitchen Sink Repair
                  </p>
                  <p className="text-xs text-slate-500">{i} days ago</p>
                </div>

                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md">
                  Completed
                </span>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ================= Reusable Components ================= */

const InfoRow = ({ icon, value, bold }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="text-slate-400">{icon}</span>
    <span className={`text-slate-600 ${bold ? "font-semibold" : ""}`}>
      {value || "-"}
    </span>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between mb-3">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="font-bold text-slate-900">{value}</span>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const Badge = ({ children, color }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${colors[color]}`}
    >
      {children}
    </span>
  );
};
