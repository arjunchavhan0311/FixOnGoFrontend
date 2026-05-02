import {
  ArrowLeft,
  Award,
  Ban,
  Briefcase,
  Calendar,
  DollarSign,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Star, User
} from 'lucide-react';

export default function WorkerDetailPage({ 
  selectedWorker, 
  setIsWorkerDetailOpen,
  openEditWorker,
  suspendWorker,
  getAvailabilityBadge 
}) {
  
  // FIX: This prevents the 'Cannot read properties of undefined' error
  // if the component renders before the worker data is passed in.
  if (!selectedWorker) {
    return null;
  }

  return (
    <div className="animate-in">
      <button 
        onClick={() => setIsWorkerDetailOpen(false)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Technicians
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="text-center mb-6">
              <img 
                src={`https://ui-avatars.com/api/?name=${selectedWorker.name}&background=4f46e5&color=fff&size=200`} 
                className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-slate-100"
                alt={selectedWorker.name}
              />
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedWorker.name}</h2>
              <p className="text-slate-500 font-semibold mb-3">{selectedWorker.service}</p>
              <span className={`px-3 py-1 ${getAvailabilityBadge(selectedWorker.availability)} text-xs font-bold rounded-full`}>
                {selectedWorker.availability}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-600">{selectedWorker.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-600">{selectedWorker.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-slate-600">{selectedWorker.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <DollarSign size={16} className="text-slate-400" />
                <span className="text-slate-600 font-semibold">{selectedWorker.worker_fees}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-slate-600">Joined {selectedWorker.joinDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => openEditWorker(selectedWorker)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
              <button 
                onClick={() => suspendWorker(selectedWorker.id)}
                className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
              >
                <Ban size={16} />
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
            <h3 className="font-bold text-slate-900 mb-4">Performance Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">{selectedWorker.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Jobs Completed</span>
                <span className="font-bold text-slate-900">{selectedWorker.jobsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Experience</span>
                <span className="font-bold text-slate-900">{selectedWorker.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Emergency Service</span>
                <span className={`font-bold ${selectedWorker.emergencyService ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {selectedWorker.emergencyService ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={20} />
              About
            </h3>
            <p className="text-slate-600 leading-relaxed">{selectedWorker.bio}</p>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={20} />
              Certifications & Licenses
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedWorker.certifications?.map((cert, index) => (
                <span key={index} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {selectedWorker.languages?.map((lang, index) => (
                <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} />
              Recent Jobs
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Kitchen Sink Repair</p>
                    <p className="text-xs text-slate-500">{i} days ago</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}