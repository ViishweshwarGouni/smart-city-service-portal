import React, { useState } from 'react';

export default function HeatMap({ complaints = [], onSelectComplaint }) {
  const [hoveredComplaint, setHoveredComplaint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map dimensions
  const width = 600;
  const height = 400;

  // Coordinate Projection Helper
  // Default bounds covering metropolitan area
  let minLat = 40.65;
  let maxLat = 40.78;
  let minLng = -74.05;
  let maxLng = -73.92;

  // Adjust bounds dynamically if complaints are outside default bounds
  if (complaints.length > 0) {
    const lats = complaints.map(c => c.latitude).filter(l => l && !isNaN(l));
    const lngs = complaints.map(c => c.longitude).filter(l => l && !isNaN(l));
    
    if (lats.length > 0 && lngs.length > 0) {
      const pad = 0.02;
      const fileMinLat = Math.min(...lats);
      const fileMaxLat = Math.max(...lats);
      const fileMinLng = Math.min(...lngs);
      const fileMaxLng = Math.max(...lngs);

      // Expand default bounds if necessary
      minLat = Math.min(minLat, fileMinLat - pad);
      maxLat = Math.max(maxLat, fileMaxLat + pad);
      minLng = Math.min(minLng, fileMinLng - pad);
      maxLng = Math.max(maxLng, fileMaxLng + pad);
    }
  }

  const project = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * height;
    return { x, y };
  };

  const getPinColor = (status, severity) => {
    if (status?.toLowerCase() === 'resolved') return '#10b981'; // green
    if (status?.toLowerCase() === 'in progress') return '#3b82f6'; // blue
    if (severity >= 75) return '#f43f5e'; // rose
    if (severity >= 45) return '#f97316'; // orange
    return '#9ca3af'; // gray
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 relative select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-outfit font-bold text-xl text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Interactive City Hotspots
          </h2>
          <p className="text-slate-400 text-xs">Real-time complaint locations and density across city sectors.</p>
        </div>
        
        {/* Map Legend */}
        <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block shadow shadow-rose-500/50"></span>
            <span>Severe</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 block shadow shadow-orange-500/50"></span>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block shadow shadow-blue-500/50"></span>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block shadow shadow-emerald-500/50"></span>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 aspect-[3/2] flex items-center justify-center">
        {/* City Grid Background */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full relative"
          onMouseMove={(e) => {
            if (hoveredComplaint) {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({
                x: e.clientX - rect.left + 15,
                y: e.clientY - rect.top - 15,
              });
            }
          }}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* City Sectors / Zones */}
          <path d="M 0,100 L 150,80 L 250,220 L 100,280 Z" fill="rgba(59,130,246,0.005)" stroke="rgba(59,130,246,0.05)" strokeWidth="2" strokeDasharray="5,5" />
          <text x="70" y="160" fill="rgba(255,255,255,0.12)" className="font-outfit text-xs font-semibold uppercase tracking-wider">Sector Alpha</text>
          
          <path d="M 250,0 L 400,20 L 450,180 L 250,220 Z" fill="rgba(99,102,241,0.005)" stroke="rgba(99,102,241,0.05)" strokeWidth="2" strokeDasharray="5,5" />
          <text x="310" y="90" fill="rgba(255,255,255,0.12)" className="font-outfit text-xs font-semibold uppercase tracking-wider">Sector Beta</text>

          <path d="M 100,280 L 250,220 L 450,180 L 520,320 L 320,380 Z" fill="rgba(20,184,166,0.005)" stroke="rgba(20,184,166,0.05)" strokeWidth="2" strokeDasharray="5,5" />
          <text x="280" y="290" fill="rgba(255,255,255,0.12)" className="font-outfit text-xs font-semibold uppercase tracking-wider">Sector Gamma</text>

          {/* City Roads (stylized lines) */}
          <path d="M 0,200 Q 300,180 600,200" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
          <path d="M 300,0 C 280,150 320,250 300,400" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />

          {/* Active Complaint Pins */}
          {complaints.map((c, i) => {
            const { x, y } = project(c.latitude, c.longitude);
            const pinColor = getPinColor(c.status, c.severity_score);
            const isHovered = hoveredComplaint?.complaint_id === c.complaint_id;

            return (
              <g key={c.complaint_id || i} className="cursor-pointer">
                {/* Glowing Aura */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 16 : 8}
                  fill={pinColor}
                  opacity={isHovered ? 0.35 : 0.15}
                  className="transition-all duration-355"
                />
                
                {/* Core Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={pinColor}
                  className="transition-all duration-300 shadow"
                  onMouseEnter={(e) => {
                    setHoveredComplaint(c);
                    const rect = e.currentTarget.parentNode.parentNode.getBoundingClientRect();
                    const groupRect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({
                      x: groupRect.left - rect.left + 15,
                      y: groupRect.top - rect.top - 15,
                    });
                  }}
                  onMouseLeave={() => setHoveredComplaint(null)}
                  onClick={() => onSelectComplaint && onSelectComplaint(c)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredComplaint && (
          <div
            className="absolute z-10 glass-panel rounded-xl p-3 border border-slate-700 pointer-events-none shadow-xl max-w-xs transition-all duration-100"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <p className="font-outfit font-bold text-xs text-slate-100 mb-1 line-clamp-1">{hoveredComplaint.title}</p>
            <div className="flex space-x-2 text-[10px] mb-1">
              <span className="text-slate-400 font-semibold">{hoveredComplaint.predicted_department || 'General'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400 capitalize">{hoveredComplaint.status || 'Pending'}</span>
            </div>
            <p className="text-[10px] text-slate-400">Severity: {hoveredComplaint.severity_score}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
