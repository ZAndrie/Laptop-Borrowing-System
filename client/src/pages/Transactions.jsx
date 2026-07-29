import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { RefreshCcw, Plus, Search, AlertCircle, Clock, CheckCircle, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [laptops, setLaptops] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, lapRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/laptops')
      ]);
      setTransactions(txRes.data);
      setLaptops(lapRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/transactions/borrow', data);
      setShowModal(false);
      reset();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error processing borrow transaction');
    }
  };

  const handleStudentIdBlur = async (e) => {
    const studentId = e.target.value.trim();
    if (!studentId) return;
    try {
      const res = await api.get(`/borrowers/lookup/${studentId}`);
      if (res.data) {
        // Auto-fill
        setValue('firstName', res.data.firstName);
        setValue('lastName', res.data.lastName);
        setValue('course', res.data.course);
        setValue('yearLevel', res.data.yearLevel);
        setValue('college', res.data.college);
        setValue('contactNumber', res.data.contactNumber);
      }
    } catch (err) {
      // Not found, do nothing so they can fill it manually
    }
  };

  const availableLaptops = laptops.filter(l => l.status === 'AVAILABLE');

  const filteredTransactions = transactions.filter(t => 
    t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.borrower.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.borrower.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.laptop.assetNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-slate-500">Loading transactions...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Borrow Transactions</h2>
          <p className="text-sm text-slate-500">Manage and track active laptop borrowings.</p>
        </div>
        <button 
          onClick={() => { reset(); setShowModal(true); }}
          className="flex items-center px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Borrow Laptop
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-red-900 focus:border-red-900 sm:text-sm"
            placeholder="Search by TRN, Student Name, or Asset No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-medium">Transaction No.</th>
              <th className="px-6 py-4 font-medium">Borrower</th>
              <th className="px-6 py-4 font-medium">Laptop</th>
              <th className="px-6 py-4 font-medium">Borrow Date</th>
              <th className="px-6 py-4 font-medium">Due Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{tx.transactionNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{tx.borrower.firstName} {tx.borrower.lastName}</div>
                  <div className="text-xs text-slate-500">{tx.borrower.studentId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{tx.laptop.brand} {tx.laptop.model}</div>
                  <div className="text-xs text-slate-500">Asset: {tx.laptop.assetNumber}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(tx.borrowDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(tx.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'BORROWED' ? 'bg-blue-100 text-blue-800' : 
                    tx.status === 'RETURNED' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.status === 'BORROWED' && <Clock size={12} className="mr-1" />}
                    {tx.status === 'RETURNED' && <CheckCircle size={12} className="mr-1" />}
                    {tx.status === 'OVERDUE' && <AlertCircle size={12} className="mr-1" />}
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  <RefreshCcw size={24} className="mx-auto mb-2 text-slate-400" />
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Process Borrow Transaction</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 flex items-start text-sm">
              <Info className="min-w-5 min-h-5 mr-3 mt-0.5" />
              <p>
                <strong>Smart Auto-fill:</strong> Type the <strong>Student ID</strong> and click outside the box. If the student has borrowed a laptop before, their details will automatically fill in! Otherwise, just fill them in and the system will save it for next time.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Student Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                    <input 
                      type="text" 
                      {...register('studentId', { required: 'Student ID is required' })} 
                      onBlur={handleStudentIdBlur}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                      placeholder="e.g. 2021-00123"
                    />
                    {errors.studentId && <p className="text-xs text-red-600 mt-1">{errors.studentId.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      {...register('contactNumber', { required: 'Contact Number is required' })} 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                    />
                    {errors.contactNumber && <p className="text-xs text-red-600 mt-1">{errors.contactNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      {...register('firstName', { required: 'First Name is required' })} 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                    />
                    {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      {...register('lastName', { required: 'Last Name is required' })} 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                    />
                    {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                    <input 
                      type="text" 
                      {...register('course', { required: 'Course is required' })} 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                      placeholder="e.g. BSIT"
                    />
                    {errors.course && <p className="text-xs text-red-600 mt-1">{errors.course.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                      <input 
                        type="text" 
                        {...register('yearLevel', { required: 'Year is required' })} 
                        className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                        placeholder="e.g. 3rd"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">College</label>
                      <input 
                        type="text" 
                        {...register('college', { required: 'College is required' })} 
                        className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                        placeholder="e.g. CITE"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-4 border-b pb-2">Borrow Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Laptop</label>
                    <select 
                      {...register('laptopId', { required: 'Laptop is required' })} 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white"
                    >
                      <option value="">-- Select an available laptop --</option>
                      {availableLaptops.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.assetNumber} - {l.brand} {l.model}
                        </option>
                      ))}
                    </select>
                    {errors.laptopId && <p className="text-xs text-red-600 mt-1">{errors.laptopId.message}</p>}
                    {availableLaptops.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1"/> No laptops are currently available.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expected Due Date</label>
                    <input 
                      type="date" 
                      {...register('dueDate', { required: 'Due date is required' })} 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white" 
                    />
                    {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
                    <textarea 
                      {...register('remarks')} 
                      rows="2"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-red-900 focus:border-red-900 bg-white"
                      placeholder="Any special notes..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors shadow-sm">
                  Confirm Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
