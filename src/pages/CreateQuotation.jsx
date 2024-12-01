import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, IndianRupee, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateQuotation() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [quotationItems, setQuotationItems] = useState([{ productId: '', quantity: 1, price: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_BURL}/allCustomer`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BURL}/allProduct`, { credentials: 'include' })
        ]);
        console.log(`${import.meta.env.VITE_BURL}/allProduct`);
        const customersData = await customersResponse.json();
        const productsData = await productsResponse.json();

        setCustomers(customersData.customers);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load customers and products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addQuotationItem = () => {
    setQuotationItems([...quotationItems, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeQuotationItem = (index) => {
    const updatedItems = quotationItems.filter((_, i) => i !== index);
    setQuotationItems(updatedItems);
  };

  const updateQuotationItem = (index, field, value) => {
    const updatedItems = [...quotationItems];
    updatedItems[index][field] = value;
    if (field === 'productId') {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      updatedItems[index].price = selectedProduct ? selectedProduct.price : 0;
    }
    setQuotationItems(updatedItems);
  };

  const calculateTotal = () => {
    return quotationItems.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/createQuotation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer,
          items: quotationItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            productName: products.find(p => p.id === parseInt(item.productId))?.title || ''
          }))
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create quotation');
      }

      navigate('/dashboard', { state: { message: 'Quotation created successfully!' } });
    } catch (error) {
      console.error('Error creating quotation:', error);
      setError('Failed to create quotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Create Quotation
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700">Customer</label>
                  <select
                    id="customer"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {quotationItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-indigo-50 p-6 rounded-lg space-y-4 shadow-md"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700">Product</label>
                        <select
                          id={`product-${index}`}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={item.productId}
                          onChange={(e) => updateQuotationItem(index, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          id={`quantity-${index}`}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={item.quantity}
                          onChange={(e) => updateQuotationItem(index, 'quantity', parseInt(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`price-${index}`} className="block text-sm font-medium text-gray-700">Price (INR)</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IndianRupee className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id={`price-${index}`}
                            className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                            value={item.price}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuotationItem(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Remove Item
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={addQuotationItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-lg shadow-md">
                <span className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Total: ₹{calculateTotal().toFixed(2)}</span>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                        Creating...
                      </>
                    ) : (
                      'Create Quotation'
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-400 p-4 mt-4"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
