import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Search, Sparkles, Star, IndianRupee } from "lucide-react";
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

/* -------------------- AUTH CHECK (CONSISTENT) -------------------- */
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
              worker_fees: w.worker_fees,
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
                  <div className="flex items-center gap-1">
                    <IndianRupee size={18} className="text-green-600" />
                    <span className="text-sm font-bold">{worker.worker_fees}</span>
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
function ServiceCard({ service, onBook, onLoginRequired }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group bg-white rounded-2xl overflow-hidden border flex flex-col shadow-sm hover:shadow-xl transition-all"
    >
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
        </div>

        <h4 className="text-lg font-black mb-1">{service.name}</h4>

        <p className="text-slate-500 text-xs mb-3 line-clamp-1">
          {service.desc}
        </p>

        <button
          onClick={() => {
            if (!isLoggedIn()) {
              onLoginRequired();
              return;
            }
            onBook(service);
          }}
          className="mt-auto w-full bg-slate-900 py-3 rounded-xl text-white font-black uppercase text-[10px] flex items-center justify-center gap-2"
        >
          Hire Expert Now <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------- MAIN SERVICES PAGE -------------------- */
export default function ServicesPage({ onLoginRequired }) {
  const [selectedService, setSelectedService] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  // Search bar
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchAllServices();

      const formatted = await Promise.all(
        data.map(async (s) => {
          const catObj = SERVICE_CATEGORIES.find(
            (c) => c.value === s.serviceCategory
          );

          let rating = 0;

          try {
            rating = await getServiceRating(s.service_Id);
          } catch (err) {
            rating = 0;
          }

          return {
            serviceId: s.service_Id,
            category: catObj?.label || "Other",
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

  const filteredServices = servicesData.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayedServices = filteredServices.slice(0, 15);
  return (
    <div className="bg-[#F8FAFC] py-10 px-4 min-h-screen">
      <div className="text-center mb-10">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="text-blue-500" size={28} />
          Popular Services
        </h3>

        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Trusted professionals ready to help you at home
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-2xl mx-auto mt-8"
          >
            <div className="flex items-center bg-white rounded-full shadow-xl border border-slate-200 px-6 py-4 focus-within:ring-4 ring-blue-500/20 transition-all">

              <Search size={22} className="text-blue-500" />

              <input
                type="text"
                placeholder="Search services like plumber, AC repair, cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent outline-none px-4 text-slate-700 placeholder:text-slate-400 text-lg"
              />

            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.name}
                service={service}
                onBook={setSelectedService}
                onLoginRequired={onLoginRequired}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/service")}
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          View More Services →
        </button>
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
