import {
  CheckCircle,
  Plus,
  Star,
  Users,
  Zap
} from 'lucide-react';
export default function DashboardPage({
  dashboardStats,
  recentActivity,
  services,
  workers,
  pendingRequests,
  setIsAddServiceModalOpen,
  setActiveSection,
  getStatusBadge
}) {
  return (
    <div className="space-y-8 animate-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <span className="text-[10px] font-bold text-emerald-600">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Service Activity</h3>
            <button
              onClick={() => setActiveSection("ServiceHistory")}
              className="text-indigo-600 text-sm font-semibold hover:text-indigo-700"
            >
              View All
            </button>
          </div>
          <div className="p-6 overflow-x-auto hide-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <tr >
                  <th className="pb-4">Technician</th>
                  <th className="pb-4">Service</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4 text-center">Issue</th>
                  <th className="pb-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50">
                    <td className="py-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-4 text-slate-500">{item.service}</td>
                    <td className="py-4 text-slate-500">{item.customer}</td>
                    <td className="py-4 text-center text-slate-400 text-xs max-w-[180px]">
                      <div className="truncate" title={item.issue}>
                        {item.issue}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 ${getStatusBadge(item.status)} text-xs font-bold rounded-md`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
            <Zap className="mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Expand Your Reach</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">Add new service categories to attract more professional technicians.</p>
            <div className="space-y-2 text-indigo-100 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{services.length} Active Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{workers.length} Registered Pros</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAddServiceModalOpen(true)}
            className="relative z-10 mt-6 bg-white text-indigo-600 w-full py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add New Service
          </button>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Service Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900">Top Performing Services</h3>
          <button onClick={() => setActiveSection('services')} className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">
            View All Services
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.slice(0, 3).map(service => (
            <div key={service.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{service.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{service.name}</h4>
                  <p className="text-xs text-slate-500">{service.workers} professionals</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-700">{service.rating}</span>
                </div>
                <span className="text-slate-500">{service.totalJobs} jobs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}