import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Edit2, User, ArrowLeft } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/allCustomer`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data.customers);
      updateCustomerData(data.customers);
    } catch (err) {
      setError('Failed to load customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomerData = (customers) => {
    const data = customers.map(customer => ({
      name: customer.name,
      quotations: Math.floor(Math.random() * 10) // Simulated quotation count
    }));
    setCustomerData(data);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/addCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to add customer');
      await fetchCustomers();
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      setError('Failed to add customer. Please try again.');
    }
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/editCustomer/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCustomer),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to edit customer');
      await fetchCustomers();
      setEditingCustomer(null);
    } catch (err) {
      setError('Failed to edit customer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Customer Management</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition duration-300 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Customer Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <form onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      id="name"
                      className="block w-full px-4 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                      value={editingCustomer ? editingCustomer.name : newCustomer.name}
                      onChange={(e) => editingCustomer 
                        ? setEditingCustomer({...editingCustomer, name: e.target.value})
                        : setNewCustomer({...newCustomer, name: e.target.value})
                      }
                      required
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full px-4 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                      value={editingCustomer ? editingCustomer.email : newCustomer.email}
                      onChange={(e) => editingCustomer
                        ? setEditingCustomer({...editingCustomer, email: e.target.value})
                        : setNewCustomer({...newCustomer, email: e.target.value})
                      }
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      className="block w-full px-4 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                      value={editingCustomer ? editingCustomer.phone : newCustomer.phone}
                      onChange={(e) => editingCustomer
                        ? setEditingCustomer({...editingCustomer, phone: e.target.value})
                        : setNewCustomer({...newCustomer, phone: e.target.value})
                      }
                      required
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      id="address"
                      rows="3"
                      className="block w-full px-4 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                      value={editingCustomer ? editingCustomer.address : newCustomer.address}
                      onChange={(e) => editingCustomer
                        ? setEditingCustomer({...editingCustomer, address: e.target.value})
                        : setNewCustomer({...newCustomer, address: e.target.value})
                      }
                      placeholder="Enter customer address"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                  >
                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                  </button>
                </form>
                {editingCustomer && (
                  <button
                    onClick={() => setEditingCustomer(null)}
                    className="mt-4 w-full inline-flex justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customer List and Graphs */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden mb-8 transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customer List</h2>
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading customers...</p>
                ) : error ? (
                  <p className="text-center text-red-600">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => setEditingCustomer(customer)}
                                className="text-indigo-600 hover:text-indigo-900 transition duration-300 ease-in-out"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Quotations Graph */}
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customer Quotations</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quotations" fill="url(#colorGradient)" />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

