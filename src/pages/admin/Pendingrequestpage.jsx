import {
  Briefcase,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Mail,
  MapPin, Phone,
  X
} from 'lucide-react';
export default function PendingRequestsPage({
  pendingRequests,
  approveWorker,
  rejectWorker,
  viewWorker
}) {
  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Pending Worker Requests</h1>
        <p className="text-slate-500 text-sm">Review and approve worker registration applications</p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-slate-500">No pending worker requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(request => (
            <div key={request.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-indigo-200 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={`https://ui-avatars.com/api/?name=${request.name}&background=6366f1&color=fff`}
                    className="w-16 h-16 rounded-xl"
                    alt={request.name}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{request.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded">New Application</span>
                          <span className="text-xs text-slate-400">{request.requestDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Briefcase size={16} className="text-slate-400" />
                        <span className="font-semibold">{request.service}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} className="text-slate-400" />
                        <span className="font-semibold">{request.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign size={16} className="text-slate-400" />
                        <span className="font-semibold">{request.hourlyRate}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg flex items-center gap-1.5">
                        <CheckCircle size={12} />
                        {request.certifications}
                      </span>
                      {request.portfolio === 'Yes' && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                          Portfolio Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3">
                  <button
                    onClick={() => viewWorker(request)}
                    className="flex-1 lg:flex-none bg-indigo-50 hover:bg-indigo-100 
                    text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm 
                    flex items-center justify-center gap-2 transition-all"
                  >
                  <Eye size={18} />
                    View
                  </button>

                  <button
                    onClick={() => approveWorker(request)}
                    className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all"
                  >
                    <Check size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => rejectWorker(request.email)}
                    className="flex-1 lg:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}