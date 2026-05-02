import { X } from "lucide-react";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";
import { createService } from "../../services/services-service";

export function AddServiceModal({
  isOpen,
  setIsOpen,
  serviceForm,
  setServiceForm,
}) {
  if (!isOpen) return null;

  const handleAddService = async (e) => {
  e.preventDefault();

  // JSON payload (DTO)
  const servicePayload = {
    service_Title: serviceForm.name,
    service_Description: serviceForm.description,
    serviceCategory: serviceForm.category,
    total_worker: 1,
  };

  // ✅ Multipart FormData
  const formData = new FormData();

  // MUST be called "service"
  formData.append(
    "service",
    new Blob([JSON.stringify(servicePayload)], {
      type: "application/json",
    })
  );

  // MUST be called "image"
  formData.append("image", serviceForm.image);

  try {
    await createService(formData);
    alert("Service Added Successfully ✅");
    setIsOpen(false);

    setServiceForm({
      name: "",
      category: "",
      description: "",
      image: null,
    });
  } catch (error) {
    console.error(error);
    alert("Failed to Add Service ❌");
  }
};


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
            <h2 className="text-2xl font-bold text-slate-900">
              Add New Service
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleAddService} className="p-6 space-y-5">
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">
              Service Name *
            </label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">
              Category *
            </label>
            <select
              value={serviceForm.category}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, category: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl"
              required
            >
              <option value="">Select Category</option>
              {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
               {cat.label}
              </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">
              Description *
            </label>
            <textarea
              rows="4"
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">
                Service Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, image: e.target.files[0] })
                }
                className="w-full px-4 py-3 border rounded-xl"
                required
              />
          </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold"
            >
              Add Service
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-slate-100 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddServiceModal;
