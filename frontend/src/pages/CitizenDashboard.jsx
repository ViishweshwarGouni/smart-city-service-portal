import React, { useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintCard from '../components/ComplaintCard';

export default function CitizenDashboard({
  user,
  complaints = [],
  departments = [],
  onSubmitComplaint,
  isSubmitting,
  onSelectComplaint,
}) {
  const [filter, setFilter] = useState('All');

  // Filter complaints for this citizen
  const citizenComplaints = complaints.filter(c => c.user_id === user.user_id);

  const filteredComplaints = citizenComplaints.filter((c) => {
    if (filter === 'All') return true;
    return c.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-slate-100 mb-1">
            Hello, {user.name} 👋
          </h1>
          <p className="text-slate-400 text-xs">
            Report local infrastructure issues and track their resolution status in real-time.
          </p>
        </div>
        <div className="flex space-x-3 text-center">
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl min-w-[85px]">
            <span className="block text-lg font-bold text-slate-200 font-outfit">{citizenComplaints.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Filed</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl min-w-[85px]">
            <span className="block text-lg font-bold text-amber-400 font-outfit">
              {citizenComplaints.filter((c) => c.status?.toLowerCase() === 'pending').length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Pending</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl min-w-[85px]">
            <span className="block text-lg font-bold text-emerald-400 font-outfit">
              {citizenComplaints.filter((c) => c.status?.toLowerCase() === 'resolved').length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Resolved</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-4">
          <ComplaintForm onSubmit={onSubmitComplaint} isSubmitting={isSubmitting} />
        </div>

        {/* Right List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-outfit font-bold text-lg text-slate-200">My Reports</h2>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-850">
              {['All', 'Pending', 'In Progress', 'Resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    filter === f
                      ? 'bg-slate-800 text-slate-100 border border-slate-700/60'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900/80 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 text-xl shadow-md animate-float">
                📁
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <p className="font-outfit font-bold text-slate-300">No complaints found</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {citizenComplaints.length === 0
                    ? "Help keep your city running smoothly. Report water leaks, electrical hazards, potholes, or sanitation issues using the form on the left."
                    : `No reports found matching status "${filter}".`}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredComplaints.map((c) => (
                <ComplaintCard
                  key={c.complaint_id}
                  complaint={c}
                  departments={departments}
                  onSelect={onSelectComplaint}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
