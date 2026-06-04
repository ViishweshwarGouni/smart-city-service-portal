import React, { useState } from 'react';
import HeatMap from '../components/HeatMap';

export default function AdminDashboard({
  user,
  complaints = [],
  departments = [],
  onSelectComplaint,
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [duplicateFilter, setDuplicateFilter] = useState('All'); // All, Yes, No
  const [spamFilter, setSpamFilter] = useState('All'); // All, Yes, No

  // Compute overall stats
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status?.toLowerCase() === 'resolved').length;
  const inProgress = complaints.filter((c) => c.status?.toLowerCase() === 'in progress').length;
  const pending = complaints.filter((c) => c.status?.toLowerCase() === 'pending' || !c.status).length;
  const active = pending + inProgress;
  const spam = complaints.filter((c) => c.fraud_score >= 50).length;
  const duplicates = complaints.filter((c) => c.is_duplicate).length;

  // Compute department distribution
  const deptCounts = departments.map((d) => {
    const count = complaints.filter((c) => {
      if (c.department_id) return c.department_id === d.department_id;
      return c.predicted_department?.toLowerCase() === d.department_name.toLowerCase();
    }).length;
    return { name: d.department_name, count };
  });

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status?.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDept = true;
    if (deptFilter !== 'All') {
      const deptObj = departments.find((d) => d.department_id === deptFilter);
      const assignedName = deptObj?.department_name || '';
      matchesDept =
        c.department_id === deptFilter ||
        (c.department_id === null && c.predicted_department?.toLowerCase() === assignedName.toLowerCase());
    }

    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesDuplicate =
      duplicateFilter === 'All' ||
      (duplicateFilter === 'Yes' && c.is_duplicate) ||
      (duplicateFilter === 'No' && !c.is_duplicate);

    const matchesSpam =
      spamFilter === 'All' ||
      (spamFilter === 'Yes' && c.fraud_score >= 50) ||
      (spamFilter === 'No' && c.fraud_score < 50);

    return matchesStatus && matchesDept && matchesSearch && matchesDuplicate && matchesSpam;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h1 className="font-outfit font-extrabold text-2xl text-slate-100 mb-1">
          City Overview Dashboard
        </h1>
        <p className="text-slate-400 text-xs">
          Administrate services, track duplicate reports, view AI department mapping, and inspect geographic clusters.
        </p>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-5 rounded-2xl">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total Complaints</span>
          <span className="text-2xl font-bold text-slate-200 font-outfit mt-1 block">{total}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-5 rounded-2xl">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Active Queue</span>
          <span className="text-2xl font-bold text-amber-500 font-outfit mt-1 block">{active}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-5 rounded-2xl">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Resolved</span>
          <span className="text-2xl font-bold text-emerald-550 font-outfit mt-1 block">{resolved}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-5 rounded-2xl">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Spam Warnings</span>
          <span className="text-2xl font-bold text-rose-500 font-outfit mt-1 block">{spam}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-5 rounded-2xl col-span-2 md:col-span-1">
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Duplicate Reports</span>
          <span className="text-2xl font-bold text-orange-405 font-outfit mt-1 block">{duplicates}</span>
        </div>
      </div>

      {/* Map & Department Distribution split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8">
          <HeatMap complaints={complaints} onSelectComplaint={onSelectComplaint} />
        </div>
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="font-outfit font-bold text-lg text-slate-200 mb-4">Department Distribution</h2>
            <div className="space-y-4">
              {deptCounts.map((dept) => {
                const percentage = total > 0 ? (dept.count / total) * 100 : 0;
                return (
                  <div key={dept.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">{dept.name}</span>
                      <span className="text-slate-400">{dept.count} requests</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-[11px] text-slate-400 leading-relaxed mt-4">
            <span className="font-bold text-slate-200 block mb-1">🤖 AI Routing Note</span>
            All incoming citizen descriptions are processed using a trained BiLSTM neural network, assigning requests to the optimal department with confidence scores.
          </div>
        </div>
      </div>

      {/* Filter controls and Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="font-outfit font-bold text-lg text-slate-200">Global Complaint Ledger</h2>
          
          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 text-xs">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input placeholder-slate-500 focus:outline-none w-full sm:w-44"
            />
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input focus:outline-none w-36"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            {/* Department */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input focus:outline-none w-40"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>
            {/* Duplicate */}
            <select
              value={duplicateFilter}
              onChange={(e) => setDuplicateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input focus:outline-none w-36"
            >
              <option value="All">All Duplicates</option>
              <option value="Yes">Duplicates Only</option>
              <option value="No">No Duplicates</option>
            </select>
            {/* Spam */}
            <select
              value={spamFilter}
              onChange={(e) => setSpamFilter(e.target.value)}
              className="px-3 py-2 rounded-xl glass-input focus:outline-none w-32"
            >
              <option value="All">All Spam</option>
              <option value="Yes">Spam Flags</option>
              <option value="No">Clear Only</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Assigned Dept</th>
                <th className="px-6 py-4">AI Prediction</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Spam Flag</th>
                <th className="px-6 py-4">Duplicate</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-slate-500">
                    No complaints match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const assigned = departments.find((d) => d.department_id === c.department_id);
                  const deptStr = assigned ? assigned.department_name : 'Unassigned';
                  return (
                    <tr key={c.complaint_id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-200 max-w-[200px] truncate">
                        {c.title}
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {deptStr}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {c.predicted_department || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-300">{c.severity_score}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            c.priority?.toLowerCase() === 'high'
                              ? 'bg-rose-500/10 text-rose-450'
                              : c.priority?.toLowerCase() === 'medium'
                              ? 'bg-orange-500/10 text-orange-400'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {c.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            c.status?.toLowerCase() === 'resolved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : c.status?.toLowerCase() === 'in progress'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {c.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {c.fraud_score >= 50 ? (
                          <span className="text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[10px]">
                            ⚠️ {c.fraud_score}%
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-semibold">{c.fraud_score}%</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {c.is_duplicate ? (
                          <span className="text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded text-[10px]">
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onSelectComplaint(c)}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors font-bold text-[10px]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
