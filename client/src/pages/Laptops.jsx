import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Laptop, Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';

const Laptops = () => {
  const { user } = useAuth();
  const isLibrarian = user?.role === 'LIBRARIAN';
  
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, reset } = useForm();

  const fetchLaptops = async () => {
    try {
      const res = await api.get('/laptops');
      setLaptops(res.data);
    } catch (error) {
      console.error("Failed to fetch laptops", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingLaptop) {
        // Only send fields that exist in the schema, format date properly
        const payload = { ...data };
        if (payload.purchaseDate) payload.purchaseDate = new Date(payload.purchaseDate).toISOString().split('T')[0];
        await api.put(`/laptops/${editingLaptop.id}`, payload);
      } else {
        await api.post('/laptops', data);
      }
      closeModal();
      fetchLaptops();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving laptop');
    }
  };

  const openEditModal = (laptop) => {
    setEditingLaptop(laptop);
    // Format data if needed
    const formattedData = { ...laptop };
    reset(formattedData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLaptop(null);
    reset({});
  };

  const deleteLaptop = async (id) => {
    if (window.confirm('Are you sure you want to delete this laptop?')) {
      try {
        await api.delete(`/laptops/${id}`);
        fetchLaptops();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting laptop');
      }
    }
  };

  const filteredLaptops = laptops.filter(l => 
    l.assetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading laptops...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laptop Inventory</h2>
          <p className="text-sm text-slate-500">Manage library laptops and monitor availability.</p>
        </div>
        {isLibrarian && (
          <button 
            onClick={() => { reset({}); setEditingLaptop(null); setShowModal(true); }}
            className="flex items-center px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Add Laptop
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
            placeholder="Search by Asset No, Brand, or Model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Asset No.</th>
              <th className="px-6 py-4 font-medium">Device</th>
              <th className="px-6 py-4 font-medium">OS</th>
              <th className="px-6 py-4 font-medium">Status</th>
              {isLibrarian && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLaptops.map((laptop) => (
              <tr key={laptop.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{laptop.assetNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{laptop.name}</div>
                  <div className="text-xs text-slate-500">SN: {laptop.serialNumber || 'N/A'} • {laptop.brand || 'No Brand'} {laptop.model || ''}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-700">{laptop.operatingSystem || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    laptop.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                    laptop.status === 'BORROWED' ? 'bg-blue-100 text-blue-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {laptop.status}
                  </span>
                </td>
                {isLibrarian && (
                  <td className="px-6 py-4 flex items-center justify-end space-x-2 text-slate-400">
                    <button onClick={() => openEditModal(laptop)} title="Edit Laptop" className="flex items-center px-2 py-1 text-xs font-medium rounded hover:bg-slate-100 text-slate-600 hover:text-red-900 transition-colors">
                      <Edit2 size={14} className="mr-1.5" /> Edit
                    </button>
                    <button onClick={() => deleteLaptop(laptop.id)} title="Delete Laptop" className="flex items-center px-2 py-1 text-xs font-medium rounded hover:bg-slate-100 text-slate-600 hover:text-red-900 transition-colors">
                      <Trash2 size={14} className="mr-1.5" /> Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredLaptops.length === 0 && (
              <tr>
                <td colSpan={isLibrarian ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                  <AlertCircle size={24} className="mx-auto mb-2 text-slate-400" />
                  No laptops found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingLaptop ? 'Edit Laptop' : 'Add New Laptop'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Laptop Barcode <span className="text-red-500">*</span></label>
                  <input {...register('assetNumber', { required: true })} placeholder="Scan or enter barcode" className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Laptop Name <span className="text-red-500">*</span></label>
                  <input {...register('name', { required: true })} placeholder="e.g. LIRC Laptop 01" className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                  <input {...register('serialNumber')} placeholder="Optional" className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                  <input {...register('brand')} placeholder="e.g. Dell (Optional)" className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model / Unit</label>
                  <input {...register('model')} placeholder="e.g. Latitude 3420 (Optional)" className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Operating System</label>
                  <input {...register('operatingSystem')} placeholder="e.g. Windows 11 (Optional)" className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors">{editingLaptop ? 'Save Changes' : 'Save Laptop'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laptops;
