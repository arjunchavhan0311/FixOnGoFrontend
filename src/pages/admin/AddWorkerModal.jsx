import { X } from "lucide-react";
import WorkerRegistration from "../../auth/WorkerRegst"; // adjust path if needed

export function AddWorkerModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      {/* MODAL CONTAINER */}
      <div
        className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto no-scrollbar rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-lg"
        >
          <X size={22} />
        </button>

        {/* FULL WORKER REGISTRATION PAGE */}
        <WorkerRegistration isModal />
      </div>
    </div>
  );
}

export default AddWorkerModal;
