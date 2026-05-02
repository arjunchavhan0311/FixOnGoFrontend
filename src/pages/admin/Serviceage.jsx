import { Edit2, Plus, Star, Trash2 } from 'lucide-react';

export default function ServicesPage({ 
  services, 
  setIsAddServiceModalOpen,
  openEditService,
  deleteService 
}) {
  return (
    
    <div className="animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Service Categories</h1>
          <p className="text-slate-500 text-sm">Manage what you offer to your customers</p>
        </div>
        <button 
          onClick={() => setIsAddServiceModalOpen(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="relative w-full h-60">
              <img
              src={`http://localhost:8080/uploads/${service.image}`}
              alt={service.name}
              className="w-full h-full object-cover rounded-2xl scale-110"/>

              {/* Edit / Delete buttons ON image */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => openEditService(service)}
                  className="p-2 bg-white/90 backdrop-blur text-slate-700 hover:text-indigo-600 rounded-lg shadow"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-2 bg-white/90 backdrop-blur text-slate-700 hover:text-red-600 rounded-lg shadow"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h3>
            <p className="text-slate-500 text-sm mb-1">{service.category}</p>
            <p className="text-slate-800 font-semibold text-xs mb-4 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-slate-700">{service.rating}</span>
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{service.totalJobs}</span> jobs
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{service.workers} Pros</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}