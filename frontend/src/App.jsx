import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetails from './pages/ComplaintDetails';
import { fetchComplaints, fetchDepartments, addComplaint, updateComplaint } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // login, register, dashboard
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user session from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('civicpulse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setPage('dashboard');
      } catch (e) {
        localStorage.removeItem('civicpulse_user');
      }
    }
    
    // Load departments (available publicly)
    fetchDepartments()
      .then(data => setDepartments(data || []))
      .catch(err => console.error('Failed to load departments:', err))
      .finally(() => setIsInitialLoading(false));
  }, []);

  // Fetch complaints whenever user logs in or dashboard is visible
  const refreshComplaints = async () => {
    if (!user) return;
    try {
      const data = await fetchComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshComplaints();
      // Poll complaints queue every 15 seconds for updates
      const interval = setInterval(refreshComplaints, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('civicpulse_user', JSON.stringify(loggedInUser));
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('civicpulse_user');
    setPage('login');
    setComplaints([]);
    setSelectedComplaint(null);
  };

  const handleSubmitComplaint = async (complaintData) => {
    setIsSubmitting(true);
    try {
      await addComplaint({
        ...complaintData,
        user_id: user.user_id,
      });
      await refreshComplaints();
    } catch (err) {
      alert('Failed to submit complaint: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComplaint = async (complaintId, updateData) => {
    try {
      await updateComplaint(complaintId, updateData);
      await refreshComplaints();
      
      // Update selected complaint in-place to reflect changes in modal
      setSelectedComplaint(prev => {
        if (prev && prev.complaint_id === complaintId) {
          return { ...prev, ...updateData };
        }
        return prev;
      });
    } catch (err) {
      throw err;
    }
  };

  const handleInspectMaster = (masterId) => {
    const master = complaints.find(c => c.complaint_id === masterId);
    if (master) {
      setSelectedComplaint(master);
    } else {
      alert('Master complaint detail could not be loaded.');
    }
  };

  const renderDashboard = () => {
    if (user.role === 'Admin') {
      return (
        <AdminDashboard
          user={user}
          complaints={complaints}
          departments={departments}
          onSelectComplaint={setSelectedComplaint}
        />
      );
    } else if (user.role === 'Officer') {
      return (
        <OfficerDashboard
          user={user}
          complaints={complaints}
          departments={departments}
          onSelectComplaint={setSelectedComplaint}
        />
      );
    } else {
      return (
        <CitizenDashboard
          user={user}
          complaints={complaints}
          departments={departments}
          onSubmitComplaint={handleSubmitComplaint}
          isSubmitting={isSubmitting}
          onSelectComplaint={setSelectedComplaint}
        />
      );
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-outfit font-semibold text-sm">Initializing CivicPulse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans">
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-1">
          {user ? (
            renderDashboard()
          ) : page === 'register' ? (
            <Register
              onRegisterSuccess={() => setPage('login')}
              navigateToLogin={() => setPage('login')}
            />
          ) : (
            <Login
              onLoginSuccess={handleLoginSuccess}
              navigateToRegister={() => setPage('register')}
            />
          )}
        </main>
      </div>

      {/* Details modal */}
      {selectedComplaint && (
        <ComplaintDetails
          complaint={selectedComplaint}
          departments={departments}
          user={user}
          onClose={() => setSelectedComplaint(null)}
          onUpdateComplaint={handleUpdateComplaint}
          onInspectMaster={handleInspectMaster}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900/60 py-6 text-center text-slate-500 text-xs mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} CivicPulse Smart City Portal. Empowering citizens, improving community services.</p>
        </div>
      </footer>
    </div>
  );
}
