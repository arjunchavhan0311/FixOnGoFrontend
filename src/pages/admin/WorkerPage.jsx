import { Ban, Edit2, Eye, Filter, MapPin, Plus, Star } from 'lucide-react';

export default function WorkersPage({ 
  workers, 
  setIsAddWorkerModalOpen,
  openWorkerDetail,
  openEditWorker,
  suspendWorker,
  getAvailabilityBadge 
}) {
  return (
    <div className="animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Technicians Directory</h1>
          <p className="text-slate-500 text-sm">Manage your professional workforce</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 flex items-center justify-center gap-2 transition-all">
            <Filter size={18} /> Filter
          </button>
          <button 
            onClick={() => setIsAddWorkerModalOpen(true)}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={18} /> Add Tech
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Technician</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Service</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Location</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Rating</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Jobs</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Status</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map(worker => (
                <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${worker.name}&background=4f46e5&color=fff`} 
                        className="w-10 h-10 rounded-full" 
                        alt={worker.name}
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{worker.name}</p>
                        <p className="text-xs text-slate-500">{worker.experience}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{worker.service}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {worker.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-900 text-sm">{worker.rating}</span>
                      <span className="text-xs text-slate-400">({worker.jobsCompleted})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 text-sm">{worker.jobsCompleted}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 ${getAvailabilityBadge(worker.availability)} text-xs font-bold rounded-md`}>
                      {worker.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openWorkerDetail(worker)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => openEditWorker(worker)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => suspendWorker(worker.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}