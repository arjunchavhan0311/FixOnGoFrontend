import {
  Activity,
  Bell,
  Briefcase,
  Clock,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu, Search,
  UserCheck,
  Users
} from 'lucide-react';
import { useState } from 'react';

// Import all page components
import DashboardPage from './AdminDashboard';
import AdminProfilePage from './Adminprofilepage';
import ServicesPage from './Serviceage';
// import WorkerDetail from './WorkerDetail';
import { useEffect } from "react";
import { getAllServices } from "../../services/services-service";
import PendingRequestsPage from './Pendingrequestpage';
import ServiceHistoryPage from './Servicehistorydashboard';
import WorkerDetailPage from './Workerdetailpage';
import WorkersPage from './WorkerPage';

import { getAllServiceHistory, profile } from "../../services/admin-service";
import { approveWorkerApi, getAllWorkers, rejectWorkerApi } from "../../services/admin-worker-service";

// Import modal components
import {
  AddServiceModal,
  AddWorkerModal,
  EditServiceModal,
  EditWorkerModal
} from './Modals';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isEditWorkerModalOpen, setIsEditWorkerModalOpen] = useState(false);
  const [isWorkerDetailOpen, setIsWorkerDetailOpen] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const auth = JSON.parse(localStorage.getItem("fixongo_auth"));

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    location: "",
    joinDate: "",
    avatar: ""
  });

  const [adminProfileForm, setAdminProfileForm] = useState({});

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {

      const email = auth?.email;

      const data = await profile(email);

      const mappedProfile = {
        name: data.admin_name,
        email: data.email,
        phone: data.admin_phoneno,
        role: data.role,
        location: `${data.street_address}, ${data.city}, ${data.state}`,
        joinDate: "—",
        avatar: data.admin_profile_img
          ? data.admin_profile_img
          : `https://ui-avatars.com/api/?name=${data.admin_name}&background=4f46e5&color=fff`
      };

      setAdminProfile(mappedProfile);
      setAdminProfileForm(mappedProfile);

    } catch (error) {
      console.error("Failed to load admin profile", error);
    }
  };
  // Services State

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const data = await getAllServices();

      // 🔥 Map Backend → UI Format
      const mappedServices = data.map((s) => ({
        id: s.service_Id,
        name: s.service_Title,
        category: s.serviceCategory,
        description: s.service_Description,
        pricing: `₹${s.service_price}`,
        rating: s.service_rating ?? 0,
        workers: s.total_worker ?? 0,
        totalJobs: 0,
        image: s.service_img, // 🔥// optional
        status: "active"
      }));

      setServices(mappedServices);
    } catch (error) {
      console.error("Error fetching services", error);
    } finally {
      setLoadingServices(false);
    }
  };



  // Workers State
  const [workers, setWorkers] = useState([]);

  // Pending Requests State
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {

      // 🔹 Get admin city from localStorage
      const city = auth?.city;
      console.log("Admin City:", city);
      const data = await getAllWorkers(city);


      const approved = [];
      const pending = [];

      data.forEach(w => {
        const mapped = {
          id: w.worker_Id,
          name: w.worker_name,
          email: w.email,
          phone: w.worker_phoneno,
          service: w.serviceCategory,
          experience: `${w.worker_experience} years`,
          location: `${w.street_address}, ${w.city}, ${w.state},${w.district}, ${w.pincode}`,
          worker_fees: `₹${w.worker_fees}`,
          bio: w.worker_bio,
          aadharImg: w.worker_Aadhar_img, // Aadhar Image
          panImg: w.worker_Pan_img, // PAN Image
          certifications: w.worker_certificates?.split(",") || [],
          languages: w.worker_languages?.split(",") || [],
          availability: "Available",
          rating: 0,
          jobsCompleted: 0,
          joinDate: "—"
        };

        if (w.workerRequestStatus === "APPROVED") {
          approved.push(mapped);
        } else if (w.workerRequestStatus === "PENDING") {
          pending.push(mapped);
        }
      });

      setWorkers(approved);
      setPendingRequests(pending);
    } catch (err) {
      console.error("Failed to load workers", err);
    }
  };

  // Service Form State
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: '',
    description: '',
    image: null,
    pricing: ''
  });

  // Worker Form State
  const [workerForm, setWorkerForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    experience: '',
    location: '',
    worker_fees: '',
    bio: ''
  });

  // Stats for Dashboard
  const dashboardStats = [
    { label: 'Total Revenue', value: '$124,500', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Jobs', value: services.length, trend: '+8 today', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Technicians', value: workers.length, trend: '92% online', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Appr.', value: pendingRequests.length, trend: 'High priority', icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
  ];

  // Recent Activity
  const [recentActivity, setRecentActivity] = useState([]);
  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {

      const data = await getAllServiceHistory();

      const latestTen = data
        .sort((a, b) => new Date(b.service_date) - new Date(a.service_date))
        .slice(0, 5);

      const mapped = latestTen.map((item) => ({
        id: item.historyId,
        name: item.worker?.worker_name || "Worker",
        service: item.services?.service_Title || "Service",
        status: item.serviceStatus || "Status",
        customer: item.customer?.customer_name || "Customer",
        issue: item.customer_Issues || "Issue details not available",
      }));

      setRecentActivity(mapped);

    } catch (error) {
      console.error("Error fetching service history", error);
    }
  };

  // Functions

  const handleAddService = async (e) => {
    e.preventDefault();

    const servicePayload = {
      service_Title: serviceForm.name,
      service_Description: serviceForm.description,
      service_price: Number(serviceForm.pricing) || 100,
      serviceCategory: serviceForm.category,
      total_worker: services.workers || 0,
    };

    const formData = new FormData();

    // JSON part
    formData.append(
      "service",
      new Blob([JSON.stringify(servicePayload)], {
        type: "application/json",
      })
    );

    // Image part
    formData.append("image", serviceForm.image);

    try {
      await createService(formData);
      alert("Service Added Successfully ✅");
      setIsOpen(false);

      setServiceForm({
        name: "",
        category: "",
        description: "",
        pricing: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to Add Service ❌");
    }
  };


  const handleEditService = (e) => {
    e.preventDefault();
    setServices(services.map(s =>
      s.id === selectedService.id ? { ...s, ...serviceForm } : s
    ));
    setIsEditServiceModalOpen(false);
    setSelectedService(null);
  };

  const openEditService = (service) => {
    setSelectedService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description,
      icon: service.icon,
      pricing: service.pricing
    });
    setIsEditServiceModalOpen(true);
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    const newWorker = {
      id: workers.length + 1,
      name: workerForm.name,
      email: workerForm.email,
      phone: workerForm.phone,
      service: workerForm.service,
      experience: workerForm.experience,
      location: workerForm.location,
      worker_fees: workerForm.worker_fees,
      bio: workerForm.bio,
      rating: 0,
      status: 'approved',
      jobsCompleted: 0,
      joinDate: new Date().toISOString().split('T')[0],
      availability: 'Available',
      certifications: [],
      languages: ['English'],
      emergencyService: false,
      portfolio: []
    };
    setWorkers([...workers, newWorker]);
    setWorkerForm({ name: '', email: '', phone: '', service: '', experience: '', location: '', worker_fees: '', bio: '' });
    setIsAddWorkerModalOpen(false);
  };

  const handleEditWorker = (e) => {
    e.preventDefault();
    setWorkers(workers.map(w =>
      w.id === selectedWorker.id ? { ...w, ...workerForm } : w
    ));
    setIsEditWorkerModalOpen(false);
    setSelectedWorker(null);
    setIsWorkerDetailOpen(false);
  };

  const openEditWorker = (worker) => {
    setSelectedWorker(worker);
    setWorkerForm({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      service: worker.service,
      experience: worker.experience,
      location: worker.location,
      worker_fees: worker.worker_fees,
      bio: worker.bio || ''
    });
    setIsEditWorkerModalOpen(true);
  };

  const openWorkerDetail = (worker) => {
    setSelectedWorker(worker);
    setIsWorkerDetailOpen(true);
  };

  const viewPendingWorker = (worker) => {
    setSelectedWorker(worker);
    setIsWorkerDetailOpen(true);
  };


  const deleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const approveWorker = async (request) => {
    if (!window.confirm(`Approve ${request.name}?`)) return;

    try {
      const auth = JSON.parse(localStorage.getItem("fixongo_auth"));
      const city = auth?.city;

      await approveWorkerApi(request.email, city);

      fetchWorkers();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectWorker = async (email) => {
    if (!window.confirm("Reject this application?")) return;

    try {
      const auth = JSON.parse(localStorage.getItem("fixongo_auth"));
      const city = auth?.city;

      await rejectWorkerApi(email, city);

      fetchWorkers();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const handleLogout = () => {
    // Remove admin login data
    localStorage.removeItem("fixongo_auth");

    // Redirect to login page
    window.location.href = "/adminlogin";
  };

  const suspendWorker = (id) => {
    if (window.confirm('Are you sure you want to suspend this worker?')) {
      setWorkers(workers.map(w => w.id === id ? { ...w, status: 'suspended' } : w));
    }
  };

  const handleUpdateAdminProfile = (e) => {
    e.preventDefault();
    setAdminProfile({ ...adminProfileForm });
    setIsAdminProfileOpen(false);
  };

  const getStatusBadge = (status) => {

    const statusStyles = {
      COMPLETED: "bg-emerald-100 text-emerald-700",
      IN_PROGRESS: "bg-amber-100 text-amber-700",
      PENDING: "bg-blue-100 text-blue-700",
      ACCEPTED: "bg-indigo-100 text-indigo-700",
      REJECTED: "bg-red-100 text-red-700",
      CANCELLED: "bg-red-100 text-red-700"
    };

    return statusStyles[status?.toUpperCase()] || "bg-slate-100 text-slate-700";
  };

  const getAvailabilityBadge = (availability) => {
    return availability === 'Available'
      ? 'bg-emerald-50 text-emerald-600'
      : 'bg-amber-50 text-amber-600';
  };

  return (
    // ✅ FIX: Root container uses fixed height + flex layout so sidebar and main are co-equal columns
    <div className="h-screen flex overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .animate-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ✅ FIX: Sidebar — fixed on mobile (z-50 overlay), flex-shrink-0 column on desktop */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50
        transition-transform duration-300
        lg:static lg:translate-x-0 lg:flex-shrink-0 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">FixAndGo</span>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
              { id: 'services', icon: Briefcase, label: 'Services' },
              { id: 'workers', icon: Users, label: 'Technicians' },
              { id: 'ServiceHistory', icon: Users, label: 'Service History' },
              { id: 'requests', icon: UserCheck, label: 'Approvals', badge: pendingRequests.length },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); setIsWorkerDetailOpen(false); setIsAdminProfileOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={() => { setIsAdminProfileOpen(true); setActiveSection('profile'); }}
              className="flex items-center gap-3 px-4 py-3 mb-2 w-full hover:bg-slate-50 rounded-xl transition-colors"
            >
              <img src={adminProfile.avatar} className="w-10 h-10 rounded-full" alt="Admin" />
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-slate-900">{adminProfile.name}</p>
                <p className="text-xs text-slate-500">{adminProfile.email}</p>
              </div>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-red-600 w-full transition-colors rounded-xl hover:bg-red-50" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ✅ FIX: Main content column — flex-1 + overflow-y-auto so only this scrolls */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ✅ FIX: Header is sticky within the scrollable column, not the viewport */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 px-4 py-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {isWorkerDetailOpen ? 'Worker Details' : isAdminProfileOpen ? 'Admin Profile' : activeSection}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 focus-within:ring-2 ring-indigo-500/20">
                <Search size={16} className="text-slate-400" />
                <input type="text" placeholder="Quick search..." className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none w-48 ml-2 text-slate-900" />
              </div>
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button
                onClick={() => { setIsAdminProfileOpen(true); setActiveSection('profile'); }}
                className="w-8 h-8 rounded-full ring-2 ring-slate-100 overflow-hidden hover:ring-indigo-500 transition-all"
              >
                <img src={adminProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Render the appropriate page based on activeSection and state */}
          {activeSection === 'dashboard' && !isWorkerDetailOpen && !isAdminProfileOpen && (
            <DashboardPage
              dashboardStats={dashboardStats}
              recentActivity={recentActivity}
              services={services}
              workers={workers}
              pendingRequests={pendingRequests}
              setIsAddServiceModalOpen={setIsAddServiceModalOpen}
              setActiveSection={setActiveSection}
              getStatusBadge={getStatusBadge}
            />
          )}

          {activeSection === 'services' && !isWorkerDetailOpen && !isAdminProfileOpen && (
            <ServicesPage
              services={services}
              setIsAddServiceModalOpen={setIsAddServiceModalOpen}
              openEditService={openEditService}
              deleteService={deleteService}
            />
          )}

          {activeSection === 'workers' && !isWorkerDetailOpen && !isAdminProfileOpen && (
            <WorkersPage
              workers={workers}
              setIsAddWorkerModalOpen={setIsAddWorkerModalOpen}
              openWorkerDetail={openWorkerDetail}
              openEditWorker={openEditWorker}
              suspendWorker={suspendWorker}
              getAvailabilityBadge={getAvailabilityBadge}
            />
          )}

          {isWorkerDetailOpen && selectedWorker && (
            <WorkerDetailPage
              selectedWorker={selectedWorker}
              setIsWorkerDetailOpen={setIsWorkerDetailOpen}
              openEditWorker={openEditWorker}
              suspendWorker={suspendWorker}
              getAvailabilityBadge={getAvailabilityBadge}
            />
          )}

          {isAdminProfileOpen && (
            <AdminProfilePage
              adminProfile={adminProfile}
              adminProfileForm={adminProfileForm}
              setAdminProfileForm={setAdminProfileForm}
              handleUpdateAdminProfile={handleUpdateAdminProfile}
              setIsAdminProfileOpen={setIsAdminProfileOpen}
            />
          )}
          {activeSection === 'ServiceHistory' && !isWorkerDetailOpen && !isAdminProfileOpen && (
            <ServiceHistoryPage />
          )}

          {activeSection === 'requests' && !isWorkerDetailOpen && !isAdminProfileOpen && (
            <PendingRequestsPage
              pendingRequests={pendingRequests}
              approveWorker={approveWorker}
              rejectWorker={rejectWorker}
              viewWorker={viewPendingWorker}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        setIsOpen={setIsAddServiceModalOpen}
        serviceForm={serviceForm}
        setServiceForm={setServiceForm}
        handleAddService={handleAddService}
      />

      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        setIsOpen={setIsEditServiceModalOpen}
        serviceForm={serviceForm}
        setServiceForm={setServiceForm}
        handleEditService={handleEditService}
      />

      <AddWorkerModal
        isOpen={isAddWorkerModalOpen}
        setIsOpen={setIsAddWorkerModalOpen}
        workerForm={workerForm}
        setWorkerForm={setWorkerForm}
        handleAddWorker={handleAddWorker}
        services={services}
      />

      <EditWorkerModal
        isOpen={isEditWorkerModalOpen}
        setIsOpen={setIsEditWorkerModalOpen}
        workerForm={workerForm}
        setWorkerForm={setWorkerForm}
        handleEditWorker={handleEditWorker}
        services={services}
      />
    </div>
  );
}