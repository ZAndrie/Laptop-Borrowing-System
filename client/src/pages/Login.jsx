import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Laptop, Lock, Mail, User } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      await login(data.identifier, data.password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <img src="/logo.png" alt="LIRC Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">LIRC Laptop Borrowing Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMsg && (
            <div className="p-3 text-sm text-red-900 bg-red-50 rounded-lg">
              {errorMsg}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Username or Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                {...register('identifier', { required: 'Username or Email is required' })}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                placeholder="admin or admin@library.com"
              />
            </div>
            {errors.identifier && <p className="mt-1 text-sm text-red-900">{errors.identifier.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-900">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-900 focus:ring-red-900 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-red-900 hover:text-red-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-900 hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 transition-colors"
          >
            Sign in
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <Link to="/register" className="font-medium text-red-900 hover:text-red-500">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
