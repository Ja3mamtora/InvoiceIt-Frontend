import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Mail, Eye, Download, ArrowLeft, Pencil, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    const filtered = quotations.filter(quotation => 
      quotation.quotationOf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.id.toString().includes(searchTerm)
    );
    setFilteredQuotations(filtered);
    setCurrentPage(1);
  }, [searchTerm, quotations]);

  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/allQuotation`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch quotations');
      const data = await response.json();
      setQuotations(data);
      setFilteredQuotations(data);
    } catch (err) {
      setError('Failed to load quotations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuotation = (quotation) => {
    navigate(`/edit-quotation/${quotation.id}`);
  };

  const handleViewQuotation = (quotation) => {
    navigate(`/view-quotation/${quotation.id}`);
  };

  const handleSendEmail = async (quotationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/sendInvoice/${quotationId}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to send email');
      alert('Quotation sent successfully!');
    } catch (err) {
      alert('Failed to send email. Please try again.');
    }
  };

  const handleDownloadPDF = (quotationId) => {
    navigate(`/view-quotation/${quotationId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalQuotations = quotations.length;
  const totalAmount = quotations.reduce((sum, quotation) => sum + quotation.grandTotal, 0);
  const averageAmount = totalQuotations > 0 ? totalAmount / totalQuotations : 0;

  const getStatusColor = (date) => {
    const daysSinceCreation = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation < 7) return 'bg-green-100 text-green-800';
    if (daysSinceCreation < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 sm:mb-0">
            Quotation Management
          </h1>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/create-quotation')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <Pencil className="mr-2 h-5 w-5" />
              Create New Quotation
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition duration-300 ease-in-out"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-lg overflow-hidden mb-8">
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Quotations</h3>
              <p className="text-3xl font-bold text-blue-600">{totalQuotations}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Amount</h3>
              <p className="text-3xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Average Amount</h3>
              <p className="text-3xl font-bold text-yellow-600">₹{averageAmount.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">This Month</h3>
              <p className="text-3xl font-bold text-purple-600">{quotations.filter(q => new Date(q.createdAt).getMonth() === new Date().getMonth()).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search quotations..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {isLoading ? (
              <div className="animate-pulse">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-16 bg-gray-200 rounded mb-4"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quotation ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((quotation) => (
                      <tr key={quotation.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{quotation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quotation.quotationOf.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{quotation.grandTotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(quotation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quotation.createdAt)}`}>
                            {new Date(quotation.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 'Recent' : 'Older'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditQuotation(quotation)}
                              className="text-indigo-600 hover:text-indigo-900 transition duration-300 ease-in-out"
                              data-tooltip-id="edit-tooltip"
                              data-tooltip-content="Edit Quotation"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleViewQuotation(quotation)}
                              className="text-green-600 hover:text-green-900 transition duration-300 ease-in-out"
                              data-tooltip-id="view-tooltip"
                              data-tooltip-content="View Quotation"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(quotation.id)}
                              className="text-blue-600 hover:text-blue-900 transition duration-300 ease-in-out"
                              data-tooltip-id="email-tooltip"
                              data-tooltip-content="Send Email"
                            >
                              <Mail className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(quotation.id)}
                              className="text-red-600 hover:text-red-900 transition duration-300 ease-in-out"
                              data-tooltip-id="download-tooltip"
                              data-tooltip-content="Download PDF"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredQuotations.length)}</span> of{' '}
                  <span className="font-medium">{filteredQuotations.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(Math.ceil(filteredQuotations.length / itemsPerPage)).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredQuotations.length / itemsPerPage)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="edit-tooltip" />
      <Tooltip id="view-tooltip" />
      <Tooltip id="email-tooltip" />
      <Tooltip id="download-tooltip" />
    </div>
  );
}

