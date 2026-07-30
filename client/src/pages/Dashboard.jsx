import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Laptop, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLaptops: 0,
    available: 0,
    borrowed: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Total Laptops</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalLaptops}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-full text-slate-500">
              <Laptop size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Available</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.available}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Borrowed</h3>
              <p className="text-3xl font-bold text-amber-500 mt-2">{stats.borrowed}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full text-amber-500">
              <Clock size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Overdue</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
