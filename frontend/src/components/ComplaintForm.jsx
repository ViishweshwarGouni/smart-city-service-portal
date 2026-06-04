import React, { useState, useEffect } from 'react';

export default function ComplaintForm({ onSubmit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Real-time AI prediction suggestion simulation
  useEffect(() => {
    const text = (title + ' ' + description).toLowerCase();
    if (text.includes('pothole') || text.includes('road') || text.includes('street') || text.includes('asphalt')) {
      setAiSuggestion('Roads');
    } else if (text.includes('leak') || text.includes('water') || text.includes('pipe') || text.includes('drain') || text.includes('sewage')) {
      setAiSuggestion('Water');
    } else if (text.includes('electricity') || text.includes('power') || text.includes('light') || text.includes('blackout') || text.includes('wire')) {
      setAiSuggestion('Electricity');
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('sanitation') || text.includes('dump') || text.includes('cleanliness')) {
      setAiSuggestion('Sanitation');
    } else if (text.includes('lamp') || text.includes('street light') || text.includes('streetlight')) {
      setAiSuggestion('Street Lights');
    } else {
      setAiSuggestion('');
    }
  }, [title, description]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (error) => {
          // Fallback to random coordinates within a city range for simulation
          const mockLat = (40.7128 + (Math.random() - 0.5) * 0.1).toFixed(6);
          const mockLng = (-74.0060 + (Math.random() - 0.5) * 0.1).toFixed(6);
          setLatitude(mockLat);
          setLongitude(mockLng);
        }
      );
    } else {
      // Fallback
      const mockLat = (40.7128 + (Math.random() - 0.5) * 0.1).toFixed(6);
      const mockLng = (-74.0060 + (Math.random() - 0.5) * 0.1).toFixed(6);
      setLatitude(mockLat);
      setLongitude(mockLng);
    }
  };

  // Generate a random mock location if coordinates are empty on mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !latitude || !longitude) return;

    onSubmit({
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    // Reset fields except location
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
      <div>
        <h2 className="font-outfit font-bold text-xl text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          File a Complaint
        </h2>
        <p className="text-slate-400 text-xs">AI will classify and assign the request automatically.</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Complaint Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Burst water pipe on Main St"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Detailed Description
          </label>
          <textarea
            required
            rows={4}
            placeholder="Provide details about the issue. Include nearby landmarks if possible."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
          />
        </div>

        {/* Real-time AI prediction warning/assist */}
        {aiSuggestion && (
          <div className="flex items-center space-x-2 bg-blue-500/5 text-blue-400 border border-blue-500/10 px-4 py-2.5 rounded-xl text-xs animate-pulse-glow">
            <span className="font-bold">🤖 Auto-Classification Assist:</span>
            <span>Targeting <strong>{aiSuggestion}</strong> department</span>
          </div>
        )}

        {/* Location coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium text-xs border border-slate-700/60 transition-all duration-300"
        >
          <span>📍</span>
          <span>Refresh to Current / Mock Coordinates</span>
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Submitting Complaint...</span>
          </>
        ) : (
          <span>Submit Complaint</span>
        )}
      </button>
    </form>
  );
}
