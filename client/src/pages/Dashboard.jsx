import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Total Laptops</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Available</h3>
          <p className="text-3xl font-bold text-red-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Borrowed</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Overdue</h3>
          <p className="text-3xl font-bold text-red-900 mt-2">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
