import { X } from 'lucide-react';

export function EditWorkerModal({ 
  isOpen, 
  setIsOpen, 
  workerForm, 
  setWorkerForm, 
  handleEditWorker,
  services 
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Edit Technician</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={handleEditWorker} className="p-6 space-y-5">
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Full Name *</label>
            <input
              type="text"
              value={workerForm.name}
              onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Email *</label>
              <input
                type="email"
                value={workerForm.email}
                onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Phone *</label>
              <input
                type="tel"
                value={workerForm.phone}
                onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Service Category *</label>
            <select
              value={workerForm.service}
              onChange={(e) => setWorkerForm({ ...workerForm, service: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
              required
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.id} value={service.name}>{service.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Experience *</label>
              <input
                type="text"
                value={workerForm.experience}
                onChange={(e) => setWorkerForm({ ...workerForm, experience: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Hourly Rate *</label>
              <input
                type="text"
                value={workerForm.hourlyRate}
                onChange={(e) => setWorkerForm({ ...workerForm, hourlyRate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Location *</label>
            <input
              type="text"
              value={workerForm.location}
              onChange={(e) => setWorkerForm({ ...workerForm, location: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Bio</label>
            <textarea
              value={workerForm.bio}
              onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-900"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWorkerModal;