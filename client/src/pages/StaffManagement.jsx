import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Edit2, Lock, Shield, ShieldOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff');
      setStaffList(res.data);
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingStaff) {
        await api.put(`/staff/${editingStaff.id}`, data);
      } else {
        await api.post('/staff', data);
      }
      closeModal();
      fetchStaff();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving staff');
    }
  };

  const onResetPasswordSubmit = async (data) => {
    try {
      await api.patch(`/staff/${resetPasswordTarget.id}/reset-password`, data);
      setResetPasswordTarget(null);
      reset({});
      alert('Password reset successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error resetting password');
    }
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    reset({ firstName: staff.firstName, lastName: staff.lastName, role: staff.role });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStaff(null);
    reset({});
  };

  const toggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this account?`)) {
      try {
        await api.patch(`/staff/${id}/status`, { isActive: !currentStatus });
        fetchStaff();
      } catch (error) {
        alert('Error updating status');
      }
    }
  };

  if (loading) return <div>Loading staff data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff Management</h2>
          <p className="text-sm text-slate-500">Manage library personnel and their access roles.</p>
        </div>
        <button 
          onClick={() => { reset({}); setEditingStaff(null); setShowModal(true); }}
          className="flex items-center px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors shadow-sm"
        >
          <UserPlus size={18} className="mr-2" />
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">
                  {staff.firstName} {staff.lastName}
                </td>
                <td className="px-6 py-4 text-slate-500">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    staff.role === 'LIBRARIAN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    staff.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-900'
                  }`}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end space-x-3 text-slate-400">
                  {staff.id !== user?.id ? (
                    <>
                      <button onClick={() => openEditModal(staff)} title="Edit User" className="hover:text-red-900"><Edit2 size={18} /></button>
                      <button onClick={() => { setResetPasswordTarget(staff); reset({}); }} title="Reset Password" className="hover:text-red-900"><Lock size={18} /></button>
                      <button 
                        onClick={() => toggleStatus(staff.id, staff.isActive)}
                        title={staff.isActive ? "Deactivate" : "Activate"} 
                        className={staff.isActive ? "hover:text-red-900" : "hover:text-green-600"}
                      >
                        {staff.isActive ? <ShieldOff size={18} /> : <Shield size={18} />}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Current User</span>
                  )}
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  <AlertCircle size={24} className="mx-auto mb-2 text-slate-400" />
                  No other staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input {...register('firstName', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input {...register('lastName', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                </div>
              </div>
              
              {!editingStaff && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" {...register('email', { required: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select {...register('role')} className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900">
                  <option value="STAFF">Library Staff</option>
                  <option value="LIBRARIAN">Librarian</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors">{editingStaff ? 'Save Changes' : 'Create Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordTarget && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-4">Set a new password for {resetPasswordTarget.firstName} {resetPasswordTarget.lastName}.</p>
            <form onSubmit={handleSubmit(onResetPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input type="password" {...register('newPassword', { required: true, minLength: 6 })} className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setResetPasswordTarget(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
