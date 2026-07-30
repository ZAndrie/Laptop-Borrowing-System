import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Laptop, Lock, Mail, User } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      role: 'STAFF'
    }
  });
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      
      if (data.password !== data.confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      await api.post('/auth/register', data);
      
      if (data.role === 'LIBRARIAN') {
        setSuccessMsg('Registration successful! You can now log in.');
      } else {
        setSuccessMsg('Registration successful! Please wait for a Librarian to approve your account.');
      }
      
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <img src="/logo.png" alt="LIRC Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">LIRC Laptop Borrowing Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-sm text-red-900 bg-red-50 rounded-lg">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-sm text-green-700 bg-green-50 rounded-lg">
              {successMsg}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">First Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  {...register('firstName', { required: 'Required' })}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                  placeholder="Juan"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  {...register('lastName', { required: 'Required' })}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                  placeholder="Dela Cruz"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  {...register('username', { required: 'Required' })}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                  placeholder="juandelacruz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Required' })}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                  placeholder="juan@library.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Required', minLength: 6 })}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword', { required: 'Required' })}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Select Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              defaultValue="STAFF"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-red-900 focus:border-red-900 sm:text-sm rounded-lg"
            >
              <option value="STAFF">Library Staff</option>
              <option value="LIBRARIAN">Librarian</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-900 hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 transition-colors"
          >
            Register
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="font-medium text-red-900 hover:text-red-500">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
