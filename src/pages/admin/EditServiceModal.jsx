import { X } from 'lucide-react';

export function EditServiceModal({ 
  isOpen, 
  setIsOpen, 
  serviceForm, 
  setServiceForm, 
  handleEditService 
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
            <h2 className="text-2xl font-bold text-slate-900">Edit Service</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={handleEditService} className="p-6 space-y-5">
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Service Name *</label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Category *</label>
            <select
              value={serviceForm.category}
              onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
              required
            >
              <option value="">Select Category</option>
              <option value="Home Services">Home Services</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Technical Services">Technical Services</option>
              <option value="Automotive">Automotive</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Description *</label>
            <textarea
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-900"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Icon (Emoji)</label>
              <input
                type="text"
                value={serviceForm.icon}
                onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-2xl text-center"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Pricing Range</label>
              <input
                type="text"
                value={serviceForm.pricing}
                onChange={(e) => setServiceForm({ ...serviceForm, pricing: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900"
              />
            </div>
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

export default EditServiceModal;