import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Edit2, IndianRupee, ArrowLeft } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [productSalesData, setProductSalesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/allProduct`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      console.log(data);
      setProducts(data);
      updateSalesData(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSalesData = (products) => {
    const salesData = products.map(product => ({
      name: product.title,
      sales: Math.floor(Math.random() * 100) // Simulated sales data
    }));
    setProductSalesData(salesData);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/addProduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to add product');
      await fetchProducts();
      setNewProduct({ title: '', price: '', description: '' });
    } catch (err) {
      setError('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/editProduct/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to edit product');
      await fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      setError('Failed to edit product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Products Management</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition duration-300 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      id="title"
                      className="block w-full px-4 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                      value={editingProduct ? editingProduct.title : newProduct.title}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, title: e.target.value})
                        : setNewProduct({...newProduct, title: e.target.value})
                      }
                      required
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (INR) *</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        className="block w-full pl-10 pr-12 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({...editingProduct, price: e.target.value})
                          : setNewProduct({...newProduct, price: e.target.value})
                        }
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      id="description"
                      rows="3"
                      className="block w-full px-4 py-3 rounded-md bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 text-sm transition duration-300 ease-in-out"
                      value={editingProduct ? editingProduct.description : newProduct.description}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({...editingProduct, description: e.target.value})
                        : setNewProduct({...newProduct, description: e.target.value})
                      }
                      placeholder="Enter product description"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </form>
                {editingProduct && (
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="mt-4 w-full inline-flex justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product List and Graphs */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden mb-8 transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product List</h2>
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading products...</p>
                ) : error ? (
                  <p className="text-center text-red-600">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (INR)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{product.description || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => setEditingProduct(product)}
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

            {/* Product Sales Graph */}
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="url(#colorGradient)" />
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

