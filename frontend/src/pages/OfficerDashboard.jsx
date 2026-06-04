import React, { useState } from 'react';
import ComplaintCard from '../components/ComplaintCard';

export default function OfficerDashboard({
  user,
  complaints = [],
  departments = [],
  onSelectComplaint,
}) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Resolve officer's department
  const officerDept = departments.find((d) => {
    const deptNameLower = d.department_name.toLowerCase();
    return user.email.toLowerCase().includes(deptNameLower) || user.name.toLowerCase().includes(deptNameLower);
  });

  const deptId = officerDept?.department_id;
  const deptName = officerDept?.department_name || 'General';

  // Filter complaints:
  // Show complaints assigned to this department, OR predicted to this department (if not overridden to another)
  const deptComplaints = complaints.filter((c) => {
    // If it has an explicit department_id, check if it matches
    if (c.department_id) {
      return c.department_id === deptId;
    }
    // Otherwise, check if the AI predicted it to this department
    return c.predicted_department?.toLowerCase() === deptName.toLowerCase();
  });

  const filteredComplaints = deptComplaints.filter((c) => {
    const matchesStatus = filter === 'All' || c.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {deptName} Department Queue
          </span>
          <h1 className="font-outfit font-extrabold text-2xl text-slate-100 mt-2 mb-1">
            Officer Dashboard
          </h1>
          <p className="text-slate-400 text-xs">
            Review automatically routed complaints, assess duplicates/fraud flags, and update resolution status.
          </p>
        </div>
        <div className="flex space-x-3 text-center">
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl min-w-[85px]">
            <span className="block text-lg font-bold text-slate-200 font-outfit">{deptComplaints.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl min-w-[85px]">
            <span className="block text-lg font-bold text-rose-450 font-outfit">
              {deptComplaints.filter(c => c.severity_score >= 75 && c.status?.toLowerCase() !== 'resolved').length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Severe</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl min-w-[85px]">
            <span className="block text-lg font-bold text-emerald-400 font-outfit">
              {deptComplaints.filter(c => c.status?.toLowerCase() === 'resolved').length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Resolved</span>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
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

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900/80 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 text-xl shadow-md">
            📥
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <p className="font-outfit font-bold text-slate-300">No complaints in queue</p>
            <p className="text-slate-500 text-xs">
              No reports match your filters. Active infrastructure requests will automatically route here based on AI text analysis.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
