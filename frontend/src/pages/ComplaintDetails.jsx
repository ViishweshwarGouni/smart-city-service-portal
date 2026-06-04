  import React, { useState, useEffect } from 'react';

  export default function ComplaintDetails({
    complaint,
    departments = [],
    user,
    onClose,
    onUpdateComplaint,
    onInspectMaster,
  }) {
    const [status, setStatus] = useState(complaint.status || 'Pending');
    const [priority, setPriority] = useState(complaint.priority || 'Medium');
    const [deptId, setDeptId] = useState(complaint.department_id || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
      setStatus(complaint.status || 'Pending');
      setPriority(complaint.priority || 'Medium');
      setDeptId(complaint.department_id || '');
      setSuccessMsg('');
    }, [complaint]);

    if (!complaint) return null;

    const isStaff = user.role === 'Admin' || user.role === 'Officer';

    const handleUpdate = async () => {
      setIsUpdating(true);
      setSuccessMsg('');
      try {
        await onUpdateComplaint(complaint.complaint_id, {
          status,
          priority,
          department_id: deptId || null,
        });
        setSuccessMsg('Complaint updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        alert('Failed to update complaint: ' + err.message);
      } finally {
        setIsUpdating(false);
      }
    };

    const getStatusColor = (s) => {
      switch (s?.toLowerCase()) {
        case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'in progress': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        case 'pending':
        default:
          return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      }
    };

    // Find assigned department name
    const assignedDept = departments.find(d => d.department_id === complaint.department_id);
    const deptName = assignedDept ? assignedDept.department_name : 'Unassigned';

    const createdDate = complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'N/A';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300 animate-fade-in">
        <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-900/60 flex justify-between items-center bg-slate-900/40">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Complaint Inspector</span>
              <h2 className="font-outfit font-extrabold text-xl text-slate-100 mt-1 line-clamp-1">{complaint.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700/80 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Main info row */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(status)}`}>
                Status: {status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/50 uppercase tracking-wider">
                Priority: {priority}
              </span>
              <span className="text-xs text-slate-500 font-medium">Filed on: {createdDate}</span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h4>
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-900/60 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Location / Map link */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Geographical Data</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/20 p-4 rounded-2xl border border-slate-900/60 items-center">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Coordinates</span>
                  <span className="text-xs font-mono text-slate-300">{complaint.latitude?.toFixed(6)}, {complaint.longitude?.toFixed(6)}</span>
                </div>
                <div className="sm:text-right">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-blue-400 text-xs font-bold transition-all duration-200"
                  >
                    <span>🌐</span>
                    <span>View on Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* AI insights & metadata */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Prediction Diagnostics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dept assignment */}
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900/60 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">AI Auto-Department</span>
                  <span className="text-sm text-slate-200 font-semibold">{complaint.predicted_department || 'General'}</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Assigned: {deptName}</span>
                </div>
                {/* Spam/Fraud score */}
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Spam Likelihood</span>
                    <span className={`text-xs font-bold ${complaint.fraud_score >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {complaint.fraud_score || 5}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${complaint.fraud_score >= 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${complaint.fraud_score || 5}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Duplicate notice */}
              {complaint.is_duplicate && (
                <div className="bg-orange-500/5 text-orange-400 border border-orange-500/10 px-4 py-3 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <span>⚠️</span>
                    <span>Duplicate Report Detected</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This report has been identified as a duplicate of an existing ticket. Work is already tracking on the master complaint.
                  </p>
                  {complaint.master_complaint_id && onInspectMaster && (
                    <button
                      onClick={() => onInspectMaster(complaint.master_complaint_id)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold underline mt-1 block focus:outline-none"
                    >
                      Inspect Master Complaint →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Update controls (Admin & Officer only) */}
            {isStaff && (
              <div className="border-t border-slate-900 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Administrative Actions</h4>
                
                {successMsg && (
                  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl text-xs font-medium">
                    {successMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status selector */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Priority selector */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Department override selector */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Override Dept</label>
                    <select
                      value={deptId}
                      onChange={(e) => setDeptId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
                    >
                      <option value="">Unassigned (Use Prediction)</option>
                      {departments.map((d) => (
                        <option key={d.department_id} value={d.department_id}>
                          {d.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/60 font-semibold text-xs transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Administrative Updates'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
