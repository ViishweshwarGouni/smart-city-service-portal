import React from 'react';

export default function ComplaintCard({ complaint, departments = [], onSelect }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'pending':
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'medium':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'low':
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const assignedDept = departments.find(d => d.department_id === complaint.department_id);
  const deptName = assignedDept ? assignedDept.department_name : (complaint.predicted_department || 'Unassigned');

  // Format date
  const dateStr = complaint.created_at
    ? new Date(complaint.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown Date';

  return (
    <div className="glass-card hover:bg-slate-800/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-800 hover:border-slate-700/60 flex flex-col justify-between h-full">
      <div>
        {/* Header tags */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
            {complaint.status || 'Pending'}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getPriorityColor(complaint.priority)}`}>
            {complaint.priority || 'Medium'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-outfit font-semibold text-lg text-slate-100 mb-2 line-clamp-1">
          {complaint.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        {/* Department Info */}
        <div className="flex items-center space-x-2 mb-4 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] block text-slate-500 uppercase font-semibold">Assigned Dept</span>
            <span className="text-xs text-slate-300 font-medium">{deptName}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Progress & AI Info */}
        <div className="space-y-3 mb-4">
          {/* Severity bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Severity Level</span>
              <span className="font-semibold text-slate-300">{complaint.severity_score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  complaint.severity_score >= 75
                    ? 'bg-rose-500'
                    : complaint.severity_score >= 45
                    ? 'bg-orange-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${complaint.severity_score || 50}%` }}
              />
            </div>
          </div>

          {/* AI Labels */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            {complaint.fraud_score >= 50 && (
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold flex items-center space-x-1 animate-pulse">
                <span>⚠️</span>
                <span>Spam Risk ({complaint.fraud_score}%)</span>
              </span>
            )}
            {complaint.is_duplicate && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                Duplicate
              </span>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-500">{dateStr}</span>
          <button
            onClick={() => onSelect(complaint)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 hover:underline focus:outline-none"
          >
            <span>Details</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
