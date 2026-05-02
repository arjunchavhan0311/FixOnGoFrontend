import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";
import {
  fetchAllServices,
  fetchWorkersByCategory,
} from "../../services/customer-bookservices";
import { getServiceRating, getWorkerRating } from "../../services/feedback-service";

/* -------------------- DEFAULT WORKER IMAGE -------------------- */
const DEFAULT_WORKER_IMG =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

/* -------------------- AUTH CHECK -------------------- */
const isLoggedIn = () => {
  return !!localStorage.getItem("fixongo_auth");
};

/* -------------------- BOOKING MODAL -------------------- */
function BookingModal({ service, isOpen, onClose }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  const navigate = useNavigate();
  const handleContinue = () => {

    const selectedWorker = workers.find(
      (w) => w.workerId === selectedWorkerId
    );

    if (!selectedWorker) return;

    navigate("/customerissue", {
      state: {
        serviceId: service.serviceId,
        workerId: selectedWorker.workerId,
      },
    });

  };
  useEffect(() => {

    if (!service) return;

    const loadWorkers = async () => {

      setLoading(true);
      setSelectedWorkerId(null);

      const user = JSON.parse(localStorage.getItem("fixongo_auth"));
      const city = user?.city;

      try {

        const data = await fetchWorkersByCategory(city, service.backendCategory);

        const formattedWorkers = await Promise.all(
          data.map(async (w) => {

            let rating = 0;

            try {
              rating = await getWorkerRating(w.worker_Id);
            } catch {
              rating = 0;
            }

            return {
              workerId: w.worker_Id,
              workerName: w.worker_name,
              experience: w.worker_experience,
              workerImg: w.worker_profile_img,
              rating: rating ? rating.toFixed(1) : "0.0",
              totalJobs: 0,
            };

          })
        );

        setWorkers(formattedWorkers);

      } catch (error) {
        console.error("Error loading workers:", error);
      }

      setLoading(false);

    };

    loadWorkers();

  }, [service]);
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />

      <div className="relative bg-white w-full max-w-xl rounded-[32px] p-6">
        <h3 className="text-2xl font-black mb-4">Choose Your Expert</h3>

        {loading ? (
          <p className="text-center text-slate-400">Loading workers...</p>
        ) : workers.length === 0 ? (
          <p className="text-center text-slate-400">No workers available</p>
        ) : (
          <div className="space-y-3">
            {workers.map((worker) => {
              const isSelected = selectedWorkerId === worker.workerId;

              return (
                <div
                  key={worker.workerId}
                  onClick={() => setSelectedWorkerId(worker.workerId)}
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all
                    ${isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "hover:bg-slate-50"
                    }`}
                >
                  <img
                    src={
                      worker.workerImg
                        ? `http://localhost:8080/uploads/${worker.workerImg}`
                        : DEFAULT_WORKER_IMG
                    }
                    className="h-14 w-14 rounded-xl object-cover"
                    alt={worker.workerName}
                  />

                  <div className="flex-grow">
                    <h4 className="font-black">{worker.workerName}</h4>
                    <p className="text-xs text-slate-500">
                      {worker.experience} yrs · {worker.totalJobs} jobs
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-amber-500 fill-amber-500"
                    />
                    <span className="text-sm font-bold">{worker.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold"
          >
            Close
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedWorkerId}
            className={`w-1/2 py-3 rounded-xl font-bold text-white transition-all
              ${selectedWorkerId
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-slate-300 cursor-not-allowed"
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- SERVICE CARD -------------------- */
function ServiceCard({ service, onBook }) {
  return (
    <motion.div className="group bg-white rounded-2xl overflow-hidden border flex flex-col">
      <div className="relative sm:h-65 overflow-hidden">
        <img
          src={service.image}
          className="w-full h-full object-cover object-center"
          alt={service.name}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold">{service.rating}</span>
          <span className="ml-auto text-blue-600 font-black text-sm">
            {service.price}
          </span>
        </div>

        <h4 className="text-lg font-black mb-1">{service.name}</h4>

        <p className="text-slate-500 text-xs mb-3 line-clamp-1">
          {service.desc}
        </p>

        {/* BUTTON */}
        <button
          onClick={() => {
            if (!isLoggedIn()) {
              window.dispatchEvent(new Event("open-login"));
              return;
            }
            onBook(service);
          }}
          className="mt-auto w-full bg-slate-900 py-2.5 sm:py-3 rounded-xl
                     text-white font-black uppercase text-[10px] sm:text-[11px]
                     flex items-center justify-center gap-2
                     hover:bg-slate-800 transition"
        >
          Hire Expert Now <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------- MAIN SERVICES PAGE -------------------- */
export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("All Services");
  const [selectedService, setSelectedService] = useState(null);
  const [servicesData, setServicesData] = useState([]);

const categories = [
  "All Services",
  ...SERVICE_CATEGORIES.map((c) => c.label)
];

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchAllServices();
      const formatted = await Promise.all(
        data.map(async (s) => {
          let rating = 0;
          try {
            rating = await getServiceRating(s.service_Id);
          } catch (err) {
            rating = 0;
          }
          return {
            serviceId: s.service_Id,
            category: SERVICE_CATEGORIES.find((c) => c.value === s.serviceCategory)?.label || "Other",
            backendCategory: s.serviceCategory,
            name: s.service_Title,
            desc: s.service_Description,
            image: s.service_img
              ? `http://localhost:8080/uploads/${s.service_img}`
              : "https://via.placeholder.com/600x400",
            rating: rating ? rating.toFixed(1) : "0.0",
            price: `₹${s.service_price}`,
          };
        })
      );
      setServicesData(formatted);
    };
    loadServices();
  }, []);

  const filteredServices =
    activeTab === "All Services"
      ? servicesData
      : servicesData.filter((s) => s.category === activeTab);

  return (
    <div className="bg-[#F8FAFC] py-14 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4 font-bold text-[9px] uppercase">
            <Sparkles size={12} /> Personalized Hiring
          </div>

          <h2 className="text-3xl md:text-6xl font-black mb-6 whitespace-nowrap">
            Fix Anything{" "}
            <span className="text-blue-600 italic">Professionally.</span>
          </h2>

          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${activeTab === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-400 border"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.name}
                service={service}
                onBook={setSelectedService}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <BookingModal
            service={selectedService}
            isOpen={true}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
